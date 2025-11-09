Dự án Quản lý Người dùng – CRUD (React + Node.js + MongoDB)

Phân công vai trò:
• Lương Bảo Huy: Backend (Node.js + Express)
• Phạm Nhật Huy: Frontend (React)
• Lê Văn Hậu: Database (MongoDB)
📌 Giới thiệu
Hệ thống mô phỏng chức năng quản lý người dùng (CRUD) gồm các tính năng:

-Create: Thêm người dùng mới.
-Read: Hiển thị danh sách người dùng từ MongoDB.
-Update: Chỉnh sửa thông tin người dùng.
-Delete: Xóa người dùng khỏi cơ sở dữ liệu.

⚙️ Công nghệ sử dụng
.Frontend	React, Axios, HTML5, CSS3
.Backend	Node.js, Express.js
.Database	MongoDB Atlas (Mongoose ODM)
.Quản lý mã nguồn	Git, GitHub (branch, merge, conflict, squash)
.IDE	Visual Studio Code
.Công cụ hỗ trợ	npm, dotenv, cors

🏗️ Cấu trúc dự án
GroupProject/
│

├── backend/               # Server Node.js + Express + MongoDB

│   ├── server.js

│   ├── routes/

│   │   └── user.js

│   ├── controllers/

│   │   └── userController.js

│   ├── models/

│   │   └── User.js

│   └── .env

│

├── frontend/              # Ứng dụng React

│   ├── src/

│   │   ├── App.js

│   │   ├── AddUser.jsx

│   │   ├── UserList.jsx

│   │   └── api.js

│   └── .env

│

├── README.md

└── .gitignore



🚀 Hướng dẫn chạy dự án

🔹 Backend
Mở terminal:
npm install
node server.js

🔹 Frontend
Mở terminal mới:
npm start

🧾 Quy trình làm việc nhóm (Git Workflow)
-Mỗi thành viên làm việc trên nhánh riêng (backend, frontend, database).
-Dùng Pull Request (PR) để merge vào  main.
-Giải quyết conflict, squash commit trước khi merge.
-Review chéo code giữa các thành viên.
