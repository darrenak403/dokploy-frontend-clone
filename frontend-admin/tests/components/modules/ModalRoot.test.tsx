import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import ModalRoot from "@/components/modules/Modal/ModalRoot";

// Mock CreatePermissionModal to avoid accessing DiscloresuresContext during tests
jest.mock("@/components/modules/Modal/CreatePermisionModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="create-permission-modal">CreatePermissionModal</div>
  )),
}));

// Mock all modals in a single jest.mock call to reduce overhead
jest.mock("@/components/modules/Modal/CreateCommentModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="create-comment-modal">CreateCommentModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/PatientModal/CreatePatientModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="create-patient-modal">CreatePatientModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/PatientModal/UpdatePatientModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="update-patient-modal">UpdatePatientModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/PatientModal/ViewPatientModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="view-patient-modal">ViewPatientModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/ProfileModal/UpdateAvatarModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="update-avatar-modal">UpdateAvatarModal</div>
  )),
}));

jest.mock(
  "@/components/modules/Modal/TestOrderModal/CreateTestOrderModal",
  () => ({
    __esModule: true,
    default: jest.fn(() => (
      <div data-testid="create-test-order-modal">CreateTestOrderModal</div>
    )),
  })
);

jest.mock(
  "@/components/modules/Modal/TestOrderModal/UpdateTestOrderModal",
  () => ({
    __esModule: true,
    default: jest.fn(() => (
      <div data-testid="update-test-order-modal">UpdateTestOrderModal</div>
    )),
  })
);

jest.mock(
  "@/components/modules/Modal/TestOrderModal/ViewTestOrderModal",
  () => ({
    __esModule: true,
    default: jest.fn(() => (
      <div data-testid="view-test-order-modal">ViewTestOrderModal</div>
    )),
  })
);

jest.mock("@/components/modules/Modal/UserModal/CreateUserModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="create-user-modal">CreateUserModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/UserModal/UpdateUserModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="update-user-modal">UpdateUserModal</div>
  )),
}));

jest.mock("@/components/modules/Modal/UserModal/ViewUserModal", () => ({
  __esModule: true,
  default: jest.fn(() => (
    <div data-testid="view-user-modal">ViewUserModal</div>
  )),
}));

describe("ModalRoot", () => {
  // Clear mocks before each test to prevent memory leaks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all modal components", () => {
    render(<ModalRoot />);

    expect(screen.getByTestId("create-comment-modal")).toBeInTheDocument();
    expect(screen.getByTestId("create-patient-modal")).toBeInTheDocument();
    expect(screen.getByTestId("update-patient-modal")).toBeInTheDocument();
    expect(screen.getByTestId("view-patient-modal")).toBeInTheDocument();
    expect(screen.getByTestId("update-avatar-modal")).toBeInTheDocument();
    expect(screen.getByTestId("create-test-order-modal")).toBeInTheDocument();
    expect(screen.getByTestId("update-test-order-modal")).toBeInTheDocument();
    expect(screen.getByTestId("view-test-order-modal")).toBeInTheDocument();
    expect(screen.getByTestId("create-user-modal")).toBeInTheDocument();
    expect(screen.getByTestId("update-user-modal")).toBeInTheDocument();
    expect(screen.getByTestId("view-user-modal")).toBeInTheDocument();
  });

  it("should render fragment as root element", () => {
    const { container } = render(<ModalRoot />);

    // Fragment doesn't create a DOM element, so we check children count
    expect(container.children.length).toBe(12); // Exactly 12 modal components (including CreatePermissionModal)
  });
});
