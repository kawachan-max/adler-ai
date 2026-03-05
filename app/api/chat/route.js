import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { messages, system } = await request.json();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: system,
      messages: messages,
    });

    return Response.json({ content: response.content });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
