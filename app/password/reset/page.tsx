import { Suspense } from 'react';
import ResetPasswordPage from '@/app/components/ResetPasswordPage';

export const dynamic = 'force-dynamic'; // ensure it's treated as dynamic and skips pre-rendering

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}