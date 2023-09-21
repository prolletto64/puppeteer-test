import { randomUUID } from "crypto";
import puppeteer from "puppeteer";
import fs from "fs";

async function run() {
  if (!fs.existsSync("images")) fs.mkdirSync("images");
  const browser = await puppeteer.launch({ headless: false });
  for (let i = 0; i < 100; i++) {
    console.log(i);
    let page = await browser.newPage();
    await page.goto("https://presearch.com/");
    await page.screenshot({ path: `images/${randomUUID()}.png` });
    page.close();
  }
  browser.close();
}

run();
