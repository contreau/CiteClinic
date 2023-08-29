import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { nejmPARAMS } from '$lib/parameters';
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
		await page.waitForSelector('.m-article-header__authors', {
			visible: true,
			timeout: 5000
		});

		const html = await page.content();
		await browser.close();
		const dom = new JSDOM(html).window.document;

		// Title
		const title = dom.querySelector(nejmPARAMS.title).textContent.trim();
		// Publish Date
		const rawDate = dom.querySelector(nejmPARAMS.publishDate).textContent.trim();
		let publishDate = '';
		for (let i = 0; i < rawDate.length; i++) {
			if (rawDate[i] != 'N') {
				continue;
			} else if (rawDate[i] === 'N' && rawDate[i + 1] === ' ') {
				publishDate = rawDate.slice(0, i);
				break;
			}
		}
		// DOI
		const doi_parent = dom.querySelector(nejmPARAMS.doi);
		const doi = Array.from(doi_parent.childNodes)[4].textContent.trim();
		// Journal
		const journal = Array.from(doi_parent.childNodes)[2].textContent.trim();
		// Authors
		const authorsUL = dom.querySelector(nejmPARAMS.rawAuthors);
		const authorChildren = Array.from(authorsUL.childNodes);

		const nameset = new Set();
		let authors = [];
		authorChildren.forEach((e) => {
			if (!nameset.has(e.textContent)) {
				authors.push(e.textContent.trim());
				nameset.add(e.textContent);
			}
		});

		const citation = {
			title: title,
			publishDate: publishDate,
			authors: authors,
			doi: doi,
			journal: journal,
			givenCitation: nejmPARAMS.givenCitation
		};
		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
