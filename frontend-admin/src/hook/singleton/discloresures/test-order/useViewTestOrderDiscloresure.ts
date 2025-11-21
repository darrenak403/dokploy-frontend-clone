"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useViewTestOrderDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [testOrderId, setTestOrderId] = useState<number | null>(null);

  const openWithTestOrderId = (id: number) => {
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
    openWithTestOrderId,
  };
};

export const useViewTestOrderDiscloresureSingleton = () => {
  const { useViewTestOrderDisclosure } = useContext(DiscloresuresContext)!;
  return useViewTestOrderDisclosure;
};
