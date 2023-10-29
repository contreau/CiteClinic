<script lang="ts">
	import {
		parseData_NEJM,
		parseData_LANCET,
		parseData_JAMA,
		parseData_BMJ,
		parseData_NATURE,
		parseData_PUBMED
	} from '../ts/serverFunctions';

	import {
		pubmedPARAMS,
		naturePARAMS,
		nejmPARAMS,
		lancetPARAMS,
		jamaPARAMS,
		bmjPARAMS
	} from './parameters';

	import { scrapes, urlHistory, expandedClass, firstCitationMade, activeTabIndex } from './store';
	import type { Citation, Param } from '../ts/types';
	import { onMount } from 'svelte';

	let mobileView: boolean;
	onMount(() => {
		if (window.innerWidth < 810) {
			console.log(window.innerWidth);
			mobileView = true;
		} else mobileView = false;
	});

	// TODO: * any final touch-ups

	let input: HTMLInputElement;
	let source: HTMLSelectElement;
	let sourceSelect = 'Select';
	let buttonClass = 'dormant';
	let buttonAnimation = 'none';
	let inputWrap: HTMLDivElement;
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
		loadSymbolClass = 'none';
		setTimeout(() => {
			displayErrorClass = 'none';
			loadingSymbol.style.setProperty('--symbol-color', 'var(--blue)');
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
		const activeContent: HTMLElement = document.querySelector(`.section-${$scrapes.length - 1}`)!;

		const sourceButton: HTMLElement = document.querySelector(`.tab-${$scrapes.length - 1}`)!;

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
			$activeTabIndex = $scrapes.length - 1;
			$expandedClass = 'expanded'; // expands citationDisplay to full width
			$firstCitationMade = true;
			buttonClass = 'dormant';
			input.value = '';
			input.focus();
			console.log('Fetched Data:', $scrapes);
			setNavTabsOnLoad();
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
		if ($scrapes.length === 1 && mobileView) {
			showErrorUI(3000, 'Use CiteClinic on a desktop to generate more citations.');
		} else if ($scrapes.length === 8) {
			showErrorUI(3000, 'Maximum of 8 citations. Delete one to continue.');
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
		parseDataCallback: (input: HTMLInputElement) => Promise<Citation>
	) {
		if (validateURL(input, param)) {
			throttleRequest = true;
			loadSymbolClass = 'animation-load';
			const result = await parseDataCallback(input);
			displayResults(result);
		}
	}

	// server interaction + page scraping
	async function launchFetch(input: HTMLInputElement) {
		switch (sourceSelect) {
			case 'PubMed':
				retrieveAndDisplay(input, pubmedPARAMS, parseData_PUBMED);
				break;
			case 'Nature':
				retrieveAndDisplay(input, naturePARAMS, parseData_NATURE);
				break;
			case 'NEJM':
				retrieveAndDisplay(input, nejmPARAMS, parseData_NEJM);
				break;
			case 'Lancet':
				retrieveAndDisplay(input, lancetPARAMS, parseData_LANCET);
				break;
			case 'JAMA':
				retrieveAndDisplay(input, jamaPARAMS, parseData_JAMA);
				break;
			case 'BMJ':
				retrieveAndDisplay(input, bmjPARAMS, parseData_BMJ);
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
		class="submit {buttonClass} {buttonAnimation}"
		>CITE <i class="fa-solid fa-angles-right" /></button
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
		<p class="fetchStatus errorStatus {displayErrorClass}">
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
				width: 13.5px;
				min-height: 13.5px;
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
			color: #f84545;
		}
	}

	.animation-load {
		opacity: 1;
		animation: load 1s linear infinite;
	}

	@keyframes load {
		25% {
			transform: translateY(-10px);
			background-color: #00ff73;
		}
		50% {
			transform: translateY(0px);
		}
		75% {
			transform: translateY(10px);
		}
		100% {
			transform: translateY(0px);
			background-color: var(--symbol-color);
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
	}

	.input-fields {
		display: flex;
		align-items: center;
		justify-content: space-around;

		select,
		input {
			border: solid 3px transparent;
			padding: 0.5em;
			font-size: 1rem;
			outline: transparent;
			transition: 0.2s border;
			&:focus-visible {
				border: solid 3px #fff;
			}
		}

		input {
			border-radius: 15px;
		}

		select {
			--select: var(--primary);
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
			border-radius: 15px;
			background-color: #0e6db1;
			text-align: center;
			text-align-last: center; // centers text in safari
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
		}
		.PubMed {
			background-color: var(pubmed);
		}
		.Nature {
			background-color: var(--nature);
		}
		.Lancet {
			background-color: var(--lancet);
		}
		.JAMA {
			background-color: var(--jama);
		}
		.BMJ {
			background-color: var(--bmj);
		}

		.url-input {
			background-color: var(--background);
			color: #fff;
			width: 60%;
			border: solid 3px var(--primary);
			color: var(--text);
			font-weight: 400;
			&::placeholder {
				color: var(--placeholder);
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
		border-radius: 10px;
		border: solid 1px transparent;
		outline: transparent;
		font-size: 1rem;
		font-weight: 800;
		letter-spacing: 1px;
		transition: 0.3s all;
		color: var(--text);
		&:hover {
			cursor: pointer;
		}

		&:focus-visible {
			border: solid 1px #fff;
		}
	}

	// fetch button lights up when a source is selected / url is input
	.ready {
		color: #fff;
		background-color: var(--accent);
		filter: drop-shadow(0 0 0.6em var(--accent));
	}
	.dormant {
		color: #fff;
		background-color: var(--primary);
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
		}
	}
</style>
