// Helper function: get status text in Vietnamese
export const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    AVAILABLE: "Có sẵn",
    OUT_OF_STOCK: "Hết hàng",
    EXPIRED: "Hết hạn sử dụng",
  };
  return statusMap[status] || status;
};

// Helper function: get status color
export const getStatusColor = (status: string) => {
  const colorMap: Record<string, "success" | "warning" | "danger" | "default"> =
    {
      AVAILABLE: "success",
      OUT_OF_STOCK: "warning",
      EXPIRED: "danger",
    };
  return colorMap[status] || "default";
};

export const getStatusIcon = (status: string) => {
  const iconMap: Record<string, string> = {
    AVAILABLE: "mdi:check-circle",
    OUT_OF_STOCK: "mdi:package-variant-closed",
    EXPIRED: "mdi:timer-alert",
  };
  return iconMap[status] || "mdi:help-circle";
};

// Get status display info for dropdown button styling
export const getStatusDisplay = (status: string) => {
  const statusMap: Record<
    string,
    { text: string; color: string; bgColor: string; borderColor: string }
  > = {
    AVAILABLE: {
      text: "Có sẵn",
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-500",
    },
    OUT_OF_STOCK: {
      text: "Hết hàng",
      color: "text-yellow-700 dark:text-yellow-300",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-500",
    },
    EXPIRED: {
      text: "Hết hạn sử dụng",
      color: "text-red-700 dark:text-red-300",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-500",
    },
  };
  return statusMap[status] || statusMap.OUT_OF_STOCK;
};
