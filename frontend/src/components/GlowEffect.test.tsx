import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { GlowEffect } from './GlowEffect';

// Mock matchMedia for accessibility tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('GlowEffect Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children correctly', () => {
    render(
      <GlowEffect>
        <div data-testid="child">Content</div>
      </GlowEffect>
    );
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('activates glow on mouse enter', () => {
    const { container } = render(
      <GlowEffect>
        <div>Content</div>
      </GlowEffect>
    );
    const wrapper = container.firstChild as HTMLElement;
    
    fireEvent.mouseEnter(wrapper);
    // Glow opacity should change via CSS variable
    expect(wrapper.style.getPropertyValue('--glow-opacity')).toBe('0.8');
  });

  it('deactivates glow on mouse leave', () => {
    const { container } = render(
      <GlowEffect>
        <div>Content</div>
      </GlowEffect>
    );
    const wrapper = container.firstChild as HTMLElement;
    
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    expect(wrapper.style.getPropertyValue('--glow-opacity')).toBe('0');
  });

  it('respects prefers-reduced-motion', () => {
    // Mock reduced motion
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as any);

    const { container } = render(
      <GlowEffect>
        <div>Content</div>
      </GlowEffect>
    );
    const wrapper = container.firstChild as HTMLElement;
    
    fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 100 });
    // Mouse position should not update if motion is reduced
    expect(wrapper.style.getPropertyValue('--glow-x')).toBe('-1000px');
  });

  it('maintains performance by using requestAnimationFrame', () => {
    const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
    const { container } = render(
      <GlowEffect>
        <div>Content</div>
      </GlowEffect>
    );
    const wrapper = container.firstChild as HTMLElement;
    
    fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 100 });
    expect(rafSpy).toHaveBeenCalled();
  });
});
