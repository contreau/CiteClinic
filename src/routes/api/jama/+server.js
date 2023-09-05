import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { jamaPARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		// Title
		const title = dom.querySelector(jamaPARAMS.title)?.textContent.trim() ?? null;
		// Publish Date
		const publishDate = dom.querySelector(jamaPARAMS.publishDate)?.textContent.trim() ?? null;
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
		const doi = dom.querySelector(jamaPARAMS.doi)?.getAttribute('content') ?? null;
		// Journal
		const journal =
			dom.querySelector(jamaPARAMS.journal)?.getAttribute('content') ?? 'JAMA Network';

		const citation = {
			title: title,
			publishDate: publishDate,
			authors: authors,
			doi: doi,
			journal: journal,
			givenCitation: jamaPARAMS.givenCitation
		};
		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
