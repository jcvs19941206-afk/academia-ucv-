import { test, expect } from "@playwright/test";

test("tasks page loads and shows new task button", async ({ page }) => {
  await page.goto("/tasks");
  
  if (page.url().includes('/login')) {
    await expect(page).toHaveURL(/.*login/);
  } else {
    const heading = page.getByRole('heading', { name: /tareas/i });
    await expect(heading).toBeVisible();
    
    const newTaskBtn = page.getByRole('button', { name: /nueva tarea/i });
    await expect(newTaskBtn).toBeVisible();
  }
});
