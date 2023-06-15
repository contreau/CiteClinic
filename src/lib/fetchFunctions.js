const parser = new DOMParser();

// ** Server Calls

// TODO: add URL validation to these fetch functions so server
// doesn't crash when non-URL values are submitted (try native URL constructor)
// error handle when selectors are not present to scrape from so that a default value is served and server doesn't crash

const fetchPage = async function (input) {
  try {
    const submitURL = new Promise((resolve) => {
      resolve(input.value);
    });
    const url = await submitURL;
    const response = await fetch(
      `http://localhost:3000/scholar-fetch?url=${url}`
    );
    const text = await response.text();
    return parser.parseFromString(text, "text/html");
  } catch (err) {
    console.error("URL likely invalid.", err);
  }
};

const puppetAMJM = async function (input) {
  try {
    const submitURL = new Promise((resolve) => {
      resolve(input.value);
      input.value = "";
    });
    const url = await submitURL;
    const response = await fetch(`http://localhost:3000/amjm-fetch?url=${url}`);
    const text = await response.text();
    return parser.parseFromString(text, "text/html");
  } catch (err) {
    console.log();
    console.error("URL likely invalid.", err);
  }
};

const puppetNEJM = async function (input) {
  try {
    const submitURL = new Promise((resolve) => {
      resolve(input.value);
      input.value = "";
    });
    const url = await submitURL;
    const response = await fetch(`http://localhost:3000/nejm-fetch?url=${url}`);
    const text = await response.text();
    return parser.parseFromString(text, "text/html");
  } catch (err) {
    console.log();
    console.error("URL likely invalid.", err);
  }
};

// ** Data Parsing

// PUBMED
export const parseData_PubMed = async function (input) {
  if (input.value != "") {
    try {
      const dom = await fetchPage(input);
      const title = dom.querySelector(".heading-title");
      const bylines = Array.from(dom.querySelectorAll(".full-name"));
      const doi = dom.querySelector(".citation-doi");
      const publication = dom.querySelector("#full-view-journal-trigger");
      const nameset = new Set();
      const authors = [];

      bylines.forEach((e) => {
        if (!nameset.has(e.textContent)) {
          authors.push(e.textContent);
          nameset.add(e.textContent);
        }
      });

      const citation = {
        title: title.textContent.trim(),
        authors: authors,
        doi: doi.textContent.trim(),
        publication: publication.textContent.trim(),
      };

      console.log(citation);
      return citation;
    } catch (err) {
      console.error(err);
    }
  }
};

// NATURE
export const parseData_Nature = async function (input) {
  if (input.value != "") {
    try {
      const dom = await fetchPage(input);
      const title = dom.querySelector(".c-article-title").textContent;
      const citationText = dom
        .querySelector(".c-bibliographic-information__citation")
        .textContent.trim();
      const doi = dom.querySelector(
        "span.c-bibliographic-information__value"
      ).textContent;

      const bylines = Array.from(
        dom.querySelectorAll("[data-test = author-name]")
      );
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
        citationText: citationText,
      };
      console.log(citation);
    } catch (err) {
      console.error(err);
    }
  }
};

// AMJM
export const parseData_AMJM = async function (input) {
  if (input.value != "") {
    try {
      const dom = await puppetAMJM(input);
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
export const parseData_NEJM = async function (input) {
  if (input.value != "") {
    try {
      const dom = await puppetNEJM(input);
      const title = dom.querySelector(".title_default");
      const doi_parent = dom.querySelector("p.f-ui");
      const doi = Array.from(doi_parent.childNodes)[4].textContent.trim();
      const authorsUL = dom.querySelector(".m-article-header__authors");
      const authorChildren = Array.from(authorsUL.childNodes);

      const nameset = new Set();
      let authors = [];
      authorChildren.forEach((e) => {
        if (!nameset.has(e.textContent)) {
          authors.push(e.textContent);
          nameset.add(e.textContent);
        }
      });

      const citation = {
        title: title.textContent.trim(),
        authors: authors,
        doi: doi,
      };
      console.log(citation);
    } catch (err) {
      console.error(err);
    }
  }
};
