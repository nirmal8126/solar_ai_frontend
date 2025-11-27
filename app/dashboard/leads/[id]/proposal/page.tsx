"use client";

import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ProposalViewer() {
  const { id } = useParams();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const pdfUrl = `${API_URL}/leads/${id}/proposal?ts=${refreshKey}`;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/leads/${id}`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Proposal Preview</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh */}
          <Button
            variant="outline"
            onClick={() => setRefreshKey(Date.now())}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          {/* Download */}
          <a href={pdfUrl} target="_blank">
            <Button className="flex items-center gap-2 bg-blue-600 text-white">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </a>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="border rounded-xl overflow-hidden shadow-md bg-background">
        <iframe
          key={refreshKey}
          src={pdfUrl}
          className="w-full h-[85vh] rounded-xl"
        />
      </div>
    </div>
  );
}
