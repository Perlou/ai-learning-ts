# AI Learning (TypeScript)

这是一个基于 Google Gemini API 的 AI 学习项目。

## 🚀 快速开始

### 1. 环境准备

确保你已经安装了 Node.js，并且配置了 `.env` 文件（填入你的 `GEMINI_API_KEY`）。

### 2. 运行示例代码

我们使用 `tsx` 来直接运行 TypeScript 代码，无需编译。

#### 示例 1: Hello World

测试 API 是否通畅，模型是否能回复。

```bash
npx tsx src/01-hello-gemini.ts
```

#### 示例 2: CLI 聊天机器人

一个能记住上下文的终端聊天程序。

```bash
npx tsx src/02-chatbot.ts
```

_(输入 `exit` 退出)_

#### 示例 3: Embeddings (向量)

查看文本如何转换为向量，并比较语义相似度。

```bash
npx tsx src/03-embeddings.ts
```

#### 示例 4-6: 提示词工程（Phase 2）

学习如何优化提示词以获得更好的 AI 响应。

```bash
# 基础提示词对比
npx tsx src/05-prompt-basics.ts

# 思维链（CoT）推理
npx tsx src/06-chain-of-thought.ts

# 结构化JSON输出
npx tsx src/07-structured-output.ts
```

#### 示例 8-10: Agents 与 Function Calling（Phase 5）

学习如何让 AI 使用工具，从"聊天"到"行动"。

````bash
# Function Calling 基础
npx tsx src/08-function-calling-basics.ts

# 实用天气助手
npx tsx src/09-weather-agent.ts

# 多工具智能助手
npx tsx src/10-multi-tool-agent.ts

### Phase 5.2: 本地 LLM (Ollama)

**前提：需要先安装 Ollama**

```bash
# 安装 Ollama
brew install ollama

# 下载模型（推荐中文）
ollama pull qwen2.5:7b

# 启动服务
ollama serve
````

**运行示例：**

```bash
# 基础使用（文本生成）
npx tsx src/11-ollama-basic.ts

# 对话模式（多轮对话）
npx tsx src/12-ollama-chat.ts

# 本地Embeddings生成（向量搜索）
npx tsx src/13-ollama-embeddings.ts

# Function Calling模拟（Prompt Engineering）
npx tsx src/14-ollama-function-calling.ts
```

#### 示例 11: Web 聊天界面

一个现代化的、基于 Next.js 的聊天应用，支持流式输出。

```bash
cd web-chat
npm run dev
```

然后打开浏览器访问 `http://localhost:3000`

## 📂 目录结构

- `src/` - 源代码
- `ROADMAP.md` - 学习路线图
- `CONCEPTS.md` - 核心概念文档
