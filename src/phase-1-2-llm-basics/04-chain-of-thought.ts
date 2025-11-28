import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function demonstrateCoT() {
  console.log("=== Chain of Thought (思维链) 演示 ===\n");

  const problem = `小明有15个苹果，他给了小红其中的1/3，
然后自己又吃了2个。剩下的苹果平均分给3个朋友，
每人能得到几个？`;

  // ❌ 不使用CoT：直接要求答案
  const directPrompt = `${problem}

请直接给出答案。`;

  console.log("【方法1：直接回答】");
  console.log(`提示词:\n${directPrompt}\n`);

  const directResult = await model.generateContent(directPrompt);
  console.log("回复:");
  console.log(directResult.response.text());
  console.log("\n" + "=".repeat(60) + "\n");

  // ✅ 使用CoT：要求展示推理过程
  const cotPrompt = `${problem}

请一步步展示你的计算过程，列出每一步的算式和结果。
最后给出最终答案。`;

  console.log("【方法2：思维链（CoT）】");
  console.log(`提示词:\n${cotPrompt}\n`);

  const cotResult = await model.generateContent(cotPrompt);
  console.log("回复:");
  console.log(cotResult.response.text());
  console.log("\n" + "=".repeat(60) + "\n");

  // 💡 复杂推理示例
  const complexProblem = `有红、蓝、绿三种颜色的球各若干个。
已知：
1. 红球比蓝球多5个
2. 绿球是蓝球的2倍
3. 三种球总共有45个

问：每种颜色各有多少个球？`;

  const complexCoTPrompt = `${complexProblem}

请使用代数方法，清晰地列出：
1. 设未知数
2. 列方程
3. 求解过程
4. 验证答案`;

  console.log("【复杂推理示例】");
  console.log(`问题:\n${complexProblem}\n`);

  const complexResult = await model.generateContent(complexCoTPrompt);
  console.log("回复:");
  console.log(complexResult.response.text());
  console.log("\n" + "=".repeat(60) + "\n");

  console.log("💡 CoT 的优势：");
  console.log("1. 提高复杂推理任务的准确率");
  console.log("2. 让推理过程可验证、可调试");
  console.log("3. 帮助发现模型的逻辑错误");
  console.log("4. 增强输出的可解释性");
}

demonstrateCoT().catch(console.error);
