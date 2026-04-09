# Food Chatbot AI

Ứng dụng web chatbot tư vấn món ăn bằng tiếng Việt, gồm giao diện người dùng React và API Node.js/Express. Người dùng có thể đăng ký, đăng nhập, trò chuyện với chatbot AI và xem hoặc xóa lịch sử chat.

## Tính năng chính

- Đăng ký, đăng nhập bằng JWT
- Chatbot tư vấn món ăn, thực đơn và nguyên liệu
- Lưu lịch sử chat theo từng người dùng
- Xóa lịch sử chat
- Tách riêng frontend và backend để dễ deploy

## Công nghệ sử dụng

### Frontend
- React 18
- Vite
- React Router
- React Markdown

### Backend
- Node.js
- Express
- JWT Authentication
- bcryptjs
- Google Gemini API
- Lưu dữ liệu local bằng file JSON

## Cấu trúc thư mục

```bash
food-chatbot-project/
├── frontend/
├── backend/
├── .gitignore
└── README.md
```

## Yêu cầu trước khi chạy

- Node.js 18 trở lên
- npm 9 trở lên
- 1 Gemini API key hợp lệ

## Cách chạy ở máy local

### 1. Chạy backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Mẫu file `backend/.env`:

```env
PORT=5001
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

Backend mặc định chạy tại:

```text
http://localhost:5001
```

### 2. Chạy frontend

Mở terminal khác:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Mẫu file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

## Luồng sử dụng

1. Người dùng đăng ký tài khoản
2. Người dùng đăng nhập
3. Sau khi xác thực thành công, người dùng vào trang chat
4. Frontend gửi câu hỏi tới backend
5. Backend gọi Gemini API để tạo phản hồi
6. Lịch sử chat được lưu vào `backend/db/data.json`

## Biến môi trường

### Backend

| Tên biến | Mô tả |
|---|---|
| `PORT` | Cổng chạy backend |
| `JWT_SECRET` | Khóa ký JWT |
| `GEMINI_API_KEY` | API key của Google Gemini |
| `CLIENT_URL` | URL frontend được phép gọi API |

### Frontend

| Tên biến | Mô tả |
|---|---|
| `VITE_API_URL` | URL backend để frontend gọi API |

## Đưa project lên GitHub

Trước khi push, cần bảo đảm:

- Không commit `node_modules`
- Không commit file `.env`
- Không commit thư mục `.git` cũ bên trong file nén
- Không commit dữ liệu thật trong `backend/db/data.json`

Các lệnh cơ bản:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/food-chatbot-ai.git
git push -u origin main
```

## Deploy đề xuất

### Phương án đơn giản
- Frontend: Vercel
- Backend: Render

### Deploy backend lên Render

- Tạo Web Service từ repo GitHub
- Root Directory: `backend`
- Build Command:

```bash
npm install
```

- Start Command:

```bash
npm start
```

- Environment Variables:
  - `PORT=5001`
  - `JWT_SECRET=...`
  - `GEMINI_API_KEY=...`
  - `CLIENT_URL=https://your-frontend-domain.vercel.app`

### Deploy frontend lên Vercel

- Import repo GitHub vào Vercel
- Root Directory: `frontend`
- Build Command:

```bash
npm run build
```

- Output Directory:

```bash
dist
```

- Environment Variable:

```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

## Lưu ý quan trọng khi deploy

Project hiện lưu dữ liệu bằng file JSON cục bộ. Cách này phù hợp để demo hoặc học tập, nhưng không lý tưởng cho production vì dữ liệu có thể bị mất khi dịch vụ khởi động lại hoặc redeploy.

Nếu muốn chạy ổn định lâu dài, nên chuyển sang một cơ sở dữ liệu thật như:

- PostgreSQL
- MySQL
- MongoDB Atlas
- Supabase

## Checklist trước khi nộp hoặc demo

- [ ] Đã tạo `backend/.env`
- [ ] Đã tạo `frontend/.env`
- [ ] Đã thêm Gemini API key
- [ ] Backend chạy được
- [ ] Frontend gọi đúng `VITE_API_URL`
- [ ] Đăng ký và đăng nhập hoạt động
- [ ] Chatbot phản hồi bình thường
- [ ] Lịch sử chat hiển thị đúng
- [ ] Đã xóa `node_modules` trước khi push GitHub
- [ ] Đã ẩn toàn bộ thông tin bí mật

## Gợi ý mở rộng sau này

- Thêm đăng xuất tự động khi token hết hạn
- Thêm loading state đẹp hơn
- Thêm phân loại câu hỏi theo bữa sáng, trưa, tối
- Thêm gợi ý thực đơn theo ngân sách
- Chuyển dữ liệu từ JSON sang database thật

