// helper functions used by frontend. JWT signing/verification must happen on the server.
import { getItem } from "@/lib/utils/localStorage";

// feature flags / keys from env (fallbacks for local dev)
const USE_AUTH = process.env.REACT_APP_USE_AUTH !== "false";
const DB_KEY = process.env.REACT_APP_DB_KEY || "shop_prisma";

// waits for a given number of miliseconds
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//  helper function to easily retrieve a database table:
export const getDatabaseTable = (entity) => getItem(DB_KEY)?.[entity];

// Wrapper for axios mock adapter that adds authentication checks
export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.headers.Authorization?.split(" ")[1];

    // verifies access token if present (delegates verification to backend)
    const verified = token ? await verifyToken(token) : false;

    // returns 403 if token is invalid and auth is enabled:
    if (USE_AUTH && !verified) {
      return [403, { message: "Unauthorized" }];
    }

    // calls the original mock function:
    return typeof data[0] === "function" ? data[0](config) : data;
  };

// verifies a JWT token:
export const verifyToken = async (token, options = undefined) => {
  try {
    const base = process.env.REACT_APP_API_URL || "";
    const res = await fetch(`${base}/api/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) return false;
    const body = await res.json();
    return options?.returnPayload ? body.data : true;
  } catch (e) {
    return false;
  }
};

// Do not generate tokens on the frontend. Token creation/refreshing is handled by the backend endpoints (/api/login, /api/refresh).