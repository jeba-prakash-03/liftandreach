# Lift and Reach Equipments - Web Platform Rebuild

Modern, industrial-grade web portal rebuilt for **Lift and Reach Equipments** (Sriperumpudur, Chennai). Preserves 100% of the original content, specifications, and images while introducing a responsive, accessible, full-bleed design system with full database-backed CRUD, quote generation, and administrative control.

**Completely free of Docker dependencies** — runs directly on native Node.js, native local MySQL 8, and standard process managers (e.g., PM2, Systemd, or Nginx).

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, TypeScript, React Router 7, Tailwind CSS, Framer Motion, Swiper, Axios, Lucide React, React Helmet Async
- **Backend:** Node.js, Express 5, TypeScript
- **Database:** Native MySQL 8 (port 3306) with Prisma ORM
- **Security:** Helmet, CORS, Express-Rate-Limit, Zod validation, bcryptjs, HTTP-only JWT cookies
- **Notifications:** Nodemailer (SMTP) for customer quote and enquiry notifications

---

## 📂 Project Structure

```
liftandreach/
├── client/                     # Vite + React + Tailwind Frontend
│   ├── public/
│   │   ├── images/             # All original product & banner images + WebP fallbacks
│   │   ├── robots.txt          # SEO crawlers directive
│   │   └── sitemap.xml         # Full XML sitemap
│   ├── src/
│   │   ├── components/         # Header, Footer, QuoteModal, SpecTable, Gallery, etc.
│   │   ├── context/            # AppContext (Settings/Quote state), AuthContext
│   │   ├── pages/              # Home, About, Products, ProductDetail, Contact, Admin
│   │   ├── services/           # Axios API client
│   │   └── types/              # TypeScript models
│   ├── .env.example
│   └── vite.config.ts
├── server/                     # Node + Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma       # MySQL Prisma schema
│   │   └── seed.ts             # Complete database seed from crawled data
│   ├── src/
│   │   ├── controllers/        # Public, Admin, and Upload controllers
│   │   ├── middleware/         # JWT authentication middleware
│   │   ├── routes/             # Public & Admin Express routers
│   │   ├── utils/              # Prisma client, Mailer, Anti-spam Captcha
│   │   └── index.ts            # Main Express entrypoint
│   └── .env.example
├── CHECKLIST.md                # Discrepancies, flags, and crawl verification notes
└── README.md
```

---

## 🚀 Quickstart & Native Local Development (No Docker)

### Prerequisites

- Node.js 18+ (tested with Node 20)
- Native local MySQL 8 running on your system (default port 3306)

### 1. Database Setup

Create the database in your local MySQL instance:
```sql
CREATE DATABASE IF NOT EXISTS liftandreach CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup & Seeding

```bash
cd server
cp .env.example .env
# Set your local MySQL credentials in .env:
# DATABASE_URL="mysql://root:your_password@127.0.0.1:3306/liftandreach"

npm install
npx prisma db push
npx tsx prisma/seed.ts    # Populates all categories, products, slides & settings
npm run build            # Compile TypeScript to dist/
npm start                # Starts the production server on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev              # Starts development server on http://localhost:5173
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Admin Portal Access

- **URL:** `http://localhost:5173/admin`
- **Default Email:** `admin@liftandreach.in`
- **Default Password:** `Admin@LiftReach2026!` *(Configured in `server/.env`)*

**Admin Capabilities:**
- **Inquiries Inbox:** Review customer quote submissions, update progress status (`NEW`, `CONTACTED`, `CLOSED`), and export records to CSV.
- **Product Manager:** Edit specifications, codes, descriptions, and upload product images.
- **Site Settings:** Edit company phone numbers, factory address, quality policy, and emails dynamically.

---

## 🚢 Native Production Deployment (PM2 + Nginx)

1. **Build Both Frontend & Backend:**
   ```bash
   cd client && npm run build
   cd ../server && npm run build
   ```

2. **Run Backend Service via PM2:**
   ```bash
   cd server
   pm2 start dist/index.js --name "liftandreach-api"
   pm2 save
   ```

3. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name liftandreach.in www.liftandreach.in;

       # Serve built React frontend
       location / {
           root /home/jeba-prakash/Jeba/liftandreach/client/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests
       location /api/ {
           proxy_pass http://127.0.0.1:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Uploads directory
       location /uploads/ {
           proxy_pass http://127.0.0.1:5000/uploads/;
       }
   }
   ```

---

## 🔍 SEO & 301 Redirects

All legacy `.php` URLs with spaces (e.g., `/scissor%20lift%20TOWABLE%20(Multi%20Scissor)-Electric.php`, `/HYDRAULIC%20FLOOR%20CRANE%20-%20LIGHT%20DUTY.php`, `/about.php`, `/gallery.php`) are mapped in `LegacyUrlRedirect.tsx` and automatically redirected to their modern, semantic React routes.
