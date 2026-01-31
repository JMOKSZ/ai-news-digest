/**
 * X/Twitter 内容发布器
 * 用于发布AI翻译的科技新闻
 */

require('dotenv').config();
const axios = require('axios');

class TwitterContentPublisher {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.baseUrl = 'https://api.twitter.com/2';
    this.headers = {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * 发布推文
   */
  async postTweet(text) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tweets`,
        { text: text },
        { headers: this.headers }
      );

      console.log('推文发布成功:', response.data);
      return response.data;
    } catch (error) {
      console.error('发布推文时出错:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(username) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/users/by/username/${username}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('获取用户信息时出错:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 搜索最近的推文
   */
  async searchRecentTweets(query, maxResults = 10) {
    try {
      const params = new URLSearchParams({
        query: query,
        max_results: maxResults,
        'tweet.fields': 'created_at,author_id,public_metrics,lang',
        'user.fields': 'name,username,verified',
        sort_order: 'relevancy' // 或 'recency'
      });

      const response = await axios.get(
        `${this.baseUrl}/tweets/search/recent?${params.toString()}`,
        { headers: this.headers }
      );

      return response.data;
    } catch (error) {
      console.error('搜索推文时出错:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * 获取热门科技话题
   */
  async getPopularTechTopics() {
    const techQueries = [
      'AI OR artificial intelligence OR machine learning lang:en',
      'technology OR tech OR innovation lang:en',
      'startup OR venture capital OR funding lang:en',
      'programming OR software OR development lang:en',
      'cloud computing OR cybersecurity OR blockchain lang:en'
    ];

    const results = {};
    for (const query of techQueries) {
      try {
        const data = await this.searchRecentTweets(query, 5);
        results[query.split(' ')[0]] = data;
      } catch (error) {
        console.warn(`无法获取 ${query} 的数据:`, error.message);
      }
    }

    return results;
  }

  /**
   * 翻译英文内容为中文
   */
  async translateToChinese(text) {
    // 这里将使用Azure OpenAI进行翻译
    // 模拟翻译过程
    console.log('正在使用AI翻译:', text.substring(0, 50) + '...');
    
    // 返回模拟的翻译结果，实际使用时会调用Azure OpenAI
    return `[AI翻译] ${text.substring(0, 200)}...`; // 模拟翻译结果
  }

  /**
   * 发布精选的科技新闻
   */
  async publishCuratedTechNews() {
    console.log('开始获取并发布精选科技新闻...');
    
    try {
      // 获取热门科技话题
      const topics = await this.getPopularTechTopics();
      
      // 这里我们会实现获取英文科技新闻、翻译、精简并发布的逻辑
      console.log('获取到热门科技话题，准备处理...');
      
      // 示例：发布一条测试推文
      const sampleTweet = `🤖 测试推文：AI正在改变世界！#AI #Technology #Innovation`;
      await this.postTweet(sampleTweet);
      
      console.log('内容发布流程演示完成');
    } catch (error) {
      console.error('发布过程中出现错误:', error);
    }
  }
}

// 如果直接运行此文件
if (require.main === module) {
  // 从命令行参数或环境变量获取Bearer Token
  const bearerToken = process.argv[2] || process.env.TWITTER_BEARER_TOKEN;
  
  if (!bearerToken) {
    console.error('错误: 请提供Twitter Bearer Token');
    process.exit(1);
  }
  
  const publisher = new TwitterContentPublisher(bearerToken);
  
  // 执行发布流程
  publisher.publishCuratedTechNews().catch(console.error);
}

module.exports = TwitterContentPublisher;