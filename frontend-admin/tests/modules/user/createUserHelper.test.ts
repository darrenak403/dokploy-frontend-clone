import { validationCreateUserSchema } from "@/modules/user/createUserHelper";

describe("User Validation Schema", () => {
  const validData = {
    fullName: "Nguyen Van A",
    dateOfBirth: "01/01/2000",
    gender: "male",
    address: "123 Nguyen Trai Street, District 1",
    phone: "0123456789",
    email: "test@example.com",
    password: "password123",
  };

  describe("fullName", () => {
    it("should pass with valid fullName", async () => {
      await expect(
        validationCreateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should fail with too short fullName (1 char)", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, fullName: "A" })
      ).rejects.toThrow("Họ và tên phải có ít nhất 2 ký tự");
    });

    it("should pass with minimum valid fullName (2 chars)", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, fullName: "AB" })
      ).resolves.toBeTruthy();
    });

    it("should pass with maximum valid fullName (100 chars)", async () => {
      const longName = "A".repeat(100);
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          fullName: longName,
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with too long fullName (101 chars)", async () => {
      const tooLongName = "A".repeat(101);
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          fullName: tooLongName,
        })
      ).rejects.toThrow("Họ và tên không được vượt quá 100 ký tự");
    });

    it("should fail with empty fullName", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, fullName: "" })
      ).rejects.toThrow("Họ và tên phải có ít nhất 2 ký tự");
    });

    it("should handle fullName with special characters", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          fullName: "Nguyễn Văn Ấn",
        })
      ).resolves.toBeTruthy();
    });

    it("should handle fullName with numbers", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          fullName: "User123",
        })
      ).resolves.toBeTruthy();
    });
  });

  describe("dateOfBirth", () => {
    it("should pass with valid dateOfBirth", async () => {
      await expect(
        validationCreateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid date format", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "2000-01-01",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ (dd/mm/yyyy)");
    });

    it("should fail with invalid date (32/01/2000)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "32/01/2000",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with invalid month (01/13/2000)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "01/13/2000",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with invalid day in February (30/02/2000)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "30/02/2000",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should pass with leap year date (29/02/2000)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "29/02/2000",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with non-leap year February 29th (29/02/2001)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: "29/02/2001",
        })
      ).rejects.toThrow("Vui lòng nhập ngày hợp lệ");
    });

    it("should fail with age less than 1 year", async () => {
      const today = new Date();
      const futureDate = `${String(today.getDate()).padStart(2, "0")}/${String(
        today.getMonth() + 1
      ).padStart(2, "0")}/${today.getFullYear()}`;
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: futureDate,
        })
      ).rejects.toThrow("Bệnh nhân phải ít nhất 1 tuổi");
    });

    it("should pass with age exactly 1 year ago", async () => {
      const today = new Date();
      const oneYearAgo = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
      const dateStr = `${String(oneYearAgo.getDate()).padStart(2, "0")}/${String(
        oneYearAgo.getMonth() + 1
      ).padStart(2, "0")}/${oneYearAgo.getFullYear()}`;
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          dateOfBirth: dateStr,
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with empty dateOfBirth", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, dateOfBirth: "" })
      ).rejects.toThrow("Ngày sinh là bắt buộc");
    });
  });

  describe("gender", () => {
    it("should pass with male gender", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, gender: "male" })
      ).resolves.toBeTruthy();
    });

    it("should pass with female gender", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, gender: "female" })
      ).resolves.toBeTruthy();
    });

    it("should pass with other gender", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, gender: "other" })
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid gender", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, gender: "unknown" })
      ).rejects.toThrow("Vui lòng chọn giới tính hợp lệ");
    });

    it("should fail with empty gender", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, gender: "" })
      ).rejects.toThrow("Vui lòng chọn giới tính hợp lệ");
    });
  });

  describe("address", () => {
    it("should pass with valid address", async () => {
      await expect(
        validationCreateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should fail with too short address (9 chars)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          address: "123456789",
        })
      ).rejects.toThrow("Địa chỉ phải có ít nhất 10 ký tự");
    });

    it("should pass with minimum valid address (10 chars)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          address: "1234567890",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with maximum valid address (255 chars)", async () => {
      const longAddress = "A".repeat(255);
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          address: longAddress,
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with too long address (256 chars)", async () => {
      const tooLongAddress = "A".repeat(256);
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          address: tooLongAddress,
        })
      ).rejects.toThrow("Địa chỉ không được vượt quá 255 ký tự");
    });

    it("should fail with empty address", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, address: "" })
      ).rejects.toThrow("Địa chỉ phải có ít nhất 10 ký tự");
    });

    it("should handle address with Vietnamese characters", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          address: "123 Nguyễn Trãi, Quận 1",
        })
      ).resolves.toBeTruthy();
    });
  });

  describe("phone", () => {
    it("should pass with valid 10-digit phone", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "0123456789",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with valid 11-digit phone", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "01234567890",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with 9-digit phone", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "012345678",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with 12-digit phone", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "012345678901",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with phone containing letters", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "012345678a",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with phone containing spaces", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "0123 456 789",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with empty phone", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, phone: "" })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });

    it("should fail with phone containing special characters", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          phone: "0123-456-789",
        })
      ).rejects.toThrow("Số điện thoại phải có 10-11 chữ số");
    });
  });

  describe("email", () => {
    it("should pass with valid email", async () => {
      await expect(
        validationCreateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should pass with email containing dots", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          email: "test.user@example.com",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with email containing subdomain", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          email: "test@mail.example.com",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with invalid email (no @)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          email: "testexample.com",
        })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should fail with invalid email (no domain)", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, email: "test@" })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should fail with invalid email (no local part)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          email: "@example.com",
        })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });

    it("should fail with empty email", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, email: "" })
      ).rejects.toThrow("Email là bắt buộc");
    });

    it("should fail with email containing spaces", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          email: "test user@example.com",
        })
      ).rejects.toThrow("Vui lòng nhập địa chỉ email hợp lệ");
    });
  });

  describe("password", () => {
    it("should pass with valid password", async () => {
      await expect(
        validationCreateUserSchema.validate(validData)
      ).resolves.toBeTruthy();
    });

    it("should pass with minimum valid password (6 chars)", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          password: "123456",
        })
      ).resolves.toBeTruthy();
    });

    it("should fail with too short password (5 chars)", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, password: "12345" })
      ).rejects.toThrow("Mật khẩu phải có ít nhất 6 ký tự");
    });

    it("should pass with long password", async () => {
      const longPassword = "A".repeat(50);
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          password: longPassword,
        })
      ).resolves.toBeTruthy();
    });

    it("should pass with password containing special characters", async () => {
      await expect(
        validationCreateUserSchema.validate({
          ...validData,
          password: "P@ssw0rd!",
        })
      ).resolves.toBeTruthy();
    });

    it("should pass without password (optional field)", async () => {
      const { password: _password, ...dataWithoutPassword } = validData;
      await expect(
        validationCreateUserSchema.validate(dataWithoutPassword)
      ).resolves.toBeTruthy();
    });

    it("should fail with empty password (min validation runs first)", async () => {
      await expect(
        validationCreateUserSchema.validate({ ...validData, password: "" })
      ).rejects.toThrow("Mật khẩu phải có ít nhất 6 ký tự");
    });
  });

  describe("Integration tests", () => {
    it("should pass with all valid fields", async () => {
      const result = await validationCreateUserSchema.validate(validData);
      expect(result).toMatchObject(validData);
    });

    it("should fail with multiple invalid fields", async () => {
      const invalidData = {
        fullName: "A",
        dateOfBirth: "32/13/2000",
        gender: "invalid",
        address: "short",
        phone: "123",
        email: "notanemail",
        password: "12345",
      };
      await expect(
        validationCreateUserSchema.validate(invalidData)
      ).rejects.toThrow();
    });
  });
});
