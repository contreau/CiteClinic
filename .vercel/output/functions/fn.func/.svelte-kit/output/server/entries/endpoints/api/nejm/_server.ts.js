import { JSDOM } from "jsdom";
import { j as json, e as error } from "../../../../chunks/index.js";
import { r as retrieve, c as nejmPARAMS } from "../../../../chunks/serverFunctions.js";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());
function formatName(name) {
  let parts;
  if (name.includes(",")) {
    parts = name.trim().split(",").reverse();
    parts[0] = parts[0].trim();
  } else
    parts = name.split("  ");
  const surname = parts.at(-1);
  parts.pop();
  parts = parts[0];
  parts = parts.split(" ");
  const givenNames = parts.map((name2) => {
    if (name2.includes(".")) {
      let initials = "";
      for (let i = 0; i < name2.length; i++) {
        if (name2[i] !== ".")
          initials += name2[i];
      }
      return initials;
    } else
      return name2[0];
  }).join("");
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
      await page.waitForSelector(".m-article-header__authors", {
        visible: true,
        timeout: 3e3
      });
      const html = await page.content();
      await browser.close();
      const dom = new JSDOM(html).window.document;
      const title = retrieve(dom, nejmPARAMS.title);
      const publishDate = retrieve(dom, nejmPARAMS.publishDate);
      const publishYear = publishDate ? publishDate.split("-")[0] : "null";
      const doi = retrieve(dom, nejmPARAMS.doi);
      const blurb_parent = dom.querySelector(nejmPARAMS.volume) ?? null;
      let volumeAndPageRange = "null";
      if (blurb_parent !== null) {
        const parentArray = blurb_parent.innerHTML.split("<br>");
        const dateAnchorText = blurb_parent.querySelector("a")?.textContent ?? null;
        if (dateAnchorText !== null) {
          for (let i = 0; i < parentArray.length; i++) {
            if (parentArray[i].includes(";")) {
              const selection = parentArray[i];
              volumeAndPageRange = selection.split(";")[1].trim();
              break;
            }
          }
        }
      }
      const rawAuthors = Array.from(dom.querySelectorAll(nejmPARAMS.rawAuthors));
      let authors = rawAuthors.map((el) => el.content);
      try {
        authors.forEach((el, i) => {
          authors[i] = formatName(el);
          if (i > 0)
            authors[i] = " " + authors[i];
        });
        authors[authors.length - 1] += ".";
      } catch (err) {
        console.log(err);
        authors = ["null"];
      }
      let journal = retrieve(dom, nejmPARAMS.journal);
      let journalAbbreviation = "null";
      if (journal === "null") {
        journal = "New England Journal of Medicine";
        journalAbbreviation = "N Engl J Med";
      }
      if (journal === "New England Journal of Medicine")
        journalAbbreviation = "N Engl J Med";
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
