import { test, expect } from '@playwright/test';

test('integration example passes', async () => {
  const result = [1, 2, 3].map((value) => value * 2);
  expect(result).toEqual([2, 4, 6]);
});
