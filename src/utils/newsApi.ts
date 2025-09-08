import { NewsArticle, NewsApiResponse, NewsApiArticle } from './types';
import { generateNewsId } from './idGenerator';

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_COOLDOWN_KEY = 'newsapi_cooldown_until';

function isOnCooldown(): boolean {
  if (typeof window === 'undefined') return false;
  const until = window.localStorage.getItem(NEWS_COOLDOWN_KEY);
  if (!until) return false;
  const ts = parseInt(until, 10);
  return Number.isFinite(ts) && Date.now() < ts;
}

function startCooldown(ms: number) {
  if (typeof window === 'undefined') return;
  const until = Date.now() + ms;
  window.localStorage.setItem(NEWS_COOLDOWN_KEY, String(until));
}

export const fetchNewsArticles = async (category: string = 'technology', page: number = 1): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY) {
    throw new Error('NewsAPI key not found');
  }
  if (isOnCooldown()) {
    // Skip hitting NewsAPI while cooling down
    return [];
  }

  try {
    // Prefer server proxy to respect rate limits and hide key
    const url = typeof window === 'undefined'
      ? `https://newsapi.org/v2/top-headlines?category=${category}&country=us&page=${page}&pageSize=20&apiKey=${NEWS_API_KEY}`
      : `/api/news?category=${encodeURIComponent(category)}&page=${page}`;

    const response = await fetch(url);

    if (!response.ok) {
      // On 426/429, set cooldown (e.g., 1 hour) to avoid hammering the API
      if (response.status === 426 || response.status === 429) {
        startCooldown(60 * 60 * 1000);
      }
      throw new Error(`NewsAPI request failed: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();
    
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid response format from NewsAPI');
    }
    
    return data.articles.map((article: NewsApiArticle, index: number) => ({
      id: generateNewsId(article.url || '', index, category),
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
      id: generateNewsId(article.url || '', index, 'search'),
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