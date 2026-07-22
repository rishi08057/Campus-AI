import { jwtVerify } from "jose";

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}
const secret = new TextEncoder().encode(SECRET_KEY);

export async function verifyAuthToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      isAuthenticated: true,
      isAdmin: !!payload.is_admin,
      payload
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      isAdmin: false,
      payload: null
    };
  }
}