"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing-utils";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function ImageUpload({ currentImageUrl, onUploadComplete }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload complete:", res);
      if (res && res[0]) {
        setPreview(res[0].url);
        onUploadComplete(res[0].url);
        toast.success("Image uploaded successfully!");
      }
      setUploading(false);
    },
    onUploadError: (error: Error) => {
      console.error("Upload error details:", error);
      toast.error(`Upload failed: ${error.message}`);
      setPreview(currentImageUrl || null);
      setUploading(false);
    },
    onUploadBegin: (fileName) => {
      console.log("Upload beginning for:", fileName);
      setUploading(true);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be less than 4MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to UploadThing
    console.log("Starting upload for file:", file.name, "Size:", file.size);
    startUpload([file]);
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete("");
  };

  const isLoading = uploading || isUploading;

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Plant preview"
            fill
            className="object-cover"
          />
          {!isLoading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <Loader2 className="h-10 w-10 mb-3 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 mb-3 text-muted-foreground" />
            )}
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 4MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      )}

      {isLoading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Uploading to UploadThing...
        </p>
      )}
    </div>
  );
}
