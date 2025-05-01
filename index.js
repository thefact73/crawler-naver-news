const puppeteer = require('puppeteer');
const { OpenAI } = require('openai');

const openAi = new OpenAI({
  apiKey: 'API Key',
});

const naverNewsUrl = 'https://news.naver.com/section/100';

const newsArray = [];

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

  // 2. 헤드라인 별 링크 저장
  const aTagList = await page.$$eval(
    aTagElement,
    ele => ele.map(e => e.href),
  );
  console.log(aTagList);


  // 3. 뉴스별 제목, 내용 저장
  for (const link of aTagList) {
    await page.goto(link, { waitUntil: 'networkidle2' });
    const title = await page.$eval(
      '#title_area > span',
      el => el.innerText,
    );
    const content = await page.$eval(
      '#dic_area',
      el => el.innerText,
    );
    newsArray.push({ title, content, link });
  }
  console.log(newsArray);

  // 4. ChatGPT 에게 요약 요청
  const response = await openAi.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'title, content, link 오브젝트로 이루어진 배열을 전달합니다.' },
      { role: 'system', content: 'title 은 뉴스의 제목, content 는 뉴스의 내용, link 는 뉴스의 원본 링크 입니다.' },
      { role: 'system', content: '각 뉴스별로 요약하여, markdown 파일을 주세요.' },
      { role: 'system', content: '요약 방법은 다음과 같습니다. 뉴스 제목, 요약 내용, 원본 뉴스 링크, 주요 키워드 입니다.' },
      { role: 'system', content: '요약 내용 외의 다른 응답을 해주시지 말아 주세요.' },
      { role: 'user', content: JSON.stringify(newsArray) },
    ],
    temperature: 0.4,
  });

  console.log(response.choices[0].message.content);
})();
