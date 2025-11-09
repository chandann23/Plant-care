import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display landing page with sign up and sign in buttons', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /plant care/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).first().click();
    await expect(page).toHaveURL(/\/signup/);
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).first().click();
    await expect(page).toHaveURL(/\/signin/);
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors on empty sign up form', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Wait for validation errors to appear
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('should show validation errors on invalid email', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should show validation errors on short password', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('short');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;
    
    await page.goto('/signup');
    
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password/i).fill('Password123!');
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    // Should redirect to sign in or dashboard
    await page.waitForURL(/\/(signin|dashboard)/);
  });

  test('should show error when registering with existing email', async ({ page }) => {
    const email = 'existing@example.com';
    
    // First registration
    await page.goto('/signup');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForTimeout(1000);
    
    // Try to register again with same email
    await page.goto('/signup');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign up/i }).click();
    
    await expect(page.getByText(/already exists/i)).toBeVisible();
  });

  test('should successfully sign in with valid credentials', async ({ page }) => {
    // First create an account
    const timestamp = Date.now();
    const email = `signin${timestamp}@example.com`;
    const password = 'Password123!';
    
    await page.goto('/signup');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/^password/i).fill(password);
    await page.getByRole('button', { name: /sign up/i }).click();
    await page.waitForTimeout(1000);
    
    // Now sign in
    await page.goto('/signin');
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should redirect to dashboard
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/signin');
    
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/signin');
    await page.getByRole('link', { name: /forgot password/i }).click();
    
    await expect(page).toHaveURL(/\/reset-password/);
    await expect(page.getByRole('heading', { name: /reset password/i })).toBeVisible();
  });

  test('should show success message on password reset request', async ({ page }) => {
    await page.goto('/reset-password');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /send reset link/i }).click();
    
    await expect(page.getByText(/check your email/i)).toBeVisible();
  });
});
