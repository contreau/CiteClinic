export interface Citation {
	title: string;
	displayTitle: string;
	publishDate: string;
	publishYear: string;
	authors: string[];
	doi: string;
	volume: string | null;
	pages: string | null;
	issue: string | null;
	volumeAndPageRange: string;
	journal: string;
	journalAbbreviation: string;
	borderWidth: number;
	borderColor: string;
	boxShadow: string;
}
