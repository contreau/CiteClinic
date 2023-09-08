import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { lancetPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../js/serverFunctions.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

export async function GET({ url }) {
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
	const publishDate = retrieve(dom, lancetPARAMS.publishDate);
	const publishYear = publishDate ? publishDate.split('/')[0] : null;
	// Authors
	const bylines = Array.from(dom.querySelectorAll(lancetPARAMS.rawAuthors)) ?? null;
	let authors = null;
	if (bylines !== null) {
		authors = [];
		const nameset = new Set();
		bylines.forEach((e) => {
			if (e.textContent.trim() != '') {
				if (!nameset.has(e.textContent)) {
					authors.push(e.textContent.trim());
					nameset.add(e.textContent);
				}
			}
		});
	}

	// DOI
	const doi = retrieve(dom, lancetPARAMS.doi);

	// Journal
	const journal = retrieve(dom, lancetPARAMS.journal);
	const journalAbbreviation = retrieve(dom, lancetPARAMS.journalAbbrev);

	// Volume + Page Range
	const volumeAndPageRange = getVolumeAndPageRange(dom, lancetPARAMS);

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
}
