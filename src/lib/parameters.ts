export const pubmedPARAMS = {
	title: 'meta[name="citation_title"]',
	publishDate: 'meta[name="citation_date"]',
	rawAuthors: 'meta[name="citation_authors"]',
	volume: 'span.cit',
	issue: 'null',
	startPage: 'null',
	endPage: 'null',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'meta[name="citation_publisher"]',
	host: 'pubmed.ncbi.nlm.nih.gov',
	route: 'scholar-fetch'
};

export const naturePARAMS = {
	title: 'meta[name="dc.title"]',
	publishDate: 'meta[name="dc.date"]',
	rawAuthors: '[data-test = author-name]',
	volume: 'meta[name="citation_volume"]',
	issue: 'meta[name="citation_issue"]',
	startPage: 'meta[name="citation_firstpage"]',
	endPage: 'meta[name="citation_lastpage"]',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'meta[name="citation_journal_abbrev"]',
	host: 'www.nature.com',
	route: 'scholar-fetch'
};

export const nejmPARAMS = {
	title: 'meta[name="dc.Title"]',
	publishDate: 'meta[name="dc.Date"]',
	rawAuthors: 'meta[name="dc.Creator"]',
	volume: 'p.f-ui',
	issue: 'null',
	startPage: 'null',
	endPage: 'null',
	doi: 'meta[scheme="doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'null',
	host: 'www.nejm.org',
	route: 'nejm-fetch'
};

export const lancetPARAMS = {
	title: 'meta[name="citation_title"]',
	publishDate: 'meta[name="citation_date"]',
	rawAuthors: 'meta[name="citation_author"]',
	volume: 'meta[name="citation_volume"]',
	issue: 'meta[name="citation_issue"]',
	startPage: 'meta[name="citation_firstpage"]',
	endPage: 'meta[name="citation_lastpage"]',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'meta[name="citation_journal_abbrev"]',
	host: 'www.thelancet.com',
	route: 'lancet-fetch'
};

export const jamaPARAMS = {
	title: 'meta[name="citation_title"]',
	publishDate: 'meta[name="citation_publication_date"]',
	rawAuthors: 'meta[name="citation_author"]',
	volume: 'meta[name="citation_volume"]',
	issue: 'meta[name="citation_issue"]',
	startPage: 'meta[name="citation_firstpage"]',
	endPage: 'meta[name="citation_lastpage"]',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'meta[name="citation_journal_abbrev"]',
	host: 'jamanetwork.com',
	route: 'scholar-fetch'
};

export const bmjPARAMS = {
	title: 'meta[name="DC.Title"]',
	publishDate: 'meta[name="DC.Date"]',
	rawAuthors: 'meta[name="citation_author"]',
	volume: 'meta[name="citation_volume"]',
	issue: 'meta[name="citation_issue"]',
	startPage: 'meta[name="citation_firstpage"]',
	endPage: 'meta[name="citation_lastpage"]',
	doi: 'meta[name="DC.Identifier"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbrev: 'meta[name="citation_journal_abbrev"]',
	host: 'www.bmj.com',
	route: 'bmj-fetch'
};
