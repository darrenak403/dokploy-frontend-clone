import { render } from "@testing-library/react";

import MainTitle from "@/components/shared/regents/MainTitle";

describe("Reagents MainTitle", () => {
  it("should render title and description", () => {
    const { container } = render(<MainTitle />);

    // Use container query to avoid memory issues
    expect(container.textContent).toContain("Quản lí thuốc thử");
    expect(container.textContent).toContain(
      "Quản lý hồ sơ và thông tin thuốc thử của bệnh viện"
    );
  });

  it("should render with correct structure", () => {
    const { container } = render(<MainTitle />);

    const mainDiv = container.querySelector(".w-full.border-b");
    expect(mainDiv).toBeInTheDocument();
  });

  it("should have proper heading hierarchy", () => {
    const { container } = render(<MainTitle />);

    const heading = container.querySelector("h1");
    expect(heading).toHaveTextContent("Quản lí thuốc thử");
  });
});
