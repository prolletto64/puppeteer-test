import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function getCategory(category?: string, filtered?: boolean) {
  if (!category)
    category =
      "https://www.ebay.it/b/Computer-portatili-laptop-e-notebook/175672/bn_16546646";
  if (!fs.existsSync("cache")) fs.mkdirSync("cache");
  if (filtered) category += "?rt=nc&LH_ItemCondition=1000&mag=1";

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: path.join(process.cwd(), "cache"),
  });

  let page = (await browser.pages())[0];
  await page.goto(category, { waitUntil: "domcontentloaded" });
}

getCategory(undefined, true);
