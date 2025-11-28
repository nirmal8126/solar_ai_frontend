"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud } from "lucide-react";
import { BusinessSchema } from "@/lib/validators/business";


export default function BrandingPage() {
  const router = useRouter();

  const [logo, setLogo] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState("#2563eb"); // Default: Blue-600
  const [tagline, setTagline] = useState("");

  const [loading, setLoading] = useState(false);

  // Load step1 data to ensure user completed previous step
  useEffect(() => {
    const step1 = localStorage.getItem("sunquote_onboard_step1");
    if (!step1) router.push("/auth/onboarding");
  }, []);

  const handleLogoUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setLoading(true);

    // Save data to localStorage
    const step2Data = {
      logo,
      brandColor,
      tagline,
    };

    localStorage.setItem("sunquote_onboard_step2", JSON.stringify(step2Data));

    setTimeout(() => {
      router.push("/auth/onboarding/solar-settings");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl bg-card border rounded-xl shadow-lg p-10 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          Step 2 — Customize Your Branding
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          Upload your business logo and choose your brand color.
        </p>

        {/* LOGO UPLOAD */}
        <div className="space-y-3">
          <label className="font-medium">Business Logo</label>

          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 p-3 rounded-lg flex items-center gap-2">
              <UploadCloud size={20} />
              Upload Logo
              <input type="file" className="hidden" onChange={handleLogoUpload} />
            </label>

            {logo ? (
              <img
                src={logo}
                className="w-16 h-16 rounded-lg object-cover border"
                alt="Logo Preview"
              />
            ) : (
              <div className="text-muted-foreground text-sm">
                Recommended: 300x300 PNG
              </div>
            )}
          </div>
        </div>

        {/* TAGLINE */}
        <div className="space-y-2">
          <label className="font-medium">Brand Tagline</label>
          <Input
            placeholder="Example: Empowering India with Solar Energy"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>

        {/* COLOR PICKER */}
        <div className="space-y-2">
          <label className="font-medium">Primary Brand Color</label>
          <Input
            type="color"
            className="w-20 h-12 p-1"
            value={brandColor}
            onChange={(e) => setBrandColor(e.target.value)}
          />
        </div>

        {/* PREVIEW */}
        <div className="border rounded-xl p-6 mt-6">
          <h2 className="font-bold text-xl mb-3">Preview</h2>

          <div className="flex items-center gap-4">
            {/* PREVIEW LOGO */}
            <div className="w-16 h-16 border rounded-lg bg-white flex items-center justify-center overflow-hidden">
              {logo ? (
                <img src={logo} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No Logo</span>
              )}
            </div>

            {/* TEXT PREVIEW */}
            <div>
              <h3 className="font-bold text-2xl" style={{ color: brandColor }}>
                SunQuote AI
              </h3>
              <p className="text-muted-foreground">{tagline || "Brand tagline here…"}</p>
            </div>
          </div>
        </div>

        {/* NEXT BUTTON */}
        <Button
          onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Continue"}
        </Button>
      </div>
    </div>
  );
}
