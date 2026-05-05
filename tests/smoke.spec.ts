import { expect, test } from "@playwright/test";

test("renders the static site and runs an example network", async ({
  page,
}) => {
  test.setTimeout(90_000);

  await page.goto("/infomap/");

  await expect(
    page.getByRole("banner").getByRole("heading", { name: "Infomap Online" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /open workbench/i }).first(),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /navigator/i })).toHaveCount(0);
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);

  await page.goto("/infomap/online");

  await expect(
    page.getByRole("heading", { name: "Network input" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Run Infomap" })).toBeVisible();
  await expect(page.getByRole("button", { name: /show network/i })).toHaveCount(
    0,
  );
  await expect(page.getByRole("link", { name: /navigator/i })).toHaveCount(0);
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);

  await page.getByRole("button", { name: "Two triangles" }).click();
  await page.getByRole("button", { name: "Run Infomap" }).click();

  const cluButton = page.getByRole("button", { name: "Clu", exact: true });
  await expect(cluButton).toBeVisible({
    timeout: 60_000,
  });
  await cluButton.click();

  const downloadButton = page.getByRole("button", {
    name: "Download",
    exact: true,
  });
  await expect(downloadButton).toBeEnabled({
    timeout: 10_000,
  });

  await expect(
    page.getByRole("button", { name: "Download All" }),
  ).toBeEnabled();
  await expect(page.getByRole("button", { name: /download svg/i })).toHaveCount(
    0,
  );
  await expect(page.getByText("Something went wrong.")).toHaveCount(0);
});
