import {
  areItemsDuplicates,
  removeDuplicates,
  filterNewItems,
} from '@/utils/deduplication';
import { ContentItem } from '@/store/slices/feedSlice';

const base = (overrides: Partial<ContentItem> = {}): ContentItem => ({
  id: 'n1',
  title: 'Title',
  description: 'desc',
  source: 'Source',
  category: 'news',
  publishedAt: new Date().toISOString(),
  url: 'https://example.com/news/1',
  type: 'news',
  ...overrides,
});

describe('deduplication utils', () => {
  it('areItemsDuplicates returns true for same id', () => {
    const a = base();
    const b = base();
    expect(areItemsDuplicates(a, b)).toBe(true);
  });

  it('removeDuplicates removes duplicate by url/title/type', () => {
    const a = base({ id: 'a', url: 'https://x.com/1', title: 'Same' });
    const b = base({ id: 'b', url: 'https://x.com/1', title: 'Same' });
    const unique = removeDuplicates([a, b]);
    expect(unique).toHaveLength(1);
    expect(unique[0].id).toBe('a');
  });

  it('filterNewItems filters out existing-like items', () => {
    const existing = [base({ id: 'e1', url: 'https://y.com/1' })];
    const incoming = [
      base({ id: 'e1', url: 'https://y.com/1' }),
      base({ id: 'n2', url: 'https://y.com/2', title: 'Different' }),
    ];
    const filtered = filterNewItems(existing, incoming);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('n2');
  });
});


