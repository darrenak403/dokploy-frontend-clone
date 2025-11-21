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
