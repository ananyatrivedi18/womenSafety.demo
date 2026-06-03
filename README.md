# 🛡️ SheShield — Women's Safety Portal

A simple full-stack web app: **HTML + CSS + vanilla JavaScript** on the
frontend, **Node.js + Express** on the backend, **JWT** auth with **bcrypt**
password hashing, and **in-memory** storage (no database).

> ⚠️ All data lives in server memory and is **erased when the server
> restarts**. This is intentional — it keeps the project simple to learn.

---

## 📁 Project structure

```
SheShield/
├── frontend/
│   ├── index.html        Home / landing page
│   ├── login.html        Login page
│   ├── register.html     Register page
│   ├── dashboard.html    Dashboard (protected)
│   ├── contacts.html     Emergency contacts (protected)
│   ├── sos.html          SOS button + history (protected)
│   ├── tips.html         Safety tips (protected)
│   ├── css/style.css     All styling (purple/pink glassmorphism)
│   └── js/
│       ├── common.js     Shared helpers: API calls, token, toasts, sidebar
│       ├── auth.js       Login + register form logic
│       ├── dashboard.js  Loads user info and counts
│       ├── contacts.js   Add / edit / delete contacts
│       └── sos.js        SOS confirmation + alert history
└── backend/
    ├── server.js         Express entry point (also serves the frontend)
    ├── package.json      Dependencies + scripts
    ├── .env.example      Copy to .env and fill in
    ├── data/store.js     In-memory "database"
    ├── middleware/auth.js JWT verification middleware
    └── routes/
        ├── auth.js       /api/auth/register, /login, /me
        ├── contacts.js   /api/contacts CRUD
        └── sos.js        /api/sos create + list
```

---

## 🚀 Setup & run

You need **Node.js 18+** installed.

```bash
# 1. Go into the backend folder
cd SheShield/backend

# 2. Install dependencies
npm install

# 3. Create your .env file from the example, then open it and set a secret
cp .env.example .env        # (Windows: copy .env.example .env)

# 4. Start the server
npm start                   # or: npm run dev  (auto-restarts on changes)
```

Then open your browser at:

```
http://localhost:5000
```

That single server serves **both** the API and the website, so there is
nothing else to start.

---

## 🔌 How the frontend talks to the backend

1. **Same origin.** `server.js` serves the `frontend/` folder as static files.
   So the website and the API share `http://localhost:5000`. The frontend can
   therefore use **relative** URLs like `/api/contacts` (see `API_BASE` in
   `common.js`).

2. **Fetch.** Every request goes through the `apiFetch()` helper in
   `common.js`, which uses the browser's `fetch()` to send/receive **JSON**.

3. **The JWT token.** On login, the backend returns a signed token. The
   frontend stores it in `localStorage` and attaches it to every protected
   request in the header:

   ```
   Authorization: Bearer <token>
   ```

4. **The middleware.** `middleware/auth.js` reads that header, verifies the
   token, and sets `req.userId`. Routes then use `req.userId` to return only
   that user's data. If the token is missing/expired, the API responds `401`
   and the frontend sends the user back to `login.html`.

### API reference

| Method | Endpoint              | Auth | Purpose                  |
|--------|-----------------------|------|--------------------------|
| POST   | `/api/auth/register`  | No   | Create an account        |
| POST   | `/api/auth/login`     | No   | Log in, returns a token  |
| GET    | `/api/auth/me`        | Yes  | Current user details     |
| GET    | `/api/contacts`       | Yes  | List your contacts       |
| POST   | `/api/contacts`       | Yes  | Add a contact            |
| PUT    | `/api/contacts/:id`   | Yes  | Update a contact         |
| DELETE | `/api/contacts/:id`   | Yes  | Delete a contact         |
| POST   | `/api/sos`            | Yes  | Record an SOS alert      |
| GET    | `/api/sos`            | Yes  | List your SOS alerts     |

---

## 🧪 Try it

1. Open `http://localhost:5000`, click **Get Started**, register.
2. Log in. You land on the dashboard.
3. Add a few emergency contacts.
4. Go to **SOS**, press the red button, confirm — see it appear in history.
5. Refresh the dashboard: the counts update.

Enjoy, and stay safe! 🛡️💜
