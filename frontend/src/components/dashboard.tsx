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

interface Data {
  normalized_transactions: [];
  detected_patterns: [];
}

export default function Dashboard() {
  // set the type for data
  const [data, setData] = useState<Data | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadCSV(file);
      setData(result);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Transaction Analyzer</h1>
          <Button
            variant="default"
            className="bg-zinc-900 text-white hover:bg-zinc-800"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
        </div>
      </header>

      <main className="flex-1 py-6">
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
          <div className="bg-white rounded-lg p-6">
            <MetricsCards data={data} />
          </div>

          <div className="bg-white rounded-lg p-6">
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
          </div>
        </div>
      </main>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </div>
  );
}
