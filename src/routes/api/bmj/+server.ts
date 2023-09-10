import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { bmjPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Citation } from '../../../ts/types';

puppeteer.use(StealthPlugin());

export async function GET({ url }) {
	try {
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

			await page.waitForSelector('.highwire-cite-title', {
				visible: true,
				timeout: 5000
			});

			const html = await page.content();
			await browser.close();
			const dom = new JSDOM(html).window.document;

			// Title
			const title = retrieve(dom, bmjPARAMS.title);

			// Publish Date
			const publishDate = retrieve(dom, bmjPARAMS.publishDate);
			const publishYear = publishDate ? publishDate.split('-')[0] : 'null';

			// Authors
			const rawAuthors: Element[] = Array.from(dom.querySelectorAll(bmjPARAMS.rawAuthors));
			const authors: string[] = rawAuthors.map((el: Element) => (el as HTMLMetaElement).content);
			for (let i = 1; i < authors.length; i++) {
				authors[i] = ' ' + authors[i];
			}
			authors[authors.length - 1] += '.';

			// DOI
			const doi = retrieve(dom, bmjPARAMS.doi);

			// Journal
			const journal = retrieve(dom, bmjPARAMS.journal);
			const journalAbbreviation = retrieve(dom, bmjPARAMS.journalAbbrev);

			// Volume + Page Range
			const volumeAndPageRange = getVolumeAndPageRange(dom, bmjPARAMS);

			// Citation Object
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
	} catch (err) {
		return new Response(`${err}`);
	}
}
