"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const BusinessSchema = z.object({
  businessName: z.string().min(3, "Business name must be at least 3 characters"),
  ownerName: z.string().min(3, "Owner name must be at least 3 characters"),
  businessEmail: z.string().email("Enter a valid email"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
});


export default function OnboardingStep1() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(BusinessSchema),
  });

  const onSubmit = async (data: any) => {
    localStorage.setItem("sunquote_onboard_step1", JSON.stringify(data));
    router.push("/onboarding/branding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl bg-card border rounded-xl shadow-lg p-10 space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Step 1 — Business Details
        </h1>
        <p className="text-center text-muted-foreground">
          Help us personalize your SunQuote AI workspace.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* BUSINESS NAME */}
          <div>
            <label>Business Name</label>
            <Input {...register("businessName")} placeholder="Example: SolarMax Energy" />
            {errors.businessName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessName.message as string}
              </p>
            )}
          </div>

          {/* OWNER NAME */}
          <div>
            <label>Owner Name</label>
            <Input {...register("ownerName")} placeholder="Example: Rajesh Kumar" />
            {errors.ownerName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerName.message as string}
              </p>
            )}
          </div>

          {/* BUSINESS EMAIL */}
          <div>
            <label>Business Email</label>
            <Input
              type="email"
              {...register("businessEmail")}
              placeholder="business@example.com"
            />
            {errors.businessEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.businessEmail.message as string}
              </p>
            )}
          </div>

          {/* STATE */}
          <div>
            <label>State</label>
            <Input {...register("state")} placeholder="Example: Maharashtra" />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message as string}
              </p>
            )}
          </div>

          {/* CITY */}
          <div>
            <label>City</label>
            <Input {...register("city")} placeholder="Example: Mumbai" />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">
                {errors.city.message as string}
              </p>
            )}
          </div>

          {/* EXPERIENCE */}
          <div>
            <label>Solar Experience (Years)</label>
            <Input
              type="number"
              {...register("experience", { valueAsNumber: true })}
              placeholder="0 to 50"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">
                {errors.experience.message as string}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Continue"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
