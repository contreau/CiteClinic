const parser = new DOMParser();

// ** Server Calls

// TODO: add URL validation to these fetch functions so server
// doesn't crash when non-URL values are submitted (try native URL constructor)

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

const puppetFetch = async function (input) {
  try {
    const submitURL = new Promise((resolve) => {
      resolve(input.value);
      input.value = "";
    });
    const url = await submitURL;
    const response = await fetch(
      `http://localhost:3000/puppet-fetch?url=${url}`
    );
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
      // const title = dom.querySelector(".heading-title");
      const bylines = Array.from(
        dom.querySelectorAll("[data-test = author-name]")
      );
      // const doi = dom.querySelector(".citation-doi");
      // const publication = dom.getElementById("full-view-journal-trigger");
      const nameset = new Set();
      const authors = [];

      bylines.forEach((e) => {
        if (!nameset.has(e.textContent)) {
          authors.push(e.textContent);
          nameset.add(e.textContent);
        }
      });
      console.log(authors);
    } catch (err) {
      console.error(err);
    }
  }
};

// AMJM
export const parseData_AMJM = async function (input) {
  if (input.value != "") {
    try {
      const dom = await puppetFetch(input);
      const bylines = Array.from(dom.querySelectorAll(".loa__item__name"));
      const nameset = new Set();
      let names = [];

      bylines.forEach((e) => {
        if (e.textContent.trim() != "") {
          if (!nameset.has(e.textContent)) {
            names.push(e.textContent.trim());
            nameset.add(e.textContent);
          }
        }
      });
      console.log(names);
    } catch (err) {
      console.error(err);
    }
  }
};
