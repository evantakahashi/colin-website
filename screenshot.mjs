import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/private/tmp/claude-501/-Users-evantakahashi-Desktop-colin-project/4f67b9fe-12dc-49c5-810f-8156921a6e13/scratchpad/landing.png', fullPage: true });
await browser.close();
console.log('done');
