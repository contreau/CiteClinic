import { JSDOM } from "jsdom";
import { j as json, e as error } from "../../../../chunks/index.js";
import { r as retrieve, l as lancetPARAMS, a as affixes, g as getVolumeAndPageRange } from "../../../../chunks/serverFunctions.js";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
function formatName(name, affixes2) {
  let givenNames;
  let surname;
  const parts = name.split(" ");
  const affix = parts.find((part) => affixes2.includes(part));
  if (affix) {
    const rawGivenNames = name.slice(0, name.indexOf(affix)).trim().split(" ");
    givenNames = rawGivenNames.map((name2) => name2[0]).join("");
    surname = name.slice(name.indexOf(affix), name.length);
  } else {
    surname = parts.at(-1);
    parts.pop();
    givenNames = parts.map((name2) => name2[0]).join("");
  }
  return `${surname} ${givenNames}`;
}
async function GET({ url }) {
  try {
    const target = url.searchParams.get("url");
    if (target !== null) {
      const browser = await puppeteer.launch({ headless: "new" });
      console.log("launching puppeteer");
      const page = await browser.newPage();
      await page.goto(target);
      try {
        await page.waitForSelector("#onetrust-accept-btn-handler", {
          visible: true,
          timeout: 5e3
        });
        await page.click("#onetrust-accept-btn-handler");
      } catch (error2) {
        console.log("Cookie consent button not found or not clickable");
      }
      await page.waitForSelector(".article-header__title", {
        visible: true,
        timeout: 5e3
      });
      const html = await page.content();
      await browser.close();
      const dom = new JSDOM(html).window.document;
      const title = retrieve(dom, lancetPARAMS.title);
      let publishDate = retrieve(dom, lancetPARAMS.publishDate);
      if (publishDate === "null") {
        publishDate = retrieve(dom, 'meta[name="citation_online_date"]');
      }
      const publishYear = publishDate ? publishDate.split("/")[0] : "null";
      const rawAuthors = Array.from(dom.querySelectorAll(lancetPARAMS.rawAuthors));
      let authors = rawAuthors.map((el) => el.content);
      try {
        authors.forEach((el, i) => {
          authors[i] = formatName(el, affixes);
          if (i > 0)
            authors[i] = " " + authors[i];
        });
        authors[authors.length - 1] += ".";
      } catch (err) {
        console.log(err);
        authors = ["null"];
      }
      const doi = retrieve(dom, lancetPARAMS.doi);
      const journal = retrieve(dom, lancetPARAMS.journal);
      const journalAbbreviation = retrieve(dom, lancetPARAMS.journalAbbrev);
      const volumeAndPageRange = getVolumeAndPageRange(dom, lancetPARAMS);
      const citation = {
        title: title + ".",
        displayTitle: title,
        publishDate,
        publishYear: publishYear + ";",
        authors,
        doi,
        volumeAndPageRange: volumeAndPageRange + ".",
        journal,
        journalAbbreviation: journalAbbreviation + ".",
        borderWidth: 0,
        borderColor: "#000000",
        boxShadow: "shadow1"
      };
      return json(citation);
    }
  } catch (err) {
    throw error(404, {
      message: `${err}`
    });
  }
}
export {
  GET
};
