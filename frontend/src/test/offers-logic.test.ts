import { describe, it, expect } from "vitest";

// Simplified price calculation logic for testing
function calculateTotalPrice(basePrice: number, selectedOffers: { discountPercentage: number }[]) {
  const totalDiscountAmount = selectedOffers.reduce((acc, offer) => {
    return acc + (basePrice * offer.discountPercentage) / 100;
  }, 0);
  return basePrice - totalDiscountAmount;
}

describe("Offer Application Logic", () => {
  const basePrice = 1000;

  it("calculates total price correctly with one offer", () => {
    const offers = [{ discountPercentage: 10 }];
    const total = calculateTotalPrice(basePrice, offers);
    expect(total).toBe(900);
  });

  it("calculates total price correctly with multiple offers", () => {
    const offers = [
      { discountPercentage: 10 },
      { discountPercentage: 15 }
    ];
    const total = calculateTotalPrice(basePrice, offers);
    // 1000 - (100 + 150) = 750
    expect(total).toBe(750);
  });

  it("handles empty offers correctly", () => {
    const offers: any[] = [];
    const total = calculateTotalPrice(basePrice, offers);
    expect(total).toBe(1000);
  });

  it("handles 100% discount correctly", () => {
    const offers = [{ discountPercentage: 100 }];
    const total = calculateTotalPrice(basePrice, offers);
    expect(total).toBe(0);
  });
});
