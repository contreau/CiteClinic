import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { bmjPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../js/serverFunctions.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
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
		const publishYear = publishDate ? publishDate.split('-')[0] : null;

		// Authors
		const authorArr = dom.querySelector(bmjPARAMS.rawAuthors)?.textContent.split(',') ?? null;
		let authors = null;
		if (authorArr !== null) {
			authors = [];
			for (let i = 0; i < authorArr.length; i++) {
				if (i % 2 === 0) authors.push(authorArr[i].trim());
			}
		}

		// DOI
		const doi = retrieve(dom, bmjPARAMS.doi);

		// Journal
		const journal = retrieve(dom, bmjPARAMS.journal);
		const journalAbbreviation = retrieve(dom, bmjPARAMS.journalAbbrev);

		// Volume + Page Range
		const volumeAndPageRange = getVolumeAndPageRange(dom, bmjPARAMS);

		// Citation Object
		const citation = {
			title: title,
			publishDate: publishDate,
			publishYear: publishYear,
			authors: authors,
			volumeAndPageRange: volumeAndPageRange,
			doi: doi,
			journal: journal,
			journalAbbreviation
		};
		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
