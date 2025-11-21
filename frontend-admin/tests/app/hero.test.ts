import hero from "@/app/hero";

// Mock @heroui/react
jest.mock("@heroui/react", () => ({
  heroui: jest.fn(() => ({ config: { theme: {} }, handler: jest.fn() })),
}));

describe("hero", () => {
  it("should export hero object", () => {
    expect(hero).toBeDefined();
  });

  it("should have config property", () => {
    expect(hero).toHaveProperty("config");
  });

  it("should have handler property", () => {
    expect(hero).toHaveProperty("handler");
  });
});
