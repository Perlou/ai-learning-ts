import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 定义工具：天气查询和计算器
const tools = [
  {
    functionDeclarations: [
      {
        name: "get_weather",
        description: "获取指定城市的实时天气信息",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            city: {
              type: SchemaType.STRING,
              description: '城市名称，例如"北京"、"上海"',
            },
          },
          required: ["city"],
        },
      },
      {
        name: "calculator",
        description: "执行数学计算",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            expression: {
              type: SchemaType.STRING,
              description: '数学表达式，例如"2 + 3"、"10 * 5"',
            },
          },
          required: ["expression"],
        },
      },
    ],
  },
];

// 模拟天气API
function getWeather(city: string) {
  const weatherData: Record<string, any> = {
    北京: { temperature: 15, condition: "晴天", humidity: 45 },
    上海: { temperature: 20, condition: "多云", humidity: 60 },
    深圳: { temperature: 28, condition: "阴天", humidity: 75 },
  };

  return (
    weatherData[city] || {
      temperature: 18,
      condition: "未知",
      humidity: 50,
    }
  );
}

// 简单计算器
function calculator(expression: string): number {
  try {
    // 注意：eval有安全风险，这里仅用于演示
    // 生产环境应使用安全的数学表达式解析器
    return eval(expression);
  } catch (error) {
    throw new Error(`计算错误: ${error}`);
  }
}

// 执行函数调用
function executeFunction(functionCall: any) {
  const { name, args } = functionCall;

  console.log(`\n🔧 [函数调用] ${name}`);
  console.log(`📝 [参数] ${JSON.stringify(args, null, 2)}`);

  let result;
  switch (name) {
    case "get_weather": {
      const weatherData = getWeather(args.city);
      result = { data: weatherData };
      break;
    }
    case "calculator": {
      const calcResult = calculator(args.expression);
      result = { result: calcResult };
      break;
    }
    default:
      result = { error: `Unknown function: ${name}` };
  }

  console.log(`✅ [返回值] ${JSON.stringify(result, null, 2)}`);
  return result;
}

async function chatWithTools() {
  console.log("=== Function Calling 基础示例 ===\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: tools as any,
  });

  const chat = model.startChat();

  // 测试用例
  const queries = [
    "北京今天天气怎么样？",
    "如果温度是15度，转换成华氏度是多少？（公式：F = C * 9/5 + 32）",
    "上海和深圳哪个城市更暖和？",
  ];

  for (const query of queries) {
    console.log("\n" + "=".repeat(60));
    console.log(`👤 [用户]: ${query}\n`);

    let result = await chat.sendMessage(query);
    let response = result.response;

    // 处理函数调用
    const functionCalls = (response as any).functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];

      // 执行实际函数
      const functionResponse = executeFunction(functionCall);

      // 将函数结果返回给模型
      result = await chat.sendMessage([
        {
          functionResponse: {
            name: functionCall.name,
            response: functionResponse,
          },
        },
      ]);

      response = result.response;
    }

    // 显示最终回答
    console.log(`\n🤖 [AI]: ${response.text()}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 观察要点：");
  console.log("1. AI自动判断何时需要调用工具");
  console.log("2. AI从用户问题中提取正确的参数");
  console.log("3. AI可以基于工具返回值进行推理");
  console.log("4. 支持多轮对话和上下文理解");
}

chatWithTools().catch(console.error);
