# Ollama 安装和配置指南

## 🎯 什么是 Ollama？

Ollama 是一个让你在本地运行大语言模型的工具，就像在本地运行 Docker 容器一样简单。

**核心优势：**

- 💰 **完全免费** - 无 API 调用费用
- 🔒 **隐私保护** - 数据不离开你的电脑
- ⚡ **低延迟** - 无网络往返时间
- 🌐 **离线工作** - 无需互联网连接
- 🎨 **可定制** - 可以 fine-tune 模型

---

## 🖥️ 系统要求

### 最低配置

- **RAM**: 8GB（可运行 7B 参数模型）
- **磁盘**: 至少 10GB 可用空间
- **系统**: macOS 11+, Linux, Windows (WSL2)

### 推荐配置

- **RAM**: 16GB+（可运行更大模型）
- **GPU**: Apple Silicon (M1/M2/M3) 或 NVIDIA GPU（可选，加速推理）
- **磁盘**: SSD，20GB+空间

---

## 📦 安装 Ollama

### macOS 安装（推荐方式 1：官方安装包）

1. 访问官网下载：

   ```
   https://ollama.com/download
   ```

2. 下载 `.dmg` 文件并安装

3. 安装完成后，Ollama 会自动启动

### macOS 安装（方式 2：Homebrew）

```bash
# 使用Homebrew安装
brew install ollama

# 启动Ollama服务
ollama serve
```

### 验证安装

打开终端，运行：

```bash
ollama --version
```

应该看到类似输出：

```
ollama version is 0.x.x
```

---

## 🚀 下载和运行模型

### 推荐的中文模型

#### 1. Qwen 2.5（强烈推荐 🌟）

阿里巴巴出品，中文能力极强

```bash
# 7B 版本（推荐，8GB RAM可运行）
ollama pull qwen2.5:7b

# 运行模型
ollama run qwen2.5:7b
```

**测试：**

```
>>> 你好，请用一句话介绍你自己
我是通义千问，由阿里云开发的AI助手...
```

#### 2. GLM-4（清华出品）

中文对话能力强

```bash
ollama pull glm4:9b
ollama run glm4:9b
```

---

### 推荐的英文模型

#### 1. Llama 3.1（Meta 官方）

最流行的开源模型

```bash
# 8B 版本
ollama pull llama3.1:8b

# 运行
ollama run llama3.1:8b
```

#### 2. Mistral（高性能）

法国 Mistral AI 出品

```bash
ollama pull mistral:7b
ollama run mistral:7b
```

---

### 测试用小模型

如果只是想快速测试，可以用小模型：

```bash
# Gemma 2B（Google出品，只有1.6GB）
ollama pull gemma2:2b
ollama run gemma2:2b
```

---

## 🔧 基本命令

### 常用命令

```bash
# 列出已安装的模型
ollama list

# 查看模型详情
ollama show qwen2.5:7b

# 运行模型（交互式）
ollama run qwen2.5:7b

# 删除模型
ollama rm gemma2:2b

# 拉取/更新模型
ollama pull llama3.1:8b

# 停止Ollama服务
# macOS: Cmd+Q退出Ollama应用
# Linux: Ctrl+C停止ollama serve
```

### 启动和停止服务

**macOS（官方安装包）：**

- Ollama 作为后台应用运行
- 通过菜单栏图标控制

**macOS/Linux（命令行）：**

```bash
# 启动服务
ollama serve

# 在另一个终端运行模型
ollama run qwen2.5:7b
```

---

## 🌐 API 端点

Ollama 启动后，默认在 `http://localhost:11434` 提供 REST API。

### 主要端点

| 端点              | 用途         | 方法 |
| ----------------- | ------------ | ---- |
| `/api/generate`   | 单次文本生成 | POST |
| `/api/chat`       | 对话模式     | POST |
| `/api/embeddings` | 生成向量     | POST |
| `/api/tags`       | 列出模型     | GET  |
| `/api/show`       | 模型详情     | POST |

### 快速测试 API

```bash
# 测试 /api/generate
curl http://localhost:11434/api/generate -d '{
  "model": "qwen2.5:7b",
  "prompt": "为什么天空是蓝色的？",
  "stream": false
}'
```

---

## 💡 使用技巧

### 1. 选择合适的模型

**根据 RAM 选择：**

- **8GB RAM**: 7B 模型（`qwen2.5:7b`, `llama3.1:8b`）
- **16GB RAM**: 13B-14B 模型（`qwen2.5:14b`）
- **32GB+ RAM**: 更大模型

**根据用途选择：**

- **中文对话**: `qwen2.5:7b`, `glm4:9b`
- **英文对话**: `llama3.1:8b`, `mistral:7b`
- **代码生成**: `codellama:7b`, `deepseek-coder:6.7b`
- **快速测试**: `gemma2:2b`, `phi3:mini`

### 2. 管理磁盘空间

```bash
# 查看模型大小
ollama list

# 删除不用的模型
ollama rm <model-name>

# 模型存储位置（macOS）
~/.ollama/models/
```

### 3. 性能优化

**macOS（Apple Silicon）：**

- Ollama 自动使用 Metal 加速
- M1/M2/M3 性能优秀
- 推荐使用 7B-14B 模型

**Linux/Windows（NVIDIA GPU）：**

- 自动检测 CUDA
- 确保安装最新驱动

---

## 🐛 常见问题

### 问题 1：端口占用

```bash
# 错误：address already in use
# 解决：检查是否已有Ollama运行
ps aux | grep ollama

# 或更改端口
OLLAMA_HOST=0.0.0.0:11435 ollama serve
```

### 问题 2：模型下载慢

```bash
# 使用镜像（如果官方源慢）
# 设置环境变量
export OLLAMA_MODELS=/path/to/models
```

### 问题 3：内存不足

```
Error: failed to allocate memory
```

**解决方案：**

- 使用更小的模型（2B-3B）
- 关闭其他应用释放内存
- 升级 RAM

### 问题 4：如何更新 Ollama

**macOS（官方安装包）：**

- 重新下载安装包

**Homebrew：**

```bash
brew upgrade ollama
```

---

## ✅ 验证安装成功

完成以下检查确保一切正常：

```bash
# 1. 检查版本
ollama --version

# 2. 检查服务
curl http://localhost:11434/api/tags

# 3. 列出模型
ollama list

# 4. 运行简单测试
ollama run qwen2.5:7b "你好"
```

如果所有命令都正常工作，恭喜你！Ollama 已经准备就绪！🎉

---

## 📚 下一步

安装完成后，你可以：

1. 运行基础示例（`src/11-ollama-basic.ts`）
2. 尝试对话模式（`src/12-ollama-chat.ts`）
3. 生成本地 embeddings（`src/13-ollama-embeddings.ts`）
4. 探索 Function Calling（`src/14-ollama-function-calling.ts`）

---

## 🔗 有用的资源

- **官方网站**: https://ollama.com
- **模型库**: https://ollama.com/library
- **GitHub**: https://github.com/ollama/ollama
- **文档**: https://github.com/ollama/ollama/blob/main/docs/api.md

**准备好在本地运行 AI 了吗？** 🚀
