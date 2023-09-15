<script lang="ts">
	import FetchModule from '$lib/FetchModule.svelte';
	import JournalDisplay from '$lib/JournalDisplay.svelte';
	import ComponentFill from '$lib/ComponentFill.svelte';

	let manual: HTMLElement;
	let manualContent: HTMLDivElement;
	function toggleManual() {
		if (manual.style.minWidth <= '0vw') {
			manual.style.minWidth = '100vw';
			setTimeout(() => {
				manualContent.style.display = 'block';
			}, 750);
			manualContent.classList.add('fadeIn');
		} else if (manual.style.minWidth >= '100vw') {
			manual.style.minWidth = '0vw';
			manualContent.classList.remove('fadeIn');
			manualContent.style.display = 'none';
			// clean this up with a css class toggle perhaps
		}
	}
</script>

<nav>
	<div class="masthead">
		<h1>ScholarFetch</h1>
		<img src="/green-scroll.png" alt="Green Scroll" />
	</div>

	<div class="links">
		<button
			class="instructions-tab"
			on:click={() => {
				toggleManual();
			}}
		>
			User Manual
		</button>
		<a href="https://github.com/zenDev-2/ScholarFetch" target="#"
			><i class="fa-brands fa-github" /></a
		>
	</div>
</nav>
<main>
	<JournalDisplay />
	<FetchModule />
	<ComponentFill />
	<section bind:this={manual} class="user-manual">
		<div bind:this={manualContent} class="manual-content">
			<button
				on:click={() => {
					toggleManual();
				}}><i class="fa-solid fa-circle-xmark" /></button
			>
			<h2>Using ScholarFetch</h2>
		</div>
	</section>
</main>

<style lang="scss" global>
	:root {
		font-family: system-ui;
		line-height: 1.6;
		font-size: 1.125rem;
		color-scheme: light dark;
		color: rgba(255, 255, 255, 0.87);
		--bg-color: #001829d6;
		--green: #35fb9f;
	}

	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}

	html,
	body {
		margin: 0;
		padding: 0;
		scroll-behavior: smooth;
	}

	body {
		background-color: var(--bg-color);
		background-image: url('/green-scatter-bg.svg');
		min-height: 100vh;
		backdrop-filter: blur(0.4em);
		margin: 0 auto;
		padding: 0.5em 5em;
		position: relative;
		overflow-x: hidden;
	}

	img {
		display: block;
	}

	nav {
		width: 100%;
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		// padding: 0.5em 5em;
		background-color: var(--bg-color);
	}
	.masthead {
		// border: solid 1px #fff;
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			width: 100%;
			max-width: 35px;
		}
	}

	.links {
		display: flex;
		align-items: center;
		gap: 3rem;
		button {
			margin: 0;
			font-weight: 600;
			font-size: 1rem;
			transition: all 0.4s;
			border: transparent;
			border-radius: 10px;
			padding: 0.5em;
			background-color: #018849;
			color: #fff;
			&:hover {
				cursor: pointer;
				background-color: #004424;
			}
			&:focus {
				outline: transparent;
				background-color: #004424;
			}
		}
		a {
			color: #fff;
			.fa-github {
				font-size: 2.5rem;
				transition: 0.3s all;
				&:hover {
					color: #016b5e;
				}
			}
		}
	}

	// slide-in-out instruction manual
	.user-manual {
		position: absolute;
		background-color: #0000004d;
		backdrop-filter: blur(1rem);
		min-height: 100vh;
		min-width: 0vw;
		top: 0;
		right: 0;
		transition: min-width 0.7s ease-in-out;
		z-index: 3;

		button {
			font-size: 2rem;
			border: transparent;
			background: transparent;
			transition: all 0.4s;
			cursor: pointer;
			color: rgb(236, 65, 65);
			&:hover,
			&:focus {
				color: rgb(161, 62, 62);
			}
		}
	}

	.manual-content {
		opacity: 0;
		display: none;
		padding: 0.5em;
	}

	.fadeIn {
		animation: fadeIn 0.4s ease forwards;
	}

	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}

	main {
		padding-top: 0.5em;
	}

	h1 {
		margin: 0;
		font-size: 2.2rem;
	}
</style>
