import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AttractionsSection } from "../components/AttractionsSection";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AttractionsSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all attraction cards with 'Learn More' buttons", () => {
    render(
      <MemoryRouter>
        <AttractionsSection />
      </MemoryRouter>
    );

    const learnMoreButtons = screen.getAllByText(/Learn More/i);
    expect(learnMoreButtons).toHaveLength(4); // Based on the attractions array in the component
  });

  it("navigates to /attractions when any 'Learn More' button is clicked", () => {
    render(
      <MemoryRouter>
        <AttractionsSection />
      </MemoryRouter>
    );

    const learnMoreButtons = screen.getAllByRole("link", { name: /Learn more about/i });
    
    // Test the first button
    fireEvent.click(learnMoreButtons[0]);
    expect(mockNavigate).toHaveBeenCalledWith("/attractions");

    // Test the second button
    fireEvent.click(learnMoreButtons[1]);
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockNavigate).toHaveBeenLastCalledWith("/attractions");
  });

  it("has correct accessibility attributes", () => {
    render(
      <MemoryRouter>
        <AttractionsSection />
      </MemoryRouter>
    );

    const learnMoreButtons = screen.getAllByRole("link", { name: /Learn more about/i });
    
    learnMoreButtons.forEach(button => {
      expect(button).toHaveAttribute("role", "link");
      expect(button).toHaveAttribute("tabindex", "0");
      expect(button.getAttribute("aria-label")).toMatch(/Learn more about/i);
    });
  });

  it("has visual feedback classes", () => {
    render(
      <MemoryRouter>
        <AttractionsSection />
      </MemoryRouter>
    );

    const learnMoreButtons = screen.getAllByRole("link", { name: /Learn more about/i });
    
    learnMoreButtons.forEach(button => {
      expect(button).toHaveClass("transition-all");
      expect(button).toHaveClass("active:scale-95");
    });
  });
});
