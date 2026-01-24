// **** JUST REFERENCE ON YTB COURSE ON AUTHENTIFICATION WITH JWT IN REACT, NOT USED IN THIS PROJECT SO FAR

// helper function - acts like backend, but is acctually on frontend: ***

import * as jose from "jose";

import { env } from "@/lib/env";
import { getItem } from "@/lib/utils/localStorage";

const JWT_SECRET_KEY = "blablabla";
const jwtSecret = new TextEncoder().encode(JWT_SECRET_KEY);

// waits for a given number of miliseconds
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//  helper function to easily retrieve a database table:
export const getDatabaseTable = (entity) => getItem(env.DB_KEY)?.[entity];

// Wrapper for axios mock adapter that adds authentication checks
export const withAuth =
  (...data) =>
  async (config) => {
    const token = config.headers.Authorization?.split(" ")[1];

    // verifies access token if present
    const verified = token ? await verifyToken(token) : false;

    // returns 403 if token is invalid and auth is enabled:
    if (env.USE_AUTH && !verified) {
      return [403, { message: "Unauthorized" }];
    }

    // calls the original mock function:
    return typeof data[0] === "function" ? data[0](config) : data;
  };

// verifies a JWT token:
export const verifyToken = async (token, options = undefined) => {
  try {
    const verification = await jose.jwtVerify(token, jwtSecret);
    return options?.returnPayload ? verification.payload : true;     // payload = info about specific user, if existing
  } catch {
    return false;
  }
};

// generates a refresh-token with a 30 day expiration:
export const generateRefreshToken = async (data) => {
  return await new jose.SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(jwtSecret);
};

// this should acctually be done on server, not on frontend