"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Alert, Button, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";

import { useFetchCreateResultFromHL7MessageSwrSingleton } from "@/hook/singleton/swrs/hl7/useFetchCreateResultFromHL7MessageSwr";
import { useFetchGetAllReagentSwrSingleton } from "@/hook/singleton/swrs/instrument/useFetchGetAllReagentSwr";
import {
  RecievedHL7MessagePayload,
  useFetchRecieveResultFromInstrumentSwrSingleton,
} from "@/hook/singleton/swrs/instrument/useFetchRecieveResultFromInstrumentSwr";

import { formatHL7Message } from "@/modules/hl7/hl7Sender";

export interface HL7MessageSenderProps {
  accessionNumber: string;
}

const HL7MessageSender: React.FC<HL7MessageSenderProps> = ({
  accessionNumber,
}) => {
  const [selectedReagentId, setSelectedReagentId] = useState<string | null>(
    null
  );
  const router = useRouter();
  const [hl7Message, setHl7Message] = useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [showAlert, setShowAlert] = useState(false);

  // Fetch reagents
  const reagentSwr = useFetchGetAllReagentSwrSingleton();
  const isLoadingReagents = reagentSwr?.isLoading ?? false;
  const reagents = reagentSwr?.data?.data || [];

  const receiveResultSwr = useFetchRecieveResultFromInstrumentSwrSingleton();
  const receiveResult = receiveResultSwr?.trigger;
  const isReceiving = receiveResultSwr?.isMutating;

  const createResultSwr = useFetchCreateResultFromHL7MessageSwrSingleton();
  const _createResultFromHL7 =
    createResultSwr?.createResult ?? createResultSwr?.trigger;
  const isSending = createResultSwr?.isMutating;

  const handleSelectReagent = (reagentId?: string) => {
    if (!reagentId) {
      setAlertMessage("Thuốc thử không hợp lệ!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    setSelectedReagentId(reagentId ?? null);
    setHl7Message("");
  };

  const handleReceiveResult = async () => {
    if (!selectedReagentId) {
      setAlertMessage("Vui lòng chọn thuốc thử trước!");
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      const payload: RecievedHL7MessagePayload = {
        accessionNumber,
        reagentId: selectedReagentId,
      };
      const response = await receiveResult?.(payload);

      if (response?.status === 200 && response?.data) {
        const rawMessage = response.data.hl7Message || "";
        const formattedMessage = formatHL7Message(rawMessage);

        setHl7Message(formattedMessage);
        setAlertMessage("Nhận kết quả từ thiết bị thành công!");
        setAlertColor("success");
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        throw new Error(response?.message || "Không thể nhận kết quả");
      }
    } catch (error) {
      console.error("Error receiving result:", error);
      setAlertMessage(
        error instanceof Error ? error.message : "Lỗi khi nhận kết quả"
      );
      setAlertColor("danger");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleSendResult = () => {
    if (!hl7Message) {
      return;
    } else {
      router.back();
    }
  };
  // const handleSendResult = async () => {
  //   if (!hl7Message) {
  //     setAlertMessage("Chưa có kết quả để gửi!");
  //     setAlertColor("danger");
  //     setShowAlert(true);
  //     setTimeout(() => setShowAlert(false), 3000);
  //     return;
  //   }

  //   try {
  //     const payload = {hl7Message};
  //     const response = await createResultFromHL7?.(payload);

  //     if (response?.statusCode === 200 || response?.statusCode === 201) {
  //       setAlertMessage("Gửi kết quả thành công!");
  //       setAlertColor("success");
  //       setShowAlert(true);
  //       setTimeout(() => setShowAlert(false), 3000);
  //       setTimeout(() => {
  //         setHl7Message("");
  //         setSelectedReagentId(null);
  //       }, 3000);
  //       if (response?.statusCode === 200 && response?.data) {
  //         router.back();
  //       }
  //     } else {
  //       throw new Error(response?.message || "Không thể gửi kết quả");
  //     }
  //   } catch (error) {
  //     console.error("Error sending result:", error);
  //     setAlertMessage(
  //       error instanceof Error ? error.message : "Lỗi khi gửi kết quả"
  //     );
  //     setAlertColor("danger");
  //     setShowAlert(true);
  //     setTimeout(() => setShowAlert(false), 3000);
  //   }
  // };

  const handleCopyToClipboard = async () => {
    if (!hl7Message) return;
    try {
      await navigator.clipboard.writeText(hl7Message);
      setAlertMessage("Đã copy vào clipboard!");
      setAlertColor("success");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSaveToFile = () => {
    if (!hl7Message) return;
    const blob = new Blob([hl7Message], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `HL7_${accessionNumber}_${Date.now()}.hl7`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Alert */}
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
              className="shadow-lg bg-background border border-gray-200 dark:border-gray-700"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="">
          <p className=" text-2xl font-bold text-foreground">
            Gửi Kết Quả HL7 đến Hệ Thống LMS
          </p>
          <span className=" text-sm font-normal text-gray-400">
            Nhận kết quả từ thiết bị xét nghiệm máu và gửi về hệ thống
          </span>
        </div>
        <Button
          size="md"
          color="success"
          onPress={handleReceiveResult}
          isLoading={isReceiving}
          isDisabled={!selectedReagentId || isReceiving}
          className="hover:bg-success-400"
          startContent={
            !isReceiving && <Icon icon="mdi:download" className="w-5 h-5" />
          }
        >
          {isReceiving ? "Đang nhận..." : "Nhận kết quả từ thiết bị"}
        </Button>
      </div>

      {/* Reagent Selection */}
      <Card className="border border-divider shadow-none">
        <CardBody className="relative p-6">
          {isLoadingReagents ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Icon
                icon="mdi:loading"
                className="w-12 h-12 animate-spin text-[var(--primary)]"
              />
              <p className="text-sm text-[var(--muted)]">
                Đang tải danh sách thuốc thử...
              </p>
            </div>
          ) : reagents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[var(--muted)]/20 flex items-center justify-center">
                <Icon
                  icon="mdi:test-tube-off"
                  className="w-8 h-8 text-[var(--muted)]"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">
                  Không có thuốc thử
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Vui lòng thêm thuốc thử để tiếp tục
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`
              ${
                reagents.length > 4
                  ? "flex gap-4 overflow-x-auto p-2 scrollbar-none"
                  : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
              }
            `}
            >
              {reagents.length > 4 && (
                <div className="absolute flex items-center justify-center gap-1 left-10 bottom-1 text-sm text-zinc-400 ">
                  <Icon
                    icon="mdi:tooltip-question-outline"
                    className="w-4 h-4"
                  />
                  <p>Nhấn giữ shift + lăn chuột để cuộn ngang</p>
                </div>
              )}
              {reagents.map((reagent) => (
                <button
                  key={reagent.id}
                  onClick={() => handleSelectReagent(reagent.id)}
                  className={`
                    ${reagents.length > 4 ? "flex-shrink-0 w-52" : ""}
                    relative p-6 rounded-xl border-2 transition-all duration-300
                    flex flex-col items-center justify-center gap-3
                    hover:shadow-xl hover:scale-105 hover:-translate-y-1
                    ${
                      selectedReagentId === reagent.id
                        ? "border-[var(--primary-400)] bg-[var(--primary-400)]/10 shadow-lg"
                        : "border-gray-200 dark:border-gray-700 hover:border-[var(--primary-400)]/50"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    transition-all duration-300
                    ${
                      selectedReagentId === reagent.id
                        ? "bg-[var(--primary)] text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                    }
                  `}
                  >
                    <Icon icon="mdi:test-tube" className="w-6 h-6" />
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="font-semibold text-sm text-foreground line-clamp-2">
                      {reagent.reagentName}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Kho: {reagent.quantity}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {selectedReagentId === reagent.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="absolute top-2 right-2"
                    >
                      <Icon
                        icon="mdi:check-circle"
                        className="w-6 h-6 text-[var(--primary-400)]"
                      />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
      {/* Raw HL7 Message */}
      <Card className="border border-divider shadow-none">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">
              Kết quả HL7 nhận từ thiết bị
            </h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                color="success"
                onPress={handleSendResult}
                isLoading={isSending}
                isDisabled={!hl7Message || isSending}
                startContent={
                  !isSending && <Icon icon="material-symbols:send-outline" />
                }
              >
                {isSending ? "Đang gửi..." : "Gửi đến hệ thống LMS"}
              </Button>
              <Button
                size="sm"
                variant="bordered"
                onPress={handleCopyToClipboard}
                startContent={<Icon icon="mdi:content-copy" />}
              >
                Sao chép
              </Button>
              <Button
                size="sm"
                variant="bordered"
                onPress={handleSaveToFile}
                startContent={<Icon icon="mdi:content-save" />}
              >
                Tải về File
              </Button>
            </div>
          </div>

          {/* HL7 Message Content */}
          <div className="h-75 bg-muted/30 p-4 rounded-lg border border-divider mb-4 ">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
              {hl7Message}
            </pre>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HL7MessageSender;
