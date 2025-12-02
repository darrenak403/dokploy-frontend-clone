"use client";
import React from "react";

import { PatientData } from "@/types/my-record/getMyPatientRecord";
import {
  TestOrderData,
  lastTestOrder,
} from "@/types/test-order/getAllTestOrderByPatientId";

import { useFetchMyPatientRecordSwrSingleton } from "@/hook/singleton/swrs/my-patient-record/useFetchMyPatientRecordSwr";
import { useFetchAllTestOrderByPatientIdSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchAllTestOrderByPatientIdSwr";

import MyInformation from "@/components/shared/my-medical-record/MyInformation";
import TestOrderHistoryCurrently from "@/components/shared/my-medical-record/TestOrderHistoryCurrently";
import TestOrderHistoryList from "@/components/shared/my-medical-record/TestOrderHistoryList";

const MyMedicalRecordsPage = () => {
  const { data } = useFetchMyPatientRecordSwrSingleton();
  const patientRecord: PatientData | undefined = Array.isArray(data?.data)
    ? data?.data[0]
    : data?.data;
  console.log("Patient record:", patientRecord);

  const patientId = patientRecord?.id || null;

  const { data: testOrdersData } =
    useFetchAllTestOrderByPatientIdSwrSingleton(patientId);
  const testOrders: TestOrderData[] | undefined = testOrdersData?.data?.data;

  const latestTestOrder = lastTestOrder(testOrders);

  console.log("Latest test order:", latestTestOrder);

  return (
    <div className="max-w-screen mx-auto h-full min-h-0 flex flex-col">
      <div className="mb-3 sm:mb-4 md:mb-5">
        <MyInformation patientRecord={patientRecord} />
      </div>
      <div className="mb-3 sm:mb-4 md:mb-5">
        <TestOrderHistoryCurrently lastTestOrder={latestTestOrder} />
      </div>
      <div className="flex-1 min-h-[500px] overflow-hidden">
        <TestOrderHistoryList testOrders={testOrders} />
      </div>
    </div>
  );
};

export default MyMedicalRecordsPage;
