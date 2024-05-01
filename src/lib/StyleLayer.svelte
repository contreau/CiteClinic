<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Citation } from '../ts/types';
	import { urlHistory } from './store';
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('vanilla-colorful');
		// component is reinstantiated with updates to props. Copiable cssText is updated.
		lastCheckedRadioButton = citationObject.boxShadow;
		cssText.borderWidth = `${citationObject.borderWidth}px`;
		cssText.borderColor = citationObject.borderColor;
		cssText.boxShadow = `${shadows[citationObject.boxShadow]}`;
		citationParagraph.style.setProperty('--border-color', `${citationObject.borderColor}`);
		citationParagraph.style.setProperty('--box-shadow', `${shadows[citationObject.boxShadow]}`);
		citationParagraph.style.setProperty('--border-width', `${citationObject.borderWidth}px`);
		const lastShadowInput: HTMLInputElement | null = document.querySelector(
			`#component${itemIndex + 1}-${lastCheckedRadioButton}`
		);
		if (lastShadowInput !== null) lastShadowInput.checked = true;
		if (citationObject.stylesVisible) styleDropdownVisible = true;

		findNulls(citationObject, nullFieldsLookup);
	});

	// Props
	export let itemIndex: number;
	export let citationObject: Citation;

	function handleColorChanged(event: any) {
		citationObject.borderColor = event.detail.value;
		citationParagraph.style.setProperty('--border-color', `${citationObject.borderColor}`);
		cssText.borderColor = citationObject.borderColor;
	}

	// toggles reveal of styling options
	async function toggleStyleDropdown(lastCheckedRadioButton: string) {
		styleDropdownVisible = !styleDropdownVisible;
		citationObject.stylesVisible = !citationObject.stylesVisible;
		await styleDropdownVisible;
		const lastShadowInput: HTMLInputElement | null = document.querySelector(
			`#component${itemIndex + 1}-${lastCheckedRadioButton}`
		);
		if (lastShadowInput !== null) lastShadowInput.checked = true;
	}

	$: {
		if (styleDropdownVisible) optionsText = 'Close Options';
		else optionsText = 'Style Options';
		// toggleStyleDropdown(lastCheckedRadioButton);
	}

	// copy raw text to clipboard
	async function copyRawText(event: Event, scrapeNumber: number) {
		const citationText: string | null =
			document.querySelector(`.citation-${scrapeNumber}-text`)?.textContent ?? null;
		if (citationText !== null) {
			await navigator.clipboard.writeText(citationText);
			const button = event.target as HTMLElement;
			button.textContent = 'Copied!';
			setTimeout(() => {
				button.textContent = 'Copy Raw Text';
			}, 2000);
		}
	}

	// copy html to clipboard
	async function copyHTML(event: Event, scrapeNumber: number) {
		const citationText: string | null =
			document.querySelector(`.citation-${scrapeNumber}-text`)?.textContent ?? null;
		const htmlString: string = `<p class="styled-citation">${citationText}</p>`;
		if (citationText !== null) {
			await navigator.clipboard.writeText(htmlString);
			const button = event.target as HTMLElement;
			button.textContent = 'Copied!';
			setTimeout(() => {
				button.innerHTML = 'Copy HTML &lt;/&gt;';
			}, 2000);
		}
	}

	// copy css to clipboard
	async function copyCSS(event: Event) {
		const cssString: string = `
		.styled-citation {
			border-width: ${cssText.borderWidth};
			border-color: ${cssText.borderColor};
			box-shadow: ${cssText.boxShadow};
			border-radius: 10px;
			border-style: solid;
			color: #000;
			background-color: #eeeded;
			padding: 0.8em;
		}`;
		await navigator.clipboard.writeText(cssString);
		const button = event.target as HTMLElement;
		button.textContent = 'Copied!';
		setTimeout(() => {
			button.innerHTML = 'Copy CSS &lbrace; &rbrace;';
		}, 2000);
	}

	// box-shadow select function
	function selectShadow(event: Event, shadows: Record<string, string>) {
		const button = event.currentTarget as HTMLInputElement;
		button.checked = true;
		if (button.dataset.name) {
			citationParagraph.style.setProperty('--box-shadow', `${shadows[button.dataset.name]}`);
			citationObject.boxShadow = `${button.dataset.name}`;
			cssText.boxShadow = `${shadows[citationObject.boxShadow]}`;
			lastCheckedRadioButton = button.dataset.name;
		}
	}

	// box-shadow options
	const shadows: Record<string, string> = {
		noShadow: 'none',
		shadow1: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
		shadow2: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
		shadow3:
			'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset'
	};
	// modifiable css properties
	const cssText: Record<string, string> = {
		borderWidth: '0px',
		borderColor: '#000000',
		boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px'
	};
	const nullFieldsLookup: Record<string, string> = {
		pages: 'Page Range',
		issue: 'Issue Number',
		volume: 'Volume Number'
	};

	function findNulls(object: Citation, nullFieldsLookup: Record<string, string>) {
		for (let key in object) {
			if (object[key as keyof object] === null) {
				nullFields = [...nullFields, nullFieldsLookup[key]];
			}
		}
	}

	let styleDropdownVisible: boolean = false;
	let optionsText: string = 'Style Options';
	let citationParagraph: HTMLParagraphElement;
	let lastCheckedRadioButton: string;
	let nullFields: string[] = [];
</script>

<div class="block-wrap">
	<h3>
		<a href={$urlHistory[itemIndex]} target="#">{citationObject.displayTitle}</a>
	</h3>
	<div class="block--display">
		<p bind:this={citationParagraph} class={`citation-${itemIndex}-text`}>
			{citationObject.authors}
			{citationObject.title}
			{citationObject.journalAbbreviation}
			{citationObject.publishYear}{citationObject.volumeAndPageRange}
		</p>
	</div>
	<button
		class="btn-grad"
		id={`dropdown-btn-${itemIndex + 1}`}
		on:click={() => {
			toggleStyleDropdown(lastCheckedRadioButton);
		}}>{optionsText}</button
	>
	{#if styleDropdownVisible}
		<div
			class="style-options-wrap"
			in:fly={{ x: -200, duration: 650 }}
			out:fade={{ duration: 200 }}
		>
			<p class="style-option-title"><b>Border Thickness </b></p>

			<p class="style-option-title"><b>Border Color </b></p>

			<p class="style-option-title"><b>Shadow Type </b></p>

			<hr />

			<div class="border-thickness grid-item">
				<p class="border-value-text">{citationObject.borderWidth}px</p>
				<input
					type="range"
					bind:value={citationObject.borderWidth}
					min="0"
					max="20"
					step="0.1"
					on:input={() => {
						citationParagraph.style.setProperty(
							'--border-width',
							`${citationObject.borderWidth}px`
						);
						cssText.borderWidth = `${citationObject.borderWidth}px`;
					}}
				/>
			</div>
			<div class="border-color grid-item">
				<output class="color-value-text">{citationObject.borderColor}</output>
				<hex-color-picker
					color={citationObject.borderColor}
					on:color-changed={handleColorChanged}
				/>
			</div>

			<div class="shadow-control grid-item">
				<div class="radio-input-block">
					<div class="form-control">
						<input
							on:input={(event) => {
								selectShadow(event, shadows);
							}}
							name={`shadow-options-${itemIndex + 1}`}
							id={`component${itemIndex + 1}-shadow1`}
							value="shadow1"
							data-name="shadow1"
							type="radio"
							checked={citationObject.boxShadow === 'shadow1'}
						/>
						<label for={`component${itemIndex + 1}-shadow1`}>Shadow 1</label>
					</div>
					<div class="form-control">
						<input
							on:input={(event) => {
								selectShadow(event, shadows);
							}}
							name={`shadow-options-${itemIndex + 1}`}
							id={`component${itemIndex + 1}-shadow2`}
							value="shadow2"
							data-name="shadow2"
							type="radio"
							checked={citationObject.boxShadow === 'shadow2'}
						/>
						<label for={`component${itemIndex + 1}-shadow2`}>Shadow 2</label>
					</div>
					<div class="form-control">
						<input
							on:input={(event) => {
								selectShadow(event, shadows);
							}}
							name={`shadow-options-${itemIndex + 1}`}
							id={`component${itemIndex + 1}-shadow3`}
							value="shadow3"
							data-name="shadow3"
							type="radio"
							checked={citationObject.boxShadow === 'shadow3'}
						/>
						<label for={`component${itemIndex + 1}-shadow3`}>Shadow 3</label>
					</div>
					<div class="form-control">
						<input
							on:input={(event) => {
								selectShadow(event, shadows);
							}}
							name={`shadow-options-${itemIndex + 1}`}
							id={`component${itemIndex + 1}-noShadow`}
							value="noShadow"
							data-name="noShadow"
							type="radio"
							checked={citationObject.boxShadow === 'noShadow'}
						/>
						<label for={`component${itemIndex + 1}-noShadow`}>None</label>
					</div>
				</div>
			</div>
		</div>
	{/if}
	<div class="copy-buttons">
		<button
			class="text-btn"
			on:click={(event) => {
				copyRawText(event, itemIndex);
			}}>Copy Raw Text</button
		>
		<button
			class="html-btn"
			on:click={(event) => {
				copyHTML(event, itemIndex);
			}}>Copy HTML &lt;/&gt;</button
		>
		<button
			class="css-btn"
			on:click={(event) => {
				copyCSS(event);
			}}>Copy CSS &lbrace; &rbrace;</button
		>
	</div>

	<h3 class="citation-fields-title">Citation Fields</h3>
	{#if nullFields.length > 0}
		<div class="null-fields-wrap">
			<p><i class="fa-solid fa-triangle-exclamation" /> <b>Null (Missing) Fields:</b></p>
			<ul>
				{#each nullFields as field, i}
					{#if i === nullFields.length - 1}
						<li>
							{field}
						</li>
					{:else}
						<li>
							{field},
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	.block-wrap {
		opacity: 0;
		animation: fadeIn 0.2s 0.2s ease-in forwards;
		h3 {
			font-size: 1.5rem;
			text-align: center;
			max-width: 75%;
			margin: 0 auto;
			padding: 1em;
			border-radius: 30px;
			a {
				color: var(--text);
				transition: color 0.2s;
				&:hover,
				&:focus {
					color: var(--accent);
				}
			}
		}
	}

	.block--display {
		max-width: 950px;
		background-color: #ffffff;
		padding: 0.5em 0.5em;
		border-radius: 10px;
		margin-top: 1rem;
		margin-bottom: 1.5rem;
		margin-right: auto;
		margin-left: auto;
		p {
			--border-width: 0px;
			--border-color: none;
			--box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
			max-width: 800px;
			color: #000;
			background-color: #eeeded;
			box-shadow: var(--box-shadow);
			border-radius: 10px;
			border-style: solid;
			border-width: var(--border-width);
			border-color: var(--border-color);
			padding: 0.8em;
			margin-left: auto;
			margin-right: auto;
			transition: box-shadow 0.3s;
		}
	}

	.btn-grad {
		background-image: linear-gradient(to right, #1a2980 0%, #0bb6b3 51%, #1a2980 100%);
		font-size: inherit;
		font-weight: 600;
		min-width: 160px;
		border: solid 2px transparent;
		margin: 0 auto;
		padding: 0.4em 1em;
		transition: 0.5s;
		background-size: 200% auto;
		color: white;
		cursor: pointer;
		border-radius: 10px;
		display: block;
	}

	.btn-grad:hover {
		background-position: right center; /* change the direction of the change here */
		color: #fff;
		text-decoration: none;
	}

	.style-options-wrap {
		background-color: var(--background);
		color: var(--text);
		border-radius: 15px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-content: center;
		margin: 0 auto;
		margin-top: 1rem;
		padding-bottom: 1.5em;
		padding-top: 0.8em;

		.grid-item {
			justify-self: center;
			place-self: center;
		}
	}

	.copy-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4rem;
		padding-bottom: 2em;
		padding-top: 2em;
		button {
			min-width: 10rem;
			font-size: inherit;
			font-weight: 600;
			padding: 0.4em 1em;
			border-radius: 10px;
			border: solid 3px transparent;
			transition: all 0.3s;
			background-color: var(--textarea);
			color: #fff;
			cursor: pointer;
			&:hover,
			&:focus-visible {
				outline: transparent;
			}

			&.text-btn {
				border-color: #201f26;
				background-color: #201f26;
				&:hover,
				&:focus-visible {
					box-shadow: 20px -8px rgb(253, 253, 253);
				}
			}
			&.html-btn {
				border-color: #d93300;
				background-color: #d93300;
				&:hover,
				&:focus-visible {
					box-shadow: 20px -8px #fe6c40;
				}
			}
			&.css-btn {
				border-color: #0073ff;
				background-color: #0073ff;
				&:hover,
				&:focus-visible {
					box-shadow: 20px -8px #519fff;
				}
			}
		}
	}

	hr {
		grid-column: span 3;
		margin-top: 0;
		margin-bottom: 0.5rem;
		width: 100%;
		border-radius: 15px;
		border: solid 1px;
		color: var(--text);
	}

	.style-option-title {
		font-size: 1.5rem;
		color: var(--text);
		text-align: center;
		margin-top: 0;
		margin-bottom: 0.8rem;
	}

	input[type='range'] {
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-runnable-track {
		background-color: #fff;
		border-radius: 30px;
	}

	input[type='range']::-webkit-slider-thumb {
		color: var(--blue);
	}

	.border-thickness {
		.border-value-text {
			text-align: center;
			font-size: 1.35rem;
		}

		input {
			display: block;
			margin: 0 auto;
		}
	}

	.color-value-text {
		display: block;
		text-align: center;
		font-size: 1.35rem;
	}

	.radio-input-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		div {
			min-width: 154px;
			label {
				font-size: 1.25rem;
			}
		}
	}

	.form-control {
		font-size: 1.1rem;
		line-height: 1;
		display: grid;
		grid-template-columns: 1em auto;
		align-items: center;
		gap: 1em;
	}

	.form-control + .form-control {
		margin-top: 0.8rem;
	}

	input[type='radio'] {
		--button-color: #fff;
		-webkit-appearance: none;
		appearance: none;
		background-color: #1e1e1ed2;
		margin: 0;
		font: inherit;
		color: var(--button-color);
		width: 1.15em;
		height: 1.15em;
		border: 0.15em solid var(--primary);
		border-radius: 50%;
		display: grid;
		place-items: center;
		cursor: pointer;
	}

	input[type='radio']::before {
		content: '';
		width: 0.6em;
		height: 0.6em;
		border-radius: 50%;
		transform: scale(0);
		transition: 120ms transform ease-in-out;
		box-shadow: inset 1em 1em #fff;
	}

	input[type='radio']:checked::before {
		transform: scale(1);
	}

	input[type='radio']:focus-visible {
		outline: max(2px, 0.15em) solid var(--button-color);
		outline-offset: max(2px, 0.15em);
	}

	// Color Picker
	hex-color-picker {
		width: 150px;
		height: 150px;
		margin: 0 auto;
	}

	.block-wrap {
		h3.citation-fields-title {
			border-bottom: solid 1px var(--text);
			border-radius: 0;
			font-size: 1.4rem;
			text-align: left;
			max-width: 100%;
			padding: 0;
			margin-bottom: 0.8rem;
		}
	}

	// Null Fields
	.null-fields-wrap {
		display: flex;
		justify-content: center;
		margin: 1.5rem auto;
		padding: 0.5em 2em;
		border-radius: 30px;
		background-color: var(--nullfields);
		width: fit-content;
		color: #000000;
		p,
		ul {
			margin: 0;
		}
		ul {
			padding-left: 0.3em;
			li {
				display: inline;
			}
		}
	}

	@media (max-width: 550px) {
		.null-fields-wrap {
			display: block;
			text-align: center;
		}
	}

	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}

	@media (max-width: 740px) {
		.block-wrap h3 {
			padding: 0;
			max-width: 100%;
		}

		.copy-buttons {
			flex-direction: column;
			gap: 1rem;
		}

		.style-options-wrap {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.style-option-title,
		hr {
			display: none;
		}
	}
</style>
