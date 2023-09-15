<script>
	import { scrapes, urlHistory } from './store';
</script>

{#if $scrapes.length === 0}
	<p class="default-display-message">You haven't made any citations.</p>
{:else}
	<section class="display">
		{#each $scrapes as scrape, i}
			<div class="block-wrap">
				<h3>Citation {i + 1}: <a href={$urlHistory[i]} target="#">{scrape.title}</a></h3>
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
						<textarea class="no-resize" spellcheck="false" bind:value={scrape.volumeAndPageRange} />
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

<style lang="scss">
	.default-display-message {
		text-align: center;
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
