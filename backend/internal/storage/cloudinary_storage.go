package storage

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

// CloudinaryStorage ใช้ Cloudinary API
type CloudinaryStorage struct {
	CloudName string
	APIKey    string
	APISecret string
	UploadURL string
	DeleteURL string
}

// NewCloudinaryStorage คืนค่า instance ใหม่
func NewCloudinaryStorage() *CloudinaryStorage {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	fmt.Printf("Cloudinary Config:\nCloud Name: %s\nAPI Key: %s\n", cloudName, apiKey)

	return &CloudinaryStorage{
		CloudName: cloudName,
		APIKey:    apiKey,
		APISecret: apiSecret,
		UploadURL: fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName),
		DeleteURL: fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/destroy", cloudName),
	}
}

// UploadFile อัปโหลดไฟล์ไป Cloudinary
func (c *CloudinaryStorage) UploadFile(file io.Reader, fileName string) (string, error) {
	log.Printf("[CloudinaryStorage][UploadFile] Received request to upload file: %s", fileName)

	//  ตรวจสอบค่า Upload Preset
	uploadPreset := os.Getenv("CLOUDINARY_UPLOAD_PRESET")
	if uploadPreset == "" {
		log.Println("[CloudinaryStorage][UploadFile] Error: Missing Cloudinary upload preset")
		return "", fmt.Errorf("missing Cloudinary upload preset")
	}

	//  สร้าง HTTP Request Body
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	encodedFileName := url.PathEscape(fileName)
	part, err := writer.CreateFormFile("file", encodedFileName)
	if err != nil {
		log.Printf("[CloudinaryStorage][UploadFile] Error: Failed to create form file: %v", err)
		return "", fmt.Errorf("failed to create form file: %v", err)
	}
	_, err = io.Copy(part, file)
	if err != nil {
		log.Printf("[CloudinaryStorage][UploadFile] Error: Failed to copy file data: %v", err)
		return "", fmt.Errorf("failed to copy file data: %v", err)
	}

	_ = writer.WriteField("upload_preset", uploadPreset)
	_ = writer.WriteField("cloud_name", c.CloudName)
	_ = writer.WriteField("api_key", c.APIKey)
	writer.Close()

	//  ส่ง Request ไปยัง Cloudinary
	log.Printf("[CloudinaryStorage][UploadFile] Sending request to Cloudinary: %s", c.UploadURL)
	req, err := http.NewRequest("POST", c.UploadURL, body)
	if err != nil {
		log.Printf("[CloudinaryStorage][UploadFile] Error: Failed to create HTTP request: %v", err)
		return "", fmt.Errorf("failed to create HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[CloudinaryStorage][UploadFile] Error: Failed to send request to Cloudinary: %v", err)
		return "", fmt.Errorf("failed to send request to Cloudinary: %v", err)
	}
	defer resp.Body.Close()

	//  ตรวจสอบ HTTP Status Code
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("[CloudinaryStorage][UploadFile] Error: Cloudinary upload failed, Status: %d, Response: %s", resp.StatusCode, string(bodyBytes))
		return "", fmt.Errorf("Cloudinary upload failed: %s", string(bodyBytes))
	}

	//  แปลง JSON Response
	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("[CloudinaryStorage][UploadFile] Error: Failed to parse Cloudinary response: %v", err)
		return "", fmt.Errorf("failed to parse Cloudinary response: %v", err)
	}

	//  ดึง `secure_url` จาก Response
	secureURL, ok := result["secure_url"].(string)
	if !ok || secureURL == "" {
		log.Println("[CloudinaryStorage][UploadFile] Error: Failed to get Cloudinary URL from response")
		return "", fmt.Errorf("failed to get Cloudinary URL from response")
	}

	log.Printf("[CloudinaryStorage][UploadFile] File uploaded successfully: %s", secureURL)
	return secureURL, nil
}

func extractPublicID(fileURL, cloudName string) (string, error) {
	log.Printf("[CloudinaryStorage][extractPublicID] Extracting public_id from fileURL: %s", fileURL)

	//  ตรวจสอบ prefix ของ URL
	prefix := fmt.Sprintf("https://res.cloudinary.com/%s/image/upload/", cloudName)
	if !strings.HasPrefix(fileURL, prefix) {
		log.Printf("[CloudinaryStorage][extractPublicID] Error: fileURL does not have expected prefix. Expected prefix: %s", prefix)
		return "", fmt.Errorf("fileURL does not have expected prefix")
	}

	//  ตัด prefix ออกจาก URL
	remainder := fileURL[len(prefix):]
	parts := strings.SplitN(remainder, "/", 2)
	if len(parts) < 2 {
		log.Printf("[CloudinaryStorage][extractPublicID] Error: Unexpected fileURL format for URL: %s", fileURL)
		return "", fmt.Errorf("unexpected fileURL format")
	}

	publicWithExt := parts[1]
	dotIndex := strings.LastIndex(publicWithExt, ".")
	if dotIndex == -1 {
		log.Printf("[CloudinaryStorage][extractPublicID] Extracted public_id (no extension found): %s", publicWithExt)
		return publicWithExt, nil
	}

	publicID := publicWithExt[:dotIndex]
	log.Printf("[CloudinaryStorage][extractPublicID] Extracted public_id: %s", publicID)
	return publicID, nil
}

// DeleteFile ลบไฟล์จาก Cloudinary โดยใช้ public_id
func (c *CloudinaryStorage) DeleteFile(fileURL string) error {
	log.Printf("[CloudinaryStorage][DeleteFile] Received request to delete file: %s", fileURL)

	//  สกัด public_id
	publicID, err := extractPublicID(fileURL, c.CloudName)
	if err != nil {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Failed to extract public_id from fileURL: %s, Error: %v", fileURL, err)
		return fmt.Errorf("failed to extract public_id: %v", err)
	}
	log.Printf("[CloudinaryStorage][DeleteFile] Extracted public_id: %s", publicID)

	timestamp := strconv.FormatInt(time.Now().Unix(), 10)
	signStr := fmt.Sprintf("public_id=%s&timestamp=%s%s", publicID, timestamp, c.APISecret)

	hasher := sha1.New()
	hasher.Write([]byte(signStr))
	signature := hex.EncodeToString(hasher.Sum(nil))

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	_ = writer.WriteField("public_id", publicID)
	_ = writer.WriteField("timestamp", timestamp)
	_ = writer.WriteField("api_key", c.APIKey)
	_ = writer.WriteField("signature", signature)
	writer.Close()

	//  ส่ง Request ไปยัง Cloudinary
	log.Printf("[CloudinaryStorage][DeleteFile] Sending delete request to Cloudinary: %s", c.DeleteURL)
	req, err := http.NewRequest("POST", c.DeleteURL, body)
	if err != nil {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Failed to create HTTP request: %v", err)
		return fmt.Errorf("failed to create HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Failed to send request to Cloudinary: %v", err)
		return fmt.Errorf("failed to send request to Cloudinary: %v", err)
	}
	defer resp.Body.Close()

	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Failed to read response: %v", err)
		return fmt.Errorf("failed to read response: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Cloudinary deletion failed, Status: %d, Response: %s", resp.StatusCode, string(responseBody))
		return fmt.Errorf("Cloudinary deletion failed: %s", string(responseBody))
	}

	var result map[string]interface{}
	if err := json.Unmarshal(responseBody, &result); err != nil {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Failed to parse Cloudinary response: %v", err)
		return fmt.Errorf("failed to parse Cloudinary response: %v", err)
	}
	if res, ok := result["result"].(string); !ok || res != "ok" {
		log.Printf("[CloudinaryStorage][DeleteFile] Error: Cloudinary deletion failed: %v", result)
		return fmt.Errorf("Cloudinary deletion failed: %v", result)
	}

	log.Printf("[CloudinaryStorage][DeleteFile] File deleted successfully: %s", fileURL)
	return nil
}