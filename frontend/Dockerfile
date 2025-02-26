# frontend/Dockerfile

# ------------------------------------------------------
# Stage 1: Build the Next.js app
# ------------------------------------------------------
FROM node:18-alpine AS builder

# ตั้งค่าตัวแปร environment
ENV NODE_ENV=production

# สร้างโฟลเดอร์สำหรับแอปพลิเคชัน
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกซอร์สโค้ดทั้งหมดไปยัง container
COPY . .

# สร้างไฟล์ build สำหรับ Next.js
RUN npm run build

# ------------------------------------------------------
# Stage 2: Run the Next.js app with Node.js
# ------------------------------------------------------
FROM node:18-alpine AS runner

# ตั้งค่า environment เป็น production
ENV NODE_ENV=production

WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นจาก builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# เปิดพอร์ต 3000 (ค่า default ของ Next.js)
EXPOSE 3000

# รันเซิร์ฟเวอร์ Next.js
CMD ["npm", "run", "start"]
