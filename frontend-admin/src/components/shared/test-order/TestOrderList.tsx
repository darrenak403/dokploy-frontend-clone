"use client";
import React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Pagination,
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
import Swal from "sweetalert2";
import { useSWRConfig } from "swr";

import { TestOrder } from "@/types/test-order";

import {
  useUpdateTestOrderDiscloresureSingleton,
  useViewTestOrderDiscloresureSingleton,
} from "@/hook/singleton/discloresures";
import { useFetchAllPatientSwrSingleton } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";
import { useFetchAllTestOrderSwrCore } from "@/hook/singleton/swrs/test-order/useFetchAllTestOrderSwr";
import { useFetchDeleteTestOrderSwrSingleton } from "@/hook/singleton/swrs/test-order/useFetchDeleteTestOrderSwr";

import { convertToDdMmYyyyFormat } from "@/modules/day";
import { encryptForURL } from "@/modules/encrypt";
import {
  computeBoundary,
  filterTestOrders,
  formatTestId,
  getPriorityColor,
  getStatusColor,
  getStatusText,
  parseDateOnly,
} from "@/modules/test-order/getAllTestOrderHelper";
import { getGenderLabel } from "@/modules/test-order/getAllTestOrderHelper";

import { ExpandableText } from "@/components/modules/ExpandString/ExpandableText";

const TestOrderList: React.FC = () => {
  const router = useRouter();
  const { mutate: _mutate } = useSWRConfig();
  const viewTestOrderDisclosure = useViewTestOrderDiscloresureSingleton();
  const disclosure = useUpdateTestOrderDiscloresureSingleton();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  // fetch all patients to map patientCode
  const { data: patientsData } = useFetchAllPatientSwrSingleton();

  const patientsList = Array.isArray(patientsData?.data)
    ? patientsData.data
    : (patientsData?.data?.data ?? []);
  const patientCodeMap = new Map<string, string>();
  for (const p of patientsList) {
    if (p && p.id != null)
      patientCodeMap.set(String(p.id), p.patientCode ?? "");
  }

  // handle delete test order
  const { deleteTestOrder } = useFetchDeleteTestOrderSwrSingleton();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [size] = useState(10);

  const statusQuery =
    statusFilter && statusFilter !== "all" ? statusFilter : undefined;

  const qs = new URLSearchParams();
  if (statusQuery) qs.set("status", statusQuery);
  qs.set("page", String(page));
  qs.set("size", String(size));

  const {
    data,
    isLoading,
    error,
    mutate: mutateOrders,
  } = useFetchAllTestOrderSwrCore(`/orders?${qs.toString()}`);

  const testOrders = Array.isArray(data?.data?.list)
    ? data!.data!.list
    : (data?.data?.testOrders ?? []);
  const filteredTestOrders = filterTestOrders(testOrders, searchQuery);

  const boundary = computeBoundary(timeFilter);

  const timeFilteredTestOrders = !boundary
    ? filteredTestOrders
    : timeFilter === "1year"
      ? filteredTestOrders.filter((p) => {
          const created = parseDateOnly(p.createdAt);
          return created && created.getFullYear() === boundary;
        })
      : filteredTestOrders.filter((p) => {
          const created = parseDateOnly(p.createdAt);
          return created && created >= boundary;
        });

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Xóa đơn xét nghiệm ${formatTestId(
        id
      )}? Hành động này không thể hoàn tác.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    setDeletingId(id);

    Swal.fire({
      title: "Đã xóa!",
      text: `Đơn xét nghiệm ${formatTestId(id)} đã được xóa.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    try {
      await deleteTestOrder(id);
      await mutateOrders();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text:
          "Delete failed: " +
          (err instanceof Error ? err.message : String(err)),
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewTestOrder = (testOrderId?: number) => {
    if (!testOrderId) return;
    viewTestOrderDisclosure?.openWithTestOrderId(testOrderId);
  };

  const handleOpenUpdateModal = (order?: TestOrder) => {
    if (!order) return;
    disclosure?.openWithTestOrder(order);
  };

  const handleViewDraftTestResultDetail = (
    testOrderId: number,
    accessionNumber: string
  ) => {
    const encryptedId = encryptForURL(testOrderId);
    const encryptedAcc = encryptForURL(accessionNumber);
    router.push(`/service/test-order/${encryptedId}/${encryptedAcc}/results`);
  };

  const handleSendingLabResult = (accessionNumber: string) => {
    const encryptedAcc = encryptForURL(accessionNumber);
    router.push(`/service/lab-result/${encryptedAcc}`);
  };

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-danger">Lỗi tải đơn xét nghiệm: {error.message}</p>
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
            {/* Search Input */}
            <Input
              className="flex-1"
              placeholder="Tìm kiếm theo tên, ID, email hoặc điện thoại..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={
                <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
              }
              size="sm"
              variant="bordered"
            />
            <Pagination
              size="sm"
              color="danger"
              showControls
              onChange={setPage}
              page={data?.data?.currentPage ?? page}
              total={data?.data?.totalPages ?? 1}
              key={`${page}-${Number(data?.data?.totalPages ?? 1)}`}
            />

            {/* Status Filter (server-side) */}
            <Select
              aria-label="Chọn thời gian"
              placeholder="All Status"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) =>
                setStatusFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-40"
            >
              <SelectItem key="all">Tất cả trạng thái</SelectItem>
              <SelectItem key="PENDING">Đang chờ</SelectItem>
              <SelectItem key="CANCELLED">Đã hủy</SelectItem>
              <SelectItem key="COMPLETED">Đã hoàn thành</SelectItem>
              <SelectItem key="REVIEWED">Đã xem xét</SelectItem>
              <SelectItem key="AI_REVIEWED">Đã xem bởi AI</SelectItem>
            </Select>

            {/* Time Filter */}
            <Select
              aria-label="Chọn thời gian"
              placeholder="All Time"
              selectedKeys={[timeFilter]}
              onSelectionChange={(keys) =>
                setTimeFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-40"
            >
              <SelectItem key="all">Tất cả thời gian</SelectItem>
              <SelectItem key="30days">30 ngày qua</SelectItem>
              <SelectItem key="6months">6 tháng qua</SelectItem>
              <SelectItem key="1year">1 năm trước</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex-1 min-h-[500px] overflow-auto">
          <div className="overflow-x-auto">
            <Table
              aria-label="Patient records table"
              classNames={{
                wrapper: "shadow-none min-w-max",
                table: "h-full",
                tbody: "h-full",
              }}
            >
              <TableHeader>
                <TableColumn className="whitespace-nowrap">
                  MÃ XÉT NGHIỆM
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  TÊN BỆNH NHÂN
                </TableColumn>
                <TableColumn className="whitespace-nowrap">ĐỊA CHỈ</TableColumn>
                <TableColumn className="whitespace-nowrap">
                  GIỚI TÍNH
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  NGÀY SINH
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  ĐIỆN THOẠI
                </TableColumn>
                {/* <TableColumn>EMAIL</TableColumn> */}
                {/* <TableColumn>TẠO BỞI</TableColumn> */}
                <TableColumn className="whitespace-nowrap">
                  NGƯỜI KIỂM TRA
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  LOẠI XÉT NGHIỆM
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  THIẾT BỊ
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  ĐỘ ƯU TIÊN
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  THỜI GIAN TẠO
                </TableColumn>
                <TableColumn className="whitespace-nowrap">
                  TRẠNG THÁI
                </TableColumn>
                <TableColumn className="flex items-center justify-center whitespace-nowrap">
                  HÀNH ĐỘNG
                </TableColumn>
              </TableHeader>
              <TableBody
                isLoading={isLoading}
                loadingContent={<Spinner color="primary" />}
                emptyContent={
                  <div className="text-center py-8">
                    <Icon
                      icon="mdi:account-search"
                      className="mx-auto h-12 w-12 text-default-300 mb-4"
                    />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Không tìm thấy đơn xét nghiệm
                    </h3>
                    <p className="text-sm text-default-500">
                      Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn.
                    </p>
                  </div>
                }
              >
                {timeFilteredTestOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-b border-zinc-200/50"
                  >
                    <TableCell className="min-w-[150px]">
                      <span className="font-mono text-sm font-semibold text-[var(--coral-500)]">
                        {order.accessionNumber ? order.accessionNumber : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="flex flex-col gap-0.5 min-w-[200px]">
                      <span className="font-medium">{order.patientName}</span>
                      <span className="text-[12px] text-default-500">
                        {String(patientCodeMap.get(String(order.patientId))) ||
                          "-"}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      <ExpandableText text={order.address} maxLength={20} />
                      {/* <AddressCell address={order.address} /> */}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <Chip
                        color={
                          getGenderLabel(order.gender?.toLowerCase()) === "male"
                            ? "primary"
                            : "secondary"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {getGenderLabel(order.gender ?? undefined) || "N/A"}
                      </Chip>
                    </TableCell>

                    <TableCell className="min-w-[120px]">
                      <span className="text-sm">
                        {convertToDdMmYyyyFormat(order?.yob ?? "") || "-"}
                      </span>
                      {/* <span className="text-[12px] text-default-500">
                      {order.age ? `(${order.age} years old)` : ""}
                    </span> */}
                    </TableCell>
                    <TableCell className="min-w-[130px]">
                      <span className="text-sm">{order.phone || "-"}</span>
                    </TableCell>
                    {/* <TableCell>
                    <span className="text-sm">{order.email || "-"}</span>
                  </TableCell> */}
                    <TableCell className="min-w-[120px]">
                      <span className="text-sm ">{order.runBy || "-"}</span>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <span className="text-sm">Xét nghiệm máu</span>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <span className="text-sm">
                        {order.instrumentName || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Chip
                        color={getPriorityColor(order.priority || "Low")}
                        size="sm"
                        variant="flat"
                      >
                        {typeof order.priority === "string"
                          ? order.priority
                          : "-"}
                      </Chip>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <span className="text-sm">
                        {order.createdAt
                          ? String(order.createdAt).split(" ")[0]
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      <Chip
                        color={getStatusColor(order.status)}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(order.status)}
                      </Chip>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <div className="flex items-center justify-center">
                        <Dropdown placement="bottom-end">
                          <DropdownTrigger>
                            <Button
                              size="sm"
                              variant="light"
                              aria-label="More actions"
                            >
                              <Icon
                                icon="mdi:dots-vertical"
                                className="h-4 w-4"
                              />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownSection>
                              <DropdownItem
                                key="view"
                                onClick={() => {
                                  if (order.id) handleViewTestOrder(order.id);
                                }}
                              >
                                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                  <Icon
                                    icon="grommet-icons:test"
                                    className="h-4 w-4"
                                  />
                                  <span>Đơn xét nghiệm</span>
                                </div>
                              </DropdownItem>
                              {order.status === "COMPLETED" ? (
                                <DropdownItem
                                  key="result-detail"
                                  onClick={() => {
                                    if (order.accessionNumber)
                                      handleViewDraftTestResultDetail(
                                        order.id,
                                        order.accessionNumber
                                      );
                                  }}
                                >
                                  <div className="flex items-center gap-2 text-violet-600 font-semibold">
                                    <Icon
                                      icon="tdesign:no-result"
                                      className="h-4 w-4"
                                    />
                                    <span>Kết quả xét nghiệm</span>
                                  </div>
                                </DropdownItem>
                              ) : null}
                              {order.status === "PENDING" ? (
                                <DropdownItem
                                  key="send-result-detail"
                                  onClick={() => {
                                    if (order.accessionNumber)
                                      handleSendingLabResult(
                                        order.accessionNumber
                                      );
                                  }}
                                >
                                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                                    <Icon
                                      icon="material-symbols:send-outline-rounded"
                                      className="h-4 w-4"
                                    />
                                    <span>Gửi kết quả xét nghiệm</span>
                                  </div>
                                </DropdownItem>
                              ) : null}
                              <DropdownItem
                                key="edit"
                                onClick={() => {
                                  handleOpenUpdateModal(order);
                                }}
                              >
                                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                                  <Icon icon="mdi:pencil" className="h-4 w-4" />
                                  <span>Chỉnh sửa</span>
                                </div>
                              </DropdownItem>
                              <DropdownItem
                                key="delete"
                                onClick={async () => {
                                  if (typeof order.id === "number") {
                                    await handleDelete(order.id);
                                  }
                                }}
                                aria-disabled={
                                  deletingId === order.id ||
                                  typeof order.id !== "number"
                                }
                              >
                                <div className="flex items-center gap-2 text-red-600 font-semibold">
                                  <Icon
                                    icon={
                                      deletingId === order.id
                                        ? "mdi:loading"
                                        : "mdi:delete"
                                    }
                                    className="h-4 w-4"
                                  />
                                  <span>Xóa</span>
                                </div>
                              </DropdownItem>
                            </DropdownSection>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
export default TestOrderList;
