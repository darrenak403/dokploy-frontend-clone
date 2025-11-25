"use client";

import React, { useMemo, useState } from "react";

import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { Monitoring } from "@/types/monitoring";

import { useFetchGetAllMonitoringSwrSingleton } from "@/hook/singleton/swrs/monitoring/useFetchGetAllMonitoringSwr";

import {
  filterByStatus,
  filterByTimeRange,
  formatTimestamp,
  getStatusColorClass,
  getStatusText,
  searchMonitoring,
} from "@/modules/monitoring/getAllMonitoringHelpers";

const MonitoringList = () => {
  const swrResult = useFetchGetAllMonitoringSwrSingleton();
  const { data, error, isLoading } = swrResult || {};

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const monitoringData = useMemo(() => data || [], [data]);

  const filteredData = useMemo(() => {
    let filtered = [...monitoringData];

    filtered = searchMonitoring(filtered, searchText);

    filtered = filterByStatus(filtered, statusFilter);

    filtered = filterByTimeRange(filtered, timeFilter);

    // Sort by timestamp descending (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return filtered;
  }, [monitoringData, searchText, statusFilter, timeFilter]);

  const columns = [
    { key: "timestamp", label: "Thời gian" },
    { key: "service", label: "Dịch vụ" },
    { key: "action", label: "Hành động" },
    { key: "entity", label: "Thực thể" },
    { key: "performedBy", label: "Người thực hiện" },
    { key: "status", label: "Trạng thái" },
    { key: "message", label: "Thông điệp" },
  ];

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-danger">Lỗi tải dữ liệu: {error.message}</p>
        </CardBody>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full shadow-none border border-gray-200">
        <CardBody className="flex items-center justify-center py-12">
          <div className="text-gray-500">Đang tải dữ liệu...</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border border-gray-200 flex flex-col h-full">
      <CardBody className="p-0 flex flex-col h-full">
        {/* Header with Search and Filters */}
        <div className="p-4 border-b border-divider flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="text-sm flex justify-center items-center text-gray-600 dark:text-gray-400">
              Hiển thị {filteredData.length} / {monitoringData.length} hoạt động
            </div>
            <Input
              className="flex-1"
              placeholder="Tìm theo thực thể, dịch vụ, người thực hiện..."
              value={searchText}
              onValueChange={setSearchText}
              startContent={
                <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
              }
              size="sm"
              variant="bordered"
              disabled={isLoading}
            />

            {/* Status Filter */}
            <Select
              aria-label="Chọn trạng thái"
              placeholder="Trạng thái"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) =>
                setStatusFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-48"
              disabled={isLoading}
            >
              <SelectItem key="all">Tất cả trạng thái</SelectItem>
              <SelectItem key="SUCCESS">Thành công</SelectItem>
              <SelectItem key="FAILURE">Thất bại</SelectItem>
              <SelectItem key="ERROR">Lỗi</SelectItem>
            </Select>

            {/* Time Filter */}
            <Select
              aria-label="Chọn thời gian"
              placeholder="Thời gian"
              selectedKeys={[timeFilter]}
              onSelectionChange={(keys) =>
                setTimeFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-48"
              disabled={isLoading}
            >
              <SelectItem key="all">Tất cả thời gian</SelectItem>
              <SelectItem key="1h">1 giờ qua</SelectItem>
              <SelectItem key="24h">24 giờ qua</SelectItem>
              <SelectItem key="7d">7 ngày qua</SelectItem>
              <SelectItem key="30d">30 ngày qua</SelectItem>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table
            aria-label="Monitoring table"
            classNames={{
              wrapper: "shadow-none",
              table: "h-full",
              tbody: "h-full",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={filteredData}
              emptyContent="Không có dữ liệu giám sát"
              isLoading={isLoading}
            >
              {(item: Monitoring) => (
                <TableRow key={item.traceId}>
                  <TableCell>{formatTimestamp(item.timestamp)}</TableCell>
                  <TableCell>{item.service}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{item.entity}</span>
                      {item.entityId && (
                        <span className="text-gray-500 text-xs">
                          ID: {item.entityId}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.performedBy}</TableCell>
                  <TableCell className="">
                    <span
                      className={`px-2 py-1 text-xs max-w-xl font-semibold rounded-full ${getStatusColorClass(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </TableCell>
                  <TableCell className="">
                    <div className="max-w-sm truncate">{item.message}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default MonitoringList;
