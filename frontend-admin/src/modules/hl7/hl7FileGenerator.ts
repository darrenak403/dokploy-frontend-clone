import { OBXRow } from "@/types/hl7";

interface MSHInfo {
  sendingApp: string;
  sendingFacility: string;
  receivingApp: string;
  receivingFacility: string;
  messageType: string;
  hl7Version: string;
}

interface PatientInfo {
  id: number;
  patientCode: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
}

interface OBRInfo {
  accessionNumber: string;
  testType: string;
  testName: string;
  observationDateTime: string;
}

export const generateHL7File = (
  testResults: OBXRow[],
  mshInfo: MSHInfo,
  pidInfo: PatientInfo,
  obrInfo: OBRInfo
): string => {
  const timestamp = formatHL7DateTime(new Date());
  const obrTimestamp = formatHL7DateTime(new Date(obrInfo.observationDateTime));
  const hl7Segments: string[] = [];

  // MSH Segment
  hl7Segments.push(
    `MSH|^~\\&|${mshInfo.sendingApp}|${mshInfo.sendingFacility}|${
      mshInfo.receivingApp
    }|${mshInfo.receivingFacility}|${timestamp}||${
      mshInfo.messageType
    }|MSG${timestamp.slice(0, 14)}|P|${mshInfo.hl7Version}`
  );

  // PID Segment
  const nameParts = pidInfo.patientName.trim().split(" ");
  const lastName = nameParts[0] || "";
  const firstName = nameParts.slice(1).join(" ") || "";
  const dob = pidInfo.dateOfBirth.replace(/\//g, "");

  hl7Segments.push(
    `PID|${pidInfo.id}||${pidInfo.patientCode}||${lastName}^${firstName}||${dob}|${pidInfo.gender}`
  );

  // OBR Segment
  hl7Segments.push(
    `OBR|1|${obrInfo.accessionNumber}|${obrInfo.testType}^${obrInfo.testName}|||${obrTimestamp}`
  );

  // OBX Segments
  testResults.forEach((result, index) => {
    const abnormalFlag =
      result.status === "Normal"
        ? "N"
        : result.status === "High"
          ? "H"
          : result.status === "Low"
            ? "L"
            : "C";

    hl7Segments.push(
      `OBX|${index + 1}|NM|${result.testCode}^${result.testName}||${
        result.testValue
      }|${result.unit}|${result.referenceRange}|${abnormalFlag}|||F`
    );
  });

  return hl7Segments.join("\r\n");
};

export const downloadHL7File = (filename: string, content: string): void => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const formatHL7DateTime = (date: Date): string => {
  const pad = (num: number) => String(num).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

export const getResultStatus = (
  value: number,
  referenceRange: { low: number; high: number }
): "Normal" | "High" | "Low" | "Critical" => {
  const criticalLow = referenceRange.low * 0.5;
  const criticalHigh = referenceRange.high * 1.5;

  if (value <= criticalLow || value >= criticalHigh) {
    return "Critical";
  } else if (value < referenceRange.low) {
    return "Low";
  } else if (value > referenceRange.high) {
    return "High";
  }
  return "Normal";
};
