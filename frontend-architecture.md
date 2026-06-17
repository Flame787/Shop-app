# Shop App — Frontend Architecture

## Tech stack
- **React** (Create React App)
- **React Router v6** — client-side routing
- **Redux Toolkit** — global auth state
- **React Query (@tanstack/react-query)** — server data fetching and caching
- **Axios** — HTTP client (configured instance with interceptors)
- **React Toastify** — toast notifications
- **React Context** — cart state

---

## Entry point and providers (`App.js`)

Providers wrap the entire app in this order (outermost → innermost):
```
<Provider store={store}>           ← Redux (auth state)
  <QueryClientProvider>            ← React Query (products cache)
    <CartContextProvider>          ← Cart context
      <RouterProvider router={...}>
```

---

## Routing structure

### Shop layout (`/`)
Wrapped in `RootLayout` (Header + Footer + toast container + modals + session restore):

| Path | Page | Notes |
|---|---|---|
| `/` | `Home` | Landing page |
| `/products` | `ProductsList` | Shows items for a selected category |
| `/products/:id` | `Product` | Single product detail page |
| `/account` | `Account` | Profile page (login form if not logged in) |
| `/cart` | `Cart` | Cart page |
| `/delivery` | `Delivery` | Delivery page (placeholder — not implemented) |
| `/payment` | `Payment` | Payment page |

### Admin layout (`/admin`)
Wrapped in `AdminLayout` (AdminHeader + AdminFooter):

| Path | Page |
|---|---|
| `/admin` | `AdminStats` |
| `/admin/products` | `AdminProducts` |
| `/admin/orders` | `AdminOrders` |

---

## RootLayout responsibilities (`layouts/RootLayout.jsx`)

Besides rendering Header/Footer, `RootLayout` handles:

1. **Session restore** on mount: `POST /api/refresh` → `GET /api/me` → `dispatch(restoreSession(...))`
2. **Products data fetching** with React Query (all products, with sort param) — passed to child pages via Outlet context
3. **Search state** (`searchWord`): when set, renders `<SearchItems>` instead of `<Outlet>`; resets on route change
4. **Sort state** (`sortCriteria`): passed via Outlet context; resets on route change
5. **Category state** (`selectedCategory`): passed down via props and Outlet context
6. **Global modals**: `<LoginModal>` and `<SignupModal>` rendered based on Redux `modalType`
7. **Toast container**: `<ToastContainer>` placed here so any child can trigger toasts

### Outlet context (available in all child pages)
```js
{ selectedCategory, searchWord, products, sortCriteria }
```

---

## State management

### Redux (`redux-store/`)
Used only for auth state. One slice: `authSlice`.  
State: `{ isLoggedIn, role, user, token, modalType }`  
See `authentication.md` for full details.

### React Context (`context-store/CartContext.jsx`)
Used for cart state. Provides: `{ items, addItem, removeItem, updateItemQuantity, deleteItem, clearCart }`  
See `cart-auth-rules.md` for full cart behaviour rules.

### React Query
Used for product data (fetched once in `RootLayout`, cached by `["products", sortCriteria]` key).  
Also used in `Product.jsx` to fetch a single product by ID (cached by `["product", id]`).

---

## Axios instance (`util/axiosConfig.js`)
All API calls use the configured `axiosInstance`:
- Attaches `Authorization: Bearer <token>` from Redux store on every request
- `withCredentials: true` for HttpOnly cookie support
- Response interceptor: silent token refresh on 401/403, then retry original request  
See `authentication.md` for full interceptor details.

---

## Key pages

### `ProductsList`
- Reads `selectedCategory` from Outlet context
- Renders `<CategoryItems>` with `categoryId` and `sortCriteria`
- Navigates to `/products/:id` on item click

### `Product`
- Reads `:id` from URL params (`useParams`)
- Fetches single product with React Query: `GET /api/items/:id`
- Renders `<ProductSection>` with product data

### `Account`
- If not logged in: shows `<LoginModal>` inline
- If logged in: shows `<AccountSection>` with editable profile form
- Fields: email, password, name, address, city, postal code, country, phone
- Each field has individual Edit/Cancel button (field is `readOnly` until Edit clicked)
- Form submits all fields at once via `PUT /api/me`
- Password field shows `************` placeholder; only sent to backend if the field is actively being edited
- Validation: email format, postal (numeric), phone (digits/symbols), password strength, confirm-password match
- Uses `toast` for per-field success notifications and error messages

### `Cart`
- Renders `<CartMain>` which reads items from `CartContext`
- Supports quantity +/- buttons and direct number input
- "Remove item" button per item (with toast notification)
- Shows total price
- "Proceed to payment" button (currently not linked to payment flow)

### `Delivery`
Placeholder — not yet implemented.

### `Payment`
Renders `<PaymentSection>` — implementation details not reviewed.

---

## Notifications (React Toastify)
`<ToastContainer>` lives in `RootLayout` (bottom-right, 3s auto-close).  
Used in: `CartMain` (item removed, quantity updated), `AccountSection` (field saved, errors).

---

## Admin section
Uses a separate `AdminLayout` with `AdminHeader` and `AdminFooter`.  
Three pages: `AdminStats`, `AdminProducts` (CRUD items), `AdminOrders`.  
Admin-only API calls require a JWT with `role = "admin"` — enforced by backend `requireRole("admin")` middleware.  
No route guard implemented on the frontend — admin pages are accessible by URL even for non-admin users (backend will reject API calls).

---

## Known issues / not yet implemented
- `sold_count` field used in "bestseller" sort does not exist in the DB schema — will cause a Prisma error when that sort option is used
- `Delivery` page is an empty placeholder
- "Proceed to payment" button in `CartMain` is not wired up to the payment/delivery flow
- No frontend route guard for admin pages
- `AuthContext.jsx` is a parallel/unused auth implementation (references wrong endpoint `/api/refreshToken` and undefined `@/api` alias)
- Email comparison on login is case-sensitive (could be improved with `email.toLowerCase()` before sending)
- Several `console.log` debug statements left in production code (`RootLayout`, `ProductsList`, `CartContext`)
