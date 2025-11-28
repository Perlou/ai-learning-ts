# 第 5 阶段学习总结：本地模型运行

> **本阶段目标**：使用 Ollama 在本地运行开源 LLM，理解本地部署与云端 API 的差异

---

## 📚 核心知识点

### 一、为什么需要本地模型？

#### 1.1 本地模型 vs 云端 API

| 维度     | 本地模型 (Ollama)      | 云端 API (Gemini/GPT)     |
| -------- | ---------------------- | ------------------------- |
| **成本** | 免费（除硬件成本）     | 按 Token 计费             |
| **隐私** | 完全私密，数据不出本地 | 数据上传到云端            |
| **速度** | 取决于本地硬件         | 通常更快（专业 GPU 集群） |
| **能力** | 中等（7B-70B 参数）    | 顶尖（GPT-4、Gemini Pro） |
| **部署** | 需要安装配置           | 即用即得                  |
| **网络** | 离线可用               | 必须联网                  |
| **定制** | 可微调训练             | 固定模型                  |
| **并发** | 受限于硬件             | 云端自动扩展              |

#### 1.2 适用场景

**选择本地模型的场景**：

- 🔒 **隐私敏感**：医疗、法律、企业内部文档
- 💰 **成本优化**：大量调用，长期使用
- 🏢 **内网部署**：企业内部，无法访问外网
- 🧪 **研究实验**：模型微调、算法研究
- 🚫 **网络受限**：离线环境、网络不稳定

**选择云端 API 的场景**：

- 🚀 **快速开发**：原型验证、MVP
- 💡 **顶尖能力**：需要最强的理解和生成能力
- 📱 **端侧应用**：移动 App、Web 应用
- 🎯 **小规模**：调用量不大

---

### 二、Ollama 基础

#### 2.1 什么是 Ollama？

**定义**：在本地运行大语言模型的工具，就像 Docker 对容器一样简单。

**核心特性**：

- ✅ 一键下载和运行模型
- ✅ 提供 REST API 接口
- ✅ 支持多种开源模型
- ✅ 自动 GPU 加速
- ✅ 模型版本管理

#### 2.2 核心命令

```bash
# 1. 安装 Ollama
brew install ollama              # macOS
# 或访问 https://ollama.ai 下载

# 2. 启动服务
ollama serve                     # 启动后台服务

# 3. 下载模型
ollama pull llama3.2             # Meta Llama 3.2
ollama pull qwen2.5:7b           # 阿里千问 2.5
ollama pull nomic-embed-text     # Embedding 模型

# 4. 查看已下载模型
ollama list

# 5. 删除模型
ollama rm llama3.2

# 6. 直接对话（终端）
ollama run llama3.2

# 7. 查看模型信息
ollama show llama3.2
```

#### 2.3 推荐模型

**对话模型**：

- `llama3.2` (8B) - Meta 开源，综合性能优秀
- `qwen2.5:7b` - 阿里千问，中文能力强
- `mistral:7b` - 小巧高效，速度快
- `gemma:7b` - Google 开源

**编码模型**：

- `codellama` - 代码生成专用
- `deepseek-coder` - 中文代码优秀

**Embedding 模型**：

- `nomic-embed-text` - 通用文本向量化（768 维）
- `bge-large` - 中文优秀（1024 维）

#### 2.4 模型大小选择

| 参数量 | 内存需求 | 适用场景           | 推荐硬件     |
| ------ | -------- | ------------------ | ------------ |
| 3B     | 4 GB     | 快速响应、资源受限 | 8 GB 内存    |
| 7B     | 8 GB     | 平衡性能和速度     | 16 GB 内存   |
| 13B    | 16 GB    | 更好的理解能力     | 32 GB 内存   |
| 70B    | 64 GB    | 接近云端 API 能力  | 128 GB + GPU |

---

## 💻 代码示例总结

### 示例 1：Ollama 基础调用（01-ollama-basic.ts）

**REST API 调用**：

```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "llama3.2",
    prompt: "解释什么是 AI",
    stream: false, // 非流式响应
  }),
});

const data = await response.json();
console.log(data.response);
```

**要点**：

- Ollama 默认端口：11434
- 使用标准 HTTP 请求
- 支持流式和非流式两种模式

---

### 示例 2：本地对话（02-ollama-chat.ts）

**对话 API**：

```typescript
const messages = [
  { role: "system", content: "你是一个友好的 AI 助手" },
  { role: "user", content: "你好" },
  { role: "assistant", content: "你好！有什么可以帮助你的吗？" },
  { role: "user", content: "介绍一下你自己" },
];

const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  body: JSON.stringify({
    model: "qwen2.5:7b",
    messages: messages,
  }),
});
```

**流式响应处理**：

```typescript
const response = await fetch(url, options);
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const data = JSON.parse(chunk);
  process.stdout.write(data.message.content);
}
```

---

### 示例 3：本地 Embeddings（03-ollama-embeddings.ts）

```typescript
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  const { embedding } = await response.json();
  return embedding; // 768 维向量
}

// 使用
const vec1 = await getEmbedding("Cat");
const vec2 = await getEmbedding("Dog");
const similarity = cosineSimilarity(vec1, vec2);
```

---

### 示例 4：本地 Function Calling（04-ollama-function-calling.ts）

**通过 Prompt Engineering 实现**：

```typescript
const toolsPrompt = `你有以下工具可用：

1. get_weather(city: string) - 获取城市天气
2. calculator(expression: string) - 计算数学表达式

如果需要使用工具，请返回 JSON 格式：
{"tool": "工具名", "arguments": {...}}

否则直接回答问题。`;

const userQuery = "北京今天天气怎么样？";
const fullPrompt = `${toolsPrompt}\n\n用户问题：${userQuery}\n\n你的回答：`;

// LLM 可能返回：
// {"tool": "get_weather", "arguments": {"city": "北京"}}
```

**注意**：

- 开源模型的 Function Calling 不如 GPT/Gemini 稳定
- 需要精心设计 Prompt
- 可能需要多次尝试和优化

---

## 🎯 本地部署最佳实践

### 1. 硬件配置建议

**最低配置**（7B 模型）：

- CPU: 4 核以上
- 内存: 8 GB
- 存储: 10 GB 可用空间

**推荐配置**（13B 模型）：

- CPU: 8 核以上
- 内存: 32 GB
- GPU: NVIDIA RTX 3060 或 M1 Pro
- 存储: 50 GB SSD

### 2. 性能优化

**使用量化模型**：

```bash
# 原始模型（7B约14GB）
ollama pull llama3.2:7b

# 4-bit 量化（约4GB，速度快2-3倍）
ollama pull llama3.2:7b-q4_0

# 8-bit 量化（约7GB，平衡）
ollama pull llama3.2:7b-q8_0
```

**GPU 加速**：

```bash
# 查看 GPU 使用情况
nvidia-smi  # NVIDIA GPU
# 或 Mac 自动使用 Metal

# Ollama 会自动检测并使用 GPU
```

**并发控制**：

```bash
# 设置最大并发数（避免内存溢出）
export OLLAMA_MAX_LOADED_MODELS=2
export OLLAMA_NUM_PARALLEL=4
```

### 3. 模型选择策略

**场景 → 模型映射**：

| 场景       | 推荐模型         | 理由           |
| ---------- | ---------------- | -------------- |
| 中文对话   | qwen2.5:7b       | 中文能力强     |
| 英文对话   | llama3.2         | 综合性能好     |
| 代码生成   | codellama        | 专业优化       |
| 快速响应   | mistral:7b       | 小巧高效       |
| 文档向量化 | nomic-embed-text | 标准 embedding |
| 多语言     | llama3.2         | 支持多种语言   |

---

## 🔄 本地 vs 云端的工作流

### 使用本地模型的完整流程

```mermaid
graph LR
    A[下载模型] --> B[启动 Ollama]
    B --> C[加载模型到内存]
    C --> D[API 调用]
    D --> E[本地推理]
    E --> F[返回结果]
```

**优势**：

- ✅ 数据不离开本地
- ✅ 无网络延迟
- ✅ 无调用次数限制

**劣势**：

- ❌ 首次加载慢（30 秒-2 分钟）
- ❌ 占用本地资源
- ❌ 能力不如顶尖云端模型

---

## ✅ 核心要点

1. **Ollama**：简化本地 LLM 部署，类似 Docker
2. **隐私优先**：适合敏感数据处理
3. **成本权衡**：硬件投入 vs API 费用
4. **性能**：取决于硬件，量化可加速
5. **局限**：开源模型能力不及 GPT-4/Gemini Pro
6. **Function Calling**：需 Prompt Engineering 实现

---

## 📈 下一步学习建议

1. **实践**：
   - 部署到服务器，提供团队使用
   - 尝试不同量化版本，对比性能
2. **优化**：
   - 微调模型以提升特定任务能力
   - 构建本地 RAG 系统
3. **进阶**：
   - 学习模型量化技术（GPTQ、AWQ）
   - 探索 vLLM、TGI 等推理引擎

**恭喜完成第 5 阶段！** 🎉

你已经掌握了本地模型部署，可以在隐私和成本之间做出明智选择！

👉 **下一步**：进入[第 6 阶段](../phase-6-advanced-rag/README.md)学习高级 RAG 技术！
