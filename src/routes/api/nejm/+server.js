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
		const title = dom.querySelector(nejmPARAMS.title)?.getAttribute('content') ?? null;

		// Publish Date, DOI, Volume + Page Range
		// handles two different formats of the p.f-ui element that can occur on NEJM
		const blurb_parent = dom.querySelector(nejmPARAMS.blurb) ?? null;
		// * Publish Date / Year
		const publishDate = dom.querySelector(nejmPARAMS.publishDate)?.getAttribute('content') ?? null;
		const publishYear = publishDate.split('-')[0] ?? null;
		// * DOI
		const doi = dom.querySelector(nejmPARAMS.doi)?.getAttribute('content') ?? null;
		// * Volume + Page Range
		let volumeAndPageRange = null;
		if (blurb_parent !== null) {
			const parentArray = blurb_parent.innerHTML.split('<br>');
			const dateAnchorText = blurb_parent.querySelector('a')?.textContent ?? null;
			if (dateAnchorText !== null) {
				// contains volume/page range
				for (let i = 0; i < parentArray.length; i++) {
					if (parentArray[i].includes(';')) {
						const selection = parentArray[i];
						volumeAndPageRange = selection.split(';')[1].trim();
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
		let journalAbbreviation = null;
		if (journal === 'New England Journal of Medicine') journalAbbreviation = 'N Engl J Med';

		const citation = {
			title: title,
			publishDate: publishDate,
			publishYear: publishYear,
			authors: authors,
			doi: doi,
			volumeAndPageRange: volumeAndPageRange,
			journal: journal,
			journalAbbreviation: journalAbbreviation,
			givenCitation: nejmPARAMS.givenCitation
		};
		return json(citation);
	} catch (err) {
		return new Response(`${err}`);
	}
}
