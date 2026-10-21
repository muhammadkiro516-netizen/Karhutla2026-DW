import { describe, it, expect } from "vitest";
import { smokeHint } from "@/lib/attribution";

describe("smokeHint", () => {
  it("returns show:false when no threat and cluster far away", () => {
    const result = smokeHint({
      cityThreat: undefined,
      nearestClusterKm: 300,
      pm25Last6h: [10, 11, 10, 9, 10, 11],
    });
    expect(result.show).toBe(false);
  });

  it("returns show:true with ETA message when threat ETA <= 6h", () => {
    const result = smokeHint({
      cityThreat: { clusters: 3, earliestEtaHours: 4 },
      nearestClusterKm: 80,
      pm25Last6h: [40, 45, 50, 55, 60, 65],
    });
    expect(result.show).toBe(true);
    expect(result.message).toContain("4 jam");
  });

  it("returns show:true for rising PM2.5 near cluster", () => {
    const result = smokeHint({
      cityThreat: undefined,
      nearestClusterKm: 70,
      pm25Last6h: [20, 25, 30, 40, 50, 60],
    });
    expect(result.show).toBe(true);
    expect(result.message).toContain("70 km");
  });
});
