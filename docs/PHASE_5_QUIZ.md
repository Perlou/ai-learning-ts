# Phase 5: Agents & Function Calling - 自测题

## 📝 使用说明

完成以下测试来检验你对 Agents 和 Function Calling 的掌握程度。建议先独立完成，然后再查看答案。

---

## 第一部分：概念理解（选择题）

### 1. AI Agent 与传统 LLM 的最核心区别是什么？

A. AI Agent 的模型参数更多  
B. AI Agent 可以调用外部工具和执行操作  
C. AI Agent 的回答速度更快  
D. AI Agent 的训练数据更新

<details>
<summary>查看答案</summary>

**答案：B**

**解析：**
AI Agent 的核心突破是 **Function Calling（函数调用）** 能力，让 AI 从"被动回答"进化为"主动行动"：

- ✅ 可以调用 API 获取实时数据
- ✅ 可以执行操作（发邮件、创建任务）
- ✅ 可以访问数据库
- ✅ 可以使用各种工具

传统 LLM 只能基于训练数据对话，无法主动获取新信息或执行操作。

</details>

---

### 2. Function Calling 的完整流程有几个步骤？

A. 3 步  
B. 5 步  
C. 7 步  
D. 10 步

<details>
<summary>查看答案</summary>

**答案：C**

**7 个步骤：**

1. 定义工具
2. 用户提问
3. AI 判断是否需要工具
4. AI 生成函数调用请求（含参数）
5. 程序执行实际函数
6. 将结果返回给 AI
7. AI 基于结果生成最终回答

记住这个流程非常重要，因为你需要在代码中实现步骤 5 和 6！

</details>

---

### 3. 工具定义中，哪个字段最重要，决定了 AI 何时调用这个工具？

A. `name`（函数名）  
B. `description`（功能描述）  
C. `parameters`（参数定义）  
D. `required`（必需参数）

<details>
<summary>查看答案</summary>

**答案：B**

**`description` 极其重要！**

AI 主要通过 `description` 来决定何时调用工具：

**❌ 糟糕的描述：**

```typescript
description: "获取数据"; // 太模糊
```

**✅ 优秀的描述：**

```typescript
description: "获取指定城市的实时天气信息，包括温度、天气状况、湿度等";
```

清晰具体的描述能显著提高 AI 选择正确工具的准确率。

</details>

---

### 4. 在 Gemini API 中，如何正确访问 Function Call？

A. `response.functionCalls[0]`  
B. `response.functions[0]`  
C. `response.candidates[0].content.parts.find(p => p.functionCall)`  
D. `response.tools[0]`

<details>
<summary>查看答案</summary>

**答案：C**

**正确访问方式：**

```typescript
const candidate = response.candidates?.[0];
const parts = candidate?.content?.parts || [];
const functionCallPart = parts.find((part) => part.functionCall);

if (functionCallPart?.functionCall) {
  const fc = functionCallPart.functionCall;
  // fc.name, fc.args
}
```

这是我们调试时发现的重要知识点！Function Call 存储在 `parts` 数组中，而不是独立的属性。

</details>

---

## 第二部分：判断题（对错分析）

### 5. 判断：Function Calling 时，AI 总是会选择正确的工具和参数。

<details>
<summary>查看答案</summary>

**错误 ❌**

**AI 不保证 100%正确！**

可能出现的错误：

- 选错工具
- 提取错误的参数
- 理解错用户意图

**最佳实践：**

```typescript
function executeFunction(fc: any) {
  // 1. 验证函数名
  if (!ALLOWED_FUNCTIONS.includes(fc.name)) {
    return { error: "未知函数" };
  }

  // 2. 验证参数
  if (!isValidCity(fc.args.city)) {
    return { error: "无效的城市名" };
  }

  // 3. 错误处理
  try {
    return actualFunction(fc.args);
  } catch (error) {
    return { error: error.message };
  }
}
```

对于重要操作（如删除数据、发送邮件），**必须添加确认机制**！

</details>

---

### 6. 判断：使用 Function Calling 不会增加 API 调用成本。

<details>
<summary>查看答案</summary>

**错误 ❌**

**Function Calling 会增加成本！**

**原因：**

1. **多轮对话**：每次工具调用都需要额外的 API 请求

```
用户提问 → API调用1（AI决定调用工具）
         → 执行工具
         → API调用2（AI生成最终回答）
```

2. **复杂任务**：可能需要多个工具

```
"对比北京和上海天气"
→ get_weather("北京")
→ get_weather("上海")
→ 综合回答
```

**成本控制建议：**

- 限制单次对话的工具调用次数
- 监控和记录工具使用情况
- 对非关键任务使用缓存
</details>

---

### 7. 判断：在发送 Function Response 时，可以同时发送文本和 functionResponse。

<details>
<summary>查看答案</summary>

**错误 ❌**

**这是一个重要的 API 限制！**

Gemini API 规定：

> "Within a single message, FunctionResponse cannot be mixed with other type of part"

**❌ 错误做法：**

```typescript
await model.generateContent([
  { text: prompt },           // ← 不能混合
  { functionResponse: {...} }
]);
```

**✅ 正确做法（使用 Chat Session）：**

```typescript
const chat = model.startChat();
await chat.sendMessage(prompt); // 第1次
await chat.sendMessage([
  {
    // 第2次：只发送 functionResponse
    functionResponse: {
      name: fc.name,
      response: result,
    },
  },
]);
```

</details>

---

## 第三部分：实践应用（编程题）

### 8. 编写工具定义

**任务：** 为一个"发送邮件"功能编写完整的工具定义。

**要求：**

- 函数名：`send_email`
- 参数：收件人(to)、主题(subject)、内容(body)
- 使用 SchemaType
- 包含清晰的描述

<details>
<summary>查看参考答案</summary>

```typescript
import { SchemaType } from "@google/generative-ai";

const emailTool = {
  functionDeclarations: [
    {
      name: "send_email",
      description:
        "发送电子邮件给指定收件人，适用于需要通知、提醒或分享信息的场景",
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          to: {
            type: SchemaType.STRING,
            description: '收件人邮箱地址，例如 "user@example.com"',
          },
          subject: {
            type: SchemaType.STRING,
            description: "邮件主题，简明扼要地描述邮件内容",
          },
          body: {
            type: SchemaType.STRING,
            description: "邮件正文内容",
          },
        },
        required: ["to", "subject", "body"],
      },
    },
  ],
};
```

**关键点：**

- ✅ description 清晰说明用途
- ✅ 每个参数都有详细描述
- ✅ 标记必需参数
- ✅ 使用 SchemaType 枚举
</details>

---

### 9. 处理 Function Call

**任务：** 编写代码处理 AI 返回的 Function Call。

**场景：** 已收到 response，需要检查并执行 function call。

<details>
<summary>查看参考答案</summary>

```typescript
async function handleFunctionCall(response: any, chat: ChatSession) {
  // 1. 正确访问 function call
  const candidate = response.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const functionCallPart = parts.find((part: any) => part.functionCall);

  // 2. 检查是否有 function call
  if (!functionCallPart?.functionCall) {
    // 没有function call，直接返回文本
    return response.text();
  }

  const fc = functionCallPart.functionCall;
  console.log(`🔧 调用工具: ${fc.name}`);
  console.log(`📝 参数:`, fc.args);

  // 3. 执行实际函数
  let result;
  try {
    result = await executeFunction(fc.name, fc.args);
  } catch (error) {
    result = { error: error.message };
  }

  // 4. 发送结果回AI
  const result2 = await chat.sendMessage([
    {
      functionResponse: {
        name: fc.name,
        response: result,
      },
    },
  ]);

  // 5. 返回最终回答
  return result2.response.text();
}

// 使用
const chat = model.startChat();
const response = await chat.sendMessage("北京天气");
const answer = await handleFunctionCall(response, chat);
console.log(answer);
```

**要点：**

- ✅ 从 parts 中查找 functionCall
- ✅ 错误处理
- ✅ 使用 chat session 发送响应
- ✅ 返回最终答案
</details>

---

### 10. 多工具协作

**场景：** 用户问："如果我在纽约的会议是明天下午 3 点，北京时间是几点？我需要提前 2 小时准备，那是北京时间几点？"

**任务：** 设计需要哪些工具，并说明 AI 应该如何调用它们。

<details>
<summary>查看参考答案</summary>

**需要的工具：**

```typescript
const tools = [
  {
    functionDeclarations: [
      {
        name: "convert_timezone",
        description: "转换时区，将一个时区的时间转换为另一个时区",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            time: { type: SchemaType.STRING, description: '时间，如"15:00"' },
            from_tz: {
              type: SchemaType.STRING,
              description: '源时区，如"America/New_York"',
            },
            to_tz: {
              type: SchemaType.STRING,
              description: '目标时区，如"Asia/Shanghai"',
            },
          },
          required: ["time", "from_tz", "to_tz"],
        },
      },
      {
        name: "calculate_time_offset",
        description: "计算时间偏移，在指定时间基础上加减小时",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            base_time: { type: SchemaType.STRING, description: "基础时间" },
            offset_hours: {
              type: SchemaType.NUMBER,
              description: "偏移小时数，负数表示提前",
            },
          },
          required: ["base_time", "offset_hours"],
        },
      },
    ],
  },
];
```

**AI 的执行流程：**

```
1. convert_timezone("15:00", "America/New_York", "Asia/Shanghai")
   → 结果：次日凌晨3点

2. calculate_time_offset("03:00", -2)
   → 结果：凌晨1点

3. 回答用户："北京时间次日凌晨1点"
```

**关键点：**

- 🎯 任务分解：复杂问题分解为多个工具调用
- 🔄 顺序执行：第二步依赖第一步的结果
- 💡 清晰命名：工具名和描述要让 AI 理解用途
</details>

---

## 第四部分：安全与最佳实践

### 11. 安全问题

**场景：** 你正在构建一个 AI 助手，可以管理用户的文件。以下哪些做法是安全的？

A. 允许 AI 调用 `delete_file(path)` 删除任意文件  
B. 所有文件操作都需要用户确认  
C. 限制 AI 只能操作特定目录  
D. 记录所有工具调用的日志

<details>
<summary>查看答案</summary>

**正确答案：B, C, D**

**安全最佳实践：**

**1. 用户确认机制**

```typescript
async function deleteFile(path: string, userConfirmed: boolean) {
  if (!userConfirmed) {
    return {
      requiresConfirmation: true,
      message: `确定要删除 ${path} 吗？`,
    };
  }
  // 执行删除...
}
```

**2. 权限限制**

```typescript
const ALLOWED_DIRS = ["/user/documents", "/user/downloads"];

function isPathAllowed(path: string): boolean {
  return ALLOWED_DIRS.some((dir) => path.startsWith(dir));
}
```

**3. 操作日志**

```typescript
function logToolCall(functionName: string, args: any, result: any) {
  logger.info({
    timestamp: new Date(),
    function: functionName,
    arguments: args,
    result: result,
    userId: currentUser.id,
  });
}
```

**4. 敏感操作白名单**

```typescript
const SAFE_FUNCTIONS = ["read_file", "list_files"];
const DANGEROUS_FUNCTIONS = ["delete_file", "modify_file"];

if (DANGEROUS_FUNCTIONS.includes(fc.name)) {
  // 需要额外验证
}
```

</details>

---

## 评分标准

- **9-11 题正确**：优秀！完全掌握了 Agents 和 Function Calling 🎉
- **6-8 题正确**：良好！理解了核心概念 👍
- **3-5 题正确**：及格！需要复习部分内容 📚
- **0-2 题正确**：建议重新学习 Phase 5 💪

---

## 💡 核心要点回顾

完成测验后，记住这些关键点：

### Function Calling 三要素

1. **工具定义** - description 是灵魂
2. **调用处理** - 从 parts 中提取 functionCall
3. **响应返回** - 使用 chat session，不混合类型

### 安全三原则

1. **验证** - 检查函数名和参数
2. **确认** - 敏感操作需要用户确认
3. **日志** - 记录所有操作

### 实用技巧

- 使用 SchemaType 枚举而不是字符串
- 避免复杂的 enum（特别是 NUMBER 类型）
- 多工具时注意调用顺序
- 错误要优雅处理

祝你学习顺利！🚀

**下一步：** 完成测验后，可以尝试构建你自己的 Agent！
