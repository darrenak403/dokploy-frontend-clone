import * as Yup from "yup";

// Helper function: get status text in Vietnamese
export const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    READY: "Sẵn sàng",
    PROCESSING: "Đang xử lý",
    MAINTENANCE: "Bảo trì",
    ERROR: "Lỗi",
    INACTIVE: "Không hoạt động",
  };
  return statusMap[status] || status;
};

// Helper function: get status color
export const getStatusColor = (status: string) => {
  const colorMap: Record<
    string,
    "success" | "warning" | "danger" | "default" | "primary"
  > = {
    READY: "success",
    PROCESSING: "primary",
    MAINTENANCE: "warning",
    ERROR: "danger",
    INACTIVE: "default",
  };
  return colorMap[status] || "default";
};

export const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    READY: "mdi:check-circle",
    PROCESSING: "mdi:cog",
    MAINTENANCE: "mdi:wrench",
    ERROR: "mdi:alert-circle",
    INACTIVE: "mdi:power-off",
  };
  return iconMap[status] || "mdi:help-circle";
};

// Get status display info
export const getStatusDisplay = (status: string) => {
  const statusMap: Record<
    string,
    { text: string; color: string; bgColor: string; borderColor: string }
  > = {
    READY: {
      text: "Sẵn sàng",
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-500",
    },
    PROCESSING: {
      text: "Đang xử lý",
      color: "text-purple-700 dark:text-purple-300",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-500",
    },
    MAINTENANCE: {
      text: "Bảo trì",
      color: "text-yellow-700 dark:text-yellow-300",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-500",
    },
    ERROR: {
      text: "Lỗi",
      color: "text-red-700 dark:text-red-300",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-500",
    },
    INACTIVE: {
      text: "Không hoạt động",
      color: "text-gray-700 dark:text-gray-300",
      bgColor: "bg-gray-50 dark:bg-gray-900/20",
      borderColor: "border-gray-500",
    },
  };
  return statusMap[status] || statusMap.INACTIVE;
};

export const createInstrumentValidationSchema = Yup.object({
  name: Yup.string()
    .required("Tên thiết bị là bắt buộc")
    .min(5, "Tên thiết bị phải có ít nhất 5 ký tự")
    .max(100, "Tên thiết bị không được quá 100 ký tự"),
  serialNumber: Yup.string()
    .required("Số seri là bắt buộc")
    .matches(
      /^[A-Z0-9-]+$/,
      "Số seri chỉ được chứa chữ in hoa, số và dấu gạch ngang"
    )
    .min(3, "Số seri phải có ít nhất 3 ký tự")
    .max(50, "Số seri không được quá 50 ký tự"),
});
