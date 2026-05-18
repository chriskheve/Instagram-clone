"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SignUpError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">Something went wrong</h2>
      <p className="text-sm text-[var(--muted-foreground)]">
        An error occurred during sign up. Please try again.
      </p>
      <Button asChild variant="outline" className="text-[var(--primary)] border-[var(--primary)]">
        <Link href="/sign-up">Try again</Link>
      </Button>
    </div>
  );
}
