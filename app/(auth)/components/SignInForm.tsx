"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  signInSchema,
  verificationCodeSchema,
  type SignInType,
  type VerificationCodeType,
} from "@/app/(auth)/validations/SignIn";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";

export default function SignInForm() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const signInForm = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const verifyForm = useForm<VerificationCodeType>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: "" },
  });

  async function handleOAuth(strategy: "oauth_google" | "oauth_facebook") {
    if (!signIn) return;
    const { error } = await signIn.sso({
      strategy,
      redirectUrl: `${appUrl}/verify`,
      redirectCallbackUrl: "/feed",
    });
    if (error) setFormError(error.message);
  }

  async function onSignIn(data: SignInType) {
    if (!signIn) return;
    setIsLoading(true);
    setFormError(null);
    try {
      const { error } = await signIn.password({
        identifier: data.email,
        password: data.password,
      });
      if (error) {
        setFormError(error.message);
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize();
        router.push("/feed");
      } else if (signIn.status === "needs_second_factor") {
        await signIn.mfa.sendEmailCode();
        setShowVerification(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify(data: VerificationCodeType) {
    if (!signIn) return;
    setIsLoading(true);
    setFormError(null);
    try {
      const { error } = await signIn.mfa.verifyEmailCode({ code: data.code });
      if (error) {
        verifyForm.setError("code", { message: error.message });
        return;
      }
      if (signIn.status === "complete") {
        await signIn.finalize();
        router.push("/feed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (showVerification) {
    return (
      <div className="flex flex-col gap-4 w-full border border-[var(--border)] rounded p-10 bg-white">
        <Image src="/assets/logo.svg" alt="Instagram" width={175} height={55} className="self-center mb-2" />
        <p className="text-sm text-center text-[var(--muted-foreground)]">
          Enter the verification code sent to your email.
        </p>
        <form onSubmit={verifyForm.handleSubmit(onVerify)} className="flex flex-col gap-2">
          <Input placeholder="Verification code" {...verifyForm.register("code")} />
          {verifyForm.formState.errors.code && (
            <p className="text-xs text-[var(--destructive)]">{verifyForm.formState.errors.code.message}</p>
          )}
          {formError && <p className="text-xs text-[var(--destructive)]">{formError}</p>}
          <Button type="submit" className="w-full mt-2 bg-[#0095f6] hover:bg-[#1877f2]" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full border border-[var(--border)] rounded p-10 bg-white">
      <Image
        src="/assets/logo.svg"
        alt="Instagram"
        width={175}
        height={55}
        className="self-center mb-2"
        priority
      />

      <p className="text-base font-semibold text-[var(--foreground)]">Log into Instagram</p>

      <form onSubmit={signInForm.handleSubmit(onSignIn)} className="flex flex-col gap-2">
        <Input
          placeholder="Email"
          type="email"
          autoComplete="email"
          {...signInForm.register("email")}
        />
        {signInForm.formState.errors.email && (
          <p className="text-xs text-[var(--destructive)]">{signInForm.formState.errors.email.message}</p>
        )}
        <Input
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          {...signInForm.register("password")}
        />
        {signInForm.formState.errors.password && (
          <p className="text-xs text-[var(--destructive)]">{signInForm.formState.errors.password.message}</p>
        )}
        {formError && <p className="text-xs text-[var(--destructive)]">{formError}</p>}
        <Button
          type="submit"
          className="w-full mt-2 bg-[#0095f6] hover:bg-[#1877f2] rounded-lg font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <button
        type="button"
        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] self-center"
      >
        Forgot password?
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs font-semibold text-[var(--muted-foreground)]">OR</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-[#1877f2] hover:text-[#1877f2]/80 font-semibold text-sm gap-2"
        onClick={() => handleOAuth("oauth_facebook")}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Log in with Facebook
      </Button>

      <div className="flex items-center gap-2 justify-center text-sm">
        <span className="text-[var(--muted-foreground)]">Don&apos;t have an account?</span>
        <Link href="/sign-up" className="text-[#0095f6] font-semibold hover:text-[#0095f6]/80">
          Sign up
        </Link>
      </div>

      <div className="flex flex-col items-center gap-1 mt-2">
        <div className="flex items-center gap-1.5">
          <Image src="/assets/meta-logo-3.png" alt="Meta" width={54} height={18} />
          <span className="text-xs text-[var(--muted-foreground)]">Meta</span>
        </div>
      </div>
    </div>
  );
}
