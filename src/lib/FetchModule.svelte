<script>
	import {
		parseData,
		parseData_NEJM,
		parseData_LANCET,
		parseData_JAMA,
		parseData_BMJ
	} from '../js/serverFunctions';

	import {
		pubmedPARAMS,
		naturePARAMS,
		nejmPARAMS,
		lancetPARAMS,
		jamaPARAMS,
		bmjPARAMS
	} from './parameters';

	// TODO:
	// error handle when selectors are not present to scrape from so that a default value is served and server doesn't crash
	// Reapproach way to scrape NEJM DOI and publish date
	// use this newer article as comparison:
	// https://www.nejm.org/doi/full/10.1056/NEJMoa2303062?query=featured_home
	// * Clean up given citation for Nature

	// *
	// ** Fetch Module **
	// *

	// sample PubMed urls
	// https://pubmed.ncbi.nlm.nih.gov/36184560/
	// https://pubmed.ncbi.nlm.nih.gov/31379367/
	// https://pubmed.ncbi.nlm.nih.gov/35298278/

	// sample Nature urls
	// https://www.nature.com/articles/s41591-023-02392-7
	// https://www.nature.com/articles/s41598-023-32742-x

	// sample NEJM urls
	// https://www.nejm.org/doi/full/10.1056/NEJMoa2101195
	// https://www.nejm.org/doi/full/10.1056/NEJMoa0708638

	// sample Lancet urls
	// https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00191-2/fulltext

	// sample JAMA urls
	// https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2795976?resultClick=1

	// sample BMJ urls
	// https://www.bmj.com/content/323/7322/1155

	/**
	 *@type {any}
	 */
	let input;
	let sourceSelect = 'Select a Journal';

	// submit button event function
	/**
	 *
	 * @param {any} input
	 */
	const launchFetch = (input) => {
		switch (sourceSelect) {
			case 'PubMed':
				parseData(input, pubmedPARAMS);
				input.value = '';
				input.focus();
				break;
			case 'Nature':
				parseData(input, naturePARAMS);
				input.value = '';
				input.focus();
				break;
			case 'NEJM':
				parseData_NEJM(input, nejmPARAMS);
				input.value = '';
				input.focus();
				break;
			case 'Lancet':
				parseData_LANCET(input, lancetPARAMS);
				input.value = '';
				input.focus();
				break;
			case 'JAMA':
				parseData_JAMA(input, jamaPARAMS);
				input.value = '';
				input.focus();
				break;
			case 'BMJ':
				parseData_BMJ(input, bmjPARAMS);
				input.value = '';
				input.focus();
				break;
		}
	};
</script>

<div class="input-wrap">
	<p>
		{sourceSelect}
	</p>

	<select bind:value={sourceSelect} name="source" id="source-select">
		<option value="Select a Journal">Select</option>
		<option value="PubMed">PubMed</option>
		<option value="Nature">Nature</option>
		<option value="NEJM">NEJM</option>
		<option value="Lancet">The Lancet</option>
		<option value="JAMA">JAMA Network</option>
		<option value="BMJ">British Medical Journal</option>
	</select>

	<input bind:this={input} type="text" class="url-input" placeholder="Paste URL" />

	<button
		on:click={() => {
			launchFetch(input);
		}}
		type="submit"
		class="submit">Submit</button
	>
</div>

<style lang="scss">
	.input-wrap {
		margin: 0 auto;
		margin-top: 2.5rem;
	}

	p {
		margin: 0;
	}
</style>
