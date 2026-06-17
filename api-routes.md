# Shop App — Backend API Routes

Base URL (production): Railway backend service  
Base URL (local): `http://localhost:5000`

All protected routes require `Authorization: Bearer <accessToken>` header.  
Admin-only routes additionally require `role = "admin"` in the JWT payload.

---

## Auth routes (`routes/auth.js`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/login` | None | Login with email + password. Returns access token + sets refresh cookie. |
| POST | `/api/signup` | None | Create account (email + password only). Returns access token + sets refresh cookie. |
| POST | `/api/register` | None | Full registration (name + email + password + role). Returns userId only. |
| POST | `/api/refresh` | Cookie | Exchange refresh cookie for a new access token. |
| POST | `/api/logout` | None | Clears the refresh token cookie. |
| GET | `/api/me` | User | Returns full profile of the logged-in user. |
| PUT | `/api/me` | User | Updates user profile (name, email, phone, address, password). |
| GET | `/api/cart` | User | Returns `{ cart: { items: [...] } }` for the logged-in user. |
| POST | `/api/cart` | User | Saves `{ items: [...] }` to `cart_items` JSON column on `customer` table. |
| DELETE | `/api/cart` | User | Clears the cart for the logged-in user. |

---

## Items routes (`routes/items.js`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/items` | None | Returns all items. Accepts `?sort=` query param. |
| GET | `/api/items/:id` | None | Returns a single item by ID. |
| GET | `/api/items/category/:categoryId` | None | Returns items for a category. Accepts `?sort=`. |
| GET | `/api/items/search/items` | None | Search by keyword across name, description, tags. Accepts `?query=&sort=`. |
| POST | `/api/items` | Admin | Creates a new item. |
| PUT | `/api/items/:id` | Admin | Updates an existing item. |
| DELETE | `/api/items/:id` | Admin | Deletes an item. |

### Sort options (all item GET endpoints)
| `?sort=` value | Effect |
|---|---|
| `a-z` | Name ascending |
| `z-a` | Name descending |
| `price-asc` | Price ascending |
| `price-desc` | Price descending |
| `newest` | Newest first (by item_id desc) |
| `bestseller` | By sold_count desc *(field missing from DB schema — will error)* |
| *(default)* | item_id ascending |

---

## Categories routes (`routes/categories.js`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/categories` | None | Returns all categories (`category_id`, `category_name`). |

---

## Request / Response format

### Typical success response
```json
{ "success": true, "data": { ... } }
```

### Typical error response
```json
{ "success": false, "message": "Descriptive error" }
```

### Cart response format
```json
{ "success": true, "cart": { "items": [ { "id": 1, "name": "...", "quantity": 2, "price": 9.99 } ] } }
```

---

## Security measures
- **Rate limiting**: 100 requests per IP per minute (`express-rate-limit`)
- **CORS**: only the frontend origin (`CLIENT_URL` env var) can call the API; cookies allowed via `credentials: true`
- **HttpOnly cookie**: refresh token is not accessible from JavaScript
- **bcrypt**: passwords are hashed before storage (salt rounds: 10)
- **JWT**: signed with `JWT_SECRET` env variable; access token expires in 15 min, refresh in 7 days
