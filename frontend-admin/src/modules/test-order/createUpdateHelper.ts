import * as yup from "yup";

export const validationCreateTestOrderSchema = yup.object({
  patientId: yup
    .number()
    .transform((value, original) =>
      original === "" || original == null ? undefined : Number(original)
    )
    .typeError("Bệnh nhân là bắt buộc")
    .integer("Lỗi Bệnh nhân id")
    .positive("Lỗi Bệnh nhân id"),

  priority: yup
    .string()
    .oneOf(
      ["", "low", "medium", "high"],
      "Vui lòng chọn mức độ ưu tiên hợp lệ"
    ),

  instrumentId: yup
    .number()
    .transform((value, original) =>
      original === "" || original == null ? undefined : Number(original)
    )
    .typeError("Thiết bị là bắt buộc")
    .integer("Lỗi id thiết bị")
    .positive("Lỗi id thiết bị"),

  runBy: yup
    .number()
    .transform((value, original) =>
      original === "" || original == null ? undefined : Number(original)
    )
    .typeError("Người thực hiện là bắt buộc")
    .integer("Lỗi id người thực hiện")
    .positive("Lỗi id người thực hiện"),
});

export const validationUpdateTestOrderSchema = yup.object({
  runBy: yup
    .number()
    .transform((value, original) =>
      original === "" || original == null ? undefined : Number(original)
    )
    .typeError("Người thực hiện là bắt buộc")
    .integer("Lỗi id người thực hiện")
    .positive("Lỗi id người thực hiện")
    .required("Người thực hiện là bắt buộc"),
});
