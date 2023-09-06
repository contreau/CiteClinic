import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { pubmedPARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const title = dom.querySelector(pubmedPARAMS.title)?.getAttribute('content') ?? null;
		// Publish Date
		const publishDate =
			dom.querySelector(pubmedPARAMS.publishDate)?.getAttribute('content') ?? null;
		const publishYear = dom.querySelector(pubmedPARAMS.volume)?.textContent.split(' ')[0] ?? null;

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
		const doi = dom.querySelector(pubmedPARAMS.doi)?.getAttribute('content') ?? null;
		// Journal
		const journal = dom.querySelector(pubmedPARAMS.journal)?.getAttribute('content') ?? 'PubMed';
		const journalAbbreviation =
			dom.querySelector(pubmedPARAMS.journalAbbr)?.getAttribute('content') ?? journal;

		// Volume + Page Range
		const volumeAndPageRange =
			dom.querySelector(pubmedPARAMS.volume)?.textContent.split(';')[1].trim().split('.')[0] ??
			null;

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
