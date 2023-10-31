import { JSDOM } from 'jsdom';
import { json, error } from '@sveltejs/kit';
import { nejmPARAMS } from '$lib/parameters';
import { retrieve } from '../../../ts/serverFunctions.js';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-extra';
import 'puppeteer-extra-plugin-stealth/evasions/chrome.app';
import 'puppeteer-extra-plugin-stealth/evasions/chrome.csi';
import 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes';
import 'puppeteer-extra-plugin-stealth/evasions/chrome.runtime';
import 'puppeteer-extra-plugin-stealth/evasions/defaultArgs';
import 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow';
import 'puppeteer-extra-plugin-stealth/evasions/media.codecs';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.languages';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor';
import 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver';
import 'puppeteer-extra-plugin-stealth/evasions/sourceurl';
import 'puppeteer-extra-plugin-stealth/evasions/user-agent-override';
import 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor';
import 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions';
import 'puppeteer-extra-plugin-user-preferences';
import 'puppeteer-extra-plugin-user-data-dir';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Citation } from '../../../ts/types.js';

// chromium.setHeadlessMode = 'new';
// chromium.setGraphicsMode = false;

puppeteer.use(StealthPlugin());

function formatName(name: string) {
	let parts: string[] | string;
	if (name.includes(',')) {
		// handles author formatting 'surname,  given names'
		parts = name.trim().split(',').reverse();
		parts[0] = parts[0].trim();
	} else parts = name.split('  '); // handles author formatting 'given names  surname'
	const surname = parts.at(-1);
	parts.pop();
	parts = parts[0];
	parts = parts.split(' ');
	const givenNames: string = parts
		.map((name) => {
			if (name.includes('.')) {
				// removes periods from initials
				let initials = '';
				for (let i = 0; i < name.length; i++) {
					if (name[i] !== '.') initials += name[i];
				}
				return initials;
			} else return name[0]; // get first letter only
		})
		.join('');
	return `${surname} ${givenNames}`;
}

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		if (target !== null) {
			const browser = await puppeteer.launch({
				args: chromium.args,
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(
					`https://github.com/Sparticuz/chromium/releases/download/v112.0.0/chromium-v112.0.0-pack.tar`
				),
				headless: chromium.headless
			});
			console.log('launching puppeteer');
			const page = await browser.newPage();

			await page.goto(target);
			await page.waitForSelector('.m-article-header__authors', {
				visible: true,
				timeout: 3000
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
			const blurb_parent = dom.querySelector(nejmPARAMS.volume) ?? null;
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

			const rawAuthors: Element[] = Array.from(dom.querySelectorAll(nejmPARAMS.rawAuthors));
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

			// Journal
			let journal = retrieve(dom, nejmPARAMS.journal);
			let journalAbbreviation = 'null';
			if (journal === 'null') {
				journal = 'New England Journal of Medicine';
				journalAbbreviation = 'N Engl J Med';
			}
			if (journal === 'New England Journal of Medicine') journalAbbreviation = 'N Engl J Med';

			const citation: Citation = {
				title: title + '.',
				displayTitle: title,
				publishDate: publishDate,
				publishYear: publishYear + ';',
				authors: authors,
				doi: doi,
				volumeAndPageRange: volumeAndPageRange + '.',
				journal: journal,
				journalAbbreviation: journalAbbreviation + '.',
				borderWidth: 0,
				borderColor: '#000000',
				boxShadow: 'shadow1'
			};
			return json(citation);
		}
	} catch (err) {
		throw error(404, {
			message: `${err}`
		});
	}
}
