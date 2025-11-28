import * as lancedb from "@lancedb/lancedb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("请在 .env 文件中设置 GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function getEmbedding(text: string): Promise<number[]> {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

async function rerank(query: string, documents: any[]) {
  console.log("正在使用 Gemini 进行重排序...");

  const docsStr = documents
    .map((d, i) => `ID: ${d.id}\n内容: ${d.text}`)
    .join("\n\n");

  const prompt = `
你是一个相关性排序助手。
查询: "${query}"

文档:
${docsStr}

任务: 根据文档与查询的相关性对文档进行排序。
返回一个 JSON 对象数组，每个对象包含 'id' 和 'relevance_score' (0-10)。
按 relevance_score 降序排列。
只包含相关的文档。

输出格式:
\`\`\`json
[
  { "id": 1, "relevance_score": 9.5, "reason": "..." },
  ...
]
\`\`\`
`;

  const result = await chatModel.generateContent(prompt);
  const response = result.response.text();

  // 提取 JSON
  // 尝试匹配 markdown 代码块，如果没有则尝试直接解析
  let jsonStr = response;
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  if (jsonMatch && jsonMatch[1]) {
    jsonStr = jsonMatch[1];
  } else {
    // 尝试匹配没有 json 标记的代码块
    const codeBlockMatch = response.match(/```\n([\s\S]*?)\n```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      jsonStr = codeBlockMatch[1];
    }
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON 解析失败:", e);
    console.log("原始响应:", response);
    return [];
  }
}

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbDir = path.join(__dirname, "..", ".lancedb");

  const db = await lancedb.connect(dbDir);
  const table = await db.openTable("hybrid_search_demo");

  const query = "python for data analysis";
  console.log(`\n=== 查询词: "${query}" ===`);

  // 1. 初步检索 (Retrieval)
  // 我们获取更多的结果 (Top 10)，让 Reranker 来筛选
  const queryVector = await getEmbedding(query);
  const initialResults = await table
    .vectorSearch(queryVector)
    .limit(10)
    .toArray();

  console.log(`\n--- 初步检索结果 (Top ${initialResults.length}) ---`);
  initialResults.forEach((r: any) => {
    console.log(`[ID: ${r.id}] [距离: ${r._distance.toFixed(4)}] ${r.text}`);
  });

  // 2. 重排序 (Re-ranking)
  const rerankedResults = await rerank(query, initialResults);

  console.log("\n--- 重排序结果 ---");
  rerankedResults.forEach((r: any) => {
    // Find original doc text
    const doc = initialResults.find((d: any) => d.id === r.id);
    console.log(`[分数: ${r.relevance_score}] [ID: ${r.id}] ${doc?.text}`);
    console.log(`  理由: ${r.reason}`);
  });
}

main().catch(console.error);
