import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import { nejmPARAMS } from '$lib/parameters';
import { retrieve } from '../../../js/serverFunctions.js';
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
		const title = retrieve(dom, nejmPARAMS.title);

		// * Publish Date / Year
		const publishDate = retrieve(dom, nejmPARAMS.publishDate);
		const publishYear = publishDate ? publishDate.split('-')[0] : 'null';

		// * DOI
		const doi = retrieve(dom, nejmPARAMS.doi);

		// * Volume + Page Range
		// handles two different formats of the p.f-ui element that can occur on NEJM
		const blurb_parent = dom.querySelector(nejmPARAMS.blurb) ?? null;
		let volumeAndPageRange = 'null';
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
		// const authorsUL = dom.querySelector(nejmPARAMS.rawAuthors) ?? null;
		// let authors = null;
		// if (authorsUL !== null) {
		// 	const authorChildren = Array.from(authorsUL.childNodes);

		// 	const nameset = new Set();
		// 	let filteredAuthors = [];
		// 	authorChildren.forEach((e) => {
		// 		if (!nameset.has(e.textContent)) {
		// 			filteredAuthors.push(e.textContent.trim());
		// 			nameset.add(e.textContent);
		// 		}
		// 	});

		// 	authors = filteredAuthors.map((el) => {
		// 		if (el.at(-1) === ',') return el.slice(0, -1);
		// 		else return el;
		// 	});
		// }
		const rawAuthors = Array.from(dom.querySelectorAll(nejmPARAMS.rawAuthors));
		// @ts-ignore
		let authors = rawAuthors.map((el) => el.content.trim());
		if (authors[0].includes(',')) {
			// handles this format: <meta name="dc.Creator" content="Talmor, Daniel">
			for (let i = 0; i < authors.length; i++) {
				const splitName = authors[i].split(',');
				const firstName = splitName[1].trim();
				if (firstName.includes(' ')) {
					// handles if author has middle initial
					const firstLetter = firstName[0];
					const middleInitial = firstName.split(' ')[1][0];
					authors[i] = `${splitName[0]} ${firstLetter}${middleInitial}`;
				} else {
					// no middle initial
					splitName[1] = splitName[1][1];
					authors[i] = splitName.join(' ');
				}
				if (i >= 1) authors[i] = ' ' + authors[i];
			}
		} else {
			// account for: no middle initial; up to two middle initials
			for (let i = 0; i < authors.length; i++) {
				const splitName = authors[i].split(' ');
				splitName.splice(splitName.indexOf(''), 1);
				// ["Larissa", "C." "Costa"]
				// ["Giovanny", "V.A.", "França"]
				// [ 'Rita', 'C.O.', 'de', 'Carvalho-Sauer' ]
				// ["Liam", "Smeeth"]
				const firstInitial = splitName[0][0];
				let middleInitial = '';
				let lastName = '';
				// handles middle initials
				if (splitName.length >= 3) {
					if (splitName[1].length > 2) {
						// two middle initials
						middleInitial = `${splitName[1][0]}${splitName[1][2]}`;
					} else {
						// one middle initial
						middleInitial = splitName[1][0];
					}
					if (splitName.length > 3) {
						// handles two word last name
						lastName = `${splitName[2]} ${splitName[splitName.length - 1]}`;
					} else {
						lastName = splitName[splitName.length - 1];
					}
				}
				// handles last name, no middle initial
				if (splitName.length < 3) lastName = splitName[splitName.length - 1];

				if (i >= 1) {
					authors[i] = ` ${lastName} ${firstInitial}${middleInitial}`;
				} else {
					authors[i] = `${lastName} ${firstInitial}${middleInitial}`;
				}
			}
		}
		authors[authors.length - 1] += '.';

		// Journal
		let journal = retrieve(dom, nejmPARAMS.journal);
		let journalAbbreviation = 'null';
		if (journal === 'null') {
			journal = 'New England Journal of Medicine';
			journalAbbreviation = 'N Engl J Med';
		}
		if (journal === 'New England Journal of Medicine') journalAbbreviation = 'N Engl J Med';

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
