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
		const title = dom.querySelector(nejmPARAMS.title)?.textContent.trim() ?? null;

		// Publish Date and DOI
		// handles two different formats of the p.f-ui element that can occur on NEJM
		const doi_parent = dom.querySelector(nejmPARAMS.doi) ?? null;
		let publishDate = null;
		let doi = null;
		if (doi_parent !== null) {
			const parentArray = doi_parent.innerHTML.split('<br>');
			const dateAnchorText = doi_parent.querySelector('a')?.textContent ?? null;
			if (dateAnchorText === null) {
				publishDate = parentArray[0];
				doi = parentArray[1].trim();
			} else {
				publishDate = dateAnchorText;
				for (let i = 0; i < parentArray.length; i++) {
					if (parentArray[i].includes('DOI')) {
						doi = parentArray[i].trim();
						break;
					}
				}
			}
		}

		// Authors
		const authorsUL = dom.querySelector(nejmPARAMS.rawAuthors) ?? null;
		let authors = null;
		if (authorsUL !== null) {
			const authorChildren = Array.from(authorsUL.childNodes);

			const nameset = new Set();
			let filteredAuthors = [];
			authorChildren.forEach((e) => {
				if (!nameset.has(e.textContent)) {
					filteredAuthors.push(e.textContent.trim());
					nameset.add(e.textContent);
				}
			});

			authors = filteredAuthors.map((el) => {
				if (el.at(-1) === ',') return el.slice(0, -1);
				else return el;
			});
		}

		// Journal
		const journal =
			dom.querySelector(nejmPARAMS.journal)?.getAttribute('content') ??
			'New England Journal of Medicine';

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
