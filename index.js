const puppeteer = require('puppeteer');

const naverNewsUrl = 'https://news.naver.com/section/100';

const aTagElement = 'body > div > div#ct_wrap > div.ct_scroll_wrapper > div#newsct > div > div > ul > li > div > div > div.sa_text > a';

(async () => {
  const brower = await puppeteer.launch({ headless: true });
  const page = await brower.newPage();

  // 1. 섹션 페이지로 이동
  await page.goto(naverNewsUrl, { waitUntil: 'networkidle2' });
  await page.screenshot({
    fullPage: true,
    path: 'page-test.jpeg',
  });

  const aTagList = await page.$$eval(
    aTagElement,
    ele => ele.map(e => e.href),
  );
  console.log(aTagList);
})();
