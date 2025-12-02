"use client";
import React from "react";

import { Icon } from "@iconify/react";

interface InitialOptionsProps {
  onSelectOption: (option: string) => void;
  onShowDevelopmentMessage: () => void;
}

const InitialOptions: React.FC<InitialOptionsProps> = ({
  onSelectOption,
  onShowDevelopmentMessage,
}) => {
  const options = [
    {
      id: "result",
      icon: "mdi:file-document-outline",
      title: "Tra cứu kết quả xét nghiệm",
      description: "Xem và hiểu rõ kết quả xét nghiệm máu của bạn",
      prompt: "Tôi muốn tra cứu kết quả xét nghiệm máu của tôi",
      inDevelopment: true,
    },
    {
      id: "consult",
      icon: "mdi:doctor",
      title: "Tư vấn về kết quả",
      description: "Được bác sĩ AI giải thích chi tiết chỉ số xét nghiệm",
      prompt: "Tôi cần tư vấn về kết quả xét nghiệm máu",
      inDevelopment: false,
    },
    {
      id: "service",
      icon: "mdi:information-outline",
      title: "Thắc mắc về dịch vụ",
      description: "Hỏi về quy trình, giá cả, lịch hẹn xét nghiệm",
      prompt: "Tôi muốn biết thêm về dịch vụ xét nghiệm máu",
      inDevelopment: true,
    },
  ];

  const handleOptionClick = (option: (typeof options)[0]) => {
    if (option.inDevelopment) {
      onShowDevelopmentMessage();
    } else {
      onSelectOption(option.prompt);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Xin chào! Tôi là Dr.Meddy 👨‍⚕️
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Trợ lý AI chuyên về xét nghiệm máu. Tôi có thể giúp gì cho bạn hôm
          nay?
        </p>
      </div>

      {/* Options Grid */}
      <div className="flex flex-col gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            className="w-full bg-white dark:bg-[#2a2a2a] border-2 border-gray-200 dark:border-[#3a3a3a] rounded-xl p-5 cursor-pointer transition-all duration-200 text-left flex flex-row gap-4 items-center hover:border-red-500 dark:hover:border-red-500 hover:shadow-lg hover:-translate-y-0.5"
            onClick={() => handleOptionClick(option)}
          >
            {/* Icon */}
            <div className="w-12 h-12 min-w-[48px] bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <Icon icon={option.icon} className="text-2xl text-red-500 dark:text-red-400" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-1">
              <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200 m-0 flex items-center gap-2 flex-wrap">
                {option.title}
                {option.inDevelopment && (
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                    🚧 Đang phát triển
                  </span>
                )}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 m-0 leading-relaxed">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default InitialOptions;
