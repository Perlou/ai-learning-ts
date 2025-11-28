import * as dotenv from "dotenv";

dotenv.config();

/**
 * Ollama 对话模式
 *
 * 演示如何使用 /api/chat 端点进行多轮对话
 * 并管理对话历史
 *
 * 前提：Ollama服务运行中，已安装模型
 */

const OLLAMA_API = "http://localhost:11434";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

// 对话类
class OllamaChat {
  private model: string;
  private messages: Message[] = [];
  private systemPrompt?: string;

  constructor(model: string, systemPrompt?: string) {
    this.model = model;
    this.systemPrompt = systemPrompt as string;

    if (systemPrompt) {
      this.messages.push({
        role: "system",
        content: systemPrompt,
      });
    }
  }

  async chat(userMessage: string): Promise<string> {
    // 添加用户消息
    this.messages.push({
      role: "user",
      content: userMessage,
    });

    console.log(`\n${"=".repeat(60)}`);
    console.log(`👤 用户: ${userMessage}\n`);

    const response = await fetch(`${OLLAMA_API}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: this.messages,
        stream: true, // 流式输出
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Chat failed");
    }

    console.log("🤖 助手: ");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((l) => l.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message?.content) {
            process.stdout.write(data.message.content);
            assistantMessage += data.message.content;
          }
        } catch (e) {
          // 忽略
        }
      }
    }

    console.log("\n");

    // 保存助手回复
    this.messages.push({
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  }

  getHistory(): Message[] {
    return [...this.messages];
  }

  clearHistory() {
    this.messages = this.systemPrompt
      ? [{ role: "system", content: this.systemPrompt }]
      : [];
  }
}

async function main() {
  console.log("=== Ollama 对话模式示例 ===\n");

  const model = "qwen2.5:7b"; // 或其他已安装的模型

  // 示例1：简单多轮对话
  console.log("📚 示例1: 多轮对话\n");

  const chat1 = new OllamaChat(model);

  await chat1.chat("我想学习TypeScript，从哪里开始？");
  await chat1.chat("那我已经会JavaScript了呢？"); // 基于上下文
  await chat1.chat("推荐一些学习资源");

  console.log("\n📊 对话历史:");
  console.log(`共 ${chat1.getHistory().length} 条消息\n`);

  // 示例2：带系统提示的对话
  console.log("=".repeat(60));
  console.log("📚 示例2: 角色扮演（Python专家）\n");

  const chat2 = new OllamaChat(
    model,
    "你是一位Python编程专家，擅长用简单的语言解释复杂概念。"
  );

  await chat2.chat("什么是装饰器（decorator）？");
  await chat2.chat("能给个实际应用的例子吗？");

  // 示例3：技术助手
  console.log("=".repeat(60));
  console.log("📚 示例3: 代码助手\n");

  const chat3 = new OllamaChat(
    model,
    "你是一位代码审查专家，帮助开发者改进代码质量。"
  );

  const code = `
function calc(a, b) {
  return a + b;
}
`;

  await chat3.chat(`请审查这段代码并给出改进建议：\n${code}`);
  await chat3.chat("如果要支持多个参数相加呢？");

  console.log("=".repeat(60));
  console.log("\n💡 关键特性:");
  console.log("1. ✅ 上下文保持 - AI记得之前的对话");
  console.log("2. ✅ 系统提示 - 定义AI的角色和行为");
  console.log("3. ✅ 历史管理 - 可查看和清空历史");
  console.log("4. ✅ 流式输出 - 逐字显示提升体验");

  console.log("\n🔄 对比云端API:");
  console.log("- 成本: Ollama免费 vs Gemini/GPT收费");
  console.log("- 速度: 本地快（无网络） vs 云端慢");
  console.log("- 能力: 本地稍弱 vs 云端最强");
  console.log("- 隐私: 本地完全私密 vs 云端需信任");
}

main().catch(console.error);
