import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

const app = express();
const router = express.Router();
puppeteer.use(StealthPlugin());
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

router.get("/scholar-fetch", async (req, res) => {
  const url = req.query.url;
  const response = await fetch(url);
  const text = await response.text();
  res.send(text);
});

router.get("/amjm-fetch", async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);

  try {
    await page.waitForSelector("#onetrust-accept-btn-handler", {
      visible: true,
      timeout: 5000,
    });
    await page.click("#onetrust-accept-btn-handler");
  } catch (error) {
    console.log("Cookie consent button not found or not clickable");
  }

  await page.waitForSelector(".article-header__middle", {
    visible: true,
    timeout: 5000,
  });

  const htmlContent = await page.content();
  await browser.close();
  res.send(htmlContent);
});

router.get("/nejm-fetch", async (req, res) => {
  const url = req.query.url;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector(".m-article-header__authors", {
    visible: true,
    timeout: 5000,
  });

  const htmlContent = await page.content();
  await browser.close();
  res.send(htmlContent);
});

app.use(router);

// server launch command: node server.js
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
