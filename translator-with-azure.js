/**
 * 使用Azure OpenAI进行翻译的模块
 * 与X/Twitter内容发布器集成
 */

require('dotenv').config();
const OpenAI = require('openai');

class AzureTranslator {
  constructor() {
    // 初始化Azure OpenAI客户端
    this.openai = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT || undefined,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || undefined },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY || undefined }
    });
    
    this.model = process.env.MODEL_NAME || 'gpt-4';
  }

  /**
   * 将英文文本翻译为中文
   */
  async translateToChinese(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的翻译员，擅长将英文科技新闻翻译成地道、简洁、准确的中文。请保持原文意思不变，但用更符合中文习惯的方式表达。翻译结果应简洁明了，适合社交媒体发布。"
          },
          {
            role: "user",
            content: `请将以下英文内容翻译成中文：\n\n${text}`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('翻译过程中出错:', error.message);
      throw error;
    }
  }

  /**
   * 精简和优化文本，使其适合推文
   */
  async summarizeForTweet(text) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: "你是一位专业的编辑，擅长将较长的文本精简为适合推文发布的短文本。请提取核心信息，保持关键要点，但限制在280字符以内。如果内容过长，可分成多条推文。使用适当的标签#。"
          },
          {
            role: "user",
            content: `请将以下内容精简为适合推文发布的格式：\n\n${text}`
          }
        ],
        max_tokens: 200,
        temperature: 0.4
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('精简文本时出错:', error.message);
      throw error;
    }
  }

  /**
   * 综合处理：翻译+精简
   */
  async translateAndOptimize(text) {
    // 首先翻译
    const translated = await this.translateToChinese(text);
    
    // 然后精简为适合推文的格式
    const optimized = await this.summarizeForTweet(translated);
    
    return optimized;
  }
}

module.exports = AzureTranslator;