import { render } from "@testing-library/react";

import { ThemeToggle } from "@/components/modules/SwithTheme/theme-toggle";

jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

describe("ThemeToggle", () => {
  it("should render without crashing", () => {
    const { container } = render(<ThemeToggle />);
    expect(container).toBeTruthy();
  });
});
