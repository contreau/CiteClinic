<script lang="ts">
	import Fetcher from '$lib/Fetcher.svelte';
	import CitationDisplay from '$lib/CitationDisplay.svelte';
</script>

<main>
	<div class="content-grid">
		<div class="grid-item item1">
			<Fetcher />
		</div>
		<div class="grid-item item2">
			<CitationDisplay />
		</div>
	</div>
</main>

<style lang="scss">
	// the 2 main content svelte components
	.content-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	main {
		padding-top: 0.5em;
		flex: 1 0 auto; // sticks footer to bottom
	}
</style>
