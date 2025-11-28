import * as lancedb from "@lancedb/lancedb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

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
  // 1. 初始化/连接数据库
  // 数据将存储在当前目录下的 .lancedb 文件夹中
  const dbDir = path.join(__dirname, "..", ".lancedb");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = await lancedb.connect(dbDir);

  console.log(`Connected to LanceDB at ${dbDir}`);

  // 2. 准备数据
  const documents = [
    {
      id: 1,
      text: "The quick brown fox jumps over the lazy dog.",
      category: "fiction",
    },
    {
      id: 2,
      text: "Machine learning is a subset of artificial intelligence.",
      category: "tech",
    },
    {
      id: 3,
      text: "A recipe for chocolate cake includes flour, sugar, and cocoa.",
      category: "cooking",
    },
    {
      id: 4,
      text: "Neural networks are inspired by the human brain.",
      category: "tech",
    },
  ];

  console.log("Generating embeddings...");

  // 为每个文档生成向量
  const data = [];
  for (const doc of documents) {
    const vector = await getEmbedding(doc.text);
    data.push({
      ...doc,
      vector,
    });
    // 简单的限流，避免触发 API 限制
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // 3. 创建表
  const tableName = "demo_table";
  // 如果表存在则删除，为了演示方便
  try {
    await db.dropTable(tableName);
  } catch (e) {
    // 忽略表不存在的错误
  }

  // LanceDB 会自动推断 schema，但显式指定通常更好，这里我们让它自动推断
  // 注意：LanceDB 需要知道向量的维度，第一次插入时会自动检测
  const table = await db.createTable(tableName, data);
  console.log(`Table '${tableName}' created with ${data.length} rows.`);

  // 4. 向量搜索
  const queryText = "How do AI models learn?";
  console.log(`\nQuerying for: "${queryText}"`);

  const queryVector = await getEmbedding(queryText);

  const results = await table.vectorSearch(queryVector).limit(2).toArray();

  console.log("\nSearch Results:");
  results.forEach((r: any) => {
    console.log(
      `[Score: ${r._distance?.toFixed(4)}] ${r.text} (Category: ${r.category})`
    );
  });

  // 5. 混合过滤 (Hybrid Filter)
  // LanceDB 支持 SQL 风格的过滤
  console.log(`\nFiltering for category = 'tech'...`);
  const techResults = await table
    .vectorSearch(queryVector)
    .where("category = 'tech'")
    .limit(2)
    .toArray();

  techResults.forEach((r: any) => {
    console.log(
      `[Score: ${r._distance?.toFixed(4)}] ${r.text} (Category: ${r.category})`
    );
  });
}

main().catch(console.error);
