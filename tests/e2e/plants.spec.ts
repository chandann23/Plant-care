import { test, expect } from '@playwright/test';

// Helper function to create a test user and sign in
async function signIn(page: any) {
  const timestamp = Date.now();
  const email = `planttest${timestamp}@example.com`;
  const password = 'Password123!';
  
  // Register
  await page.goto('/signup');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/^password/i).fill(password);
  await page.getByRole('button', { name: /sign up/i }).click();
  await page.waitForTimeout(1000);
  
  // Sign in
  await page.goto('/signin');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/);
}

test.describe('Plant Management', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('should display plants page', async ({ page }) => {
    await page.goto('/plants');
    await expect(page.getByRole('heading', { name: /my plants/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /add plant/i })).toBeVisible();
  });

  test('should navigate to add plant page', async ({ page }) => {
    await page.goto('/plants');
    await page.getByRole('link', { name: /add plant/i }).click();
    
    await expect(page).toHaveURL(/\/plants\/new/);
    await expect(page.getByRole('heading', { name: /add plant/i })).toBeVisible();
  });

  test('should show validation error when creating plant without name', async ({ page }) => {
    await page.goto('/plants/new');
    await page.getByRole('button', { name: /add plant/i }).click();
    
    await expect(page.getByText(/name is required/i)).toBeVisible();
  });

  test('should successfully create a new plant', async ({ page }) => {
    await page.goto('/plants/new');
    
    const plantName = `Test Plant ${Date.now()}`;
    await page.getByLabel(/^name/i).fill(plantName);
    await page.getByLabel(/species/i).fill('Monstera Deliciosa');
    await page.getByLabel(/location/i).fill('Living Room');
    await page.getByLabel(/notes/i).fill('Needs indirect sunlight');
    
    await page.getByRole('button', { name: /add plant/i }).click();
    
    // Should redirect to plants list
    await page.waitForURL(/\/plants$/);
    await expect(page.getByText(plantName)).toBeVisible();
  });

  test('should display plant details', async ({ page }) => {
    // First create a plant
    await page.goto('/plants/new');
    const plantName = `Detail Plant ${Date.now()}`;
    await page.getByLabel(/^name/i).fill(plantName);
    await page.getByRole('button', { name: /add plant/i }).click();
    await page.waitForURL(/\/plants$/);
    
    // Click on the plant to view details
    await page.getByText(plantName).click();
    await expect(page.getByRole('heading', { name: plantName })).toBeVisible();
  });

  test('should successfully edit a plant', async ({ page }) => {
    // Create a plant
    await page.goto('/plants/new');
    const originalName = `Edit Plant ${Date.now()}`;
    await page.getByLabel(/^name/i).fill(originalName);
    await page.getByRole('button', { name: /add plant/i }).click();
    await page.waitForURL(/\/plants$/);
    
    // Navigate to edit page
    await page.getByText(originalName).click();
    await page.getByRole('link', { name: /edit/i }).click();
    
    // Edit the plant
    const newName = `${originalName} - Updated`;
    await page.getByLabel(/^name/i).fill(newName);
    await page.getByLabel(/species/i).fill('Updated Species');
    await page.getByRole('button', { name: /save/i }).click();
    
    // Should show updated name
    await expect(page.getByText(newName)).toBeVisible();
  });

  test('should successfully delete a plant', async ({ page }) => {
    // Create a plant
    await page.goto('/plants/new');
    const plantName = `Delete Plant ${Date.now()}`;
    await page.getByLabel(/^name/i).fill(plantName);
    await page.getByRole('button', { name: /add plant/i }).click();
    await page.waitForURL(/\/plants$/);
    
    // Navigate to plant details
    await page.getByText(plantName).click();
    
    // Delete the plant
    await page.getByRole('button', { name: /delete/i }).click();
    
    // Confirm deletion in dialog
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();
    
    // Should redirect to plants list
    await page.waitForURL(/\/plants$/);
    
    // Plant should not be visible
    await expect(page.getByText(plantName)).not.toBeVisible();
  });

  test('should filter plants by search', async ({ page }) => {
    // Create multiple plants
    await page.goto('/plants/new');
    await page.getByLabel(/^name/i).fill('Monstera Plant');
    await page.getByRole('button', { name: /add plant/i }).click();
    await page.waitForURL(/\/plants$/);
    
    await page.goto('/plants/new');
    await page.getByLabel(/^name/i).fill('Pothos Plant');
    await page.getByRole('button', { name: /add plant/i }).click();
    await page.waitForURL(/\/plants$/);
    
    // Search for specific plant
    await page.getByPlaceholder(/search/i).fill('Monstera');
    
    await expect(page.getByText('Monstera Plant')).toBeVisible();
    await expect(page.getByText('Pothos Plant')).not.toBeVisible();
  });

  test('should display empty state when no plants exist', async ({ page }) => {
    await page.goto('/plants');
    
    // If no plants, should show empty state
    const hasPlants = await page.getByRole('article').count() > 0;
    if (!hasPlants) {
      await expect(page.getByText(/no plants/i)).toBeVisible();
    }
  });
});
