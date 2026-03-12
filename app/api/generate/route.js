import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const prompts = {
  instagram: (topic) =>
    `Write 3 engaging Instagram captions for: "${topic}". Include relevant emojis and hashtags. Format each caption clearly numbered.`,
  product: (topic) =>
    `Write 3 compelling product descriptions for: "${topic}". Each should highlight benefits, features, and include a call to action. Format each clearly numbered.`,
  script: (topic) =>
    `Write a short video script (60-90 seconds) for: "${topic}". Include an engaging hook, main content, and a call to action. Format with clear sections: HOOK, MAIN CONTENT, CTA.`,
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
