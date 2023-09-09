<script>
	import { scrapes, urlHistory } from './store';
</script>

<section class="display">
	{#each $scrapes as scrape, i}
		<div class="block-wrap">
			<p class="url-label"><a href={$urlHistory[i]} target="#">{$urlHistory[i]}</a></p>
			<div class="block--edit">
				<p class="input-label">Authors</p>
				<input type="text" bind:value={scrape.authors} />
				<p class="input-label">Title</p>
				<input type="text" bind:value={scrape.title} />
				<p class="input-label">Journal Abbreviation</p>
				<input type="text" bind:value={scrape.journalAbbreviation} />
				<p class="input-label">Publish Year</p>
				<input type="text" bind:value={scrape.publishYear} />
				<p class="input-label">Volume, Issue, Page Range</p>
				<input type="text" bind:value={scrape.volumeAndPageRange} />
			</div>
			<div class="block--display">
				<p>
					{scrape.authors}. {scrape.title}. {scrape.journalAbbreviation}. {scrape.publishYear};{scrape.volumeAndPageRange}.
				</p>
			</div>
		</div>
	{/each}
</section>

<style lang="scss">
	input {
		display: block;
		width: 100%;
		margin-bottom: 0.5rem;
	}
	.url-label {
		text-align: center;
	}
	.input-label {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}
</style>
