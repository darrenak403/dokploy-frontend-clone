import * as yup from "yup";

export const getGenderLabel = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase();
  if (low === "male") return "Nam";
  if (low === "female") return "Nữ";
  if (low === "other") return "Khác";
  return g;
};

export const mapInputToGenderKey = (input?: string) => {
  if (!input) return "";
  const low = input.toString().toLowerCase().trim();
  if (["nam", "n", "male"].includes(low)) return "male";
  if (["nữ", "nu", "female"].includes(low)) return "female";
  if (["khác", "khac", "other"].includes(low)) return "other";
  // if user already entered backend key or custom, return as-is
  return low;
};

// Convert backend key -> display label (reuse your helper)
export const genderKeyToLabel = (g?: string) => {
  return getGenderLabel(g);
};

export const normalizeGender = (g?: string) => {
  if (!g) return "";
  const low = g.toString().toLowerCase().trim();
  if (["nam", "n", "male"].includes(low)) return "male";
  if (["nữ", "nu", "female"].includes(low)) return "female";
  if (["khác", "khac", "other"].includes(low)) return "other";
  return low;
};

export const getNormalizedGenderLabel = (g?: string) => {
  return normalizeGender(g);
};
//Validation of update user
export const validationIdentityNumberSchema = yup.object({
  identifyNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]{9,12}$/, "Số căn cước phải có 9–12 chữ số")
    .required("Số căn cước là bắt buộc"),

  fullName: yup
    .string()
    .min(10, "Họ và tên phải có ít nhất 10 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .required("Họ và tên là bắt buộc"),

  birthDate: yup.string().required("Ngày sinh là bắt buộc"),

  gender: yup.string().required("Giới tính là bắt buộc"),

  recentLocation: yup
    .string()
    .min(10, "Nơi ở gần đây phải có ít nhất 10 ký tự")
    .max(255, "Nơi ở gần đây không được vượt quá 255 ký tự")
    .required("Nơi ở gần đây là bắt buộc"),

  nationality: yup
    .string()
    .min(5, "Quốc tịch phải có ít nhất 5 ký tự")
    .max(100, "Quốc tịch không được vượt quá 100 ký tự")
    .required("Quốc tịch là bắt buộc"),

  issueDate: yup.string().required("Ngày cấp là bắt buộc"),

  validDate: yup.string().required("Ngày hết hạn là bắt buộc"),
  issuePlace: yup
    .string()
    .min(10, "Nơi cấp phải có ít nhất 10 ký tự")
    .max(255, "Nơi cấp không được vượt quá 255 ký tự")
    .required("Nơi cấp là bắt buộc"),
  features: yup
    .string()
    .min(10, "Đặc điểm nhận dạng phải có ít nhất 10 ký tự")
    .max(500, "Đặc điểm nhận dạng không được vượt quá 500 ký tự")
    .required("Đặc điểm nhận dạng là bắt buộc"),
});
