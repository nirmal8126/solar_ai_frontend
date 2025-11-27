"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PhoneSchema } from "@/lib/validators/common";

// ZOD Schema for edit
const EditLeadSchema = z.object({
  customer_name: z.string().min(3, "Customer name should be 3+ chars"),
  email: z.string().email("Enter a valid email"),
  phone: PhoneSchema,
  address: z.string().min(5, "Address should be at least 5 characters"),
  property_type: z.string().min(3, "Enter Residential / Commercial"),
  avg_monthly_bill: z.coerce
    .number()
    .min(100, "Bill must be at least ₹100")
    .max(200000, "Enter a realistic bill"),
  status: z.enum(["new", "in_progress", "won", "lost"]),
});

export default function EditLeadPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(EditLeadSchema),
  });

  const billValue = watch("avg_monthly_bill");
  const systemSizeKw = billValue ? Math.round(Number(billValue) / 1300) : 0;

  // FETCH lead to pre-fill form
  useEffect(() => {
    axios
      .get(`${API_URL}/leads/${id}`)
      .then((res) => {
        const lead = res.data;
        setValue("customer_name", lead.customer_name);
        setValue("email", lead.email);
        setValue("phone", lead.phone);
        setValue("address", lead.address);
        setValue("property_type", lead.property_type);
        setValue("avg_monthly_bill", lead.avg_monthly_bill);
        setValue("status", lead.status);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onSubmit = async (data: any) => {
    await axios.put(`${API_URL}/leads/${id}`, {
      ...data,
      system_size_kw: systemSizeKw,
    });

    router.push(`/dashboard/leads/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Lead</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 bg-card p-6 rounded-xl border shadow"
      >
        {/* NAME */}
        <div>
          <label>Customer Name</label>
          <Input {...register("customer_name")} />
          {errors.customer_name && (
            <p className="text-red-500 text-sm">{errors.customer_name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label>Email</label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <label>Phone</label>
          <Input {...register("phone")} />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* ADDRESS */}
        <div>
          <label>Address</label>
          <Textarea rows={3} {...register("address")} />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <label>Property Type</label>
          <Input {...register("property_type")} placeholder="Residential / Commercial" />
          {errors.property_type && (
            <p className="text-red-500 text-sm">
              {errors.property_type.message}
            </p>
          )}
        </div>

        {/* BILL */}
        <div>
          <label>Average Monthly Bill (₹)</label>
          <Input type="number" {...register("avg_monthly_bill")} />
          {errors.avg_monthly_bill && (
            <p className="text-red-500 text-sm">
              {errors.avg_monthly_bill.message}
            </p>
          )}
        </div>

        {/* AUTO CALCULATED SYSTEM SIZE */}
        <div className="p-3 border rounded-lg bg-muted/30">
          <p className="font-medium">Estimated System Size</p>
          <p className="text-blue-600 text-xl font-bold">
            {systemSizeKw ? `${systemSizeKw} kW` : "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            Calculated dynamically from monthly bill.
          </p>
        </div>

        {/* STATUS */}
        <div>
          <label>Status</label>
          <select
            className="border rounded-lg p-2 w-full bg-background"
            {...register("status")}
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
