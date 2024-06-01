import { test, expect } from '@playwright/test';

test('incorrect submission fails', async ({ page }) => {
  await page.goto('http://localhost:7800/');
  await page.getByLabel('Pick an assignment:').selectOption('1. Hello')
  await page.locator('#code-block').click();
  await page.locator('#code-block').fill('def hello():\n\treturn "Henlo"');
  await page.getByRole('button', { name: 'Submit' }).click();
  page.once('dialog', dialog => {
    expect(dialog.message()).toBe('incorrect!');
    dialog.accept();
  });
  await expect(page.locator('#feedback-box')).toContainText('AssertionError: \'Henlo\' != \'Hello\'');
});