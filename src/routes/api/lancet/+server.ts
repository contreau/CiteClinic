import { JSDOM } from 'jsdom';
import { json, error } from '@sveltejs/kit';
import { lancetPARAMS } from '$lib/parameters';
import { getVolumeAndPageRange, retrieve } from '../../../ts/serverFunctions.js';
import chromium from '@sparticuz/chromium';
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
import { affixes } from '../../../ts/serverFunctions.js';
puppeteer.use(StealthPlugin());

// Formats author names
function formatName(name: string, affixes: string[]) {
	let givenNames: string;
	let surname;
	const parts = name.split(' ');

	// searches for affix within the author's name
	const affix: string | undefined = parts.find((part) => affixes.includes(part));
	if (affix) {
		// affix is present
		const rawGivenNames = name.slice(0, name.indexOf(affix)).trim().split(' ');
		givenNames = rawGivenNames.map((name) => name[0]).join('');
		surname = name.slice(name.indexOf(affix), name.length);
	} else {
		// affix not present
		surname = parts.at(-1);
		parts.pop();
		givenNames = parts.map((name) => name[0]).join('');
	}
	return `${surname} ${givenNames}`;
}

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('url');
		if (target !== null) {
			const browser = await puppeteer.launch({
				args: chromium.args,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless
			});
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
					authors[i] = formatName(el, affixes);
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
