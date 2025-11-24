import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 简单的工具定义
const tools = [
  {
    functionDeclarations: [
      {
        name: "get_weather",
        description: "获取指定城市的天气信息",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            city: {
              type: SchemaType.STRING,
              description: "城市名称",
            },
          },
          required: ["city"],
        },
      },
    ],
  },
];

// 模拟天气函数
function getWeather(city: string) {
  const weather: Record<string, any> = {
    北京: { temperature: 15, condition: "晴天" },
    上海: { temperature: 20, condition: "多云" },
  };
  return weather[city] || { temperature: 18, condition: "未知" };
}

async function testFunctionCalling() {
  console.log("=== Function Calling 调试测试 ===\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: tools as any,
  });

  // 使用 Chat Session
  const chat = model.startChat();

  const prompt = "北京今天天气怎么样？";
  console.log(`👤 用户: ${prompt}\n`);

  try {
    // 第一次调用
    let result = await chat.sendMessage(prompt);
    let response = result.response;

    // 正确的访问方式：从 candidates[0].content.parts 中获取
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    console.log("📊 Parts:", JSON.stringify(parts, null, 2));

    // 查找 functionCall
    const functionCallPart = parts.find((part: any) => part.functionCall);

    if (functionCallPart && functionCallPart.functionCall) {
      console.log("\n✅ Function Calling 被触发！");
      const fc = functionCallPart.functionCall;
      console.log("函数名:", fc.name);
      console.log("参数:", JSON.stringify(fc.args, null, 2));

      // 执行函数
      const weather = getWeather((fc.args as any).city);
      console.log("\n🔧 执行函数，返回:", JSON.stringify(weather, null, 2));

      // 使用 chat session 发送函数响应
      const result2 = await chat.sendMessage([
        {
          functionResponse: {
            name: fc.name,
            response: weather,
          },
        },
      ]);

      console.log("\n🤖 AI 最终回复:", result2.response.text());
    } else {
      console.log("\n❌ Function Calling 未被触发");
      console.log("AI 直接回复:", response.text());
    }
  } catch (error) {
    console.error("❌ 错误:", error);
  }
}

testFunctionCalling();
