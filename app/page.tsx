"use client";

import { Button } from "@/components/ui/button";
import { Sun, Zap, ShieldCheck, Rocket, CheckCircle2 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}
      <header className="w-full border-b bg-background/70 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <div className="text-2xl font-bold flex items-center gap-2">
            <Sun className="text-yellow-500" /> SunQuote AI
          </div>

          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link href="/auth/signup">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="container mx-auto py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          AI-Powered Solar <span className="text-blue-600">Sales & Proposals</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Save time, close more deals, and automate your solar business with AI-generated
          proposals, instant savings calculations, and a powerful CRM.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Start Free
            </Button>
          </Link>

          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why SunQuote AI?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="text-blue-600" size={32} />}
            title="Instant AI Proposals"
            desc="Generate solar proposals instantly with system size, ROI, bill savings, and payback period."
          />

          <FeatureCard
            icon={<ShieldCheck className="text-green-600" size={32} />}
            title="Lead Management"
            desc="Track customer details, proposal status, follow-ups and team performance."
          />

          <FeatureCard
            icon={<Rocket className="text-orange-600" size={32} />}
            title="Boost Sales"
            desc="Close more deals with automated quotes and professional proposal PDFs."
          />
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="container mx-auto py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Simple Pricing</h2>
        <p className="text-muted-foreground mb-10">
          Start free. Upgrade anytime.
        </p>

        <div className="max-w-md mx-auto p-8 border rounded-2xl shadow-lg bg-card">
          <h3 className="text-2xl font-semibold">Starter Plan</h3>
          <p className="text-5xl font-bold mt-4">
            ₹999 <span className="text-lg text-muted-foreground">/ month</span>
          </p>

          <ul className="text-left mt-6 space-y-3">
            <PricingItem text="Unlimited AI Proposals" />
            <PricingItem text="Lead Management CRM" />
            <PricingItem text="Custom Branding" />
            <PricingItem text="Email & WhatsApp Notifications" />
          </ul>

          <Link href="/register">
            <Button size="lg" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center">
        <p className="text-muted-foreground">© SunQuote AI · Powered by AI</p>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 bg-card rounded-xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-2">{desc}</p>
    </div>
  );
}

// Pricing List item
function PricingItem({ text }: any) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <CheckCircle2 className="text-green-500 w-4 h-4" /> {text}
    </li>
  );
}
