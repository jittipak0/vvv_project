package storage

import (
	"io"
)

// StorageService เป็น Interface สำหรับจัดการ Cloud Storage
type StorageService interface {
	UploadFile(file io.Reader, fileName string) (string, error) // อัปโหลดไฟล์และคืนค่า URL
	DeleteFile(fileURL string) error                            // ลบไฟล์
}
