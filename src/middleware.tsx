import { NextResponse, NextRequest } from "next/server";
import { maintenanceNotice } from "./config/maintenance";
import { createRouteMatcher } from "./utils/router-matcher";
import axios from "axios";

const isAdminRoute = createRouteMatcher(["/admin.*", "/api/admin.*"]);

export default async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-current-url", request.nextUrl.href);
  const { pathname } = request.nextUrl;

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

  // Admin Protection
  if (isAdminRoute(request)) {
    const token = request.cookies.get("_auth_data");

    if (!token)
      return NextResponse.rewrite(new URL("/unauthorized", request.url), {
        headers,
      });

    try {
      const _ = await axios.post(
        new URL("/api/auth/verify", request.url).href,
        {},
        {
          headers: {
            cookie: request.headers.get("cookie"),
          },
        }
      );
    } catch (error) {
      return NextResponse.rewrite(new URL("/unauthorized", request.url), {
        headers,
      });
    }
  }

  return NextResponse.next({ headers });
}

// Match only necessary routes (skip static assets, _next, and public files)
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
