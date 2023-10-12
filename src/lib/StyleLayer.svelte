<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Citation } from '../ts/types';
	import { urlHistory } from './store';
	import { onMount } from 'svelte';

	// * Color Picker Component
	onMount(async () => {
		await import('vanilla-colorful');
	});

	let color = '#1e88e5';

	function handleColorChanged(event: any) {
		color = event.detail.value;
		citationParagraph.style.setProperty('--border-color', `${color}`);
	}
	// *

	$: {
		if (styleDropdownVisible) optionsText = 'Close Options';
		else optionsText = 'Style Options';
	}

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

	let borderThickness: number = 0;
	let styleDropdownVisible: boolean = false;
	let optionsText: string = 'Style Options';
	let citationParagraph: HTMLParagraphElement;

	// Props
	export let itemIndex: number;
	export let citationObject: Citation;
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
		class="style-dropdown"
		on:click={() => {
			styleDropdownVisible = !styleDropdownVisible;
		}}>{optionsText}</button
	>
	{#if styleDropdownVisible}
		<div
			class="style-options-wrap"
			in:fly={{ x: -200, duration: 650 }}
			out:fade={{ duration: 200 }}
		>
			<div class="border-thickness grid-item">
				<p><b>Border Thickness </b></p>
				<p>{borderThickness}px</p>
				<input
					type="range"
					bind:value={borderThickness}
					min="0"
					max="20"
					step="0.1"
					on:input={() => {
						citationParagraph.style.setProperty('--border-width', `${borderThickness}px`);
					}}
				/>
			</div>
			<div class="border-color grid-item">
				<output><p><b>Border Color: </b>{color}</p></output>
				<hex-color-picker {color} on:color-changed={handleColorChanged} />
			</div>

			<div class="style-input shadow-control grid-item">
				<p><b>Shadow Type</b></p>
				<input name="shadow-options" id="shadow1" type="radio" />
				<label for="shadow1">Shadow 1</label>
				<br />
				<input name="shadow-options" id="shadow2" type="radio" />
				<label for="shadow2">Shadow 2</label>
				<br />
				<input name="shadow-options" id="shadow3" type="radio" />
				<label for="shadow3">Shadow 3</label>
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
		<button class="html-btn">Copy HTML &lt;/&gt;</button>
		<button class="css-btn">Copy CSS &lbrace; &rbrace;</button>
	</div>
</div>

<style lang="scss">
	.block-wrap {
		opacity: 0;
		animation: fadeIn 0.4s ease-in forwards;

		h3 {
			text-align: center;
			max-width: 75%;
			margin: 0 auto;
			padding: 1em;
			border-radius: 30px;
			a {
				color: var(--blue);
				transition: color 0.2s;
				&:hover,
				&:focus {
					color: #fff;
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
		border: solid 3px #8d8d8d;
		p {
			--border-width: 0px;
			--border-color: none;
			max-width: 800px;
			color: #000;
			background-color: #eeeded;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
			border-radius: 10px;
			border-style: solid;
			border-width: var(--border-width);
			border-color: var(--border-color);
			padding: 0.8em;
			margin-left: auto;
			margin-right: auto;
		}
	}

	button.style-dropdown {
		display: block;
		margin: 0 auto;
		font-size: inherit;
		padding: 0.4em 1em;
		border-radius: 10px;
		border: solid 2px transparent;
		transition: all 0.3s;
		background-color: #2b2a33;
		cursor: pointer;
		&:hover,
		&:focus-visible {
			outline: transparent;
			background-color: #474747;
		}
	}

	.style-options-wrap {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-content: center;
		margin: 0 auto;
		padding-bottom: 2em;
		padding-top: 1em;
		// align-items: center;

		.grid-item {
			justify-self: center;
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
			padding: 0.4em 1em;
			border-radius: 10px;
			border: solid 2px transparent;
			transition: all 0.3s;
			background-color: #2b2a33;
			cursor: pointer;
			&:hover,
			&:focus-visible {
				outline: transparent;
				background-color: #474747;
			}

			&.text-btn {
				border-color: #e2e2e2;
			}
			&.html-btn {
				border-color: #fe3e03;
			}
			&.css-btn {
				border-color: #0073ff;
			}
		}
	}

	// Color Picker
	hex-color-picker {
		width: 150px;
		height: 150px;
		margin: 0 auto;
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
		}
	}
</style>
