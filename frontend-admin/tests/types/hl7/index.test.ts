import {
  BLOOD_TEST_TEMPLATES,
  HL7Message,
  MSHInfo,
  OBRInfo,
  OBXRow,
  PIDInfo,
  RESULT_STATUS,
  ResultStatus,
} from "@/types/hl7";

describe("HL7 Types", () => {
  describe("BLOOD_TEST_TEMPLATES", () => {
    it("should have hemoglobin template", () => {
      expect(BLOOD_TEST_TEMPLATES.hemoglobin).toBeDefined();
      expect(BLOOD_TEST_TEMPLATES.hemoglobin.name).toBe("Hemoglobin");
      expect(BLOOD_TEST_TEMPLATES.hemoglobin.unit).toBe("g/dL");
    });

    it("should have glucose template", () => {
      expect(BLOOD_TEST_TEMPLATES.glucose).toBeDefined();
      expect(BLOOD_TEST_TEMPLATES.glucose.referenceRange.min).toBe(70);
      expect(BLOOD_TEST_TEMPLATES.glucose.referenceRange.max).toBe(100);
    });

    it("should have cholesterol template", () => {
      expect(BLOOD_TEST_TEMPLATES.cholesterol).toBeDefined();
      expect(BLOOD_TEST_TEMPLATES.cholesterol.unit).toBe("mg/dL");
    });

    it("should have creatinine template", () => {
      expect(BLOOD_TEST_TEMPLATES.creatinine).toBeDefined();
    });

    it("should have potassium template", () => {
      expect(BLOOD_TEST_TEMPLATES.potassium).toBeDefined();
    });
  });

  describe("RESULT_STATUS", () => {
    it("should have NORMAL status", () => {
      expect(RESULT_STATUS.NORMAL).toBe("Normal");
    });

    it("should have HIGH status", () => {
      expect(RESULT_STATUS.HIGH).toBe("High");
    });

    it("should have LOW status", () => {
      expect(RESULT_STATUS.LOW).toBe("Low");
    });

    it("should have CRITICAL status", () => {
      expect(RESULT_STATUS.CRITICAL).toBe("Critical");
    });
  });

  describe("Type definitions", () => {
    it("should define ResultStatus type", () => {
      const status: ResultStatus = "Normal";
      expect(status).toBe("Normal");
    });

    it("should define OBXRow interface", () => {
      const row: OBXRow = {
        id: "1",
        testName: "Test",
        testCode: "T1",
        testValue: 10,
        referenceRange: "5-15",
        unit: "mg/dL",
        status: "Normal",
      };
      expect(row.testName).toBe("Test");
    });

    it("should define MSHInfo interface", () => {
      const msh: MSHInfo = {
        sendingApp: "App1",
        sendingFacility: "Facility1",
        receivingApp: "App2",
        receivingFacility: "Facility2",
        messageType: "ORU^R01",
        hl7Version: "2.5",
      };
      expect(msh.messageType).toBe("ORU^R01");
    });

    it("should define OBRInfo interface", () => {
      const obr: OBRInfo = {
        accessionNumber: "A123",
        testType: "BLOOD",
        testName: "Blood Test",
        observationDateTime: "2024-01-01",
      };
      expect(obr.accessionNumber).toBe("A123");
    });

    it("should define PIDInfo interface", () => {
      const pid: PIDInfo = {
        id: 1,
        patientCode: "P001",
        patientName: "John Doe",
        dateOfBirth: "1990-01-01",
        gender: "M",
      };
      expect(pid.patientCode).toBe("P001");
    });

    it("should define HL7Message interface", () => {
      const message: HL7Message = {
        patientId: "P001",
        patientName: "John Doe",
        dateOfBirth: "1990-01-01",
        tests: [],
      };
      expect(message.patientId).toBe("P001");
    });
  });
});
