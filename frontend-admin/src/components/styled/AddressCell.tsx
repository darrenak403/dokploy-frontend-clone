import { useState } from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

const AddressCell: React.FC<{ address: string | null | undefined }> = ({
  address,
}) => {
  const [copied, setCopied] = useState(false);
  const addressText = address || "-";
  const maxLength = 5; // Increase for better UX

  const handleCopy = async () => {
    if (addressText === "-") return;

    try {
      await navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (addressText.length <= maxLength) {
    return <span className="text-sm">{addressText}</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm" title={addressText}>
        {`${addressText.substring(0, maxLength)}...`}
      </span>
      <Button
        size="sm"
        variant="light"
        className="min-w-0 p-1 h-6 w-6"
        onPress={handleCopy}
        disabled={addressText === "-"}
      >
        <Icon
          icon={copied ? "mdi:check" : "mdi:content-copy"}
          className={`h-3 w-3 ${
            copied ? "text-green-500" : "text-gray-500 hover:text-primary"
          }`}
        />
      </Button>
    </div>
  );
};

export default AddressCell;
