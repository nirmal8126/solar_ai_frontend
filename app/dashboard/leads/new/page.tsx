"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { PhoneSchema } from "@/lib/validators/common";

// Zod validation
const LeadSchema = z.object({
  customer_name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Enter a valid email"),
  phone: PhoneSchema,
  address: z.string().min(5, "Address must be at least 5 characters"),
  property_type: z.string().min(3),
  avg_monthly_bill: z.coerce
    .number()
    .min(100, "Bill must be at least ₹100")
    .max(200000, "Enter a realistic bill amount"),
});

export default function NewLeadPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(LeadSchema),
  });

  const billValue = watch("avg_monthly_bill");

  // Auto-calc system size (1 kW per ~1300 monthly bill, adjustable)
  const estimatedSizeKw = billValue ? Math.round(Number(billValue) / 1300) : 0;

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      system_size_kw: estimatedSizeKw,
    };

    await axios.post(`${API_URL}/leads/`, payload);

    router.push("/dashboard/leads");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold mb-4">Create New Lead</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-card p-6 rounded-xl border shadow-md">

        {/* CUSTOMER NAME */}
        <div>
          <label className="font-medium">Customer Name</label>
          <Input {...register("customer_name")} placeholder="John Doe" />
          {errors.customer_name && (
            <p className="text-red-500 text-sm">{errors.customer_name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label className="font-medium">Email</label>
          <Input {...register("email")} placeholder="email@example.com" />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label className="font-medium">Phone</label>
          <Input {...register("phone")} placeholder="9876543210" />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <label className="font-medium">Address</label>
          <Textarea
            {...register("address")}
            placeholder="Full address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <label className="font-medium">Property Type</label>
          <Input {...register("property_type")} placeholder="Residential / Commercial" />
          {errors.property_type && (
            <p className="text-red-500 text-sm">{errors.property_type.message}</p>
          )}
        </div>

        {/* MONTHLY BILL */}
        <div>
          <label className="font-medium">Average Monthly Bill (₹)</label>
          <Input type="number" {...register("avg_monthly_bill")} placeholder="Example: 2500" />
          {errors.avg_monthly_bill && (
            <p className="text-red-500 text-sm">{errors.avg_monthly_bill.message}</p>
          )}
        </div>

        {/* AUTO-CALCULATED SYSTEM SIZE */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <p className="font-medium">Estimated System Size</p>
          <p className="text-blue-600 font-semibold text-xl">
            {estimatedSizeKw > 0 ? `${estimatedSizeKw} kW` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            (auto-calculated based on monthly bill)
          </p>
        </div>

        {/* BUTTON */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Lead"}
        </Button>
      </form>
    </div>
  );
}
