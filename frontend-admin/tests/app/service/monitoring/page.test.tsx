import React from "react";

import MonitoringPage from "@/app/(service)/service/monitoring/page";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/shared/monitoring/MainTitle", () => {
  return function MockMainTitle() {
    return <div data-testid="main-title">MainTitle Component</div>;
  };
});

jest.mock("@/components/shared/monitoring/MonitoringStat", () => {
  return function MockMonitoringStat() {
    return <div data-testid="monitoring-stat">MonitoringStat Component</div>;
  };
});

jest.mock("@/components/shared/monitoring/MonitoringList", () => {
  return function MockMonitoringList() {
    return <div data-testid="monitoring-list">MonitoringList Component</div>;
  };
});

describe("MonitoringPage", () => {
  beforeEach(() => {
    render(<MonitoringPage />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render all monitoring components", () => {
    expect(screen.getByTestId("main-title")).toBeInTheDocument();
    expect(screen.getByTestId("monitoring-stat")).toBeInTheDocument();
    expect(screen.getByTestId("monitoring-list")).toBeInTheDocument();
  });

  it("should render MainTitle component", () => {
    expect(screen.getByTestId("main-title")).toHaveTextContent(
      "MainTitle Component"
    );
  });

  it("should render MonitoringStat component", () => {
    expect(screen.getByTestId("monitoring-stat")).toHaveTextContent(
      "MonitoringStat Component"
    );
  });

  it("should render MonitoringList component", () => {
    expect(screen.getByTestId("monitoring-list")).toHaveTextContent(
      "MonitoringList Component"
    );
  });

  it("should have proper layout structure", () => {
    const { container } = render(<MonitoringPage />);
    const mainDiv = container.querySelector(
      ".max-w-screen.mx-auto.h-full.min-h-0"
    );
    expect(mainDiv).toBeInTheDocument();
  });

  it("should have flex layout for vertical arrangement", () => {
    const { container } = render(<MonitoringPage />);
    const mainDiv = container.querySelector(".flex.flex-col");
    expect(mainDiv).toBeInTheDocument();
  });
});
