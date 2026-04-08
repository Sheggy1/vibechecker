import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeVibe } from "../api/analyzeVibe.js";

/**
 * VibeCheck — Integration Test Suite
 *
 * Tests the analyzeVibe() API layer by mocking fetch.
 * Run with: npm run test
 */

const makeMockResponse = (payload) => ({
  ok: true,
  status: 200,
  json: async () => ({
    content: [{ type: "text", text: JSON.stringify(payload) }],
  }),
});

describe("analyzeVibe()", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Happy Paths ──────────────────────────────────────────────────────────

  it("returns POSITIVE with high confidence for enthusiastic praise", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeMockResponse({
          sentiment: "POSITIVE",
          confidence: 94,
          energy_level: "HIGH",
          vibe_summary: "Enthusiastic praise, high engagement likely",
        })
      )
    );

    const result = await analyzeVibe("This product is absolutely amazing!");

    expect(result.sentiment).toBe("POSITIVE");
    expect(result.confidence).toBeGreaterThanOrEqual(80);
    expect(result.energy_level).toBe("HIGH");
    expect(typeof result.vibe_summary).toBe("string");
  });

  it("returns NEGATIVE with high confidence for a complaint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeMockResponse({
          sentiment: "NEGATIVE",
          confidence: 97,
          energy_level: "HIGH",
          vibe_summary: "Strong dissatisfaction, urgent response needed",
        })
      )
    );

    const result = await analyzeVibe(
      "Worst experience ever, I want a refund immediately."
    );

    expect(result.sentiment).toBe("NEGATIVE");
    expect(result.confidence).toBeGreaterThanOrEqual(80);
  });

  it("returns NEUTRAL with LOW energy for a flat factual statement", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeMockResponse({
          sentiment: "NEUTRAL",
          confidence: 70,
          energy_level: "LOW",
          vibe_summary: "Flat statement, no strong signal",
        })
      )
    );

    const result = await analyzeVibe("The item arrived on Tuesday.");

    expect(result.sentiment).toBe("NEUTRAL");
    expect(result.energy_level).toBe("LOW");
  });

  it("returns MIXED for text with conflicting signals", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeMockResponse({
          sentiment: "MIXED",
          confidence: 78,
          energy_level: "MEDIUM",
          vibe_summary: "Mixed signals, acknowledge both sides",
        })
      )
    );

    const result = await analyzeVibe(
      "Love the product quality but the shipping was a disaster."
    );

    expect(result.sentiment).toBe("MIXED");
    expect(["LOW", "MEDIUM", "HIGH"]).toContain(result.energy_level);
  });

  it("confidence score is always between 0 and 100", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        makeMockResponse({
          sentiment: "POSITIVE",
          confidence: 85,
          energy_level: "MEDIUM",
          vibe_summary: "Generally happy customer",
        })
      )
    );

    const result = await analyzeVibe("Pretty good experience overall.");

    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });

  // ─── Error Paths ──────────────────────────────────────────────────────────

  it("throws on API 500 error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    await expect(analyzeVibe("any text")).rejects.toThrow("API error 500");
  });

  it("throws on API 429 rate limit error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: "Too Many Requests",
      })
    );

    await expect(analyzeVibe("any text")).rejects.toThrow("API error 429");
  });

  it("throws when API returns malformed JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          content: [{ type: "text", text: "not valid json {{{}}" }],
        }),
      })
    );

    await expect(analyzeVibe("any text")).rejects.toThrow(
      "Failed to parse sentiment response"
    );
  });

  it("throws when fetch itself fails (network error)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Failed to fetch"))
    );

    await expect(analyzeVibe("any text")).rejects.toThrow("Failed to fetch");
  });
});
