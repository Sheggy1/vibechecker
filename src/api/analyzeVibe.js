const ANTHROPIC_API = "http://localhost:3001/api/messages";

export async function analyzeVibe(text) {
  const response = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20251001",
      max_tokens: 1000,
      system: `You are a sentiment analysis engine for social media managers.
Analyze the vibe of user text and respond ONLY with a valid JSON object.
No markdown, no explanation, no preamble — just the raw JSON object.

The JSON must have exactly these four fields:
{
  "sentiment": "POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED",
  "confidence": <integer 0-100>,
  "energy_level": "HIGH" | "MEDIUM" | "LOW",
  "vibe_summary": "<one punchy sentence, max 12 words>"
}`,
      messages: [{ role: "user", content: `Analyze this text: "${text}"` }],
    }),
  });

  const data = await response.json();

  // If Anthropic returned an error object, surface it clearly
  if (data.type === "error" || data.error) {
    const msg = data.error?.message || JSON.stringify(data);
    throw new Error(`Anthropic: ${msg}`);
  }

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  if (!data.content) {
    throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
  }

  const raw = data.content.find((b) => b.type === "text")?.text || "{}";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse sentiment response from API");
  }
}
