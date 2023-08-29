import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { naturePARAMS } from '$lib/parameters';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		const response = await fetch(target);
		const html = await response.text();
		const dom = new JSDOM(html).window.document;

		const title = dom.querySelector(naturePARAMS.title).textContent.trim();
		// Publish Date
		let publishDate = null;
		if (naturePARAMS.publishDate != null) {
			publishDate = dom.querySelector(naturePARAMS.publishDate).textContent;
		}
		// Authors
		const bylines = Array.from(dom.querySelectorAll(naturePARAMS.rawAuthors));
		const nameset = new Set();
		const authors = [];
		bylines.forEach((e) => {
			if (!nameset.has(e.textContent)) {
				authors.push(e.textContent);
				nameset.add(e.textContent);
			}
		});
		// DOI
		const doi = dom.querySelector(naturePARAMS.doi).textContent.trim();
		// Journal
		const journal = dom.querySelector(naturePARAMS.journal).textContent.trim();

		// Given Citation
		let givenCitation = null;
		if (naturePARAMS.givenCitation != null) {
			givenCitation = dom.querySelector(naturePARAMS.givenCitation).textContent;
		}

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
