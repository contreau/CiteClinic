import type { Param } from './types';

export async function parseData(input: HTMLInputElement, params: Param) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			let response;
			if (params.host === 'pubmed.ncbi.nlm.nih.gov') {
				response = await fetch(`/api/pubmed?url=${url}`);
			} else if (params.host === 'www.nature.com') {
				response = await fetch(`/api/nature?url=${url}`);
			} else {
				throw new Error('Invalid Host.');
			}
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_NEJM(input: HTMLInputElement) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/nejm?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_LANCET(input: HTMLInputElement) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/lancet?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_JAMA(input: HTMLInputElement) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/jama?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export async function parseData_BMJ(input: HTMLInputElement) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			const response = await fetch(`/api/bmj?url=${url}`);
			const data = await response.json();
			return data;
		} catch (err) {
			return err;
		}
	}
}

export function retrieve(dom: Document, params: string): string {
	// *** Retrieves targeted metadata content after html is scraped
	return dom.querySelector(params)?.getAttribute('content') ?? 'null';
}

export function getVolumeAndPageRange(dom: Document, params: Param): string {
	// *** Consolidates Volume, issue, and page range portions of citation
	const volume = retrieve(dom, params.volume);
	const issue = retrieve(dom, params.issue);
	const startPage = retrieve(dom, params.startPage);
	const endPage = retrieve(dom, params.endPage);
	let pageRange = 'null';
	// page range is null as a default / fallback
	if (endPage === 'null' && startPage !== 'null') {
		// page range is set to only the start page's value if there is no end page (i.e. null)
		pageRange = startPage;
	} else if (startPage !== 'null' && endPage !== 'null') {
		// page range is a normal range
		pageRange = `${startPage}-${endPage}`;
	}
	let volumeAndPageRange = 'null';
	if (volume !== 'null' && issue !== 'null' && pageRange !== 'null') {
		volumeAndPageRange = `${volume}(${issue}):${pageRange}`;
	} else volumeAndPageRange = 'null';
	return volumeAndPageRange;
}

export const affixes: string[] = [
	'ab',
	'af',
	'av',
	'ap',
	'abu',
	'aït',
	'al',
	'ālam',
	'at',
	'ath',
	'aust',
	'austre',
	'bar',
	'bath',
	'bat',
	'ben',
	'bin',
	'ibn',
	'bet',
	'bint',
	'binti',
	'binte',
	'da',
	'das',
	'de',
	'degli',
	'del',
	'dele',
	'du',
	'della',
	'der',
	'di',
	'dos',
	'el',
	'ferch',
	'verch',
	'fitz',
	'ka',
	'kil',
	'gil',
	'mal',
	'mul',
	'la',
	'le',
	'lille',
	'lu',
	'mala',
	'mellom',
	'myljom',
	'na',
	'ned',
	'nedre',
	'neder',
	'ngā',
	'nic',
	'ní',
	'nin',
	'nord',
	'norr',
	'nordre',
	'ny',
	'opp',
	'upp',
	'öfver',
	'ost',
	'öst',
	'öster',
	'øst',
	'østre',
	'över',
	'øvste',
	'øvre',
	'øver',
	'öz',
	'pour',
	'setia/setya',
	'stor',
	'söder',
	'sør',
	'sønder',
	'syd',
	'søndre',
	'syndre',
	'søre',
	'te',
	'ter',
	'tre',
	'van',
	'van de',
	'van den',
	'van der',
	'van het',
	"van 't",
	'väst',
	'väster',
	'erch',
	'vest',
	'vestre',
	'vesle',
	'vetle',
	'von',
	'war',
	'zu',
	'von und zuAb',
	'Af',
	'Av',
	'Ap',
	'Abu',
	'Aït',
	'Al',
	'Ālam',
	'At',
	'Ath',
	'Aust',
	'Austre',
	'Bar',
	'Bath',
	'Ben',
	'Bin',
	'Bet',
	'Bint',
	'Binti',
	'Binte',
	'Da',
	'Das',
	'De',
	'Degli',
	'Del',
	'Dele',
	'Du',
	'Della',
	'Der',
	'Di',
	'Dos',
	'El',
	'Ferch',
	'Verch',
	'Fitz',
	'Kil',
	'Gil',
	'Mal',
	'Mul',
	'La',
	'Le',
	'Lille',
	'Lu',
	'Mala',
	'Mellom',
	'Myljom',
	'Na',
	'Ned',
	'Nedre',
	'Neder',
	'Ngā',
	'Nic',
	'Ní',
	'Nin',
	'Nord',
	'Norr',
	'Nordre',
	'Ny',
	'Opp',
	'Upp',
	'Öfver',
	'Ost',
	'Öst',
	'Öster',
	'Øst',
	'Østre',
	'Över',
	'Øvste',
	'Øvre',
	'Øver',
	'Öz',
	'Pour',
	'Setia/Setya',
	'Stor',
	'Söder',
	'Sør',
	'Sønder',
	'Syd',
	'Søndre',
	'Syndre',
	'Søre',
	'Te',
	'Ter',
	'Tre',
	'Van',
	'Van De',
	'Van Den',
	'Van Der',
	'Van Het',
	"Van 't",
	'Väst',
	'Väster',
	'Erch',
	'Vest',
	'Vestre',
	'Vesle',
	'Vetle',
	'von und zu'
];
