<script>
	import { scrapes, urlHistory } from './store';
</script>

<section class="citation-display-area padding-container">
	{#if $scrapes.length === 0}
		<div class="default-display">
			<p class="default-display-icon"><i class="fa-solid fa-bookmark" /></p>
			<p class="default-display-message">You haven't made any citations.</p>
		</div>
	{:else}
		<section class="display">
			{#each $scrapes as scrape, i}
				<div class="block-wrap">
					<h3>Citation {i + 1}<br /><a href={$urlHistory[i]} target="#">{scrape.title}</a></h3>
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
					<div class="block--display">
						<p>
							{scrape.authors}
							{scrape.title}
							{scrape.journalAbbreviation}
							{scrape.publishYear}{scrape.volumeAndPageRange}
						</p>
					</div>
				</div>
			{/each}
		</section>
	{/if}
</section>

<style lang="scss">
	.citation-display-area {
		border-top: solid 0.5px #484848;
		border-bottom: solid 0.5px #484848;
		-webkit-backdrop-filter: brightness(75%);
		backdrop-filter: brightness(75%);
	}

	// Display with citations
	.default-display {
		padding: 1.8em 0;
		p {
			text-align: center;
		}
		p.default-display-message {
			font-size: 1.25rem;
			font-weight: 600;
		}

		p.default-display-icon {
			font-size: 1.4rem;
			color: var(--green);
			filter: drop-shadow(0 0 0.3em var(--green));
		}
	}

	// Populated citation display container
	.display {
		padding-top: 1em;
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
			background-color: rgba(8, 17, 24, 0.8392156863);
			max-width: 75%;
			margin: 0 auto;
			margin-bottom: 2rem;
			padding: 1em;
			box-shadow: rgba(53, 255, 161, 0.396) 0px 0px 5px 0px,
				rgba(53, 255, 161, 0.396) 0px 0px 1px 0px;

			// border: solid 1px #565656;
			border-radius: 30px;

			a {
				color: var(--green);
				transition: color 0.2s;
				&:hover,
				&:focus {
					color: #fff;
				}
			}
		}
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
		border-top: 18.5px solid var(--green);
		border-left: 18.5px solid transparent;
		border-right: 18.5px solid transparent;
		border-bottom: 18.5px solid transparent;
		border-radius: 100%;
		filter: drop-shadow(0 0 0.3em var(--green));
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
