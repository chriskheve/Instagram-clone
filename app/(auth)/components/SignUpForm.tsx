"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  signUpSchema,
  verificationCodeSchema,
  type SignUpType,
  type SignUpVerificationCodeType,
} from "@/app/(auth)/validations/SignUp";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

export default function SignUpForm() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      birthdayMonth: "",
      birthdayDay: "",
      birthdayYear: "",
    },
  });

  const verifyForm = useForm<SignUpVerificationCodeType>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(data: SignUpType) {
    if (!signUp) return;
    setIsLoading(true);
    setFormError(null);
    try {
      const birthday = `${data.birthdayYear}-${String(months.indexOf(data.birthdayMonth) + 1).padStart(2, "0")}-${data.birthdayDay.padStart(2, "0")}`;

      const { error } = await signUp.password({
        emailAddress: data.email,
        password: data.password,
        firstName: data.name.split(" ")[0],
        lastName: data.name.split(" ").slice(1).join(" ") || undefined,
        username: data.username,
        unsafeMetadata: { birthday },
      });

      if (error) {
        setFormError(error.message);
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize();
        router.push("/feed");
      } else {
        await signUp.verifications.sendEmailCode();
        setShowVerification(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onVerify(data: SignUpVerificationCodeType) {
    if (!signUp) return;
    setIsLoading(true);
    setFormError(null);
    try {
      const { error } = await signUp.verifications.verifyEmailCode({ code: data.code });
      if (error) {
        verifyForm.setError("code", { message: error.message });
        return;
      }
      if (signUp.status === "complete") {
        await signUp.finalize();
        router.push("/feed");
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (showVerification) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-10 px-4">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Image src="/assets/meta-logo-3.png" alt="Meta" width={54} height={18} />
            <span className="text-sm font-medium">Meta</span>
          </div>
          <h1 className="text-2xl font-bold">Enter verification code</h1>
          <p className="text-sm text-[var(--muted-foreground)]">We sent a code to your email address.</p>
          <form onSubmit={verifyForm.handleSubmit(onVerify)} className="flex flex-col gap-3">
            <Input placeholder="Verification code" {...verifyForm.register("code")} />
            {verifyForm.formState.errors.code && (
              <p className="text-xs text-[var(--destructive)]">{verifyForm.formState.errors.code.message}</p>
            )}
            {formError && <p className="text-xs text-[var(--destructive)]">{formError}</p>}
            <div id="clerk-captcha" />
            <Button type="submit" className="w-full bg-[#0095f6] hover:bg-[#1877f2]" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Submit"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] py-10 px-4">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="self-start text-2xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-1"
          aria-label="Go back"
        >
          &#8249;
        </button>

        <div className="flex items-center gap-1.5">
          <Image src="/assets/meta-logo-3.png" alt="Meta" width={54} height={18} />
          <span className="text-sm font-medium">Meta</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Get started on Instagram</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Sign up to see photos and videos from your friends.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Mobile number or email</label>
            <Input
              placeholder="Email"
              type="email"
              autoComplete="email"
              className="mt-1"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-[var(--destructive)] mt-1">{form.formState.errors.email.message}</p>
            )}
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              You may receive notifications from us.{" "}
              <a href="#" className="text-[#0095f6]">Learn why we ask for your contact information</a>
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Password</label>
            <Input
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              className="mt-1"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-[var(--destructive)] mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">
              Birthday{" "}
              <span className="text-[var(--muted-foreground)] font-normal cursor-help" title="You need to enter your birthday">
                &#9432;
              </span>
            </label>
            <div className="flex gap-2 mt-1">
              {(["birthdayMonth", "birthdayDay", "birthdayYear"] as const).map((field, i) => (
                <div key={field} className="relative flex-1">
                  <select
                    className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 text-sm appearance-none text-[var(--foreground)] focus:outline-none focus:border-[var(--muted-foreground)]"
                    {...form.register(field)}
                  >
                    <option value="">{["Month", "Day", "Year"][i]}</option>
                    {(i === 0 ? months : i === 1 ? days : years).map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">
                    &#8964;
                  </span>
                </div>
              ))}
            </div>
            {(form.formState.errors.birthdayMonth || form.formState.errors.birthdayDay || form.formState.errors.birthdayYear) && (
              <p className="text-xs text-[var(--destructive)] mt-1">Please select your full birthday</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Name</label>
            <Input placeholder="Full name" autoComplete="name" className="mt-1" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-[var(--destructive)] mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-[var(--foreground)]">Username</label>
            <Input placeholder="Username" autoComplete="username" className="mt-1" {...form.register("username")} />
            {form.formState.errors.username && (
              <p className="text-xs text-[var(--destructive)] mt-1">{form.formState.errors.username.message}</p>
            )}
          </div>

          {/* Legal */}
          <p className="text-xs text-[var(--muted-foreground)]">
            People who use our service may have uploaded your contact information to Instagram.{" "}
            <a href="#" className="text-[#0095f6]">Learn more.</a>
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            By tapping Submit, you agree to create an account and to Instagram&apos;s{" "}
            <a href="#" className="text-[#0095f6]">Terms</a>,{" "}
            <a href="#" className="text-[#0095f6]">Privacy Policy</a> and{" "}
            <a href="#" className="text-[#0095f6]">Cookies Policy</a>.
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            The <a href="#" className="text-[#0095f6]">Privacy Policy</a> describes the ways we can use the
            information we collect when you create an account. We use this information to provide, personalize and
            improve our experience, including ads.
          </p>

          {formError && <p className="text-xs text-[var(--destructive)]">{formError}</p>}

          <div id="clerk-captcha" />

          <Button
            type="submit"
            className="w-full bg-[#0095f6] hover:bg-[#1877f2] rounded-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Submit"}
          </Button>
        </form>

        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/">I already have an account</Link>
        </Button>
      </div>
    </div>
  );
}
