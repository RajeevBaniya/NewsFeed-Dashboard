import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ContentCard from '@/components/content/ContentCard';
import { renderWithStore } from './test-utils';
import { ContentItem } from '@/store/slices/feedSlice';

const item = (overrides: Partial<ContentItem> = {}): ContentItem => ({
  id: 'x1',
  title: 'Sample News',
  description: 'desc',
  imageUrl: '',
  source: 'NewsAPI',
  category: 'technology',
  publishedAt: new Date().toISOString(),
  url: 'https://example.com',
  type: 'news',
  readTime: 3,
  ...overrides,
});

describe('ContentCard', () => {
  it('renders title and metadata and action text', () => {
    renderWithStore(<ContentCard item={item()} />);
    expect(screen.getByText('Sample News')).toBeInTheDocument();
    expect(screen.getByText(/NewsAPI/)).toBeInTheDocument();
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    expect(screen.getByText('Read More')).toBeInTheDocument();
  });

  it('toggles favorite without triggering onOpen', () => {
    const onOpen = jest.fn();
    renderWithStore(<ContentCard item={item()} onOpen={onOpen} />);
    const btn = screen.getByRole('button', { name: /add to favorites|remove from favorites/i });
    fireEvent.click(btn);
    expect(onOpen).not.toHaveBeenCalled();
  });
});


