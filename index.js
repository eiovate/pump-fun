import express from "express";
import { scrapeTokenData } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const tokenUrl = "https://pump.fun/coin/23yCGPFWA8rf2uQpBgY3xq3fenJni5GsWSic9qsZy28x";

app.get("/api/tokenomics", async (req, res) => {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return res.json(cache.data);
  }

  try {
    const data = await scrapeTokenData(tokenUrl);
    cache = { data, timestamp: now };
    res.json(data);
  } catch (error) {
    console.error("Scrape failed:", error);
    res.status(500).json({ error: "Failed to scrape token data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
