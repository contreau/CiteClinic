import { JSDOM } from "jsdom";
import { j as json, e as error } from "../../../../chunks/index.js";
import { r as retrieve, p as pubmedPARAMS } from "../../../../chunks/serverFunctions.js";
async function GET({ url }) {
  try {
    const target = url.searchParams.get("url");
    if (target !== null) {
      const response = await fetch(target);
      const html = await response.text();
      const dom = new JSDOM(html).window.document;
      const title = retrieve(dom, pubmedPARAMS.title);
      if (title === "null")
        throw new Error("Invalid URL.");
      const publishDate = retrieve(dom, pubmedPARAMS.publishDate);
      let publishYear = dom.querySelector(pubmedPARAMS.volume)?.textContent ?? "null";
      if (publishYear.includes(" ")) {
        publishYear = publishYear.split(" ")[0];
      } else if (publishYear.includes(";")) {
        publishYear = publishYear.split(";")[0];
      }
      const rawAuthors = retrieve(dom, pubmedPARAMS.rawAuthors);
      let authors = rawAuthors ? rawAuthors.split(";") : ["null"];
      try {
        if (authors[0] !== "null") {
          authors.pop();
          for (let i = 1; i < authors.length; i++) {
            authors[i] = " " + authors[i];
          }
          authors[authors.length - 1] += ".";
        }
      } catch (err) {
        console.log(err);
        authors = ["null"];
      }
      const doi = retrieve(dom, pubmedPARAMS.doi);
      const journal = retrieve(dom, pubmedPARAMS.journal);
      const journalAbbreviation = retrieve(dom, pubmedPARAMS.journalAbbrev);
      const volumeAndPageRange = dom.querySelector(pubmedPARAMS.volume)?.textContent.split(";")[1]?.trim().split(".")[0] ?? "null";
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
