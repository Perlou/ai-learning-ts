import * as dotenv from "dotenv";

dotenv.config();

/**
 * Ollama 基础示例
 *
 * 演示如何通过REST API调用本地Ollama模型
 *
 * 前提：
 * 1. 已安装Ollama (brew install ollama)
 * 2. 已下载模型 (ollama pull qwen2.5:7b)
 * 3. Ollama服务正在运行
 */

const OLLAMA_API = "http://localhost:11434";

// 检查Ollama服务是否运行
async function checkOllamaService(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_API}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Ollama服务运行中");
      console.log(`📦 已安装的模型: ${data.models?.length || 0}个\n`);
      return true;
    }
  } catch (error) {
    console.error("❌ Ollama服务未运行");
    console.error("请先启动: ollama serve");
    return false;
  }
  return false;
}

// 基础文本生成
async function generateText(model: string, prompt: string) {
  console.log(`🤖 使用模型: ${model}`);
  console.log(`💬 提示词: ${prompt}\n`);

  const startTime = Date.now();

  try {
    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false, // 非流式，一次性返回
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API错误: ${error}`);
    }

    const data = await response.json();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("📝 回复:");
    console.log(data.response);
    console.log(`\n⏱️  耗时: ${elapsed}秒`);
    console.log(`📊 生成token数: ${data.eval_count || "N/A"}`);

    if (data.eval_count && elapsed) {
      const tokensPerSec = (data.eval_count / parseFloat(elapsed)).toFixed(1);
      console.log(`⚡ 速度: ${tokensPerSec} tokens/秒`);
    }

    return data.response;
  } catch (error) {
    console.error("❌ 生成失败:", error);
    throw error;
  }
}

// 流式生成（逐字输出）
async function generateStream(model: string, prompt: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🌊 流式生成示例`);
  console.log(`🤖 模型: ${model}`);
  console.log(`💬 提示词: ${prompt}\n`);

  const response = await fetch(`${OLLAMA_API}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true, // 启用流式
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Stream failed");
  }

  console.log("📝 回复: ");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      try {
        const data = JSON.parse(line);
        if (data.response) {
          process.stdout.write(data.response);
          fullResponse += data.response;
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }

  console.log("\n");
  return fullResponse;
}

// 主函数
async function main() {
  console.log("=== Ollama 基础使用示例 ===\n");

  // 1. 检查服务
  const isRunning = await checkOllamaService();
  if (!isRunning) {
    console.log("\n💡 启动提示:");
    console.log("1. 安装: brew install ollama");
    console.log("2. 下载模型: ollama pull qwen2.5:7b");
    console.log("3. 启动服务: ollama serve");
    return;
  }

  // 使用的模型（根据你安装的模型修改）
  const model = "qwen2.5:7b"; // 或 'llama3.1:8b', 'gemma2:2b' 等

  console.log("=".repeat(60));
  console.log("示例 1: 基础文本生成（非流式）\n");

  const prompt1 = "用一句话介绍TypeScript的优势";
  await generateText(model, prompt1);

  console.log("\n" + "=".repeat(60));
  console.log("示例 2: 解释概念\n");

  const prompt2 = "解释什么是量子计算，用简单的语言，不超过100字";
  await generateText(model, prompt2);

  // 示例 3: 流式生成
  await generateStream(model, "写一首关于代码的五言绝句");

  console.log("=".repeat(60));
  console.log("\n💡 观察要点:");
  console.log("1. 本地运行 - 无需API密钥");
  console.log("2. 完全免费 - 无调用次数限制");
  console.log("3. 隐私保护 - 数据不离开本地");
  console.log("4. 流式输出 - 提升用户体验");
  console.log("5. 推理速度 - 取决于硬件（Apple Silicon很快）");

  console.log("\n🎯 下一步:");
  console.log("- 运行 src/12-ollama-chat.ts 学习对话模式");
  console.log("- 运行 src/13-ollama-embeddings.ts 学习向量生成");
}

main().catch(console.error);
