import axios from "npm:axios";
import cheerio from "npm:cheerio";
import puppeteer from "npm:puppeteer";
import { chromium } from "npm:playwright";
import { PlaywrightCrawler, Dataset } from "npm:crawlee";

// Configuration
const config = {
  startUrl: "https://recorderecomm.clarkcountynv.gov/AcclaimWeb/Search/SearchTypeDocType",
  maxConcurrency: 1,
  maxRequestsPerCrawl: 1,
};

// Selectors
const selectors = {
  searchCriteria: "#SearchCriteria",
  documentTypeDropdown: "#SearchCriteria > div:nth-child(1) > div:nth-child(1) > div > div > div",
  allOption: "text=All",
  dateRangeDropdown: "#SearchCriteria > div:nth-child(1) > div:nth-child(2) > div > span:nth-child(2) > span > span:nth-child(1)",
  yesterdayOption: "text=Yesterday",
  searchButton: "#SearchBtn",
  searchResultGrid: "#SearchResultGrid",
  resultRows: "#SearchResultGrid tr",
};

// Crawler definition
const crawler = new PlaywrightCrawler({
  launchContext: {
    launcher: chromium,
  },
  maxConcurrency: config.maxConcurrency,
  maxRequestsPerCrawl: config.maxRequestsPerCrawl,
  async requestHandler({ page, request, log }) {
    log.info(`Processing ${request.url}`);

    await page.goto(request.url, { waitUntil: "networkidle" });
    await page.waitForSelector(selectors.searchCriteria, { state: "visible" });

    // Perform search
    await page.click(selectors.documentTypeDropdown);
    await page.click(selectors.allOption);
    await page.click(selectors.dateRangeDropdown);
    await page.click(selectors.yesterdayOption);
    await page.click(selectors.searchButton);

    await page.waitForSelector(selectors.searchResultGrid, { state: "visible" });

    // Extract data
    const results = await page.$$eval(selectors.resultRows, (rows) =>
      rows.slice(1).map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          documentNumber: cells[1]?.textContent?.trim() || "",
          recordDate: cells[2]?.textContent?.trim() || "",
          documentType: cells[3]?.textContent?.trim() || "",
          names: cells[4]?.textContent?.trim() || "",
        };
      })
    );

    if (results.length === 0) {
      throw new Error("No results found. The page structure might have changed.");
    }

    // Store the results
    await Dataset.pushData({
      url: request.url,
      results,
      timestamp: new Date().toISOString(),
    });

    log.info(`Successfully scraped ${results.length} records from ${request.url}`);
  },
  failedRequestHandler({ request, error, log }) {
    log.error(`Request ${request.url} failed ${request.retryCount} times. Error: ${error.message}`);
  },
});

// Run the crawler
await crawler.run([config.startUrl]);

// Export the results
await Dataset.exportToJSON("county_records");

console.log("Scraping completed successfully");