import {
  validationCreatePatientSchema,
  validationUpdatePatientSchema,
} from "@/modules/patient/createUpdateHelpers";

describe("Patient Validation Schemas", () => {
  describe("validationCreatePatientSchema", () => {
    it("should pass validation with valid userId", async () => {
      const validData = { userId: 1 };
      await expect(
        validationCreatePatientSchema.validate(validData)
      ).resolves.toEqual(validData);
    });

    it("should fail validation without userId", async () => {
      await expect(validationCreatePatientSchema.validate({})).rejects.toThrow(
        "Người dùng là bắt buộc"
      );
    });

    it("should fail validation with non-integer userId", async () => {
      await expect(
        validationCreatePatientSchema.validate({ userId: 1.5 })
      ).rejects.toThrow("Người dùng không hợp lệ");
    });

    it("should fail validation with negative userId", async () => {
      await expect(
        validationCreatePatientSchema.validate({ userId: -1 })
      ).rejects.toThrow("Người dùng không hợp lệ");
    });

    it("should fail validation with zero userId", async () => {
      await expect(
        validationCreatePatientSchema.validate({ userId: 0 })
      ).rejects.toThrow("Người dùng không hợp lệ");
    });

    it("should fail validation with string userId", async () => {
      await expect(
        validationCreatePatientSchema.validate({ userId: "abc" })
      ).rejects.toThrow();
    });
  });

  describe("validationUpdatePatientSchema - userId", () => {
    const baseValidData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street, District 1",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with all valid fields", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseValidData)
      ).resolves.toBeTruthy();
    });

    it("should fail without userId", async () => {
      const { userId: _userId, ...data } = baseValidData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Người dùng là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - fullName", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street, District 1",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid fullName", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should fail with fullName less than 2 characters", async () => {
      await expect(
        validationUpdatePatientSchema.validate({ ...baseData, fullName: "A" })
      ).rejects.toThrow("Họ và tên phải có ít nhất 2 ký tự");
    });

    it("should fail with fullName more than 100 characters", async () => {
      const longName = "A".repeat(101);
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          fullName: longName,
        })
      ).rejects.toThrow("Họ và tên không được vượt quá 100 ký tự");
    });

    it("should fail without fullName", async () => {
      const { fullName: _fullName, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Họ và tên là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - yob (date of birth)", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid date format dd/mm/yyyy", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid date format", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: "2000-01-01",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with invalid date (31/02/2000)", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: "31/02/2000",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should pass with leap year date (29/02/2024)", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: "29/02/2024",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid leap year date (29/02/2023)", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: "29/02/2023",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with date before 1900", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: "01/01/1899",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with future date", async () => {
      const futureYear = new Date().getFullYear() + 1;
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: `01/01/${futureYear}`,
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with age less than 1 year", async () => {
      const currentYear = new Date().getFullYear();
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          yob: `01/01/${currentYear}`,
        })
      ).rejects.toThrow("Bệnh nhân phải ít nhất 1 tuổi");
    });

    it("should fail without yob", async () => {
      const { yob: _yob, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Ngày sinh là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - gender", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with male gender", async () => {
      await expect(
        validationUpdatePatientSchema.validate({ ...baseData, gender: "male" })
      ).resolves.toBeTruthy();
    });

    it("should pass with female gender", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          gender: "female",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with other gender", async () => {
      await expect(
        validationUpdatePatientSchema.validate({ ...baseData, gender: "other" })
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid gender", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          gender: "invalid",
        })
      ).rejects.toThrow("Vui lòng chọn giới tính hợp lệ");
    });

    it("should fail without gender", async () => {
      const { gender: _gender, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Giới tính là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - address", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid address", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should fail with address less than 10 characters", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          address: "Short",
        })
      ).rejects.toThrow("Địa chỉ phải có ít nhất 10 ký tự");
    });

    it("should fail with address more than 255 characters", async () => {
      const longAddress = "A".repeat(256);
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          address: longAddress,
        })
      ).rejects.toThrow("Địa chỉ không được vượt quá 255 ký tự");
    });

    it("should fail without address", async () => {
      const { address: _address, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Địa chỉ là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - phone", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with 10-digit phone number", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "0901234567",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with 11-digit phone number", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "09012345678",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with less than 10 digits", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "090123456",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with more than 11 digits", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "090123456789",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with non-numeric characters", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "090-123-4567",
        })
      ).rejects.toThrow();
    });

    it("should fail with invalid phone patterns (all same digits)", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "0000000000",
        })
      ).rejects.toThrow("Số điện thoại phải hợp lệ");
    });

    it("should fail with sequential pattern", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          phone: "0123456789",
        })
      ).rejects.toThrow("Số điện thoại phải hợp lệ");
    });

    it("should fail without phone", async () => {
      const { phone: _phone, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Số điện thoại là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - email", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid email", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should pass with email containing dots and numbers", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          email: "user.name123@example.com",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid email format", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          email: "invalid-email",
        })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should fail with email missing @", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          email: "testexample.com",
        })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should fail without email", async () => {
      const { email: _email, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).rejects.toThrow("Email là bắt buộc");
    });
  });

  describe("validationUpdatePatientSchema - lastTestDate (optional)", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
      lastTestDate: "01/01/2024",
    };

    it("should pass with valid lastTestDate", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should pass without lastTestDate (optional field)", async () => {
      const { lastTestDate: _lastTestDate, ...data } = baseData;
      await expect(
        validationUpdatePatientSchema.validate(data)
      ).resolves.toBeTruthy();
    });

    it("should fail with empty string lastTestDate", async () => {
      // Empty string should fail validation due to regex pattern
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestDate: "",
        })
      ).rejects.toThrow();
    });

    it("should fail with invalid date format", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestDate: "2024-01-01",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with invalid date", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestDate: "31/02/2024",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with future date", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const futureDateStr = `${String(futureDate.getDate()).padStart(2, "0")}/${String(
        futureDate.getMonth() + 1
      ).padStart(2, "0")}/${futureDate.getFullYear()}`;
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestDate: futureDateStr,
        })
      ).rejects.toThrow("Ngày kiểm tra cuối không được ở tương lai");
    });

    it("should pass with today date", async () => {
      const today = new Date();
      const todayStr = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestDate: todayStr,
        })
      ).resolves.toBeTruthy();
    });
  });

  describe("validationUpdatePatientSchema - lastTestType (optional)", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid test types", async () => {
      const validTypes = [
        "blood_test",
        "urine_test",
        "x_ray",
        "mri",
        "ct_scan",
        "ultrasound",
      ];
      for (const type of validTypes) {
        await expect(
          validationUpdatePatientSchema.validate({
            ...baseData,
            lastTestType: type,
          })
        ).resolves.toBeTruthy();
      }
    });

    it("should pass with empty string", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestType: "",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass without lastTestType", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid test type", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          lastTestType: "invalid_type",
        })
      ).rejects.toThrow("Vui lòng chọn loại xét nghiệm hợp lệ");
    });
  });

  describe("validationUpdatePatientSchema - instrumentUsed (optional)", () => {
    const baseData = {
      userId: 1,
      fullName: "Nguyen Van A",
      yob: "01/01/2000",
      gender: "male",
      address: "123 Main Street",
      phone: "0901234567",
      email: "test@example.com",
    };

    it("should pass with valid instruments", async () => {
      const validInstruments = [
        "microscope",
        "analyzer",
        "centrifuge",
        "spectrophotometer",
        "pcr_machine",
      ];
      for (const instrument of validInstruments) {
        await expect(
          validationUpdatePatientSchema.validate({
            ...baseData,
            instrumentUsed: instrument,
          })
        ).resolves.toBeTruthy();
      }
    });

    it("should pass with empty string", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          instrumentUsed: "",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass without instrumentUsed", async () => {
      await expect(
        validationUpdatePatientSchema.validate(baseData)
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid instrument", async () => {
      await expect(
        validationUpdatePatientSchema.validate({
          ...baseData,
          instrumentUsed: "invalid_instrument",
        })
      ).rejects.toThrow("Vui lòng chọn thiết bị hợp lệ");
    });
  });
});
