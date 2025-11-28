# 第 3 阶段：Embeddings 与 RAG

## 🎯 学习目标

- 理解文本向量化（Embeddings）的原理
- 掌握向量相似度计算
- 实现基础的 RAG（检索增强生成）系统
- 理解语义搜索的核心概念

## 📚 文件列表

| 文件               | 描述           | 关键概念                         |
| ------------------ | -------------- | -------------------------------- |
| `01-embeddings.ts` | 文本向量化基础 | Embeddings、余弦相似度、向量空间 |
| `02-simple-rag.ts` | 简单 RAG 实现  | 向量检索、上下文注入、知识增强   |

## 🚀 运行方式

```bash
npx tsx src/phase-3-embeddings-rag/01-embeddings.ts
npx tsx src/phase-3-embeddings-rag/02-simple-rag.ts
```

## 📖 核心概念

### Embeddings（嵌入/向量化）

将文本转换为高维向量（如 768 维），相似的文本在向量空间中距离更近。

### 余弦相似度

计算两个向量的相似程度：

- `1.0`：完全相同
- `0.5`：部分相似
- `0.0`：完全不同

### RAG（Retrieval-Augmented Generation）

检索增强生成：先从知识库检索相关内容，再让 LLM 基于检索结果生成回答。

**RAG 流程**：

```
用户问题 → 向量化 → 检索相似文档 → 注入上下文 → LLM 生成答案
```

## 🔗 前置知识

- ✅ 第 1-2 阶段：LLM 基础
- ✅ 基础线性代数（向量、距离计算）

## 💡 应用场景

- 📚 企业知识库问答
- 📄 文档智能检索
- 💬 客服机器人
- 🔍 语义搜索引擎

## 📚 参考资源

- [What are Embeddings?](https://platform.openai.com/docs/guides/embeddings)
- [RAG 原论文](https://arxiv.org/abs/2005.11401)
- [Pinecone Learning Center](https://www.pinecone.io/learn/vector-embeddings/)

## 📖 阶段学习资料

- 📝 [SUMMARY.md](./SUMMARY.md) - 本阶段完整学习总结（Embeddings + RAG）
- ❓ [QUIZ.md](./QUIZ.md) - 阶段测验（选择题 + 实践题 + 场景题）

## ⏭️ 下一步

完成本阶段后，继续学习：
👉 [第 4 阶段：Agent 开发](../phase-4-agents/README.md)
