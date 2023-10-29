import { JSDOM } from "jsdom";
import { j as json, e as error } from "../../../../chunks/index.js";
import { r as retrieve, n as naturePARAMS, g as getVolumeAndPageRange } from "../../../../chunks/serverFunctions.js";
function formatName(name) {
  const parts = name.split(",");
  const surname = parts[0].trim();
  parts.shift();
  parts[0] = parts[0].trim();
  if (parts[0].includes("."))
    parts[0] = parts[0].slice(0, parts[0].length - 1);
  let givenNames = parts[0];
  givenNames = givenNames.split(" ").map((name2) => name2[0]).join("");
  return `${surname} ${givenNames}`;
}
async function GET({ url }) {
  try {
    const target = url.searchParams.get("url");
    if (target !== null) {
      const response = await fetch(target);
      const html = await response.text();
      const dom = new JSDOM(html).window.document;
      const title = retrieve(dom, naturePARAMS.title);
      if (title === "null")
        throw new Error("Invalid URL.");
      const publishDate = retrieve(dom, naturePARAMS.publishDate);
      const publishYear = publishDate ? publishDate.split("-")[0] : "null";
      const rawAuthors = Array.from(dom.querySelectorAll(naturePARAMS.rawAuthors));
      let authors = rawAuthors.map(
        (el) => el.content.trim()
      );
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
      const volumeAndPageRange = getVolumeAndPageRange(dom, naturePARAMS);
      const doi = retrieve(dom, naturePARAMS.doi);
      const journal = retrieve(dom, naturePARAMS.journal);
      const journalAbbreviation = retrieve(dom, naturePARAMS.journalAbbrev);
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
