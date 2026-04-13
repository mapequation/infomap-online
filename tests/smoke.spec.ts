import { expect, test } from "@playwright/test";

test("renders the static site and runs an example network", async ({ page }) => {
  test.setTimeout(90_000);

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

  const downloadButton = page.getByRole("button", { name: "Download outputs" });
  await expect(downloadButton).toBeEnabled({
    timeout: 60_000,
  });

  await downloadButton.click();
  await expect(page.getByRole("menuitem").first()).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);
});
