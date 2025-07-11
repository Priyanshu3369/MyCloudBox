# 📦 MyCloudBox – Secure Cloud File Storage & Sharing App

MyCloudBox is a modern, secure, and beautiful full-stack cloud storage platform where users can:
- 🔐 Register/Login securely
- 📁 Upload and organize files in folders
- ✏️ Rename files before/after upload
- ☁️ Store files using Cloudinary
- 📤 Share files via secure links
- 🌑 Enjoy dark/light themes
- 🎯 Experience drag-and-drop uploads, real-time feedback, and responsive design

---

## 🚀 Features

- 🧑‍💻 **JWT Authentication**
- 📂 Folder-based File Management
- 🖼️ File Preview (images, videos, documents)
- 📤 Drag-and-Drop File Upload with Progress Bar
- 🔐 Protected Routes & Role-based Access
- 🌐 Social Auth Placeholder (Google/GitHub)
- 🌈 Modern, glassmorphic UI with Framer Motion + Tailwind
- 🌙 Dark Mode Support
- 🔒 Secure Backend (helmet, xss-clean, mongo-sanitize, rate-limiter)
- ☁️ Cloudinary File Storage
- ⚙️ Rename + Move + Delete Files
- 🔗 Copyable Shareable File Links

---

## 🛠 Tech Stack

### Frontend
- **React + Vite**
- **Tailwind CSS** + **Framer Motion**
- **Zustand** for global auth state
- **React Router**, `axios`, `react-hot-toast`, `lucide-react`

### Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT Auth + bcrypt**
- **Cloudinary SDK**
- **Multer** for file parsing

### Security Middleware
- `helmet`, `xss-clean`, `express-mongo-sanitize`, `rate-limit`, `dotenv`, `cors`

---

## 📦 Folder Structure

```

mycloudbox/
├── frontend/            # React frontend
│   └── src/
│       ├── pages/     # Dashboard, Upload, Login, Register, etc.
│       ├── components/
│       ├── context/   # AuthContext
│       ├── App.jsx
│       └── main.jsx
├── backend/            # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/         # cloudinary.js, multer.js
│   └── backend.js

```

## 🔐 .env Setup

### On Backend (`backend/.env`)
```

PORT=5000
MONGO\_URI=your\_mongodb\_connection
CLOUDINARY\_CLOUD\_NAME=your\_cloud\_name
CLOUDINARY\_API\_KEY=your\_key
CLOUDINARY\_API\_SECRET=your\_secret
frontend\_URL=[http://localhost:5173](http://localhost:5173)

````

---

## 💻 Local Development

### 1. Clone the repo
```bash
git clone https://github.com/your-username/mycloudbox.git
cd mycloudbox
````

### 2. Install backend & frontend dependencies

```bash
# In root folder
cd backend && npm install
cd ../frontend && npm install
```

### 3. Start backend & frontend

```bash
# Start backend
cd backend
nodemon backend.js

# Start frontend
cd ../frontend
npm run dev
```

---

## 🌍 Deployment

* Backend: [Render](https://render.com/)
* Frontend: [Render](https://render.com/)
* MongoDB: [MongoDB Atlas](https://cloud.mongodb.com/)
* Cloud Storage: [Cloudinary](https://cloudinary.com/)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

[MIT](LICENSE)

---

## 🧑‍💻 Developer

**Priyanshu Chourasiya**
💼 [LinkedIn](https://www.linkedin.com/in/priyanshu-chourasiya-1b54ab253/)