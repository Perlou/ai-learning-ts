# 第 5 阶段测验：本地模型运行

> **本测验涵盖 Ollama、本地部署和开源模型的核心知识。**

## 单选题（每题 5 分，共 50 分）

**1.** Ollama 的主要作用是？

- A. 训练新的 LLM
- B. 在本地运行开源 LLM
- C. 提供云端 API
- D. 数据标注

<details><summary>答案</summary>**B** - 在本地运行开源 LLM</details>

**2.** Ollama API 默认端口？

- A. 8080
- B. 3000
- C. 11434
- D. 5000

<details><summary>答案</summary>**C** - 11434</details>

**3.** 7B 模型最低内存需求？

- A. 4 GB
- B. 8 GB
- C. 16 GB
- D. 32 GB

<details><summary>答案</summary>**B** - 8 GB（推荐 16 GB）</details>

**4.** 哪个场景最适合本地模型？

- A. 需要最强能力
- B. 处理敏感数据
- C. 快速原型
- D. 移动应用

<details><summary>答案</summary>**B** - 隐私敏感场景</details>

**5.** 量化的作用？

- A. 减小模型、提升速度
- B. 提升模型能力
- C. 增加功能
- D. 改变模型类型

<details><summary>答案</summary>**A** - 减小模型大小、加快速度</details>

**6.** 中文场景推荐模型？

- A. llama3.2
- B. mistral
- C. qwen2.5:7b
- D. codellama

<details><summary>答案</summary>**C** - qwen2.5:7b 中文能力强</details>

**7.** 本地模型的主要优势？

- A. 隐私保护
- B. 能力最强
- C. 速度最快
- D. 最便宜

<details><summary>答案</summary>**A** - 隐私保护、数据不出本地</details>

**8.** 开源模型 Function Calling 如何实现？

- A. 原生支持
- B. Prompt Engineering
- C. 不支持
- D. 需要重新训练

<details><summary>答案</summary>**B** - 通过精心设计的 Prompt</details>

**9.** GPU 加速的作用？

- A. 显著提升速度
- B. 降低成本
- C. 提升精度
- D. 减小模型

<details><summary>答案</summary>**A** - 显著提升推理速度</details>

**10.** 流式响应的优势？

- A. 节省内存
- B. 实时显示、更好体验
- C. 更准确
- D. 更快完成

<details><summary>答案</summary>**B** - 实时显示生成内容</details>

---

## 代码题（30 分）

**11.** 编写 Ollama API 调用（15 分）

<details><summary>参考答案</summary>

```typescript
async function callOllama(prompt: string): Promise<string> {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      stream: false,
    }),
  });
  const data = await response.json();
  return data.response;
}
```

</details>

**12.** 实现流式响应（15 分）

<details><summary>参考答案</summary>

```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value);
  const data = JSON.parse(chunk);
  process.stdout.write(data.message?.content || "");
}
```

</details>

---

## 场景题（20 分）

**13.** 为公司选择方案（20 分）

场景：处理大量客户咨询，涉及敏感信息。

**问题**：本地部署 vs 云端 API，选哪个？

<details><summary>参考答案</summary>

**推荐：本地部署 + Ollama**

**理由**：

1. 隐私合规：数据不上传
2. 成本：大量调用更省
3. 可控：可定制微调

**实施建议**：

- 模型：qwen2.5:13b
- 硬件：32GB+ 内存服务器
- 优化：构建 RAG 系统
</details>

---

**评分**：90+ 优秀 | 75-89 良好 | 60-74 及格

**完成！** 🎉
