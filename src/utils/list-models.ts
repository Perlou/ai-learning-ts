import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  try {
    // Note: The SDK might not expose listModels directly on the main class in all versions,
    // but usually it's via a model manager or similar.
    // Actually, for the JS SDK, we might need to use the model manager if available,
    // or just try to infer from documentation.
    // Let's try to use the `getGenerativeModel` to just check if we can connect,
    // but since we want to LIST, let's look at the error message suggestion: "Call ListModels".
    // The Node SDK might not have a direct listModels helper in the main entry point in older versions,
    // but let's try to see if we can access it via the API.

    // Since the SDK wraps the API, if there isn't a clear listModels method,
    // we might just try 'gemini-1.0-pro' or similar.

    // However, let's try to fetch via REST API using fetch to be sure,
    // bypassing the SDK for listing if the SDK doesn't make it obvious.

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("Available Models:");
    if (data.models) {
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
      });
    } else {
      console.log("No models found or error:", data);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

main();
