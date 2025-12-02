"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { Alert, Button, Chip, Input } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormik } from "formik";
import { mutate } from "swr";

import type { FormType, ScanIdentityCardData } from "@/types/identityNumber";

import { useFetchCreateIdentityCardSwrCore } from "@/hook/singleton/swrs/indentityCard/useFetchCreateIdentityCardSwr";
import { useFetchGetIdentitySwrCore } from "@/hook/singleton/swrs/indentityCard/useFetchGetIdentityCardSwr";
import { useFetchScanIdentityCardSwrCore } from "@/hook/singleton/swrs/indentityCard/useFetchScanIdentityCardSwr";

import { convertToDateInputFormat } from "@/modules/day";
import {
  genderKeyToLabel,
  // genderKeyToLabel,
  getNormalizedGenderLabel,
  validationIdentityNumberSchema,
} from "@/modules/profile/updateIdentityHelper";

export function IdentifyNumber() {
  // hook for scanning: get the SWR mutation object
  const scanHook = useFetchScanIdentityCardSwrCore();
  // create identity card hook
  const createHook = useFetchCreateIdentityCardSwrCore();
  // GET existing identity (if any)
  const getHook = useFetchGetIdentitySwrCore();

  const [idImageFront, setIdImageFront] = useState<string | null>(null);
  const [idImageBack, setIdImageBack] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [originalFront, setOriginalFront] = useState<string | null>(null);
  const [originalBack, setOriginalBack] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState<FormType | null>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState<FormType>({
    identifyNumber: "",
    fullName: "",
    birthDate: "",
    gender: "",
    nationality: "",
    recentLocation: "",
    issueDate: "",
    validDate: "",
    issuePlace: "",
    features: "",
    cardImages: [] as ScanIdentityCardData["cardImages"],
  });

  useEffect(() => {
    const d = getHook?.data?.data;
    if (!d) return;

    const cardImages = Array.isArray(d.cardImages) ? d.cardImages : [];
    setFormData((s) => ({
      ...s,
      identifyNumber: d.identifyNumber ?? "",
      fullName: d.fullName ?? "",
      birthDate: d.birthDate ?? "",
      gender: d.gender ?? "",
      nationality: d.nationality ?? "",
      recentLocation: d.recentLocation ?? "",
      issueDate: d.issueDate ?? "",
      validDate: d.validDate ?? "",
      issuePlace: d.issuePlace ?? "",
      features: d.features ?? "",
      cardImages,
    }));
  }, [getHook?.data]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // keep File objects for uploading
      if (side === "front") setFrontFile(file);
      else setBackFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        if (side === "front") setIdImageFront(data);
        else setIdImageBack(data);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik<FormType>({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: validationIdentityNumberSchema,
    onSubmit: async (values, helpers) => {
      try {
        helpers.setSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const payload: ScanIdentityCardData = {
          identifyNumber: values.identifyNumber,
          fullName: values.fullName,
          birthDate: values.birthDate,
          gender: getNormalizedGenderLabel(values.gender),
          nationality: values.nationality,
          recentLocation: values.recentLocation,
          validDate: values.validDate,
          issueDate: values.issueDate,
          issuePlace: values.issuePlace,
          features: values.features,
          cardImages: [
            {
              type: idImageFront ? "front" : idImageBack ? "back" : "unknown",
              description: idImageFront
                ? "Front image of ID"
                : idImageBack
                  ? "Back image of ID"
                  : "",
              imageUrl: idImageFront ?? idImageBack ?? "",
            },
          ],
        };
        console.log("Submitting identity card:", payload);

        const res = await createHook.createIdentityCard(payload);
        console.log("Response from create identity card:", res);
        if (res.statusCode === 200 || res.statusCode === 201) {
          setFormData(values);
          setAlertMessage("Cập nhật CCCD thành  công");
          setAlertColor("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setEditing(false);

          await mutate(`/iam/users/identity`);
        } else if (res.statusCode === 400 || res.statusCode === 500) {
          setAlertMessage(res.message);
          setAlertColor("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      } catch (e) {
        console.error(e);
        setAlertMessage("Lỗi khi cập nhật CCCD. Vui lòng thử lại.");
        setAlertColor("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const startEdit = () => {
    setOriginalForm(formData);
    setOriginalFront(idImageFront);
    setOriginalBack(idImageBack);
    setEditing(true);
  };

  const cancelEdit = () => {
    if (originalForm) setFormData(originalForm);
    setIdImageFront(originalFront);
    setIdImageBack(originalBack);
    setEditing(false);
  };

  const handleScan = async () => {
    if (!frontFile || !backFile) {
      setAlertMessage(
        "Vui lòng chọn/tải ảnh mặt trước và mặt sau của CCCD trước khi quét."
      );
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("frontImage", frontFile);
      fd.append("backImage", backFile);

      const res = await scanHook.trigger({ formData: fd });
      if (res && res.data) {
        const d = res.data;
        const cardImages: ScanIdentityCardData["cardImages"] = Array.isArray(
          d.cardImages
        )
          ? d.cardImages.length > 0
            ? d.cardImages
            : [
                {
                  type: "unknown",
                  description: "",
                  imageUrl: "",
                },
              ]
          : [
              {
                type: "unknown",
                description: "",
                imageUrl: "",
              },
            ];

        const frontUrl =
          cardImages.find((c) => c.type === "front")?.imageUrl ?? null;
        const backUrl =
          cardImages.find((c) => c.type === "back")?.imageUrl ?? null;

        if (frontUrl) {
          setIdImageFront(frontUrl);
          setFrontFile(null);
        }
        if (backUrl) {
          setIdImageBack(backUrl);
          setBackFile(null);
        }

        setFormData((s) => ({
          ...s,
          identifyNumber: d.identifyNumber ?? "",
          fullName: d.fullName ?? "",
          birthDate: convertToDateInputFormat(d.birthDate ?? ""),
          gender: d.gender ?? "",
          nationality: d.nationality ?? "",
          recentLocation: d.recentLocation ?? "",
          issueDate: convertToDateInputFormat(d.issueDate ?? ""),
          validDate: convertToDateInputFormat(d.validDate ?? ""),
          issuePlace: d.issuePlace ?? "",
          features: d.features ?? "",
          cardImages,
        }));
        setAlertMessage("Quét thông tin thành công");
        setAlertColor("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setAlertMessage(
          "Không thể trích xuất thông tin từ ảnh. Vui lòng thử lại."
        );
        setAlertColor("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setAlertMessage("Lỗi khi quét ảnh. Vui lòng thử lại.");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-md">
      {/* Persistent ID card missing warning */}
      {!formData.identifyNumber ? (
        <div className="mb-3 sm:mb-4">
          <Alert color="warning" className="text-xs sm:text-sm">
            Vui lòng cập nhật thông tin căn cước công dân để xác thực tài khoản.
          </Alert>
        </div>
      ) : null}

      {showAlert && alertMessage ? (
        <div className="mb-3 sm:mb-4">
          <Alert color={alertColor} className="text-xs sm:text-sm">
            {alertMessage}
          </Alert>
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-3">
        <div className="flex items-center justify-start gap-2 sm:gap-3">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Thông Tin Căn Cước Công Dân
          </h2>
          {formData.identifyNumber ? (
            <Chip color="success" size="sm" variant="flat">
              Đã xác thực
            </Chip>
          ) : (
            <Chip color="warning" size="sm" variant="flat">
              Chưa xác thực
            </Chip>
          )}
        </div>
        <div className="w-full sm:w-auto">
          {!editing ? (
            <div className="flex items-center gap-2">
              <Button
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg shadow-sm bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 dark:text-red-400 text-xs sm:text-sm"
                variant="solid"
                size="sm"
                onClick={startEdit}
                startContent={
                  <Icon icon="mdi:pencil" className="w-3 h-3 sm:w-4 sm:h-4" />
                }
              >
                Chỉnh sửa
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg shadow-sm bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 dark:text-red-400 text-xs sm:text-sm"
                variant="solid"
                size="sm"
                onClick={handleScan}
                disabled={scanHook.isMutating}
                startContent={
                  scanHook.isMutating ? (
                    <Icon
                      icon="mdi:loading"
                      className="w-3 h-3 sm:w-4 sm:h-4 animate-spin"
                    />
                  ) : (
                    <Icon
                      icon="mdi:barcode-scan"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                    />
                  )
                }
              >
                {scanHook.isMutating ? "Đang quét..." : "Quét"}
              </Button>
              <Button
                className="bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 text-xs sm:text-sm"
                variant="solid"
                size="sm"
                onClick={() => formik.submitForm()}
                disabled={
                  createHook.isMutating ||
                  formik.isSubmitting ||
                  formik.values.identifyNumber === ""
                }
              >
                {createHook.isMutating || formik.isSubmitting ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin"
                    />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
              <Button
                className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg shadow-sm bg-red-600 text-red-50 font-semibold text-xs sm:text-sm"
                variant="bordered"
                size="sm"
                onClick={cancelEdit}
              >
                Hủy
              </Button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="min-h-[55vh] flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Image Upload (Front / Back) */}
          <div className="flex flex-1 lg:flex-[0.4] flex-col justify-center">
            <div className="w-full max-w-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
              <div className="">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  Ảnh CCCD - Mặt trước
                </div>
                <div className="relative w-full aspect-[16/9] bg-muted rounded-lg border-2 border-dashed border-border hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer overflow-hidden group">
                  {idImageFront ? (
                    <>
                      <Image
                        src={idImageFront}
                        alt="CCCD Front"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Thay Đổi Ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Icon
                        icon="mdi-light:image"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2"
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-4">
                        Nhấp để tải ảnh mặt trước
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "front")}
                    disabled={!editing}
                    className={`absolute inset-0 opacity-0 ${
                      editing ? "cursor-pointer" : "pointer-events-none"
                    }`}
                  />
                </div>
              </div>

              <div className="">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  Ảnh CCCD - Mặt sau
                </div>
                <div className="relative full aspect-[16/9] bg-muted rounded-lg border-2 border-dashed border-border hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer overflow-hidden group">
                  {idImageBack ? (
                    <>
                      <Image
                        src={idImageBack}
                        alt="CCCD Back"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Thay Đổi Ảnh
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Icon
                        icon="mdi-light:image"
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2"
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground text-center px-2 sm:px-4">
                        Nhấp để tải ảnh mặt sau
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "back")}
                    disabled={!editing}
                    className={`absolute inset-0 opacity-0 ${
                      editing ? "cursor-pointer" : "pointer-events-none"
                    }`}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Định dạng: JPG, PNG. Kích thước tối đa: 5MB
            </p>
            {/* hidden input used by 'Quét thông tin' to trigger camera/file pick */}
            <input
              id="identify-scan-input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleImageUpload(e, "front")}
              className="hidden"
            />
          </div>

          {/* Right Column - Form Inputs */}
          <div className="flex flex-1 flex-col gap-3 sm:gap-4 justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <Input
                  label="Số Căn Cước"
                  value={formik.values.identifyNumber}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("identifyNumber", v)
                  }
                  isInvalid={
                    !!(
                      formik.touched.identifyNumber &&
                      formik.errors.identifyNumber
                    )
                  }
                  onBlur={() => formik.setFieldTouched("identifyNumber", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập số căn cước"
                />
                {formik.touched.identifyNumber &&
                  formik.errors.identifyNumber && (
                    <div className="text-xs text-red-500 mt-1">
                      {formik.errors.identifyNumber}
                    </div>
                  )}
              </div>
              <div>
                <Input
                  label="Họ Tên"
                  value={formik.values.fullName}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("fullName", v)
                  }
                  isInvalid={
                    !!(formik.touched.fullName && formik.errors.fullName)
                  }
                  onBlur={() => formik.setFieldTouched("fullName", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập họ tên"
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.fullName}
                  </div>
                )}
              </div>
              <div>
                <Input
                  label="Ngày Sinh"
                  value={formik.values.birthDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("birthDate", v)
                  }
                  isInvalid={
                    !!(formik.touched.birthDate && formik.errors.birthDate)
                  }
                  onBlur={() => formik.setFieldTouched("birthDate", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
                {formik.touched.birthDate && formik.errors.birthDate && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.birthDate}
                  </div>
                )}
              </div>
              <div>
                <Input
                  label="Giới tính"
                  value={genderKeyToLabel(formik.values.gender)}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("gender", v)
                  }
                  isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                  onBlur={() => formik.setFieldTouched("gender", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập giới tính"
                />
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.gender}
                  </div>
                )}
              </div>
              {/* <div>
                <label className="sr-only" htmlFor="gender-select">
                  Giới tính
                </label>
                <Select
                  name="gender"
                  label="Giới tính"
                  placeholder="Chọn giới tính"
                  value={formik.values.gender}
                  isInvalid={!!(formik.touched.gender && formik.errors.gender)}
                   onBlur={() => formik.setFieldTouched("gender", true)}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string | undefined;
                    formik.setFieldValue("gender", selected || "other");
                    formik.setFieldTouched("gender", true);
                  }}
                  onClose={() => formik.setFieldTouched("gender", true)}
                  classNames={{
                    base: "w-full",
                    trigger:
                     "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  startContent={
                    <Icon
                      icon="mdi:gender-male-female"
                      className="h-4 w-4 text-gray-500"
                    />
                  }
                >
                  <SelectItem key="male">Nam</SelectItem>
                  <SelectItem key="female">Nữ</SelectItem>
                  <SelectItem key="other">Khác</SelectItem>
                </Select>
                {formik.touched.gender && formik.errors.gender && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.gender}
                  </div>
                )}
              </div> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              <div>
                <Input
                  label="Nơi Cư Trú"
                  value={formik.values.recentLocation}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("recentLocation", v)
                  }
                  isInvalid={
                    !!(
                      formik.touched.recentLocation &&
                      formik.errors.recentLocation
                    )
                  }
                  onBlur={() => formik.setFieldTouched("recentLocation", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập nơi cư trú"
                />
                {formik.touched.recentLocation &&
                  formik.errors.recentLocation && (
                    <div className="text-xs text-red-500 mt-1">
                      {formik.errors.recentLocation}
                    </div>
                  )}
              </div>

              <div>
                <Input
                  label="Quốc Tịch"
                  value={formik.values.nationality}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("nationality", v)
                  }
                  isInvalid={
                    !!(formik.touched.nationality && formik.errors.nationality)
                  }
                  onBlur={() => formik.setFieldTouched("nationality", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập quốc tịch"
                />
                {formik.touched.nationality && formik.errors.nationality && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.nationality}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Ngày Cấp"
                  value={formik.values.issueDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("issueDate", v)
                  }
                  isInvalid={
                    !!(formik.touched.issueDate && formik.errors.issueDate)
                  }
                  onBlur={() => formik.setFieldTouched("issueDate", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
                {formik.touched.issueDate && formik.errors.issueDate && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.issueDate}
                  </div>
                )}
              </div>
              <div>
                <Input
                  label="Ngày Hết Hạn"
                  value={formik.values.validDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("validDate", v)
                  }
                  isInvalid={
                    !!(formik.touched.validDate && formik.errors.validDate)
                  }
                  onBlur={() => formik.setFieldTouched("validDate", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
                {formik.touched.validDate && formik.errors.validDate && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.validDate}
                  </div>
                )}
              </div>
              <div>
                <Input
                  label="Nơi cấp"
                  value={formik.values.issuePlace}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("issuePlace", v)
                  }
                  isInvalid={
                    !!(formik.touched.issuePlace && formik.errors.issuePlace)
                  }
                  onBlur={() => formik.setFieldTouched("issuePlace", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập nơi cấp"
                />
                {formik.touched.issuePlace && formik.errors.issuePlace && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.issuePlace}
                  </div>
                )}
              </div>
              <div>
                <Input
                  label="Dấu hiệu nhận dạng"
                  value={formik.values.features}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("features", v)
                  }
                  isInvalid={
                    !!(formik.touched.features && formik.errors.features)
                  }
                  onBlur={() => formik.setFieldTouched("features", true)}
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập dấu hiệu nhận dạng"
                />
                {formik.touched.features && formik.errors.features && (
                  <div className="text-xs text-red-500 mt-1">
                    {formik.errors.features}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[55vh] flex flex-col">
          {/* Right Column - Form Inputs */}

          <div className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6 justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <Input
                  label="Số Căn Cước"
                  value={formik.values.identifyNumber}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("identifyNumber", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập số căn cước"
                />
              </div>
              <div>
                <Input
                  label="Họ Tên"
                  value={formik.values.fullName}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("fullName", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <Input
                  label="Ngày Sinh"
                  value={formik.values.birthDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("birthDate", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
              </div>
              <div>
                <Input
                  label="Giới Tính"
                  value={genderKeyToLabel(formik.values.gender)}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("gender", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Chọn giới tính"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
              <div>
                <Input
                  label="Nơi Cư Trú"
                  value={formik.values.recentLocation}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("recentLocation", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập nơi cư trú"
                />
              </div>

              <div>
                <Input
                  label="Quốc Tịch"
                  value={formik.values.nationality}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("nationality", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập quốc tịch"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Ngày Cấp"
                  value={formik.values.issueDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("issueDate", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
              </div>
              <div>
                <Input
                  label="Ngày Hết Hạn"
                  value={formik.values.validDate}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("validDate", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  type="date"
                />
              </div>
              <div>
                <Input
                  label="Nơi cấp"
                  value={formik.values.issuePlace}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("issuePlace", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập nơi cấp"
                />
              </div>
              <div>
                <Input
                  label="Dấu hiệu nhận dạng"
                  value={formik.values.features}
                  onValueChange={(v: string) =>
                    formik.setFieldValue("features", v)
                  }
                  disabled={!editing}
                  classNames={{
                    input: "bg-background text-foreground",
                    inputWrapper:
                      "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                    label: "text-foreground",
                  }}
                  placeholder="Nhập dấu hiệu nhận dạng"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
