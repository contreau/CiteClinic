import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { jamaPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import type { Citation } from '../../../ts/types.js';

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
				publishDate =
					dom.querySelector('meta[name="citation_online_date"]')?.getAttribute('content') ?? 'null';
			}
			const publishYear = publishDate ? publishDate.split('/')[0] : 'null';

			// Authors
			const rawAuthors: Element[] = Array.from(dom.querySelectorAll(jamaPARAMS.rawAuthors));
			const authors: string[] = rawAuthors.map((el: Element) => (el as HTMLMetaElement).content);
			for (let i = 1; i < authors.length; i++) {
				authors[i] = ' ' + authors[i];
			}
			authors[authors.length - 1] += '.';

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
