import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/regents/MainTitle";

describe("Reagents MainTitle", () => {
  it("should render title and description", () => {
    render(<MainTitle />);

    expect(screen.getByText("Quản lí thuốc thử")).toBeInTheDocument();
    expect(
      screen.getByText("Quản lý hồ sơ và thông tin thuốc thử của bệnh viện")
    ).toBeInTheDocument();
  });

  it("should render with correct structure", () => {
    const { container } = render(<MainTitle />);

    const mainDiv = container.querySelector(".w-full.border-b");
    expect(mainDiv).toBeInTheDocument();
  });

  it("should have proper heading hierarchy", () => {
    render(<MainTitle />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Quản lí thuốc thử");
  });
});
