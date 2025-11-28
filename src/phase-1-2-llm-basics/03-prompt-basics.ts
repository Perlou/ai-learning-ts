import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function comparePrompts() {
  console.log("=== 提示词工程对比实验 ===\n");

  // ❌ 糟糕的提示词：模糊、缺乏上下文
  const badPrompt = "写一篇文章";

  console.log("【糟糕的提示词】");
  console.log(`提示词: "${badPrompt}"\n`);

  const badResult = await model.generateContent(badPrompt);
  console.log("回复:");
  console.log(badResult.response.text());
  console.log("\n" + "=".repeat(60) + "\n");

  // ✅ 优秀的提示词：包含上下文、角色和约束
  const goodPrompt = `你是一位资深的技术写作专家。

请为一个面向初学者的编程博客写一篇关于TypeScript基础的文章。

目标读者：有JavaScript经验但从未使用过TypeScript的开发者
重点内容：解释类型系统如何帮助减少bug
文章要求：
- 长度：300字左右
- 语言：简洁易懂，避免过于专业的术语
- 结构：包含引言、核心观点、实际示例、总结
- 风格：友好、鼓励性的语气`;

  console.log("【优秀的提示词】");
  console.log(`提示词:\n${goodPrompt}\n`);

  const goodResult = await model.generateContent(goodPrompt);
  console.log("回复:");
  console.log(goodResult.response.text());
  console.log("\n" + "=".repeat(60) + "\n");

  // 🎯 三原则示例：Context + Role + Constraints
  console.log("【三原则解析】\n");
  console.log("✅ Context (上下文):");
  console.log("   - 目标读者是谁？（有JS经验的初学者）");
  console.log("   - 写作场景？（技术博客）");
  console.log("   - 重点是什么？（类型系统减少bug）\n");

  console.log("✅ Role (角色):");
  console.log('   - "你是一位资深的技术写作专家"\n');

  console.log("✅ Constraints (约束):");
  console.log("   - 长度限制（300字左右）");
  console.log("   - 语言风格（简洁易懂）");
  console.log("   - 结构要求（引言、观点、示例、总结）");
  console.log("   - 语气风格（友好、鼓励性）\n");

  console.log("💡 关键对比：");
  console.log("糟糕的提示词太模糊，模型无法理解你的真实意图。");
  console.log("优秀的提示词通过提供充分的上下文和明确的约束，");
  console.log("引导模型生成更符合预期的高质量内容。");
}

comparePrompts().catch(console.error);
