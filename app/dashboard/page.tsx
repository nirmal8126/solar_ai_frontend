"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";


type Lead = {
  id: number;
  customer_name: string;
  email: string;
  address: string;
  property_type: string;
  avg_monthly_bill: number;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLeads = () => {
    setLoading(true);
    axios
      .get(`${API_URL}/leads`)
      .then((res) => setLeads(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
  const s = search.toLowerCase().trim();
    if (!s) return leads;

    return leads.filter(
      (lead) =>
        lead.customer_name?.toLowerCase().includes(s) ||
        lead.address?.toLowerCase().includes(s) ||
        lead.property_type?.toLowerCase().includes(s)
    );
  }, [leads, search]);


  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const inProgress = leads.filter((l) => l.status === "in_progress").length;
  const newLeads = leads.filter((l) => l.status === "new").length;

  const statusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-emerald-100 text-emerald-700";
      case "in_progress":
        return "bg-amber-100 text-amber-700";
      case "lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads Overview</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track all your solar enquiries and their status.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalLeads}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">New Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{newLeads}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{inProgress}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Won Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{wonLeads}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>All Leads</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
              <Input
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-sm">Loading leads…</p>
          ) : filteredLeads.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No leads found. Try changing the search.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Property</th>
                    <th className="p-3 text-left">Monthly Bill</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">View</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">

                      {/* Customer Info */}
                      <td className="p-3">
                        <div className="font-medium">{lead.customer_name}</div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </td>

                      {/* Address */}
                      <td className="p-3 text-sm text-gray-600">
                        {lead.address}
                      </td>

                      {/* Monthly Bill */}
                      <td className="p-3 text-sm text-gray-800">
                        ₹{lead.avg_monthly_bill}
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                          {lead.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
