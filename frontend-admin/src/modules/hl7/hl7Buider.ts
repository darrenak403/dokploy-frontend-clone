import { OBXRow } from "@/types/hl7";

/**
 * Determine status based on test value and reference range
 */
export const determineStatus = (
  value: number,
  min: number,
  max: number
): "Normal" | "High" | "Low" | "Critical" => {
  const criticalLow = min * 0.5;
  const criticalHigh = max * 1.5;

  if (value <= criticalLow || value >= criticalHigh) {
    return "Critical";
  } else if (value < min) {
    return "Low";
  } else if (value > max) {
    return "High";
  }
  return "Normal";
};

/**
 * Get color class for status badge
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Normal":
      return "text-green-600 dark:text-green-400";
    case "High":
      return "text-orange-600 dark:text-orange-400";
    case "Low":
      return "text-blue-600 dark:text-blue-400";
    case "Critical":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

/**
 * Update test result value and auto-calculate status
 */
export const updateTestResultValue = (
  testResults: OBXRow[],
  index: number,
  value: string
): OBXRow[] => {
  const numericValue = parseFloat(value) || 0;
  const updatedResults = [...testResults];
  updatedResults[index].testValue = numericValue;

  const [min, max] = updatedResults[index].referenceRange
    .split("-")
    .map((v) => parseFloat(v));

  updatedResults[index].status = determineStatus(numericValue, min, max);
  return updatedResults;
};

/**
 * Update test result status manually
 */
export const updateTestResultStatus = (
  testResults: OBXRow[],
  index: number,
  status: "Normal" | "High" | "Low" | "Critical"
): OBXRow[] => {
  const updatedResults = [...testResults];
  updatedResults[index].status = status;
  return updatedResults;
};

/**
 * Copy text to clipboard with fallback for older browsers
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.error("Fallback copy failed:", err);
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Generate timestamp for filename
 */
export const generateTimestamp = (): string => {
  return new Date().toISOString().replace(/[:.]/g, "-");
};

/**
 * Parse reference range string to min/max values
 */
export const parseReferenceRange = (
  referenceRange: string
): { min: number; max: number } => {
  const [min, max] = referenceRange.split("-").map((v) => parseFloat(v));
  return { min, max };
};
