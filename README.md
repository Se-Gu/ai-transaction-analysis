# Transaction Analyzer

A full-stack AI-powered transaction analysis tool that normalizes merchant names and detects spending patterns using OpenAI.

## 🚀 Features
- **Merchant Normalization**: Converts raw transaction descriptions into structured merchant data.
- **Pattern Detection**: Identifies subscriptions, recurring payments, and spending trends.
- **CSV Upload**: Users can upload CSV files containing transactions.
- **Frontend**: Built with React, Next.js Tailwind CSS.
- **Backend**: NestJS, OpenAI, Redis caching.
- **Deployment**: Frontend on Netlify, Backend on Railway.

---

## 📌 Tech Stack
### **Frontend:**
- React
- Next.js
- TypeScript
- Tailwind CSS

### **Backend:**
- NestJS
- OpenAI API
- Redis for caching
- Multer for file uploads

### **Deployment:**
- Frontend: **Netlify**
- Backend: **Railway**

---

## 🔧 Installation & Setup
### **1️⃣ Backend Setup**

#### **Clone the repository:**
```sh
 git clone https://github.com/Se-Gu/ai-transaction-analysis.git
 cd ai-transaction-analysis/backend
```

#### **Install dependencies:**
```sh
npm install
```

#### **Create `.env` file in `backend/` and add:**
```sh
OPENAI_API_KEY=your_openai_api_key
REDIS_HOST=your_redis_host
REDIS_PORT=6379
```

#### **Run the backend:**
```sh
npm start
```
_Now your backend should be running on `http://localhost:5800`_

---

### **2️⃣ Frontend Setup**
#### **Navigate to frontend folder:**
```sh
cd ../frontend
```

#### **Install dependencies:**
```sh
npm install
```

#### **Create `.env` file in `frontend/` and add:**
```sh
NEXT_PUBLIC_BACKEND_URL=http://localhost:5800
```

#### **Run the frontend:**
```sh
npm run dev
```
_Now your frontend should be running on `http://localhost:3000`_

---

## 📡 API Documentation
### **Base URL:** `http://localhost:5800`

### **1️⃣ Normalize Merchants**
`POST /analyze/normalize`
#### **Request Body:**
```json
{
  "transactions": [
    { "description": "NFLX DIGITAL NTFLX US", "amount": -19.99, "date": "2024-01-01" }
  ]
}
```
#### **Response:**
```json
{
  "normalized_transactions": [
    {
      "original": "NFLX DIGITAL NTFLX US",
      "normalized": {
        "merchant": "Netflix",
        "category": "Entertainment",
        "sub_category": "Streaming Service",
        "confidence": 0.98,
        "flags": ["subscription", "digital_service"]
      }
    }
  ]
}
```

### **2️⃣ Detect Patterns**
`POST /analyze/patterns`
#### **Request Body:**
```json
{
  "transactions": [
    { "description": "NETFLIX", "amount": -19.99, "date": "2024-01-01" }
  ]
}
```
#### **Response:**
```json
{
  "patterns": [
    {
      "type": "subscription",
      "merchant": "Netflix",
      "amount": 19.99,
      "frequency": "monthly",
      "confidence": 0.98,
      "next_expected": "2024-02-15"
    }
  ]
}
```

---

## 🚀 Deployment
### **1️⃣ Deploy Backend**
Use **Railway**:
- Add **environment variables** (from `.env`).
- Deploy the backend.

### **2️⃣ Deploy Frontend**
Use **Netlify**:
- Add `NEXT_PUBLIC_BACKEND_URL=<backend_deployed_url>`.
- Deploy frontend.

---

## 🎯 To-Do / Future Enhancements
- [ ] Add user authentication
- [ ] Improve caching performance
- [ ] Implement additional AI models

## 📜 License
# Custom License

Copyright 2025 Serhat Gurgenyatagi.

Permission is hereby granted to **view and analyze** the contents of this repository for **non-commercial, educational, or research purposes only**. 

The following activities are **strictly prohibited** without prior written consent from the author:
- Reproduction or distribution of this code, in part or in whole.
- Use of this code in any form for commercial purposes.
- Modification or creation of derivative works based on this code.
- Integration or incorporation of this code into other projects, systems, or repositories.

## Disclaimer

THE CODE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE CODE OR THE USE OR OTHER DEALINGS IN THE CODE.

