export const pubmedPARAMS = {
	title: 'meta[name="citation_title"]',
	publishDate: 'meta[name="citation_date"]',
	rawAuthors: '.full-name',
	volume: 'span.cit',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	journalAbbr: 'meta[name="citation_publisher"]',
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
	rawAuthors: '.m-article-header__authors',
	blurb: 'p.f-ui',
	doi: 'meta[scheme="doi"]',
	journal: 'meta[name="citation_journal_title"]',
	host: 'www.nejm.org',
	route: 'nejm-fetch'
};

export const lancetPARAMS = {
	title: '.article-header__title',
	publishDate: '.article-header__publish-date__value',
	rawAuthors: '.loa__item__email',
	doi: '.article-header__doi__value',
	journal: 'meta[name="citation_journal_title"]',
	host: 'www.thelancet.com',
	route: 'lancet-fetch',
	givenCitation: null
};

export const jamaPARAMS = {
	title: '.meta-article-title',
	publishDate: '.meta-date',
	rawAuthors: '.wi-fullname',
	doi: 'meta[name="citation_doi"]',
	journal: 'meta[name="citation_journal_title"]',
	host: 'jamanetwork.com',
	route: 'scholar-fetch',
	givenCitation: null
};

export const bmjPARAMS = {
	title: '.highwire-cite-title',
	publishDate: '.highwire-cite-date',
	rawAuthors: '.contributor-list',
	doi: '.highwire-cite-doi',
	journal: 'meta[name="citation_journal_title"]',
	host: 'www.bmj.com',
	route: 'bmj-fetch',
	givenCitation: null
};
