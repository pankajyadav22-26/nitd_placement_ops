import { Suspense } from 'react';
import ForgotPasswordPage from '@/app/components/ForgotPasswordPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}