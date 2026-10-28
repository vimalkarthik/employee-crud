# Employee CRUD — React + Node.js + MySQL

This is a conversion of your Laravel Employee CRUD app to:
- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js + Express + JWT auth
- **Database:** MySQL (raw SQL via `mysql2`, no ORM — same structure as your Laravel migrations)

## What was converted

| Laravel | Node/React equivalent |
|---|---|
| `AuthController` (register/login/logout) | `backend/routes/auth.js` |
| `EmployeeController` (CRUD + search) | `backend/routes/employees.js` |
| `countryController` | `backend/routes/countries.js` |
| `auth` + `nocache` middleware | `backend/middleware/auth.js`, `backend/middleware/nocache.js` |
| Session-based auth (`Auth::attempt`) | Stateless JWT stored in `localStorage` |
| Blade views (`auth/login`, `auth/signup`, `employees/*`) | React pages in `frontend/src/pages/` |
| `employees` / `users` migrations | `database.sql` |

Field names were kept identical (`name`, `employeeId`, `designation` for employees; `name`/`fName`, `email`, `password` for users) so no data mapping is needed.

## 1. Database setup

```bash
mysql -u root -p < database.sql
```

This creates the `employee_crud` database with `users` and `employees` tables.

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env with your MySQL credentials and a real JWT_SECRET
npm install
npm run dev      # nodemon, auto-restarts
# or: npm start
```

The API runs on `http://localhost:5000` by default. Key endpoints:

- `POST /api/register` — `{ fName, email, password }`
- `POST /api/login` — `{ email, password }`
- `POST /api/logout` — requires `Authorization: Bearer <token>`
- `GET  /api/user` — current logged-in user
- `GET  /api/employees` — list all
- `GET  /api/employees/search/:param` — search by name
- `GET  /api/employees/:id` — get one
- `POST /api/employees` — `{ name, employeeId, designation }`
- `PUT  /api/employees/:id` — update
- `DELETE /api/employees/:id` — delete
- `GET  /api/countries` — static country list

All `/api/employees/*` routes require the `Authorization: Bearer <token>` header (equivalent to Laravel's `auth` middleware group).

## 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. It's already wired to call the API at `http://localhost:5000/api` (see `frontend/src/api/axios.js` — change the `baseURL` there if you deploy the backend elsewhere).

## 4. How auth works here

Laravel used server-side sessions. Since React/Node is typically stateless, this version uses **JWT**:

1. On login/signup, the backend returns a signed JWT.
2. The frontend stores it in `localStorage` and attaches it as `Authorization: Bearer <token>` on every request (see the axios interceptor).
3. Protected pages (`/employees`, `/employees/create`, `/employees/:id/edit`) are wrapped in `<ProtectedRoute>`, which redirects to `/login` if there's no token.
4. If the backend returns 401 (expired/invalid token), the frontend clears storage and redirects to login automatically.

## 5. Folder structure

```
employee-crud/
├── database.sql
├── backend/
│   ├── server.js
│   ├── config/db.js
│   ├── middleware/{auth.js, nocache.js}
│   └── routes/{auth.js, employees.js, countries.js}
└── frontend/
    ├── index.html
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/axios.js
        ├── components/ProtectedRoute.jsx
        └── pages/{Login,Signup,EmployeeList,EmployeeCreate,EmployeeEdit}.jsx
```

## Notes / things you may want to tweak

- Passwords are hashed with `bcryptjs` (matches Laravel's `bcrypt()`).
- The `search` route uses `LIKE %param%`, same behavior as your `EmployeeController@search`.
- There's no CSRF token handling since JWT + CORS replaces Laravel's session/CSRF model.
- The `countries` endpoint is included since it existed in your `routes/api.php`, even though it wasn't wired into any current view — hook it into a dropdown if you need it.
