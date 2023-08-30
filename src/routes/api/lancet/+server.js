import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { lancetPARAMS } from '$lib/parameters';
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
	const title = dom.querySelector(lancetPARAMS.title).textContent.trim();
	// Publish Date
	const publishDate = dom.querySelector(lancetPARAMS.publishDate).textContent.trim();
	// Authors
	const bylines = Array.from(dom.querySelectorAll(lancetPARAMS.rawAuthors));
	const nameset = new Set();
	let authors = [];
	bylines.forEach((e) => {
		if (e.textContent.trim() != '') {
			if (!nameset.has(e.textContent)) {
				authors.push(e.textContent.trim());
				nameset.add(e.textContent);
			}
		}
	});
	// DOI
	const doi = dom.querySelector(lancetPARAMS.doi).textContent.trim();

	// Journal
	const journal = dom.querySelector(lancetPARAMS.journal).getAttribute('content');

	const citation = {
		title: title,
		publishDate: publishDate,
		authors: authors,
		doi: doi,
		journal: journal,
		givenCitation: lancetPARAMS.givenCitation
	};
	return json(citation);
}
