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
			// for (const auth of retrievedData.author)
			for (let i = 0; i < retrievedData.author.length; i++) {
				if (i > 0) {
					// adds a space between each name except for the first name
					retrievedData.author[i].family = ` ${retrievedData.author[i].family}`;
				}
				let givenNameInitials = '';
				const givenNameSplit = retrievedData.author[i].given.split(' ');
				for (const name of givenNameSplit) {
					// turns given name into initials
					givenNameInitials += name[0];
				}
				if (i === retrievedData.author.length - 1) givenNameInitials += '.'; // adds a period at the end of the final name
				formattedAuthors = [
					...formattedAuthors,
					`${retrievedData.author[i].family} ${givenNameInitials}`
				];
			}

			// Volume + Page Range
			const volume: string | null = retrievedData?.volume ?? null;
			const pages: string | null = retrievedData?.page ?? null;
			const issue: string | null = retrievedData?.issue ?? null;
			const volumeAndPageRange = `${volume}(${issue}):${pages}`;

			const citation: Citation = {
				title: retrievedData.title[0] + '.',
				displayTitle: retrievedData.title[0],
				publishDate: retrievedData.issued['date-parts'][0],
				publishYear: retrievedData.issued['date-parts'][0][0] + ';',
				authors: formattedAuthors,
				doi: target,
				volume: volume,
				pages: pages,
				issue: issue,
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
