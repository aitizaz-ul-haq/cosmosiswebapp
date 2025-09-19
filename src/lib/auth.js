import jwt from "jsonwebtoken";

export function verifyToken(req) {
  let token;

  // Case 1: App Router Request cookies
  if (req?.cookies) {
    token = req.cookies.get("token")?.value;
  }

  // Case 2: Direct cookie header (curl or fetch)
  if (!token && req?.headers?.get("cookie")) {
    const cookieHeader = req.headers.get("cookie");
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) token = match[1];
  }

  // Case 3: Authorization: Bearer
  if (!token && req?.headers?.get("authorization")) {
    const authHeader = req.headers.get("authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}
