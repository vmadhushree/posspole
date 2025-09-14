
# POSSPOLE — Full‑Stack Web Application

A professional, production‑ready MERN stack application for managing student feedback on courses with RBAC (Student/Admin), analytics, profile management, and course CRUD.

## Tech Stack
- **Frontend**: React 18 + Vite, React Router, Axios
- **Backend**: Node.js (v20+), Express, MongoDB (Mongoose), JWT, bcryptjs
- **Extras**: express-validator, json2csv, multer, Cloudinary (optional for avatars)

---

## Monorepo Structure
```
posspole/
  backend/
  frontend/
```

---

## Quickstart

### Prerequisites
- Node.js **v20.19.2** (your version)
- MongoDB Atlas connection string (or local `mongodb://localhost:27017/posspole`)

### 1) Backend
```bash
cd backend
cp .env.example .env  # then edit .env
npm install
npm run dev            # starts on http://localhost:5000
```

**Seed admin & sample courses**
```bash
npm run seed
```
Admin login: `admin@posspole.com` / `Admin@123`

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev            # starts on http://localhost:5173
```

> If your backend runs elsewhere, set `VITE_API_BASE_URL` in `frontend/.env`.

---

## Deployment (Outline)
- **Backend**: Render/Fly/Heroku — set env vars from `.env.example`. Enable CORS origin to your frontend domain.
- **Frontend**: Netlify/Vercel — set `VITE_API_BASE_URL` to your backend URL.

---

## Incremental Commit Plan (sample)
1. `chore: scaffold backend & frontend workspaces`
2. `feat(api): auth (signup/login/me) with validators`
3. `feat(api): profile (view/update/change-password) + avatar upload`
4. `feat(api): courses CRUD (admin) + public list`
5. `feat(api): feedback CRUD + pagination + RBAC`
6. `feat(api): admin analytics & CSV export`
7. `feat(web): auth pages + routing + protected routes`
8. `feat(web): student dashboard & feedback forms`
9. `feat(web): profile page + avatar upload`
10. `feat(web): admin dashboard, courses & users mgmt`
11. `docs: README & env examples`

---

## Security Notes
- JWT in Authorization header (Bearer) for simplicity. In production consider HttpOnly cookies.
- Passwords hashed with bcryptjs. Never log plaintext passwords.

---

## License
MIT
