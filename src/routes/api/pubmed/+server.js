import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { pubmedPARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const title = dom.querySelector(pubmedPARAMS.title)?.textContent.trim() ?? null;
		// Publish Date
		let publishDate = dom.querySelector(pubmedPARAMS.publishDate)?.textContent ?? null;

		// Authors
		const rawAuthors = dom.querySelectorAll(pubmedPARAMS.rawAuthors);
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
		let doi = dom.querySelector(pubmedPARAMS.doi)?.textContent.trim() ?? null;
		doi = doi !== null ? doi.split(':')[1].trim() : null;
		// Journal
		const journal = dom.querySelector(pubmedPARAMS.journal)?.getAttribute('content') ?? 'PubMed';

		// Given Citation
		let givenCitation = dom.querySelector(pubmedPARAMS.givenCitation)?.textContent ?? null;

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
