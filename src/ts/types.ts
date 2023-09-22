export interface Citation {
	title: string;
	displayTitle: string;
	publishDate: string;
	publishYear: string;
	authors: string[];
	doi: string;
	volumeAndPageRange: string;
	journal: string;
	journalAbbreviation: string;
}

export interface Param {
	title: string;
	publishDate: string;
	rawAuthors: string;
	volume: string;
	issue: string;
	startPage: string;
	endPage: string;
	doi: string;
	journal: string;
	journalAbbrev: string;
	host: string;
	route: string;
}
