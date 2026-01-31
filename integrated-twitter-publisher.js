/**
 * 整合的X/Twitter内容发布器
 * 结合Azure OpenAI翻译功能
 */

const TwitterContentPublisher = require('./twitter-content-publisher');
const AzureTranslator = require('./translator-with-azure');

class IntegratedPublisher {
  constructor(bearerToken) {
    this.twitter = new TwitterContentPublisher(bearerToken);
    this.translator = new AzureTranslator();
  }

  /**
   * 获取英文科技新闻并发布中文翻译版
   */
  async publishTranslatedTechNews() {
    console.log('开始获取并发布翻译的科技新闻...');
    
    try {
      // 获取热门科技话题
      const topics = await this.twitter.getPopularTechTopics();
      
      // 为演示目的，我们使用一些模拟的英文科技新闻
      const mockEnglishTechNews = [
        "Revolutionary AI model achieves breakthrough in natural language understanding, showing unprecedented ability to reason and solve complex problems.",
        "New quantum computing breakthrough promises to transform cryptography and drug discovery processes.",
        "Major tech companies announce collaboration on ethical AI development standards.",
        "Advanced robotics startup raises $50M to accelerate development of autonomous manufacturing systems.",
        "Scientists develop new battery technology that could extend electric vehicle range by 300%."
      ];
      
      console.log(`找到 ${mockEnglishTechNews.length} 条模拟英文科技新闻，开始处理...`);
      
      for (let i = 0; i < mockEnglishTechNews.length; i++) {
        const englishNews = mockEnglishTechNews[i];
        console.log(`\n处理第 ${i+1} 条新闻...`);
        
        try {
          // 翻译为中文
          console.log('正在翻译...');
          const chineseTranslation = await this.translator.translateAndOptimize(englishNews);
          
          console.log('翻译结果:', chineseTranslation);
          
          // 发布到X（当账户有信用额度时）
          console.log('准备发布到X...');
          // 注意：由于账户目前没有信用额度，这里会失败，但我们保留代码以备后用
          try {
            const result = await this.twitter.postTweet(chineseTranslation);
            console.log(`第 ${i+1} 条推文发布成功!`);
          } catch (postError) {
            console.log(`由于账户信用额度不足，推文未能发布: ${postError.message}`);
            console.log('请充值后重试');
          }
          
          // 避免请求过于频繁
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          console.error(`处理第 ${i+1} 条新闻时出错:`, error.message);
        }
      }
      
      console.log('\n完成所有新闻处理流程');
    } catch (error) {
      console.error('发布过程中出现错误:', error);
    }
  }

  /**
   * 监控特定话题并自动翻译发布
   */
  async monitorAndPublish(topic = 'AI', count = 5) {
    console.log(`开始监控话题: ${topic}`);
    
    try {
      // 搜索相关英文推文
      const searchResults = await this.twitter.searchRecentTweets(`${topic} lang:en`, count);
      
      if (searchResults?.data && searchResults.data.length > 0) {
        console.log(`找到 ${searchResults.data.length} 条相关推文`);
        
        for (const tweet of searchResults.data) {
          console.log(`处理推文: ${tweet.text.substring(0, 60)}...`);
          
          try {
            // 翻译推文内容
            const translated = await this.translator.translateAndOptimize(tweet.text);
            
            // 添加来源标注
            const finalPost = `${translated}\n\n来源: @${tweet.author_id} [原文相关话题]`;
            
            console.log('翻译结果:', finalPost);
            
            // 发布翻译后的内容
            try {
              await this.twitter.postTweet(finalPost);
              console.log('推文发布成功!');
            } catch (postError) {
              console.log(`由于账户信用额度不足，推文未能发布: ${postError.message}`);
            }
            
            // 避免请求过于频繁
            await new Promise(resolve => setTimeout(resolve, 3000));
          } catch (error) {
            console.error('处理推文时出错:', error.message);
          }
        }
      } else {
        console.log(`未找到关于 "${topic}" 的英文推文`);
      }
    } catch (error) {
      console.error('监控过程中出现错误:', error);
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
  
  const integratedPublisher = new IntegratedPublisher(bearerToken);
  
  // 根据命令行参数决定执行哪个功能
  const action = process.argv[3] || 'translateNews';
  
  if (action === 'monitor') {
    const topic = process.argv[4] || 'AI';
    const count = parseInt(process.argv[5]) || 5;
    integratedPublisher.monitorAndPublish(topic, count).catch(console.error);
  } else {
    integratedPublisher.publishTranslatedTechNews().catch(console.error);
  }
}

module.exports = IntegratedPublisher;