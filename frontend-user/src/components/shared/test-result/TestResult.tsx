"use client";
import React, { useRef, useState } from "react";

import { signatureDate } from "@/modules";
import { Button, Card, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { pdf } from "@react-pdf/renderer";
import Swal from "sweetalert2";

import { TestResultParameters, TestResultProps } from "@/types/test-result";

import { useFetchTestOrderByIdSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchTestOrderByIdSwr";
import { useFetchGetTestResultSwrSingleton } from "@/hook/singleton/swrs/test-result/useFetchGetTestResultSwr";

import BloodTestReportContent from "./BloodTestReportContent";
import BloodTestReportPDF from "./BloodTestReportPDF";

const TestResult: React.FC<TestResultProps> = ({
  testOrderId,
  accessionNumber,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [isOpenActionButtonModal, setIsOpenActionButtonModal] = useState(false);

  const { result: testResultData, isLoading: resultLoading } =
    useFetchGetTestResultSwrSingleton(accessionNumber);
  //result/accessionNumber

  const { testOrder, isLoading: orderLoading } =
    useFetchTestOrderByIdSwrSingleton(testOrderId);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      if (!testResultData || !testOrder) return;

      const parameters: TestResultParameters[] =
        testResultData.parameters || [];
      const doctorComments = testOrder.comments || [];
      const doctorName =
        testOrder.comments && testOrder.comments.length > 0
          ? testOrder.comments[0].doctorName
          : testOrder.createdBy || "";

      const doc = (
        <BloodTestReportPDF
          patientName={testOrder.patientName || ""}
          address={testOrder.address || ""}
          birthYear={testOrder.yob || ""}
          gender={testOrder.gender || ""}
          accessionNumber={accessionNumber || ""}
          instrument={testOrder.instrument || ""}
          testDate={testOrder.createdAt || ""}
          parameters={parameters}
          doctorComments={doctorComments}
          doctorName={doctorName}
          signatureDate={signatureDate}
          status={testResultData.status || ""}
          phone={testOrder.phone || ""}
          email={testOrder.email || ""}
        />
      );

      // Generate blob
      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `KetQuaXetNghiem_${accessionNumber}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã tải xuống PDF thành công!",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: `Lỗi khi tạo PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };
  // Loading state
  if (resultLoading || orderLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" label="Đang tải dữ liệu..." />
      </div>
    );
  }
  // No data state
  if (!testResultData || !testOrder) {
    return (
      <Card className="p-6">
        <div className="text-center text-danger">
          <Icon icon="mdi:alert-circle" className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">
            Không tìm thấy kết quả xét nghiệm
          </p>
        </div>
      </Card>
    );
  }

  // Prepare parameters data
  const parameters: TestResultParameters[] = testResultData.parameters || [];
  // console.log("test result data", testResultData.parameters);
  const displayParameters = Array.from(
    { length: Math.max(11, parameters.length) },
    (_, i) =>
      parameters[i] || {
        sequence: i + 1,
        paramCode: "",
        paramName: "",
        value: "",
        unit: "",
        refRange: "",
        flag: "",
      }
  );
  const doctorComments = testOrder.comments || [];
  const doctorName =
    testOrder.comments && testOrder.comments.length > 0
      ? testOrder.comments[0].doctorName
      : testOrder.createdBy || "";

  console.log("Doctor comments:", doctorComments);
  console.log("Testorder:", testOrder);

  return (
    <div className="relative min-h-screen h-full overflow-y-auto scrollbar-none">
      <div className="max-w-5xl mx-auto px-4 pb-40">
        {/* Toggle Button - Always visible */}
        <div className="fixed top-36 sm:top-40 lg:top-24 right-4 sm:right-8 lg:right-10 z-50 no-print">
          <Button
            isIconOnly
            variant="bordered"
            onPress={() => setIsOpenActionButtonModal(!isOpenActionButtonModal)}
            className="rounded-full border border-gray-300 bg-white hover:bg-gray-100 shadow-lg"
          >
            <Icon
              icon={isOpenActionButtonModal ? "mdi:close" : "mdi:plus"}
              className="w-5 h-5 sm:w-6 sm:h-6"
            />
          </Button>
        </div>
        {/* Action Buttons */}
        {isOpenActionButtonModal && (
          <div className="fixed top-48 sm:top-52 lg:top-36 right-4 sm:right-8 lg:right-10 z-40 no-print flex flex-col w-[180px] sm:w-[200px] gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 shadow-xl">
            <Button
              variant="bordered"
              startContent={<Icon icon="mdi:eye" className="w-5 h-5" />}
              onPress={handlePrint}
            >
              In kết quả
            </Button>
            <Button
              variant="bordered"
              isLoading={isGeneratingPDF}
              startContent={
                !isGeneratingPDF && (
                  <Icon icon="mdi:download" className="w-5 h-5" />
                )
              }
              onPress={handleDownloadPDF}
            >
              {isGeneratingPDF ? "Đang tạo PDF..." : "Tải PDF"}
            </Button>
          </div>
        )}
        {/* Print Content */}
        <div
          ref={printRef}
          className="w-full mx-auto bg-white border border-gray-300 printable"
        >
          <BloodTestReportContent
            patientName={testOrder.patientName || ""}
            address={testOrder.address || ""}
            birthYear={testOrder.yob || ""}
            gender={testOrder.gender || ""}
            accessionNumber={accessionNumber || ""}
            instrument={testOrder.instrument || ""}
            testDate={testOrder.createdAt || ""}
            parameters={displayParameters}
            doctorComments={doctorComments}
            doctorName={doctorName}
            signatureDate={signatureDate}
            status={testResultData.status || ""}
            phone={testOrder.phone || ""}
            email={testOrder.email || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default TestResult;
