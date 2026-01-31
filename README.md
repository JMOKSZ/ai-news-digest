# AI News Digest 🤖📰

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/JMOKSZ/ai-news-digest.svg?style=social&label=Star)](https://github.com/JMOKSZ/ai-news-digest)

AI驱动的智能新闻摘要和趋势分析工具，可与[TrendRadar](https://github.com/JMOKSZ/TrendRadar)配合使用，让AI为您筛选、总结和分析每日最重要的新闻。

## ✨ 功能特色

- 🤖 **AI驱动摘要** - 使用GPT-4等先进模型生成简洁准确的新闻摘要
- 🌐 **X/Twitter内容助手** - 支持基本访问权限，获取英文科技新闻并AI翻译为中文
- 💬 **中文支持** - 完美支持中英文新闻分析和翻译
- 📊 **情感分析** - 自动判断新闻的情感倾向（正面/负面/中性）
- 📈 **趋势预测** - 基于新闻内容分析潜在趋势
- 🌐 **多源聚合** - 从TechCrunch、Hacker News、Reddit等多个新闻源抓取
- 📅 **定时推送** - 可设置每日自动推送新闻摘要
- 📄 **多格式输出** - 支持Markdown、HTML、PDF等多种格式

## 🚀 快速开始

### 前置要求
- Node.js 16+ 
- Azure OpenAI 或 OpenAI API 密钥

### 安装

```bash
# 克隆仓库
git clone https://github.com/JMOKSZ/ai-news-digest.git
cd ai-news-digest

# 安装依赖
npm install

# 配置API密钥
cp .env.example .env
# 编辑 .env 文件并填入您的API密钥
```

### 配置API密钥

编辑 `.env` 文件：

```bash
# Azure OpenAI 配置
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_VERSION=2024-06-01
MODEL_NAME=gpt-4

# 或使用 OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

### 使用

```bash
# 生成今日新闻摘要
npm start

# 生成特定主题的摘要
node index.js --topic "technology"

# 生成指定日期范围的摘要
node index.js --date-range "2026-01-01,2026-01-31"
```

## 🎯 应用场景

- **市场监测** - 跟踪行业动态和市场趋势
- **竞品分析** - 监控竞争对手相关新闻
- **投资决策** - 获取影响投资的新闻信息
- **科研前沿** - 跟踪技术发展和科学发现
- **个人学习** - 高效获取所需领域知识

## 🔗 与TrendRadar的关系

本项目与[TrendRadar](https://github.com/JMOKSZ/TrendRadar)形成完美配合：
- TrendRadar负责多平台热点聚合和舆情监控
- AI News Digest负责深入分析和智能摘要
- 两者结合提供从信息收集到智能分析的完整解决方案

## 🤝 贡献

欢迎提交Issue和Pull Request来帮助改进此项目。我们特别欢迎以下方面的贡献：

- 新的新闻源集成
- 更多AI模型适配
- 输出格式扩展
- 性能优化

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🌟 支持

如果您觉得这个项目有用，请给我们一个 ⭐ Star！

---

Made with ❤️ using AI technology