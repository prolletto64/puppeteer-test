import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

async function getCategory(c?: string) {
  if (!c)
    c =
      "https://www.ebay.it/b/Computer-portatili-laptop-e-notebook/175672/bn_16546646";
  if (!fs.existsSync("cache")) fs.mkdirSync("cache");

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: path.join(process.cwd(), "cache"),
  });

  let page = (await browser.pages())[0];
  await page.goto(c, { waitUntil: "domcontentloaded" });
}

getCategory();
