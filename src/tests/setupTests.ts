import '@testing-library/jest-dom';
import React from 'react';
// Mock Next.js Image to plain img for tests without JSX
jest.mock('next/image', () => ({ __esModule: true, default: (props: Record<string, unknown>) => {
  return React.createElement('img', props as Record<string, unknown>);
}}));

// Polyfill IntersectionObserver for JSDOM
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  constructor(callback: IntersectionObserverCallback) { this.callback = callback; }
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock data-loading hooks to avoid async dispatch side-effects in tests
jest.mock('@/hooks/useInitialContentLoad', () => ({
  useInitialContentLoad: () => {}
}));

jest.mock('@/hooks/useTrendingOnView', () => ({
  useTrendingOnView: () => {}
}));



