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
		let publishYear = dom.querySelector(pubmedPARAMS.volume)?.textContent ?? 'null';
		if (publishYear.includes(' ')) {
			publishYear = publishYear.split(' ')[0];
		} else if (publishYear.includes(';')) {
			publishYear = publishYear.split(';')[0];
		}

		// Authors
		const rawAuthors = retrieve(dom, pubmedPARAMS.rawAuthors);
		let authors = rawAuthors ? rawAuthors.split(';') : 'null';
		if (authors !== 'null') {
			authors.pop();
			for (let i = 1; i < authors.length; i++) {
				authors[i] = ' ' + authors[i];
			}
			authors[authors.length - 1] += '.';
		}

		// DOI
		const doi = retrieve(dom, pubmedPARAMS.doi);
		// Journal
		const journal = retrieve(dom, pubmedPARAMS.journal);
		const journalAbbreviation = retrieve(dom, pubmedPARAMS.journalAbbr);

		// Volume + Page Range
		const volumeAndPageRange =
			dom.querySelector(pubmedPARAMS.volume)?.textContent.split(';')[1]?.trim().split('.')[0] ??
			'null';

		const citation = {
			title: title + '.',
			publishDate: publishDate,
			publishYear: publishYear + ';',
			authors: authors,
			doi: doi,
			volumeAndPageRange: volumeAndPageRange + '.',
			journal: journal,
			journalAbbreviation: journalAbbreviation + '.'
		};

		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
