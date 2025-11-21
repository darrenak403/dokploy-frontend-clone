"use client";
import React from "react";

import { notFound, useParams } from "next/navigation";

import { safeDecryptFromURL } from "@/modules/encrypt";

import ViewTestResult from "@/components/shared/test-result/ViewTestResult";

const TestResultPage = () => {
  const params = useParams();
  const encryptedId = params.testOrderId as string;
  const encryptedAcc = params.accessionNumber as string;
  const testOrderId = safeDecryptFromURL(encryptedId);
  const accessionNumber = safeDecryptFromURL(encryptedAcc);

  if (!encryptedId || !encryptedAcc) {
    console.warn("Missing URL parameters");
    notFound();
  }

  if (!testOrderId || !accessionNumber) {
    console.warn("Failed to decrypt parameters", { encryptedId, encryptedAcc });
    notFound();
  }

  return (
    <div className="overflow-hidden h-full">
      <ViewTestResult
        testOrderId={testOrderId}
        accessionNumber={accessionNumber}
      />
    </div>
  );
};

export default TestResultPage;
