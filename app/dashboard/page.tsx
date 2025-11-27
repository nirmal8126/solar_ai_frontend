"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  Trophy,
  TrendingUp,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function OverviewDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch leads from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/leads/`)
      .then((res) => setLeads(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calculate Dashboard Stats
  const totalLeads = leads.length;
  const wonDeals = leads.filter((l) => l.status === "won").length;
  const proposals = leads.filter((l) => l.proposal_path).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((wonDeals / totalLeads) * 100) : 0;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Overview</h1>
        <Link href="/dashboard/leads/new">
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Lead
          </Button>
        </Link>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Leads */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Leads</CardTitle>
            <Users className="text-blue-600" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "…" : totalLeads}
          </CardContent>
        </Card>

        {/* Proposals */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Proposals Generated</CardTitle>
            <FileText className="text-purple-600" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "…" : proposals}
          </CardContent>
        </Card>

        {/* Won Deals */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Won Deals</CardTitle>
            <Trophy className="text-green-600" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "…" : wonDeals}
          </CardContent>
        </Card>

        {/* Conversion Rate */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conversion Rate</CardTitle>
            <TrendingUp className="text-orange-600" />
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {loading ? "…" : `${conversionRate}%`}
          </CardContent>
        </Card>
      </div>

      {/* RECENT LEADS */}
      <Card className="shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <Link href="/dashboard/leads">
            <Button variant="outline" className="flex items-center gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : recentLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/dashboard/leads/${lead.id}`}
                  className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition"
                >
                  <div>
                    <p className="font-medium">{lead.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.city || lead.address}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
