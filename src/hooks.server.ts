import { env as privateEnv } from "$env/dynamic/private";
import { env as publicEnv } from "$env/dynamic/public";
import { type Handle, error } from "@sveltejs/kit";
import jwt from "jsonwebtoken";
import type { IProfile } from "$lib/types";

export const handle: Handle = async ({ event, resolve }) => {
  const cookieKey = publicEnv.PUBLIC_COOKIE_KEY
  const jwtSecret = privateEnv.PRIVATE_JWT_SECRET_KEY

  if (jwtSecret && cookieKey && event.cookies.get(cookieKey)) {
    const token = event.cookies.get(cookieKey);
    if (!token) {
      event.locals.profile = null;
      return resolve(event);
    }

    try {
      const payload = jwt.verify(token, jwtSecret);
      if (typeof payload === "string") {
        error(400, "Something went wrong");
      }
      if (!payload.profile) {
        error(400, "Token is not valid");
      }

      const profile = payload.profile as IProfile

      event.locals.profile = {
        ...profile
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        event.cookies.delete(cookieKey, { path: "/" })
      }
    }
  }

  return resolve(event);
};