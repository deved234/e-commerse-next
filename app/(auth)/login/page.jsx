import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md h-96 bg-slate-900 rounded-2xl animate-pulse" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
