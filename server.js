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

router.get("/puppet-fetch", async (req, res) => {
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

  // await page.screenshot({ path: "beforeAcceptCookie.jpg" });

  await page.waitForSelector(".article-header__middle", {
    visible: true,
    timeout: 5000,
  });

  // ** wait time (comment back in if needed)
  // const pause = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 50);
  // });
  // await pause;

  // await page.screenshot({ path: "afterAcceptCookie.jpg" });

  const htmlContent = await page.content();

  await browser.close();
  res.send(htmlContent);
});

app.use(router);

// server launch command: node server.js
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
