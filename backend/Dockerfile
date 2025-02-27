# backend/Dockerfile

# เลือกใช้ official Go image เป็นขั้นตอนแรก
FROM golang:1.23.4-alpine AS builder

# ตั้งค่าตัวแปร environment
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# สร้างโฟลเดอร์สำหรับแอปพลิเคชัน
WORKDIR /app

# คัดลอกไฟล์ go.mod และ go.sum ไปยัง container
COPY go.mod go.sum ./

# ติดตั้ง dependencies
RUN go mod download

# คัดลอกซอร์สโค้ดทั้งหมดไปยัง container
COPY . .

# สร้าง executable
RUN go build -o backend cmd/main.go

# ใช้ image ขนาดเล็กสำหรับรันแอปพลิเคชัน
FROM alpine:3.18


# ติดตั้ง CA certificates
RUN apk --no-cache add ca-certificates bash

# สร้างโฟลเดอร์สำหรับแอปพลิเคชัน
WORKDIR /root/

# คัดลอกไฟล์จาก Builder Stage
COPY --from=builder /app/backend .

# คัดลอกไฟล์ .env เข้าไปใน Container
COPY .env .env

# เปิดพอร์ตที่ต้องการ
EXPOSE 8080

# รันแอปพลิเคชันโดยใช้ .env
CMD ["sh", "-c", "export $(grep -v '^#' .env | xargs) && ./backend"]