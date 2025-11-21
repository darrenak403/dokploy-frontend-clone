// Helper functions for status colors
export const getStatusColor = (
  status: string
): "success" | "warning" | "danger" | "default" => {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "danger";
    case "REVIEWED":
      return "success";
    case "AI_REVIEWED":
      return "success";
    default:
      return "default";
  }
};

export const getStatusText = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "Đang chờ";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "REVIEWED":
      return "Đã xem xét";
    case "AI_REVIEWED":
      return "AI đã xem xét";
    default:
      return status || "N/A";
  }
};

export const getStatusPriorityColor = (
  status: string
): "success" | "warning" | "danger" => {
  switch (status?.toUpperCase()) {
    case "LOW":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HIGH":
      return "danger";
    default:
      return "success";
  }
};

export const getPriorityText = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "LOW":
      return "Thấp";
    case "MEDIUM":
      return "Trung bình";
    case "HIGH":
      return "Cao";
    default:
      return status || "N/A";
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString || "-";
  }
};
