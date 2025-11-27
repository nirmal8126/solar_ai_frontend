"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api";
import { RefreshCw } from "lucide-react";

import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  SunMedium,
  Loader2,
  CheckCircle2,
  Hourglass,
  XCircle,
  Home,
  FileText,
  Zap,
  BadgeCheck,
  Download,
  Sun,
  PhoneCall,
  ClipboardList,
} from "lucide-react";

type Lead = {
  id: number;
  customer_name: string;
  phone: string;
  email: string;
  address: string;
  property_type: string;
  avg_monthly_bill: number;
  system_size_kw: number | null;
  status: string;
  ai_summary?: string | null;
  utility?: string | null;
  proposal_path?: string | null;
};

export default function LeadDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [loadingProposal, setLoadingProposal] = useState(false);

  // Fetch Lead
  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_URL}/leads/${id}`)
      .then((res) => setLead(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Status badge UI config
  const statusConfig: Record<
    string,
    { label: string; className: string; icon: React.ReactNode }
  > = {
    new: {
      label: "New",
      className: "bg-blue-100 text-blue-700",
      icon: <Hourglass className="w-3 h-3 mr-1" />,
    },
    in_progress: {
      label: "In Progress",
      className: "bg-amber-100 text-amber-700",
      icon: <Loader2 className="w-3 h-3 mr-1" />,
    },
    won: {
      label: "Won",
      className: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="w-3 h-3 mr-1" />,
    },
    lost: {
      label: "Lost",
      className: "bg-red-100 text-red-700",
      icon: <XCircle className="w-3 h-3 mr-1" />,
    },
  };

  // Update Lead Status
  const handleStatusChange = async (newStatus: string) => {
    if (!lead || newStatus === lead.status) return;

    setStatusUpdating(true);

    try {
      await axios.put(`${API_URL}/leads/${lead.id}`, {
        status: newStatus,
      });
      setLead({ ...lead, status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Lead Not Found
  if (!lead) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Leads
        </Button>
        <p className="mt-4 text-red-500">Lead not found.</p>
      </div>
    );
  }

  const config = statusConfig[lead.status] ?? statusConfig["new"];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold">{lead.customer_name}</h1>
            <p className="text-sm text-gray-500">Lead #{lead.id}</p>
          </div>
        </div>

        <Badge
          className={`flex items-center text-sm px-3 py-1 ${config.className}`}
        >
          {config.icon}
          {config.label}
        </Badge>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Customer Details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Customer Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <BadgeCheck className="w-4 h-4 text-green-600" />
                <span className="font-medium">{lead.customer_name}</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-gray-500" />
                <span>{lead.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{lead.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-gray-500" />
                <span>{lead.property_type}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                <span>{lead.address}</span>
              </div>

              {lead.utility && (
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>{lead.utility}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Status */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Lead Status</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Update the sales status of this lead.
              </p>

              <div className="flex flex-wrap gap-2">
                {/* Status Buttons */}
                {["new", "in_progress", "won", "lost"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={lead.status === s ? "default" : "outline"}
                    onClick={() => handleStatusChange(s)}
                    disabled={statusUpdating}
                  >
                    {s.replace("_", " ").toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-orange-500" />
              Solar System Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                Estimated System Size: {lead.system_size_kw} kW
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="font-medium">
                Avg Monthly Bill: ₹{lead.avg_monthly_bill}
              </span>
            </div>

            {/* PROPOSAL ACTIONS */}
            <div className="mt-4 space-y-3">
              <a href={`/dashboard/leads/${id}/proposal`}>
                <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                  View Proposal
                </button>
              </a>

              {/* Download Proposal */}
              {lead.proposal_path ? (
                <a href={`${API_URL}/leads/${id}/proposal`} target="_blank">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <Download className="w-4 h-4" />
                    Download Proposal
                  </button>
                </a>
              ) : (
                <p className="text-xs text-gray-500">Proposal generating…</p>
              )}

              {/* Regenerate PDF */}
              <button
                onClick={async () => {
                  setLoadingProposal(true);

                  try {
                    const res = await axios.post(
                      `${API_URL}/leads/${id}/proposal/regenerate`
                    );

                    // update UI with new path
                    setLead((prev: any) => ({
                      ...prev,
                      proposal_path: res.data.proposal_path,
                    }));
                  } catch (err) {
                    console.error(err);
                    alert("Failed to regenerate proposal");
                  }

                  setLoadingProposal(false);
                }}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg"
              >
                {loadingProposal ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {loadingProposal ? "Regenerating..." : "Regenerate Proposal"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
