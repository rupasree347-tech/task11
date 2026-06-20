# Task 11 — Authentication, Authorization & Role-Based Access Control System

A full-stack RBAC system with JWT authentication, protected routes, and
role-restricted dashboards for **Admin**, **Manager**, **Instructor**, and
**Student** users.

## What changed in this revision

This package was reviewed against the original task brief and the following
gaps/bugs were fixed:

- **Mobile menu bug** — the Sidebar/Navbar had no way to open on small
  screens (it was simply stacked under the navbar with no toggle). Added a
  hamburger button in the Navbar that slides the sidebar in/out as an
  off-canvas drawer on mobile, with a tap-outside-to-close overlay.
- **Missing user-management API** — `GET /users`, `PUT /users/:id`, and
  `DELETE /users/:id` (listed in the brief) didn't exist on the backend.
  Added them, restricted to Admin, and wired the **Role Management** page
  (which previously was a static table) up to them.
- **Missing Forgot/Reset Password pages** — the backend routes existed but
  there were no frontend pages for them. Added `ForgotPassword.jsx` and
  `ResetPassword.jsx`, linked from the Login page.
- **Routes were not role-restricted** — `ProtectedRoute` only checked for a
  token, so any logged-in user could navigate directly to `/admin`, etc.
  It now also checks the user's role and an `Unauthorized` page is shown
  (or the user is bounced) on mismatch.
- **Session expiry not handled on the frontend** — `ProtectedRoute` now
  decodes the JWT and redirects to login if it has expired, clearing
  stale data from `localStorage`.
- **No session record on login** — `login_history` was written but the
  `sessions` table (required by the brief) was never populated, and
  `last_login` was never updated. Both are now written on every login.
- **Logout button didn't call the backend** — it only cleared
  `localStorage`. It now also calls `POST /auth/logout`, which removes the
  session row.
- **`forgotPassword`/`resetPassword` would crash** — they signed/verified
  JWTs with `process.env.RESET_SECRET`, which was never defined in `.env`.
  Added it.
- **Hard-coded DB credentials committed in `.env`** — replaced with
  placeholders and added a `.env.example`; real secrets should never be
  committed.
- **No input validation or error handling** — added validation
  (required fields, email format, password length, role whitelist,
  duplicate-email check) plus a global 404 handler and error handler.
- **Database had no `Roles` table** — the brief lists `Users`, `Roles`,
  `LoginHistory`, `Sessions` as the required tables; a `roles` table was
  added and `users.role` now references it.
- **Hard-coded API URLs in components** — `Login`/`Register` called
  `axios` directly against `http://localhost:5000`. They now use the
  shared `api` service, which reads `VITE_API_URL` from `.env`.
- **Manager dashboard had no real data** — it now pulls the same stats
  endpoint as Admin (dashboard stats are now allowed for both roles).

> Note: this submission excludes `node_modules` — run `npm install` in
> both `frontend/` and `backend/` before starting (see below).

---

## 1. Project Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+ (the schema in `database/task11sql.sql` targets Postgres)

### 1.1 Database
```bash
createdb task11_db
psql -d task11_db -f database/task11sql.sql
```
This creates the `roles`, `users`, `login_history`, and `sessions` tables
and seeds 4 sample users (one per role, password `123456` for all).

### 1.2 Backend
```bash
cd backend
npm install
cp .env.example .env   # then fill in DB_PASSWORD, JWT_SECRET, RESET_SECRET
npm run dev             # nodemon, or `npm start` for plain node
```
Backend runs on `http://localhost:5000` by default.

### 1.3 Frontend
```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite default).

---

## 2. API Documentation

Base URL: `/api`

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Create a new user (`name`, `email`, `password`, `role`) |
| POST | `/login` | Public | Returns a JWT + user object, logs login history & session |
| POST | `/forgot-password` | Public | Generates a short-lived reset token for the given email |
| POST | `/reset-password` | Public | Consumes a reset token + `newPassword` to update the password |
| POST | `/logout` | Bearer token | Invalidates the current session |

### Users (`/api/users`)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Bearer token | Current user's profile (name, email, role, last login, status) |
| GET | `/dashboard/stats` | Admin, Manager | Total/active users, users by role, total logins |
| GET | `/` | Admin | List all users |
| PUT | `/:id` | Admin | Update a user's `name`, `role`, and/or `status` |
| DELETE | `/:id` | Admin | Delete a user (cannot delete yourself) |
| GET | `/admin` \| `/manager` \| `/instructor` \| `/student` | Matching role | Simple role-gated ping endpoints |

All protected routes require `Authorization: Bearer <token>`.

---

## 3. Folder Structure

```
task11/
├── backend/
│   ├── config/db.js              # PostgreSQL connection pool
│   ├── controllers/              # authController, userController
│   ├── middleware/                # authMiddleware (JWT), roleMiddleware (RBAC)
│   ├── routes/                    # authRoutes, userRoutes
│   ├── server.js                  # Express app entry point
│   └── .env.example
├── frontend/
│   └── src/
│       ├── components/            # Navbar, Sidebar, DashboardLayout, ProtectedRoute
│       ├── pages/                 # Login, Register, ForgotPassword, ResetPassword,
│       │                          # Profile, RoleManagement, Unauthorized,
│       │                          # AdminDashboard, ManagerDashboard,
│       │                          # InstructorDashboard, StudentDashboard
│       ├── services/api.js        # Axios instance + 401 interceptor
│       └── App.jsx                # Route definitions
├── database/task11sql.sql         # Schema + seed data
└── screenshots/                   # App screenshots
```

---

## 4. Features Implemented

- User registration with role selection (Admin/Manager/Instructor/Student)
- JWT-based login with bcrypt password hashing
- Forgot/Reset password flow (token-based)
- Protected routes with role-based access restrictions
- Role-specific dashboards, with Admin able to view all
- Admin-only Role Management page (list/change role/activate-deactivate/delete users)
- Dashboard analytics: total users, active users, users by role, total logins
- Profile page (name, email, role, last login, account status)
- Logout with backend session invalidation + automatic logout on token expiry
- Responsive UI with a working hamburger menu / off-canvas sidebar on mobile

---

## 5. Database Design

**roles** — `id`, `name` (unique), `description`
**users** — `id`, `name`, `email` (unique), `password` (hashed), `role` (FK → roles.name),
`last_login`, `status`, `created_at`
**login_history** — `id`, `user_id` (FK → users.id), `login_time`
**sessions** — `id`, `user_id` (FK → users.id), `token`, `created_at`

Relationships: a user has many login_history rows and many sessions
(one per active login); `users.role` is constrained to the values present
in `roles`.
