import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Reveal } from "../components/Reveal";
import { MagneticButton } from "../components/MagneticButton";

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("Visual Effects Suite", () => {
  describe("Reveal Component", () => {
    it("renders children and applies initial opacity 0", () => {
      const { getByText, container } = render(
        <Reveal direction="up">
          <div>Reveal Me</div>
        </Reveal>
      );
      expect(getByText("Reveal Me")).toBeInTheDocument();
      const element = container.firstChild as HTMLElement;
      expect(element.style.opacity).toBe("0");
    });

    it("respects prefers-reduced-motion", () => {
      vi.mocked(window.matchMedia).mockReturnValueOnce({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
      } as any);

      const { container } = render(
        <Reveal direction="up">
          <div>Test</div>
        </Reveal>
      );
      const element = container.firstChild as HTMLElement;
      expect(element.style.transition).toBe("none");
      expect(element.style.opacity).toBe("1");
    });
  });

  describe("MagneticButton Component", () => {
    it("renders and applies translate3d(0, 0, 0) initially", () => {
      const { getByText, container } = render(
        <MagneticButton>
          <button>Click Me</button>
        </MagneticButton>
      );
      expect(getByText("Click Me")).toBeInTheDocument();
      const element = container.firstChild as HTMLElement;
      expect(element.style.transform).toBe("translate3d(0px, 0px, 0)");
    });
  });
});
