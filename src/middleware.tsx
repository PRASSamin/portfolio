import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { maintenanceNotice } from "./config/maintenance";
import { getChatAppRoute } from "./utils/getChatAppRoute";
import { API_KEY, NEXT_AUTH_SECRET } from "./constants/env";
import { Auth } from "./utils/auth";
import { createRouteMatcher } from "./utils/routerMatcher";

const isPrivateRoute = createRouteMatcher(["/chat.*", "/me.*"]);
const isAdminRoute = createRouteMatcher(["/admin.*"]);
const isAdminApiRoute = createRouteMatcher(["/api/admin.*"]);

export default async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-url", request.nextUrl.href);
  const callbackPath = request.nextUrl.searchParams.get("callbackUrl");
  const { pathname } = request.nextUrl;
  const auth = new Auth();

  // Authentication session from NextAuth
  const session = await getToken({ req: request, secret: NEXT_AUTH_SECRET });

  if (session && callbackPath) {
    return NextResponse.redirect(new URL(callbackPath, request.url));
  }

  // Maintenance mode check (redirects all non-static requests)
  const staticMediaRegex =
    /\.(png|jpg|jpeg|gif|svg|webp|mp4|webm|ogg|mov|avi|wmv)$/i;
  if (
    maintenanceNotice.enabled &&
    !pathname.startsWith("/api") &&
    !staticMediaRegex.test(pathname)
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      headers,
    });
  }

  // WhatsApp Redirect Handling
  if (pathname.startsWith("/wa")) {
    const message = pathname.split("/wa/").at(-1);
    return NextResponse.redirect(
      `https://api.whatsapp.com/send?phone=8801322122109&text=${message}`
    );
  }

  // Deep linking to chat app
  if (pathname.startsWith("/chat")) {
    const userAgent = request.headers.get("user-agent") || "";
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      const deepLinkPath = getChatAppRoute(pathname).replace(/^\//, "");
      const deepLink = `qubitchat://${deepLinkPath}`;
      return NextResponse.redirect(deepLink);
    }
  }

  // Admin API Protection
  if (isAdminApiRoute(request)) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== API_KEY || session?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 401 }
      );
    }
  }

  // Protect admin pages
  if (isAdminRoute(request)) {
    if (session?.role !== "ADMIN") {
      return NextResponse.rewrite(new URL("/unauthorized", request.url), {
        headers,
      });
    }
  }

  // Protect private user pages
  if (isPrivateRoute(request)) {
    return auth.protect(request, { headers });
  }

  return NextResponse.next({ headers });
}

// Match only necessary routes (skip static assets, _next, and public files)
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
