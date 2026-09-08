import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

function getCorsOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");

  if (!origin) {
    return null;
  }

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
  ].filter(Boolean);

  return allowedOrigins.includes(origin) ? origin : null;
}

export default withAuth(
    function middleware(request: NextRequest) {
      const origin = getCorsOrigin(request);

      // Handle CORS preflight requests
      if (request.method === "OPTIONS") {
        const response = new NextResponse(null, { status: 204 });

        if (origin) {
          response.headers.set("Access-Control-Allow-Origin", origin);
          response.headers.set("Access-Control-Allow-Credentials", "true");
          response.headers.set(
              "Access-Control-Allow-Methods",
              "GET,POST,PUT,DELETE,OPTIONS"
          );
          response.headers.set(
              "Access-Control-Allow-Headers",
              "Content-Type, Authorization"
          );
          response.headers.set("Vary", "Origin");
        }

        return response;
      }

      const response = NextResponse.next();

      if (origin) {
        response.headers.set("Access-Control-Allow-Origin", origin);
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Vary", "Origin");
      }

      return response;
    },
    {
      callbacks: {
        authorized: ({ token, req }) => {
          const { pathname } = req.nextUrl;

          // Auth-related paths
          if (
              pathname.startsWith("/api/auth") ||
              pathname === "/login" ||
              pathname === "/register"
          ) {
            return true;
          }

          // Public paths
          if (pathname === "/" || pathname.startsWith("/api/video")) {
            return true;
          }

          return !!token;
        },
      },
    }
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};