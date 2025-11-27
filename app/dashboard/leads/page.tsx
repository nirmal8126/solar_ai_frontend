"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  FileText,
  Loader2,
  Eye,
  Search,
  Hourglass,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch leads from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/leads/`)
      .then((res) => setLeads(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Status Config (Reusable UI)
  const statusConfig: Record<
    string,
    { label: string; className: string; icon: any }
  > = {
    new: {
      label: "New",
      className: "bg-blue-100 text-blue-700",
      icon: <Hourglass className="w-4 h-4" />,
    },
    in_progress: {
      label: "In Progress",
      className: "bg-amber-100 text-amber-700",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    },
    won: {
      label: "Won",
      className: "bg-emerald-100 text-emerald-700",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    lost: {
      label: "Lost",
      className: "bg-red-100 text-red-700",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  // Filter leads by search
  const filteredLeads = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return leads;

    return leads.filter(
      (lead) =>
        lead.customer_name?.toLowerCase().includes(s) ||
        lead.email?.toLowerCase().includes(s) ||
        lead.address?.toLowerCase().includes(s)
    );
  }, [leads, search]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Leads</h1>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Proposal</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <Loader2 className="animate-spin w-6 h-6 mx-auto" />
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted-foreground">
                  No leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const cfg = statusConfig[lead.status] || statusConfig["new"];

                return (
                  <tr
                    key={lead.id}
                    className="border-b hover:bg-muted/50 transition cursor-pointer"
                  >
                    {/* CUSTOMER */}
                    <td className="p-3 font-medium">{lead.customer_name}</td>

                    {/* EMAIL */}
                    <td className="p-3">{lead.email}</td>

                    {/* ADDRESS */}
                    <td className="p-3 truncate max-w-[200px]">{lead.address}</td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.className}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>

                    {/* PROPOSAL */}
                    <td className="p-3">
                      {lead.proposal_path ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <BadgeCheck className="w-4 h-4" /> Ready
                        </span>
                      ) : (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <FileText className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>

                    {/* ACTION */}
                    <td className="p-3 text-right">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
