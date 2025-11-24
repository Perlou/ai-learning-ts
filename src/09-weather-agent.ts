import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 定义天气工具
const weatherTool = {
  functionDeclarations: [
    {
      name: "get_current_weather",
      description: "获取指定城市的当前天气信息，包括温度、天气状况、湿度等",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: '城市名称，例如"北京"、"上海"、"深圳"',
          },
        },
        required: ["city"],
      },
    },
    {
      name: "get_weather_forecast",
      description: "获取指定城市未来几天的天气预报",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            description: "城市名称",
          },
          days: {
            type: SchemaType.NUMBER,
            description: "预报天数，1-7天",
          },
        },
        required: ["city", "days"],
      },
    },
  ],
};

// 模拟天气数据库
const weatherDatabase = {
  北京: {
    current: {
      temperature: 15,
      condition: "晴天",
      humidity: 45,
      windSpeed: 12,
      airQuality: "良",
    },
    forecast: [
      { day: "明天", temp: "16-25°C", condition: "多云" },
      { day: "后天", temp: "14-22°C", condition: "阴天" },
      { day: "第3天", temp: "12-20°C", condition: "小雨" },
    ],
  },
  上海: {
    current: {
      temperature: 20,
      condition: "多云",
      humidity: 60,
      windSpeed: 8,
      airQuality: "优",
    },
    forecast: [
      { day: "明天", temp: "21-27°C", condition: "晴天" },
      { day: "后天", temp: "22-28°C", condition: "晴天" },
      { day: "第3天", temp: "20-26°C", condition: "多云" },
    ],
  },
  深圳: {
    current: {
      temperature: 28,
      condition: "阴天",
      humidity: 75,
      windSpeed: 15,
      airQuality: "良",
    },
    forecast: [
      { day: "明天", temp: "27-32°C", condition: "阴天" },
      { day: "后天", temp: "26-31°C", condition: "小雨" },
      { day: "第3天", temp: "25-30°C", condition: "中雨" },
    ],
  },
};

// 获取当前天气
function getCurrentWeather(city: string) {
  const data = weatherDatabase[city as keyof typeof weatherDatabase];
  if (!data) {
    return { error: `抱歉，我没有${city}的天气数据` };
  }
  return data.current;
}

// 获取天气预报
function getWeatherForecast(city: string, days: number) {
  const data = weatherDatabase[city as keyof typeof weatherDatabase];
  if (!data) {
    return { error: `抱歉，我没有${city}的天气数据` };
  }
  return data.forecast.slice(0, Math.min(days, 3));
}

// 执行函数
function executeFunction(functionCall: any) {
  const { name, args } = functionCall;

  console.log(`\n🔧 [调用工具] ${name}`);
  console.log(`📝 [参数] ${JSON.stringify(args, null, 2)}`);

  let result;
  switch (name) {
    case "get_current_weather":
      result = getCurrentWeather(args.city);
      break;
    case "get_weather_forecast":
      result = getWeatherForecast(args.city, args.days);
      break;
    default:
      result = { error: `未知函数: ${name}` };
  }

  console.log(`✅ [返回] ${JSON.stringify(result, null, 2)}`);
  return result;
}

async function weatherAgent() {
  console.log("=== 🌤️  天气助手 Agent ===\n");
  console.log("这是一个实用的天气助手，支持：");
  console.log("- 查询当前天气");
  console.log("- 查询未来天气预报");
  console.log("- 基于天气给出穿衣建议\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: [weatherTool] as any,
  });

  const chat = model.startChat({
    history: [],
  });

  // 模拟用户对话
  const conversations = [
    "北京今天天气怎么样？",
    "温度适合穿什么衣服？",
    "那未来3天呢？会下雨吗？",
    "对比一下上海和深圳的天气",
  ];

  for (const userMessage of conversations) {
    console.log("=".repeat(60));
    console.log(`👤 [用户]: ${userMessage}\n`);

    let result = await chat.sendMessage(userMessage);
    let response = result.response;

    // 处理可能的多轮函数调用
    const functionCalls = (response as any).functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      // 执行所有函数调用
      const functionResponses = functionCalls.map((fc: any) => {
        const functionResult = executeFunction(fc);
        return {
          functionResponse: {
            name: fc.name,
            response: functionResult,
          },
        };
      });

      // 发送函数结果
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    console.log(`\n🤖 [天气助手]: ${response.text()}`);
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("\n💡 关键特性：");
  console.log("1. ✅ 多轮对话 - 基于上下文回答问题");
  console.log("2. ✅ 智能推理 - 根据温度给穿衣建议");
  console.log("3. ✅ 工具组合 - 对比不同城市需要多次调用");
  console.log("4. ✅ 自然交互 - 像真人助手一样对话");
}

weatherAgent().catch(console.error);
