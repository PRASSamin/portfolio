import { NextResponse, NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { maintenanceNotice } from "./config";

async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  const { pathname } = request.nextUrl;
  headers.set("x-current-url", request.nextUrl.href);

  if (maintenanceNotice.enabled) {
    const staticMediaRegex =
      /\.(png|jpg|jpeg|gif|svg|webp|mp4|webm|ogg|mov|avi|wmv)$/i;

    if (!pathname.startsWith("/api") && !staticMediaRegex.test(pathname)) {
      return NextResponse.rewrite(
        new URL("/maintenance", request.nextUrl.href),
        {
          headers,
        }
      );
    }
  }

  if (pathname.startsWith("/wa")) {
    if (pathname.split("/").length - 1 > 2) {
      return NextResponse.next();
    }
    const message = pathname.split("/wa/").at(-1);
    return NextResponse.redirect(
      `https://api.whatsapp.com/send?phone=8801322122109&text=${message}`
    );
  }

  return NextResponse.next({ headers });
}

export default clerkMiddleware(async (auth, request) => {
  const isPrivateRoute = createRouteMatcher(["/chat(.*)", "/me(.*)"]);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/chat")) {
    const userAgent = request.headers.get("user-agent") || "";
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      const deepLinkPath = pathname.replace(/^\//, ""); 
      const deepLink = `qubitchat://${deepLinkPath}`;
      return NextResponse.redirect(deepLink);
    }
  }

  if (isPrivateRoute(request)) {
    await auth.protect();
  }
  return await middleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
