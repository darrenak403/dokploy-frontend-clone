import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/account/MainTitle";

jest.mock(
  "@/hook/singleton/discloresures/account/useCreateUserDisclosure",
  () => ({
    useCreateUserDiscloresureSingleton: () => ({
      onOpen: jest.fn(),
    }),
  })
);

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => ({
    data: { user: { role: "ROLE_ADMIN" } },
  })),
}));

describe("Account MainTitle", () => {
  it("should render account management title", () => {
    render(<MainTitle />);
    expect(screen.getByText("Quản lí tài khoản")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(<MainTitle />);
    expect(
      screen.getByText(/Quản lý hồ sơ và thông tin tài khoản/i)
    ).toBeInTheDocument();
  });
});
