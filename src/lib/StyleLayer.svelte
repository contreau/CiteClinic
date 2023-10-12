<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { Citation } from '../ts/types';
	import { urlHistory } from './store';
	import { onMount } from 'svelte';

	// * Color Picker Component
	onMount(async () => {
		await import('vanilla-colorful');
	});

	let color = '#000000';

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
		class="btn-grad"
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
			<p class="style-option-title"><b>Border Thickness </b></p>

			<p class="style-option-title"><b>Border Color </b></p>

			<p class="style-option-title"><b>Shadow Type </b></p>

			<hr />

			<div class="border-thickness grid-item">
				<p class="border-value-text">{borderThickness}px</p>
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
				<output class="color-value-text">{color}</output>
				<hex-color-picker {color} on:color-changed={handleColorChanged} />
			</div>

			<div class="shadow-control grid-item">
				<div class="radio-input-block">
					<div>
						<input name="shadow-options" id="shadow1" type="radio" />
						<label for="shadow1">Shadow 1</label>
					</div>
					<br />
					<div>
						<input name="shadow-options" id="shadow2" type="radio" />
						<label for="shadow2">Shadow 2</label>
					</div>
					<br />
					<div>
						<input name="shadow-options" id="shadow3" type="radio" />
						<label for="shadow3">Shadow 3</label>
					</div>
					<div>
						<input name="shadow-options" id="noshadow" type="radio" />
						<label for="noshadow">None</label>
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
		<button class="html-btn">Copy HTML &lt;/&gt;</button>
		<button class="css-btn">Copy CSS &lbrace; &rbrace;</button>
	</div>
</div>

<style lang="scss">
	.block-wrap {
		opacity: 0;
		animation: fadeIn 0.4s ease-in forwards;

		h3 {
			font-size: 1.5rem;
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

	.btn-grad {
		background-image: linear-gradient(to right, #1a2980 0%, #0bb6b3 51%, #1a2980 100%);
		font-size: inherit;
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
		background-color: #1e1e1ed2;
		border-radius: 15px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		justify-content: center;
		margin: 0 auto;
		margin-top: 1rem;
		padding-bottom: 1.5em;
		padding-top: 0.8em;
		// align-items: center;

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

	hr {
		grid-column: span 3;
		margin-top: 0;
		margin-bottom: 0.5rem;
		width: 100%;
		border-radius: 15px;
		color: #4a4a4a;
	}

	.style-option-title {
		font-size: 1.5rem;
		color: #56a8ff;
		text-align: center;
		margin-top: 0;
		margin-bottom: 0.8rem;
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
			min-width: 127px;
			label {
				font-size: 1.25rem;
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
			gap: 2rem;
		}

		.style-option-title,
		hr {
			display: none;
		}
	}
</style>
