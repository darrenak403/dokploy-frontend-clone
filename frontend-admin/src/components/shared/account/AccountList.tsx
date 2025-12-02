"use client";
import React, { useEffect, useMemo, useState } from "react";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  User as HeroUser,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { useGetUserByIdDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useGetUserByIdDiscloresure";
import { useUpdateUserDiscloresureSingleton } from "@/hook/singleton/discloresures/account/useUpdateUserDiscloresure";
import { useFetchGetAllUserSwrSingleton } from "@/hook/singleton/swrs/user/useFetchGetAllUserSwr";

import {
  genderRoleLabel,
  getGenderLabel,
} from "@/modules/user/getAllUserHelper";

import { ExpandableText } from "@/components/modules/ExpandString/ExpandableText";

const AccountList: React.FC = () => {
  const { openWithUserId } = useGetUserByIdDiscloresureSingleton();
  const { openWithUser } = useUpdateUserDiscloresureSingleton();
  const [rawQuery, setRawQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(rawQuery), 250);
    return () => clearTimeout(id);
  }, [rawQuery]);
  const [userFilter, setUserFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // handle get all user
  const { data, isLoading, error } = useFetchGetAllUserSwrSingleton();

  // filter users by search query and role
  const filteredUsers = useMemo(() => {
    const users = Array.isArray(data?.data) ? data?.data : [];
    const q = searchQuery.trim().toLowerCase();
    const wantedRole = roleFilter.toString().toLowerCase();

    return users.filter((u) => {
      if (roleFilter !== "all") {
        const roleVal = (u.role || "").toString().toLowerCase();
        if (wantedRole === "guest") {
          if (roleVal && roleVal.startsWith("role_")) return false;
        } else if (!roleVal.includes(wantedRole)) {
          return false;
        }
      }

      if (userFilter !== "all") {
        const isInactive = u.banned === 1 || u.banned === true;
        if (userFilter === "active" && isInactive) return false;
        if (userFilter === "inactive" && !isInactive) return false;
      }

      if (!q) return true;
      const name = (u.fullName || "").toString().toLowerCase();
      const email = (u.email || "").toString().toLowerCase();
      const phone = (u.phone || "").toString().toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        String(u.id || "").includes(q)
      );
    });
  }, [data?.data, roleFilter, userFilter, searchQuery]);

  if (error) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <p className="text-danger">Lỗi tải người dùng: {error.message}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-none border border-gray-200 flex flex-col h-full">
      <CardBody className="p-0 flex flex-col h-full">
        {/* Header with Search and Filters */}
        <div className="p-3 sm:p-4 border-b border-divider flex-shrink-0">
          {/* Search Input - Always visible */}
          <Input
            className="w-full mb-3"
            placeholder="Tìm kiếm..."
            value={rawQuery}
            onValueChange={setRawQuery}
            startContent={
              <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
            }
            size="sm"
            variant="bordered"
          />

          {/* Filters Toggle Button - Mobile */}
          <div className="flex gap-2 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon icon="mdi:filter-variant" className="h-4 w-4" />
              <span>Lọc</span>
              {(userFilter !== "all" || roleFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
            {(userFilter !== "all" || roleFilter !== "all") && (
              <button
                onClick={() => {
                  setUserFilter("all");
                  setRoleFilter("all");
                }}
                className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Filters - Desktop always visible, Mobile collapsible */}
          <div
            className={`${
              showFilters ? "flex" : "hidden"
            } lg:flex flex-col sm:flex-row gap-3 mt-3 lg:mt-0`}
          >
            {/* User Filter */}
            <Select
              placeholder="Trạng thái"
              selectedKeys={new Set([userFilter])}
              onSelectionChange={(keys) =>
                setUserFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              <SelectItem key="all">Tất cả tài khoản</SelectItem>
              <SelectItem key="active">Đang hoạt động</SelectItem>
              <SelectItem key="inactive">Ngừng hoạt động</SelectItem>
            </Select>

            {/* Role Filter */}
            <Select
              placeholder="Vai trò"
              selectedKeys={new Set([roleFilter])}
              onSelectionChange={(keys) =>
                setRoleFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-auto sm:min-w-[160px]"
            >
              <SelectItem key="all">Tất cả vai trò</SelectItem>
              <SelectItem key="role_admin">Quản trị viên</SelectItem>
              <SelectItem key="role_doctor">Bác sĩ</SelectItem>
              <SelectItem key="role_manager">Quản lý</SelectItem>
              <SelectItem key="role_staff">Nhân viên</SelectItem>
              <SelectItem key="role_patient">Bệnh nhân</SelectItem>
              <SelectItem key="guest">Khách hàng</SelectItem>
            </Select>
          </div>
        </div>

        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden lg:block flex-1 min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] overflow-auto">
          <div className="overflow-x-auto">
            <Table
              aria-label="User records table"
              classNames={{
                wrapper: "shadow-none min-w-max",
                table: "h-full",
                tbody: "h-full",
              }}
            >
              {/* Column-driven header like the example */}
              <TableHeader
                columns={[
                  { name: "HỌ VÀ TÊN", uid: "name" },
                  { name: "GIỚI TÍNH", uid: "gender" },
                  { name: "VAI TRÒ", uid: "role" },
                  { name: "NGÀY SINH", uid: "dob" },
                  { name: "SỐ ĐIỆN THOẠI", uid: "phone" },
                  { name: "EMAIL", uid: "email" },
                  { name: "ĐỊA CHỈ", uid: "address" },
                  { name: "TRẠNG THÁI", uid: "status" },
                  { name: "HÀNH ĐỘNG", uid: "actions" },
                ]}
              >
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    className="whitespace-nowrap"
                  >
                    {column.name}
                  </TableColumn>
                )}
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
                      Không tìm thấy tài khoản nào phù hợp
                    </h3>
                    <p className="text-sm text-default-500">
                      Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc của bạn.
                    </p>
                  </div>
                }
              >
                {filteredUsers.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-b border-zinc-200/50"
                  >
                    {(columnKey: React.Key) => {
                      // render cell per column key
                      switch (columnKey) {
                        case "name": {
                          // determine active state; if backend provides status use it, otherwise default to active
                          const isActive = !(
                            item.banned === 1 || item.banned === true
                          );
                          return (
                            <TableCell className="min-w-[200px]">
                              <div className="relative inline-block">
                                <HeroUser
                                  avatarProps={{
                                    radius: "lg",
                                    src: item.avatarUrl ?? undefined,
                                  }}
                                  description={item.email}
                                  name={item.fullName || "-"}
                                />
                                {isActive && (
                                  <span className="absolute left-0 bottom-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800 bg-emerald-500" />
                                )}
                              </div>
                            </TableCell>
                          );
                        }
                        case "gender":
                          return (
                            <TableCell className="min-w-[100px]">
                              {getGenderLabel(item.gender) || "-"}
                            </TableCell>
                          );

                        case "role":
                          return (
                            <TableCell className="min-w-[120px]">
                              <div className="flex flex-col">
                                <p className="text-sm font-semibold">
                                  {genderRoleLabel(item.role)}
                                </p>
                              </div>
                            </TableCell>
                          );
                        case "dob":
                          return (
                            <TableCell className="min-w-[120px]">
                              {item.dateOfBirth || "-"}
                            </TableCell>
                          );
                        case "phone":
                          return (
                            <TableCell className="min-w-[130px]">
                              {item.phone || "-"}
                            </TableCell>
                          );
                        case "email":
                          return (
                            <TableCell className="min-w-[180px]">
                              {item.email || "-"}
                            </TableCell>
                          );
                        case "address":
                          return (
                            <TableCell className="min-w-[200px]">
                              <ExpandableText
                                text={item.address}
                                maxLength={30}
                              />
                            </TableCell>
                          );
                        case "status": {
                          const isInactive =
                            item.banned === 1 || item.banned === true;
                          const statusText = isInactive
                            ? "Ngừng hoạt động"
                            : "Đang hoạt động";
                          return (
                            <TableCell className="min-w-[140px]">
                              <Chip
                                color={isInactive ? "danger" : "success"}
                                size="sm"
                                variant="flat"
                              >
                                {statusText}
                              </Chip>
                            </TableCell>
                          );
                        }
                        case "actions":
                          return (
                            <TableCell className="min-w-[120px]">
                              <div className="flex items-center justify-center gap-3">
                                <Tooltip content="Xem">
                                  <button
                                    onClick={() =>
                                      openWithUserId(String(item.id))
                                    }
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                                  >
                                    <Icon icon="mdi:eye" className="h-4 w-4" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Chỉnh sửa">
                                  <button
                                    onClick={() => openWithUser(item)}
                                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                                  >
                                    <Icon
                                      icon="mdi:pencil"
                                      className="h-4 w-4"
                                    />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Cấm">
                                  <button
                                    // onClick={() => ()}
                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                                  >
                                    <Icon
                                      icon="mdi:block"
                                      className="h-4 w-4"
                                    />
                                  </button>
                                </Tooltip>
                              </div>
                            </TableCell>
                          );
                        default: {
                          const raw = (
                            item as unknown as Record<string, unknown>
                          )[String(columnKey)];
                          let content: React.ReactNode;
                          if (raw === null || raw === undefined) {
                            content = "-";
                          } else if (typeof raw === "object") {
                            try {
                              content = JSON.stringify(raw);
                            } catch {
                              content = String(raw);
                            }
                          } else {
                            content = String(raw);
                          }
                          return <TableCell>{content}</TableCell>;
                        }
                      }
                    }}
                  </TableRow>
                ))}

                {/* ))} */}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile Card View - Visible only on Mobile */}
        <div className="lg:hidden flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <Spinner color="primary" size="lg" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Icon
                icon="mdi:account-search"
                className="mx-auto h-16 w-16 text-default-300 mb-4"
              />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không tìm thấy tài khoản
              </h3>
              <p className="text-sm text-default-500">
                Vui lòng điều chỉnh tìm kiếm hoặc bộ lọc.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-3">
              {filteredUsers.map((item) => {
                const isActive = !(item.banned === 1 || item.banned === true);
                return (
                  <Card
                    key={item.id}
                    className="shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <CardBody className="p-4">
                      {/* User Header */}
                      {/* User Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="relative">
                          <HeroUser
                            avatarProps={{
                              radius: "lg",
                              src: item.avatarUrl ?? undefined,
                              className: "w-12 h-12",
                            }}
                            name=""
                            classNames={{
                              base: "justify-start",
                            }}
                          />
                          {isActive && (
                            <span className="absolute right-0 bottom-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800 bg-emerald-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base text-foreground truncate">
                            {item.fullName || "Chưa có tên"}
                          </h3>
                          <p className="text-xs text-default-500 truncate">
                            {item.email || "-"}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Chip
                              size="sm"
                              variant="flat"
                              color={isActive ? "success" : "danger"}
                              className="text-[10px] h-5"
                            >
                              {isActive ? "Hoạt động" : "Ngừng"}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="flat"
                              color="primary"
                              className="text-[10px] h-5"
                            >
                              {genderRoleLabel(item.role)}
                            </Chip>
                          </div>
                        </div>
                      </div>

                      {/* User Details Grid */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm w-full">
                          <Icon
                            icon="mdi:gender-male-female"
                            className="h-4 w-4 text-default-400 flex-shrink-0"
                          />
                          <span className="text-default-700 flex-1">
                            {getGenderLabel(item.gender) || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm w-full">
                          <Icon
                            icon="mdi:cake-variant"
                            className="h-4 w-4 text-default-400 flex-shrink-0"
                          />
                          <span className="text-default-700 flex-1">
                            {item.dateOfBirth || "-"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm w-full">
                          <Icon
                            icon="mdi:phone"
                            className="h-4 w-4 text-default-400 flex-shrink-0"
                          />
                          <span className="text-default-700 flex-1">
                            {item.phone || "-"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm w-full">
                          <Icon
                            icon="mdi:map-marker"
                            className="h-4 w-4 text-default-400 flex-shrink-0 mt-0.5"
                          />
                          <span className="text-default-700 flex-1 line-clamp-2">
                            {item.address || "-"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-3 border-t border-divider">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWithUserId(String(item.id));
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                        >
                          <Icon icon="mdi:eye" className="h-4 w-4" />
                          <span>Xem</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openWithUser(item);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30 rounded-lg transition-colors"
                        >
                          <Icon icon="mdi:pencil" className="h-4 w-4" />
                          <span>Sửa</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle ban action
                          }}
                          className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                        >
                          <Icon icon="mdi:block" className="h-4 w-4" />
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
export default AccountList;
