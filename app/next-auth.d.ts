import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: "admin" | "coordinator";
    };
  }

  interface User {
    role?: "admin" | "coordinator";
  }
}