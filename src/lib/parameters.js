export const pubmedPARAMS = {
  title: ".heading-title",
  publishDate: null,
  rawAuthors: ".full-name",
  doi: ".citation-doi",
  journal: "#full-view-journal-trigger",
  host: "pubmed.ncbi.nlm.nih.gov",
  route: "scholar-fetch",
  givenCitation: null,
};

export const naturePARAMS = {
  title: ".c-article-title",
  publishDate: "time",
  rawAuthors: "[data-test = author-name]",
  doi: ".c-bibliographic-information__list-item--doi span.c-bibliographic-information__value",
  journal: "[data-test = journal-title]",
  host: "www.nature.com",
  route: "scholar-fetch",
  givenCitation: ".c-bibliographic-information__citation",
};

export const nejmPARAMS = {
  title: ".title_default",
  publishDate: ".o-colset-1-2-2 > .o-col",
  rawAuthors: ".m-article-header__authors",
  doi: "p.f-ui",
  journal: null,
  host: "www.nejm.org",
  route: "nejm-fetch",
  givenCitation: null,
};

export const lancetPARAMS = {
  title: ".article-header__title",
  publishDate: ".article-header__publish-date__value",
  rawAuthors: ".loa__item__email",
  doi: ".article-header__doi__value",
  journal: null,
  host: "www.thelancet.com",
  route: "lancet-fetch",
  givenCitation: null,
};

export const jamaPARAMS = {
  title: ".meta-article-title ",
  publishDate: ".epub",
  rawAuthors: ".wi-fullname",
  doi: ".parapublished-online",
  journal: ".meta-citation-journal-name",
  host: "jamanetwork.com",
  route: "scholar-fetch",
  givenCitation: null,
};

export const bmjPARAMS = {
  title: ".highwire-cite-title",
  publishDate: ".highwire-cite-date",
  rawAuthors: ".contributor-list",
  doi: ".highwire-cite-doi",
  journal: ".highwire-cite-journal",
  host: "www.bmj.com",
  route: "bmj-fetch",
  givenCitation: null,
};
