# AI Learning (TypeScript)

这是一个基于 Google Gemini API 的 AI 学习项目。

## 🚀 快速开始

### 1. 环境准备

确保你已经安装了 Node.js，并且配置了 `.env` 文件（填入你的 `GEMINI_API_KEY`）。

### 2. 按阶段学习

我们使用 `tsx` 来直接运行 TypeScript 代码，无需编译。

所有代码已按学习阶段组织，详见下方 [🎓 按阶段学习](#-按阶段学习) 部分。

快速开始：

```bash
# 第一个示例：Hello World
npx tsx src/phase-1-2-llm-basics/01-hello-gemini.ts

# 聊天机器人（输入 exit 退出）
npx tsx src/phase-1-2-llm-basics/02-chatbot.ts
```

## 📂 项目结构

本项目按照学习阶段组织代码，每个阶段都有独立的目录和 README：

```
src/
├── phase-1-2-llm-basics/      # 第1-2阶段：LLM基础与提示工程
├── phase-3-embeddings-rag/    # 第3阶段：Embeddings与RAG
├── phase-4-agents/            # 第4阶段：Agent开发
├── phase-5-local-models/      # 第5阶段：本地模型运行
├── phase-6-advanced-rag/      # 第6阶段：高级RAG技术 ⭐ 当前进度
├── phase-7-production-vectors/ # 第7阶段：生产级向量数据库（规划中）
├── phase-8-langchain/         # 第8阶段：LangChain生态（规划中）
├── phase-9-query-optimization/ # 第9阶段：查询优化（规划中）
├── phase-10-frontend/         # 第10阶段：前端集成（规划中）
├── phase-11-evaluation/       # 第11阶段：评估与监控（规划中）
├── phase-12-production/       # 第12阶段：生产部署（规划中）
└── utils/                     # 工具脚本
```

**重要文档**：

- 📖 [ROADMAP.md](./ROADMAP.md) - 学习路线图
- 📝 [CONCEPTS.md](./CONCEPTS.md) - 核心概念文档
- 🗺️ [LLM_DEVELOPER_PLAN.md](./LLM_DEVELOPER_PLAN.md) - 完整学习计划（12 阶段）
- 📁 `docs/` - 各阶段总结与测验

## 🎓 按阶段学习

每个阶段目录都包含独立的 README.md，详细说明该阶段的学习目标、核心概念和运行方式。

### 第 1-2 阶段：LLM 基础与提示工程

```bash
npx tsx src/phase-1-2-llm-basics/01-hello-gemini.ts
npx tsx src/phase-1-2-llm-basics/02-chatbot.ts
npx tsx src/phase-1-2-llm-basics/05-prompt-basics.ts
npx tsx src/phase-1-2-llm-basics/06-chain-of-thought.ts
npx tsx src/phase-1-2-llm-basics/07-structured-output.ts
```

查看详情：[phase-1-2-llm-basics/README.md](./src/phase-1-2-llm-basics/README.md)

### 第 3 阶段：Embeddings 与 RAG

```bash
npx tsx src/phase-3-embeddings-rag/03-embeddings.ts
npx tsx src/phase-3-embeddings-rag/04-simple-rag.ts
```

查看详情：[phase-3-embeddings-rag/README.md](./src/phase-3-embeddings-rag/README.md)

### 第 4 阶段：Agent 开发

```bash
npx tsx src/phase-4-agents/08-function-calling-basics.ts
npx tsx src/phase-4-agents/09-weather-agent.ts
npx tsx src/phase-4-agents/10-multi-tool-agent.ts
```

查看详情：[phase-4-agents/README.md](./src/phase-4-agents/README.md)

### 第 5 阶段：本地模型运行

**前提**：需要先安装 Ollama

```bash
# 安装 Ollama
brew install ollama

# 下载模型
ollama pull llama3.2
ollama pull nomic-embed-text

# 启动服务
ollama serve
```

**运行示例**：

```bash
npx tsx src/phase-5-local-models/11-ollama-basic.ts
npx tsx src/phase-5-local-models/12-ollama-chat.ts
npx tsx src/phase-5-local-models/13-ollama-embeddings.ts
npx tsx src/phase-5-local-models/14-ollama-function-calling.ts
```

查看详情：[phase-5-local-models/README.md](./src/phase-5-local-models/README.md)

### 第 6 阶段：高级 RAG ⭐

```bash
npx tsx src/phase-6-advanced-rag/15-lancedb-basics.ts
npx tsx src/phase-6-advanced-rag/16-hybrid-search.ts
npx tsx src/phase-6-advanced-rag/17-reranking.ts
```

查看详情：[phase-6-advanced-rag/README.md](./src/phase-6-advanced-rag/README.md)

### 第 7-12 阶段（规划中）

查看完整的后续学习计划：[LLM_DEVELOPER_PLAN.md](./LLM_DEVELOPER_PLAN.md)
