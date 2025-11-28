# 第 1-2 阶段测验：LLM 基础与提示词工程

> **测验说明**：本测验包含选择题、填空题和实践题，帮助你检验对本阶段内容的掌握程度。

---

## 第一部分：LLM 基础概念（30 分）

### 1. 单选题（每题 3 分，共 15 分）

**1.1** LLM（大语言模型）的本质是什么？

- A. 一个存储了所有知识的数据库
- B. 一个下一个词元预测引擎
- C. 一个具有真正理解能力的智能系统
- D. 一个简单的关键词匹配系统

<details>
<summary>点击查看答案</summary>

**答案：B**

**解释**：LLM 是基于统计规律的下一个词元预测引擎，通过训练数据学习语言模式，而不是真正"理解"或"知道"知识。

</details>

---

**1.2** 关于 Token（词元），以下说法正确的是？

- A. 1 个 英文单词 = 1 个 Token
- B. 1 个 中文字符 = 1 个 Token
- C. Token 是 LLM 处理的最小单位
- D. Token 数量不影响 API 成本

<details>
<summary>点击查看答案</summary>

**答案：C**

**解释**：Token 是 LLM 的最小处理单位。英文约 1 Token ≈ 0.75 个单词，中文约 0.5-1 个字，且 Token 数量直接影响 API 成本。

</details>

---

**1.3** LLM 的"幻觉（Hallucination）"是指什么？

- A. LLM 理解错误用户的意图
- B. LLM 自信地编造不存在的事实
- C. LLM 无法回答问题
- D. LLM 输出的内容太长

<details>
<summary>点击查看答案</summary>

**答案：B**

**解释**：幻觉是 LLM 基于概率生成的特性导致的，它可能会自信地输出看似合理但实际不真实的信息。

</details>

---

**1.4** 关于 Context（上下文）管理，以下做法正确的是？

- A. LLM 会自动记住之前所有的对话
- B. 只需发送当前问题，不需要历史对话
- C. 需要在每次请求中包含完整的对话历史
- D. Context Window 越大越好，没有任何限制

<details>
<summary>点击查看答案</summary>

**答案：C**

**解释**：LLM API 是无状态的，不会自动记住历史。需要显式传递对话历史作为上下文。Context Window 虽然越大越好，但会影响成本和速度。

</details>

---

**1.5** 在 Gemini SDK 中，以下哪个方法用于启动一个可管理历史的对话会话？

- A. `model.generateContent()`
- B. `model.startChat()`
- C. `model.createSession()`
- D. `model.beginConversation()`

<details>
<summary>点击查看答案</summary>

**答案：B**

**解释**：`startChat()` 方法会创建一个聊天会话，自动管理对话历史。

</details>

---

### 2. 判断题（每题 3 分，共 15 分）

**2.1** LLM 的准确性取决于训练数据的质量和数量。

<details>
<summary>点击查看答案</summary>

**答案：正确（✅）**

**解释**：LLM 通过学习训练数据来生成文本，训练数据的质量和覆盖范围直接影响模型的能力。

</details>

---

**2.2** Context Window 指的是用户一次可以输入的最大字符数。

<details>
<summary>点击查看答案</summary>

**答案：错误（❌）**

**解释**：Context Window 是指模型一次能处理的最大 Token 数量，包括输入和输出，不仅仅是输入。

</details>

---

**2.3** 在多轮对话中，旧的对话历史会永久保留在模型中。

<details>
<summary>点击查看答案</summary>

**答案：错误（❌）**

**解释**：旧对话只在你显式传递的历史中保留，并且会占用 Context Window。如果历史太长，需要截断或总结。

</details>

---

**2.4** 使用 `dotenv` 包可以安全地管理 API 密钥等敏感信息。

<details>
<summary>点击查看答案</summary>

**答案：正确（✅）**

**解释**：将 API 密钥存储在 `.env` 文件中，并确保 `.gitignore` 包含 `.env`，可以避免密钥泄露。

</details>

---

**2.5** 异步函数（async/await）是 TypeScript/JavaScript 中处理 LLM API 调用的推荐方式。

<details>
<summary>点击查看答案</summary>

**答案：正确（✅）**

**解释**：LLM API 调用通常需要等待网络响应，使用 async/await 可以避免阻塞代码执行。

</details>

---

## 第二部分：提示词工程（40 分）

### 3. 单选题（每题 4 分，共 20 分）

**3.1** 提示词工程的三大核心原则是？

- A. 简洁、清晰、完整
- B. Context、Role、Constraints
- C. 输入、处理、输出
- D. 问题、答案、验证

<details>
<summary>点击查看答案</summary>

**答案：B**

**解释**：Context（上下文）、Role（角色）、Constraints（约束）是提示词工程的三大黄金原则。

</details>

---

**3.2** 以下哪个提示词包含了明确的"角色"设定？

- A. "写一篇关于 AI 的文章"
- B. "你是一位资深的 AI 研究员，请写一篇关于 AI 的文章"
- C. "用 300 字写一篇关于 AI 的文章"
- D. "为初学者写一篇关于 AI 的文章"

<details>
<summary>点击查看答案</summary>

**答案：B**

**解释**：选项 B 明确指定了角色"资深的 AI 研究员"，这会影响 AI 的输出风格和专业程度。

</details>

---

**3.3** Chain of Thought（CoT）最适合用于以下哪种场景？

- A. 简单的事实性问题
- B. 创意写作
- C. 数学计算和逻辑推理
- D. 随机聊天

<details>
<summary>点击查看答案</summary>

**答案：C**

**解释**：CoT 通过展示推理步骤来提高复杂问题的准确性，最适合需要逻辑推理的任务。

</details>

---

**3.4** 要触发 Chain of Thought，以下哪个提示词最有效？

- A. "快速回答这个问题"
- B. "简洁地说明答案"
- C. "让我们一步步思考"
- D. "直接给出结论"

<details>
<summary>点击查看答案</summary>

**答案：C**

**解释**："让我们一步步思考"是触发 CoT 的经典关键词，会引导模型展示推理过程。

</details>

---

**3.5** 要获得 JSON 格式的输出，以下做法最不推荐的是？

- A. 在提示词中明确要求"纯 JSON，不要任何额外说明"
- B. 提供 JSON 结构示例
- C. 让 AI 自由发挥，稍后再解析
- D. 使用 TypeScript 接口定义预期结构

<details>
<summary>点击查看答案</summary>

**答案：C**

**解释**：让 AI 自由发挥容易导致输出格式不可控，应该明确指定 JSON 格式和结构。

</details>

---

### 4. 实践题（20 分）

**4.1 改进提示词（10 分）**

以下是一个糟糕的提示词：

```
"帮我写代码"
```

请改写成一个优秀的提示词，包含：

- [ ] Context（上下文）
- [ ] Role（角色）
- [ ] Constraints（约束）

<details>
<summary>点击查看参考答案</summary>

**参考答案**：

```
你是一位拥有 10 年经验的资深 TypeScript 开发者。

请编写一个 TypeScript 函数，用于计算两个日期之间的天数差。

要求：
- 使用 Date 对象
- 包含完整的类型注解
- 添加 JSDoc 注释
- 处理边界情况（如日期无效）
- 返回绝对值（天数差始终为正数）

输出格式：纯代码，包含注释即可。
```

**评分标准**：

- Context：4 分（明确任务目标、技术栈）
- Role：3 分（指定专业角色）
- Constraints：3 分（明确代码要求、输出格式）
</details>

---

**4.2 设计 CoT 提示词（10 分）**

为以下数学问题设计一个包含 Chain of Thought 的提示词：

**问题**：一个班级有 40 名学生，其中 60% 是女生。如果新转入 5 名男生，现在班级中男生占比是多少？

请写出完整的提示词：

<details>
<summary>点击查看参考答案</summary>

**参考答案**：

```
请解决以下数学问题，并一步步展示你的计算过程：

问题：一个班级有 40 名学生，其中 60% 是女生。
如果新转入 5 名男生，现在班级中男生占比是多少？

要求：
1. 列出每一步的计算公式和结果
2. 明确标注中间变量
3. 最后给出百分比形式的答案（保留 2 位小数）
```

**评分标准**：

- 明确要求展示步骤：4 分
- 指定输出格式：3 分
- 清晰的任务描述：3 分
</details>

---

## 第三部分：代码理解（30 分）

### 5. 代码分析题

**5.1 分析以下代码（15 分）**

```typescript
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "我是一个 TypeScript 初学者" }],
    },
    {
      role: "model",
      parts: [{ text: "欢迎！我会用简单易懂的方式帮助你。" }],
    },
  ],
  generationConfig: {
    maxOutputTokens: 500,
  },
});

await chat.sendMessage("什么是接口（Interface）？");
```

**问题**：

1. 这段代码做了什么？（5 分）
2. `history` 参数的作用是什么？（5 分）
3. `maxOutputTokens` 的作用是什么？（5 分）

<details>
<summary>点击查看答案</summary>

**答案**：

1. **代码功能**（5 分）：

   - 启动了一个聊天会话
   - 设置了初始对话历史（用户说明自己是初学者，AI 回应会用简单方式解释）
   - 限制了输出的最大 Token 数为 500
   - 发送了一个关于 TypeScript 接口的问题

2. **history 的作用**（5 分）：

   - 提供对话上下文，让 AI 知道用户是初学者
   - AI 会根据这个上下文调整回答风格（使用简单易懂的语言）
   - 后续的 `sendMessage` 会继续基于这个历史

3. **maxOutputTokens 的作用**（5 分）：
   - 限制 AI 单次回复的最大 Token 数量
   - 防止回复过长，控制成本
   - 500 tokens 大约相当于 300-400 个中文字
   </details>

---

**5.2 找出代码问题（15 分）**

以下代码尝试获取 JSON 输出，但可能有问题：

```typescript
const prompt = `提取以下文本的关键信息：

文本：张三在2024年3月15日参加了北京的技术大会。

输出 JSON 格式。`;

const result = await model.generateContent(prompt);
const text = result.response.text();
const data = JSON.parse(text);
console.log(data.person);
```

**问题**：

1. 这段代码有什么潜在问题？（8 分）
2. 如何改进？（7 分）

<details>
<summary>点击查看答案</summary>

**答案**：

1. **潜在问题**（8 分）：

   - 提示词不够明确（没有指定 JSON 结构）
   - AI 可能输出额外的说明文字，导致 `JSON.parse` 失败
   - 没有 try-catch 处理解析错误
   - 没有验证 JSON 是否包含预期字段

2. **改进方案**（7 分）：

```typescript
interface ExtractedData {
  person: string;
  date: string;
  location: string;
  event: string;
}

const prompt = `从以下文本中提取关键信息，并以 JSON 格式输出：

文本：张三在2024年3月15日参加了北京的技术大会。

要求输出格式（纯 JSON，不要任何额外说明）：
{
  "person": "人名",
  "date": "日期",
  "location": "地点",
  "event": "事件"
}`;

const result = await model.generateContent(prompt);
const text = result.response.text().trim();

try {
  const data: ExtractedData = JSON.parse(text);
  console.log(data.person); // "张三"
} catch (error) {
  console.error("JSON 解析失败:", text);
}
```

**改进要点**：

- ✅ 明确要求"纯 JSON"
- ✅ 提供具体的 JSON 结构
- ✅ 使用 TypeScript 接口
- ✅ 添加 try-catch 错误处理
- ✅ 使用 `trim()` 去除多余空格
</details>

---

## 评分标准

- **90-100 分**：优秀！完全掌握了本阶段内容
- **75-89 分**：良好，对核心概念理解扎实
- **60-74 分**：及格，建议复习薄弱环节
- **60 分以下**：需要重新学习本阶段内容

---

## 📝 学习建议

根据你的测验结果：

**如果错误较多**：

1. 重新阅读 [SUMMARY.md](./SUMMARY.md)
2. 运行每个代码示例，理解执行过程
3. 尝试修改代码参数，观察变化

**如果表现良好**：

1. 尝试自己编写不同场景的提示词
2. 实践：构建一个小项目（如个人知识问答助手）
3. 进入 [第 3 阶段](../phase-3-embeddings-rag/README.md) 继续学习

---

**完成测验后，恭喜你！** 🎉

你已经具备了扎实的 LLM 基础知识和提示词工程能力，可以开始构建实际的 AI 应用了！
