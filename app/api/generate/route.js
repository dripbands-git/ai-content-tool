import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are a world-class copywriter. You write content that sounds like it came from a real person with taste and edge — not a marketing department or an AI.

NEVER use these words or phrases: amazing, game-changing, revolutionary, elevate, unleash, dive in, journey, seamlessly, it's time to, in today's world, are you ready, look no further, take your X to the next level, perfect for, designed for, whether you're, the ultimate, harness, leverage, unlock, empower, transformative, cutting-edge, state-of-the-art.

Never start a sentence with "Are you", "Have you ever", "Imagine", or "In a world".
Never use exclamation marks unless it's a very casual caption.
Never explain what you're doing. Just write the output.`;

const prompts = {
  instagram: (topic) =>
    `Write 1 Instagram caption for: "${topic}". 2-3 sentences max. Sounds like a real person. Add 4-5 hashtags on a new line. Nothing else.`,

  product: (topic) =>
    `Write a product description for: "${topic}". One strong opening line + 3 short bullet points (under 10 words each). No closing line. No fluff.`,

  script: (topic) =>
    `Write a 30-second video script for: "${topic}".

HOOK: (1 sentence)
BODY: (2-3 punchy points, 1 sentence each)
CTA: (1 sentence)

Word-for-word. Short. No filler.`,
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
