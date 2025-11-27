"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginSchema } from "@/lib/validators/auth";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: any) => {
    setServerError("");

    const res: any = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setServerError("Invalid email or password");
      return;
    }

    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card border rounded-xl shadow-lg p-8 space-y-6">

        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

        <p className="text-center text-muted-foreground">
          Log in to your SunQuote AI account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label>Email</label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label>Password</label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
