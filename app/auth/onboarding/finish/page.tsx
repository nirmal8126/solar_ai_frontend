"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FinishPage() {
  const router = useRouter();

  const [step1, setStep1] = useState<any>(null);
  const [step2, setStep2] = useState<any>(null);
  const [step3, setStep3] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  // Load all onboarding data
  useEffect(() => {
    const s1 = localStorage.getItem("sunquote_onboard_step1");
    const s2 = localStorage.getItem("sunquote_onboard_step2");
    const s3 = localStorage.getItem("sunquote_onboard_step3");

    if (!s1) router.push("/auth/onboarding");
    if (!s2) router.push("/auth/onboarding/branding");
    if (!s3) router.push("/auth/onboarding/solar-settings");
    
    setStep1(JSON.parse(s1 || "{}"));
    setStep2(JSON.parse(s2 || "{}"));
    setStep3(JSON.parse(s3 || "{}"));
  }, []);

  const handleFinish = () => {
    setLoading(true);

    // Combine all onboarding data
    const onboardingData = {
      ...step1,
      ...step2,
      ...step3,
    };

    // In the future, this will be saved in the database
    localStorage.setItem("sunquote_onboard_completed", "true");
    localStorage.setItem("sunquote_full_profile", JSON.stringify(onboardingData));

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  if (!step1 || !step2 || !step3) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl bg-card border rounded-xl shadow-xl p-10 space-y-10">

        {/* TITLE */}
        <div>
          <h1 className="text-3xl font-bold text-center">Review Your Settings</h1>
          <p className="text-center text-muted-foreground">
            Here’s a summary of your SunQuote AI configuration.
          </p>
        </div>

        <div className="space-y-6">

          {/* BUSINESS DETAILS */}
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Business Details</h2>

            <div className="space-y-2 text-sm">
              <p><strong>Business Name:</strong> {step1.businessName}</p>
              <p><strong>Owner:</strong> {step1.ownerName}</p>
              <p><strong>Email:</strong> {step1.businessEmail}</p>
              <p><strong>State:</strong> {step1.state}</p>
              <p><strong>City:</strong> {step1.city}</p>
              <p><strong>Experience:</strong> {step1.experience} years</p>
            </div>
          </div>

          {/* BRANDING INFO */}
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Branding</h2>

            <div className="flex items-center gap-4 mb-4">
              {/* Logo */}
              <div className="w-16 h-16 border rounded-lg bg-white overflow-hidden flex items-center justify-center">
                {step2.logo ? (
                  <img src={step2.logo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-muted-foreground">No Logo</span>
                )}
              </div>

              {/* Brand name */}
              <div>
                <h3
                  className="font-bold text-2xl"
                  style={{ color: step2.brandColor }}
                >
                  {step1.businessName}
                </h3>
                <p className="text-muted-foreground">{step2.tagline}</p>
              </div>
            </div>

            <p>
              <strong>Primary Color:</strong>{" "}
              <span style={{ color: step2.brandColor }}>{step2.brandColor}</span>
            </p>
          </div>

          {/* SOLAR SETTINGS */}
          <div className="border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Solar Settings</h2>

            <div className="space-y-2 text-sm">
              <p><strong>Customer Type:</strong> {step3.customerType}</p>
              <p><strong>Price per kW:</strong> ₹{step3.pricePerKw}</p>
              <p>
                <strong>System Size Range:</strong> {step3.minKw} kW –{" "}
                {step3.maxKw} kW
              </p>
              <p><strong>Subsidy:</strong> {step3.subsidy}</p>
              <p><strong>GST:</strong> {step3.gstType}</p>
              <p><strong>Region:</strong> {step3.region}</p>
            </div>
          </div>
        </div>

        {/* FINISH BUTTON */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleFinish}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            "Complete Setup"
          )}
        </Button>
      </div>
    </div>
  );
}
