<script lang="ts">
	import { scrapes, urlHistory, expandedClass, firstCitationMade, activeTabIndex } from './store';
	import type { Citation } from '../ts/types';
	import { onMount } from 'svelte';

	let mobileView: boolean;
	onMount(() => {
		if (window.innerWidth < 810) {
			console.log(window.innerWidth);
			mobileView = true;
		} else mobileView = false;
	});

	// TODO:
	// * Make UI adjustments given changes to server config
	// * some kind of DOI validation (for '10.'), also trim big empty strings before submitting to server
	// * reference the netlify project copy when building out the name cleaning algorithm
	// * Look into possibility of generating formatted citation using crossref: https://citation.crosscite.org/docs.html#sec-4-1

	let input: HTMLInputElement;
	let buttonClass = 'dormant';
	let buttonAnimation = 'none';
	let loadingSymbol: HTMLDivElement;
	let fetchErrorMessage = 'Nothing to see here.';
	let loadSymbolClass1 = 'none';
	let loadSymbolClass2 = 'none';
	let displayErrorClass = 'none';
	let throttleRequest = false;

	function lightFetchButton() {
		if (input.value !== '') {
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
		loadSymbolClass1 = 'none';
		loadSymbolClass2 = 'none';
		setTimeout(() => {
			displayErrorClass = 'none';
			loadingSymbol.style.setProperty('--symbol-color', 'var(--blue)');
		}, displayTime);
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
			// loadSymbolClass = 'none';
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

	// cite button handler
	function citeButtonActions() {
		// console.log(`throttle is ${throttleRequest}`);
		if ($scrapes.length === 1 && mobileView) {
			showErrorUI(3000, 'Use CiteClinic on a desktop to generate more citations.');
		} else if ($scrapes.length === 8) {
			showErrorUI(3000, 'Maximum of 8 citations. Delete one to continue.');
		} else if (input.value === null || input.value === '') {
			buttonAnimation = 'rejectButton';
			console.log('invalid input');
			showErrorUI(2000, 'Missing fields.');
			setTimeout(() => {
				buttonAnimation = 'none';
			}, 500);
		} else if (!throttleRequest) {
			throttleRequest = true;
			submitDOI(input);
		}
	}

	// server interaction
	async function submitDOI(input: HTMLInputElement) {
		loadSymbolClass1 = 'animation-loadUp';
		loadSymbolClass2 = 'animation-loadDown';
		const response = await fetch(`/api/crossref?doi=${input.value}`);
		if (response.status === 404) {
			showErrorUI(3000, 'Invalid DOI.');
			throttleRequest = false;
			throw new Error('Invalid DOI.');
		} else {
			$urlHistory = [...$urlHistory, `https://doi.org/${input.value}`];
			const data = await response.json();
			displayResults(data);
			setTimeout(() => {
				loadSymbolClass1 = 'none';
				loadSymbolClass2 = 'none';
			}, 1300);
		}
	}
</script>

<div class="input-field">
	<input
		bind:this={input}
		on:input={lightFetchButton}
		type="text"
		class="url-input"
		placeholder="Paste DOI (example: 10.1056/NEJMoa2303062)"
	/>

	<button on:click={citeButtonActions} type="submit" class="submit {buttonClass} {buttonAnimation}"
		>CITE <i class="fa-solid fa-angles-right" /></button
	>
</div>

<div class="loading-block">
	<div bind:this={loadingSymbol} class="load-symbol-container">
		<span class="dot dot1 {loadSymbolClass1}" />
		<span class="dot dot2 {loadSymbolClass2}" />
		<span class="dot dot3 {loadSymbolClass1}" />
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

				// &.dot2 {
				// 	animation-delay: 0.3s;
				// }
				// &.dot3 {
				// 	animation-delay: 0.6s;
				// }
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

	.animation-loadUp {
		animation: loadUp 1.25s ease-in 1;
	}

	.animation-loadDown {
		animation: loadDown 1.25s ease-in 1;
	}

	@keyframes loadUp {
		20% {
			transform: translateY(-15px);
		}
		55% {
			transform: translateY(15px);
		}

		80% {
			transform: translateY(0px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	@keyframes loadDown {
		20% {
			transform: translateY(15px);
		}
		55% {
			transform: translateY(-15px);
		}
		80% {
			transform: translateY(0px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.input-field {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin: 0 auto;
		margin-top: 0.8rem;
		max-width: 1000px;
		padding: 1em;
		border-radius: 30px;

		input {
			border: solid 3px transparent;
			border-radius: 15px;
			padding: 0.5em;
			font-size: 1rem;
			outline: transparent;
			transition: 0.2s border;
			&:focus-visible {
				border: solid 3px #fff;
			}
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

	@media (max-width: 400px) {
		.input-wrap .input-field .url-input {
			width: 100%;
		}

		.input-field {
			flex-direction: column;
			gap: 1.2rem;
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
