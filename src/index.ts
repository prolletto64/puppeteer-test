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
  let products = [];
  let should = true;
  let i = 1;
  let next;
  while (should) {
    console.log(i);
    const productsEl = await page.$$(".s-item__wrapper.clearfix");
    await Promise.all(
      productsEl.map(async (p) => {
        let name = await p.$eval(".s-item__title ", (el) =>
          el.innerText.trim()
        );
        let price = await p.$eval(".s-item__price", (el) =>
          el.innerText.trim()
        );
        let image = await p.$eval(".s-item__image-img", (el) =>
          el.getAttribute("src")
        );
        products.push({ name, price, image });
      })
    );
    i++;
    next = await page.$(".pagination__next");
    should = next !== null;
    if (should)
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        next?.click(),
      ]);
  }
}

getCategory(undefined, true);
