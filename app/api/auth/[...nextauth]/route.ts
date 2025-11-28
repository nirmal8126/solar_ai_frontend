import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_URL } from "@/lib/api";

const BACKEND_URL = API_URL || process.env.API_URL;

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_API_URL or API_URL must be set for authentication");
}

const handler = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Solar AI",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const response = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) return null;

        const data = await response.json();

        if (!data?.user || !data?.access_token) return null;

        return {
          id: data.user.id.toString(),
          email: data.user.email,
          name: data.user.name,
          accessToken: data.access_token,
        };
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
