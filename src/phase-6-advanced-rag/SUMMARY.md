# 第 6 阶段学习总结：高级 RAG

> **本阶段目标**：掌握混合检索、重排序，构建生产级 RAG 系统

---

## 📚 核心知识点

### 一、高级 RAG 的必要性

**基础 RAG 的局限**：

- ❌ 精确匹配差
- ❌ 关键词不敏感
- ❌ 排序不够精准

**高级 RAG 的提升**：

- ✅ 混合检索：召回率 ↑
- ✅ 重排序：精确率 ↑
- ✅ 两阶段：效率+精度

---

### 二、混合检索（Hybrid Search）

#### 核心思想

**向量搜索** + **BM25 关键词搜索** = 更全面

| 方法     | 优势         | 劣势           |
| -------- | ------------ | -------------- |
| 向量搜索 | 理解语义     | 精确匹配差     |
| BM25     | 精确匹配强   | 无法理解语义   |
| **混合** | **两者兼顾** | **复杂度稍高** |

#### RRF 融合算法

```
RRF_score = ∑ 1 / (60 + rank_i)
```

**示例**：

- 文档 A：向量排名 1 + BM25 排名 1 → 高分
- 文档 B：向量排名 1 + BM25 未出现 → 中分

---

### 三、重排序（Re-ranking）

#### 两阶段检索策略

```
第一阶段（快速）：混合检索 → Top 50
第二阶段（精准）：Cross-Encoder/LLM → Top 3
```

**类比**：

- 阶段 1：快速扫视，找 50 个"可疑"的
- 阶段 2：逐一审讯，确定 3 个

#### Bi-Encoder vs Cross-Encoder

**Bi-Encoder**（向量搜索）：

- ✅ 快速
- ❌ 精度一般

**Cross-Encoder**（重排序）：

- ✅ 精度高
- ❌ 速度慢

---

## 💻 代码示例

### LanceDB 向量数据库

```typescript
const db = await connect("./.lancedb");
const table = await db.createTable("docs", data);
const results = await table.search(vector).limit(10).execute();
```

### 混合检索

```typescript
const vectorResults = vectorSearch(query);
const bm25Results = keywordSearch(query);
const fused = rrf([vectorResults, bm25Results]);
```

### 重排序

```typescript
const candidates = await hybridSearch(query, 10);
const scores = await llm.rerank(query, candidates);
const top3 = sortByScore(candidates, scores).slice(0, 3);
```

---

## 🎯 生产级 RAG 管道

```
查询 → 混合检索(Top 50) → 重排序 → Top 3 → LLM 生成
```

**关键指标**：

- **召回率**：不遗漏相关文档（混合检索 ↑）
- **精确率**：不包含无关文档（重排序 ↑）

---

## ✅ 核心要点

1. **混合检索**：语义+精确 = 全面
2. **RRF**：优雅融合多搜索结果
3. **两阶段**：快速召回+精准重排
4. **LanceDB**：生产级向量数据库
5. **权衡**：召回 vs 精确，速度 vs 精度

**恭喜完成！** 🎉

📘 详细笔记：[advanced-rag.md](./advanced-rag.md)
