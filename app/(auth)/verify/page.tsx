"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-sm text-[var(--muted-foreground)]">Authenticating...</p>
      <div id="clerk-captcha" />
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/feed"
        signUpFallbackRedirectUrl="/feed"
      />
    </div>
  );
}
