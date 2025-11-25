"use client";
import React, { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardBody,
  Chip,
  User as HeroUser,
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
  Tooltip,
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
        <div className="p-4 border-b border-divider flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <Input
              className="flex-1"
              placeholder="Tìm kiếm theo tên, ID, email hoặc điện thoại..."
              value={rawQuery}
              onValueChange={setRawQuery}
              startContent={
                <Icon icon="mdi:magnify" className="h-4 w-4 text-default-400" />
              }
              size="sm"
              variant="bordered"
            />

            {/* User Filter */}
            <Select
              placeholder="All Users"
              selectedKeys={new Set([userFilter])}
              onSelectionChange={(keys) =>
                setUserFilter(Array.from(keys)[0] as string)
              }
              size="sm"
              variant="bordered"
              className="w-full sm:w-40"
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
              className="w-full sm:w-40"
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

        <div className="flex-1 overflow-auto">
          <Table
            aria-label="User records table"
            classNames={{
              wrapper: "shadow-none",
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
                <TableRow key={item.id} className="border-b border-zinc-200/50">
                  {(columnKey: React.Key) => {
                    // render cell per column key
                    switch (columnKey) {
                      case "name": {
                        // determine active state; if backend provides status use it, otherwise default to active
                        const isActive = !(
                          item.banned === 1 || item.banned === true
                        );
                        return (
                          <TableCell>
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
                          <TableCell>
                            {getGenderLabel(item.gender) || "-"}
                          </TableCell>
                        );

                      case "role":
                        return (
                          <TableCell>
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold">
                                {genderRoleLabel(item.role)}
                              </p>
                            </div>
                          </TableCell>
                        );
                      case "dob":
                        return <TableCell>{item.dateOfBirth || "-"}</TableCell>;
                      case "phone":
                        return <TableCell>{item.phone || "-"}</TableCell>;
                      case "email":
                        return <TableCell>{item.email || "-"}</TableCell>;
                      case "address":
                        return (
                          <TableCell className="w-[200px]">
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
                          <TableCell>
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
                          <TableCell>
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
                                  <Icon icon="mdi:pencil" className="h-4 w-4" />
                                </button>
                              </Tooltip>
                              <Tooltip content="Cấm">
                                <button
                                  // onClick={() => ()}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                                >
                                  <Icon icon="mdi:block" className="h-4 w-4" />
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
      </CardBody>
    </Card>
  );
};
export default AccountList;
