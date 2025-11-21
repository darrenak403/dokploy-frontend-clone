import * as yup from "yup";

// Create and Update Patient helpers
export const genderOptions = [
  { key: "male", label: "Male" },
  { key: "female", label: "Female" },
  { key: "other", label: "Other" },
];

export const testTypeOptions = [
  { key: "blood_test", label: "Blood Test" },
  { key: "urine_test", label: "Urine Test" },
  { key: "x_ray", label: "X-Ray" },
  { key: "mri", label: "MRI" },
  { key: "ct_scan", label: "CT Scan" },
  { key: "ultrasound", label: "Ultrasound" },
];

export const instrumentOptions = [
  { key: "microscope", label: "Microscope" },
  { key: "analyzer", label: "Blood Analyzer" },
  { key: "centrifuge", label: "Centrifuge" },
  { key: "spectrophotometer", label: "Spectrophotometer" },
  { key: "pcr_machine", label: "PCR Machine" },
];

// Validation of create patient
export const validationCreatePatientSchema = yup.object({
  userId: yup
    .number()
    .typeError("Người dùng là bắt buộc")
    .integer("Người dùng không hợp lệ")
    .positive("Người dùng không hợp lệ")
    .required("Người dùng là bắt buộc"),
});

//Validation of update patient
export const validationUpdatePatientSchema = yup.object({
  userId: yup
    .number()
    .typeError("Người dùng là bắt buộc")
    .integer("Người dùng không hợp lệ")
    .positive("Người dùng không hợp lệ")
    .required("Người dùng là bắt buộc"),
  fullName: yup
    .string()
    .typeError("Họ và tên là bắt buộc")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(100, "Họ và tên không được vượt quá 100 ký tự")
    .required("Họ và tên là bắt buộc"),

  yob: yup
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

      // Validate ranges
      if (day < 1 || day > 31) return false;
      if (month < 1 || month > 12) return false;
      if (year < 1900 || year > new Date().getFullYear()) return false;

      // Create date object (month is 0-indexed in JS)
      const date = new Date(year, month - 1, day);

      // Check if date is valid and matches input
      return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
      );
    })
    .test("age-limit", "Bệnh nhân phải ít nhất 1 tuổi", (value) => {
      if (!value) return false;

      // Parse dd/mm/yyyy format
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
    .test(
      "valid-phone",
      "Số điện thoại phải hợp lệ, không được là dãy số lặp hoặc không thực tế",
      (value) => {
        if (!value) return false;
        // Loại các dãy số giống nhau hoặc mẫu giả
        const invalidPhones = [
          "0123456789",
          "1234567890",
          "0000000000",
          "1111111111",
          "2222222222",
          "3333333333",
          "4444444444",
          "5555555555",
          "6666666666",
          "7777777777",
          "8888888888",
          "9999999999",
        ];
        return !invalidPhones.includes(value);
      }
    )
    .required("Số điện thoại là bắt buộc"),

  email: yup
    .string()
    .email("Vui lòng nhập địa chỉ email hợp lệ")
    .required("Email là bắt buộc"),

  lastTestDate: yup
    .string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)")
    .test("valid-date", "Vui lòng nhập ngày hợp lệ", (value) => {
      if (!value) return true; // Optional field - cho phép empty

      // Parse dd/mm/yyyy format
      const parts = value.split("/");
      if (parts.length !== 3) return false;

      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      // Validate ranges
      if (day < 1 || day > 31) return false;
      if (month < 1 || month > 12) return false;
      if (year < 1900 || year > new Date().getFullYear() + 10) return false;

      // Create date object (month is 0-indexed in JS)
      const date = new Date(year, month - 1, day);

      // Check if date is valid and matches input
      return (
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
      );
    })
    .test(
      "not-future",
      "Ngày kiểm tra cuối không được ở tương lai",
      (value) => {
        if (!value) return true;

        // Parse dd/mm/yyyy format
        const parts = value.split("/");
        if (parts.length !== 3) return false;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        const testDate = new Date(year, month - 1, day);
        const today = new Date();

        // So sánh chỉ theo ngày, không tính giờ
        const testDateOnly = new Date(
          testDate.getFullYear(),
          testDate.getMonth(),
          testDate.getDate()
        );
        const todayOnly = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

        return testDateOnly <= todayOnly; // Cho phép ngày hiện tại
      }
    ),

  lastTestType: yup
    .string()
    .oneOf(
      ["", "blood_test", "urine_test", "x_ray", "mri", "ct_scan", "ultrasound"],
      "Vui lòng chọn loại xét nghiệm hợp lệ"
    ),

  instrumentUsed: yup
    .string()
    .oneOf(
      [
        "",
        "microscope",
        "analyzer",
        "centrifuge",
        "spectrophotometer",
        "pcr_machine",
      ],
      "Vui lòng chọn thiết bị hợp lệ"
    ),
});
