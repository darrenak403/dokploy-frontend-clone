import { Monitoring } from "@/types/monitoring";

// Helper function: get status text in Vietnamese
export const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    SUCCESS: "Thành công",
    FAILURE: "Thất bại",
    ERROR: "Lỗi",
  };
  return statusMap[status] || status;
};

// Helper function: get status color classes
export const getStatusColorClass = (status: string) => {
  const colorMap: Record<string, string> = {
    SUCCESS: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    FAILURE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ERROR: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// Helper function: format timestamp to Vietnamese locale
export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Helper function: filter monitoring data by time range
export const filterByTimeRange = (
  data: Monitoring[],
  timeRange: string
): Monitoring[] => {
  if (!timeRange || timeRange === "all") return data;

  const now = new Date();
  const filterDate = new Date();

  switch (timeRange) {
    case "1h":
      filterDate.setHours(now.getHours() - 1);
      break;
    case "24h":
      filterDate.setHours(now.getHours() - 24);
      break;
    case "7d":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      filterDate.setDate(now.getDate() - 30);
      break;
    default:
      return data;
  }

  return data.filter((item) => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= filterDate;
  });
};

// Helper function: filter monitoring data by status
export const filterByStatus = (
  data: Monitoring[],
  status: string
): Monitoring[] => {
  if (!status || status === "all") return data;
  return data.filter((item) => item.status === status);
};

// Helper function: search monitoring data
export const searchMonitoring = (
  data: Monitoring[],
  searchText: string
): Monitoring[] => {
  if (!searchText) return data;

  const search = searchText.toLowerCase();
  return data.filter(
    (item) =>
      (item.entity?.toLowerCase() || "").includes(search) ||
      (item.service?.toLowerCase() || "").includes(search) ||
      (item.performedBy?.toLowerCase() || "").includes(search) ||
      (item.action?.toLowerCase() || "").includes(search)
  );
};

// Helper function: get statistics from monitoring data
export const getMonitoringStats = (data: Monitoring[]) => {
  const total = data.length;
  const successCount = data.filter((m) => m.status === "SUCCESS").length;
  const failureCount = data.filter((m) => m.status === "FAILURE").length;
  const errorCount = data.filter((m) => m.status === "ERROR").length;
  const successRate = total > 0 ? ((successCount / total) * 100).toFixed(1) : "0";

  const uniqueServices = new Set(data.map((m) => m.service)).size;
  const uniquePerformers = new Set(data.map((m) => m.performedBy)).size;

  const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  const recentActivities = data.filter((m) => {
    const timestamp = new Date(m.timestamp);
    return timestamp >= oneHourAgo;
  }).length;

  return {
    total,
    successCount,
    failureCount,
    errorCount,
    successRate,
    uniqueServices,
    uniquePerformers,
    recentActivities,
  };
};