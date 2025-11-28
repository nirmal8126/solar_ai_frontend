"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SolarSettingsSchema } from "@/lib/validators/solar";


export default function SolarSettingsPage() {
  const router = useRouter();

  const [customerType, setCustomerType] = useState("Both");
  const [pricePerKw, setPricePerKw] = useState<number | string>(55000);
  const [minKw, setMinKw] = useState<number | string>(1);
  const [maxKw, setMaxKw] = useState<number | string>(15);
  const [subsidy, setSubsidy] = useState("Yes");
  const [gstType, setGstType] = useState("5%");
  const [region, setRegion] = useState("");

  const [loading, setLoading] = useState(false);

  // Redirect if Step 1 or 2 was not completed
  useEffect(() => {
    const s1 = localStorage.getItem("sunquote_onboard_step1");
    const s2 = localStorage.getItem("sunquote_onboard_step2");

    if (!s1) router.push("/auth/onboarding");
    if (!s2) router.push("/auth/onboarding/branding");
  }, []);

  const handleNext = () => {
    setLoading(true);

    const settingsData = {
      customerType,
      pricePerKw: Number(pricePerKw),
      minKw: Number(minKw),
      maxKw: Number(maxKw),
      subsidy,
      gstType,
      region,
    };

    localStorage.setItem("sunquote_onboard_step3", JSON.stringify(settingsData));

    setTimeout(() => router.push("/auth/onboarding/finish"), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl bg-card border rounded-xl shadow-lg p-10 space-y-8">
        <h1 className="text-3xl font-bold text-center">
          Step 3 — Solar Preferences
        </h1>
        <p className="text-center text-muted-foreground">
          Configure your default solar settings for proposals & leads.
        </p>

        {/* CUSTOMER TYPE */}
        <div className="space-y-2">
          <label className="font-medium">Type of Customers</label>
          <select
            className="border rounded-lg p-2 w-full bg-background"
            value={customerType}
            onChange={(e) => setCustomerType(e.target.value)}
          >
            <option>Residential</option>
            <option>Commercial</option>
            <option>Both</option>
          </select>
        </div>

        {/* PRICE PER KW */}
        <div className="space-y-2">
          <label className="font-medium">Default Price per kW (₹)</label>
          <Input
            type="number"
            value={pricePerKw}
            onChange={(e) => setPricePerKw(e.target.value)}
            placeholder="Example: 55000"
          />
        </div>

        {/* SYSTEM SIZE RANGE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Min System Size (kW)</label>
            <Input
              type="number"
              value={minKw}
              onChange={(e) => setMinKw(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label>Max System Size (kW)</label>
            <Input
              type="number"
              value={maxKw}
              onChange={(e) => setMaxKw(e.target.value)}
            />
          </div>
        </div>

        {/* SUBSIDY */}
        <div className="space-y-2">
          <label className="font-medium">Subsidy Available?</label>
          <select
            className="border rounded-lg p-2 w-full bg-background"
            value={subsidy}
            onChange={(e) => setSubsidy(e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* GST TYPE */}
        <div className="space-y-2">
          <label className="font-medium">GST Type</label>
          <select
            className="border rounded-lg p-2 w-full bg-background"
            value={gstType}
            onChange={(e) => setGstType(e.target.value)}
          >
            <option>0%</option>
            <option>5%</option>
            <option>12%</option>
            <option>18%</option>
          </select>
        </div>

        {/* REGION */}
        <div className="space-y-2">
          <label className="font-medium">Installation Region</label>
          <Input
            placeholder="Example: Maharashtra, Gujarat, Delhi"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
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
