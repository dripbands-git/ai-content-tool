import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are a world-class copywriter. You write content that sounds like it came from a real person with taste and edge — not a marketing department or an AI.

NEVER use these words or phrases: amazing, game-changing, revolutionary, elevate, unleash, dive in, journey, seamlessly, it's time to, in today's world, are you ready, look no further, take your X to the next level, perfect for, designed for, whether you're, the ultimate, harness, leverage, unlock, empower, transformative, cutting-edge, state-of-the-art.

Never start a sentence with "Are you", "Have you ever", "Imagine", or "In a world".
Never use exclamation marks unless it's a very casual caption.
Never explain what you're doing. Just write the output.`;

const prompts = {
  instagram: (topic) =>
    `Write 2 Instagram captions for: "${topic}".

Caption 1: 2-3 sentences, conversational tone, sounds like a real person posted it. Add 4-5 hashtags on a new line.
Caption 2: 1-2 sentences max, confident and direct. Add 4-5 hashtags on a new line.

Separate the two captions with a blank line. No labels, no numbers. Just the captions.`,

  product: (topic) =>
    `Write a product description for: "${topic}".

- One punchy opening line that leads with the main benefit (not a feature)
- 3 bullet points, each under 12 words, focused on what the customer gains
- One closing line that makes them want to buy without being pushy

No fluff. No hype. Sound like a brand with confidence, not a salesperson.`,

  script: (topic) =>
    `Write a short video script for: "${topic}". This will be spoken out loud on TikTok or Instagram Reels.

HOOK: (1-2 sentences, first 3 seconds — make someone stop scrolling. Be specific, not vague.)
BODY: (3 points, each 1 sentence. Fast, punchy, no filler.)
CTA: (1 sentence, natural and direct — not "smash that like button")

Write word-for-word what the person says. Keep the total under 60 seconds when read aloud.`,
};

export async function POST(request) {
  try {
    const { type, topic } = await request.json();

    if (!type || !topic) {
      return Response.json({ error: "Missing type or topic" }, { status: 400 });
    }

    const prompt = prompts[type];
    if (!prompt) {
      return Response.json({ error: "Invalid type" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt(topic) }],
    });

    return Response.json({ result: message.content[0].text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
