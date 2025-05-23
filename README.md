# Creator Dashboard 🚀

A full-stack web application for creators to manage and interact with content feeds, earn credits through engagement, and view saved posts and recent activity.

## 🌐 Live Site

[https://creator-dashboard-2d176.web.app/login](https://creator-dashboard-2d176.web.app/login)

--- 

## 📦 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **Deployment**: 
  - Backend: Render
  - Frontend: Firebase Hosting

--- 

## 🧩 Features

- 🔐 User authentication (JWT)
- 📝 Daily login, profile completion, and post interaction rewards (credits system)
- 📥 Save & report feeds
- 📊 Dashboard showing credits, saved feeds, and recent activity
- 💡 Clean UI using Tailwind CSS

---

## 🛠️ Getting Started Locally

### 1. Clone the Repository

git clone https://github.com/your-username/Creator-dashboard.git

cd Creator-dashboard

Backend Setup (/server folder

cd server

npm install

Create a .env file inside the server folder with:

PORT=5000

MONGO_URI=mongodb+srv://debbhai465:Deb12345@cluster2.wxauxc3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2

JWT_SECRET=HPcjR9hYoq

CORS_ALLOWED_ORIGINS=http://localhost:3000

Frontend Setup (/client folder)
 
cd ../client

npm install

npm start

Ensure client/package.json includes the following proxy to connect to backend:

"proxy": "http://localhost:5000"
Visit: http://localhost:3000

⚙️ Scripts

Frontend

npm start       # Run React dev server

npm run build   # Create production build

Backend

npm start       # Run Express server

🚀 Deployment

Frontend deployed on Firebase: https://creator-dashboard-2d176.web.app

Backend deployed on Render or another backend platform

📸 Screenshots
![ss](https://github.com/user-attachments/assets/bdf1c85b-4732-4eaa-8be3-0d0c21150542)

Author
Debojyoti Halder

GitHub: @Debojyoti2022
