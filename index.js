import express from "express";
import { scrapeTokenData } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const tokenUrl = "https://pump.fun/coin/23yCGPFWA8rf2uQpBgY3xq3fenJni5GsWSic9qsZy28x";

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "👋 Welcome to the Pump.Fun $EIO Tokenomics API!",
    endpoints: {
      "/api": "Basic API info",
      "/api/tokenomics": "Get cached tokenomics data for the token",
    },
    usage: "Visit /api/tokenomics to fetch live data (cached for 5 min)",
  });
});

// /api route
app.get("/api", (req, res) => {
  res.json({
    message: "📡 This is the Pump.Fun $EIO Tokenomics API base.",
    availableRoutes: ["/api/tokenomics"],
  });
});

// Main tokenomics scraping route
app.get("/api/tokenomics", async (req, res) => {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return res.json({
      source: "cache",
      ...cache.data,
    });
  }

  try {
    const data = await scrapeTokenData(tokenUrl);
    cache = { data, timestamp: now };
    res.json({
      source: "fresh",
      ...data,
    });
  } catch (error) {
    console.error("❌ Scrape failed:", error);
    res.status(500).json({ error: "Failed to scrape token data." });
  }
});

// Graceful handling of undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "❓ Route not found",
    message: "This route does not exist on the Pump.Fun $EIO API server.",
    suggestion: "Visit / or /api for help.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
