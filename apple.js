const puppeteer = require('puppeteer');
const { writeFile } = require('fs/promises');
const json2csv = require('json2csv');

const extractImageUrls = async (page) => {
  const imgUrls = await page.evaluate(() => {
    const imgElements = document.querySelectorAll('.img-responsive');
    return Array.from(imgElements).map(img => img.getAttribute('src'));
  });
  return imgUrls;
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      height: 768,
      width: 1366,
    },
  });

  const page = await browser.newPage();
  await page.goto('https://www.myntra.com/');

  await page.waitForSelector('.desktop-searchBar', { visible: true });
  await page.type('.desktop-searchBar', 'Makeup products');
  await page.keyboard.press('Enter');

  await page.waitForSelector('.product-price', { timeout: 5000 }).catch(() => {
    console.error('Timeout: Search results not found.');
  });

  let products = [];
  let imgUrls = [];

  while (products.length < 50) {
    const newData = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product-productMetaInfo');
      const productData = [];

      for (const el of productElements) {
        const name = el.querySelector('.product-product').textContent.trim();
        const price = el.querySelector('.product-price span').textContent.trim();

        productData.push({
          name,
          price,
        });
      }

      return productData;
    });

    const currentImgUrls = await extractImageUrls(page);
    imgUrls = imgUrls.concat(currentImgUrls);

    products = products.concat(newData);
    
    // Scroll to load more products
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });

    // Wait for a while to let the page load more products
    await page.waitForTimeout(3000);
  }

  // Trim the products array to keep only the first 50 products
  products = products.slice(0, 50);

  // Assign the image URLs to the corresponding products
  products.forEach((product, index) => {
    product.imageUrl = imgUrls[index] || '';
  });

  const csv = json2csv.parse(products, { fields: ['name', 'price', 'imageUrl'] });
  await writeFile('products.csv', csv);
  console.log("Data scraped from Myntra for the first 50 products.");
  await browser.close();
};

main();
