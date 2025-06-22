
# 🌐 RealWorld-NodeAPI – A Medium Clone Backend using Node.js + Express

**RealWorld-NodeAPI** is a backend implementation of the RealWorld spec using **Node.js**, **Express**, and **MongoDB**.  
It supports fully functional APIs for articles, users, comments, profiles, and authentication — just like Medium.

This fork is restructured, refined, and maintained by Aditya Raj Singh.

---

## 🚀 Features

- 🔐 JWT-based Authentication
- 👤 User Profile & Follow System
- 📝 CRUD for Articles (with slugs, tags)
- 💬 Comments & Favoriting
- 🧪 Postman-based Test Suite
- 🐳 Docker Support for MongoDB

---

## 🗂 Project Structure

```
RealWorld-NodeAPI/
├── app.js               # Main Express app
├── routes/              # Express route controllers
├── models/              # Mongoose schemas
├── config/              # JWT / DB config
├── tests/               # Postman tests
├── .travis.yml
├── package.json
```

---

## ⚙️ Setup & Run

### Requirements

- Node.js ≥ 14
- MongoDB (local or Docker)
- Postman (optional for testing)

### Installation

```bash
git clone https://github.com/Adityarajsingh2904/RealWorld-NodeAPI.git
cd RealWorld-NodeAPI
npm install
npm run dev
```

### MongoDB with Docker

```bash
npm run mongo:start
```

---

## 📮 API Testing

```bash
npm test
```

---

## 👤 Maintainer

**Aditya Raj Singh**  
📧 thisis.adityarajsingh@gmail.com  
🔗 [GitHub](https://github.com/Adityarajsingh2904)

---

## 📜 License

Licensed under the **ISC License**.
