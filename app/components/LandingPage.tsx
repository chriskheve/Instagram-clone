import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SignInForm from "@/app/(auth)/components/SignInForm";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)]">
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        {/* Left section */}
        <div className="hidden lg:flex flex-col gap-6 max-w-sm w-full mr-8">
          <Image
            src="/assets/logo.svg"
            alt="Instagram"
            width={175}
            height={55}
            priority
          />
          <h1 className="text-4xl font-semibold leading-tight text-[var(--foreground)]">
            See everyday moments from your{" "}
            <span className="text-[#e1306c]">close friends.</span>
          </h1>
          <div className="relative w-full h-[400px]">
            <Image
              src="/assets/branding-image.png"
              alt="Instagram app preview"
              fill
              className="object-contain object-top"
            />
          </div>
        </div>

        {/* Vertical separator */}
        <Separator orientation="vertical" className="hidden lg:block h-[500px] mx-6" />

        {/* Right section */}
        <div className="w-full max-w-xs">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
