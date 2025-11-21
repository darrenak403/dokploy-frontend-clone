import { render, screen } from "@testing-library/react";

import MainTitle from "@/components/shared/patient/MainTitle";

jest.mock("@/hook/singleton/discloresures", () => ({
  useCreatePatientDiscloresureSingleton: () => ({
    onOpen: jest.fn(),
  }),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => ({
    data: { user: { role: "ROLE_ADMIN" } },
  })),
}));

describe("Patient MainTitle", () => {
  it("should render patient management title", () => {
    render(<MainTitle />);
    expect(screen.getByText("Quản lí bệnh nhân")).toBeInTheDocument();
  });

  it("should render description", () => {
    render(<MainTitle />);
    expect(
      screen.getByText(/Quản lý hồ sơ và thông tin y tế/i)
    ).toBeInTheDocument();
  });
});
