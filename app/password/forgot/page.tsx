'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role'); 

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/password/forgot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="text-sm text-center text-slate-600 dark:text-slate-300">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}