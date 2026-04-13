import { expect, test } from "@playwright/test";

test("renders the static site and runs an example network", async ({ page }) => {
  await page.goto("/infomap/");

  await expect(
    page.getByRole("banner").getByRole("heading", { name: "Infomap Online" })
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Choose example network" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run Infomap" })).toBeVisible();
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);

  await page.getByRole("button", { name: "Choose example network" }).click();
  await page.getByRole("menuitem", { name: "Two triangles" }).click();
  await page.getByRole("button", { name: "Run Infomap" }).click();

  await expect(page.getByTestId("output-formats")).toContainText("Clu", {
    timeout: 60_000,
  });
  await expect(page.getByRole("button", { name: "Download outputs" })).toBeEnabled();
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);
});
