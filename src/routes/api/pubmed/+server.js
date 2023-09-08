import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { pubmedPARAMS } from '$lib/parameters';
import { retrieve } from '../../../js/serverFunctions.js';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		// Title
		const title = retrieve(dom, pubmedPARAMS.title);
		// Publish Date
		const publishDate = retrieve(dom, pubmedPARAMS.publishDate);
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
		const doi = retrieve(dom, pubmedPARAMS.doi);
		// Journal
		const journal = retrieve(dom, pubmedPARAMS.journal);
		const journalAbbreviation = retrieve(dom, pubmedPARAMS.journalAbbr);

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
