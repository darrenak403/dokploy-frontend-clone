import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/test-order/MainTitle";

jest.mock("@/hook/singleton/discloresures", () => ({
  useCreateTestOrderDiscloresureSingleton: () => ({
    onOpen: jest.fn(),
  }),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => ({
    data: { user: { role: "ROLE_ADMIN" } },
  })),
}));

describe("Test Order MainTitle", () => {
  it("should render test order management title", () => {
    render(<MainTitle />);
    expect(screen.getByText("Quản lí đơn xét nghiệm")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(<MainTitle />);
    expect(
      screen.getByText(/Quản lý đơn xét nghiệm và thông tin liên quan/i)
    ).toBeInTheDocument();
  });
});
