# Shop App — Authentication

## Overview
Authentication uses **JWT access tokens** (short-lived, 15 min) + **HttpOnly refresh tokens** (7 days, stored in cookie). The access token lives only in Redux state — never in localStorage or a regular cookie.

---

## Token types

| Token | Lifetime | Storage | Purpose |
|---|---|---|---|
| Access token (JWT) | 15 min | Redux `auth.token` | Authorises every API request via `Authorization: Bearer <token>` header |
| Refresh token (JWT) | 7 days | HttpOnly cookie (`refreshToken`) | Used to silently get a new access token when the current one expires |

---

## Backend middleware (`middleware/auth.js`)

### `authenticateToken`
- Reads `Authorization: Bearer <token>` from the request header
- Verifies the JWT with `JWT_SECRET`
- Attaches `req.user = { sub: customer_id, role }` if valid
- Returns **401** if token missing, **403** if invalid/expired
- Applied to all protected routes: `/api/me`, `/api/cart`, admin-only item routes

### `requireRole(role)`
- Higher-order function, used after `authenticateToken`
- Returns **403** if `req.user.role` doesn't match the required role
- Used for admin-only routes: `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`

---

## Backend auth endpoints (`routes/auth.js`)

### `POST /api/login`
- Receives `{ email, password }`
- Finds user by email in DB, compares `bcrypt`-hashed password
- On success: returns `{ accessToken, user: { id, email, role } }` + sets `refreshToken` HttpOnly cookie
- Errors: 400 (missing fields), 401 (invalid credentials)

### `POST /api/signup`
- Receives `{ email, password }`
- Validates email format and password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 digit)
- Checks for duplicate email
- Hashes password with `bcrypt`, creates new customer with role `"user"`
- On success: same response as login (access token + refresh cookie)
- Errors: 400 (validation), 409 (email already exists)

### `POST /api/register`
- Alternative registration endpoint (email + password + name + role)
- No automatic login response — returns only `{ userId }`
- Intended for admin use or manual seeding

### `POST /api/refresh`
- Reads `refreshToken` from HttpOnly cookie
- Verifies it, issues a new access token
- Used automatically by the axios interceptor on 401/403 responses
- Error: 403 (missing or invalid refresh token)

### `POST /api/logout`
- Clears the `refreshToken` HttpOnly cookie
- No auth required — always succeeds

### `GET /api/me`
- Protected (`authenticateToken`)
- Returns full profile for the currently authenticated user

### `PUT /api/me`
- Protected (`authenticateToken`)
- Updates name, email, phone, address fields, optionally re-hashes password

---

## Frontend auth state — Redux (`redux-store/authSlice.js`)

Single slice with state: `{ isLoggedIn, role, user, token, modalType }`

| Action | Effect |
|---|---|
| `login({ role, user, token })` | Sets `isLoggedIn=true`, stores token, closes modal |
| `logout()` | Clears all auth state |
| `restoreSession({ role, user, token })` | Same as login, used on page load |
| `setToken(token)` | Updates only the access token (used after silent refresh) |
| `openLoginModal` / `openSignupModal` / `closeModal` | Controls which modal is open |

---

## Frontend session restore (`layouts/RootLayout.jsx`)

On every app load, `RootLayout` runs a `useEffect` that:
1. `POST /api/refresh` — if refresh cookie is valid, gets a new access token
2. `GET /api/me` — fetches user profile with that token
3. Dispatches `restoreSession(...)` to Redux

If the refresh token is missing or expired, the error is caught silently and the user stays logged out.

---

## Frontend axios setup (`util/axiosConfig.js`)

A configured `axios` instance (`axiosInstance`) used for all API calls:

- **Base URL**: `REACT_APP_API_URL` env variable (or `http://localhost:5000`)
- **`withCredentials: true`**: sends HttpOnly cookies automatically on every request

### Request interceptor
Reads `store.getState().auth.token` and adds `Authorization: Bearer <token>` to every request.

### Response interceptor (silent token refresh)
If a response returns **401 or 403**:
1. Marks the original request with `_retry = true` (prevents infinite loop)
2. Calls `POST /api/refresh` to get a new access token
3. Updates Redux (`setToken`) and retries the original request with the new token
4. If refresh also fails → dispatches `logout()` and rejects

Excluded from refresh logic: `/api/login`, `/api/refresh`, `/api/logout`

---

## Frontend modals (`LoginModal.jsx`, `SignupModal.jsx`)

Both modals are rendered globally in `RootLayout` based on Redux `modalType`:
```jsx
{modalType === 'login' && <LoginModal />}
{modalType === 'signup' && <SignupModal />}
```

**LoginModal**: POSTs to `/api/login`, on success dispatches `login(...)` to Redux, closes modal.

**SignupModal**: Validates password (8+ chars, uppercase, lowercase, digit), checks confirm-password match, POSTs to `/api/signup`, on success dispatches `login(...)` (user is immediately logged in after signup).

---

## Note: duplicate auth system
`AuthContext.jsx` exists but appears **unused** in the main app flow. It references `@/api` (undefined alias) and `/api/refreshToken` (wrong endpoint — correct is `/api/refresh`). The active auth system is `axiosConfig.js` + Redux + `RootLayout` session restore.

---

## Password rules (enforced on both frontend and backend)
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters allowed but not required
