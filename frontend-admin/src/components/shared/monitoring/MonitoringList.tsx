"use client";

import React, { useMemo, useState } from "react";

import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Spinner,
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
    { key: "message", label: "Nội dung" },
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
        <div className="p-3 sm:p-4 border-b border-divider flex-shrink-0">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Count Info */}
            <div className="text-xs sm:text-sm flex justify-center items-center text-gray-600 dark:text-gray-400">
              Hiển thị {filteredData.length} / {monitoringData.length} hoạt động
            </div>

            {/* Search Input */}
            <Input
              className="w-full"
              placeholder="Tìm kiếm..."
              value={searchText}
              onValueChange={setSearchText}
              startContent={
                <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
              }
              size="sm"
              variant="bordered"
              disabled={isLoading}
            />

            {/* Filters - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="w-full"
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
                className="w-full"
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
        </div>

        {/* Desktop Table - Hidden on Mobile */}
        <div className="hidden lg:block flex-1 min-h-[500px] overflow-auto">
          <div className="overflow-x-auto">
            <Table
              aria-label="Monitoring table"
              classNames={{
                wrapper: "shadow-none min-w-max",
                table: "h-full",
                tbody: "h-full",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn key={column.key} className="whitespace-nowrap">
                    {column.label}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody
                items={filteredData}
                emptyContent="Không có dữ liệu giám sát"
                isLoading={isLoading}
              >
                {(item: Monitoring) => (
                  <TableRow key={item.traceId}>
                    <TableCell className="min-w-[150px]">
                      {formatTimestamp(item.timestamp)}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {item.service}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {item.action}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="flex flex-col">
                        <span>{item.entity}</span>
                        {item.entityId && (
                          <span className="text-gray-500 text-xs">
                            ID: {item.entityId}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[130px]">
                      {item.performedBy}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <span
                        className={`px-2 py-1 text-xs max-w-xl font-semibold rounded-full ${getStatusColorClass(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <div className="max-w-sm truncate">{item.message}</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden flex-1 overflow-auto p-3 sm:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" label="Đang tải dữ liệu..." />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-8">
              <Icon
                icon="mdi:monitor"
                className="mx-auto h-12 w-12 text-default-300 mb-4"
              />
              <h3 className="text-base font-medium text-foreground mb-2">
                Không có dữ liệu giám sát
              </h3>
              <p className="text-sm text-default-500">
                Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((item: Monitoring) => (
                <Card
                  key={item.traceId}
                  className="border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <CardBody className="p-3">
                    {/* Header: Time and Status */}
                    <div className="flex items-start justify-between gap-2 mb-3 pb-2 border-b border-divider">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-1 min-w-0">
                        <Icon
                          icon="mdi:clock-outline"
                          className="h-4 w-4 flex-shrink-0"
                        />
                        <span className="truncate">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColorClass(item.status)}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    {/* Service and Action */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Dịch vụ
                        </p>
                        <p className="text-sm font-medium truncate">
                          {item.service}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Hành động
                        </p>
                        <p className="text-sm font-medium truncate">
                          {item.action}
                        </p>
                      </div>
                    </div>

                    {/* Entity */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Thực thể
                      </p>
                      <p className="text-sm font-medium truncate">
                        {item.entity}
                      </p>
                      {item.entityId && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                          ID: {item.entityId}
                        </p>
                      )}
                    </div>

                    {/* Performed By */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Người thực hiện
                      </p>
                      <p className="text-sm truncate">{item.performedBy}</p>
                    </div>

                    {/* Message */}
                    {item.message && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Nội dung
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {item.message}
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MonitoringList;
