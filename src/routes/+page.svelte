<script lang="ts">
	import Fetcher from '$lib/Fetcher.svelte';
	import CitationDisplay from '$lib/CitationDisplay.svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Your Citations • CiteClinic</title>
	<meta
		name="description"
		content="CiteClinic allows users to easily scrape citation information from medical journal sites and generate modifiable, styled UI components."
	/>
	<meta name="title" content="Generate Styled Medical Journal Citations • CiteClinic" />
	<meta property="og:title" content="Generate Styled Medical Journal Citations • CiteClinic" />
	<meta property="og:url" content="https://citeclinic.app" />
	<meta
		property="og:description"
		content="CiteClinic allows users to easily scrape citation information from medical journal sites and generate modifiable, styled UI components."
	/>
</svelte:head>

<main in:fade={{ duration: 200, delay: 200 }} out:fade={{ duration: 200 }}>
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
