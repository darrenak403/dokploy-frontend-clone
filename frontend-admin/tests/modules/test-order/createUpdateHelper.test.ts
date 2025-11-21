/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  validationCreateTestOrderSchema,
  validationUpdateTestOrderSchema,
} from "@/modules/test-order/createUpdateHelper";

describe("Test Order Validation Schemas", () => {
  describe("validationCreateTestOrderSchema", () => {
    const validData = {
      patientId: 1,
      priority: "medium",
      instrumentId: 10,
      runBy: 5,
    };

    describe("patientId", () => {
      it("should pass with valid patientId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate(validData)
        ).resolves.toBeTruthy();
      });

      it("should fail with non-integer patientId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            patientId: 1.5,
          })
        ).rejects.toThrow("Lỗi Bệnh nhân id");
      });

      it("should fail with negative patientId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            patientId: -1,
          })
        ).rejects.toThrow("Lỗi Bệnh nhân id");
      });

      it("should fail with zero patientId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            patientId: 0,
          })
        ).rejects.toThrow("Lỗi Bệnh nhân id");
      });

      it("should handle string number conversion", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            patientId: "5" as any,
          })
        ).resolves.toBeTruthy();
      });

      it("should handle empty string as undefined", async () => {
        const { patientId: _patientId, ...data } = validData;
        await expect(
          validationCreateTestOrderSchema.validate({
            ...data,
            patientId: "" as any,
          })
        ).resolves.toBeTruthy();
      });

      it("should handle null as undefined", async () => {
        const { patientId: _patientId, ...data } = validData;
        await expect(
          validationCreateTestOrderSchema.validate({
            ...data,
            patientId: null as any,
          })
        ).resolves.toBeTruthy();
      });
    });

    describe("priority", () => {
      it("should pass with empty string priority", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            priority: "",
          })
        ).resolves.toBeTruthy();
      });

      it("should pass with low priority", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            priority: "low",
          })
        ).resolves.toBeTruthy();
      });

      it("should pass with medium priority", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            priority: "medium",
          })
        ).resolves.toBeTruthy();
      });

      it("should pass with high priority", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            priority: "high",
          })
        ).resolves.toBeTruthy();
      });

      it("should fail with invalid priority", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            priority: "urgent",
          })
        ).rejects.toThrow("Vui lòng chọn mức độ ưu tiên hợp lệ");
      });
    });

    describe("instrumentId", () => {
      it("should pass with valid instrumentId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate(validData)
        ).resolves.toBeTruthy();
      });

      it("should fail with non-integer instrumentId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            instrumentId: 10.5,
          })
        ).rejects.toThrow("Lỗi id thiết bị");
      });

      it("should fail with negative instrumentId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            instrumentId: -1,
          })
        ).rejects.toThrow("Lỗi id thiết bị");
      });

      it("should fail with zero instrumentId", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            instrumentId: 0,
          })
        ).rejects.toThrow("Lỗi id thiết bị");
      });

      it("should handle string number conversion", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            instrumentId: "10" as any,
          })
        ).resolves.toBeTruthy();
      });
    });

    describe("runBy", () => {
      it("should pass with valid runBy", async () => {
        await expect(
          validationCreateTestOrderSchema.validate(validData)
        ).resolves.toBeTruthy();
      });

      it("should fail with non-integer runBy", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({ ...validData, runBy: 5.5 })
        ).rejects.toThrow("Lỗi id người thực hiện");
      });

      it("should fail with negative runBy", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({ ...validData, runBy: -1 })
        ).rejects.toThrow("Lỗi id người thực hiện");
      });

      it("should fail with zero runBy", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({ ...validData, runBy: 0 })
        ).rejects.toThrow("Lỗi id người thực hiện");
      });

      it("should handle string number conversion", async () => {
        await expect(
          validationCreateTestOrderSchema.validate({
            ...validData,
            runBy: "5" as any,
          })
        ).resolves.toBeTruthy();
      });
    });
  });

  describe("validationUpdateTestOrderSchema", () => {
    const validData = {
      runBy: 5,
    };

    describe("runBy", () => {
      it("should pass with valid runBy", async () => {
        await expect(
          validationUpdateTestOrderSchema.validate(validData)
        ).resolves.toBeTruthy();
      });

      it("should fail with non-integer runBy", async () => {
        await expect(
          validationUpdateTestOrderSchema.validate({ ...validData, runBy: 5.5 })
        ).rejects.toThrow("Lỗi id người thực hiện");
      });

      it("should fail with negative runBy", async () => {
        await expect(
          validationUpdateTestOrderSchema.validate({ ...validData, runBy: -1 })
        ).rejects.toThrow("Lỗi id người thực hiện");
      });

      it("should handle string number conversion", async () => {
        await expect(
          validationUpdateTestOrderSchema.validate({
            ...validData,
            runBy: "5" as any,
          })
        ).resolves.toBeTruthy();
      });
    });
  });
});
