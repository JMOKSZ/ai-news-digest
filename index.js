/**
 * AI News Digest Generator
 * 一个AI驱动的新闻摘要和趋势分析工具
 */

require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');
const puppeteer = require('puppeteer');
const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');

class NewsDigestGenerator {
  constructor() {
    // 初始化AI客户端
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY,
      baseURL: process.env.AZURE_OPENAI_ENDPOINT || undefined,
      defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION || undefined },
      defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY || undefined }
    });
    
    // 新闻源列表
    this.newsSources = [
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com',
        selector: '.post-block__title a'
      },
      {
        name: 'Hacker News',
        url: 'https://news.ycombinator.com',
        selector: 'a.storylink'
      },
      {
        name: 'Reddit Top Posts',
        url: 'https://www.reddit.com',
        selector: 'h3._eYtD2XCVieq6emjKBH3_'
      }
    ];
  }

  /**
   * 从新闻源抓取文章链接
   */
  async fetchNewsFromSource(source) {
    console.log(`Fetching news from ${source.name}...`);
    
    try {
      const response = await axios.get(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const links = [];
      
      $(source.selector).each((index, element) => {
        if (links.length >= 5) return false; // 只取前5个
        
        const title = $(element).text().trim();
        let href = $(element).attr('href');
        
        // 处理相对链接
        if (href && !href.startsWith('http')) {
          href = new URL(href, source.url).toString();
        }
        
        if (title && href) {
          links.push({ title, url: href });
        }
      });
      
      return links;
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error.message);
      return [];
    }
  }

  /**
   * 使用AI生成文章摘要
   */
  async generateSummary(articleTitle, articleContent) {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.MODEL_NAME || "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一位专业的新闻编辑，擅长撰写简洁准确的新闻摘要。请用中文为以下新闻生成一段不超过150字的摘要，并分析其情感倾向（正面/负面/中性）和重要性等级（高/中/低）。"
          },
          {
            role: "user",
            content: `新闻标题: ${articleTitle}\n\n新闻内容: ${articleContent.substring(0, 2000)}`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating summary:', error.message);
      return '摘要生成失败';
    }
  }

  /**
   * 从网页提取主要内容
   */
  async extractContent(url) {
    try {
      // 使用puppeteer获取完整内容
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // 提取页面正文
      const content = await page.evaluate(() => {
        // 移除广告和无关元素
        const selectorsToRemove = [
          'script', 'style', 'nav', 'header', 'footer', 
          '.advertisement', '.ads', '.sidebar'
        ];
        
        selectorsToRemove.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => el.remove());
        });
        
        // 尝试获取主要内容
        const mainContent = document.querySelector('main') ||
                           document.querySelector('.content') ||
                           document.querySelector('.post-body') ||
                           document.querySelector('article') ||
                           document.body;
                           
        return mainContent ? mainContent.innerText : '';
      });
      
      await browser.close();
      return content.substring(0, 5000); // 限制长度
    } catch (error) {
      console.error('Error extracting content:', error.message);
      return '';
    }
  }

  /**
   * 生成今日新闻摘要
   */
  async generateTodaysDigest() {
    console.log('Generating today\'s news digest...');
    
    const articles = [];
    
    // 从各个新闻源抓取文章
    for (const source of this.newsSources) {
      const sourceArticles = await this.fetchNewsFromSource(source);
      
      for (const article of sourceArticles) {
        console.log(`Processing: ${article.title}`);
        
        // 提取文章内容
        const content = await this.extractContent(article.url);
        
        if (content) {
          // 生成AI摘要
          const aiSummary = await this.generateSummary(article.title, content);
          
          articles.push({
            title: article.title,
            url: article.url,
            source: source.name,
            summary: aiSummary,
            timestamp: new Date().toISOString()
          });
        }
        
        // 避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // 生成摘要报告
    const report = this.generateReport(articles);
    
    // 保存报告
    const fileName = `news_digest_${moment().format('YYYYMMDD')}.md`;
    await fs.writeFile(path.join(__dirname, fileName), report);
    
    console.log(`News digest saved to ${fileName}`);
    return { articles, fileName };
  }

  /**
   * 生成报告
   */
  generateReport(articles) {
    let report = `# AI News Digest - ${moment().format('YYYY年MM月DD日')}\n\n`;
    report += `共收集 ${articles.length} 篇新闻。\n\n`;
    
    articles.forEach((article, index) => {
      report += `## ${index + 1}. ${article.title}\n`;
      report += `- 来源: ${article.source}\n`;
      report += `- 链接: ${article.url}\n`;
      report += `- 摘要: ${article.summary}\n\n`;
    });
    
    report += `---\nGenerated by [AI News Digest](https://github.com/JMOKSZ/ai-news-digest) at ${new Date().toISOString()}`;
    
    return report;
  }
}

// 如果直接运行此文件
if (require.main === module) {
  (async () => {
    const generator = new NewsDigestGenerator();
    
    try {
      await generator.generateTodaysDigest();
      console.log('News digest generation completed!');
    } catch (error) {
      console.error('Error generating news digest:', error);
    }
  })();
}

module.exports = NewsDigestGenerator;