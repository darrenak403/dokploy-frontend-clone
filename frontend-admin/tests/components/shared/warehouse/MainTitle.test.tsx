import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/warehouse/MainTitle";

describe("Warehouse MainTitle", () => {
  it("should render title and description", () => {
    render(<MainTitle />);

    expect(screen.getByText("Quản lí thiết bị")).toBeInTheDocument();
    expect(
      screen.getByText("Quản lý hồ sơ và thông tin thiết bị của bệnh viện")
    ).toBeInTheDocument();
  });

  it("should render with correct CSS classes", () => {
    const { container } = render(<MainTitle />);

    const mainDiv = container.querySelector(".w-full.border-b.border-gray-200");
    expect(mainDiv).toBeInTheDocument();
  });

  it("should have h1 heading", () => {
    render(<MainTitle />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
