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

	import { scrapes, urlHistory } from './store';

	// TODO:
	// Vancouver Citation Reference: https://library.viu.ca/citing/vancouver
	// * Consider improving PubMed's publish date / year parameter (at least publish year)
	// * Citation Display will have 'additional info' section below with full publish date, full unabbreviated journal name

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
	// https://www.nejm.org/doi/full/10.1056/NEJMoa2303062?query=featured_home

	// sample Lancet urls
	// https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00191-2/fulltext
	// https://www.thelancet.com/journals/laneur/article/PIIS1474-4422(23)00246-6/fulltext

	// sample JAMA urls
	// https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2795976?resultClick=1
	// https://jamanetwork.com/journals/jamaotolaryngology/article-abstract/2808807

	// sample BMJ urls
	// https://www.bmj.com/content/323/7322/1155

	let input = null;
	let source = null;
	let sourceSelect = 'Select';
	let buttonClass = 'dormant';
	let buttonAnimation = 'none';
	let inputWrap;
	let fetchErrorMessage = 'Nothing to see here.';
	let loadSymbolClass = 'none';
	let displayErrorClass = 'none';

	function lightFetchButton() {
		if (sourceSelect !== 'Select' && input.value !== '') {
			buttonClass = 'ready';
		} else {
			buttonClass = 'dormant';
		}
	}

	function checkSource() {
		if (source.value !== 'Select' && input.value !== '') {
			buttonClass = 'ready';
		} else {
			buttonClass = 'dormant';
		}
	}

	function displayResults(result) {
		if (result instanceof Error) {
			console.error(result.message);
			fetchErrorMessage = result.message;
			buttonClass = 'dormant';
			input.focus();
		} else {
			loadSymbolClass = 'none';
			$scrapes = [...$scrapes, result];
			buttonClass = 'dormant';
			input.value = '';
			input.focus();
			console.log('Fetched Data:', $scrapes);
		}
	}

	function validateURL(input, params) {
		try {
			const url = new URL(input.value.trim());
			if (url.host != params.host) {
				const errorMessage = 'The provided URL does not match your target.';
				console.error(errorMessage);
				fetchErrorMessage = errorMessage;
				displayErrorClass = 'display-error';
				setTimeout(() => {
					displayErrorClass = 'none';
				}, 2000);
				input.focus();
				buttonClass = 'dormant';
				return false;
			} else {
				console.clear();
				$urlHistory = [...$urlHistory, url.href];
				console.log(`URL History:`, $urlHistory);
				return true;
			}
		} catch (err) {
			console.error(err);
			fetchErrorMessage = 'Invalid URL.';
			displayErrorClass = 'display-error';
			setTimeout(() => {
				displayErrorClass = 'none';
			}, 2000);
			input.focus();
			buttonClass = 'dormant';
			return false;
		}
	}

	// submit button event function
	async function launchFetch(input) {
		switch (sourceSelect) {
			case 'PubMed':
				if (validateURL(input, pubmedPARAMS)) {
					loadSymbolClass = 'animate-load';
					const PMresult = await parseData(input, pubmedPARAMS);
					displayResults(PMresult);
				}
				break;
			case 'Nature':
				if (validateURL(input, naturePARAMS)) {
					loadSymbolClass = 'animate-load';
					const NAresult = await parseData(input, naturePARAMS);
					displayResults(NAresult);
				}
				break;
			case 'NEJM':
				if (validateURL(input, nejmPARAMS)) {
					loadSymbolClass = 'animate-load';
					const NEresult = await parseData_NEJM(input);
					displayResults(NEresult);
				}
				break;
			case 'Lancet':
				if (validateURL(input, lancetPARAMS)) {
					loadSymbolClass = 'animate-load';
					const LAresult = await parseData_LANCET(input);
					displayResults(LAresult);
				}
				break;
			case 'JAMA':
				if (validateURL(input, jamaPARAMS)) {
					loadSymbolClass = 'animate-load';
					const JAresult = await parseData_JAMA(input);
					displayResults(JAresult);
				}
				break;
			case 'BMJ':
				if (validateURL(input, bmjPARAMS)) {
					loadSymbolClass = 'animate-load';
					const BMJresult = await parseData_BMJ(input);
					displayResults(BMJresult);
				}
				break;
		}
	}
</script>

<div class="input-wrap" bind:this={inputWrap}>
	<div class="input-fields">
		<select
			bind:value={sourceSelect}
			bind:this={source}
			class={sourceSelect}
			name="source"
			id="source-select"
			on:input={() => {
				checkSource();
			}}
		>
			<option value="Select">Select Site</option>
			<option value="NEJM">New England Journal of Medicine</option>
			<option value="PubMed">PubMed</option>
			<option value="Nature">Nature</option>
			<option value="Lancet">The Lancet</option>
			<option value="JAMA">JAMA Network</option>
			<option value="BMJ">British Medical Journal</option>
		</select>
		<input
			bind:this={input}
			on:input={() => {
				lightFetchButton();
			}}
			type="text"
			class="url-input"
			placeholder="Paste URL ( include https:// )"
		/>
	</div>

	<button
		on:click={() => {
			if (input.value === null || input.value === '' || source.value === 'Select') {
				console.log('invalid input');
				buttonAnimation = 'rejectButton';
				inputWrap.style.setProperty('--line-color', '#ff4646');
				setTimeout(() => {
					buttonAnimation = 'none';
					inputWrap.style.setProperty('--line-color', '#35fb9f');
				}, 500);
			} else {
				buttonAnimation = 'none';
				launchFetch(input);
			}
		}}
		type="submit"
		class="submit {buttonClass} {buttonAnimation}">FETCH</button
	>
</div>

<p class="loading-symbol"><i class="fa-solid fa-arrows-rotate {loadSymbolClass}" /></p>
<p class="error-message {displayErrorClass}">{fetchErrorMessage}</p>

{#each $scrapes as scrape}
	<p>{scrape.title}</p>
{/each}

<style lang="scss">
	.input-wrap {
		--line-color: #35fb9f;
		position: relative;
		margin: 0 auto;
		margin-top: 2.5rem;
		border: solid 1px #565656;
		max-width: 1000px;
		padding: 1em;
		border-radius: 30px;
		background-color: #081118d6;

		&::after {
			content: '';
			position: absolute;
			width: 2px;
			height: 2px;
			background-color: var(--line-color);
			transition: 0.4s all;
			width: 90%;
			left: 5%;
			bottom: 24%;
			z-index: 0;
			filter: blur(0.8px);
			border-radius: 30px;
			filter: drop-shadow(0 0 0.4em var(--line-color));
		}
	}

	.input-fields {
		display: flex;
		align-items: center;
		justify-content: space-around;

		select,
		input {
			border: solid 1.5px transparent;
			border-radius: 30px;
			padding: 0.5em;
			font-size: 1rem;
			outline: transparent;
			transition: 0.2s border;
			&:focus {
				border: solid 1.5px #fff;
			}
		}

		select {
			--select: #2b2a33;
			--nejm: #bb2f39;
			--pubmed: #1872c0;
			--nature: #007c3c;
			--lancet: #088798;
			--jama: #d21f72;
			--bmj: #034796;
			width: 35%;
			background-color: #0e6db1;
			text-align: center;
			transition: 0.3s all;
			font-weight: 700;
			&:hover {
				cursor: pointer;
			}
		}

		.Select {
			background-color: var(--select);
		}
		.NEJM {
			background-color: var(--nejm);
			filter: drop-shadow(0 0 0.5em var(--nejm));
		}
		.PubMed {
			background-color: var(pubmed);
			filter: drop-shadow(0 0 0.5em var(--pubmed));
		}
		.Nature {
			background-color: var(--nature);
			filter: drop-shadow(0 0 0.5em var(--nature));
		}
		.Lancet {
			background-color: var(--lancet);
			filter: drop-shadow(0 0 0.5em var(--lancet));
		}
		.JAMA {
			background-color: var(--jama);
			filter: drop-shadow(0 0 0.5em var(--jama));
		}
		.BMJ {
			background-color: var(--bmj);
			filter: drop-shadow(0 0 0.5em var(--bmj));
		}

		.url-input {
			background-color: #2b2a33;
			width: 60%;
			border: solid 1px transparent;
			color: var(--green);
			font-weight: 400;
			&::placeholder {
				color: var(--green);
			}
		}
	}

	button {
		position: relative;
		z-index: 3;
		display: block;
		margin: 0 auto;
		margin-top: 2rem;
		padding: 0.5em 2em;
		border-radius: 20px;
		border: solid 1px transparent;
		outline: transparent;
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: 1px;
		transition: 0.3s all;
		&:hover {
			cursor: pointer;
		}

		// &:focus {
		// 	border: solid 1px #fff;
		// }
	}

	// fetch button lights up when a source is selected / url is input
	.ready {
		background-color: #2d955f;
		filter: drop-shadow(0 0 0.6em #2d955f);
	}
	.dormant {
		background-color: #2b2a33;
		filter: none;
	}

	// button animation when url is invalid
	.rejectButton {
		animation: shuffle 200ms linear 2;
	}

	// loading symbol (fa icon for now, will make custom asset)
	.loading-symbol {
		text-align: center;

		.fa-arrows-rotate {
			opacity: 0;
			font-size: 2.2rem;
			color: var(--green);
			filter: drop-shadow(0 0 0.1em var(--green));
			transition: opacity 0.3s;

			&.animate-load {
				opacity: 1;
				animation: loading 1.2s linear infinite;
			}
		}
	}

	// error message
	.error-message {
		opacity: 0;
		text-align: center;
		font-size: 1rem;
		padding: 0.3em 0.8em;
		background-color: rgb(199, 46, 46);
		border-radius: 30px;
		max-width: 500px;
		margin: 0 auto;
		transition: opacity 0.5s;
	}

	.display-error {
		opacity: 1;
	}

	@keyframes shuffle {
		25% {
			transform: translateX(20px);
		}
		50% {
			transform: translateX(0px);
		}
		75% {
			transform: translateX(-20px);
		}
		100% {
			transform: translateX(0px);
		}
	}

	@keyframes loading {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
