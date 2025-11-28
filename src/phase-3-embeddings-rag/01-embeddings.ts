import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("请在 .env 文件中设置 GEMINI_API_KEY");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function main() {
  // 使用专门的 Embedding 模型
  // text-embedding-004 是目前推荐的模型
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  const text1 = "Cat";
  const text2 = "Dog";
  const text3 = "Apple";

  console.log(`正在生成 Embeddings (向量)...`);

  try {
    const result1 = await model.embedContent(text1);
    const result2 = await model.embedContent(text2);
    const result3 = await model.embedContent(text3);

    const vector1 = result1.embedding.values;
    const vector2 = result2.embedding.values;
    const vector3 = result3.embedding.values;

    console.log(`\n文本: "${text1}"`);
    console.log(`维度: ${vector1.length}`); // 通常是 768
    console.log(`前 5 个数值: ${vector1.slice(0, 5)}...`);

    console.log(`\n文本: "${text2}"`);
    console.log(`前 5 个数值: ${vector2.slice(0, 5)}...`);

    console.log(`\n文本: "${text3}"`);
    console.log(`前 5 个数值: ${vector3.slice(0, 5)}...`);

    // 简单的欧几里得距离计算 (为了演示)
    // 注意：在生产环境中，通常使用余弦相似度 (Cosine Similarity)
    function euclideanDistance(v1: number[], v2: number[]) {
      if (!v1 || !v2) return 0;
      return Math.sqrt(
        v1.reduce((sum, val, i) => sum + Math.pow(val - (v2[i] || 0), 2), 0)
      );
    }

    const d1 = euclideanDistance(vector1, vector2); // 猫 vs 狗
    const d2 = euclideanDistance(vector1, vector3); // 猫 vs 苹果

    console.log("\n--- 距离比较 (越小越相似) ---");
    console.log(`"${text1}" vs "${text2}": ${d1.toFixed(4)}`);
    console.log(`"${text1}" vs "${text3}": ${d2.toFixed(4)}`);

    if (d1 < d2) {
      console.log("结论: 猫和狗更像！(语义距离更近)");
    } else {
      console.log("结论: 猫和苹果更像？(这不科学)");
    }
  } catch (error) {
    console.error("出错:", error);
  }
}

main();
