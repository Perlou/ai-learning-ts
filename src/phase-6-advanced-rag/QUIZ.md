# 第 6 阶段测验：高级 RAG

> **本测验涵盖混合检索、重排序和生产级 RAG 系统。**

## 选择题（50 分）

**1.** 混合检索结合了哪两种方法？（5 分）

- A. 向量搜索 + BM25
- B. 向量搜索 + SQL
- C. BM25 + 正则
- D. SQL + NoSQL

<details><summary>答案</summary>**A** - 向量搜索（语义）+ BM25（关键词）</details>

**2.** RRF 的作用是？（5 分）

- A. 向量化文本
- B. 融合多个搜索结果
- C. 重排序文档
- D. 生成答案

<details><summary>答案</summary>**B** - Reciprocal Rank Fusion 融合算法</details>

**3.** 两阶段检索的目的是？（5 分）

- A. 节省成本
- B. 兼顾速度和精度
- C. 提升召回率
- D. 简化流程

<details><summary>答案</summary>**B** - 第一阶段快速召回，第二阶段精准重排</details>

**4.** Bi-Encoder 的特点？（5 分）

- A. 速度快，精度一般
- B. 速度慢，精度高
- C. 速度快，精度高
- D. 速度慢，精度低

<details><summary>答案</summary>**A** - 向量搜索快但精度不如 Cross-Encoder</details>

**5.** Cross-Encoder 用于？（5 分）

- A. 第一阶段召回
- B. 第二阶段重排序
- C. 向量生成
- D. 文档索引

<details><summary>答案</summary>**B** - 精准的重排序阶段</details>

**6.** BM25 的优势是？（5 分）

- A. 理解语义
- B. 精确关键词匹配
- C. 速度最快
- D. 成本最低

<details><summary>答案</summary>**B** - 传统关键词搜索，精确匹配强</details>

**7.** 混合检索提升了？（5 分）

- A. 召回率
- B. 精确率
- C. 生成质量
- D. 推理速度

<details><summary>答案</summary>**A** - 更全面地召回相关文档</details>

**8.** 重排序提升了？（5 分）

- A. 召回率
- B. 精确率
- C. 检索速度
- D. 向量质量

<details><summary>答案</summary>**B** - 精准排序，排除无关文档</details>

**9.** LanceDB 的特点？（5 分）

- A. 内存数据库
- B. 持久化向量数据库
- C. 关系数据库
- D. 文档数据库

<details><summary>答案</summary>**B** - 专业的持久化向量数据库</details>

**10.** 生产级 RAG 的典型流程？（5 分）

- A. 向量搜索 → 生成
- B. 混合检索 → 重排序 → 生成
- C. BM25 → 生成
- D. 关键词 → 向量 → 生成

<details><summary>答案</summary>**B** - 混合检索(召回) → 重排序(精排) → LLM生成</details>

---

## 代码题（30 分）

**11.** 实现 RRF 融合（15 分）

```typescript
function rrf(results: SearchResult[][]): Document[] {
  // 你的代码
}
```

<details><summary>参考答案</summary>

```typescript
function rrf(results: SearchResult[][], k = 60): Document[] {
  const scores = new Map<string, number>();

  results.forEach((resultSet) => {
    resultSet.forEach((doc, rank) => {
      const score = 1 / (k + rank + 1);
      scores.set(doc.id, (scores.get(doc.id) || 0) + score);
    });
  });

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));
}
```

</details>

**12.** 实现两阶段检索（15 分）

<details><summary>参考答案</summary>

```typescript
async function twoStageRetrieval(query: string) {
  // 第一阶段：混合检索召回 Top 50
  const vectorResults = await vectorSearch(query, 30);
  const bm25Results = await bm25Search(query, 30);
  const candidates = rrf([vectorResults, bm25Results]).slice(0, 50);

  // 第二阶段：重排序 Top 3
  const rerankScores = await llmRerank(query, candidates);
  const top3 = candidates
    .map((doc, i) => ({ ...doc, score: rerankScores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return top3;
}
```

</details>

---

## 场景题（20 分）

**13.** RAG 系统优化（20 分）

你的 RAG 系统检索不准确，用户问"ERR-502 错误"却返回"ERR-503"的文档。

**问题**：如何改进？

<details><summary>参考答案</summary>

**问题分析**：

- 纯向量搜索无法精确匹配错误码
- "ERR-502" 和 "ERR-503" 向量相似

**解决方案**：

1. **采用混合检索**：
   - BM25 能精确匹配 "ERR-502"
   - 向量搜索理解"错误"概念
2. **元数据过滤**：
   ```typescript
   { content: "...", metadata: { errorCode: "ERR-502" } }
   ```
3. **重排序优化**：
   - 使用 LLM/Cross-Encoder 重排
   - 检查错误码是否完全匹配

**预期效果**：

- 召回率提升：BM25 精确找到 ERR-502
- 精确率提升：重排序排除 ERR-503
</details>

---

**评分**：90+ 优秀 | 75-89 良好 | 60-74 及格

**恭喜完成全部 6 个阶段！** 🎉
