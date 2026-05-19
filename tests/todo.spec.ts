import { test, expect } from "@playwright/test";

const API = "http://localhost:3001";

test.describe("Todo app", () => {
  test.beforeEach(async ({ page, request }) => {
    await request.delete(`${API}/test/reset`);
    await page.goto("/");
    await expect(page.getByRole("listitem").first()).toBeVisible();
  });

  test("displays seeded todos on load", async ({ page }) => {
    await expect(page.getByRole("listitem")).toHaveCount(3);
    await expect(page.getByText("Buy groceries")).toBeVisible();
    await expect(page.getByText("Walk the dog")).toBeVisible();
    await expect(page.getByText("Read a book")).toBeVisible();
  });

  test("adds a new todo", async ({ page }) => {
    await page.getByPlaceholder("What needs to be done?").fill("Write tests");
    await page.getByRole("button", { name: "Add" }).click();

    await expect(page.getByText("Write tests")).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(4);
  });

  test("clears the input after adding", async ({ page }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Temporary task");
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByText("Temporary task")).toBeVisible();
    await expect(input).toHaveValue("");
  });

  test("does not add empty todo", async ({ page }) => {
    await page.getByRole("button", { name: "Add" }).click();
    await expect(page.getByRole("listitem")).toHaveCount(3);
  });

  test("toggles a todo as completed", async ({ page }) => {
    const firstItem = page.getByRole("listitem").first();
    const checkbox = firstItem.getByRole("checkbox");

    await expect(checkbox).not.toBeChecked();
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await expect(firstItem.locator("span")).toHaveCSS("text-decoration-line", "line-through");
  });

  test("toggles a completed todo back to active", async ({ page }) => {
    const firstItem = page.getByRole("listitem").first();
    const checkbox = firstItem.getByRole("checkbox");

    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(firstItem.locator("span")).toHaveCSS("text-decoration-line", "none");
  });

  test("deletes a todo", async ({ page }) => {
    const firstItem = page.getByRole("listitem").first();
    const title = await firstItem.locator("span").textContent();

    await firstItem.getByRole("button", { name: "Delete" }).click();

    await expect(page.getByRole("listitem")).toHaveCount(2);
    if (title) {
      await expect(page.getByText(title)).not.toBeVisible();
    }
  });

  test("filters to show only active todos", async ({ page }) => {
    await page.getByRole("listitem").first().getByRole("checkbox").click();

    await page.getByRole("button", { name: "active" }).click();

    const items = page.getByRole("listitem");
    await expect(items).toHaveCount(2);

    for (const item of await items.all()) {
      await expect(item.getByRole("checkbox")).not.toBeChecked();
    }
  });

  test("filters to show only completed todos", async ({ page }) => {
    await page.getByRole("listitem").first().getByRole("checkbox").click();

    await page.getByRole("button", { name: "completed" }).click();

    const items = page.getByRole("listitem");
    await expect(items).toHaveCount(1);
    await expect(items.first().getByRole("checkbox")).toBeChecked();
  });

  test("all filter shows every todo", async ({ page }) => {
    await page.getByRole("listitem").first().getByRole("checkbox").click();
    await page.getByRole("button", { name: "completed" }).click();
    await page.getByRole("button", { name: "all" }).click();

    await expect(page.getByRole("listitem")).toHaveCount(3);
  });

  test("shows empty state when filter has no matches", async ({ page }) => {
    await page.getByRole("button", { name: "completed" }).click();
    await expect(page.getByText("Nothing here yet.")).toBeVisible();
    await expect(page.getByRole("listitem")).toHaveCount(0);
  });
});
