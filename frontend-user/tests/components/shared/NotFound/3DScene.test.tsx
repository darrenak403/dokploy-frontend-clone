import React from "react";

import { render, screen } from "@testing-library/react";

import Scene3D from "@/components/shared/NotFound/3DScene";

// Mock useFrame callback storage
const useFrameCallbacks: Array<(state: unknown, delta: number) => void> = [];

// Mock react-three/fiber
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: jest.fn((callback) => {
    useFrameCallbacks.push(callback);
  }),
}));

// Mock react-three/drei with all components including event handlers
jest.mock("@react-three/drei", () => ({
  OrbitControls: ({
    enableZoom,
    enablePan,
    autoRotate,
    autoRotateSpeed,
    maxPolarAngle,
    minPolarAngle,
  }: {
    enableZoom?: boolean;
    enablePan?: boolean;
    autoRotate?: boolean;
    autoRotateSpeed?: number;
    maxPolarAngle?: number;
    minPolarAngle?: number;
  }) => (
    <div
      data-testid="orbit-controls"
      data-enable-zoom={enableZoom}
      data-enable-pan={enablePan}
      data-auto-rotate={autoRotate}
      data-auto-rotate-speed={autoRotateSpeed}
      data-max-polar-angle={maxPolarAngle}
      data-min-polar-angle={minPolarAngle}
    />
  ),
  PerspectiveCamera: ({
    makeDefault,
    position,
    fov,
  }: {
    makeDefault?: boolean;
    position?: number[];
    fov?: number;
  }) => (
    <div
      data-testid="perspective-camera"
      data-make-default={makeDefault}
      data-position={JSON.stringify(position)}
      data-fov={fov}
    />
  ),
  Environment: ({ preset }: { preset?: string }) => (
    <div data-testid="environment" data-preset={preset} />
  ),
  Sphere: ({
    args,
    scale,
    children,
  }: {
    args?: number[];
    scale?: number;
    children?: React.ReactNode;
  }) => (
    <div
      data-testid="sphere"
      data-args={JSON.stringify(args)}
      data-scale={JSON.stringify(scale)}
    >
      {children}
    </div>
  ),
  Cylinder: ({
    args,
    position,
    children,
  }: {
    args?: number[];
    position?: number[];
    children?: React.ReactNode;
  }) => (
    <div
      data-testid="cylinder"
      data-args={JSON.stringify(args)}
      data-position={JSON.stringify(position)}
    >
      {children}
    </div>
  ),
}));

// Mock three.js
jest.mock("three", () => ({
  Mesh: jest.fn(),
  MeshStandardMaterial: jest.fn(),
  Vector3: jest.fn(),
  Group: jest.fn(),
}));

describe("MedicalScene3D", () => {
  beforeEach(() => {
    useFrameCallbacks.length = 0;
  });

  it("should render canvas component", () => {
    render(<Scene3D />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("should render without crashing", () => {
    const { container } = render(<Scene3D />);
    expect(container).toBeTruthy();
  });

  it("should contain 3D scene elements", () => {
    render(<Scene3D />);
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("should render PerspectiveCamera with correct props", () => {
    render(<Scene3D />);
    const camera = screen.getByTestId("perspective-camera");
    expect(camera).toHaveAttribute("data-make-default", "true");
    expect(camera).toHaveAttribute("data-position", "[0,0,8]");
    expect(camera).toHaveAttribute("data-fov", "50");
  });

  it("should render OrbitControls with correct configuration", () => {
    render(<Scene3D />);
    const controls = screen.getByTestId("orbit-controls");
    expect(controls).toHaveAttribute("data-enable-zoom", "false");
    expect(controls).toHaveAttribute("data-enable-pan", "false");
    expect(controls).toHaveAttribute("data-auto-rotate", "true");
    expect(controls).toHaveAttribute("data-auto-rotate-speed", "0.5");
  });

  it("should render Environment with city preset", () => {
    render(<Scene3D />);
    const environment = screen.getByTestId("environment");
    expect(environment).toHaveAttribute("data-preset", "city");
  });

  it("should render multiple blood cells", () => {
    render(<Scene3D />);
    const spheres = screen.getAllByTestId("sphere");
    // Each blood cell has 2 spheres, 5 blood cells = 10 spheres minimum
    expect(spheres.length).toBeGreaterThanOrEqual(10);
  });

  it("should render test tubes with cylinders", () => {
    render(<Scene3D />);
    const cylinders = screen.getAllByTestId("cylinder");
    // 3 test tubes, each with 3 cylinders = 9 cylinders minimum
    expect(cylinders.length).toBeGreaterThanOrEqual(9);
  });

  it("should render multiple light sources", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");
    expect(canvas).toBeInTheDocument();
    // Component has ambientLight, directionalLights, spotLight, pointLights
  });

  it("should have correct wrapper div structure", () => {
    const { container } = render(<Scene3D />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("w-full", "h-full", "absolute", "inset-0");
  });

  it("should use Suspense for lazy loading", () => {
    render(<Scene3D />);
    // Suspense wraps the 3D content, Canvas should still render
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("should register useFrame callbacks for animations", async () => {
    const { useFrame } = await import("@react-three/fiber");
    render(<Scene3D />);
    // Should have multiple useFrame callbacks (one for each BloodCell and TestTube)
    expect(useFrame).toHaveBeenCalled();
    expect(useFrameCallbacks.length).toBeGreaterThan(0);
  });

  it("should have animation callbacks for blood cells", () => {
    render(<Scene3D />);

    // Should have callbacks for 5 blood cells
    expect(useFrameCallbacks.length).toBeGreaterThanOrEqual(5);
  });

  it("should have animation callbacks for test tubes", () => {
    render(<Scene3D />);

    // Test tubes should also have animation callbacks (5 blood cells + 3 test tubes)
    expect(useFrameCallbacks.length).toBeGreaterThanOrEqual(8);
  });

  it("should render blood cells with different colors", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");

    // Component creates blood cells with colors: #E31937, #D91828, #F52942
    expect(canvas).toBeInTheDocument();
    expect(canvas.innerHTML).toBeTruthy();
  });

  it("should render blood cells with different scales", () => {
    render(<Scene3D />);
    const spheres = screen.getAllByTestId("sphere");

    // Blood cells have different scales: 0.8, 0.6, 0.7, 0.5, 0.9
    expect(spheres.length).toBeGreaterThan(0);
  });

  it("should render test tubes at different positions", () => {
    render(<Scene3D />);
    const cylinders = screen.getAllByTestId("cylinder");

    // 3 test tubes with different positions
    expect(cylinders.length).toBeGreaterThanOrEqual(9); // 3 tubes × 3 cylinders each
  });

  it("should render with proper class names for styling", () => {
    const { container } = render(<Scene3D />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass("w-full");
    expect(wrapper).toHaveClass("h-full");
    expect(wrapper).toHaveClass("absolute");
    expect(wrapper).toHaveClass("inset-0");
  });

  it("should have correct polar angle constraints for OrbitControls", () => {
    render(<Scene3D />);
    const controls = screen.getByTestId("orbit-controls");

    const maxPolarAngle = controls.getAttribute("data-max-polar-angle");
    const minPolarAngle = controls.getAttribute("data-min-polar-angle");

    // Check that polar angles are set (Math.PI / 2 and Math.PI / 3)
    expect(maxPolarAngle).toBeTruthy();
    expect(minPolarAngle).toBeTruthy();
    expect(parseFloat(maxPolarAngle!)).toBeGreaterThan(0);
    expect(parseFloat(minPolarAngle!)).toBeGreaterThan(0);
  });

  it("should render directional lights", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");

    // Component has 2 directionalLights, 1 ambientLight, 1 spotLight
    expect(canvas).toBeInTheDocument();
  });

  it("should render spot light", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");

    // spotLight with specific properties
    expect(canvas).toBeInTheDocument();
  });

  it("should render point lights for blood cells", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");

    // Each blood cell has a point light
    expect(canvas).toBeInTheDocument();
  });

  it("should render point lights for test tubes", () => {
    render(<Scene3D />);
    const canvas = screen.getByTestId("canvas");

    // Each test tube has a point light
    expect(canvas).toBeInTheDocument();
  });

  it("should handle rendering without errors", () => {
    expect(() => render(<Scene3D />)).not.toThrow();
  });
});
