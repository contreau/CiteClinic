<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	onMount(() => {
		html = document.querySelector('html');
		year = new Date().getFullYear();
	});

	// View Transition between pages (only works in Chrome rn)
	onNavigate((navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	import { page } from '$app/stores';
	let pageText: string = 'User Guide';
	let pageRoute: string = '/user-guide';
	$: {
		if ($page.route.id === '/user-guide') {
			pageText = 'Citations';
			pageRoute = '/';
		} else {
			pageText = 'User Guide';
			pageRoute = '/user-guide';
		}
	}
	let html: HTMLHtmlElement | null;
	let themeIcon: string = 'fa-sun';
	let year: number = 2023;

	function setTheme() {
		if (html?.dataset.theme === 'dark') {
			html?.setAttribute('data-theme', 'light');
			themeIcon = 'fa-moon';
		} else {
			html?.setAttribute('data-theme', 'dark');
			themeIcon = 'fa-sun';
		}
	}
</script>

<nav class="padding-container">
	<div class="masthead">
		<p class="logotext"><span>Cite</span>Clinic</p>
		<img class="logo" height="45" width="45" src="/logo.svg" alt="Blue Cross" />
	</div>
	<div class="tagline">
		<h1>Generate <span><em>styled</em></span> medical journal citations.</h1>
	</div>

	<div class="links">
		<button on:click={setTheme} type="button" class="theme-switch" aria-label="Color Theme Toggle">
			<i class={`fa-solid ${themeIcon}`} /></button
		>
		<a href={pageRoute} class="user-guide" aria-label={pageText}> {pageText} </a>
	</div>
</nav>
<slot />
<footer>
	<img class="footer-img" width="22.5" height="22.5" src="/footer-img-min.png" alt="Wolf" />
	<p>
		<a href="https://conorkelley.me" target="#" aria-label="Made by CK">Made by CK</a>
		• &copy; {year}
	</p>
</footer>

<style lang="scss" global>
	:root {
		font-family: system-ui;
		line-height: 1.6;
		font-size: 1.125rem;
		color-scheme: light dark;
		color: rgba(255, 255, 255, 0.87);
		--green: #35fb9f;
		--blue: #387dfe;
		--overlay-top: 0;
	}

	:root[data-theme='light'] {
		--text: #030a11;
		--background: #d8e8f8;
		--primary: #3c6e9f;
		--secondary: #a9ccef;
		--accent: #2066ac;
		--span: #085bad;
		--placeholder: #00000079;
		--textarea: #fff;
		--nullfields: #fccd11;
	}
	:root[data-theme='dark'] {
		--text: #eef5fc;
		--background: #071727;
		--primary: #6091c3;
		--secondary: #103356;
		--accent: #085bad;
		--span: #3c98f4;
		--placeholder: #ffffff87;
		--textarea: #201f26;
		--nullfields: #fccd11;
	}

	*,
	*::after,
	*::before {
		box-sizing: border-box;
	}

	html {
		width: 100vw;
		overflow-x: hidden;
	}

	html,
	body {
		margin: 0;
		padding: 0;
		scroll-behavior: smooth;
	}

	.padding-container {
		padding: 0.5em 3.5em;
	}

	body {
		background-color: var(--background);
		color: var(--text);
		min-height: 100vh;
		margin: 0 auto;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	p.logotext {
		margin: 0;
		font-size: 2rem;
		font-weight: 600;
		span {
			color: var(--span);
		}
	}

	img {
		display: block;
	}

	.logo {
		min-width: 45px;
		height: auto;
	}

	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		background-color: var(--background);
		box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
			rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
	}
	.masthead {
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			max-width: 100%;
			height: auto;
		}
	}

	.tagline {
		h1 {
			font-size: clamp(1rem, 4vw, 1.6rem);
			margin: 0;
			span {
				color: var(--span);
			}
		}
	}

	.links {
		display: flex;
		align-items: center;
		gap: 1.8rem;

		a.user-guide {
			margin: 0;
			min-width: 119px;
			text-align: center;
			text-decoration: none;
			font-weight: 600;
			font-size: 1rem;
			transition: all 0.4s;
			border: transparent;
			border-radius: 10px;
			padding: 0.35em;
			background-color: var(--accent);
			color: #fff;
			&:hover {
				cursor: pointer;
				background-color: var(--secondary);
			}
			&:focus-visible {
				outline: transparent;
				background-color: var(--secondary);
			}
		}

		button.theme-switch {
			margin: 0;
			min-height: 42px;
			min-width: 42px;
			color: #fff;
			font-weight: 600;
			font-size: 1rem;
			transition: all 0.4s;
			border: solid 1px transparent;
			border-radius: 50%;
			padding: 0.5em;
			background-color: var(--accent);
			cursor: pointer;
			&:hover {
				cursor: pointer;
				background-color: var(--secondary);
			}
			&:focus-visible {
				outline: transparent;
				background-color: var(--secondary);
			}
		}
	}

	footer {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		text-align: center;
		flex-shrink: 0; // sticks footer to bottom (see rule on main element)
		background-color: var(--background);
		border-top: solid 0.5px var(--accent);

		p {
			margin: 0;
			padding: 0.5em 0em;
			font-weight: 400;
		}

		img {
			max-width: 100%;
			height: auto;
		}

		a {
			color: var(--blue);
		}
	}

	@media (min-width: 900px) {
		a.user-guide {
			min-width: 119px;
		}
	}

	@media (max-width: 1200px) {
		nav {
			flex-direction: column;
			gap: 1rem;

			&.padding-container {
				padding: 0.5em 1em;
			}
		}

		.tagline {
			text-align: center;
		}
	}

	@media (max-width: 500px) {
		.links {
			flex-wrap: wrap;
			gap: 0.8rem;
		}
	}
</style>
