import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Attractions from "@/pages/Attractions";
import { MemoryRouter } from "react-router-dom";

// Mock useAuth hook
vi.mock("@/hooks/use-auth", () => ({
  useAuth: () => ({
    user: null as any,
    isAuthenticated: false,
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock scroll restoration or other window properties if needed
window.scrollTo = vi.fn();

describe("Attractions Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open
    window.open = vi.fn().mockReturnValue({ closed: false });
    // Mock console.error to avoid cluttering test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it("renders all attractions with their descriptions", () => {
    render(
      <MemoryRouter>
        <Attractions />
      </MemoryRouter>
    );

    // Check for specific attraction names
    expect(screen.getByText("Gwarighat")).toBeInTheDocument();
    expect(screen.getByText("Rani Durgavati Fort")).toBeInTheDocument();
    expect(screen.getByText("Chausath Yogini Temple")).toBeInTheDocument();
    expect(screen.getByText("Balancing Rock")).toBeInTheDocument();

    // Check for specific descriptions to ensure they are not removed
    expect(screen.getByText(/Sacred bathing ghat on the banks of Narmada river/i)).toBeInTheDocument();
    expect(screen.getByText(/Historic fort dedicated to the brave Gond queen/i)).toBeInTheDocument();
    expect(screen.getByText(/Ancient 10th century circular temple/i)).toBeInTheDocument();
    expect(screen.getByText(/A geological marvel where a massive rock balances perfectly/i)).toBeInTheDocument();
  });

  it("constructs the correct Google Maps URL for Gwarighat", () => {
    render(
      <MemoryRouter>
        <Attractions />
      </MemoryRouter>
    );

    const directionsButtons = screen.getAllByRole("button", { name: /Get directions to Gwarighat/i });
    fireEvent.click(directionsButtons[0]);

    const expectedQuery = encodeURIComponent("Gwarighat Jabalpur Madhya Pradesh");
    const expectedUrl = `https://www.google.com/maps/dir/?api=1&destination=${expectedQuery}`;

    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
  });

  it("constructs the correct Google Maps URL for Rani Durgavati Fort", () => {
    render(
      <MemoryRouter>
        <Attractions />
      </MemoryRouter>
    );

    const directionsButtons = screen.getAllByRole("button", { name: /Get directions to Rani Durgavati Fort/i });
    fireEvent.click(directionsButtons[0]);

    const expectedQuery = encodeURIComponent("Rani Durgavati Fort Jabalpur Madhya Pradesh");
    const expectedUrl = `https://www.google.com/maps/dir/?api=1&destination=${expectedQuery}`;

    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
  });

  it("handles cases where window.open fails or is blocked", () => {
    window.open = vi.fn().mockReturnValue(null); // Simulate pop-up blocked
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <Attractions />
      </MemoryRouter>
    );

    const firstDirectionsButton = screen.getAllByRole("button", { name: /Get directions/i })[0];
    fireEvent.click(firstDirectionsButton);

    expect(alertMock).toHaveBeenCalledWith('Unable to open Google Maps. Please check your browser settings or try again later.');
    alertMock.mockRestore();
  });

  it("ensures buttons are visually consistent and responsive", () => {
    render(
      <MemoryRouter>
        <Attractions />
      </MemoryRouter>
    );

    // Check for common classes used for consistency and responsiveness
    const buttons = screen.getAllByRole("button", { name: /Get directions/i });
    buttons.forEach((button: HTMLElement) => {
      expect(button).toHaveClass('w-full'); // Responsive: full width on its container
      expect(button).toHaveClass('inline-flex');
      expect(button).toHaveClass('items-center');
      expect(button).toHaveClass('justify-center');
    });
  });
});
