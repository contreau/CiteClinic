<script lang="ts">
	import { scrapes, urlHistory, expandedClass } from './store';

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

	function navigateTabs(citationNumber: number, event: Event) {
		const allTabContents: HTMLElement[] = Array.from(document.querySelectorAll('.section-wrap'));
		const allTabButtons: HTMLElement[] = Array.from(document.querySelectorAll('.content-tab'));
		const sourceButton = event.target as HTMLElement;
		const activeContent: HTMLElement = document.querySelector(`.section-${citationNumber}`)!;

		// sets active citation, hides rest
		allTabContents.map((tab) => tab.classList.add('display-none'));
		activeContent.classList.remove('display-none');

		// highlights active nav tab, dims rest
		allTabButtons.map((button) => button.classList.remove('active-tab'));
		sourceButton.classList.add('active-tab');
	}

	function deleteCitation(citationNumber: number) {
		$scrapes.splice(citationNumber, 1);
		$scrapes = $scrapes; // reactivity (rerenders the {#each} blocks)
		if ($scrapes.length === 1) {
			const activeContent: HTMLElement = document.querySelector(`.section-1`)!;
			activeContent.classList.remove('display-none');
		}
	}
</script>

<div class="tab-container">
	{#each $scrapes as scrape, i}
		<button
			on:click={(event) => {
				navigateTabs(i + 1, event);
			}}
			class={`content-tab tab-${i + 1}`}
			>Citation {i + 1}
			<button
				on:click={() => {
					deleteCitation(i);
				}}
				class="deleteTab"><i class="fa-solid fa-circle-xmark" /></button
			></button
		>
	{/each}
</div>

<section class="citation-display-area {$expandedClass}">
	<p class="default-display-icon"><i class="fa-solid fa-bookmark" /></p>
	{#if $scrapes.length === 0}
		<div class="default-display">
			<p class="default-display-message">Create your first citation.</p>
		</div>
	{:else}
		<div class="wrap">
			<section class="display">
				{#each $scrapes as scrape, i}
					<div class={`section-${i + 1} section-wrap`}>
						<div class="block-wrap">
							<h3>
								<a href={$urlHistory[i]} target="#">{scrape.displayTitle}</a>
							</h3>
							<div class="block--display">
								<p class={`citation-${i}-text`}>
									{scrape.authors}
									{scrape.title}
									{scrape.journalAbbreviation}
									{scrape.publishYear}{scrape.volumeAndPageRange}
								</p>
							</div>
							<div class="copy-buttons">
								<button
									class="text-btn"
									on:click={(event) => {
										copyRawText(event, i);
									}}>Copy Raw Text</button
								>
								<button class="html-btn">Copy HTML &lt;/&gt;</button>
								<button class="css-btn">Copy CSS &lbrace; &rbrace;</button>
							</div>
						</div>
						<div class="block--edit">
							<div class="grid-item">
								<p class="input-label">Authors</p>
								<div class="input-wrap">
									<div class="resize-tab" />
									<textarea spellcheck="false" bind:value={scrape.authors} />
								</div>
							</div>
							<div class="grid-item">
								<p class="input-label">Title</p>
								<div class="input-wrap">
									<div class="resize-tab" />
									<textarea spellcheck="false" bind:value={scrape.title} />
								</div>
							</div>
							<div class="grid-item">
								<p class="input-label">Journal Abbreviation</p>
								<textarea
									class="no-resize"
									spellcheck="false"
									bind:value={scrape.journalAbbreviation}
								/>
							</div>
							<div class="grid-item">
								<p class="input-label">Volume, Issue, Page Range</p>
								<textarea
									class="no-resize"
									spellcheck="false"
									bind:value={scrape.volumeAndPageRange}
								/>
							</div>
							<div class="grid-item">
								<p class="input-label">Publish Year</p>
								<textarea class="no-resize" spellcheck="false" bind:value={scrape.publishYear} />
							</div>
							<div class="grid-item">
								<p class="input-label">Extra Information</p>
								<textarea class="no-resize" spellcheck="false" readonly>DOI: {scrape.doi}</textarea>
							</div>
						</div>
					</div>
				{/each}
			</section>
		</div>
	{/if}
</section>

<style lang="scss">
	.tab-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.8rem;
		margin: 0 auto;
		min-height: 40px;
		transition: min-width 0.3s;
	}

	.content-tab {
		opacity: 0;
		animation: fadeIn 0.2s linear forwards;
		font-size: 1.25rem;
		background-color: #000e18;
		border-bottom: none;
		border: solid 2px rgb(115, 115, 115);
		border-bottom: none;
		border-top-right-radius: 25px;
		border-top-left-radius: 25px;
		padding: 0.2em 0.3em 0.3em 0.7em;
		cursor: pointer;
		transition: 0.2s all;
		&:hover,
		&:focus-visible {
			background-color: #03375a;
			outline: transparent;
			color: #fff;
		}

		i {
			font-size: 0.95rem;
			vertical-align: 1px;
			color: rgb(163, 163, 163);
			padding: 0 0.2em;
			&:hover {
				color: #fb6565;
			}
		}
	}

	.deleteTab {
		background: transparent;
		border: transparent;
		cursor: pointer;
	}

	// toggled with js (part of navtabs)
	.display-none {
		display: none;
	}

	// toggled with js (part of navtabs)
	.active-tab {
		// background-color: #fff;
		// color: #000e18;
		background-color: #03375a;
		color: #fff;
	}

	.wrap {
		max-width: 1300px;
		margin: 0 auto;
	}

	.citation-display-area {
		transition: all 0.5s;
		border: solid 0.5px #484848;
		-webkit-backdrop-filter: brightness(75%);
		backdrop-filter: brightness(65%);
		max-width: 650px;
		border-radius: 20px;
		margin: 0 auto;
		width: 100%; // will shrink if removed bc it's a flex item
	}

	.expanded {
		border: none;
		border-top: solid 0.5px #484848;
		border-bottom: solid 0.5px #484848;
		max-width: 100%;
		padding: 0.5em 5em;
		border-radius: 0;
	}

	// Display with citations
	.default-display {
		p {
			text-align: center;
		}
		p.default-display-message {
			font-size: 1.25rem;
			font-weight: 600;
		}
	}

	// Populated citation display container
	.display {
		padding-top: 1em;

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
				max-width: 800px;
				color: #000;
				background-color: #eeeded;
				box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
				border-radius: 10px;
				padding: 0.8em;
				margin-left: auto;
				margin-right: auto;
			}
		}
	}

	.copy-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4rem;
		padding-bottom: 2em;
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

	.no-resize {
		resize: none;
	}

	.block--edit {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.2rem;
	}

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

	.default-display-icon {
		text-align: center;
		font-size: 1.4rem;
		margin-bottom: 0;
		color: var(--blue);
		filter: drop-shadow(0 0 0.3em var(--blue));
	}

	textarea {
		background-color: #201f26;
		display: block;
		font-size: 0.9rem;
		width: 100%;
		margin-bottom: 0.5rem;
		resize: vertical;
		padding: 0.5em 1em 0.5em 1em;
		border-radius: 10px;
		border: solid 1px transparent;
		position: relative;
		z-index: 1;
		transition: background-color 0.2s;
		&:focus,
		&:hover {
			outline: none;
			background-color: #2b2a33;
		}
	}

	.input-wrap {
		position: relative;
		display: block;
	}

	.resize-tab {
		border-top: 18.5px solid var(--blue);
		border-left: 18.5px solid transparent;
		border-right: 18.5px solid transparent;
		border-bottom: 18.5px solid transparent;
		border-radius: 100%;
		filter: drop-shadow(0 0 0.3em var(--blue));
		transform: rotate(135deg);
		position: absolute;
		bottom: -2px;
		right: -3px;
		pointer-events: none;
		z-index: 2;
	}

	.input-label {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}
</style>
