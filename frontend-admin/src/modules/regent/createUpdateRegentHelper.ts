import * as Yup from "yup";

import { REAGENT_TYPE_VALUES } from "@/types/regent";

const LOT_NUMBER_REGEX = /^LOT-\d{4}-[A-Z0-9]+$/;

const PHONE_REGEX = /^\+?\d{9,15}$/;

export const createReagentValidationSchema = Yup.object({
  reagentType: Yup.string()
    .required("Bắt buộc")
    .oneOf(REAGENT_TYPE_VALUES, "Loại thuốc thử không hợp lệ"),

  reagentName: Yup.string()
    .required("Bắt buộc")
    .min(5, "Tên thuốc thử phải có ít nhất 5 kí tự")
    .max(50, "Tên thuốc thử không quá 50 kí tự"),

  lotNumber: Yup.string()
    .required("Bắt buộc")
    .matches(LOT_NUMBER_REGEX, "Mã lô phải đúng định dạng"),

  quantity: Yup.number()
    .typeError("Phải là số")
    .moreThan(0, "> 0")
    .required("Bắt buộc"),

  unit: Yup.string().required("Bắt buộc"),

  expiryDate: Yup.string()
    .required("Bắt buộc")
    .test(
      "is-future-date",
      "Hạn sử dụng phải là ngày trong tương lai",
      (value) => {
        if (!value) return false;
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d.getTime() > today.getTime();
      }
    ),

  vendorId: Yup.string().required("Bắt buộc"),

  vendorName: Yup.string()
    .required("Bắt buộc")
    .min(5, "Tên nhà cung cấp phải có ít nhất 5 kí tự")
    .max(50, "Tên nhà cung cấp không quá 50 kí tự"),

  vendorContact: Yup.string()
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .matches(PHONE_REGEX, "Số điện thoại không hợp lệ"),

  remarks: Yup.string()
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .min(5, "Ghi chú ít nhất 5 kí tự")
    .max(50, "Ghi chú không quá 50 kí tự"),
});
