import { render, screen } from "@testing-library/react";

import { Sidebar } from "@/components/shared/profile/Sidebar";

jest.mock("next/navigation", () => ({
  usePathname: () => "/profile",
}));

jest.mock(
  "@/hook/singleton/discloresures/profile/useUpdateAvatarDisclosure",
  () => ({
    useUpdateAvatarDisclosureSingleton: () => ({
      onOpen: jest.fn(),
    }),
  })
);

jest.mock("react-redux", () => ({
  useSelector: jest.fn(() => ({
    data: { user: { fullName: "Test User", email: "test@example.com" } },
  })),
}));

describe("Profile Sidebar", () => {
  it("should render without crashing", () => {
    render(<Sidebar />);
    expect(screen.getByText(/Hồ sơ của tôi/i)).toBeInTheDocument();
  });
});
