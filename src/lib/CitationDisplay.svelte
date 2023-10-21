<script lang="ts">
	import { scrapes, expandedClass, activeTabIndex, deleteNotification } from './store';
	import StyleLayer from './StyleLayer.svelte';

	// contracts citation display when there are none
	$: if ($scrapes.length === 0) $expandedClass = '';

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
		$activeTabIndex = citationNumber;
	}

	function deleteCitation(event: Event, citationNumber: number) {
		event.stopPropagation();
		scrapes.update((scrapes) => {
			// reactivity - updates the store and then rerenders the {#each} blocks
			scrapes.splice(citationNumber, 1);
			return scrapes;
		});

		const allTabButtons: HTMLElement[] = Array.from(document.querySelectorAll('.content-tab'));

		// ensures that both the first and last active tabs' content does not have display: none when deleted
		if ($scrapes.length === 1) {
			const activeContent: HTMLElement = document.querySelector(`.section-0`)!;
			activeContent.classList.remove('display-none');
		} else if (citationNumber === $scrapes.length) {
			const activeContent: HTMLElement = document.querySelector(`.section-${$scrapes.length - 1}`)!;
			if (activeContent !== null) activeContent.classList.remove('display-none');
		}

		const deleteIcon = event.target as HTMLElement;

		// if non-active tab is deleted, active tab remains active even as it is shifted
		if (!deleteIcon.parentElement!.parentElement!.classList.contains('active-tab')) {
			// for below active tab:
			if (citationNumber < $activeTabIndex) {
				const recalculatedTabIndex = $activeTabIndex - 1;
				$activeTabIndex = recalculatedTabIndex;
				allTabButtons.map((button) => button.classList.remove('active-tab'));
				// ensures visible display
				const allTabContents: HTMLElement[] = Array.from(
					document.querySelectorAll('.section-wrap')
				);
				allTabContents.map((tab) => tab.classList.add('display-none'));
				const activeContent: HTMLElement = document.querySelector(
					`.section-${recalculatedTabIndex}`
				)!;
				activeContent.classList.remove('display-none');
				setTimeout(() => {
					document.querySelector(`.tab-${recalculatedTabIndex}`)!.classList.add('active-tab');
				}, 5);
			}
		}

		// if currently active tab is deleted, and it is the first one, the next active tab should be the second one. otherwise, the tab to its left becomes the active one.
		if (
			citationNumber === 0 &&
			deleteIcon.parentElement!.parentElement!.classList.contains('active-tab') &&
			$scrapes.length > 1
		) {
			allTabButtons.map((button) => button.classList.remove('active-tab'));
			setTimeout(() => {
				document.querySelector(`.tab-${citationNumber}`)!.classList.add('active-tab');
			}, 5);
		} else if (
			// tab being deleted is active and there is at least 1 tab present
			deleteIcon.parentElement!.parentElement!.classList.contains('active-tab') &&
			$scrapes.length >= 1
		) {
			if (citationNumber - 1 < 0 === false) {
				$activeTabIndex = $activeTabIndex - 1;
				const activeContent: HTMLElement = document.querySelector(`.section-${citationNumber}`)!;
				activeContent.classList.remove('display-none');
				allTabButtons.map((button) => button.classList.remove('active-tab'));
				setTimeout(() => {
					document.querySelector(`.tab-${citationNumber - 1}`)!.classList.add('active-tab');
				}, 5);
			}
		}
		$deleteNotification++;
	}
</script>

<div class="tab-container">
	{#each $scrapes as scrape, i}
		<button
			on:click={(event) => {
				navigateTabs(i, event);
			}}
			class={`content-tab tab-${i}`}
			>Citation {i}
			<button
				on:click={(event) => {
					deleteCitation(event, i);
				}}
				class="deleteTab"><i class="delete-icon fa-solid fa-circle-xmark" /></button
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
					<div class={`section-${i} section-wrap`}>
						{#key $deleteNotification}
							<StyleLayer citationObject={scrape} itemIndex={i} />
						{/key}
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

	button.deleteTab {
		background: transparent;
		border: transparent;
		cursor: pointer;
		&:focus-visible {
			outline-color: #fb6565;
			outline-style: solid;
			border-radius: 30px;
		}
	}

	.content-tab .deleteTab .delete-icon {
		// ensures delete button does not gain a background color when active tabs are styled
		background-color: transparent;
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
				--border-var: 0px;
				max-width: 800px;
				color: #000;
				background-color: #eeeded;
				box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
				border-radius: 10px;
				border-style: solid;
				border-width: var(--border-var);
				padding: 0.8em;
				margin-left: auto;
				margin-right: auto;
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
		bottom: -3.8px;
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

	@media (max-width: 740px) {
		.expanded {
			padding: 0.5em;
		}

		.block--edit {
			grid-template-columns: 1fr;
		}
	}
</style>
