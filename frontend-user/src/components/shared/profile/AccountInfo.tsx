"use client";
import { useState } from "react";

import { Avatar, Button, Input, Select, SelectItem } from "@heroui/react";
import { Alert } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

import { UpdateProfilePayload } from "@/types/profile";

import { RootState } from "@/redux/store";

// upload types are used in UpdateAvatarModal
import { useUpdateAvatarDisclosureSingleton } from "@/hook/singleton/discloresures/profile/useUpdateAvatarDisclosure";
import { useFetchUpdateProfileSwrSingleton } from "@/hook/singleton/swrs";

import {
  convertToDateInputFormat,
  convertToDdMmYyyyFormat,
  formatDateDisplay,
  parseDateOnly,
} from "@/modules/day";
import {
  getGenderLabel,
  mapInputToGenderKey,
  validationUpdateUserSchema,
} from "@/modules/profile/updateProfileHelper";

import DefaultLogo from "../../../../public/images/gct.png";

export function AccountInfo() {
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.data?.user;
  const userId = authState.data?.user?.id ?? undefined;
  type FormValues = UpdateProfilePayload & { id?: number | null };
  // Alert state (use HeroUI Alert instead of window.alert)
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  // avatar upload is handled by UpdateAvatarModal
  const updateProfileSwr = useFetchUpdateProfileSwrSingleton?.();
  // upload handled in UpdateAvatarModal
  const { onOpen: openUpdateAvatar } = useUpdateAvatarDisclosureSingleton();

  // Open update-avatar modal when avatar clicked
  const handleChangeAvatar = () => {
    console.log("Change Avatar Clicked");
    openUpdateAvatar();
  };

  const initialForm: FormValues = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    dateOfBirth: (() => {
      if (!user?.dateOfBirth) return "";
      const d = parseDateOnly(user.dateOfBirth);
      if (d) return formatDateDisplay(d);
      return user.dateOfBirth;
    })(),
    gender: user?.gender || "",
    phone: user?.phone || "",
    address: user?.address || "",
  };

  const formik = useFormik<FormValues>({
    initialValues: initialForm,
    enableReinitialize: true,
    validationSchema: validationUpdateUserSchema,
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);
        if (!updateProfileSwr) {
          setAlertMessage("Update hook not available");
          setAlertColor("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
          setIsLoading(false);
          return;
        }
        const genderKey = mapInputToGenderKey(values.gender);
        const payload = {
          ...values,
          gender: genderKey || undefined,
          dateOfBirth: values.dateOfBirth || undefined,
        };
        const res = await updateProfileSwr.updateProfile({
          id: userId,
          payload,
        });

        await new Promise((r) => setTimeout(r, 3000));
        if (res && res.data) {
          setEditing(false);
          setAlertMessage("Cập nhật hồ sơ thành công");
          setAlertColor("success");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        } else {
          setAlertMessage("Cập nhật thất bại");
          setAlertColor("danger");
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      } catch (e) {
        console.error(e);
        setAlertMessage("Lỗi khi cập nhật hồ sơ");
        setAlertColor("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } finally {
        helpers.setSubmitting(false);
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-md">
      {/* Title */}
      {showAlert && alertMessage ? (
        <div className="mb-4">
          <Alert color={alertColor}>{alertMessage}</Alert>
        </div>
      ) : null}

      {/* Avatar + Info + Edit Button Section */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <button
              type="button"
              onClick={handleChangeAvatar}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleChangeAvatar();
                }
              }}
              aria-label="Mở cập nhật ảnh đại diện"
              className="inline-block p-0 m-0 bg-transparent border-0 cursor-pointer relative"
            >
              <Avatar
                src={user?.avatarUrl || DefaultLogo.src}
                alt="avatar"
                className="w-24 h-24"
                size="lg"
                name={user?.fullName?.split(" ").slice(-1)[0]?.[0] ?? "U"}
                showFallback
                fallback={
                  <Icon
                    icon="mdi:account"
                    className="w-12 h-12 text-gray-400"
                  />
                }
              />

              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full bg-black/30 dark:bg-white/20 text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Icon icon="mdi:cloud-upload-outline" className="w-5 h-5" />
                </span>
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            {!editing ? (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.fullName || "Chưa có tên"}
              </h3>
            ) : (
              <div className="w-full">
                <input
                  id="fullName"
                  name="fullName"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!editing}
                  aria-invalid={
                    formik.touched.fullName && !!formik.errors.fullName
                  }
                  placeholder="Nhập họ và tên"
                  className="w-full bg-transparent text-gray-900 dark:text-white text-xl font-semibold placeholder:text-gray-500 focus:outline-none"
                  style={{ border: 0, padding: 0, margin: 0 }}
                />
                {formik.touched.fullName && formik.errors.fullName ? (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.fullName}
                  </p>
                ) : null}
              </div>
            )}
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email || "Chưa có email"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!editing ? (
            <Button
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                     bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 
                     dark:text-red-400"
              variant="solid"
              startContent={<Icon icon="mdi:pencil" className="w-4 h-4" />}
              onClick={() => {
                // prefill backend key so select shows correct option when editing
                formik.setFieldValue("gender", user?.gender ?? "");
                setEditing(true);
              }}
            >
              Chỉnh sửa
            </Button>
          ) : (
            <>
              <Button
                variant="solid"
                className="mr-2 bg-red-50 text-red-600 font-semibold dark:bg-red-900/20 flex items-center"
                onClick={() => formik.submitForm()}
                disabled={
                  formik.isSubmitting ||
                  updateProfileSwr?.isMutating ||
                  isLoading
                }
              >
                {formik.isSubmitting ||
                updateProfileSwr?.isMutating ||
                isLoading ? (
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
              <Button
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm
                     bg-red-600 text-red-50 font-semibold"
                variant="solid"
                onClick={() => {
                  formik.resetForm();
                  setEditing(false);
                }}
              >
                Hủy
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Ngày sinh
            </label>
          </div>
          {!editing ? (
            <Input
              name="yob"
              label="Ngày sinh"
              placeholder="dd/mm/yyyy"
              value={formik.values.dateOfBirth || ""}
              disabled={!editing}
              classNames={{
                base: "w-full",
                input: "bg-background text-foreground",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                label: "text-foreground",
              }}
              startContent={
                <Icon icon="mdi:calendar" className="h-4 w-4 text-gray-500" />
              }
            />
          ) : (
            <div>
              <Input
                name="yob"
                label="Ngày sinh"
                placeholder="dd/mm/yyyy"
                type="date"
                value={convertToDateInputFormat(
                  formik.values.dateOfBirth || ""
                )}
                onChange={(e) => {
                  const ddmmyyyy = convertToDdMmYyyyFormat(e.target.value);
                  formik.setFieldValue("dateOfBirth", ddmmyyyy);
                }}
                onBlur={formik.handleBlur}
                isInvalid={
                  formik.touched.dateOfBirth && !!formik.errors.dateOfBirth
                }
                errorMessage={
                  formik.touched.dateOfBirth ? formik.errors.dateOfBirth : ""
                }
                classNames={{
                  base: "w-full",
                  input: "bg-background text-foreground",
                  inputWrapper:
                    "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                  label: "text-foreground",
                }}
                startContent={
                  <Icon icon="mdi:calendar" className="h-4 w-4 text-gray-500" />
                }
              />
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Giới tính
            </label>
          </div>
          {!editing ? (
            <Input
              name="gender"
              label="Giới tính"
              placeholder="Nhập giới tính"
              value={getGenderLabel(formik.values.gender)}
              disabled
              classNames={{
                base: "w-full",
                input:
                  "bg-background text-foreground placeholder:text-gray-500",
                inputWrapper:
                  "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
                label: "text-foreground",
              }}
              startContent={
                <Icon
                  icon="mdi:gender-male-female"
                  className="h-4 w-4 text-gray-500"
                />
              }
            />
          ) : (
            <div>
              <label className="sr-only" htmlFor="gender-select">
                Giới tính
              </label>
              <Select
                name="gender"
                label="Giới tính"
                placeholder="Chọn giới tính"
                selectedKeys={
                  formik.values.gender ? [formik.values.gender] : []
                }
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string | undefined;
                  formik.setFieldValue("gender", selected || "other");
                  formik.setFieldTouched("gender", true);
                }}
                onClose={() => formik.setFieldTouched("gender", true)}
                classNames={{
                  base: "w-full",
                  trigger:
                    "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus:border-coral-500 bg-background",
                  label: "text-foreground",
                  value: "text-foreground",
                  popoverContent:
                    "bg-background border border-gray-200 dark:border-gray-700",
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
            </div>
          )}
        </div>

        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Số điện thoại
            </label>
          </div>
          <Input
            name="phone"
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editing}
            isInvalid={formik.touched.phone && !!formik.errors.phone}
            errorMessage={formik.touched.phone ? formik.errors.phone : ""}
            classNames={{
              base: "w-full",
              input: "bg-background text-foreground placeholder:text-gray-500",
              inputWrapper:
                "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
              label: "text-foreground",
            }}
            startContent={
              <Icon icon="mdi:phone" className="h-4 w-4 text-gray-500" />
            }
          />
        </div>

        {/* Địa chỉ */}

        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Địa chỉ
            </label>
          </div>
          <Input
            name="address"
            label="Địa chỉ"
            placeholder="Nhập địa chỉ của bệnh nhân"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!editing}
            isInvalid={formik.touched.address && !!formik.errors.address}
            errorMessage={formik.touched.address ? formik.errors.address : ""}
            classNames={{
              base: "w-full",
              input: "bg-background text-foreground placeholder:text-gray-500",
              inputWrapper:
                "border border-gray-200 dark:border-gray-700 hover:border-coral-500 focus-within:border-coral-500 bg-background",
              label: "text-foreground",
            }}
            startContent={
              <Icon icon="mdi:map-marker" className="text-gray-500 mt-[3px]" />
            }
          />
        </div>
      </div>
    </div>
  );
}
