import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { jamaPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import type { Citation } from '../../../ts/types.js';
import { affixes } from '../../../ts/serverFunctions.js';

// Formats author names
function formatName(name: string, affixes: string[]) {
	let givenNames: string;
	let surname;
	const parts = name.split(' ');

	// searches for affix within the author's name
	const affix: string | undefined = parts.find((part) => affixes.includes(part));
	if (affix) {
		// affix is present
		const rawGivenNames = name.slice(0, name.indexOf(affix)).trim().split(' ');
		givenNames = rawGivenNames.map((name) => name[0]).join('');
		surname = name.slice(name.indexOf(affix), name.length);
	} else {
		// affix not present
		surname = parts.at(-1);
		parts.pop();
		givenNames = parts.map((name) => name[0]).join('');
	}
	return `${surname} ${givenNames}`;
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
					authors[i] = formatName(el, affixes);
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
