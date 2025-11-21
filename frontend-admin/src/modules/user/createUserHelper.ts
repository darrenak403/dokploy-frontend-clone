import * as yup from "yup";

export const getRoleLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "role_admin") return "Quản trị viên";
  else if (low === "role_manager") return "Quản lý";
  else if (low === "role_staff") return "Nhân viên";
  else if (low === "role_doctor") return "Bác sĩ";
  else if (low === "role_patient") return "Bệnh nhân";
  else if (!low.trim()) return "Khách hàng";
  return g;
};

export const genderRoleLabel = (g?: string) => {
  return getRoleLabel(g);
};

//Validation of create user
export const validationCreateUserSchema = yup.object({
  fullName: yup
    .string()
    .typeError("Họ và tên là bắt buộc")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .required("Họ và tên là bắt buộc"),

  dateOfBirth: yup
    .string()
    .typeError("Ngày sinh là bắt buộc")
    .required("Ngày sinh là bắt buộc")
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)")
    .test("valid-date", "Vui lòng nhập ngày hợp lệ", (value) => {
      if (!value) return false;

      // Parse dd/mm/yyyy format
      const parts = value.split("/");
      if (parts.length !== 3) return false;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (day < 1 || day > 31) return false;
      if (month < 1 || month > 12) return false;
      if (year < 1900 || year > new Date().getFullYear()) return false;

      const date = new Date(year, month - 1, day);

      return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
      );
    })
    .test("age-limit", "Bệnh nhân phải ít nhất 1 tuổi", (value) => {
      if (!value) return false;

      const parts = value.split("/");
      if (parts.length !== 3) return false;

      const year = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();
      return currentYear - year >= 1;
    }),

  gender: yup
    .string()
    .oneOf(["male", "female", "other"], "Vui lòng chọn giới tính hợp lệ")
    .required("Giới tính là bắt buộc"),

  address: yup
    .string()
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(255, "Địa chỉ không được vượt quá 255 ký tự")
    .required("Địa chỉ là bắt buộc"),

  phone: yup
    .string()
    .matches(/^[0-9]{10,11}$/, "Số điện thoại phải có 10-11 chữ số")
    .required("Số điện thoại là bắt buộc"),

  email: yup
    .string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Email là bắt buộc"),

  password: yup
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .notRequired(),
});
