# 第 5 阶段：本地模型运行

## 🎯 学习目标

- 使用 Ollama 在本地运行开源 LLM
- 理解本地模型与云端 API 的差异
- 掌握本地 Embeddings 生成
- 实现本地 Function Calling

## 📚 文件列表

| 文件                            | 描述                  | 关键概念               |
| ------------------------------- | --------------------- | ---------------------- |
| `01-ollama-basic.ts`            | Ollama 基础调用       | 本地模型部署、REST API |
| `02-ollama-chat.ts`             | 本地对话管理          | 流式响应、对话历史     |
| `03-ollama-embeddings.ts`       | 本地向量化            | 本地 Embeddings 模型   |
| `04-ollama-function-calling.ts` | 本地 Function Calling | 开源模型的工具调用     |

## 🚀 运行方式

### 前置准备

```bash
# macOS
brew install ollama

# 或从官网下载：https://ollama.ai
```

2. **启动 Ollama 服务**：

   ```bash
   ollama serve
   ```

3. **下载模型**：
   ```bash
   ollama pull llama3.2
   ollama pull nomic-embed-text
   ```

### 运行脚本

```bash
npx tsx src/phase-5-local-models/01-ollama-basic.ts
npx tsx src/phase-5-local-models/02-ollama-chat.ts
npx tsx src/phase-5-local-models/03-ollama-embeddings.ts
npx tsx src/phase-5-local-models/04-ollama-function-calling.ts
```

## 📖 核心概念

### Ollama

在本地运行 LLM 的工具，支持 Llama、Mistral、Qwen 等开源模型。

### 本地 vs 云端

| 维度     | 本地模型       | 云端 API      |
| -------- | -------------- | ------------- |
| **成本** | 免费（除硬件） | 按 Token 计费 |
| **速度** | 取决于硬件     | 通常更快      |
| **隐私** | 完全私密       | 数据上传云端  |
| **能力** | 中等           | 顶尖（GPT-4） |
| **部署** | 需要配置       | 即用即得      |

### 推荐模型

- **对话**：`llama3.2`、`qwen2.5`
- **编码**：`codellama`、`deepseek-coder`
- **Embeddings**：`nomic-embed-text`、`bge-large`

## 🔗 前置知识

- ✅ 第 1-4 阶段所有内容
- ✅ 基础的服务器/API 概念
- ✅ 了解硬件性能影响

## 💡 应用场景

- 🔒 隐私敏感场景（医疗、法律）
- 💰 成本优化（大量调用）
- 🏢 企业内网部署
- 🧪 模型研究与实验

## 📚 参考资源

- [Ollama 官方文档](https://github.com/ollama/ollama)
- [Ollama 模型库](https://ollama.ai/library)
- [本地 LLM 对比](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)

## 📖 阶段学习资料

- 📘 [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) - Ollama 详细安装和配置指南
- 📝 [SUMMARY.md](./SUMMARY.md) - 本阶段完整学习总结（本地模型运行）
- ❓ [QUIZ.md](./QUIZ.md) - 阶段测验（选择题 + 代码题 + 场景题）

## ⏭️ 下一步

完成本阶段后,继续学习：
👉 [第 6 阶段：高级 RAG](../phase-6-advanced-rag/README.md)
