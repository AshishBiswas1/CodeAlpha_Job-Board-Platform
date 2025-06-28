# 🧑‍💼 CodeAlpha Job Board Platform

A full-featured backend for a job board platform built with **Node.js**, **Express**, and **MongoDB** (via Mongoose).

---

## 🚀 Features

### 1. **User Authentication**

- ✅ **Employers** can **sign up** and **log in**.
- ✅ **Candidates** can also **sign up** and **log in**.
- Secure authentication using **JWT tokens**.
- **Password hashing**, **login protection**, and token expiration implemented.

### 2. **Job Management**

- ✅ Employers can **post new job listings**
- ✅ Employers can **retrieve all their posted jobs**
- ✅ No duplicate checking or deletion yet (base CRUD structure is in place)

### 3. **Application System**

- ✅ Logged-in **Candidates** can **apply to jobs** via `POST /jobs/:jobId/apply`
- ✅ Ensures one application per candidate-job pair
- ✅ Includes **application status** (`pending`, `accepted`, `rejected`)
- ✅ **Resume is auto-attached** (pulled from candidate profile)

### 4. **Protected Routes**

- ✅ **Route protection** middleware for securing endpoints (`protect(Candidate)` / `protect(Employer)`)
- ✅ Prevents unauthenticated access

---

## 🗂️ Project Structure

- `models/` — Mongoose schemas:

  - `EmployerModel.js`, `CandidateModel.js`, `JobModel.js`, `ApplicationModel.js`

- `controllers/` — Business logic for authentication, jobs, applications
- `routes/` — Express routers:

  - `employerRoutes.js`, `candidateRoutes.js`, `jobRoutes.js`, `applicationRoutes.js`

- `util/` — Helpers:

  - `catchAsync` (async wrapper)
  - `appError` (Error handling)

---

## 📦 Installation

```bash
git clone https://github.com/AshishBiswas1/CodeAlpha_Job-Board-Platform.git
cd CodeAlpha_Job-Board-Platform
npm install
```

📝 Create a `.env` file with:

```
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
NODE_ENV=development
```

```bash
npm run start
```

---

## 🔗 API Endpoints

### Authentication

- `POST /api/employers/signup` — Register employer
- `POST /api/employers/login` — Employer login
- `POST /api/candidates/signup` — Candidate registration
- `POST /api/candidates/login` — Candidate login

### Jobs & Applications

- `POST /api/jobs/:jobId/apply` — Candidate applies to a job (protected)
- `GET /api/employers/jobs` — Get all jobs posted by the logged-in employer

---

## 🎯 Next Steps (Planned)

- Add **resume upload** feature
- Implement **job update**, **delete**, **list all**
- Enhance **application tracking** (dashboard, status updates)
- Add **admin approval**, **email verification**, **rate limiting**, etc.

---

## 📄 License

MIT License — feel free to adapt and extend for your own use!
