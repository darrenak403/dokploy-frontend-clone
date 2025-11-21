"use client";
import React from "react";

import { notFound, useParams } from "next/navigation";

import { safeDecryptFromURL } from "@/modules/encrypt";

import HL7MessageSender from "@/components/shared/hl7/HL7MessageSender";

const LabResultPage = () => {
  const params = useParams();
  const encryptedAcc = params.accessionNumber as string;
  const accessionNumber = safeDecryptFromURL(encryptedAcc);

  if (!encryptedAcc) {
    console.warn("Missing URL parameters");
    notFound();
  }

  if (!accessionNumber) {
    console.warn("Failed to decrypt parameters", { encryptedAcc });
    notFound();
  }
  return (
    <div className="overflow-hidden h-full">
      {/* <HL7Builder accessionNumber={accessionNumber} /> */}
      <HL7MessageSender accessionNumber={accessionNumber} />
    </div>
  );
};

export default LabResultPage;
