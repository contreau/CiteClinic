import { JSDOM } from 'jsdom';
import { json, error } from '@sveltejs/kit';
import { naturePARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import type { Citation } from '../../../ts/types.js';

// Formats author names
function formatName(name: string) {
	const parts = name.split(',');
	const surname = parts[0].trim();
	parts.shift();
	parts[0] = parts[0].trim(); // removes leading whitespace
	if (parts[0].includes('.')) parts[0] = parts[0].slice(0, parts[0].length - 1); // removes period at end of middle intial
	let givenNames = parts[0];
	givenNames = givenNames
		.split(' ')
		.map((name: string) => name[0])
		.join(''); // joins first letters of given names together
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
			const title = retrieve(dom, naturePARAMS.title);
			if (title === 'null') throw new Error('Invalid URL.');

			// Publish Date
			const publishDate = retrieve(dom, naturePARAMS.publishDate);
			const publishYear = publishDate ? publishDate.split('-')[0] : 'null';

			// Authors
			const rawAuthors: Element[] = Array.from(dom.querySelectorAll(naturePARAMS.rawAuthors));
			let authors: string[] = rawAuthors.map((el: Element) =>
				(el as HTMLMetaElement).content.trim()
			);
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

			// Volume + Page Range
			const volumeAndPageRange = getVolumeAndPageRange(dom, naturePARAMS);

			// DOI
			const doi = retrieve(dom, naturePARAMS.doi);

			// Journal
			const journal = retrieve(dom, naturePARAMS.journal);
			const journalAbbreviation = retrieve(dom, naturePARAMS.journalAbbrev);

			const citation: Citation = {
				title: title + '.',
				displayTitle: title,
				publishDate: publishDate,
				publishYear: publishYear + ';',
				authors: authors,
				doi: doi,
				volumeAndPageRange: volumeAndPageRange + '.',
				journal: journal,
				journalAbbreviation: journalAbbreviation + '.',
				borderWidth: 0,
				borderColor: '#000000',
				boxShadow: 'shadow1'
			};

			return json(citation);
		}
	} catch (err) {
		throw error(404, {
			message: `${err}`
		});
	}
}
