import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth config WITHOUT Prisma adapter — safe for Edge runtime (middleware).
 * The full auth config with Prisma is in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    // Credentials provider is included here for type compatibility
    // Actual verification happens in auth.ts
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize() { return null; },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as import("@prisma/client").Role;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const targetOrigin = new URL(url).origin;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://highbury.papoundhomelab.ddnsgeek.com";
        const appOrigin = new URL(appUrl).origin;
        if (targetOrigin === baseUrl || targetOrigin === appOrigin || targetOrigin === "https://highbury.papoundhomelab.ddnsgeek.com") {
          return url;
        }
      } catch {}
      return baseUrl;
    },
  },
};
