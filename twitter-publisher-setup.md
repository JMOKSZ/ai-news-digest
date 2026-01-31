# X/Twitter 内容发布器设置指南

## 项目概述

这是一个自动化系统，用于：
1. 监控英文科技新闻和推文
2. 使用Azure OpenAI将其翻译成中文
3. 优化内容以适合推文格式
4. 自动发布到您的X账户

## 当前状态

- ✅ X开发者账户已创建（OneShot77777）
- ✅ Bearer Token已配置
- ⏳ 账户需要充值信用额度才能发布内容
- ✅ Azure OpenAI已连接
- ✅ 翻译和发布脚本已创建

## 文件结构

```
├── twitter-content-publisher.js     # X API发布功能
├── translator-with-azure.js         # Azure OpenAI翻译功能
├── integrated-twitter-publisher.js  # 整合发布系统
└── x-api-config.json               # API配置
```

## 使用方法

### 1. 环境配置

创建 `.env` 文件：

```bash
# Azure OpenAI 配置
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_VERSION=2024-06-01
MODEL_NAME=gpt-4

# X API 配置
TWITTER_BEARER_TOKEN=your_bearer_token
```

### 2. 安装依赖

```bash
npm install axios dotenv openai
```

### 3. 运行脚本

发布模拟科技新闻：
```bash
node integrated-twitter-publisher.js "YOUR_BEARER_TOKEN"
```

监控特定话题：
```bash
node integrated-twitter-publisher.js "YOUR_BEARER_TOKEN" monitor "AI" 5
```

## 充值后启用发布功能

一旦您的X开发者账户充值成功，脚本将能够：

1. 自动获取热门英文科技新闻
2. 使用AI翻译成中文
3. 优化内容格式
4. 发布到您的X账户

## 安全说明

- 所有API密钥都应安全存储
- 不要在代码中硬编码敏感信息
- 定期轮换API密钥