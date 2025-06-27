
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
- 📚 `GET /api/articles/recommended` endpoint for personalized article suggestions

### Example request

Fetch a list of up to 5 recommended articles for the authenticated user:

```bash
curl -H "Authorization: Token <jwt>" \
  http://localhost:3000/api/articles/recommended?limit=5
```

### Example response

```json
{
  "articles": [
    {
      "slug": "how-to-train-your-dragon",
      "title": "How to train your dragon",
      "description": "Ever wonder how?",
      "body": "You have to believe",
      "tagList": ["dragons", "training"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "favorited": false,
      "favoritesCount": 0,
      "author": {
        "username": "jake",
        "bio": "",
        "image": null,
        "following": false
      }
    }
  ],
  "articlesCount": 1
}
```
---

## 🗂 Project Structure

```
RealWorld-NodeAPI/
├── server.js            # Application entry point
├── config/              # JWT / DB config
│   ├── app.js           # Express configuration
│   └── ...
├── routes/              # Express route controllers
├── models/              # Mongoose schemas
├── tests/               # Postman tests
├── package.json
```

---

## ⚙️ Setup & Run

### Requirements

- Node.js ≥ 18
- MongoDB (local or Docker)
- Postman (optional for testing)

### Installation

```bash
git clone https://github.com/Adityarajsingh2904/RealWorld-NodeAPI.git
cd RealWorld-NodeAPI
cp .env.example .env # create your environment file
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
npm install -g newman
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
