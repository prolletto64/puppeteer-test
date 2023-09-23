import puppeteer from "puppeteer";
import fse from "fs-extra";
import path from "path";

async function getCategory(category?: string, filtered?: boolean) {
  if (!category)
    category =
      "https://www.ebay.it/b/Computer-portatili-laptop-e-notebook/175672/bn_16546646";
  fse.ensureDirSync("cache");
  fse.ensureDirSync("files");
  let file = "files/products.csv";
  if (!fse.existsSync(file)) {
    fse.createFileSync(file);
    fse.appendFileSync(file, "NAME;PRICE;IMAGE\n");
  }
  if (filtered) category += "?rt=nc&LH_ItemCondition=1000&mag=1";

  const browser = await puppeteer.launch({
    headless: "new",
    userDataDir: path.join(process.cwd(), "cache"),
  });

  let page = (await browser.pages())[0];
  await page.goto(category, { waitUntil: "domcontentloaded" });
  let should = true;
  let i = 1;
  let next;
  while (should) {
    console.log(i);
    const productsEl = await page.$$(".s-item__wrapper.clearfix");
    let products: { name: any; price: any; image: any }[] = [];
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
        image =
          image == "https://ir.ebaystatic.com/cr/v/c1/s_1x2.gif" ? "" : image;
        products.push({ name, price, image });
      })
    );
    products.map((p) => {
      fse.appendFileSync(file, `${p.name};${p.price};${p.image}\n`);
    });
    i++;
    next = await page.$(".pagination__next");
    should = next !== null;
    if (should)
      await Promise.all([
        page.waitForNavigation({ waitUntil: "domcontentloaded" }),
        next?.click(),
      ]);
  }
  browser.close();
}

getCategory(undefined, true);
