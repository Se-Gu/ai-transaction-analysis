import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, CheckCircle } from "lucide-react";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
}: FileUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadComplete(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setUploadComplete(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
          <DialogDescription>
            Select a CSV file containing your transaction data to analyze.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csv-file" className="text-right">
              CSV File
            </Label>
            <div className="col-span-3">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
            </div>
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <File className="h-4 w-4" />
              <span>{file.name}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleUpload}
            disabled={!file || isUploading || uploadComplete}
          >
            {isUploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadComplete ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
