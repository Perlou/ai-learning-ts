import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

interface ExtractedData {
  person: string;
  location: string;
  date: string;
  event: string;
}

async function extractStructuredData() {
  console.log("=== 结构化输出（JSON）演示 ===\n");

  const text =
    "张三将于2024年3月15日在北京参加AI技术大会，届时将分享关于大语言模型的最新研究成果。";

  // ✅ 要求JSON格式输出
  const prompt = `从以下文本中提取关键信息，并以JSON格式输出：

文本：${text}

要求输出格式（纯JSON，不要任何额外说明）：
{
  "person": "人名",
  "location": "地点",
  "date": "日期",
  "event": "事件"
}`;

  console.log("【提示词】");
  console.log(prompt);
  console.log("\n" + "=".repeat(60) + "\n");

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  console.log("【原始回复】");
  console.log(responseText);
  console.log("\n" + "=".repeat(60) + "\n");

  // 解析JSON
  try {
    // 提取JSON部分（去除可能的markdown代码块）
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const data: ExtractedData = JSON.parse(jsonMatch[0]);

    console.log("【解析后的结构化数据】");
    console.log("人名:", data.person);
    console.log("地点:", data.location);
    console.log("日期:", data.date);
    console.log("事件:", data.event);
    console.log("\n" + "=".repeat(60) + "\n");

    // 💡 实际应用示例
    console.log("【实际应用】");
    console.log("现在这些数据可以直接用于：");
    console.log(
      `1. 添加到日历：${data.person} 在 ${data.date} 的 ${data.event}`
    );
    console.log(`2. 创建提醒：${data.event} - ${data.location}`);
    console.log(`3. 存入数据库进行结构化查询`);
    console.log(`4. 生成报表或统计信息`);
  } catch (error) {
    console.error("JSON解析失败:", error);
    console.log(
      '提示：如果JSON解析失败，可以在prompt中更明确地要求"只输出纯JSON，不要任何解释"'
    );
  }

  console.log("\n" + "=".repeat(60) + "\n");

  // 🎯 批量处理示例
  console.log("【批量处理示例】\n");

  const texts = [
    "李四预计在2024年4月20日前往上海参加产品发布会。",
    "王五将于2024年5月1日在深圳举办技术培训课程。",
  ];

  const batchPrompt = `从以下多条文本中提取关键信息，并以JSON数组格式输出：

文本列表：
${texts.map((t, i) => `${i + 1}. ${t}`).join("\n")}

要求输出格式（纯JSON数组，不要任何额外说明）：
[
  {
    "person": "...",
    "location": "...",
    "date": "...",
    "event": "..."
  },
  ...
]`;

  console.log("处理多条文本...\n");
  const batchResult = await model.generateContent(batchPrompt);
  const batchResponse = batchResult.response.text();

  console.log("批量提取结果:");
  console.log(batchResponse);
  console.log("\n" + "=".repeat(60) + "\n");

  console.log("💡 结构化输出的优势：");
  console.log("1. 输出可预测、易于解析");
  console.log("2. 便于程序集成和自动化处理");
  console.log("3. 减少文本解析的复杂度和错误");
  console.log("4. 支持类型检查和数据验证");
}

extractStructuredData().catch(console.error);
