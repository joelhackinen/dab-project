import { test, expect } from '@playwright/test';

test('correct submission doesnt fail', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  await page.getByLabel('Pick an assignment:').selectOption('1. Hello')
  await page.locator('#code-block').click();
  await page.locator('#code-block').fill('def hello():\n\treturn "Hello"');
  await page.getByRole('button', { name: 'Submit' }).click();
  page.on('dialog', dialog => {
    expect(dialog.message()).toBe('correct!');
    dialog.accept();
  });
});