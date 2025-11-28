# 大模型应用开发转型学习计划

> **定制对象**：资深 Web 全栈开发工程师向 LLM 应用开发转型  
> **学习方式**：基于 TypeScript 实践驱动的循序渐进学习  
> **预计时长**：12-16 周（每周投入 10-15 小时）  
> **当前进度**：✅ 已完成第 1-6 阶段基础 | 🔄 准备开始第 7 阶段（生产级向量数据库）

---

## 📊 当前学习状态评估

### ✅ 已掌握的技能（基于代码分析）

#### 第 1-2 阶段：LLM 基础与提示工程

- [x] LLM 核心概念与术语理解
- [x] Gemini API 集成 (`01-hello-gemini.ts`)
- [x] 对话管理与上下文处理 (`02-chatbot.ts`)
- [x] 基础提示词工程 (`05-prompt-basics.ts`)
- [x] Chain-of-Thought 技术 (`06-chain-of-thought.ts`)
- [x] 结构化输出（JSON）(`07-structured-output.ts`)

#### 第 3 阶段：Embeddings 与 RAG

- [x] Embeddings 向量化原理 (`03-embeddings.ts`)
- [x] 简单 RAG 实现 (`04-simple-rag.ts`)

#### 第 4 阶段：Agent 开发

- [x] Function Calling 基础 (`08-function-calling-basics.ts`)
- [x] 单工具 Agent (`09-weather-agent.ts`)
- [x] 多工具协作 Agent (`10-multi-tool-agent.ts`)

#### 第 5 阶段：本地模型运行

- [x] Ollama 本地部署 (`01-ollama-basic.ts`, `02-ollama-chat.ts`)
- [x] 本地 Embeddings (`03-ollama-embeddings.ts`)
- [x] 本地模型 Function Calling (`04-ollama-function-calling.ts`)

#### 第 6 阶段：高级 RAG（已完成）

- [x] LanceDB 向量数据库 (`01-lancedb-basics.ts`)
- [x] 混合检索 (Hybrid Search) (`02-hybrid-search.ts`)
- [x] 重排序 (Re-ranking) (`03-reranking.ts`)

### 🎯 待补充的核心技能

根据您的目标和行业需求，以下是需要重点学习的方向：

---

## 🗺️ 详细学习计划

### 阶段 7：生产级向量数据库 (2-3 周)

> **目标**：掌握生产环境中向量数据库的部署与优化

#### 第 1 周：云端向量数据库

- [ ] **Pinecone 集成**
  - 创建 `01-pinecone-setup.ts`：索引创建、命名空间管理
  - 创建 `02-pinecone-rag.ts`：完整 RAG Pipeline
  - 学习 serverless vs pod-based 部署差异
- [ ] **Weaviate 实践**
  - 创建 `03-weaviate-local.ts`：Docker 本地部署
  - 创建 `04-weaviate-hybrid.ts`：BM25 + 向量混合
  - 学习 GraphQL 查询语法

#### 第 2 周：向量检索优化

- [ ] **索引算法深入**

  - 创建 `05-hnsw-tuning.ts`：HNSW 参数调优实验
  - 创建 `06-ivf-research.ts`：IVF 索引对比测试
  - 文档：`docs/VECTOR_INDEX_COMPARISON.md`

- [ ] **性能基准测试**
  - 创建 `07-benchmark-suite.ts`：检索速度、精度对比
  - 测试不同数据量（1K、10K、100K、1M）
  - 文档：`docs/RAG_PERFORMANCE_REPORT.md`

#### 第 3 周：元数据过滤与分块策略

- [ ] **文档处理**

  - 创建 `08-pdf-parser.ts`：PDF 解析（pdf-parse）
  - 创建 `09-semantic-chunking.ts`：基于语义的分块
  - 创建 `10-metadata-filter.ts`：时间、来源、标签过滤

- [ ] **实战项目 1**：个人知识库系统
  - 支持 PDF、Markdown、网页导入
  - 元数据标签系统
  - 混合检索 + 重排序 + 引用溯源

---

### 阶段 8：LangChain 生态深入 (2-3 周)

> **目标**：掌握 LangChain.js 框架构建复杂应用

#### 第 4-5 周：LangChain 核心组件

- [ ] **Chains 与 Runnables**

  - 创建 `01-langchain-basics.ts`：LCEL（表达式语言）
  - 创建 `02-sequential-chain.ts`：多步骤链式调用
  - 创建 `03-map-reduce-chain.ts`：文档摘要

- [ ] **Memory 管理**

  - 创建 `04-conversation-buffer.ts`：对话缓冲
  - 创建 `05-entity-memory.ts`：实体提取记忆
  - 创建 `06-summary-memory.ts`：摘要记忆

- [ ] **Retriever 抽象**
  - 创建 `07-multi-query-retriever.ts`：查询扩展
  - 创建 `08-contextual-compression.ts`：上下文压缩
  - 创建 `09-parent-document-retriever.ts`：父子文档检索

#### 第 6 周：高级 Agent 模式

- [ ] **ReAct Agent**
  - 创建 `10-react-agent.ts`：思考-行动循环
  - 创建 `11-plan-execute-agent.ts`：规划执行分离
- [ ] **Multi-Agent 系统**
  - 创建 `12-supervisor-agent.ts`：监督者模式
  - 创建 `13-collaborative-agents.ts`：协作式 Agent
  - 文档：`docs/MULTI_AGENT_PATTERNS.md`

---

### 阶段 9：查询优化与高级检索 (2 周)

> **目标**：深入理解查询转换技术

#### 第 7 周：查询转换

- [ ] **HyDE（假设性文档嵌入）**

  - 创建 `01-hyde-basic.ts`：让 LLM 先生成假设答案再检索
  - 创建 `02-hyde-multi-hypothesis.ts`：生成多个假设

- [ ] **查询分解**
  - 创建 `03-multi-query.ts`：单问题拆解为多问题
  - 创建 `04-step-back-prompting.ts`：退后一步问更抽象的问题
  - 创建 `05-rag-fusion.ts`：融合多路检索结果

#### 第 8 周：高级 Re-ranking

- [ ] **Cross-Encoder 模型**
  - 创建 `06-cohere-rerank.ts`：Cohere Rerank API 集成
  - 创建 `07-local-cross-encoder.ts`：本地运行 BGE-reranker
- [ ] **对比实验**
  - 创建 `08-rerank-comparison.ts`：LLM vs Cross-Encoder vs RRF
  - 文档：`docs/RERANKING_BENCHMARK.md`

---

### 阶段 10：前端集成与流式响应 (2 周)

> **目标**：构建生产级聊天界面

#### 第 9 周：Vercel AI SDK 深入

- [ ] **流式响应**

  - 创建 Next.js 项目：`ai-chat-demo/`
  - `useChat` hook 实践
  - `streamText` API 自定义

- [ ] **多模态支持**
  - 创建 `01-vision-rag.ts`：图片 + 文本 RAG
  - 创建 `02-audio-transcription.ts`：Whisper 集成

#### 第 10 周：实战项目 2 - AI 客服系统

- [ ] 需求分析文档：`docs/PROJECT_CUSTOMER_SERVICE.md`
- [ ] 后端 API（Express + LangChain）
- [ ] 前端界面（Next.js + Vercel AI SDK）
- [ ] 部署到 Vercel + Pinecone

---

### 阶段 11：评估、监控与优化 (2 周)

> **目标**：建立 LLM 应用的质量保证体系

#### 第 11 周：评估指标

- [ ] **RAGAS 框架**
  - 创建 `01-ragas-evaluation.ts`：生成、忠实度、相关性评分
  - 创建测试数据集：`data/eval-dataset.json`
- [ ] **自定义评估**
  - 创建 `02-llm-as-judge.ts`：用 LLM 评估 LLM
  - 创建 `03-ab-testing.ts`：A/B 测试框架

#### 第 12 周：可观测性

- [ ] **LangSmith 集成**
  - 创建 `04-langsmith-tracing.ts`：链路追踪
  - 成本分析工具
- [ ] **Prompt 版本管理**
  - 创建 `05-prompt-versioning.ts`：Prompt 模板管理
  - Git-based Prompt 管理流程

---

### 阶段 12：安全、成本与生产部署 (2-3 周)

> **目标**：掌握生产环境最佳实践

#### 第 13 周：安全与合规

- [ ] **Prompt Injection 防护**
  - 创建 `01-input-sanitization.ts`：输入清洗
  - 创建 `02-jail-break-detection.ts`：越狱检测
- [ ] **内容审核**
  - 创建 `03-moderation-api.ts`：OpenAI Moderation
  - 创建 `04-pii-detection.ts`：个人信息检测

#### 第 14 周：成本优化

- [ ] **缓存策略**
  - 创建 `05-semantic-cache.ts`：GPTCache 集成
  - 创建 `06-response-cache.ts`：Redis 响应缓存
- [ ] **模型路由**
  - 创建 `07-model-router.ts`：简单问题用 GPT-3.5，复杂用 GPT-4
  - 创建 `08-fallback-strategy.ts`：降级与重试策略

#### 第 15-16 周：实战项目 3 - 企业级文档问答系统

- [ ] **需求与架构设计**
  - 支持 10+ 种文档格式
  - 多租户隔离
  - 权限控制
- [ ] **技术栈**
  - 后端：Node.js (Fastify) + LangChain + PostgreSQL (pgvector)
  - 前端：Next.js 14 + Vercel AI SDK
  - 部署：Docker + Kubernetes
- [ ] **功能清单**
  - [ ] 用户认证与授权
  - [ ] 文档上传与解析
  - [ ] 向量索引构建
  - [ ] 智能问答（混合检索 + 重排序）
  - [ ] 对话历史管理
  - [ ] 引用溯源
  - [ ] 使用统计与成本追踪
  - [ ] 管理后台

---

## 🎓 配套学习资源

### 必读文档

- [ ] [LangChain.js 官方文档](https://js.langchain.com/)
- [ ] [Vercel AI SDK 文档](https://sdk.vercel.ai/)
- [ ] [OpenAI Cookbook](https://cookbook.openai.com/)
- [ ] [Pinecone Learning Center](https://www.pinecone.io/learn/)

### 推荐课程

- [ ] **DeepLearning.AI 短课程系列**
  - LangChain for LLM Application Development
  - Building Systems with the ChatGPT API
  - Vector Databases from Embeddings to Applications
- [ ] **Coursera - Generative AI with LLMs** (可选，理论补充)

### 关键论文阅读

- [ ] "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" (RAG 原论文)
- [ ] "Lost in the Middle" (长上下文问题)
- [ ] "Self-RAG" (自我反思 RAG)
- [ ] "RAPTOR" (递归摘要树检索)

### 社区参与

- [ ] 加入 LangChain Discord
- [ ] 关注 AI Engineer Summit 议题
- [ ] 在 GitHub 贡献开源项目（如 LangChain.js、llama_index）

---

## 📝 学习方法建议

### 1️⃣ 代码先行，理论跟进

您已经有很好的编程基础，建议：

- 每个概念先写代码实践
- 遇到不理解的再深入理论
- 每个 `.ts` 文件添加详细注释

### 2️⃣ 构建个人知识库

- 将所有学习笔记放入 `docs/` 目录
- 用 RAG 系统索引自己的笔记（meta！）
- 定期复盘总结到 `CONCEPTS.md`

### 3️⃣ 项目驱动学习

建议按以下顺序完成三个实战项目：

1. **个人知识库**（第 7 阶段末）- 掌握文档处理与检索
2. **AI 客服系统**（第 10 阶段末）- 掌握前后端集成
3. **企业文档问答**（第 12 阶段末）- 综合应用所有技能

### 4️⃣ 建立评估习惯

- 每个新技术都要与旧方法对比
- 记录性能数据（速度、成本、准确率）
- 养成写 benchmark 的习惯

### 5️⃣ 关注成本

LLM 应用开发与传统 Web 开发最大的不同是**按使用付费**：

- 监控 Token 消耗
- 优化 Prompt 长度
- 合理使用缓存

---

## 🎯 学习里程碑检查

### 4 周后（阶段 7 完成）

- [ ] 能够独立选择并部署向量数据库
- [ ] 理解不同索引算法的取舍
- [ ] 完成个人知识库项目

### 8 周后（阶段 9 完成）

- [ ] 熟练使用 LangChain 构建复杂链路
- [ ] 掌握所有主流查询优化技术
- [ ] 能够评估和对比不同 RAG 策略

### 12 周后（阶段 11 完成）

- [ ] 能够构建生产级前端应用
- [ ] 建立完整的评估与监控体系
- [ ] 完成 AI 客服系统项目

### 16 周后（全部完成）

- [ ] 掌握企业级部署最佳实践
- [ ] 具备独立设计 LLM 应用架构的能力
- [ ] 完成企业级文档问答系统
- [ ] 能够指导他人进行 LLM 应用开发

---

## 💼 职业发展建议

### 作品集建设

将以下项目放入 GitHub，作为求职作品集：

1. `ai-learning-ts`（学习笔记库）
2. 个人知识库系统
3. AI 客服系统
4. 企业文档问答系统

每个项目都要有：

- 完善的 README
- 架构图
- 性能基准测试报告
- 部署 Demo

### 技能关键词（简历优化）

完成本计划后，您可以在简历中突出：

- RAG（检索增强生成）系统设计与优化
- LangChain/LangGraph 应用开发
- 向量数据库（Pinecone/Weaviate/LanceDB）
- Prompt Engineering 与 Agent 设计
- LLM 应用评估与监控（RAGAS、LangSmith）
- 多模态 AI 应用（文本 + 图片 + 音频）
- 生产部署经验（成本优化、安全加固）

### 目标岗位

- LLM 应用工程师
- AI 全栈工程师
- RAG 系统架构师
- Prompt 工程师（高级）
- AI Product Engineer

---

## 📊 进度追踪

建议每周更新本文档，标记完成的内容：

| 周次  | 阶段       | 完成文件数 | 实战项目     | 状态      |
| ----- | ---------- | ---------- | ------------ | --------- |
| 1-3   | 第 7 阶段  | 0/10       | 个人知识库   | ⏳ 待开始 |
| 4-6   | 第 8 阶段  | 0/13       | -            | ⏳ 待开始 |
| 7-8   | 第 9 阶段  | 0/8        | -            | ⏳ 待开始 |
| 9-10  | 第 10 阶段 | 0/2        | AI 客服系统  | ⏳ 待开始 |
| 11-12 | 第 11 阶段 | 0/5        | -            | ⏳ 待开始 |
| 13-16 | 第 12 阶段 | 0/4        | 企业文档问答 | ⏳ 待开始 |

---

## 🚀 下一步行动

1. **本周内**：

   - [ ] 完成 `01-pinecone-setup.ts`
   - [ ] 阅读 Pinecone 官方文档
   - [ ] 申请 Pinecone 免费账号

2. **本月内**：

   - [ ] 完成阶段 7 所有代码
   - [ ] 启动个人知识库项目

3. **3 个月内**：
   - [ ] 完成前 10 个阶段
   - [ ] 完成至少 2 个实战项目
   - [ ] 开始投递相关岗位

---

**Good luck! 🎉**

有任何问题随时在代码注释或 `docs/` 中记录，养成持续学习和总结的习惯。
