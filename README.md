🧭 Dự án Quản lý Người dùng – CRUD (React + Node.js + MongoDB)

📌 Giới thiệu



Dự án được xây dựng trong khuôn khổ học phần Phát triển phần mềm nguồn mở.

Hệ thống mô phỏng chức năng quản lý người dùng (CRUD) gồm các tính năng:



Create: Thêm người dùng mới.



Read: Hiển thị danh sách người dùng từ MongoDB.



Update: Chỉnh sửa thông tin người dùng.



Delete: Xóa người dùng khỏi cơ sở dữ liệu.



Mục tiêu: rèn luyện kỹ năng làm việc nhóm với Git/GitHub, sử dụng Node.js, Express, React, và MongoDB Atlas.



⚙️ Công nghệ sử dụng

Thành phần	Công nghệ

Frontend	React, Axios, HTML5, CSS3

Backend	Node.js, Express.js

Database	MongoDB Atlas (Mongoose ODM)

Quản lý mã nguồn	Git, GitHub (branch, merge, conflict, squash)

IDE	Visual Studio Code

Công cụ hỗ trợ	npm, dotenv, cors

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



cd backend

npm install





Tạo file .env trong thư mục backend/:



PORT=3001

MONGO\_URI=<chuỗi kết nối MongoDB Atlas>





Chạy server:



node server.js





Mở trình duyệt: http://localhost:3001/users



🔹 Frontend



Mở terminal mới:



cd frontend

npm install





Tạo file .env trong thư mục frontend/:



REACT\_APP\_API=http://localhost:3001





Chạy ứng dụng:



npm start





Mở trình duyệt: http://localhost:3000



🧑‍💻 Các chức năng chính

Chức năng	HTTP Method	Mô tả

Lấy danh sách người dùng	GET /users	Trả về danh sách từ MongoDB

Thêm người dùng	POST /users	Thêm user mới

Cập nhật thông tin	PUT /users/:id	Sửa thông tin user

Xóa người dùng	DELETE /users/:id	Xóa user theo ID

🧠 Kinh nghiệm đạt được



Hiểu rõ luồng làm việc nhóm với Git/GitHub: branch, merge, conflict, pull request, squash.



Biết tách frontend/backend trong một repo.



Làm quen với RESTful API và Axios trong React.



Kết nối ứng dụng Node.js với MongoDB Atlas bằng Mongoose.



Áp dụng validation và state management trong React.



🧾 Quy trình làm việc nhóm (Git Workflow)



Mỗi thành viên làm việc trên nhánh riêng (backend, frontend, database).



Dùng Pull Request (PR) để merge vào  main.



Giải quyết conflict, squash commit trước khi merge.



Review chéo code giữa các thành viên.

