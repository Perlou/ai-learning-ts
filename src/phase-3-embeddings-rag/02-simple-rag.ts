import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import * as readline from "readline";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const embeddingModel = genAI.getGenerativeModel({
  model: "text-embedding-004",
});
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 1. 模拟知识库 (My Private Notes)
const knowledgeBase = [
  "Perlou 最喜欢的食物是宫保鸡丁。",
  "Perlou 的猫叫 'Luna'，它是一只黑白相间的奶牛猫。",
  "Perlou 目前正在学习 AI 大模型开发，特别是 RAG 技术。",
  "Perlou 的幸运数字是 42。",
];

// 存储 Embeddings 的数组
interface Document {
  content: string;
  embedding: number[];
}
const vectorStore: Document[] = [];

// 计算余弦相似度
function cosineSimilarity(v1: number[], v2: number[]) {
  if (!v1 || !v2) return 0;
  const dotProduct = v1.reduce((sum, val, i) => sum + val * (v2[i] || 0), 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (mag1 * mag2);
}

async function main() {
  console.log("正在初始化知识库索引...");

  // 2. 索引阶段：为知识库生成 Embeddings
  for (const text of knowledgeBase) {
    const result = await embeddingModel.embedContent(text);
    vectorStore.push({
      content: text,
      embedding: result.embedding.values,
    });
    process.stdout.write(".");
  }
  console.log("\n索引完成！\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("请输入问题 (输入 'exit' 退出): ", async (query) => {
      if (query.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      try {
        // 3. 检索阶段
        // a. 生成问题的 Embedding
        const queryResult = await embeddingModel.embedContent(query);
        const queryVector = queryResult.embedding.values;

        // b. 计算相似度并排序
        const rankedDocs = vectorStore
          .map((doc) => ({
            ...doc,
            score: cosineSimilarity(queryVector, doc.embedding),
          }))
          .sort((a, b) => b.score - a.score); // 降序排列

        // c. 取出最相关的文档 (Top 1)
        const bestMatch = rankedDocs[0];
        if (!bestMatch) {
          console.log("未找到相关文档。");
          askQuestion();
          return;
        }
        console.log(
          `\n[检索结果] 最相关文档 (相似度: ${bestMatch.score.toFixed(4)}):`
        );
        console.log(`"${bestMatch.content}"\n`);

        // 4. 生成阶段
        // 构造包含上下文的 Prompt
        const prompt = `
你是一个智能助手。请根据下面的上下文信息回答用户的问题。如果上下文中没有答案，请诚实地说不知道。

上下文信息:
${bestMatch.content}

用户问题:
${query}
`;

        const result = await chatModel.generateContent(prompt);
        const response = await result.response;
        console.log(`AI 回复: ${response.text()}`);
        console.log("------------------------------------------------");

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
