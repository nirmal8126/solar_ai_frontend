import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthQuotes } from "@/components/auth/auth-quotes";
import { AuthImages } from "@/components/auth/auth-images";
import { AuthLogo } from "@/components/auth/auth-logo";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first responsive layout */}
      <div className="flex min-h-screen flex-col md:flex-row">

        {/* Left side - Responsive on all devices */}
        <div className="hidden sm:block md:w-1/2 lg:w-3/5 bg-gradient-to-br from-white via-primary/10 to-primary/20 relative overflow-hidden">
          <div className="flex flex-col justify-between p-4 py-6 sm:p-6 lg:p-8 min-h-[200px] md:min-h-full">
            <AuthLogo />
            <div className="relative flex-1 min-h-0 hidden sm:block">
              <AuthImages />
              <AuthQuotes />
            </div>
          </div>
        </div>
        
        {/* Right side - Full width on mobile, responsive on larger screens */}
        <div className="flex w-full items-center justify-center p-4 sm:p-6 md:w-1/2 md:p-8 lg:w-2/5 lg:p-12 md:shadow-lg">
          <div className="w-full max-w-sm sm:max-w-md">

              <div className="m-auto mb-5 sm:hidden justify-center flex border-b pb-4">
                <AuthLogo />
              </div>

            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}