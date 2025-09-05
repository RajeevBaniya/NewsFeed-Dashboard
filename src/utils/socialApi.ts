import { SocialPost } from './types';

export const fetchSocialPosts = async (): Promise<SocialPost[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Fetch data from JSON file
    const response = await fetch('/data/social-posts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch social posts');
    }
    
    const posts: SocialPost[] = await response.json();
    
    // Return shuffled posts to simulate fresh content
    return [...posts].sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error('Error fetching social posts:', error);
    return [];
  }
};

export const searchSocialPosts = async (query: string): Promise<SocialPost[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Fetch data from JSON file
    const response = await fetch('/data/social-posts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch social posts');
    }
    
    const posts: SocialPost[] = await response.json();
    const searchQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery) ||
      post.description.toLowerCase().includes(searchQuery) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      post.author.toLowerCase().includes(searchQuery)
    );
  } catch (error) {
    console.error('Error searching social posts:', error);
    return [];
  }
};
