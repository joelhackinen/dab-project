import { test, expect } from '@playwright/test';

test('correct submission updates the points', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  await expect(page.locator('#points-bar').locator('#points')).toHaveText('0 / 300');
  await page.getByLabel('Pick an assignment:').selectOption('1. Hello');
  await expect(page.locator('#assignment-handout')).toContainText('Write a function "hello" that returns the string "Hello"');
  await page.locator('#code-block').click();
  await page.locator('#code-block').fill('def hello():\n\treturn "Hello"');
  page.once('dialog', dialog => {
    dialog.accept();
  });
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('#points-bar').locator('#points')).toHaveText('100 / 300');
  await page.getByLabel('Pick an assignment:').selectOption('2. Hello world');
  await expect(page.locator('#assignment-handout')).toContainText('Write a function "hello" that returns the string "Hello world!"');
});