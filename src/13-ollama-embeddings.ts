import * as dotenv from "dotenv";

dotenv.config();

/**
 * Ollama 本地 Embeddings 生成
 *
 * 演示如何使用本地模型生成向量嵌入
 * 可与之前的RAG示例结合使用
 *
 * 优势：
 * - 完全免费（无API费用）
 * - 无速率限制
 * - 数据隐私（不上传）
 * - 可批量处理
 */

const OLLAMA_API = "http://localhost:11434";

// 生成单个文本的embedding
async function generateEmbedding(
  model: string,
  text: string
): Promise<number[]> {
  const response = await fetch(`${OLLAMA_API}/api/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding;
}

// 批量生成embeddings
async function generateEmbeddings(
  model: string,
  texts: string[]
): Promise<number[][]> {
  console.log(`📊 批量生成 ${texts.length} 个文本的向量...\n`);

  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    if (!text) continue;

    console.log(`[${i + 1}/${texts.length}] 处理: ${text.substring(0, 50)}...`);

    const embedding = await generateEmbedding(model, text);
    if (embedding) {
      embeddings.push(embedding);
    }
  }

  console.log(`\n✅ 完成！生成了 ${embeddings.length} 个向量\n`);
  return embeddings;
}

// 计算余弦相似度
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce(
    (sum, a, i) => sum + a * (vecB[i] as number),
    0
  );
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// 简单的向量搜索
async function vectorSearch(
  model: string,
  query: string,
  documents: string[],
  topK: number = 3
) {
  console.log(`🔍 搜索查询: "${query}"\n`);

  // 1. 生成查询向量
  console.log("生成查询向量...");
  const queryEmbedding = await generateEmbedding(model, query);

  // 2. 生成文档向量
  console.log("生成文档向量...");
  const docEmbeddings = await generateEmbeddings(model, documents);

  // 3. 计算相似度
  console.log("计算相似度...\n");
  const similarities = docEmbeddings.map((docEmb, index) => ({
    index,
    document: documents[index] || "",
    similarity: docEmb ? cosineSimilarity(queryEmbedding, docEmb) : 0,
  }));

  // 4. 排序并返回topK
  similarities.sort((a, b) => b.similarity - a.similarity);

  return similarities.slice(0, topK);
}

async function main() {
  console.log("=== Ollama 本地 Embeddings 示例 ===\n");

  // 使用支持embeddings的模型
  const model = "qwen2.5:7b"; // 或 'llama3.1:8b', 'nomic-embed-text' 等

  // 示例1：生成单个embedding
  console.log("📚 示例1: 生成单个文本的向量\n");

  const text1 = "TypeScript是JavaScript的超集，添加了类型系统";
  console.log(`文本: ${text1}`);

  const embedding1 = await generateEmbedding(model, text1);
  console.log(`\n向量维度: ${embedding1.length}`);
  console.log(
    `前10个值: [${embedding1
      .slice(0, 10)
      .map((v) => v.toFixed(4))
      .join(", ")}...]\n`
  );

  // 示例2：计算文本相似度
  console.log("=".repeat(60));
  console.log("📚 示例2: 计算文本相似度\n");

  const texts = [
    "TypeScript是JavaScript的超集",
    "Python是一种高级编程语言",
    "TypeScript添加了静态类型",
  ];

  console.log("文本列表:");
  texts.forEach((t, i) => console.log(`${i + 1}. ${t}`));
  console.log("");

  const embeddings = await generateEmbeddings(model, texts);

  console.log("相似度矩阵:");
  for (let i = 0; i < texts.length; i++) {
    for (let j = 0; j < texts.length; j++) {
      const sim = cosineSimilarity(
        embeddings[i] as number[],
        embeddings[j] as number[]
      );
      console.log(`文本${i + 1} vs 文本${j + 1}: ${sim.toFixed(4)}`);
    }
    console.log("");
  }

  // 示例3：向量搜索（简单RAG）
  console.log("=".repeat(60));
  console.log("📚 示例3: 向量搜索\n");

  const documents = [
    "TypeScript是微软开发的JavaScript超集，添加了静态类型系统",
    "Python是一种解释型、高级编程语言，语法简洁优雅",
    "JavaScript是网页开发的核心语言，运行在浏览器中",
    "Go语言是Google开发的并发编程语言，适合后端服务",
    "Rust是系统编程语言，注重安全性和性能",
    "TypeScript通过类型检查可以在编译时发现错误",
  ];

  const query = "TypeScript的特点是什么？";
  const results = await vectorSearch(model, query, documents, 3);

  console.log("🎯 搜索结果:\n");
  results.forEach((result, index) => {
    console.log(
      `${index + 1}. [相似度: ${(result.similarity * 100).toFixed(2)}%]`
    );
    console.log(`   ${result.document}\n`);
  });

  // 性能统计
  console.log("=".repeat(60));
  console.log("\n💡 本地 Embeddings 的优势:");
  console.log("1. ✅ 完全免费 - 无API调用费用");
  console.log("2. ✅ 无限制 - 不受速率限制");
  console.log("3. ✅ 隐私保护 - 数据不离开本地");
  console.log("4. ✅ 快速批量 - 本地处理速度快");

  console.log("\n📊 对比云端API:");
  console.log("- Gemini Embeddings: $0.00001/1K tokens");
  console.log("- OpenAI Embeddings: $0.0001/1K tokens");
  console.log("- Ollama Embeddings: 完全免费！");

  console.log("\n⚠️  注意事项:");
  console.log("- 向量维度可能与云端API不同");
  console.log("- 质量稍逊于专门的embedding模型");
  console.log("- 但对于大多数应用已足够好");

  console.log("\n🎯 实际应用:");
  console.log("- 文档搜索系统");
  console.log("- 相似问题检测");
  console.log("- 内容推荐系统");
  console.log("- 结合本地RAG使用");
}

main().catch(console.error);
