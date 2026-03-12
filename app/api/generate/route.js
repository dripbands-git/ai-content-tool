import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const prompts = {
  instagram: (topic) =>
    `You are a professional social media strategist who writes for real brands and creators. Write 2 Instagram captions for: "${topic}".

Rules:
- Write like a human, not a robot. No generic phrases like "In a world where..." or "Are you ready to..."
- Be specific, confident, and direct
- First caption: conversational and relatable (2-3 sentences + 5 targeted hashtags)
- Second caption: punchy and bold (1-2 sentences + 5 targeted hashtags)
- Emojis only where they feel natural, not forced
- No numbering headers, just separate with a blank line

Only output the captions. Nothing else.`,

  product: (topic) =>
    `You are a professional copywriter for e-commerce brands. Write a product description for: "${topic}".

Rules:
- Lead with the biggest benefit, not a feature
- Write in a clean, confident tone — no hype words like "amazing", "revolutionary", or "game-changing"
- Structure: 1 strong opening sentence, 3-4 benefit-led bullet points, 1 closing sentence with a subtle call to action
- Keep it concise and scannable
- Sound like a real brand, not a template

Only output the product description. Nothing else.`,

  script: (topic) =>
    `You are a professional video scriptwriter for short-form content (Reels, TikTok). Write a 45-60 second video script for: "${topic}".

Rules:
- HOOK (first 3 seconds): Start with a bold statement or question that stops the scroll. No "Hey guys" or "Welcome back"
- BODY: 3 tight, punchy points. Each point is 1-2 sentences max
- CTA: One clear, natural call to action — not salesy
- Write exactly what the creator should say out loud, word for word
- Label each section: HOOK / BODY / CTA

Only output the script. Nothing else.`,
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
      messages: [{ role: "user", content: prompt(topic) }],
    });

    return Response.json({ result: message.content[0].text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
