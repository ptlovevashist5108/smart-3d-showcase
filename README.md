# Kavita's Slimming Point — 3D Service Showcase (Full Stack)

A production-style full-stack website for Kavita's Slimming Point (Sector 16 Road, Faridabad) with a real-time 3D services showcase, contact form, and a "Visit Us" section with address, phone and map.

- **Frontend:** React + Vite + Three.js (via `@react-three/fiber` & `drei`) + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + MySQL, JWT auth for admin
- **Features:** Home page with 3D hero, product grid (3D rendered), contact form → saved to DB, admin login + dashboard to add/edit/delete products and view contact leads.

---

## 1. Prerequisites

- Node.js v18+ installed
- MySQL installed and running

---

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your real MySQL password:
```
DB_PASSWORD=your_mysql_password
JWT_SECRET=any_long_random_string
```

Create the database and tables:
```bash
mysql -u root -p < schema.sql
```

Start the backend:
```bash
npm run dev
```
Backend runs at **http://localhost:5000**. Visit `http://localhost:5000/` — you should see `{"status":"ok", ...}`.

### Create your admin account
The register route is intentionally not exposed on the site (so random people can't sign up as admin). Create your first admin using curl or Postman, once:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Love","email":"you@example.com","password":"yourpassword"}'
```

Then log in from the website's **Admin Login** page using that email/password.

---

## 3. Frontend Setup

Open a **new terminal**:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend runs at **http://localhost:5173**.

Make sure the backend is running first — the homepage and Products page fetch live data from it.

---

## 4. What You Get

| Page | Route | Description |
|---|---|---|
| Home | `/` | 3D hero section + 3 featured products + contact form |
| Products | `/products` | All products, each with its own live 3D model |
| Contact | `/contact` | Leads get saved to the `contacts` MySQL table |
| Admin Login | `/admin-login` | JWT-based login |
| Admin Dashboard | `/admin` | Add/edit/delete products, view contact leads |

Each service can have a **real uploaded photo** (JPG/PNG/WEBP, up to 5MB) — upload it from the Admin Dashboard when adding/editing a service. If no photo is uploaded, the card falls back to a live 3D shape automatically.

---

## 5. Adding Your Real Services

1. Go to `/admin-login` and log in with the admin account you created.
2. On the Dashboard, fill in the service name, description, price.
3. Click "Service Photo" and upload a real photo (JPG/PNG/WEBP, under 5MB).
4. Click Create. The service now shows on the site with your real photo — no coding needed for future updates.
5. To edit or remove a service later, click Edit or Delete next to it in the list on the Dashboard.

Only someone with the admin email/password can reach this page — it's already private.

---

## 6. Going Further (optional upgrades)

- Swap the procedural shapes for real `.glb` 3D models using `@react-three/drei`'s `useGLTF`.
- Deploy backend on Render/Railway, MySQL on PlanetScale/Railway, frontend on Vercel/Netlify.
- Add pagination and search/filter on the Products page.
- Move uploaded photos to cloud storage (Cloudinary/S3) before deploying, since free hosts like Render don't keep uploaded files permanently on redeploy.

---

## 7. Project Structure

```
smart-3d-showcase/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── routes/{auth,products,contact}.js
│   ├── schema.sql
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/api.js
    │   ├── components/{Navbar,Hero,ProductShowcase,ContactForm,AdminLogin,AdminDashboard,Footer,Scene3D}.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── .env.example
```
