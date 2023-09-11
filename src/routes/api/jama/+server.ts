import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { jamaPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import type { Citation } from '../../../ts/types.js';

// Formats author names
function formatName(name: string) {
	const parts = name.split(' ');
	const surname = parts[parts.length - 1].trim();
	parts.pop();
	const givenNames = parts.map((name: string) => name[0]).join('');
	return `${surname} ${givenNames}`; // Join the surname and initials into the final string
}

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		if (target !== null) {
			const response = await fetch(target);
			const html = await response.text();
			const dom = new JSDOM(html).window.document;

			// Title
			const title = retrieve(dom, jamaPARAMS.title);

			// Publish Date
			let publishDate = retrieve(dom, jamaPARAMS.publishDate);
			if (publishDate === 'null') {
				publishDate = retrieve(dom, 'meta[name="citation_online_date"]');
			}
			const publishYear = publishDate ? publishDate.split('/')[0] : 'null';

			// Authors
			const rawAuthors: Element[] = Array.from(dom.querySelectorAll(jamaPARAMS.rawAuthors));
			let authors: string[] = rawAuthors.map((el: Element) => (el as HTMLMetaElement).content);
			try {
				authors.forEach((el: string, i) => {
					authors[i] = formatName(el);
					if (i > 0) authors[i] = ' ' + authors[i];
				});
				authors[authors.length - 1] += '.';
			} catch (err) {
				console.log(err);
				authors = ['null'];
			}

			// DOI
			const doi = retrieve(dom, jamaPARAMS.doi);

			// Journal
			const journal = retrieve(dom, jamaPARAMS.journal);
			const journalAbbreviation = retrieve(dom, jamaPARAMS.journalAbbrev);

			// Volume + Page Range
			const volumeAndPageRange = getVolumeAndPageRange(dom, jamaPARAMS);

			const citation: Citation = {
				title: title + '.',
				publishDate: publishDate,
				publishYear: publishYear + ';',
				authors: authors,
				doi: doi,
				volumeAndPageRange: volumeAndPageRange + '.',
				journal: journal,
				journalAbbreviation: journalAbbreviation + '.'
			};
			return json(citation);
		}
	} catch (err) {
		return new Response(`${err}`);
	}
}
