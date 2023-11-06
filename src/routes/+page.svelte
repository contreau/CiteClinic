<script lang="ts">
	import Fetcher from '$lib/Fetcher.svelte';
	import CitationDisplay from '$lib/CitationDisplay.svelte';
	import { fade } from 'svelte/transition';
	import { activeTabIndex } from '$lib/store';
	import { onMount } from 'svelte';

	onMount(() => {
		// retains active tab/content state when transitioning between user guide and main page
		if ($activeTabIndex !== undefined) {
			const activeTab = document.querySelector(`.tab-${$activeTabIndex}`);
			const allTabContents: HTMLElement[] = Array.from(document.querySelectorAll('.section-wrap'));
			const allTabButtons: HTMLElement[] = Array.from(document.querySelectorAll('.content-tab'));
			const activeContent: HTMLElement = document.querySelector(`.section-${$activeTabIndex}`)!;

			// sets active citation, hides rest
			allTabContents.map((tab) => tab.classList.add('display-none'));
			activeContent.classList.remove('display-none');

			// highlights active nav tab, dims rest
			allTabButtons.map((button) => button.classList.remove('active-tab'));
			activeTab?.classList.add('active-tab');
		}
		// Initial fade-in on first site visit
		firstVisit = !sessionStorage.getItem('visited');
		sessionStorage.setItem('visited', 'true');
		if (!firstVisit) initialLoad = 'none';
	});

	let firstVisit: boolean;
	let initialLoad: string = 'fadeIn';
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
	<div class={`content-grid ${initialLoad}`}>
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
		gap: 0rem;
	}

	main {
		padding-top: 0.5em;
		flex: 1 0 auto; // sticks footer to bottom
	}

	.fadeIn {
		opacity: 0;
		animation: fadeIn 300ms linear forwards;
	}

	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}
</style>
