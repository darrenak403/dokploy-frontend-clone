import React from "react";

import Link from "next/link";

import { Icon } from "@iconify/react";

import {
  MyInformationProps,
  getAge,
  getInitials,
} from "@/types/my-record/getMyPatientRecord";

const MyInformation: React.FC<MyInformationProps & { editHref?: string }> = ({
  patientRecord,
}) => {
  const initials = getInitials(patientRecord?.fullName);
  const age = getAge(patientRecord?.yob);

  // Skeleton when no data
  if (!patientRecord) {
    return (
      <div
        className="w-full rounded-lg border p-4 flex items-center justify-center gap-4 shadow-sm"
        style={{
          borderColor: "var(--coral-400, #ffdede)",
          background: "var(--bg-pale, #f6d9d9)",
        }}
      >
        <div className="text-center">
          <Icon
            icon="mdi:information-outline"
            className="w-8 h-8 mx-auto mb-2 text-zinc-500"
          />
          <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            Chưa có thông tin
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Vui lòng cập nhật thông tin cá nhân của bạn
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-lg border p-4 flex items-center justify-between gap-4 shadow-sm"
      style={{
        borderColor: "var(--coral-400, #ffdede)",
        background: "var(--bg-pale, #f6d9d9)",
      }}
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full w-15 h-15 text-white font-semibold shrink-0"
          style={{ background: "var(--coral-500)" }}
          aria-hidden
        >
          {initials}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col items-start gap-1">
            {/* fullName */}
            <div>
              <h3 className="text-2xl font-semibold truncate text-[var(--foreground)]">
                {patientRecord?.fullName || "Chưa cập nhật"}
              </h3>
            </div>
            {/* Patient Code and age */}
            <div className="flex items-center gap-2">
              {patientRecord?.patientCode && (
                <span className="text-xs px-2 py-1 rounded-md bg-white/60 dark:bg-black/20 ">
                  {patientRecord.patientCode}
                </span>
              )}

              {patientRecord?.gender && (
                <span className="text-xs px-2 py-1 rounded-md bg-white/60 dark:bg-black/20 ">
                  {patientRecord.gender}
                </span>
              )}
              {typeof age === "number" && (
                <span className="text-xs px-2 py-1 rounded-md bg-white/60 dark:bg-black/20 text-zinc-700 dark:text-zinc-200">
                  {age} tuổi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={"/service/test-order"}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm bg-white/60 hover:bg-white/40 dark:hover:bg-black/30"
          style={{
            borderColor: "var(--coral-400, #ffdede)",
            color: "var(--foreground)",
          }}
        >
          <Icon icon="mdi:pencil" className="w-4 h-4" />
          <span>Lịch sử xét nghiệm</span>
        </Link>
      </div>
    </div>
  );
};

export default MyInformation;
