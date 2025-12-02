"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { signatureDate } from "@/modules";
import {
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { pdf } from "@react-pdf/renderer";
import Swal from "sweetalert2";

import { TestOrderHistoryListProps } from "@/types/test-order/getAllTestOrderByPatientId";
import {
  getPriorityText,
  getStatusColor,
  getStatusPriorityColor,
  getStatusText,
} from "@/types/test-order/getAllTestOrderList";
import { TestResultParameters } from "@/types/test-result";

import { useFetchTestOrderByIdSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchTestOrderByIdSwr";
import { useFetchGetTestResultSwrSingleton } from "@/hook/singleton/swrs/test-result/useFetchGetTestResultSwr";

import { encryptForURL } from "@/modules/encrypt";

import BloodTestReportPDF from "../test-result/BloodTestReportPDF";

const TestOrderHistoryList: React.FC<TestOrderHistoryListProps> = ({
  testOrders,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const [selectedAccessionNumber, setSelectedAccessionNumber] = useState("");
  const [selectedTestOrderId, setSelectedTestOrderId] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const { result: testResultData } = useFetchGetTestResultSwrSingleton(
    selectedAccessionNumber
  );
  const { testOrder } = useFetchTestOrderByIdSwrSingleton(selectedTestOrderId);

  // Filter test orders based on search and filters
  const filteredTestOrders = testOrders?.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.id).includes(searchQuery) ||
      order.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewTestResultDetail = (
    testOrderId: number,
    accessionNumber: string
  ) => {
    console.log(
      "Xem chi tiết kết quả xét nghiệm:",
      testOrderId,
      accessionNumber
    );
    const encryptedId = encryptForURL(testOrderId);
    const encryptedAcc = encryptForURL(accessionNumber);
    router.push(`/service/my-medical-records/${encryptedId}/${encryptedAcc}`);
  };

  const startDownload = (testOrderId: number, accessionNumber: string) => {
    if (isGeneratingPDF) return;

    setSelectedAccessionNumber(String(accessionNumber));
    setSelectedTestOrderId(Number(testOrderId));
    setIsDownloading(true);
  };

  useEffect(() => {
    if (!isDownloading) return;

    if (isGeneratingPDF) return;

    if (!testResultData || !testOrder) {
      return;
    }

    const generateAndDownload = async () => {
      setIsGeneratingPDF(true);
      try {
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
            accessionNumber={selectedAccessionNumber || ""}
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

        const blob = await pdf(doc).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `KetQuaXetNghiem_${selectedAccessionNumber}_${Date.now()}.pdf`;
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
        setIsDownloading(false);
        setSelectedAccessionNumber("");
        setSelectedTestOrderId(0);
      }
    };

    generateAndDownload();
  }, [
    isDownloading,
    testResultData,
    testOrder,
    selectedAccessionNumber,
    isGeneratingPDF,
  ]);

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-divider dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <Input
            className="flex-1"
            placeholder="Tìm kiếm theo mã đơn, loại xét nghiệm..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={
              <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
            }
            size="sm"
            variant="bordered"
          />

          {/* Status Filter */}
          <Select
            placeholder="Tất cả trạng thái"
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) =>
              setStatusFilter(Array.from(keys)[0] as string)
            }
            size="sm"
            variant="bordered"
            className="w-full sm:w-40"
          >
            <SelectItem key="all">Tất cả trạng thái</SelectItem>
            <SelectItem key="PENDING">Đang chờ</SelectItem>
            <SelectItem key="COMPLETED">Hoàn thành</SelectItem>
            <SelectItem key="CANCELLED">Đã hủy</SelectItem>
            <SelectItem key="REVIEWED">Đã xem xét</SelectItem>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto py-2">
        <Table
          aria-label="Lịch sử xét nghiệm"
          classNames={{
            wrapper: "shadow-none h-full",
            table: "h-full",
            tbody: "h-full",
          }}
        >
          <TableHeader>
            <TableColumn>MÃ XÉT NGHIỆM</TableColumn>
            <TableColumn>BÁC SĨ XÉT NGHIỆM</TableColumn>
            <TableColumn>SỐ ĐIỆN THOẠI</TableColumn>
            <TableColumn>THIẾT BỊ</TableColumn>
            <TableColumn>NGÀY THỰC HIỆN</TableColumn>
            <TableColumn>MỨC ĐỘ ƯU TIÊN</TableColumn>
            <TableColumn>TRẠNG THÁI</TableColumn>
            <TableColumn className="text-center">KẾT QUẢ</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="text-center py-8">
                <Icon
                  icon="mdi:test-tube"
                  className="mx-auto h-12 w-12 text-default-300 mb-4"
                />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Chưa có lịch sử xét nghiệm
                </h3>
                <p className="text-sm text-default-500">
                  {searchQuery || statusFilter !== "all"
                    ? "Không tìm thấy kết quả xét nghiệm nào phù hợp với tìm kiếm của bạn."
                    : "Bạn chưa có kết quả xét nghiệm nào. Hãy đặt lịch khám để thực hiện xét nghiệm."}
                </p>
              </div>
            }
          >
            {(filteredTestOrders ?? []).map((order, idx) => (
              <TableRow
                key={order.id ?? idx}
                className="h-full min-h-0 border-b border-zinc-200/50 dark:border-gray-700"
              >
                <TableCell>
                  <span className="font-mono text-sm font-semibold text-[var(--coral-500)]">
                    {order.accessionNumber ? order.accessionNumber : "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.runBy || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.phone || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.instrumentName || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {order.createdAt
                      ? String(order.createdAt).split(" ")[0]
                      : "-"}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusPriorityColor(order.priority || "-")}
                    size="sm"
                    variant="flat"
                    className="font-medium"
                  >
                    {getPriorityText(order.priority || "-")}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    color={getStatusColor(order.status || "-")}
                    size="sm"
                    variant="flat"
                    className="font-medium"
                  >
                    {getStatusText(order.status || "-")}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {order.status === "COMPLETED" ||
                    order.status === "REVIEWED" ||
                    order.status === "AI_REVIEWED" ? (
                      <>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          }
                          onPress={() => {
                            if (order.accessionNumber && order.id)
                              handleViewTestResultDetail(
                                order.id,
                                order.accessionNumber
                              );
                          }}
                        >
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          startContent={
                            <Icon icon="mdi:download" className="h-4 w-4" />
                          }
                          onPress={() => {
                            if (order.accessionNumber && order.id)
                              startDownload(order.id, order.accessionNumber);
                          }}
                        >
                          Tải về
                        </Button>
                      </>
                    ) : (
                      <Chip size="sm" variant="flat" color="default">
                        Chưa có kết quả
                      </Chip>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TestOrderHistoryList;
