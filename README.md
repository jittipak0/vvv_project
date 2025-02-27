# Vital Village Vitality

โครงการ **Vital Village Vitality** เป็นระบบการประเมินสุขภาพชุมชนที่ช่วยให้นักศึกษาพยาบาลและผู้ใช้งานสามารถเรียนรู้การวิเคราะห์และประเมินข้อมูลด้านสุขภาพชุมชน โดยใช้ **Next.js (Frontend)** และ **Golang (Backend)** พร้อมกับ **PostgreSQL (Database)** สำหรับจัดเก็บข้อมูล รองรับการรันผ่าน **Docker Compose** เพื่อความสะดวกในการติดตั้งและใช้งาน

## 🔧 เทคโนโลยีที่ใช้

- **Frontend** : Next.js (SSR)
- **Backend** : Golang (Gin Framework)
- **Database** : PostgreSQL
- **Containerization** : Docker & Docker Compose

## 🛠 การติดตั้งและใช้งาน (Installation & Usage)

### **Prerequisites**

คุณต้องติดตั้ง **Docker** และ **Docker Compose** บนเครื่องของคุณก่อน:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### **รันโปรเจคด้วย Docker Compose**

ใช้คำสั่งต่อไปนี้เพื่อติดตั้งและรันระบบทั้งหมดผ่าน Docker Compose:

```bash
docker-compose up -d --build
```

- `-d` ทำให้ Container รันเป็น Background
- `--build` สร้าง Container ใหม่ (ถ้ามีการเปลี่ยนแปลงโค้ด)

### **การเข้าถึงระบบ**

- **Frontend** : เปิดเบราว์เซอร์และไปที่ **[http://localhost:3000](http://localhost:3000/)**
- **Backend API** : API จะรันที่ **[http://localhost:8080](http://localhost:8080/)**

---

## 🔑 Environment Variables (ตัวแปรที่ต้องตั้งค่า)

**Backend & Database**
| Variable | Default | Description |
| ----------------- | -------------- | ------------------------------------------------------------------------ |
| `DB_USER` | (none) | ชื่อผู้ใช้ของ PostgreSQL |
| `DB_PASSWORD` | (none) | รหัสผ่านของ PostgreSQL |
| `DB_NAME` | (none) | ชื่อ Database ที่ใช้ |
| `DB_PORT` | `5432` | พอร์ตของ PostgreSQL |
| `DB_HOST` | `db` | Host ของ Database (ใช้`db`เพราะอยู่ใน Docker Network) |
| `JWT_SECRET` | (none) | Secret Key สำหรับเข้ารหัส JWT |
| `PORT` | `8080` | พอร์ตของ Backend |
| `ALLOW_ORIGINS` | (none) | รายการ Origin ที่อนุญาตสำหรับ CORS (Production) |
| `ENV` | `production` | ระบุว่าเป็น production หรือ development |

**Frontend**
| Variable | Default | Description |
| --------------- | ------------ | ----------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | (none) | Backend domain |

---

## 🚀 คำสั่งที่มีประโยชน์

### **ตรวจสอบ Container ที่รันอยู่**

```bash
docker ps
```

### **หยุดและลบ Container**

```bash
docker-compose down
```

### **ดู Log ของ Backend หรือ Frontend**

```bash
docker logs -f vvv_project-backend-1
```

หรือ

```bash
docker logs -f vvv_project-frontend-1
```

### **อัปเดตโค้ดและรันใหม่**

```bash
git pull origin main
docker-compose up -d --build
```

---

## 🏗 โครงสร้างของโปรเจค (Project Structure)

```plaintext
vvv_project/
│── backend/
│   ├── cmd/
│   │   ├── main.go
│   ├── config/
│   │   ├── cors.go
│   │   ├── env.go
│   ├── internal/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── content/
│   │   ├── db/
│   │   ├── routers/
│   │   ├── storage/
│   │   ├── test/
│   ├── pkg/utils/
│   │   ├── jwt.go
│   ├── .env
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│
│── frontend/
│   │── public/
│   │── src/
│   │   ├── app/
│   │   │   ├── about/
│   │   │   ├── admin/
│   │   │   ├── certificate/
│   │   │   ├── learning/
│   │   │   ├── login/
│   │   │   ├── review/
│   │   │   ├── sign-up/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── middleware/
│   │   ├── services/
│   │   │   ├── endpoint/
│   │   │   ├── authService.ts
│   │   │   └── axiosConfig.tsx
│   │   ├── styles/
│   │   ├── types/
│   │   ├── utils/
│   │── .env
│   │── Dockerfile
│   │── README.md
│
│── .env
│── docker-compose.yml         # คำสั่งรันทั้งหมดผ่าน Docker Compose
│── README.md
```

---

## 📩 ติดต่อ

หากคุณมีข้อสงสัยหรือปัญหา สามารถติดต่อผู้พัฒนาได้ที่:

- Email: jittipak.p@kkumail.com

---

🎉 **ขอบคุณที่ใช้งาน Vital Village Vitality!**
