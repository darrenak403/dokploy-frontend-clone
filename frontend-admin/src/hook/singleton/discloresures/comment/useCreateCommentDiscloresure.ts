"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useCreateCommentDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [testOrderId, setTestOrderId] = useState<number | null>(null);

  const openWithTestOrder = (id: number) => {
    setTestOrderId(id);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setTestOrderId(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    testOrderId,
    openWithTestOrder,
  };
};

export const useCreateCommentDiscloresureSingleton = () => {
  const { useCreateCommentDisclosure } = useContext(DiscloresuresContext)!;
  return useCreateCommentDisclosure;
};
