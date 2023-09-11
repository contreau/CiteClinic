import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { lancetPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Citation } from '../../../ts/types.js';
puppeteer.use(StealthPlugin());

// Formats author names
function formatName(name: string) {
	const parts = name.split(' ');
	const surname = parts[parts.length - 1].trim();
	parts.pop();
	console.log(parts);
	const givenNames = parts.map((name: string) => name[0]).join('');
	return `${surname} ${givenNames}`; // Join the surname and initials into the final string
}

export async function GET({ url }) {
	const target = url.searchParams.get('url');
	if (target !== null) {
		const browser = await puppeteer.launch({ headless: 'new' });
		console.log('launching puppeteer');
		const page = await browser.newPage();
		await page.goto(target);
		try {
			await page.waitForSelector('#onetrust-accept-btn-handler', {
				visible: true,
				timeout: 5000
			});
			await page.click('#onetrust-accept-btn-handler');
		} catch (error) {
			console.log('Cookie consent button not found or not clickable');
		}

		await page.waitForSelector('.article-header__title', {
			visible: true,
			timeout: 5000
		});

		const html = await page.content();
		await browser.close();
		const dom = new JSDOM(html).window.document;

		// Title
		const title = retrieve(dom, lancetPARAMS.title);

		// Publish Date
		let publishDate = retrieve(dom, lancetPARAMS.publishDate);
		if (publishDate === 'null') {
			publishDate = retrieve(dom, 'meta[name="citation_online_date"]');
		}
		const publishYear = publishDate ? publishDate.split('/')[0] : 'null';

		// Authors
		const rawAuthors: Element[] = Array.from(dom.querySelectorAll(lancetPARAMS.rawAuthors));
		let authors: string[] = rawAuthors.map((el: Element) => (el as HTMLMetaElement).content);
		try {
			authors.forEach((el: string, i) => {
				authors[i] = formatName(el);
				if (i > 0) authors[i] = ' ' + authors[i];
			});
			authors[authors.length - 1] += '.';
		} catch (err) {
			console.log(err);
			authors = ['null'];
		}

		// DOI
		const doi = retrieve(dom, lancetPARAMS.doi);

		// Journal
		const journal = retrieve(dom, lancetPARAMS.journal);
		const journalAbbreviation = retrieve(dom, lancetPARAMS.journalAbbrev);

		// Volume + Page Range
		const volumeAndPageRange = getVolumeAndPageRange(dom, lancetPARAMS);

		const citation: Citation = {
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
	}
}
