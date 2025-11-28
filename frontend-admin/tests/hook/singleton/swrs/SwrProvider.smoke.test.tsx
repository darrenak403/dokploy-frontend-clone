import React, { useContext } from "react";

import { render, screen } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";

import { store } from "@/redux/store";

import { SwrContext, SwrProvider } from "@/hook/singleton/swrs/SwrProvider";

jest.mock("swr", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: undefined,
    error: undefined,
    isLoading: false,
    mutate: jest.fn(),
    isValidating: false,
  })),
}));

jest.mock("swr/mutation", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: undefined,
    error: undefined,
    isMutating: false,
    trigger: jest.fn(),
    reset: jest.fn(),
  })),
}));

const Consumer = () => {
  const ctx = useContext(SwrContext);

  // Render a small status indicating presence
  return (
    <div data-testid="swr-status">{ctx ? Object.keys(ctx).length : 0}</div>
  );
};

describe("SwrProvider smoke", () => {
  it("renders and provides context", () => {
    render(
      <ReduxProvider store={store}>
        <SwrProvider>
          <Consumer />
        </SwrProvider>
      </ReduxProvider>
    );

    const el = screen.getByTestId("swr-status");
    expect(el).toBeInTheDocument();
    // should expose at least a few keys
    expect(Number(el.textContent)).toBeGreaterThan(0);
  });
});
