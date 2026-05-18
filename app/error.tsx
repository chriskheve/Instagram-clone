"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Image
        src="/assets/logo.svg"
        alt="Instagram"
        width={175}
        height={55}
        priority
      />
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Something went wrong
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button onClick={reset} variant="outline" className="text-[var(--primary)] border-[var(--primary)]">
        Try again
      </Button>
    </div>
  );
}
