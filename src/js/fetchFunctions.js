// const parser = new DOMParser();

// TODO:
// error handle when selectors are not present to scrape from so that a default value is served and server doesn't crash
// Reapproach way to scrape NEJM DOI and publish date
// use this newer article as comparison:
// https://www.nejm.org/doi/full/10.1056/NEJMoa2303062?query=featured_home
// * Clean up given citation for Nature

// ** Server Call

const fetchPage = async function (input, route) {
	try {
		const submitURL = new Promise((resolve) => {
			resolve(input.value);
		});
		const url = await submitURL;
		const response = await fetch(`http://localhost:3000/${route}?url=${url}`);
		const text = await response.text();
		return parser.parseFromString(text, 'text/html');
	} catch (err) {
		console.error('URL likely invalid.', err);
	}
};

// ** Data Parsing

// PUBMED + Nature
export const parseData = async function (input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const dom = await fetchPage(input, params.route);
			// Title
			const title = dom.querySelector(params.title).textContent.trim();
			// Publish Date
			let publishDate = null;
			if (params.publishDate != null) {
				publishDate = dom.querySelector(params.publishDate).textContent;
			}
			// Authors
			const bylines = Array.from(dom.querySelectorAll(params.rawAuthors));
			const nameset = new Set();
			const authors = [];
			bylines.forEach((e) => {
				if (!nameset.has(e.textContent)) {
					authors.push(e.textContent);
					nameset.add(e.textContent);
				}
			});
			// DOI
			const doi = dom.querySelector(params.doi).textContent.trim();
			// Journal
			const journal = dom.querySelector(params.journal).textContent.trim();

			// Given Citation
			let givenCitation = null;
			if (params.givenCitation != null) {
				givenCitation = dom.querySelector(params.givenCitation).textContent;
			}

			const citation = {
				title: title,
				publishDate: publishDate,
				authors: authors,
				doi: doi,
				journal: journal,
				givenCitation: givenCitation
			};

			console.log(citation);
			return citation;
		} catch (err) {
			console.error('Invalid URL.', err);
		}
	}
};

// NEJM
export const parseData_NEJM = async function (input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const dom = await fetchPage(input, params.route);
			// Title
			const title = dom.querySelector(params.title).textContent.trim();
			// Publish Date
			const rawDate = dom.querySelector(params.publishDate).textContent.trim();
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
			const doi_parent = dom.querySelector(params.doi);
			const doi = Array.from(doi_parent.childNodes)[4].textContent.trim();
			// Journal
			const journal = Array.from(doi_parent.childNodes)[2].textContent.trim();
			// Authors
			const authorsUL = dom.querySelector(params.rawAuthors);
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
				givenCitation: params.givenCitation
			};
			console.log(citation);
		} catch (err) {
			console.error('Invalid URL.', err);
		}
	}
};

// The Lancet
export const parseData_LANCET = async function (input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const dom = await fetchPage(input, params.route);
			// Title
			const title = dom.querySelector(params.title).textContent.trim();
			// Publish Date
			const publishDate = dom.querySelector(params.publishDate).textContent.trim();
			// Authors
			const bylines = Array.from(dom.querySelectorAll(params.rawAuthors));
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
			const doi = dom.querySelector(params.doi).textContent.trim();

			const citation = {
				title: title,
				publishDate: publishDate,
				authors: authors,
				doi: doi,
				journal: params.journal,
				givenCitation: params.givenCitation
			};

			console.log(citation);
		} catch (err) {
			console.error(err);
		}
	}
};

// JAMA
export const parseData_JAMA = async function (input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const dom = await fetchPage(input, params.route);
			// Title
			const title = dom.querySelector(params.title).textContent.trim();
			// Publish Date
			const publishDate = dom.querySelector(params.publishDate).textContent.trim();
			// Authors
			const bylines = Array.from(dom.querySelectorAll(params.rawAuthors));
			const nameset = new Set();
			let authors = [];

			bylines.forEach((e) => {
				if (e.textContent.trim() != '') {
					if (!nameset.has(e.childNodes[0].childNodes[0].textContent)) {
						authors.push(e.childNodes[0].childNodes[0].textContent.trim());
						nameset.add(e.childNodes[0].childNodes[0].textContent);
					}
				}
			});
			// DOI
			const doiRaw = dom.querySelector(params.doi).textContent.trim();
			const doi = doiRaw.split(' ')[1];
			// Journal
			const journal = dom.querySelector(params.journal).textContent.trim();

			const citation = {
				title: title,
				publishDate: publishDate,
				authors: authors,
				doi: doi,
				journal: journal,
				givenCitation: params.givenCitation
			};

			console.log(citation);
		} catch (err) {
			console.error(err);
		}
	}
};

// British Medical Journal
export const parseData_BMJ = async function (input, params) {
	if (input.value != '') {
		try {
			const url = new URL(input.value);
			if (url.host != params.host) throw new Error('The provided URL does not match your target.');
			const dom = await fetchPage(input, params.route);
			// Title
			const title = dom.querySelector(params.title).textContent.trim();
			// Publish Date
			const publishDate = dom.querySelector(params.publishDate).textContent.trim();
			// Authors
			const authorArr = dom.querySelector(params.rawAuthors).textContent.split(',');
			const authors = [];
			for (let i = 0; i < authorArr.length; i++) {
				if (i % 2 === 0) authors.push(authorArr[i].trim());
			}
			// DOI
			const doi = dom.querySelector(params.doi).textContent.trim();
			// Journal
			const journal = dom.querySelector(params.journal).textContent.trim();

			// Citation Object
			const citation = {
				title: title,
				publishDate: publishDate,
				authors: authors,
				doi: doi,
				journal: journal,
				givenCitation: params.givenCitation
			};

			console.log(citation);
		} catch (err) {
			console.error(err);
		}
	}
};
