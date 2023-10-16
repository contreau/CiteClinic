<script lang="ts">
	import {
		parseData,
		parseData_NEJM,
		parseData_LANCET,
		parseData_JAMA,
		parseData_BMJ
	} from '../ts/serverFunctions';

	import {
		pubmedPARAMS,
		naturePARAMS,
		nejmPARAMS,
		lancetPARAMS,
		jamaPARAMS,
		bmjPARAMS
	} from './parameters';

	import { scrapes, urlHistory, expandedClass, firstCitationMade } from './store';
	import type { Citation, Param } from '../ts/types';
	import { browser } from '$app/environment';

	let footer: HTMLElement | null;
	if (browser) footer = document.querySelector('footer');

	// TODO:
	// * fix nav tab behavior, then figure out responsive nav tabs on mobile (honestly just limit mobile users to 1 citation at a time)
	// * restyle select dropdown to look better cross-browser
	// * some sort of state retention for citation when users navigate to the user guide and then return. right now it wipes styles upon page navigation. can probably do this with a writable store and tweaking of toggleStyleDropdown()
	// * consider: rework loading icon animation?
	// * consider: light theme / theme toggle

	let input: HTMLInputElement;
	let source: HTMLSelectElement;
	let sourceSelect = 'Select';
	let buttonClass = 'dormant';
	let buttonAnimation = 'none';
	let inputWrap: HTMLDivElement;
	let fetchStatusElement: HTMLParagraphElement;
	let loadingSymbol: HTMLDivElement;
	let fetchErrorMessage = 'Nothing to see here.';
	let loadSymbolClass = 'none';
	let displayErrorClass = 'none';
	let throttleRequest = false;

	function lightFetchButton() {
		if (sourceSelect !== 'Select' && input.value !== '') {
			buttonClass = 'ready';
		} else {
			buttonClass = 'dormant';
		}
	}

	function showErrorUI(displayTime: number, errorMessage: string) {
		// error display in UI
		fetchErrorMessage = errorMessage;
		displayErrorClass = 'display-error';
		loadingSymbol.style.setProperty('--symbol-color', '#f84545');
		loadingSymbol.style.setProperty('--drop-shadow', 'drop-shadow(0 0 0.4em #f84545)');
		loadSymbolClass = 'none';
		setTimeout(() => {
			displayErrorClass = 'none';
			loadingSymbol.style.setProperty('--symbol-color', 'var(--blue)');
			loadingSymbol.style.setProperty('--drop-shadow', 'drop-shadow(0 0 0.4em var(--blue))');
		}, displayTime);
	}

	const placeholders: { [char: string]: string } = {
		Select: 'Paste URL ( include https:// )',
		PubMed: 'https://pubmed.ncbi.nlm.nih.gov/......',
		Nature: 'https://www.nature.com/articles/......',
		NEJM: 'https://www.nejm.org/doi/full/......',
		Lancet: 'https://www.thelancet.com/journals/......',
		JAMA: 'https://jamanetwork.com/journals/......',
		BMJ: 'https://www.bmj.com/content/......'
	};

	function checkSource() {
		if (source.value !== 'Select' && input.value !== '') {
			buttonClass = 'ready';
		} else {
			buttonClass = 'dormant';
		}
	}

	function setNavTabsOnLoad() {
		const allTabContents: HTMLElement[] = Array.from(document.querySelectorAll('.section-wrap'));
		const allTabButtons: HTMLElement[] = Array.from(document.querySelectorAll('.content-tab'));
		const activeContent: HTMLElement = document.querySelector(`.section-${$scrapes.length}`)!;

		const sourceButton: HTMLElement = document.querySelector(`.tab-${$scrapes.length}`)!;

		// tab content toggle
		allTabContents.map((tab) => tab.classList.add('display-none'));
		activeContent.classList.remove('display-none');

		// nav tab active highlight toggle
		allTabButtons.map((navtab) => navtab.classList.remove('active-tab'));
		sourceButton.classList.add('active-tab');
	}

	// triggers citation display
	async function displayResults(result: Citation) {
		if (result instanceof Error) {
			throttleRequest = false; // reset throttle
			console.error(result.message);
			showErrorUI(4000, result.message);
			buttonClass = 'dormant';
			input.value = '';
			input.focus();
		} else {
			loadSymbolClass = 'none';
			await scrapes.update((scrapes) => [...scrapes, result]); // code below must wait for this
			throttleRequest = false; // reset throttle
			$expandedClass = 'expanded'; // expands citationDisplay to full width
			$firstCitationMade = true;
			buttonClass = 'dormant';
			input.value = '';
			input.focus();
			console.log('Fetched Data:', $scrapes);
			if ($scrapes.length > 1) setNavTabsOnLoad();
		}
	}

	// URL validation
	function validateURL(input: HTMLInputElement, params: Param): boolean {
		try {
			const url = new URL(input.value.trim());
			if (url.host !== params.host) {
				const errorMessage = 'The provided URL does not match your target.';
				console.error(errorMessage);
				invalidSubmissionAnimation();
				showErrorUI(2000, errorMessage);
				input.focus();
				buttonClass = 'dormant';
				return false;
			} else {
				console.clear();
				urlHistory.update((urlHistory) => [...urlHistory, url.href]);
				console.log(`URL History:`, $urlHistory);
				return true;
			}
		} catch (err) {
			console.error(err);
			invalidSubmissionAnimation();
			showErrorUI(2000, 'Invalid URL.');
			input.focus();
			buttonClass = 'dormant';
			return false;
		}
	}

	// invalid submission animation on cite button
	function invalidSubmissionAnimation() {
		buttonAnimation = 'rejectButton';
		inputWrap.style.setProperty('--line-color', '#ff4646');
		setTimeout(() => {
			buttonAnimation = 'none';
			inputWrap.style.setProperty('--line-color', '#387dfe');
		}, 500);
	}

	// cite button handler
	function citeButtonActions() {
		// console.log(`throttle is ${throttleRequest}`);
		if ($scrapes.length === 10) {
			showErrorUI(3000, 'Maximum of 10 citations. Delete one to continue.');
		} else if (input.value === null || input.value === '' || source.value === 'Select') {
			console.log('invalid input');
			showErrorUI(2000, 'Missing fields.');
			invalidSubmissionAnimation();
		} else if (!throttleRequest) {
			buttonAnimation = 'none';
			launchFetch(input);
		}
	}

	async function retrieveAndDisplay(
		input: HTMLInputElement,
		param: Param,
		parseDataCallback: Promise<Citation>
	) {
		if (validateURL(input, param)) {
			throttleRequest = true;
			loadSymbolClass = 'animation-load';
			const result = await parseDataCallback;
			displayResults(result);
		}
	}

	// server interaction + page scraping
	async function launchFetch(input: HTMLInputElement) {
		switch (sourceSelect) {
			case 'PubMed':
				retrieveAndDisplay(input, pubmedPARAMS, parseData(input, pubmedPARAMS));
				break;
			case 'Nature':
				retrieveAndDisplay(input, naturePARAMS, parseData(input, naturePARAMS));
				break;
			case 'NEJM':
				retrieveAndDisplay(input, nejmPARAMS, parseData_NEJM(input));
				break;
			case 'Lancet':
				retrieveAndDisplay(input, lancetPARAMS, parseData_LANCET(input));
				break;
			case 'JAMA':
				retrieveAndDisplay(input, jamaPARAMS, parseData_JAMA(input));
				break;
			case 'BMJ':
				retrieveAndDisplay(input, bmjPARAMS, parseData_BMJ(input));
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
			placeholder={placeholders[sourceSelect]}
		/>
	</div>

	<button
		on:click={() => {
			citeButtonActions();
		}}
		type="submit"
		class="submit {buttonClass} {buttonAnimation}">CITE</button
	>
</div>

<div class="loading-block">
	<div bind:this={loadingSymbol} class="load-symbol-container">
		<span class="dot dot1 {loadSymbolClass}" />
		<span class="dot dot2 {loadSymbolClass}" />
		<span class="dot dot3 {loadSymbolClass}" />
	</div>
	{#if displayErrorClass === 'none'}
		<p class="fetchStatus" />
	{:else}
		<p bind:this={fetchStatusElement} class="fetchStatus errorStatus {displayErrorClass}">
			{fetchErrorMessage}
		</p>
	{/if}
</div>

{#if !$firstCitationMade}
	<p class="new-user-message">
		<em>New to CiteClinic? Check out the <a href="/user-guide">User Guide</a> first.</em>
	</p>
{/if}

<style lang="scss">
	// Block with loading animation + error messaging
	.loading-block {
		padding-top: 1.5em;
		padding-bottom: 1em;

		.load-symbol-container {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.4rem;
			padding-top: 0.7em;
			padding-bottom: 0.7em;
			--symbol-color: var(--blue);
			--drop-shadow: drop-shadow(0 0 0.4em var(--blue));

			.dot {
				transition: all 0.3s;
				background-color: var(--symbol-color);
				filter: var(--drop-shadow);
				width: 11px;
				min-height: 11px;
				border-radius: 30px;

				&.dot2 {
					animation-delay: 0.3s;
				}
				&.dot3 {
					animation-delay: 0.6s;
				}
			}
		}

		.fetchStatus {
			transition: opacity 0.2s;
			text-align: center;
			margin: 0;
			min-height: 45px;
			font-size: 1.2rem;

			.fa-book-open-reader {
				font-size: 1.6rem;
				color: var(--blue);
				filter: drop-shadow(0 0 0.4em var(--blue));
			}
		}

		.errorStatus {
			font-weight: 800;
			color: #ef9191;
		}
	}

	.animation-load {
		opacity: 1;
		animation: load 1s linear infinite;
	}

	@keyframes load {
		25% {
			transform: translateY(-10px);
		}
		50% {
			transform: translateY(0px);
		}
		75% {
			transform: translateY(10px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	// outermost wrap of input module
	.input-wrap {
		--line-color: #387dfe;
		position: relative;
		margin: 0 auto;
		margin-top: 0.8rem;
		// border: solid 1px #565656;
		width: 100%; // will shrink if removed bc it's a grid item
		max-width: 1000px;
		padding: 1em;
		border-radius: 30px;

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
			padding: 0.5em;
			font-size: 1rem;
			outline: transparent;
			transition: 0.2s border;
			&:focus-visible {
				border: solid 1.5px #fff;
			}
		}

		input {
			border-radius: 15px;
		}

		select {
			--select: #2b2a33;
			--nejm: #bb2f39;
			--pubmed: #1872c0;
			--nature: #007c3c;
			--lancet: #088798;
			--jama: #d21f72;
			--bmj: #034796;
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none; // gets rid of default select element gloss on safari / dropdown arrows everywhere
			width: 35%;
			border-radius: 30px;
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
			color: var(--blue);
			font-weight: 400;
			&::placeholder {
				color: var(--blue);
			}
			&:focus {
				border: solid 1px #fff;
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

		&:focus-visible {
			border: solid 1px #fff;
		}
	}

	// fetch button lights up when a source is selected / url is input
	.ready {
		background-color: #387dfe;
		filter: drop-shadow(0 0 0.6em #387dfe);
	}
	.dormant {
		background-color: #2b2a33;
		filter: none;
	}

	// button animation when url is invalid
	.rejectButton {
		animation: shuffle 200ms linear 2;
	}

	@keyframes shuffle {
		25% {
			transform: translateX(25px);
		}
		50% {
			transform: translateX(0px);
		}
		75% {
			transform: translateX(-25px);
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

	@media (max-width: 400px) {
		.input-wrap .input-fields .url-input {
			width: 100%;
		}

		.input-fields {
			flex-direction: column;
			gap: 1.2rem;
		}

		.input-wrap::after {
			bottom: 17%;
		}

		#source-select {
			width: 65%;
		}
	}

	.new-user-message {
		text-align: center;
		margin-top: 0;

		font-size: 1.05rem;
		a {
			transition: 0.2s all;
			color: var(--blue);
			&:hover {
				color: #fff;
			}
		}
	}
</style>
