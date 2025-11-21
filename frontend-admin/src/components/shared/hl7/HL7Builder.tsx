"use client";
import React, { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Card, CardBody } from "@heroui/react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

import { MSHInfo, OBRInfo, OBXRow, PIDInfo } from "@/types/hl7";
import { bloodTestTemplates } from "@/types/hl7/constants";

import { useFetchCreateResultFromHL7MessageSwrSingleton } from "@/hook/singleton/swrs/hl7/useFetchCreateResultFromHL7MessageSwr";
import { useFetchGetResultSwrSingleton } from "@/hook/singleton/swrs/hl7/useFetchGetResultSwr";
import { useFetchPatientByAccessionNumberSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchPatientByAccessionNumberSwr";

import {
  copyToClipboard,
  generateTimestamp,
  getStatusColor,
  updateTestResultStatus,
  updateTestResultValue,
} from "@/modules/hl7/hl7Buider";
import {
  downloadHL7File,
  generateHL7File,
} from "@/modules/hl7/hl7FileGenerator";

export interface HL7BuilderProps {
  accessionNumber: string;
}

const HL7Builder: React.FC<HL7BuilderProps> = ({ accessionNumber }) => {
  const router = useRouter();
  const [testResults, setTestResults] = useState<OBXRow[]>(bloodTestTemplates);
  const [generatedHL7, setGeneratedHL7] = useState("");

  const { patientData, isLoading: isLoadingPatient } =
    useFetchPatientByAccessionNumberSwrSingleton(accessionNumber);
  const [isCopied, setIsCopied] = useState(false);

  const { result: createResultData } =
    useFetchGetResultSwrSingleton(accessionNumber);
  const testOrderComplete = createResultData?.data?.status;
  const _debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const createResultSwr = useFetchCreateResultFromHL7MessageSwrSingleton();
  const createResultFromHL7Message =
    createResultSwr?.createResult ?? createResultSwr?.trigger;
  const isMutating = createResultSwr?.isMutating;
  const error = createResultSwr?.error;

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);

  // MSH State
  const [mshInfo, setMshInfo] = useState<MSHInfo>({
    sendingApp: "BloodAnalyzer",
    sendingFacility: "Lab",
    receivingApp: "LIS",
    receivingFacility: "Hospital",
    messageType: "ORU^R01",
    hl7Version: "2.5.1",
  });

  // OBR State
  const [obrInfo, setObrInfo] = useState<OBRInfo>({
    accessionNumber: accessionNumber,
    testType: "CBC",
    testName: "Complete Blood Count",
    observationDateTime: new Date().toISOString().slice(0, 16),
  });

  const [pidInfo, setPidInfo] = useState<PIDInfo>({
    id: 0,
    patientCode: "",
    patientName: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    setObrInfo((prev) => ({
      ...prev,
      accessionNumber: accessionNumber,
    }));
  }, [accessionNumber]);

  useEffect(() => {
    if (patientData) {
      setPidInfo({
        id: patientData.id || 0,
        patientCode: patientData.patientCode || "",
        patientName: patientData.fullName || "",
        dateOfBirth: patientData.yob || "",
        gender: patientData.gender || "",
      });
    }
  }, [patientData]);

  // console.log("PIDInfo", pidInfo);

  const handleInputChange = (index: number, value: string) => {
    const updatedResults = updateTestResultValue(testResults, index, value);
    setTestResults(updatedResults);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStatusChange = (index: number, keys: any) => {
    const status = Array.from(keys)[0] as
      | "Normal"
      | "High"
      | "Low"
      | "Critical";
    const updatedResults = updateTestResultStatus(testResults, index, status);
    setTestResults(updatedResults);
  };

  const handleGenerateHL7 = () => {
    const hl7Data = generateHL7File(testResults, mshInfo, pidInfo, obrInfo);
    setGeneratedHL7(hl7Data);
  };

  const handleDownload = () => {
    if (!generatedHL7) return;
    const timestamp = generateTimestamp();
    const filename = `test_result_${timestamp}.hl7`;
    downloadHL7File(filename, generatedHL7);
  };

  const handleReset = () => {
    setTestResults(bloodTestTemplates);
    setGeneratedHL7("");
    setObrInfo({
      accessionNumber: accessionNumber,
      testType: "CBC",
      testName: "Complete Blood Count",
      observationDateTime: new Date().toISOString().slice(0, 16),
    });
    setPidInfo({
      id: 0,
      patientCode: "",
      patientName: "",
      dateOfBirth: "",
      gender: "",
    });
  };

  const handleCopyToClipboard = async () => {
    if (!generatedHL7) return;
    const success = await copyToClipboard(generatedHL7);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSendingResultsFromLISToHospital = async () => {
    if (!generatedHL7) {
      setAlertMessage("Vui lòng tạo HL7 message trước khi gửi!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (testOrderComplete === "COMPLETE") {
      setAlertMessage("Đơn xét nghiệm này đã có kết quả. Không thể gửi lại!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    if (!pidInfo.patientCode || !pidInfo.patientName) {
      setAlertMessage("Thiếu thông tin bệnh nhân. Vui lòng kiểm tra lại!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const payload = { hl7Message: generatedHL7 };

      const response = await createResultFromHL7Message?.(payload);

      if (response?.statusCode === 200 || response?.statusCode === 201) {
        setAlertMessage("Gửi kết quả xét nghiệm thành công!");
        setAlertColor("success");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/service/test-order");
        }, 3000);
      } else {
        const message = response?.message;
        setAlertMessage(message ?? null);
        setAlertColor("danger");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (err) {
      console.error("Error sending HL7 message:", err);
      const message =
        error?.message ?? (err instanceof Error ? err.message : String(err));
      setAlertMessage(message ?? null);
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-none">
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-18 right-4 z-[999] w-auto max-w-sm"
          >
            <Alert
              color={alertColor}
              title={alertMessage}
              variant="flat"
              className=" shadow-lg bg-background border border-gray-200 dark:border-gray-700"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-foreground ">
            Kết quả xét nghiệm máu
          </h1>
        </div>

        {/* MSH Segment */}
        <Card className="border border-divider shadow-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-base font-semibold text-foreground">
                ----- MSH – Message Header -----
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Sending Application
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.sendingApp}
                  onChange={(e) =>
                    setMshInfo({ ...mshInfo, sendingApp: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Sending Facility
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.sendingFacility}
                  onChange={(e) =>
                    setMshInfo({ ...mshInfo, sendingFacility: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Receiving Application
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.receivingApp}
                  onChange={(e) =>
                    setMshInfo({ ...mshInfo, receivingApp: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Receiving Facility
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.receivingFacility}
                  onChange={(e) =>
                    setMshInfo({
                      ...mshInfo,
                      receivingFacility: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Message Type
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.messageType}
                  onChange={(e) =>
                    setMshInfo({ ...mshInfo, messageType: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  HL7 Version
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={mshInfo.hl7Version}
                  onChange={(e) =>
                    setMshInfo({ ...mshInfo, hl7Version: e.target.value })
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* OBR Segment */}
        <Card className="border border-divider shadow-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-foreground">
                ----- OBR – Test Order -----
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Accession Number
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={accessionNumber}
                  placeholder="ACC123"
                  endContent={
                    isLoadingPatient && (
                      <Icon
                        icon="mdi:loading"
                        className="w-4 h-4 animate-spin text-primary"
                      />
                    )
                  }
                />
                {testOrderComplete === "COMPLETE" && accessionNumber && (
                  <p className="text-xs text-danger mt-1 flex items-center gap-1">
                    <Icon icon="cuida:warning-outline" className="w-3 h-3" />
                    Đơn xét nghiệm này đã có kết quả
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Test Type
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={obrInfo.testType}
                  onChange={(e) =>
                    setObrInfo({ ...obrInfo, testType: e.target.value })
                  }
                  placeholder="CBC"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Test Name
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={obrInfo.testName}
                  onChange={(e) =>
                    setObrInfo({ ...obrInfo, testName: e.target.value })
                  }
                  placeholder="Complete Blood Count"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Observation Date/Time
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  type="datetime-local"
                  value={obrInfo.observationDateTime}
                  onChange={(e) =>
                    setObrInfo({
                      ...obrInfo,
                      observationDateTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* PID Segment */}
        <Card className="border border-divider shadow-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-base font-semibold text-foreground">
                ----- PID – Patient Identification ------
              </h3>
              {isLoadingPatient && (
                <Icon
                  icon="mdi:loading"
                  className="w-4 h-4 animate-spin text-primary"
                />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Patient Code
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={pidInfo.patientCode}
                  placeholder="PAT-001"
                  classNames={{
                    input: isLoadingPatient ? "animate-pulse" : "",
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Full Name
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={pidInfo.patientName}
                  placeholder="Nguyen Van A"
                  classNames={{
                    input: isLoadingPatient ? "animate-pulse" : "",
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">
                  Date of Birth
                </label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={pidInfo.dateOfBirth}
                  placeholder="1980-01-01"
                  classNames={{
                    input: isLoadingPatient ? "animate-pulse" : "",
                  }}
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1 block">Gender</label>
                <Input
                  size="sm"
                  variant="bordered"
                  disabled
                  value={pidInfo.gender}
                  placeholder="Male/Female"
                  classNames={{
                    input: isLoadingPatient ? "animate-pulse" : "",
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Test Results Cards */}
        <div className="space-y-4">
          {testResults.map((result, index) => (
            <Card key={result.id} className="border border-divider shadow-none">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    OBX #{index + 1}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-3">
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Value Type
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value="NM"
                      isReadOnly
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Code
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value={result.testCode}
                      isReadOnly
                      classNames={{
                        input: "text-sm font-medium",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Name
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value={result.testName}
                      isReadOnly
                      classNames={{
                        input: "text-sm font-medium",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-semibold text-red-600">
                      Value <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="number"
                      variant="bordered"
                      size="sm"
                      value={result.testValue.toString()}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="0.0"
                      step="0.1"
                      min="0.1"
                      classNames={{
                        input: "text-sm font-semibold",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Unit
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value={result.unit}
                      isReadOnly
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Reference Range
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value={result.referenceRange}
                      isReadOnly
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block font-semibold text-red-600">
                      Flag <span className="text-red-600">*</span>
                    </label>
                    <Select
                      size="sm"
                      variant="bordered"
                      selectedKeys={[result.status]}
                      onSelectionChange={(keys) =>
                        handleStatusChange(index, keys)
                      }
                      classNames={{
                        trigger: "h-10",
                        value: `text-sm font-medium ${getStatusColor(
                          result.status
                        )}`,
                      }}
                    >
                      <SelectItem key="Normal">N (Normal)</SelectItem>
                      <SelectItem key="High">H (High)</SelectItem>
                      <SelectItem key="Low">L (Low)</SelectItem>
                      <SelectItem key="Critical">C (Critical)</SelectItem>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">
                      Result Status
                    </label>
                    <Input
                      size="sm"
                      variant="bordered"
                      value="F (Final)"
                      isReadOnly
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "bg-muted/20",
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Generated HL7 Message */}
        <Card className="border border-divider shadow-none">
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-foreground">
                Generated HL7 Message
              </h3>
              <div className="flex gap-2">
                <Button size="sm" variant="bordered" onPress={handleReset}>
                  Reset Form
                </Button>
                <Button
                  size="sm"
                  color={
                    !accessionNumber ||
                    testOrderComplete === "COMPLETE" ||
                    testResults.some((r) => r.testValue <= 0)
                      ? "default"
                      : "danger"
                  }
                  variant={
                    !accessionNumber ||
                    testOrderComplete === "COMPLETE" ||
                    testResults.some((r) => r.testValue <= 0)
                      ? "bordered"
                      : "solid"
                  }
                  isDisabled={
                    !accessionNumber ||
                    testOrderComplete === "COMPLETE" ||
                    testResults.some((r) => r.testValue <= 0)
                  }
                  onPress={handleGenerateHL7}
                >
                  {testResults.some((r) => r.testValue <= 0)
                    ? `Còn ${
                        testResults.filter((r) => r.testValue <= 0).length
                      } giá trị chưa nhập`
                    : "Generate HL7 Message"}
                </Button>
              </div>
            </div>

            {generatedHL7 ? (
              <>
                <pre className="bg-muted/30 p-4 rounded-lg overflow-x-auto text-xs font-mono text-foreground border border-divider mb-4 whitespace-pre-wrap">
                  {generatedHL7}
                </pre>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={handleSendingResultsFromLISToHospital}
                    isLoading={isMutating}
                    isDisabled={
                      !generatedHL7 ||
                      isMutating ||
                      testOrderComplete === "COMPLETE"
                    }
                    startContent={
                      !isMutating && (
                        <Icon
                          icon={
                            testOrderComplete === "COMPLETE"
                              ? "mdi:check-circle"
                              : "material-symbols:send-outline"
                          }
                          className={`w-4 h-4 ${
                            testOrderComplete === "COMPLETE"
                              ? "text-success"
                              : ""
                          }`}
                        />
                      )
                    }
                    className={
                      testOrderComplete === "COMPLETE"
                        ? "border-success text-success opacity-60 cursor-not-allowed"
                        : ""
                    }
                  >
                    {isMutating
                      ? "Đang gửi..."
                      : testOrderComplete === "COMPLETE"
                        ? "Đã có kết quả"
                        : "Gửi kết quả"}
                  </Button>
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={handleCopyToClipboard}
                    startContent={
                      isCopied ? (
                        <Icon
                          icon="mdi:check"
                          className="w-4 h-4 text-success"
                        />
                      ) : (
                        <Icon icon="mdi:content-copy" className="w-4 h-4" />
                      )
                    }
                    className={isCopied ? "border-success text-success" : ""}
                  >
                    {isCopied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                  <Button
                    size="sm"
                    color="success"
                    onPress={handleDownload}
                    startContent={
                      <Icon icon="mdi:download" className="w-4 h-4" />
                    }
                  >
                    Tải file .hl7
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Icon
                  icon="mdi:file-document-outline"
                  className="mx-auto h-16 w-16 text-muted opacity-30 mb-4"
                />
                <p className="text-sm text-muted">
                  Nhấn &quot;Generate HL7 Message&quot; để tạo HL7 message từ
                  các thông tin đã nhập
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default HL7Builder;
