# AI News Digest

AI驱动的新闻摘要和趋势分析工具，可与TrendRadar配合使用。

## 功能特色

- 自动抓取各大新闻源的热门文章
- 使用AI模型生成简洁准确的摘要
- 情感分析和趋势预测
- 支持多种输出格式（Markdown, HTML, PDF）
- 可自定义推送时间

## 安装

```bash
git clone https://github.com/JMOKSZ/ai-news-digest.git
cd ai-news-digest
npm install
```

## 使用

```bash
# 生成今日新闻摘要
node index.js --today

# 生成特定主题的摘要
node index.js --topic "technology"

# 生成指定日期范围的摘要
node index.js --date-range "2026-01-01,2026-01-31"
```

## 配置

复制 `.env.example` 为 `.env` 并填入相应配置：

```bash
cp .env.example .env
```

## API支持

本工具支持以下AI模型：
- Azure OpenAI
- OpenAI GPT系列
- 以及其他兼容的API

## 贡献

欢迎提交Issue和Pull Request来帮助改进此项目。