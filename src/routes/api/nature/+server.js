import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { naturePARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const title = dom.querySelector(naturePARAMS.title)?.textContent.trim() ?? null;
		// Publish Date
		let publishDate = dom.querySelector(naturePARAMS.publishDate)?.textContent ?? null;

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

		// DOI
		const doi = dom.querySelector(naturePARAMS.doi)?.textContent.trim() ?? null;
		// Journal
		const journal = dom.querySelector(naturePARAMS.journal)?.getAttribute('content') ?? 'Nature';

		// Given Citation
		let givenCitation = dom.querySelector(naturePARAMS.givenCitation)?.textContent ?? null;

		const citation = {
			title: title,
			publishDate: publishDate,
			authors: authors,
			doi: doi,
			journal: journal,
			givenCitation: givenCitation
		};

		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
