import { chromium } from "playwright";

export async function scrapeTokenData(tokenUrl) {
  const startTime = Date.now();

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(tokenUrl, { waitUntil: "networkidle" });

  await page.waitForSelector("img.object-cover");

  const bannerEl = await page.$("img.object-cover");
  const bannerUrl = bannerEl ? await bannerEl.getAttribute("src") : null;

  const logoEl = await page.$('img[alt$="logo"]');
  const logoUrl = logoEl ? await logoEl.getAttribute("src") : null;

  const nameEl = await page.$("h1.font-bold");
  const tokenName = nameEl ? (await nameEl.textContent()).trim() : null;

  const tickerEl = await page.$("p.text-sm.font-bold");
  const tokenTicker = tickerEl ? (await tickerEl.textContent()).trim() : null;

  const marketCapEl = await page.$('[data-testid="market-cap-value"]');
  const marketCap = marketCapEl ? (await marketCapEl.textContent()).trim() : null;

  const athEl = await page.$('[data-testid="ath-value"]');
  const ath = athEl ? (await athEl.textContent()).trim() : null;

  const volumeEl = await page.$('[data-testid="volume-value"]');
  const volume24h = volumeEl ? (await volumeEl.textContent()).trim() : null;

  const descEl = await page.$("div.break-anywhere.max-w-full.break-words");
  const tokenDescription = descEl ? (await descEl.innerText()).trim() : null;

  const socialsContainer = await page.$(
    "div.order-1.flex.flex-col.justify-between.space-y-2.md\\:mb-3.lg\\:flex-row"
  );

  const socialLinks = {};
  if (socialsContainer) {
    const anchors = await socialsContainer.$$('a[target="_blank"]');
    for (const a of anchors) {
      const href = await a.getAttribute("href");
      if (href) {
        if (href.includes("t.me")) socialLinks["Telegram"] = href;
        else if (href.includes("x.com")) socialLinks["Twitter (X)"] = href;
        else if (href.includes("bit.ly") || href.startsWith("http"))
          socialLinks["Website"] = href;
        else if (href.includes("mexc.com")) socialLinks["MEXC Trade"] = href;
      }
    }
  }

  await browser.close();

  const endTime = Date.now();

  return {
    bannerUrl,
    logoUrl,
    tokenName,
    tokenTicker,
    marketCap,
    ath,
    volume24h,
    tokenDescription,
    socialLinks,
    scrapeTimeSeconds: (endTime - startTime) / 1000,
  };
}
