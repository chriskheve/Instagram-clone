import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <Image
        src="/assets/logo.svg"
        alt="Instagram"
        width={175}
        height={55}
        priority
      />
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[var(--muted-foreground)]">from</span>
        <Image
          src="/assets/meta-logo-3.png"
          alt="Meta"
          width={54}
          height={18}
        />
        <span className="text-sm text-[var(--muted-foreground)]">Meta</span>
      </div>
    </div>
  );
}
