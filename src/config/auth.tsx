import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { db } from "@/utils/db";
import { extractNameInfo } from "@/utils/extractNameInfo";
import { ADMIN_EMAIL, BASE_URL } from "@/constants/env";
import axios from "axios";

export const SessionKey = "next-auth.session-token";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (!account || !profile) return false;

      const { provider, providerAccountId } = account;
      const name = profile.name || "";
      const email = profile.email!;
      const rawAvatar =
        // @ts-expect-error: unnecessary
        profile.image || profile?.picture || profile?.avatar_url || null;
      const avatar = rawAvatar ? rawAvatar.replace(/s\d+-c/, "s1000-c") : null;
      const username = `${email.split("@")[0]}${providerAccountId.slice(0, 4)}`;
      const isAdmin = email === ADMIN_EMAIL;
      const { firstName, fullName, lastName } = extractNameInfo(name);

      let connectedAccount = await db.connectedAccount.findUnique({
        where: { provider_oauth_id: { oauth_id: providerAccountId, provider } },
        include: { user: true },
      });

      if (!connectedAccount) {
        const existingUser = await db.user.findUnique({ where: { email } });

        if (!existingUser) {
          const { data: compData } = await axios.post(
            `${BASE_URL}/api/auth/signup`,
            {
              user: {
                first_name: firstName,
                last_name: lastName,
                full_name: fullName,
                isAdmin,
                email,
                username,
                avatar,
              },
            },
            {
              timeout: 15000,
            }
          );

          await db.user.create({
            data: {
              id: compData.uid,
              email,
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              avatar,
              username,
              role: isAdmin ? "ADMIN" : "USER",
              public_metadata: { chatToken: compData.chatToken },
              connected_accounts: {
                create: {
                  oauth_id: providerAccountId,
                  provider,
                  provider_data:
                    typeof profile === "object" && profile !== null
                      ? { ...profile }
                      : {},
                },
              },
            },
          });
        } else {
          await db.connectedAccount.create({
            data: {
              user_id: existingUser.id,
              oauth_id: providerAccountId,
              provider,
              provider_data:
                typeof profile === "object" && profile !== null
                  ? { ...profile }
                  : {},
            },
          });
        }

        connectedAccount = await db.connectedAccount.findUnique({
          where: {
            provider_oauth_id: { oauth_id: providerAccountId, provider },
          },
          include: { user: true },
        });
      }

      return true;
    },

    async session({ session }) {
      if (session.user) {
        const user = await db.user.findUnique({
          where: { email: session.user.email! },
          include: { connected_accounts: true },
        });

        if (user) {
          session.user = user;
        }
      }
      return session;
    },

    async jwt({ token }) {
      token.role = token.email === ADMIN_EMAIL ? "ADMIN" : "USER";
      return token;
    },
  },
  pages: {
    signIn: "/signin",
  },
};