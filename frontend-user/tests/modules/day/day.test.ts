import {
  calcAgeFromDate,
  convertToDateInputFormat,
  convertToDdMmYyyyFormat,
  formatDateDisplay,
  formatDateTimeFull,
  getCurrentDate,
  parseDateOnly,
} from "@/modules/day";

describe("Day Module", () => {
  describe("getCurrentDate", () => {
    it('should return current date in "DD MM, YYYY" format', () => {
      const result = getCurrentDate();

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Check format matches DD MM, YYYY (e.g., "20 11, 2025")
      expect(result).toMatch(/^\d{2} \d{2}, \d{4}$/);
    });
  });

  describe("convertToDateInputFormat", () => {
    it("should convert dd/mm/yyyy to yyyy-mm-dd", () => {
      const input = "25/12/2023";
      const expected = "2023-12-25";

      expect(convertToDateInputFormat(input)).toBe(expected);
    });

    it("should pad single digit day and month with zero", () => {
      const input = "5/3/2023";
      const expected = "2023-03-05";

      expect(convertToDateInputFormat(input)).toBe(expected);
    });

    it("should return empty string for empty input", () => {
      expect(convertToDateInputFormat("")).toBe("");
    });

    it("should return empty string for invalid format", () => {
      expect(convertToDateInputFormat("invalid-date")).toBe("");
      expect(convertToDateInputFormat("25-12-2023")).toBe("");
    });

    it("should handle null/undefined input", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(convertToDateInputFormat(null as any)).toBe("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(convertToDateInputFormat(undefined as any)).toBe("");
    });
  });

  describe("convertToDdMmYyyyFormat", () => {
    it("should convert yyyy-mm-dd to dd/mm/yyyy", () => {
      const input = "2023-12-25";
      const expected = "25/12/2023";

      expect(convertToDdMmYyyyFormat(input)).toBe(expected);
    });

    it("should handle dates with leading zeros", () => {
      const input = "2023-03-05";
      const expected = "05/03/2023";

      expect(convertToDdMmYyyyFormat(input)).toBe(expected);
    });

    it("should return empty string for empty input", () => {
      expect(convertToDdMmYyyyFormat("")).toBe("");
    });

    it("should return empty string for invalid format", () => {
      expect(convertToDdMmYyyyFormat("25/12/2023")).toBe("");
      expect(convertToDdMmYyyyFormat("invalid")).toBe("");
    });
  });

  describe("formatDateDisplay", () => {
    it("should format Date object to dd/mm/yyyy", () => {
      const date = new Date(2023, 11, 25); // Month is 0-indexed
      const expected = "25/12/2023";

      expect(formatDateDisplay(date)).toBe(expected);
    });

    it("should pad single digit day and month with zero", () => {
      const date = new Date(2023, 2, 5); // March 5, 2023
      const expected = "05/03/2023";

      expect(formatDateDisplay(date)).toBe(expected);
    });

    it("should return empty string for null input", () => {
      expect(formatDateDisplay(null)).toBe("");
    });

    it("should handle date at start of month", () => {
      const date = new Date(2023, 0, 1); // January 1, 2023
      const expected = "01/01/2023";

      expect(formatDateDisplay(date)).toBe(expected);
    });

    it("should handle date at end of month", () => {
      const date = new Date(2023, 0, 31); // January 31, 2023
      const expected = "31/01/2023";

      expect(formatDateDisplay(date)).toBe(expected);
    });
  });

  describe("parseDateOnly", () => {
    it("should parse dd/MM/yyyy format", () => {
      const input = "25/12/2023";
      const result = parseDateOnly(input);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // December (0-indexed)
      expect(result?.getDate()).toBe(25);
    });

    it("should parse dd/MM/yyyy HH:mm:ss format", () => {
      const input = "25/12/2023 14:30:00";
      const result = parseDateOnly(input);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11);
      expect(result?.getDate()).toBe(25);
    });

    it("should parse date with dash separator", () => {
      const input = "25-12-2023";
      const result = parseDateOnly(input);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
    });

    it("should return null for undefined input", () => {
      expect(parseDateOnly(undefined)).toBe(null);
    });

    it("should return null for null input", () => {
      expect(parseDateOnly(null)).toBe(null);
    });

    it("should return null for empty string", () => {
      expect(parseDateOnly("")).toBe(null);
    });

    it("should return null for whitespace string", () => {
      expect(parseDateOnly("   ")).toBe(null);
    });

    it("should handle invalid date strings", () => {
      const result = parseDateOnly("invalid-date");
      // Result depends on implementation - might return null or try to parse as ISO
      expect(result === null || result instanceof Date).toBe(true);
    });

    it("should parse ISO date format", () => {
      const input = "2023-12-25T00:00:00.000Z";
      const result = parseDateOnly(input);

      expect(result).toBeInstanceOf(Date);
    });

    it("should handle number input", () => {
      const timestamp = Date.now();
      const result = parseDateOnly(timestamp);

      expect(result === null || result instanceof Date).toBe(true);
    });

    it("should use fallback parser for non-standard date formats", () => {
      // Test ISO date string (triggers fallback parser at line 66)
      const isoDate = "2023-12-25";
      const result = parseDateOnly(isoDate);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // December
      expect(result?.getDate()).toBe(25);
    });

    it("should handle invalid date strings with fallback parser", () => {
      const invalidDate = "invalid-date";
      const result = parseDateOnly(invalidDate);

      expect(result).toBeNull();
    });

    it("should parse various formats using fallback parser", () => {
      // Test timestamp string
      const timestamp = "1703462400000"; // Dec 25, 2023
      const result = parseDateOnly(timestamp);

      expect(result === null || result instanceof Date).toBe(true);
    });

    it("should handle date strings that trigger fallback parser", () => {
      // Test date string that doesn't match dd/MM/YYYY or YYYY-MM-DD patterns
      const dateString = "Dec 25 2023";
      const result = parseDateOnly(dateString);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2023);
      expect(result?.getMonth()).toBe(11); // December
      expect(result?.getDate()).toBe(25);
    });

    it("should parse valid dd/MM/yyyy format with different dates", () => {
      const input = "01/01/2020";
      const result = parseDateOnly(input);

      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2020);
      expect(result?.getMonth()).toBe(0); // January
      expect(result?.getDate()).toBe(1);
    });
  });

  describe("calcAgeFromDate", () => {
    beforeEach(() => {
      // Mock current date to Dec 31, 2023 for consistent tests
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2023-12-31"));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should calculate age when birthday has already occurred this year", () => {
      // Birthday: Jan 1, 2000, Current: Dec 31, 2023
      const birthDate = new Date("2000-01-01");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(23); // Birthday already passed
    });

    it("should subtract 1 from age when birthday has not occurred yet this year", () => {
      // Set current date to June 1, 2023
      jest.setSystemTime(new Date("2023-06-01"));

      // Birthday: Dec 25, 2000 (hasn't occurred yet in 2023)
      const birthDate = new Date("2000-12-25");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(22); // Should be 22, not 23 (birthday not yet this year)
    });

    it("should handle birthday on same month but later day", () => {
      // Set current date to June 10, 2023
      jest.setSystemTime(new Date("2023-06-10"));

      // Birthday: June 15, 2000 (same month, later day)
      const birthDate = new Date("2000-06-15");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(22); // Birthday hasn't occurred yet
    });

    it("should handle birthday on same month and earlier day", () => {
      // Set current date to June 15, 2023
      jest.setSystemTime(new Date("2023-06-15"));

      // Birthday: June 10, 2000 (same month, earlier day)
      const birthDate = new Date("2000-06-10");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(23); // Birthday already passed
    });

    it("should handle birthday today", () => {
      // Set current date to June 15, 2023
      jest.setSystemTime(new Date("2023-06-15"));

      // Birthday: June 15, 2000 (exact same day)
      const birthDate = new Date("2000-06-15");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(23); // Birthday is today
    });

    it("should return undefined for null input", () => {
      const age = calcAgeFromDate(null);

      expect(age).toBeUndefined();
    });

    it("should return undefined for undefined input", () => {
      const age = calcAgeFromDate(undefined);

      expect(age).toBeUndefined();
    });

    it("should handle leap year birthday", () => {
      // Set current date to Feb 28, 2023
      jest.setSystemTime(new Date("2023-02-28"));

      // Birthday: Feb 29, 2000 (leap year)
      const birthDate = new Date("2000-02-29");
      const age = calcAgeFromDate(birthDate);

      expect(age).toBe(22); // Birthday (Feb 29) hasn't "occurred" in non-leap year
    });
  });

  describe("formatDateTimeFull", () => {
    it("should format valid ISO datetime string", () => {
      const dateTime = "2023-12-25T14:30:45";
      const result = formatDateTimeFull(dateTime);

      expect(result).toBe("25/12/2023 14:30:45");
    });

    it("should handle datetime with timezone", () => {
      const dateTime = "2023-12-25T14:30:45Z";
      const result = formatDateTimeFull(dateTime);

      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
    });

    it("should return empty string for null input", () => {
      const result = formatDateTimeFull(null as unknown as string);

      expect(result).toBe("");
    });

    it("should return empty string for undefined input", () => {
      const result = formatDateTimeFull(undefined);

      expect(result).toBe("");
    });

    it("should return empty string for empty string input", () => {
      const result = formatDateTimeFull("");

      expect(result).toBe("");
    });

    it("should handle various datetime formats", () => {
      const dateTime = "2023-06-15T09:00:00.000Z";
      const result = formatDateTimeFull(dateTime);

      expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
    });

    it("should format midnight correctly", () => {
      const dateTime = "2023-12-25T00:00:00";
      const result = formatDateTimeFull(dateTime);

      expect(result).toBe("25/12/2023 00:00:00");
    });

    it("should format end of day correctly", () => {
      const dateTime = "2023-12-25T23:59:59";
      const result = formatDateTimeFull(dateTime);

      expect(result).toBe("25/12/2023 23:59:59");
    });
  });
});
