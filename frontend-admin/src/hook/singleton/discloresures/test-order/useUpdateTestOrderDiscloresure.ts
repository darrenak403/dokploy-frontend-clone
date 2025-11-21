"use client";
import { useContext, useState } from "react";

import { useDisclosure } from "@heroui/react";

import { TestOrder } from "@/types/test-order";

import { DiscloresuresContext } from "../DiscloresuresProvider";

export const useUpdateTestOrderDiscloresureCore = () => {
  const disclosure = useDisclosure();
  const [testOrder, setTestOrder] = useState<TestOrder | null>(null);

  const openWithTestOrder = (testOrderData: TestOrder) => {
    setTestOrder(testOrderData);
    disclosure.onOpen();
  };

  const handleClose = () => {
    disclosure.onClose();
    setTimeout(() => setTestOrder(null), 300);
  };

  return {
    ...disclosure,
    onClose: handleClose,
    testOrder,
    openWithTestOrder,
  };
};

export const useUpdateTestOrderDiscloresureSingleton = () => {
  const { useUpdateTestOrderDisclosure } = useContext(DiscloresuresContext)!;
  return useUpdateTestOrderDisclosure;
};
