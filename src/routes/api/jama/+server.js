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
		const title = dom.querySelector(jamaPARAMS.title).textContent.trim();
		// Publish Date
		const publishDate = dom.querySelector(jamaPARAMS.publishDate).textContent.trim();
		// Authors
		const bylines = Array.from(dom.querySelectorAll(jamaPARAMS.rawAuthors));
		const nameset = new Set();
		let authors = [];

		bylines.forEach((e) => {
			if (e.textContent.trim() != '') {
				if (!nameset.has(e.childNodes[0].childNodes[0].textContent)) {
					authors.push(e.childNodes[0].childNodes[0].textContent.trim());
					nameset.add(e.childNodes[0].childNodes[0].textContent);
				}
			}
		});
		// DOI
		const doiRaw = dom.querySelector(jamaPARAMS.doi).textContent.trim();
		const doi = doiRaw.split(' ')[1];
		// Journal
		const journal = dom.querySelector(jamaPARAMS.journal).textContent.trim();

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
