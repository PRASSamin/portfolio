import { NextRequest, NextResponse } from "next/server";
import { getToken, decode } from "next-auth/jwt";
import { NEXT_AUTH_SECRET } from "@/constants/env";
import { SessionKey } from "@/config/auth";
import { cookies } from "next/headers";
import { db } from "./db";
import { DBUser, User } from "@/types";

/**
 * Authentication Utility Class
 *
 * Provides methods for handling authentication-related operations, such as retrieving
 * session data, enforcing authentication in middleware, and protecting server routes.
 */
export class Auth {
  /**
   * Retrieves the authentication session from a request.
   *
   * @param req - The incoming Next.js request.
   * @returns The session object if authenticated, otherwise `null`.
   */
  private async session(req: NextRequest) {
    return await getToken({
      req: req,
      secret: NEXT_AUTH_SECRET,
    });
  }

  /**
   * Retrieves the authenticated user from the server-side session.
   *
   * @remarks
   * - **Allowed:** Server-side usage only.
   * - **Disallowed:** Middleware and client-side usage.
   *
   * @returns The authenticated `User` object if found, otherwise `null`.
   */
  async currentUser(): Promise<User | null> {
    const sessionJWE = (await cookies()).get(SessionKey)?.value;
    if (!sessionJWE) return null;

    const session = await decode({
      token: sessionJWE,
      secret: NEXT_AUTH_SECRET!,
    });

    if (!session?.email) return null;

    return (await db.user.findUnique({
      where: { email: session.email },
      include: { connected_accounts: true },
    })) as User | null;
  }

  /**
   * Retrieves a list of users from the database based on provided filters.
   *
   * @remarks
   * - **Allowed:** Middleware and Server-side usage.
   * - **Disallowed:** client-side usage.
   *
   * @param params - An object containing one or more of the following optional filters: `id`, `username`, `email`, or `role`.
   * @returns An array of `User` objects that match the given criteria.
   *
   * @example
   * ```ts
   * const users = await auth.getUser({ email: "jane@example.com" });
   * ```
   */
  async getUser(
    params: Partial<Pick<DBUser, "id" | "username" | "email" | "role">>
  ): Promise<User[]> {
    return (await db.user.findMany({
      where: params,
      include: {
        connected_accounts: true,
      },
    })) as User[];
  }

  /**
   * Middleware function that enforces authentication and redirects unauthenticated users to the sign-in page.
   *
   * @remarks
   * - **Allowed:** Middleware usage only.
   * - **Disallowed:** Server-side and client-side usage.
   *
   * @param req - The incoming request object.
   * @returns A `NextResponse` redirecting to the sign-in page if the user is not authenticated.
   */
  async protect(
    req: NextRequest,
    res?: ResponseInit
  ): Promise<NextResponse | undefined> {
    const session = await this.session(req);
    if (!session) {
      const currentPath = new URL(req.url).pathname;
      const authPage = `${new URL("/signin", req.url)}?${new URLSearchParams({
        callbackUrl: currentPath,
      })}`;

      return NextResponse.redirect(authPage, res);
    }
  }
}
