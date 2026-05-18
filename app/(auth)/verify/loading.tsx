export default function VerifyLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <p className="text-base font-semibold text-[var(--foreground)]">Authenticating...</p>
      <p className="text-sm text-[var(--muted-foreground)]">
        Please wait while we securely sign you in.
      </p>
    </div>
  );
}
