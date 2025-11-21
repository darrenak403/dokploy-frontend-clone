"use client";
import { useContext, useState } from "react";

import { SwrContext } from "../SwrProvider";

export interface UploadImageRequest {
  formData: FormData;
}

export interface UploadImageResponse {
  secure_url: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "darnrlpag";
const UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "Lab Management";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const useFetchUploadImgCore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<UploadImageResponse> => {
    setLoading(true);
    setError(null);
    try {
      if (!file) throw new Error("Missing file");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload image failed");
      }
      const data = await response.json();
      return data.secure_url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
};

export const useFetchUploadImgSingleton = () => {
  const { useFetchUploadImgSwr } = useContext(SwrContext)!;
  return useFetchUploadImgSwr;
};
