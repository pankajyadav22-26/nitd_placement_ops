import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import {connectToDatabase} from "@/lib/db";
import AdminModel from "@/models/admin";
import CoordinatorModel from "@/models/coordinators";

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        await connectToDatabase();
        const user = await AdminModel.findOne({ email });

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "admin",
        };
      },
    }),
    CredentialsProvider({
      id: "coordinator-login",
      name: "Coordinator",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        await connectToDatabase();
        const user = await CoordinatorModel.findOne({ email });

        if (!user || !(await compare(password, user.password))) {
          throw new Error("Invalid coordinator credentials");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: "coordinator",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as "admin" | "coordinator";
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/select-role", // Optional: route users to a role selection page
    error: "/auth/error", // Optional error page
  },
};