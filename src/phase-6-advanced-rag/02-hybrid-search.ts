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
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function getEmbedding(text: string): Promise<number[]> {
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function main() {
  // 1. 初始化数据库
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dbDir = path.join(__dirname, "..", ".lancedb");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const db = await lancedb.connect(dbDir);
  console.log(`已连接到 LanceDB: ${dbDir}`);

  // 2. 准备数据
  // 我们使用一些容易区分关键词搜索和语义搜索的例子
  const documents = [
    {
      id: 1,
      text: "The Python programming language is great for data science.",
      category: "coding",
    },
    {
      id: 2,
      text: "Pythons are large constricting snakes found in Africa and Asia.",
      category: "biology",
    },
    {
      id: 3,
      text: "Java is a popular object-oriented language.",
      category: "coding",
    },
    {
      id: 4,
      text: "I need a cup of strong coffee to wake up.",
      category: "lifestyle",
    },
    {
      id: 5,
      text: "Javascript is essential for web development.",
      category: "coding",
    },
  ];

  console.log("正在生成 Embeddings...");
  const data = [];
  for (const doc of documents) {
    const vector = await getEmbedding(doc.text);
    data.push({ ...doc, vector });
    // 简单的限流
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  // 3. 创建表
  const tableName = "hybrid_search_demo";
  try {
    await db.dropTable(tableName);
  } catch (e) {}

  const table = await db.createTable(tableName, data);
  console.log(`表 '${tableName}' 已创建。`);

  // 4. 创建全文搜索索引 (FTS Index)
  // 这允许我们进行关键词搜索
  console.log("正在创建全文索引 (FTS)...");
  await table.createIndex("text", {
    config: lancedb.Index.fts(),
  });

  // 5. 演示搜索
  const query = "python";
  console.log(`\n=== 查询词: "${query}" ===`);

  // 5.1 纯向量搜索 (Semantic Search)
  // 可能会找到"Java"或"Javascript"，因为它们在语义上都是编程语言
  // 但也可能找到"Snake"，因为"Python"也是蛇
  const queryVector = await getEmbedding(query);
  const vectorResults = await table
    .vectorSearch(queryVector)
    .limit(3)
    .toArray();

  console.log("\n--- 向量搜索结果 (语义) ---");
  vectorResults.forEach((r: any) => {
    console.log(`[距离: ${r._distance.toFixed(4)}] ${r.text}`);
  });

  // 5.2 纯关键词搜索 (Keyword Search)
  // 只会找到包含 "python" 这个词的文档
  const keywordResults = await table.search(query).limit(3).toArray();

  console.log("\n--- 关键词搜索结果 (FTS) ---");
  keywordResults.forEach((r: any) => {
    console.log(`[分数: ${r.score}] ${r.text}`);
  });

  // 5.3 混合搜索 (Hybrid Search)
  // 这里的实现方式通常是：
  // 1. 获取向量搜索结果
  // 2. 获取关键词搜索结果
  // 3. 使用 RRF (Reciprocal Rank Fusion) 或其他算法合并

  // 简单的手动合并演示：
  console.log("\n--- 手动混合搜索 (概念演示) ---");
  const allResults = new Map();

  // 添加向量结果 (权重 1.0)
  vectorResults.forEach((r: any, index) => {
    const score = 1 / (index + 1); // 基于排名的简单分数
    allResults.set(r.id, { ...r, hybridScore: score, source: ["vector"] });
  });

  // 添加关键词结果 (权重 1.0)
  keywordResults.forEach((r: any, index) => {
    const score = 1 / (index + 1);
    if (allResults.has(r.id)) {
      const existing = allResults.get(r.id);
      existing.hybridScore += score;
      existing.source.push("keyword");
    } else {
      allResults.set(r.id, { ...r, hybridScore: score, source: ["keyword"] });
    }
  });

  // 排序并显示
  const hybridResults = Array.from(allResults.values()).sort(
    (a: any, b: any) => b.hybridScore - a.hybridScore
  );

  hybridResults.forEach((r: any) => {
    console.log(
      `[混合分数: ${r.hybridScore.toFixed(2)}] [来源: ${r.source.join("+")}] ${
        r.text
      }`
    );
  });
}

main().catch(console.error);
