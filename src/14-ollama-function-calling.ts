import * as dotenv from "dotenv";

dotenv.config();

/**
 * Ollama Function Calling 实现
 *
 * 注意：Ollama不原生支持Function Calling
 * 需要通过精心设计的提示词来实现
 *
 * 这个示例展示了如何通过prompt engineering
 * 让本地模型"模拟"Function Calling的行为
 */

const OLLAMA_API = "http://localhost:11434";

// 工具定义
const tools = {
  get_weather: {
    description: "获取指定城市的天气信息",
    parameters: {
      city: { type: "string", description: "城市名称" },
    },
    function: (args: any) => {
      const weather: Record<string, any> = {
        北京: { temperature: 15, condition: "晴天" },
        上海: { temperature: 20, condition: "多云" },
        深圳: { temperature: 28, condition: "阴天" },
      };
      return weather[args.city] || { temperature: 18, condition: "未知" };
    },
  },
  calculator: {
    description: "执行数学计算",
    parameters: {
      expression: { type: "string", description: "数学表达式" },
    },
    function: (args: any) => {
      try {
        return { result: eval(args.expression) };
      } catch (e) {
        return { error: "计算错误" };
      }
    },
  },
  get_time: {
    description: "获取当前时间",
    parameters: {},
    function: () => {
      return { time: new Date().toLocaleString("zh-CN") };
    },
  },
};

// 生成工具提示
function generateToolsPrompt(): string {
  const toolDescriptions = Object.entries(tools).map(([name, tool]) => {
    const params = Object.entries(tool.parameters)
      .map(([paramName, paramInfo]: [string, any]) => {
        return `  - ${paramName}: ${paramInfo.description}`;
      })
      .join("\n");

    return `${name}: ${tool.description}\n参数:\n${params || "  无参数"}`;
  });

  return `你是一个智能助手，可以调用以下工具来帮助用户：

可用工具：
${toolDescriptions.join("\n\n")}

重要规则：
1. 当需要调用工具时，必须严格按照以下JSON格式输出：
   {"tool": "工具名", "args": {参数}}

2. 只输出JSON，不要有其他文字

3. 如果不需要工具，正常回答即可

示例：
用户："北京天气怎么样？"
你：{"tool": "get_weather", "args": {"city": "北京"}}

用户："计算 25 + 17"
你：{"tool": "calculator", "args": {"expression": "25 + 17"}}

现在开始：`;
}

// 使用Ollama调用
async function chat(model: string, prompt: string): Promise<string> {
  const response = await fetch(`${OLLAMA_API}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  const data = await response.json();
  return data.response.trim();
}

// 尝试解析工具调用
function parseToolCall(response: string): { tool: string; args: any } | null {
  try {
    // 尝试提取JSON
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed.tool && parsed.args !== undefined) {
      return { tool: parsed.tool, args: parsed.args };
    }
  } catch (e) {
    // 解析失败
  }
  return null;
}

// 执行工具
function executeTool(toolCall: { tool: string; args: any }): any {
  const tool = tools[toolCall.tool as keyof typeof tools];
  if (!tool) {
    return { error: `未知工具: ${toolCall.tool}` };
  }

  console.log(`\n🔧 [调用工具] ${toolCall.tool}`);
  console.log(`📝 [参数] ${JSON.stringify(toolCall.args, null, 2)}`);

  const result = tool.function(toolCall.args);
  console.log(`✅ [结果] ${JSON.stringify(result, null, 2)}`);

  return result;
}

// Agent流程
async function runAgent(model: string, userQuery: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`👤 [用户]: ${userQuery}\n`);

  // 1. 构建完整提示
  const systemPrompt = generateToolsPrompt();
  const fullPrompt = `${systemPrompt}\n\n用户: ${userQuery}`;

  // 2. 获取AI响应
  const aiResponse = await chat(model, fullPrompt);
  console.log(`🤖 [AI原始响应]:`);
  console.log(aiResponse);

  // 3. 尝试解析工具调用
  const toolCall = parseToolCall(aiResponse);

  if (toolCall) {
    // 4. 执行工具
    const toolResult = executeTool(toolCall);

    // 5. 生成最终回答
    const finalPrompt = `根据以下信息回答用户问题。

用户问题: ${userQuery}
工具调用: ${toolCall.tool}
工具结果: ${JSON.stringify(toolResult)}

请用自然语言回答用户：`;

    const finalAnswer = await chat(model, finalPrompt);
    console.log(`\n🤖 [最终回答]:`);
    console.log(finalAnswer);
  } else {
    // 不需要工具，直接回答
    console.log(`\n💬 [直接回答]:`);
    console.log(aiResponse);
  }
}

async function main() {
  console.log("=== Ollama Function Calling 实现 ===\n");

  const model = "qwen2.5:7b"; // 推荐使用中文模型

  console.log("⚠️  重要说明:");
  console.log("Ollama不原生支持Function Calling");
  console.log("这是通过精心设计的提示词来模拟实现\n");

  // 测试用例
  const testCases = [
    "北京今天天气怎么样？",
    "帮我计算一下 (25 + 15) * 2",
    "现在几点了？",
    "你好，请介绍一下你自己", // 不需要工具的查询
  ];

  for (const query of testCases) {
    await runAgent(model, query);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 避免请求过快
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 关键要点:");
  console.log("1. ❌ Ollama不原生支持Function Calling");
  console.log("2. ✅ 可通过精心设计的prompt模拟");
  console.log("3. ⚠️  成功率不如Gemini/GPT-4");
  console.log("4. 📝 需要明确的JSON格式指令");
  console.log("5. 🔄 可能需要多次尝试和优化");

  console.log("\n🆚 对比原生Function Calling:");
  console.log("");
  console.log("| 特性 | Gemini/GPT-4 | Ollama模拟 |");
  console.log("|------|-------------|-----------|");
  console.log("| 准确性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |");
  console.log("| 可靠性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |");
  console.log("| 成本 | 💰 | 免费 |");
  console.log("| 隐私 | 云端 | 本地 |");

  console.log("\n📊 适用场景:");
  console.log("✅ 简单工具调用");
  console.log("✅ 学习和实验");
  console.log("✅ 隐私敏感场景");
  console.log("❌ 复杂多工具协作");
  console.log("❌ 关键生产环境");

  console.log("\n🎯 优化建议:");
  console.log("1. 使用更强的模型（14B+）");
  console.log("2. 添加Few-shot示例");
  console.log("3. 严格的输出格式验证");
  console.log("4. 重试机制");
}

main().catch(console.error);
