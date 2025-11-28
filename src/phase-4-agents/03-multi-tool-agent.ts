import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY not found in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

// 定义多个工具
const multiTools = {
  functionDeclarations: [
    {
      name: "calculator",
      description: "执行数学计算，支持基本四则运算",
      parameters: {
        type: "object",
        properties: {
          expression: {
            type: "string",
            description: '数学表达式，例如"2 + 3 * 5"、"100 / 4"',
          },
        },
        required: ["expression"],
      },
    },
    {
      name: "get_current_time",
      description: "获取当前时间或指定时区的时间",
      parameters: {
        type: "object",
        properties: {
          timezone: {
            type: "string",
            description: '时区，例如"Asia/Shanghai"、"America/New_York"',
            enum: [
              "Asia/Shanghai",
              "America/New_York",
              "Europe/London",
              "Asia/Tokyo",
            ],
          },
        },
        required: ["timezone"],
      },
    },
    {
      name: "convert_units",
      description: "单位转换工具，支持温度、长度、重量等",
      parameters: {
        type: "object",
        properties: {
          value: {
            type: "number",
            description: "要转换的数值",
          },
          from_unit: {
            type: "string",
            description: "源单位",
            enum: ["celsius", "fahrenheit", "meter", "feet", "kg", "lb"],
          },
          to_unit: {
            type: "string",
            description: "目标单位",
            enum: ["celsius", "fahrenheit", "meter", "feet", "kg", "lb"],
          },
        },
        required: ["value", "from_unit", "to_unit"],
      },
    },
    {
      name: "search_info",
      description: "模拟搜索引擎，查询知识库信息",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "搜索关键词",
          },
        },
        required: ["query"],
      },
    },
  ],
};

// 工具实现
function calculator(expression: string): number {
  try {
    // 注意：eval有安全风险，仅用于演示
    const result = eval(expression);
    return result;
  } catch (error) {
    throw new Error(`计算错误: ${expression}`);
  }
}

function getCurrentTime(timezone: string): string {
  const timezones: Record<string, string> = {
    "Asia/Shanghai": "2024-03-15 14:30:00 (UTC+8)",
    "America/New_York": "2024-03-15 02:30:00 (UTC-4)",
    "Europe/London": "2024-03-15 06:30:00 (UTC+0)",
    "Asia/Tokyo": "2024-03-15 15:30:00 (UTC+9)",
  };
  return timezones[timezone] || "未知时区";
}

function convertUnits(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, (v: number) => number>> = {
    celsius: {
      fahrenheit: (v) => (v * 9) / 5 + 32,
    },
    fahrenheit: {
      celsius: (v) => ((v - 32) * 5) / 9,
    },
    meter: {
      feet: (v) => v * 3.28084,
    },
    feet: {
      meter: (v) => v / 3.28084,
    },
    kg: {
      lb: (v) => v * 2.20462,
    },
    lb: {
      kg: (v) => v / 2.20462,
    },
  };

  return conversions[fromUnit]?.[toUnit]?.(value) ?? value;
}

function searchInfo(query: string): string {
  const knowledgeBase: Record<string, string> = {
    北京人口: "北京市常住人口约2170万人（2023年数据）",
    埃菲尔铁塔高度: "埃菲尔铁塔高度为330米（含天线）",
    光速: "光速约为299,792,458米/秒",
    typescript: "TypeScript是微软开发的JavaScript超集，添加了类型系统",
  };

  const key = Object.keys(knowledgeBase).find((k) => query.includes(k));
  return key ? (knowledgeBase[key] as any) : `未找到关于"${query}"的信息`;
}

// 执行函数
function executeFunction(functionCall: any) {
  const { name, args } = functionCall;

  console.log(`\n🔧 [工具调用] ${name}`);
  console.log(`📝 [参数] ${JSON.stringify(args, null, 2)}`);

  let result;
  switch (name) {
    case "calculator":
      result = { result: calculator(args.expression) };
      break;
    case "get_current_time":
      result = { time: getCurrentTime(args.timezone) };
      break;
    case "convert_units":
      result = {
        result: convertUnits(args.value, args.from_unit, args.to_unit),
      };
      break;
    case "search_info":
      result = { answer: searchInfo(args.query) };
      break;
    default:
      result = { error: `未知工具: ${name}` };
  }

  console.log(`✅ [结果] ${JSON.stringify(result, null, 2)}`);
  return result;
}

async function multiToolAgent() {
  console.log("=== 🤖 多工具智能助手 ===\n");
  console.log("可用工具：");
  console.log("- 🧮 计算器（数学运算）");
  console.log("- 🕐 时间查询（多时区）");
  console.log("- 🔄 单位转换（温度、长度、重量）");
  console.log("- 🔍 知识搜索（模拟）\n");

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    tools: [multiTools] as any,
  });

  const chat = model.startChat();

  // 复杂的多步骤任务
  const tasks = [
    "计算一下 (125 + 75) * 3 等于多少？",
    "如果纽约现在是上午10点，那北京是几点？",
    "25摄氏度等于多少华氏度？",
    "综合任务：如果我在上海买了100米布料，重50公斤，运到纽约。请告诉我：1) 布料是多少英尺？2) 重量是多少磅？3) 现在纽约几点？",
  ];

  for (const task of tasks) {
    console.log("=".repeat(60));
    console.log(`👤 [用户]: ${task}\n`);

    let result = await chat.sendMessage(task);
    let response = result.response;

    // 正确访问 function calls（从 parts 中）
    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    // 提取所有 function calls
    const functionCallParts = parts.filter((part: any) => part.functionCall);

    if (functionCallParts.length > 0) {
      console.log(`\n[AI决定] 调用 ${functionCallParts.length} 个工具\n`);

      const functionResponses = functionCallParts.map((part: any) => {
        const fc = part.functionCall;
        const functionResult = executeFunction(fc);
        return {
          functionResponse: {
            name: fc.name,
            response: functionResult,
          },
        };
      });

      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    console.log(`\n🤖 [助手]: ${response.text()}`);
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("\n💡 高级特性展示：");
  console.log("1. ✅ 任务规划 - AI自主决定使用哪些工具");
  console.log("2. ✅ 多工具协作 - 一个任务调用多个工具");
  console.log("3. ✅ 智能推理 - 基于工具结果进行计算和分析");
  console.log("4. ✅ 上下文理解 - 理解复杂的多步骤需求");
  console.log("\n🎯 实际应用价值：");
  console.log("- 数据分析助手（计算 + 查询 + 可视化）");
  console.log("- 智能客服（查订单 + 退款 + 发货）");
  console.log("- 个人助理（日程 + 提醒 + 邮件）");
}

multiToolAgent().catch(console.error);
