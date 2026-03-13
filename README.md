# ZenStore - Premium MERN E-Commerce

A modern, high-performance e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring OTP authentication, real-time analytics, and secure Stripe payments.

## 🚀 Key Features

- **OTP Authentication**: Secure login via email verification codes powered by NodeMailer.
- **Admin Dashboard**: Real-time sales analytics, inventory management, and user control.
- **Stripe Integration**: Secure checkout process with Stripe Elements (Test Mode).
- **Premium UI/UX**: Built with React, Tailwind CSS, and Framer Motion for smooth animations.
- **Real-time Updates**: Socket.io integration for instant notifications.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Lucide React, Axios, Recharts.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io, NodeMailer, Stripe API.
- **Cloud**: Cloudinary for image management.

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Stripe account (for API keys)
- Gmail account (for OTP delivery)

### 2. Environment Configuration

#### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
JWT_SECRET=your_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Frontend (`/frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Installation
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install --legacy-peer-deps
```

### 4. Running the Application
```bash
# Start Backend (Port 5000)
cd backend
npm run dev

# Start Frontend (Port 5173)
cd frontend
npm run dev
```

## 🔐 Admin Access
To promote a user to admin:
1. The user must first log in to create their account in the DB.
2. Run the following command in the `backend` directory:
   ```bash
   node makeAdmin.js user@email.com
   ```

## 💳 Payment (Test Mode)
Use Stripe test card numbers (e.g., `4242 4242 4242 4242`) for testing.

---
*Created by Antigravity AI for ZenStore.*
