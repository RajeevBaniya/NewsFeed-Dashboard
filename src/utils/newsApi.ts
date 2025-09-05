import { NewsArticle, NewsApiResponse, NewsApiArticle } from './types';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

export const fetchNewsArticles = async (category: string = 'technology'): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY) {
    throw new Error('NewsAPI key not found');
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=us&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from NewsAPI');
    }
    
    return data.articles.map((article: NewsApiArticle, index: number) => ({
      id: `news-${index}-${Date.now()}`,
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      url: article.url || '#',
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown source'
      },
      category: category
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const searchNews = async (query: string): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY) {
    throw new Error('NewsAPI key not found');
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`NewsAPI search failed: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from NewsAPI');
    }
    
    return data.articles.map((article: NewsApiArticle, index: number) => ({
      id: `search-${index}-${Date.now()}`,
      title: article.title || 'No title available',
      description: article.description || 'No description available',
      url: article.url || '#',
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown source'
      },
      category: 'search'
    }));
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};