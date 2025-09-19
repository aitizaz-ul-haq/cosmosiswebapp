// src/middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// ✅ Public routes (no auth required)
const PUBLIC_PATHS = ["/login", "/api/login", "/api/register"];

// ✅ Role-based route mapping
const ROLE_RULES = {
  superadmin: ["/dashboard", "/api/companies", "/api/users", "/api/log"], // full access
  supervisor: ["/dashboard", "/api/users"], // can manage RMs/clients inside own company
  rm: ["/dashboard", "/api/users"], // can manage clients only
  client: ["/dashboard"], // only own dashboard
};

async function verifyJWT(token) {
  try {
    return await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
  } catch (err) {
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // get cookie
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // verify JWT
  const decoded = await verifyJWT(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = decoded.payload;

  // ✅ role-based access check
  const allowedPaths = ROLE_RULES[user.role] || [];
  const isAllowed = allowedPaths.some((allowed) =>
    pathname.startsWith(allowed)
  );

  if (!isAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // attach role in headers (optional for server components)
  const res = NextResponse.next();
  res.headers.set("x-user-role", user.role);
  return res;
}

// ✅ Protect dashboard + api routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
