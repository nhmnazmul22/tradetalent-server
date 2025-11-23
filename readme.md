# 🧠 TradeTalent Backend

TradeTalent Backend is a lightweight freelancing marketplace server built with **Node.js + Express + MongoDB**.
It provides backend APIs for:

- Users (Buyer & Seller)
- Seller Profile Management
- Services / Gigs
- Orders System
- Authentication with Token Verification

---

## 🚀 Features

- User creation with role assignment (Buyer/Seller)
- Seller management APIs
- Create & manage services (like Fiverr)
- Simple orders workflow (placing, viewing, status updates)
- Firebase authentication middleware
- Simple, clean and scalable project structure

---

## 🧰 Tech Stack

| Technology     | Use                   |
| -------------- | --------------------- |
| Node.js        | Backend runtime       |
| Express.js     | HTTP server framework |
| MongoDB        | Database              |
| Firebase Admin | Authentication        |
| Nodemon        | Dev hot reload        |

---

## 📁 Project Folder Structure

```
project/
│
├── controllers/
│   ├── OrderController.js
│   ├── SellerProfileController.js
│   ├── ServiceController.js
│   └── UsersController.js
│
├── lib/
│   └── until.js
│
├── middlewares/
│   └── tokenVerify.js
│
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

---

## 🧑‍💻 API Modules

### 🔹 Users

- Create user
- Get user
- Update user
- Delete user
- Assign roles (buyer/seller)

### 🔹 Seller

- Get sellers
- Get single seller
- Update seller profile

### 🔹 Services

- Create service
- Get all services
- Get single service
- Update service
- Delete service

### 🔹 Orders

- Create order
- Get all orders
- Get order details
- Update order status
- Delete / cancel order

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```
PORT=5000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

---

## ▶️ Installation & Run

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start the development server

```bash
npm run dev
```

_or production mode_

```bash
npm start
```

---

## 📦 Database

Uses **MongoDB Native Driver**, not Mongoose.
Database operations are simple and clean using:

```js
db.collection("users").insertOne(...)
```

---

## ❤️ Support

If you like this project, consider:

- 🐛 Reporting issues
- 🔥 Suggesting improvements

Happy coding!

**Nhm Nazmul**
