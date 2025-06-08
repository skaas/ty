import { tryMerge } from 'app/utils';

describe('tryMerge', () => {
  it('returns the next coin value when merge reaches it', () => {
    expect(tryMerge(1, 10)).toBe(10);
    expect(tryMerge(50, 3)).toBe(100);
    expect(tryMerge(100, 5)).toBe(500);
  });

  it('returns the original value when insufficient to upgrade', () => {
    expect(tryMerge(50, 1)).toBe(50);
    expect(tryMerge(100, 2)).toBe(100);
  });

  it('caps at the highest defined coin value', () => {
    expect(tryMerge(1000, 5)).toBe(1000);
  });
});
