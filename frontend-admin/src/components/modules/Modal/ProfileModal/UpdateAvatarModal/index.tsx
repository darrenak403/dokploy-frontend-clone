"use client";
import React, { useCallback, useState } from "react";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Slider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Cropper, { Area } from "react-easy-crop";

import { useUpdateAvatarDisclosureSingleton } from "@/hook/singleton/discloresures/profile/useUpdateAvatarDisclosure";
import { useFetchUpdateAvatarUrlSwrSingleton } from "@/hook/singleton/swrs/profile/useFetchUpdateAvatarUrlSwr";
import { useFetchUploadImgSingleton } from "@/hook/singleton/swrs/uploadImage/useFetchUploadImage";

import getCroppedImg from "@/modules/CropImage";

const UpdateAvatarModal: React.FC = () => {
  const { onClose, isOpen } = useUpdateAvatarDisclosureSingleton();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uploadHook = useFetchUploadImgSingleton?.();
  const updateAvatarHook = useFetchUpdateAvatarUrlSwrSingleton?.();
  // đọc file
  const readFile = (file: File) => {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.addEventListener("error", (err) => reject(err), false);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
    }
  };

  //dùng để xử lý sự kiện kéo thả
  const onDropHandler = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      const file = dt.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
    }
  };
  //dùng để xử lý sự kiện kéo thả
  const onDragOverHandler = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  //dùng để xử lý sự kiện kéo thả
  const onDragLeaveHandler = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  //dùng để xử lý sự kiện kéo thả
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  // Xử lý lưu ảnh đã cắt và cập nhật avatar
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      setLoading(true);
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (!croppedImageFile) throw new Error("Failed to crop image");
      if (!uploadHook || !uploadHook.uploadImage) {
        throw new Error("Upload hook not available");
      }
      const uploadedRaw = await uploadHook.uploadImage(
        croppedImageFile as File
      );
      const url =
        typeof uploadedRaw === "string"
          ? uploadedRaw
          : String(uploadedRaw ?? "");

      if (!updateAvatarHook || !updateAvatarHook.updateProfile) {
        throw new Error("Update avatar hook not available");
      }
      const res = await updateAvatarHook.updateProfile({
        payload: { avatarUrl: url },
      });
      if (res && res.data) {
        onClose();
        setImageSrc(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      } else {
        console.error("Update avatar failed", res);
      }
    } catch (err) {
      console.error("Upload/update avatar error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    onClose();
  };

  return (
    <Modal
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      isOpen={isOpen}
      onOpenChange={handleClose}
      size="xl"
      classNames={{
        base: "max-h-[90vh] bg-background",
        header: "border-b border-gray-200 dark:border-gray-700 bg-background",
        body: "bg-background",
        footer: "border-t border-gray-200 dark:border-gray-700 bg-background",
        backdrop: "bg-black/50 dark:bg-black/70",
        wrapper: "items-center justify-center",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 bg-background text-foreground">
          <Icon icon="mdi:account-circle" className="h-5 w-5 text-coral-500" />
          <span className="text-foreground">Cập nhật ảnh đại diện</span>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              onChange={onFileChange}
              accept="image/*"
              className="hidden"
              id="avatar-upload-input"
            />

            {imageSrc ? (
              <>
                <div className="relative w-full h-80 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="round"
                    showGrid={false}
                  />
                </div>
                <div className="w-full max-w-xs flex flex-col gap-2">
                  <label className="text-sm text-default-500">Phóng to</label>
                  <Slider
                    value={zoom}
                    onChange={(v: number | number[]) =>
                      setZoom(
                        Array.isArray(v) ? (v[0] as number) : (v as number)
                      )
                    }
                    minValue={0}
                    maxValue={1}
                    step={0.01}
                    aria-label="Zoom"
                    className="w-full"
                    color="danger"
                  />
                </div>
              </>
            ) : (
              <label
                htmlFor="avatar-upload-input"
                onDrop={onDropHandler}
                onDragOver={onDragOverHandler}
                onDragLeave={onDragLeaveHandler}
                className={`w-full py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-150 group ${
                  isDragging
                    ? "ring-2 ring-red-400 bg-red-50/30 border-red-300 text-red-600 border-solid"
                    : "border border-dashed border-default-300 text-default-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-20 h-20 rounded-full mb-4 transition-colors duration-150
                    ${isDragging ? "bg-red-50/40" : "bg-muted/30"}`}
                >
                  <Icon
                    icon="mdi:cloud-upload-outline"
                    className={`w-8 h-8 transition-colors duration-150 ${
                      isDragging
                        ? "text-red-600"
                        : "text-default-400 group-hover:text-red-600"
                    }`}
                  />
                </div>
                <p
                  className={`mb-1 text-sm font-medium ${
                    isDragging ? "text-red-700" : ""
                  }`}
                >
                  {!isDragging ? "Chọn ảnh" : "Thả ảnh vào đây"}
                </p>
                <p className="mb-4 text-xs text-default-400 max-w-xs">
                  Click để chọn ảnh (JPG/PNG) hoặc kéo thả ảnh vào đây!
                </p>
              </label>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onClick={handleClose}
            className="px-4 py-2 rounded-md"
          >
            Hủy
          </Button>
          <Button
            variant="solid"
            onClick={handleSave}
            disabled={!imageSrc || loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                     bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 
                     dark:text-red-400"
          >
            {loading ? (
              <>
                <Icon
                  icon="mdi:loading"
                  className="w-4 h-4 mr-2 animate-spin"
                />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateAvatarModal;
