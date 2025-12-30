 # Pastebin-Lite

A lightweight Pastebin-like web application that allows users to create text pastes and share them via a unique URL.  
Pastes can optionally expire after a given time (TTL) or after a maximum number of views.

This project is designed to be simple, robust, and compatible with serverless deployment environments.

---

## 🚀 Live Demo

*Deployed URL:*  
https://pastebin-lite-six-xi.vercel.app/
---

## 🧩 Features

- Create a text paste with arbitrary content
- Generate a shareable URL for each paste
- View pastes via API (JSON) or browser (HTML)
- Optional constraints:
  - Time-based expiry (TTL)
  - View-count limit
- Deterministic time handling for automated testing
- Safe rendering (no script execution)

---

## 🛠 Tech Stack

- *Framework:* Next.js (App Router)
- *Language:* TypeScript
- *Database:* MongoDB (MongoDB Atlas)
- *Deployment:* Vercel

---

## 📦 Persistence Layer

This application uses *MongoDB (MongoDB Atlas)* as its persistence layer.

All pastes and their metadata (content, TTL, view counts) are stored in MongoDB to ensure data durability across requests.  
This design works correctly in serverless environments (such as Vercel), where in-memory storage is not reliable across function invocations.

No in-memory storage is used for paste persistence.

---

## 🔗 API Endpoints

### Health Check
GET /api/healthz

*Response*
```json
{ "ok": true }


Indicates the application is running and can access the database.

Create a Paste
POST /api/pastes

Request Body

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}

content (required): non-empty string
ttl_seconds (optional): integer ≥ 1
max_views (optional): integer ≥ 1

Response

{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}

Fetch a Paste (API)
GET /api/pastes/:id


Response

{
  "content": "string",
  "remaining_views": 4,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


remaining_views is null if unlimited
expires_at is null if no TTL
Each successful fetch counts as one view
Unavailable pastes return HTTP 404.

View a Paste (HTML)
GET /p/:id
Returns an HTML page displaying the paste content
Returns 404 if the paste is unavailable
Content is rendered safely (no script execution)

⏱ Deterministic Time for Testing
To support deterministic expiry testing:
If the environment variable below is set:
TEST_MODE=1
The API will use the request header:
x-test-now-ms: <milliseconds since epoch>
as the current time for expiry logic only.
If the header is absent or TEST_MODE is not enabled, real system time is used.
This behavior matches the assignment specification and supports automated grading.

🧪 Running Locally
1️⃣ Clone the repository
git clone https://github.com/shaikabzal9676/Pastebin-lite.git
cd Pastebin-lite

2️⃣ Install dependencies
npm install

3️⃣ Set environment variables
Create a .env.local file:

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/pastebin
TEST_MODE=0

4️⃣ Run the development server
npm run dev

Open:
http://localhost:3000

🧠 Design Notes

Paste IDs are generated using nanoid and stored as string _id values in MongoDB
MongoDB is used to ensure data survives across serverless requests
API routes handle all validation and constraint enforcement
HTML rendering uses server components and safely displays plain text
No global mutable state is used on the server

✅ Assignment Compliance

✔ All required routes implemented
✔ Correct HTTP status codes and JSON responses
✔ Persistence across requests
✔ Deterministic time support
✔ Safe HTML rendering
✔ Serverless-compatible design
