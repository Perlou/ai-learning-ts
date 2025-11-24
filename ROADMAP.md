# AI 大模型学习路线图 (TypeScript 版)

这份路线图旨在带你从“纯小白”成长为一名熟练的大语言模型 (LLM) 开发者/用户，专注于 **TypeScript/JavaScript** 生态系统。

## 第一阶段：核心概念 (What & Why)

**目标**：理解什么是 LLM，它们通过什么原理工作（高层视角），以及它们的能力和局限性。

- [x] **什么是 LLM?**：神经网络，Transformer 架构（简化版），预训练 (Pre-training) vs 微调 (Fine-tuning)。
- [x] **关键术语**：Token（词元），Context Window（上下文窗口），Temperature（温度），Hallucinations（幻觉），Parameters（参数）。
- [ ] **模型概览**：OpenAI (GPT), Anthropic (Claude), Google (Gemini), Meta (Llama)。

## 第二阶段：提示词工程 (The "How")

**目标**：学会高效地与模型沟通，以获得最佳结果。

- [x] **基础提示词**：清晰度，上下文，约束条件。
- [x] **进阶技巧**：思维链 (Chain of Thought, CoT)，少样本提示 (Few-shot)，角色扮演。
- [x] **结构化输出**：强制输出 JSON 格式以便代码集成。

## 第三阶段：开发者集成 (The "Build")

**目标**：开始编写 TypeScript 代码与 LLM 交互。

- [x] **环境搭建**：Node.js, TypeScript, `dotenv`。
- [ ] **SDK 使用**：OpenAI Node SDK, Anthropic SDK, Google Generative AI SDK。
- [x] **Hello World**：编写一个简单的 TS 脚本发送提示词并获取响应 (使用 Gemini)。
- [x] **聊天机器人**：在循环中管理对话历史 (Context)。

## 第四阶段：应用模式 (The "Architecture")

**目标**：构建真实世界的应用程序。

- [x] **Vercel AI SDK**：在 Next.js/React 中构建 AI 应用的标准库。
- [x] **RAG (检索增强生成)**：
  - [x] **Embeddings (嵌入)**：理解和生成向量。
  - [x] **简单 RAG 实现**：基于内存的向量检索。
  - [ ] 向量数据库 (Pinecone, Weaviate, 或本地方案)。
- [ ] **LangChain.js**：用于构建复杂调用链的流行框架（可选，但值得了解）。

## 第五阶段：进阶与优化 (The "Deep Dive")

**目标**：优化与定制。

- [x] **Agents (智能体)**：可以使用工具的 LLM (Function Calling)。
- [x] **本地 LLM**：使用 Ollama 本地运行模型并通过 REST API 调用。
- [ ] **评估 (Evaluation)**：测试你的提示词和工作流效果。

## 推荐资源

- **Vercel AI SDK 文档**
- **OpenAI Node.js Cookbook**
- **DeepLearning.AI (短课程)**
