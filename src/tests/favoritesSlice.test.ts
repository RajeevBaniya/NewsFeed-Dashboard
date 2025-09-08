import reducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
} from '@/store/slices/favoritesSlice';
import { ContentItem } from '@/store/slices/feedSlice';

const sampleItem = (overrides: Partial<ContentItem> = {}): ContentItem => ({
  id: '1',
  title: 'Sample',
  description: 'desc',
  source: 'src',
  category: 'cat',
  publishedAt: new Date().toISOString(),
  url: 'https://example.com/1',
  type: 'news',
  ...overrides,
});

describe('favoritesSlice', () => {
  it('addToFavorites should add when not existing', () => {
    const item = sampleItem();
    const s = reducer(undefined, addToFavorites(item));
    expect(s.items).toHaveLength(1);
    expect(s.items[0].id).toBe('1');
  });

  it('addToFavorites should not duplicate existing', () => {
    const item = sampleItem();
    const s1 = reducer(undefined, addToFavorites(item));
    const s2 = reducer(s1, addToFavorites(item));
    expect(s2.items).toHaveLength(1);
  });

  it('toggleFavorite should add then remove', () => {
    const item = sampleItem({ id: '2', url: 'https://example.com/2' });
    const s1 = reducer(undefined, toggleFavorite(item));
    expect(s1.items.find(i => i.id === '2')).toBeTruthy();
    const s2 = reducer(s1, toggleFavorite(item));
    expect(s2.items.find(i => i.id === '2')).toBeFalsy();
  });

  it('removeFromFavorites should remove by id', () => {
    const item = sampleItem({ id: '3', url: 'https://example.com/3' });
    const s1 = reducer(undefined, addToFavorites(item));
    const s2 = reducer(s1, removeFromFavorites('3'));
    expect(s2.items).toHaveLength(0);
  });

  it('clearFavorites should empty the list', () => {
    const s1 = reducer(undefined, addToFavorites(sampleItem({ id: 'a' })));
    const s2 = reducer(s1, clearFavorites());
    expect(s2.items).toHaveLength(0);
    expect(s2.lastUpdated).toBeNull();
  });
});


