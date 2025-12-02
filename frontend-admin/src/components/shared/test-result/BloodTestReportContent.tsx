/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";

import Image from "next/image";

import { formatDateTimeFull } from "@/modules";

import { BloodTestReportContentProps } from "@/types/test-result";

import LabMS_Logo from "../../../../public/images/LogoPDF.svg";

const BloodTestReportContent: React.FC<BloodTestReportContentProps> = ({
  patientName,
  address,
  birthYear,
  gender,
  accessionNumber,
  instrument,
  testDate,
  parameters,
  doctorComments,
  doctorName,
  signatureDate,
  status,
  phone,
  email,
}) => {
  const formatParameterFlag = (flag: string | null | undefined) => {
    if (flag === "H") return "High";
    if (flag === "L") return "Low";
    return "Normal";
  };

  return (
    <div className="w-full p-3 sm:p-4 lg:p-4 bg-white rounded-xl">
      {/* Header */}
      <div className="mb-2 mx-2 sm:mx-10 lg:mx-20 border-b-2 pb-3 border-gray-300 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
        {/* LEFT */}
        <div className="flex items-center justify-center sm:mr-4">
          <Image
            src={LabMS_Logo}
            alt="Logo"
            width={80}
            height={80}
            className="sm:w-[90px] sm:h-[90px] lg:w-[100px] lg:h-[100px] object-contain"
          />
        </div>
        {/* RIGHT */}
        <div className="flex flex-col items-center sm:items-start justify-center text-center sm:text-left">
          <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-red-700">
            TRUNG TÂM XÉT NGHIỆM MÁU CODE GANG
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Địa chỉ: S9.01 Vinhome Grand Park, Phường Long Bình, TP. Thủ Đức,
            Việt Nam
          </p>
          <p className="text-xs sm:text-sm text-gray-600 font-bold">
            Hotline: 0799 995 828 | Hotline khiếu nại: 0885 034 070
          </p>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-center text-base sm:text-lg lg:text-xl font-bold mb-4 sm:mb-6 text-gray-800">
        PHIẾU TRẢ KẾT QUẢ XÉT NGHIỆM
      </h2>

      {/* Patient Information */}
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            HỌ VÀ TÊN:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6 font-bold">
            {patientName}
          </p>
        </div>
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            NĂM SINH:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6">
            {birthYear}
          </p>
        </div>
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            ĐỊA CHỈ:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6 break-words">
            {address}
          </p>
        </div>
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            GIỚI TÍNH:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6">{gender}</p>
        </div>
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            ĐIỆN THOẠI:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6">{phone}</p>
        </div>
        <div className="border-b border-zinc-200 pb-2 flex gap-3 sm:gap-10 items-center justify-start">
          <p className="text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-25 flex-shrink-0">
            THIẾT BỊ:
          </p>
          <p className="text-sm sm:text-base text-gray-900 min-h-6">
            {instrument}
          </p>
        </div>
      </div>

      {/* Test Results Table */}
      <div className="mb-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-400 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">
                MÃ
              </th>
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-left font-semibold text-gray-700">
                TÊN XÉT NGHIỆM
              </th>
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-center font-semibold text-gray-700">
                KẾT QUẢ
              </th>
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-center font-semibold text-gray-700 hidden sm:table-cell">
                CHỈ SỐ BÌNH THƯỜNG
              </th>
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-center font-semibold text-gray-700">
                ĐƠN VỊ
              </th>
              <th className="border border-gray-400 px-1 sm:px-3 py-2 text-center font-semibold text-gray-700">
                TÌNH TRẠNG
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Complete Blood Count Header */}
            <tr className="bg-blue-50">
              <td
                colSpan={6}
                className="border border-gray-400 px-2 sm:px-3 py-2 font-bold text-gray-800"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-1">
                  <span className="text-xs sm:text-sm">CÔNG THỨC MÁU</span>
                  <span className="text-xs sm:text-sm">{testDate}</span>
                </div>
              </td>
            </tr>
            {/* Blood Count Parameters */}
            {parameters?.map((param, index) => (
              <tr
                key={param.sequence || index}
                className={`hover:bg-gray-50 ${
                  param.flag === "H" || param.flag === "L" ? "bg-red-50" : ""
                }`}
              >
                <td className="border border-gray-400 px-1 sm:px-3 py-2 font-medium text-gray-800">
                  {param.paramCode}
                </td>
                <td className="border border-gray-400 px-1 sm:px-3 py-2 text-gray-800">
                  {param.paramName}
                </td>
                <td className="border border-gray-400 px-1 sm:px-3 py-2 text-center font-semibold text-gray-900">
                  {param.value}
                </td>
                <td className="border border-gray-400 px-1 sm:px-3 py-2 text-center text-gray-700 hidden sm:table-cell">
                  {param.refRange}
                </td>
                <td className="border border-gray-400 px-1 sm:px-3 py-2 text-center text-gray-700">
                  {param.unit}
                </td>
                <td
                  className={`border border-gray-400 px-1 sm:px-3 py-2 text-center font-bold ${
                    param.flag === "H"
                      ? "text-red-600"
                      : param.flag === "L"
                        ? "text-orange-400"
                        : "text-green-600"
                  }`}
                >
                  {formatParameterFlag(param.flag)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor's Comments Section - Screen Mode */}
      <div className="screen-only h-auto min-h-[200px] sm:min-h-[250px] lg:h-100 mb-6 border border-gray-300 rounded-lg p-3 sm:p-4">
        <div className="mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800">
            GHI CHÚ CỦA BÁC SĨ
          </h3>
        </div>

        <div className="max-h-[300px] sm:max-h-[400px] lg:h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin">
          {doctorComments && doctorComments.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {doctorComments.map((comment, index) => (
                <div
                  key={comment.commentId || index}
                  className="rounded p-2 sm:p-3 border-l-4 border-red-500 bg-red-50/30"
                >
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                    {comment.doctorName} -{" "}
                    {formatDateTimeFull(comment.createdAt)}:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    {comment.commentContent}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[100px]">
              <p className="text-xs sm:text-sm text-gray-500">
                Chưa có ghi chú từ bác sĩ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Doctor's Comments Section - Print Mode */}
      <div className="print-only h-auto min-h-[150px] lg:h-70 mb-6 border border-gray-300 rounded-lg p-3 sm:p-4">
        <div className="mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-gray-800">
            GHI CHÚ CỦA BÁC SĨ
          </h3>
        </div>

        <div className="h-auto lg:h-[calc(100%-3rem)] overflow-y-auto">
          {doctorComments && doctorComments.length > 0 ? (
            <div className="text-xs sm:text-sm text-gray-900 break-words whitespace-normal">
              {doctorComments.map((comment, index) => (
                <span key={comment.commentId || index}>
                  <span className="font-semibold">{comment.doctorName}</span>
                  {": "}
                  {comment.commentContent}
                  {index < doctorComments.length - 1 && ", "}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-900">
              Không có ghi chú.
            </p>
          )}
        </div>
      </div>

      {/* Signature Section */}
      <div className="flex justify-center sm:justify-end sm:mr-10 lg:mr-20 mb-6 sm:mb-8">
        <div className="max-w-[300px] flex flex-col items-center">
          <div className="text-center mb-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              {signatureDate}
            </p>
          </div>
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <p className="text-xs sm:text-sm font-bold text-gray-800">
              PHÒNG XÉT NGHIỆM
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs sm:text-sm font-bold text-gray-800">
              DR. {doctorName}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-3 sm:pt-4 text-center text-[10px] sm:text-xs text-red-400">
        <p className="italic px-2">
          Dựa vào kết quả xét nghiệm không thể chuẩn đoán được bệnh, cần phải
          kết hợp với các triệu chứng lâm sàng, cận lâm sàng và tiền sử bệnh để
          có chuẩn đoán chính xác
        </p>
      </div>
    </div>
  );
};

export default BloodTestReportContent;
