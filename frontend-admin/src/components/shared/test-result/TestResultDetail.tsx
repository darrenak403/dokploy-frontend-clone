import React, { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { mutate } from "swr";

import { TestResultParameters, TestResultProps } from "@/types/test-result";

import { useFetchDeleteCommentSwrSingleton } from "@/hook/singleton/swrs/comments/useFetchDeleteCommentSwr";
import { useFetchTestOrderByIdSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchTestOrderByIdSwr";
import { useFetchGetTestResultSwrSingleton } from "@/hook/singleton/swrs/test-result/useFetchGetTestResultSwr";

import { formatDateTimeFull } from "@/modules/day";
import { encryptForURL } from "@/modules/encrypt";
import { getFlagColor, getFlagIcon, getFlagLabel } from "@/modules/test-result";

import CommentInputForm from "./CommentInputForm";

const TestResultDetail: React.FC<TestResultProps> = ({
  testOrderId,
  accessionNumber,
}) => {
  const router = useRouter();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);
  const { result: testResultData, isLoading: resultLoading } =
    useFetchGetTestResultSwrSingleton(accessionNumber);
  const { testOrder, isLoading: orderLoading } =
    useFetchTestOrderByIdSwrSingleton(testOrderId);
  const testResultId = testResultData?.id;

  console.log("testResultId", testResultId);

  const deleteComment = useFetchDeleteCommentSwrSingleton();

  if (resultLoading || orderLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--background)]">
        <Spinner size="lg" color="danger" />
      </div>
    );
  }

  const handleViewTestResultDetail = (
    testOrderId: number,
    accessionNumber: string
  ) => {
    const encryptedId = encryptForURL(testOrderId);
    const encryptedAcc = encryptForURL(accessionNumber);
    router.push(`/service/test-order/${encryptedId}/${encryptedAcc}/view`);
  };
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await deleteComment!.deleteComment({ commentId });
      if (response?.data) {
        setShowAlert(true);
        setAlertColor("success");
        setAlertMessage("Ghi chú đã được xóa thành công!");

        await mutate(`/orders/${testOrderId}`);

        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (_error) {
      setShowAlert(true);
      setAlertColor("danger");
      setAlertMessage("Đã xảy ra lỗi khi xóa ghi chú.");

      // Auto hide after 3 seconds
      setTimeout(() => setShowAlert(false), 3000);
    }
  };
  const doctorComments = testOrder?.comments || [];
  const parameters: TestResultParameters[] = testResultData?.parameters || [];

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 overflow-y-auto scrollbar-none">
      {/* Notification */}
      <AnimatePresence>
        {showAlert && alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-18 right-4 z-[999] w-auto max-w-[90vw] sm:max-w-sm"
          >
            <Alert
              color={alertColor}
              title={alertMessage}
              variant="flat"
              className="shadow-lg bg-background border border-gray-200 dark:border-gray-700"
              onClose={() => setShowAlert(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Test Results Table */}
      <Card className="flex-6 w-full lg:w-[60%] bg-[var(--card)] shadow-none border border-[var(--divider)] flex flex-col h-full lg:h-full min-h-[800px]">
        {/* Header */}
        <CardHeader className="flex flex-col items-start gap-3 bg-[var(--gradient-medical)] text-black dark:text-white rounded-t-lg px-3 sm:px-4 lg:px-2 py-4 flex-shrink-0">
          <div className="w-full">
            {/* title */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-5 mb-5">
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                <Icon
                  icon="mdi:flask"
                  className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
                />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                  Blood Test Results
                </h2>
              </div>
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                <Button
                  variant="bordered"
                  size="sm"
                  className="sm:size-md"
                  startContent={
                    <Icon icon="mdi:eye" className="w-4 h-4 sm:w-5 sm:h-5" />
                  }
                  onPress={() =>
                    testOrderId != null &&
                    handleViewTestResultDetail(
                      Number(testOrderId),
                      accessionNumber
                    )
                  }
                  isDisabled={!testOrder}
                >
                  <span className="hidden sm:inline">Xem trước</span>
                  <span className="sm:hidden">Xem</span>
                </Button>
              </div>
            </div>
            {/* Sub description */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
              {/* Accession Number */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:barcode" className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="flex flex-col">
                  <span className="text-zinc-500/70 dark:text-white text-xs">
                    Accession
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    {accessionNumber || "N/A"}
                  </span>
                </div>
              </div>
              {/* Patient Name */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:account" className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="flex flex-col">
                  <span className="text-zinc-500/70 dark:text-white text-xs">
                    Patient
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    {testOrder?.patientName || "N/A"}
                  </span>
                </div>
              </div>
              {/* Instrument Name */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:test-tube" className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="flex flex-col">
                  <span className="text-zinc-500/70 dark:text-white text-xs">
                    Instrument
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    {testOrder?.instrumentName || "N/A"}
                  </span>
                </div>
              </div>
              {/* Date */}
              <div className="flex items-center gap-2">
                <Icon icon="mdi:calendar" className="w-4 h-4 sm:w-5 sm:h-5" />
                <div className="flex flex-col">
                  <span className="text-zinc-500/70 dark:text-white text-xs">
                    Date
                  </span>
                  <span className="font-semibold text-sm sm:text-base">
                    {testOrder?.createdAt || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Table Body with Scroll */}
        <CardBody className="p-0 flex-1 overflow-hidden">
          <div className="hidden lg:block h-full">
            <Table
              aria-label="Blood test results table"
              classNames={{
                wrapper: "h-full shadow-none scrollbar-none",
              }}
            >
              <TableHeader>
                <TableColumn align="start">CODE</TableColumn>
                <TableColumn align="start">PARAMETER NAME</TableColumn>
                <TableColumn align="center">VALUE</TableColumn>
                <TableColumn align="center">UNIT</TableColumn>
                <TableColumn align="center">REFERENCE RANGE</TableColumn>
                <TableColumn align="center">STATUS</TableColumn>
              </TableHeader>
              <TableBody
                items={parameters}
                isLoading={resultLoading}
                loadingContent={<Spinner color="danger" />}
                emptyContent={
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Icon
                      icon="mdi:flask-empty-outline"
                      className="w-16 h-16 text-[var(--muted)] opacity-50 mb-4"
                    />
                    <h3 className="text-lg font-medium text-[var(--foreground)] mb-2">
                      No Test Results Available
                    </h3>
                    <p className="text-sm text-[var(--muted)]">
                      Test results will appear here once they are processed.
                    </p>
                  </div>
                }
              >
                {(item) => (
                  <TableRow
                    className="border-b-1 border-zinc-200"
                    key={item.sequence}
                  >
                    <TableCell>
                      <span className="font-mono font-bold text-[var(--foreground)]">
                        {item.paramCode}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[var(--foreground)]">
                        {item.paramName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-lg text-[var(--foreground)]">
                        {item.value}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[var(--muted)]">{item.unit}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[var(--muted)]">
                        {item.refRange}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip
                        startContent={getFlagIcon(item.flag ?? "")}
                        color={getFlagColor(item.flag ?? "")}
                        variant="flat"
                        size="sm"
                        className="font-semibold"
                      >
                        {getFlagLabel(item.flag ?? "")}
                      </Chip>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden h-full overflow-y-auto scrollbar-thin p-3 sm:p-4">
            {resultLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spinner color="danger" />
              </div>
            ) : parameters.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Icon
                  icon="mdi:flask-empty-outline"
                  className="w-12 h-12 sm:w-16 sm:h-16 text-[var(--muted)] opacity-50 mb-4"
                />
                <h3 className="text-base sm:text-lg font-medium text-[var(--foreground)] mb-2">
                  No Test Results Available
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted)]">
                  Test results will appear here once they are processed.
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {parameters.map((item) => (
                  <Card
                    key={item.sequence}
                    className="border border-[var(--divider)] shadow-sm"
                  >
                    <CardBody className="p-3 sm:p-4">
                      <div className="flex flex-col gap-3">
                        {/* Header: Code & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-xs sm:text-sm text-[var(--muted)]">
                              {item.paramCode}
                            </span>
                            <span className="font-semibold text-sm sm:text-base text-[var(--foreground)]">
                              {item.paramName}
                            </span>
                          </div>
                          <Chip
                            startContent={getFlagIcon(item.flag ?? "")}
                            color={getFlagColor(item.flag ?? "")}
                            variant="flat"
                            size="sm"
                            className="font-semibold flex-shrink-0"
                          >
                            {getFlagLabel(item.flag ?? "")}
                          </Chip>
                        </div>

                        {/* Value & Unit */}
                        <div className="flex items-baseline gap-2 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg p-3">
                          <span className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                            {item.value}
                          </span>
                          <span className="text-sm sm:text-base text-[var(--muted)]">
                            {item.unit}
                          </span>
                        </div>

                        {/* Reference Range */}
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <Icon
                            icon="mdi:ruler"
                            className="w-4 h-4 text-[var(--muted)]"
                          />
                          <span className="text-[var(--muted)]">
                            Reference: <strong>{item.refRange}</strong>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Doctor Comments Section */}
      <Card className="flex-4 w-full lg:w-[40%] bg-[var(--card)] shadow-none border border-[var(--divider)] flex flex-col justify-between min-h-[400px] lg:min-h-0">
        <CardHeader className="flex items-center gap-2 sm:gap-3 bg-[var(--gradient-medical)] text-black dark:text-white rounded-t-lg px-3 sm:px-4 py-3 sm:py-4">
          <Icon icon="mdi:comment-text" className="w-5 h-5 sm:w-6 sm:h-6" />
          <h3 className="text-base sm:text-lg lg:text-xl font-bold">
            Ghi chú của bác sĩ
          </h3>
        </CardHeader>
        <CardBody className="px-3 sm:px-4 py-2 gap-3 sm:gap-4 overflow-hidden flex flex-col h-full justify-between">
          {/* Comments List - Scrollable */}
          <div className="flex flex-col gap-2 space-y-2 overflow-y-auto scrollbar-thin pr-2 max-h-[300px] lg:max-h-none">
            {doctorComments && doctorComments.length > 0 ? (
              doctorComments.map((comment, index) => (
                <div
                  key={comment.commentId || index}
                  className="flex flex-col gap-2 border-l-4 border-red-600 pl-3 sm:pl-4 space-y-1 bg-zinc-50 dark:bg-zinc-900/30 p-2 sm:p-3 rounded-md"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-[var(--muted)]">
                      <strong>{comment.doctorName}</strong> -{" "}
                      {formatDateTimeFull(comment.createdAt)}
                    </p>
                    <Icon
                      icon="si:bin-duotone"
                      className="w-3 h-3 cursor-pointer text-gray-600 hover:text-black flex-shrink-0"
                      onClick={() => {
                        if (comment.commentId !== undefined) {
                          handleDeleteComment(comment.commentId);
                        }
                      }}
                    />
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm text-[var(--foreground)]">
                      {comment.commentContent}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-[var(--muted)] text-center py-4">
                Không có ghi chú.
              </p>
            )}
          </div>

          {/* Comment Input Form */}
          {testResultId && testOrderId && (
            <CommentInputForm
              testOrderId={Number(testOrderId)}
              testResultId={testResultId}
              disabled={!testOrder}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TestResultDetail;
