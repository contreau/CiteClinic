import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { jamaPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../js/serverFunctions.js';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;
		console.log(typeof dom);

		// Title
		const title = retrieve(dom, jamaPARAMS.title);

		// Publish Date
		let publishDate = retrieve(dom, jamaPARAMS.publishDate);
		if (publishDate === null) publishDate = retrieve(dom, jamaPARAMS.publishDate2);
		const publishYear = publishDate ? publishDate.split('/')[0] : null;

		// Authors
		const rawAuthors = dom.querySelectorAll(jamaPARAMS.rawAuthors);
		const bylines = rawAuthors.length > 0 ? Array.from(rawAuthors) : null;
		let authors = null;
		if (bylines !== null) {
			const nameset = new Set();
			authors = [];
			bylines.forEach((e) => {
				if (e.textContent.trim() != '') {
					if (!nameset.has(e.childNodes[0].childNodes[0].textContent)) {
						authors.push(e.childNodes[0].childNodes[0].textContent.trim());
						nameset.add(e.childNodes[0].childNodes[0].textContent);
					}
				}
			});
		}

		// DOI
		const doi = retrieve(dom, jamaPARAMS.doi);

		// Journal
		const journal = retrieve(dom, jamaPARAMS.journal);
		const journalAbbreviation = retrieve(dom, jamaPARAMS.journalAbbrev);

		// Volume + Page Range
		const volumeAndPageRange = getVolumeAndPageRange(dom, jamaPARAMS);

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
