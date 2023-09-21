import { randomUUID } from "crypto";
import puppeteer from "puppeteer";
import fs from "fs";

async function run() {
  if (!fs.existsSync("images")) fs.mkdirSync("images");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://presearch.com/");
  await page.screenshot({ path: `images/${randomUUID()}.png` });
  browser.close();
}

run();
