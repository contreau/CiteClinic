import { json, error } from '@sveltejs/kit';
import type { Citation } from '../../../ts/types';

export async function GET({ url }) {
	try {
		const target = url.searchParams.get('doi');
		const res = await fetch(`https://api.crossref.org/works/${target}`, {
			headers: {
				'User-Agent': 'mailto:cfk102@gmail.com'
			}
		});
		if (target !== null) {
			const response = await res.json();
			const retrievedData = response.message;

			// Authors
			let formattedAuthors: string[] = [];
			for (const auth of retrievedData.author) {
				formattedAuthors = [...formattedAuthors, `${auth.family}, ${auth.given}`];
			}

			// Volume + Page Range
			const volume = retrievedData.volume;
			const pages = retrievedData.page;
			const issue = retrievedData.issue;
			const volumeAndPageRange = `${volume}(${issue}):${pages}`;

			const citation: Citation = {
				title: retrievedData.title[0] + '.',
				displayTitle: retrievedData.title[0],
				publishDate: retrievedData.issued['date-parts'][0],
				publishYear: retrievedData.issued['date-parts'][0][0] + ';',
				authors: formattedAuthors,
				doi: target,
				volumeAndPageRange: volumeAndPageRange + '.',
				journal: retrievedData['container-title'][0],
				journalAbbreviation: retrievedData['short-container-title'][0] + '.',
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
