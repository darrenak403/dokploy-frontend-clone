"use client";
import React, { useState } from "react";

import { useFetchDeletePatientSwrSingleton } from "@/hook";
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

import { Patient } from "@/types/patient";

import {
  useUpdatePatientDiscloresureSingleton,
  useViewPatientDiscloresureSingleton,
} from "@/hook/singleton/discloresures";
import { useCreateTestOrderDiscloresureSingleton } from "@/hook/singleton/discloresures";
import { useFetchAllPatientSwrCore } from "@/hook/singleton/swrs/patient/useFetchAllPatientSwr";

import { parseDateOnly } from "@/modules/day";
import {
  filterPatients,
  formatPatientId,
  getStatusColor,
  getStatusText,
} from "@/modules/patient";
import {
  computeBoundary,
  genderStatusLabel,
} from "@/modules/patient/getAllPatientHelper";
import { getGenderLabel } from "@/modules/patient/getAllPatientHelper";

import { ExpandableText } from "@/components/modules/ExpandString/ExpandableText";

const PatientList: React.FC = () => {
  const { mutate } = useSWRConfig();
  const { openWithPatient: onOpenUpdateModal } =
    useUpdatePatientDiscloresureSingleton();
  const { openWithPatientId: onOpenViewModal } =
    useViewPatientDiscloresureSingleton();
  const [searchQuery, setSearchQuery] = useState("");
  const [patientFilter, setPatientFilter] = useState("all");
  const [statusFilter] = useState("all");

  const [timeFilter, setTimeFilter] = useState("all");
  const disclosure = useCreateTestOrderDiscloresureSingleton();

  // handle delete patient
  const { deletePatient } = useFetchDeletePatientSwrSingleton();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addTestOrderId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  const statusQuery =
    statusFilter && statusFilter !== "all" ? statusFilter : undefined;

  const qs = new URLSearchParams();
  if (statusQuery) qs.set("status", statusQuery);
  qs.set("page", String(page));
  qs.set("size", String(size));
  // handle get all patient
  const {
    data,
    isLoading,
    error,
    mutate: mutatePatient,
  } = useFetchAllPatientSwrCore(`/patient?${qs.toString()}`);

  const patients = Array.isArray(data?.data.data) ? data?.data.data : [];
  const filteredPatients = filterPatients(patients, searchQuery);

  const boundary = computeBoundary(timeFilter);

  const timeFilteredPatients = !boundary
    ? filteredPatients
    : timeFilter === "1year"
      ? filteredPatients.filter((p) => {
          const created = parseDateOnly(p.createdAt);
          return created && created.getFullYear() === boundary;
        })
      : filteredPatients.filter((p) => {
          const created = parseDateOnly(p.createdAt);
          return created && created >= boundary;
        });

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-danger">Lỗi tải bệnh nhân: {error.message}</p>
        </CardBody>
      </Card>
    );
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Xóa bệnh nhân ${formatPatientId(
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
      text: `Bệnh nhân ${formatPatientId(id)} đã được xóa.`,
      icon: "success",
      timer: 2000,
      showConfirmButton: false,
    });
    try {
      await deletePatient(id);
      await mutate("/patient");
      await mutatePatient();
    } catch (err) {
      // console.error("Delete failed:", err);
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
  const handleOpenUpdateModal = (patient?: Patient) => {
    if (!patient) return;
    onOpenUpdateModal(patient);
  };

  const handleViewPatient = (patientId?: number) => {
    if (!patientId) return;
    onOpenViewModal(patientId);
  };

  const handleOpenCreateModal = (patientId: number) => {
    if (!patientId) return;
    disclosure?.openWithPatientId(patientId);
  };

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

            {/* Patient Filter */}
            <Select
              placeholder="All Patients"
              selectedKeys={[patientFilter]}
              onSelectionChange={(keys) =>
                setPatientFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-40"
            >
              <SelectItem key="all">Tất cả bệnh nhân</SelectItem>
              <SelectItem key="active">Đang hoạt động</SelectItem>
              <SelectItem key="inactive">Ngừng hoạt động</SelectItem>
            </Select>

            {/* Time Filter */}
            <Select
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

        <div className="flex-1 overflow-auto">
          <Table
            aria-label="Patient records table"
            classNames={{
              wrapper: "shadow-none",
              table: "h-full",
              tbody: "h-full",
            }}
          >
            <TableHeader>
              {/* <TableColumn>CCCD</TableColumn> */}
              <TableColumn>HỌ TÊN</TableColumn>
              <TableColumn>GIỚI TÍNH</TableColumn>
              <TableColumn>NGÀY SINH</TableColumn>
              <TableColumn>ĐIỆN THOẠI</TableColumn>
              <TableColumn>EMAIL</TableColumn>
              <TableColumn>ĐỊA CHỈ</TableColumn>
              <TableColumn>NGƯỜI TẠO</TableColumn>
              <TableColumn>NGƯỜI CẬP NHẬT</TableColumn>
              <TableColumn>THỜI GIAN TẠO</TableColumn>
              <TableColumn>TRẠNG THÁI</TableColumn>
              <TableColumn className="flex items-center justify-center">
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
                    Không tìm thấy bệnh nhân
                  </h3>
                  <p className="text-sm text-default-500">
                    Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn.
                  </p>
                </div>
              }
            >
              {timeFilteredPatients.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="border-b border-zinc-200/50"
                >
                  {/* <TableCell>{patient.identityNumber ? patient.identityNumber : "-"}</TableCell> */}
                  {/* FullName */}
                  <TableCell className="flex flex-col gap-0.5 w-[200px]">
                    <span className="font-medium">{patient.fullName}</span>
                    <span className="text-[12px] text-default-500">
                      {patient.patientCode || "-"}
                    </span>
                  </TableCell>
                  {/* Gender */}
                  <TableCell>
                    <Chip
                      color={
                        getGenderLabel(patient.gender?.toLowerCase()) === "male"
                          ? "primary"
                          : "secondary"
                      }
                      size="sm"
                      variant="flat"
                    >
                      {getGenderLabel(patient.gender) || "N/A"}
                    </Chip>
                  </TableCell>
                  {/* Date of Birth */}
                  <TableCell>{patient.yob ? patient.yob : "-"}</TableCell>
                  {/* Phone */}
                  <TableCell>
                    <span className="text-sm">{patient.phone || "-"}</span>
                  </TableCell>
                  {/* Email */}
                  <TableCell>
                    <span className="text-sm">{patient.email || "-"}</span>
                  </TableCell>
                  {/* Address */}
                  <TableCell className="w-[200px]">
                    <ExpandableText text={patient.address} maxLength={20} />
                  </TableCell>
                  {/* Created By */}
                  <TableCell className="w-[80px]">
                    <span className="text-sm ">{patient.createdBy || "-"}</span>
                  </TableCell>
                  {/* Modified By */}
                  <TableCell>
                    <span className="text-sm">{patient.modifiedBy || "-"}</span>
                  </TableCell>
                  {/* Created At */}
                  <TableCell>
                    {patient.createdAt
                      ? String(patient.createdAt).split(" ")[0]
                      : "-"}
                  </TableCell>
                  {/* Status */}
                  <TableCell>
                    <Chip
                      color={getStatusColor(patient.deleted)}
                      size="sm"
                      variant="flat"
                    >
                      {genderStatusLabel(getStatusText(patient.deleted))}
                    </Chip>
                  </TableCell>
                  {/* Actions */}
                  <TableCell>
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
                                if (patient.id) handleViewPatient(patient.id);
                              }}
                            >
                              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                <Icon icon="mdi:eye" className="h-4 w-4" />
                                <span>Xem</span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              onClick={() => {
                                handleOpenUpdateModal(patient);
                              }}
                            >
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Icon icon="mdi:pencil" className="h-4 w-4" />
                                <span>Chỉnh sửa</span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              onClick={async () => {
                                if (typeof patient.id === "number") {
                                  await handleDelete(patient.id);
                                }
                              }}
                              aria-disabled={
                                deletingId === patient.id ||
                                typeof patient.id !== "number"
                              }
                            >
                              <div className="flex items-center gap-2 text-red-600 font-semibold">
                                <Icon
                                  icon={
                                    deletingId === patient.id
                                      ? "mdi:loading"
                                      : "mdi:delete"
                                  }
                                  className="h-4 w-4"
                                />
                                <span>Xóa</span>
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              key="addTestOrder"
                              onClick={async () => {
                                if (typeof patient.id === "number") {
                                  handleOpenCreateModal(patient.id);
                                }
                              }}
                              aria-disabled={
                                addTestOrderId === patient.id ||
                                typeof patient.id !== "number"
                              }
                            >
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Icon icon="mdi:plus" className="h-4 w-4" />
                                <span>Thêm đơn xét nghiệm</span>
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
      </CardBody>
    </Card>
  );
};
export default PatientList;
