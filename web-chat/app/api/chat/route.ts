import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 30;
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.0-flash-exp"), // 使用可用的模型
    messages,
  });

  return result.toTextStreamResponse();
}
