const parser = new DOMParser();

// TODO:
// error handle when selectors are not present to scrape from so that a default value is served and server doesn't crash
// remaining journals to route to:
// * The Lancet
// * JAMA
// * BMJ (British Medical Journal)
// * Remove AMJM eventually, keep for now as cookie handling reference

// ** Server Call

const fetchPage = async function (input, route) {
  try {
    const submitURL = new Promise((resolve) => {
      resolve(input.value);
    });
    const url = await submitURL;
    const response = await fetch(`http://localhost:3000/${route}?url=${url}`);
    const text = await response.text();
    return parser.parseFromString(text, "text/html");
  } catch (err) {
    console.error("URL likely invalid.", err);
  }
};

// ** Data Parsing

// PUBMED
export const parseData = async function (input, params) {
  if (input.value != "") {
    try {
      const url = new URL(input.value);
      if (url.host != params.host)
        throw new Error("The provided URL does not match your target.");
      const dom = await fetchPage(input, params.route);
      const title = dom.querySelector(params.title).textContent.trim();
      const bylines = Array.from(dom.querySelectorAll(params.rawAuthors));
      const doi = dom.querySelector(params.doi).textContent.trim();
      const journal = dom.querySelector(params.journal).textContent.trim();
      const nameset = new Set();
      const authors = [];

      bylines.forEach((e) => {
        if (!nameset.has(e.textContent)) {
          authors.push(e.textContent);
          nameset.add(e.textContent);
        }
      });

      const citation = {
        title: title,
        authors: authors,
        doi: doi,
        journal: journal,
      };

      console.log(citation);
      return citation;
    } catch (err) {
      console.error("Invalid URL.", err);
    }
  }
};

// AMJM
// not updating error handling like the rest since this will be dropped eventually
export const parseData_AMJM = async function (input) {
  if (input.value != "") {
    try {
      const dom = await fetchPage(input, "amjm-fetch");
      const title = dom.querySelector(".article-header__title");
      const bylines = Array.from(dom.querySelectorAll(".loa__item__name"));
      const doi = dom.querySelector(".article-header__doi");
      const nameset = new Set();
      let authors = [];

      bylines.forEach((e) => {
        if (e.textContent.trim() != "") {
          if (!nameset.has(e.textContent)) {
            authors.push(e.textContent.trim());
            nameset.add(e.textContent);
          }
        }
      });

      const citation = {
        title: title.textContent.trim(),
        authors: authors,
        doi: doi.textContent.trim(),
        // publication: publication.textContent.trim(),
      };

      console.log(citation);
    } catch (err) {
      console.error(err);
    }
  }
};

// NEJM
export const parseData_NEJM = async function (input, params) {
  if (input.value != "") {
    try {
      const url = new URL(input.value);
      if (url.host != params.host)
        throw new Error("The provided URL does not match your target.");
      const dom = await fetchPage(input, params.route);
      const title = dom.querySelector(params.title).textContent.trim();
      const doi_parent = dom.querySelector(params.doi);
      const doi = Array.from(doi_parent.childNodes)[4].textContent.trim();
      const journal = Array.from(doi_parent.childNodes)[2].textContent.trim();
      const authorsUL = dom.querySelector(params.rawAuthors);
      const authorChildren = Array.from(authorsUL.childNodes);

      const nameset = new Set();
      let authors = [];
      authorChildren.forEach((e) => {
        if (!nameset.has(e.textContent)) {
          authors.push(e.textContent.trim());
          nameset.add(e.textContent);
        }
      });

      const citation = {
        title: title,
        authors: authors,
        doi: doi,
        journal: journal,
      };
      console.log(citation);
    } catch (err) {
      console.error("Invalid URL.", err);
    }
  }
};
