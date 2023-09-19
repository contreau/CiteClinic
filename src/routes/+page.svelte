<script lang="ts">
	import FetchModule from '$lib/FetchModule.svelte';
	import ComponentFill from '$lib/ComponentFill.svelte';
	import ManualContent from '$lib/ManualContent.svelte';
	import { onMount } from 'svelte';

	let manual: HTMLElement;
	let manualContent: HTMLDivElement;
	function toggleManual() {
		if (manual.style.minWidth <= '0vw') {
			manual.style.minWidth = '100vw';
			setTimeout(() => {
				manualContent.style.display = 'block';
			}, 750);
			manualContent.classList.add('fadeIn');
			// disables main page scrolling while overlay is active
			document.body.style.overflow = 'hidden';
		} else if (manual.style.minWidth >= '100vw') {
			manual.style.minWidth = '0vw';
			manualContent.classList.remove('fadeIn');
			manualContent.style.display = 'none';
			// re-enables main page scrolling when overlay is dismissed
			document.body.style.overflow = 'auto';
		}
	}

	// client side code
	onMount(() => {
		const root: any = document.querySelector(':root');
		window.addEventListener('scroll', () => {
			// recalculates the 'top' position value of the user manual overlay on scroll
			root?.style.setProperty('--overlay-top', `${window.scrollY}px`);
		});
	});
</script>

<nav class="padding-container">
	<div class="masthead">
		<h1>ScholarFetch</h1>
		<img src="/green-scroll.png" alt="Green Scroll" />
	</div>
	<div class="tagline">
		<h2>Generate <span><em>styled</em></span> citations with a url.</h2>
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
	<p class="pagetop-icon"><i class="fa-solid fa-book-open-reader" /></p>
	<FetchModule />
	<ComponentFill />
</main>
<section bind:this={manual} class="user-manual">
	<div bind:this={manualContent} class="manual-content">
		<button
			on:click={() => {
				toggleManual();
			}}><i class="fa-solid fa-circle-xmark" /></button
		>
		<ManualContent />
	</div>
</section>

<footer>
	<p><i class="fa-solid fa-laptop-code" /> made by CK</p>
</footer>

<style lang="scss" global>
	:root {
		font-family: system-ui;
		line-height: 1.6;
		font-size: 1.125rem;
		color-scheme: light dark;
		color: rgba(255, 255, 255, 0.87);
		--bg-color: #000e18;
		--green: #35fb9f;
		--overlay-top: 0;
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

	.padding-container {
		padding: 0.5em 5em;
	}

	body {
		background-color: var(--bg-color);
		background-image: url('/green-scatter-bg.svg');
		min-height: 100vh;
		-webkit-backdrop-filter: blur(0.4em) brightness(55%);
		backdrop-filter: blur(0.4em) brightness(55%);
		margin: 0 auto;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	img {
		display: block;
	}

	nav {
		position: sticky;
		top: 0;
		z-index: 4;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: #000e18;
		border-bottom: solid 0.5px #232323;
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

	.tagline {
		h2 {
			margin: 0;
			span {
				color: var(--green);
			}
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
		background-color: #000e18e9;
		min-height: 100vh;
		min-width: 0vw;
		top: var(--overlay-top);
		right: 0;
		transition: min-width 0.7s ease-in-out;
		z-index: 5;
		overflow: auto;
		overflow: scroll;

		button {
			font-size: 2rem;
			border: transparent;
			background: transparent;
			transition: all 0.4s;
			padding: 0;
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
		overflow: auto;
		overflow: scroll;
	}

	.fadeIn {
		animation: fadeIn 0.4s ease forwards;
	}

	@keyframes fadeIn {
		100% {
			opacity: 1;
		}
	}

	.pagetop-icon {
		text-align: center;
		i {
			font-size: 2rem;
			color: var(--green);
			filter: drop-shadow(0 0 0.3em var(--green));
			margin: 0 auto;
		}
	}

	main {
		padding-top: 0.5em;
		flex: 1 0 auto; // sticks footer to bottom
	}

	h1 {
		margin: 0;
		font-size: 2.2rem;
	}

	footer {
		text-align: center;
		flex-shrink: 0; // sticks footer to bottom (see rule on main element)
		background-color: #000e18;
		border-top: solid 0.5px #232323;
		p {
			margin: 0 auto;
			padding: 0.5em 0em;
			font-weight: 400;
		}
	}
</style>
