/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

import { Footer } from "@/components/shared/layout/Footer";

// Mock @heroui/react
jest.mock("@heroui/react", () => ({
  Input: () => <input />,
  Button: ({ children }: any) => <button>{children}</button>,
  Link: ({ children }: any) => <a>{children}</a>,
}));

// Mock @iconify/react
jest.mock("@iconify/react", () => ({
  Icon: () => <span />,
}));

describe("Footer", () => {
  it("should render footer element", () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should have proper structure", () => {
    const { container } = render(<Footer />);

    expect(container.querySelector("footer")).toBeTruthy();
  });
});
