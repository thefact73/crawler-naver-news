const puppeteer = require('puppeteer');

const naverNewsUrl = 'https://news.naver.com/section/100';

(async () => {
  const brower = await puppeteer.launch({ headless: true });
  const page = await brower.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
    'AppleWebKit/537.36 (KHTML, like Gecko) ' +
    'Chrome/115.0.0.0 Safari/537.36',
  );

  // 1. 섹션 페이지로 이동
  await page.goto(naverNewsUrl, { waitUntil: 'networkidle2' });
  await page.screenshot({
    fullPage: true,
    path: 'page-test.jpeg',
  });
})();
