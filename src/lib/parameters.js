export const pubmedPARAMS = {
  title: ".heading-title",
  rawAuthors: ".full-name",
  doi: ".citation-doi",
  journal: "#full-view-journal-trigger",
  host: "pubmed.ncbi.nlm.nih.gov",
  route: "scholar-fetch",
};

export const naturePARAMS = {
  title: ".c-article-title",
  rawAuthors: "[data-test = author-name]",
  doi: ".c-bibliographic-information__list-item--doi span.c-bibliographic-information__value",
  journal: "[data-test = journal-title]",
  host: "www.nature.com",
  route: "scholar-fetch",
};

export const nejmPARAMS = {
  title: ".title_default",
  rawAuthors: ".m-article-header__authors",
  doi: "p.f-ui",
  host: "www.nejm.org",
  route: "nejm-fetch",
};
