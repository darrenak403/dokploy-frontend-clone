"use client";
import React from "react";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  iconBgColor,
  trend = "neutral",
  delay = 0,
}: StatCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "mdi:arrow-up-right-bold-outline";
      case "down":
        return "mdi:arrow-down-right-bold-outline";
      default:
        return "mdi:account-plus-outline";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      }}
      className="w-full"
    >
      <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            {/* Content */}
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                {title}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  icon={getTrendIcon()}
                  className={`w-4 h-4 ${getTrendColor()}`}
                />
                <p className={`text-sm font-medium ${getTrendColor()}`}>
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconBgColor}`}
            >
              <Icon icon={icon} className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

const ProfileStat = () => {
  const stats = [
    {
      title: "Xét nghiệm",
      value: 12,
      subtitle: "+2 tháng này",
      icon: "grommet-icons:test",
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-50 dark:bg-blue-900/20",
      trend: "up" as const,
      delay: 0,
    },
    {
      title: "Lịch hẹn",
      value: 8,
      subtitle: "+1 tháng này",
      icon: "uil:calender",
      iconColor: "text-green-600",
      iconBgColor: "bg-green-50 dark:bg-green-900/20",
      trend: "up" as const,
      delay: 0.1,
    },
    {
      title: "Kết quả",
      value: 10,
      subtitle: "0 tháng này",
      icon: "solar:chart-bold",
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-50 dark:bg-purple-900/20",
      trend: "neutral" as const,
      delay: 0.2,
    },
  ];

  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconColor={stat.iconColor}
            iconBgColor={stat.iconBgColor}
            trend={stat.trend}
            delay={stat.delay}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileStat;
