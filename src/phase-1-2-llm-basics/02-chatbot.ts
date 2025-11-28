import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("请在 .env 文件中设置 GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// 创建 readline 接口用于终端输入输出
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // 1. 启动聊天会话 (Start Chat Session)
  // Gemini SDK 的 startChat 会自动帮我们管理 history (上下文)
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "你好，我是一个正在学习 AI 的开发者。" }],
      },
      {
        role: "model",
        parts: [{ text: "你好！很高兴认识你。有什么我可以帮你的吗？" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  console.log("🤖 AI 聊天机器人已启动 (输入 'exit' 退出)");
  console.log("------------------------------------------------");

  // 2. 递归函数处理用户输入
  const askQuestion = () => {
    rl.question("You: ", async (msg) => {
      if (msg.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      try {
        // 3. 发送消息并获取流式响应 (Stream) 或者普通响应
        // 这里我们用 sendMessage，它会自动把 msg 加入历史，并把回复也加入历史
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();

        console.log(`AI: ${text}`);
        console.log("------------------------------------------------");

        // 继续下一轮对话
        askQuestion();
      } catch (error) {
        console.error("出错:", error);
        askQuestion();
      }
    });
  };

  askQuestion();
}

main();
