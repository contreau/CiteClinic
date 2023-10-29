import { JSDOM } from "jsdom";
import { j as json, e as error } from "../../../../chunks/index.js";
import { r as retrieve, j as jamaPARAMS, a as affixes, g as getVolumeAndPageRange } from "../../../../chunks/serverFunctions.js";
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
      const response = await fetch(target);
      const html = await response.text();
      const dom = new JSDOM(html).window.document;
      const title = retrieve(dom, jamaPARAMS.title);
      if (title === "null")
        throw new Error("Invalid URL.");
      let publishDate = retrieve(dom, jamaPARAMS.publishDate);
      if (publishDate === "null") {
        publishDate = retrieve(dom, 'meta[name="citation_online_date"]');
      }
      const publishYear = publishDate ? publishDate.split("/")[0] : "null";
      const rawAuthors = Array.from(dom.querySelectorAll(jamaPARAMS.rawAuthors));
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
      const doi = retrieve(dom, jamaPARAMS.doi);
      const journal = retrieve(dom, jamaPARAMS.journal);
      const journalAbbreviation = retrieve(dom, jamaPARAMS.journalAbbrev);
      const volumeAndPageRange = getVolumeAndPageRange(dom, jamaPARAMS);
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
