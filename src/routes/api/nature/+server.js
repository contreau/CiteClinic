import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { naturePARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../js/serverFunctions.js';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		// Title
		const title = retrieve(dom, naturePARAMS.title);

		// Publish Date
		const publishDate = retrieve(dom, naturePARAMS.publishDate);
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
		const volumeAndPageRange = getVolumeAndPageRange(dom, naturePARAMS);

		// DOI
		const doi = retrieve(dom, naturePARAMS.doi);

		// Journal
		const journal = retrieve(dom, naturePARAMS.journal);
		const journalAbbreviation = retrieve(dom, naturePARAMS.journalAbbrev);

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
