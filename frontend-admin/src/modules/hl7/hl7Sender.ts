export const formatHL7Message = (rawMessage: string): string => {
  if (!rawMessage || typeof rawMessage !== "string") return "";
  const formatted = rawMessage
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return formatted;
};
