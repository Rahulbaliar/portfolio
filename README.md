# Rahul Portfolio — React + Node.js + MongoDB

A full-stack developer portfolio with a dedicated Home page, 6 themes, custom cursor trail, particle canvas background, and a MongoDB-powered contact form.

## Tech Stack
| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, CSS Variables             |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB (Mongoose)                  |
| Email     | Nodemailer (Gmail)                  |
| Fonts     | Clash Display, Cabinet Grotesk, Fira Code |

## Project Structure
```
rahul-portfolio-react/
├── client/                 ← React frontend
│   ├── public/index.html
│   └── src/
│       ├── App.jsx         ← All pages & components
│       ├── index.css       ← 6 themes + all styles
│       └── index.js
├── server/
│   ├── index.js            ← Express + MongoDB API
│   ├── .env.example        ← Copy to .env
│   └── package.json
└── package.json            ← Root (concurrently)
```

## Quick Start

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Set up environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and Gmail credentials
```

### 3. Run development server
```bash
# From root directory — starts both client (port 3000) and server (port 5000)
npm run dev
```

Open http://localhost:3000

## MongoDB Setup

### Local MongoDB
```
MONGO_URI=mongodb://localhost:27017/rahul_portfolio
```

### MongoDB Atlas (recommended for production)
1. Create a free cluster at https://cloud.mongodb.com
2. Get your connection string
3. Set `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rahul_portfolio`

## Gmail Setup (for contact form emails)
1. Enable 2-factor authentication in your Google account
2. Go to: Google Account → Security → App Passwords
3. Create an app password for "Mail"
4. Use that password in .env as `EMAIL_PASS`

## Customise

### Replace your photo
In `App.jsx`, find the `<div className="avatar-circle">` section and replace the `<svg>` with:
```jsx
<img src="/your-photo.jpg" alt="Rahul"
  style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
```
Place your photo in `client/public/`.

### Update project live links
In `App.jsx`, update `live:` in the `PROJECTS` array with your deployed URLs.

### Add more projects
Add entries to the `PROJECTS` array in `App.jsx`.

## Build for Production
```bash
cd client && npm run build
```
Then serve the `client/build` folder with your Node server or a static host like Vercel/Netlify.

## API Endpoints
| Method | Endpoint      | Description           |
|--------|---------------|-----------------------|
| GET    | /api/health   | Server health check   |
| POST   | /api/contact  | Save contact message  |
| GET    | /api/contact  | List all messages     |
