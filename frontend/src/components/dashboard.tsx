"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { MetricsCards } from "./metrics-cards";
import { MerchantAnalysis } from "./merchant-analysis";
import { PatternDetection } from "./pattern-detection";
import { FileUploadModal } from "./file-upload-modal";
import { uploadCSV } from "@/utils/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadCSV(file);
      setData(result);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Transaction Analyzer</h1>
        <Button
          variant="default"
          className="bg-zinc-900 text-white hover:bg-zinc-800"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV
        </Button>
      </header>

      <MetricsCards data={data} />

      <Tabs defaultValue="merchant-analysis" className="w-full">
        <TabsList className="bg-transparent border-b rounded-none h-auto p-0 mb-6">
          <TabsTrigger
            value="merchant-analysis"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            Merchant Analysis
          </TabsTrigger>
          <TabsTrigger
            value="pattern-detection"
            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-black data-[state=active]:bg-transparent"
          >
            Pattern Detection
          </TabsTrigger>
        </TabsList>
        <TabsContent value="merchant-analysis">
          <MerchantAnalysis data={data?.normalized_transactions} />
        </TabsContent>
        <TabsContent value="pattern-detection">
          <PatternDetection data={data?.detected_patterns} />
        </TabsContent>
      </Tabs>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}
