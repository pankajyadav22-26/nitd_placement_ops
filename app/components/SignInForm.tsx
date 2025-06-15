"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  role: "admin-login" | "coordinator-login";
}

export default function SignInForm({ role }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn(role, {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    const session = await getSession();

    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (session?.user?.role === "coordinator") {
      router.push("/coordinator/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center capitalize text-slate-800 dark:text-white">
          {role.split("-")[0]} Sign In
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block text-sm text-slate-700 dark:text-slate-300 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm text-slate-700 dark:text-slate-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-right text-sm">
          <a
            href={`/password/forgot?role=${role}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Forgot password?
          </a>
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-150"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
