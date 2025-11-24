import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// 从 .env 文件加载环境变量
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("请在 .env 文件中设置 GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  try {
    // 获取模型实例
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "向一位新的 AI 学习者打个招呼！";

    console.log(`发送提示词: "${prompt}"...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("\nGemini 回复:");
    console.log(text);
  } catch (error) {
    console.error("调用 Gemini 出错:", error);
  }
}

main();
