import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { naturePARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const title = dom.querySelector(naturePARAMS.title)?.getAttribute('content') ?? null;
		// Publish Date
		const publishDate =
			dom.querySelector(naturePARAMS.publishDate)?.getAttribute('content') ?? null;
		const publishYear = publishDate ? publishDate.split('-')[0] : null;

		// Authors
		const rawAuthors = dom.querySelectorAll(naturePARAMS.rawAuthors);
		const bylines = rawAuthors.length > 0 ? Array.from(rawAuthors) : null;
		let authors = null;
		if (bylines !== null) {
			const nameset = new Set();
			authors = [];
			bylines.forEach((e) => {
				if (!nameset.has(e.textContent)) {
					authors.push(e.textContent);
					nameset.add(e.textContent);
				}
			});
		}

		// Volume + Page Range
		const volume = dom.querySelector(naturePARAMS.volume).getAttribute('content');
		console.log(volume);
		const issue = dom.querySelector(naturePARAMS.issue).getAttribute('content');
		const pageRange = `${dom.querySelector(naturePARAMS.startPage).getAttribute('content')}-${dom
			.querySelector(naturePARAMS.endPage)
			.getAttribute('content')}`;
		const volumeAndPageRange = `${volume}(${issue}):${pageRange}`;

		// DOI
		const doi = dom.querySelector(naturePARAMS.doi)?.getAttribute('content') ?? null;

		// Journal
		const journal = dom.querySelector(naturePARAMS.journal)?.getAttribute('content') ?? 'Nature';
		const journalAbbreviation =
			dom.querySelector(naturePARAMS.journalAbbrev)?.getAttribute('content') ?? journal;

		const citation = {
			title: title,
			publishDate: publishDate,
			publishYear: publishYear,
			authors: authors,
			doi: doi,
			volumeAndPageRange: volumeAndPageRange,
			journal: journal,
			journalAbbreviation: journalAbbreviation
		};

		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
