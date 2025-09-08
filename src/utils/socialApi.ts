import { SocialPost } from './types';
import { generateSocialId } from './idGenerator';

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
    
    // Ensure all posts have unique IDs and return shuffled posts
    const postsWithUniqueIds = posts.map(post => ({
      ...post,
      id: generateSocialId(post.id, post.title, post.author)
    }));
    
    return [...postsWithUniqueIds].sort(() => Math.random() - 0.5);
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
    
    const filteredPosts = posts.filter(post => 
      post.title.toLowerCase().includes(searchQuery) ||
      post.description.toLowerCase().includes(searchQuery) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery)) ||
      post.author.toLowerCase().includes(searchQuery)
    );
    
    // Ensure all filtered posts have unique IDs
    return filteredPosts.map(post => ({
      ...post,
      id: generateSocialId(post.id, post.title, post.author)
    }));
  } catch (error) {
    console.error('Error searching social posts:', error);
    return [];
  }
};
