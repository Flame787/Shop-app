# Shop App — Cart & Authentication Rules

## Cart ownership
Cart items are strictly tied to a specific user account. A logged-out user must never see another user's cart items.

## Guest (not logged in)
- Cart is stored in **localStorage** (`shop_cart` key).
- Items persist in the browser across page reloads as long as the user stays logged out.
- Cart changes are saved to localStorage on every update.

## Login (existing user)
- Fetch cart from **DB** for that user.
- If DB cart has items → use DB items, **discard and clear localStorage**.
- If DB cart is empty → migrate localStorage items to DB, then **clear localStorage**.
- From this point, cart changes are saved only to DB (not localStorage).

## Signup (new user)
- Same behaviour as "Login with empty DB cart": localStorage items are migrated to DB, then localStorage is cleared.

## Logout
- Dispatch `CLEAR_CART` to empty the React cart state (UI shows empty cart immediately).
- Clear localStorage (`shop_cart`) so the previous user's items don't bleed into a guest session or the next user.
- Set `isCartLoaded = false`.

## Key implementation detail — `wasLoggedIn` ref
`isLoggedIn` (from Redux) starts as `false` on initial mount (before auth check completes).  
A `useRef` (`wasLoggedIn`) tracks whether the user was previously logged in, so the logout cleanup only fires when `isLoggedIn` transitions from `true → false` (actual logout), not on the initial mount where it starts as `false`.

## Storage split
| User state | Save destination |
|---|---|
| Guest | localStorage only |
| Logged in (after DB load) | DB only |

## Backend cart endpoints (Railway, Prisma + MySQL)
- `GET /api/cart` — returns `{ cart: { items: [...] } }` for the authenticated user
- `POST /api/cart` — saves `{ items: [...] }` to the `cart_items` JSON column on the `customer` table
- `DELETE /api/cart` — clears the cart for the authenticated user

## DB notes
- `cart_items` is a `JSON NULL` column on the `customer` table — added via `setup.js` startup script (ALTER TABLE), since there were no Prisma migration files committed.
- The `order` table was renamed to `orders` (also via `setup.js`) because `ORDER` is a reserved MySQL keyword that broke Railway's dashboard query (`SELECT * FROM order LIMIT 10`).
- `setup.js` runs idempotently before `node server.js` on every Railway deploy.
