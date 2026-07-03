import { test, expect } from "@playwright/test";

test("courses page loads and shows create button", async ({ page }) => {
  // Nota: Esto asume que tienes un estado de sesión o manejas la auth antes. 
  // O bien puedes validar que redirige a login si no hay auth.
  await page.goto("/courses");
  
  // Si no hay sesión, se redirige a login
  if (page.url().includes('/login')) {
    await expect(page).toHaveURL(/.*login/);
  } else {
    const heading = page.getByRole('heading', { name: /cursos/i });
    await expect(heading).toBeVisible();
    
    const newCourseBtn = page.getByRole('button', { name: /nuevo curso/i });
    await expect(newCourseBtn).toBeVisible();
  }
});
