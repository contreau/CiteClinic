<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		html = document.querySelector('html');
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
	let buttonText: string = 'User Guide';
	let buttonRoute: string = '/user-guide';
	$: {
		if ($page.route.id === '/user-guide') {
			buttonText = 'Home Page';
			buttonRoute = '/';
		} else {
			buttonText = 'User Guide';
			buttonRoute = '/user-guide';
		}
	}
	let html: HTMLHtmlElement | null;
	let themeIcon: string = 'fa-moon';

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
		<img class="logo" src="/logo.svg" alt="Blue Cross" />
	</div>
	<div class="tagline">
		<h1>Generate <span><em>styled</em></span> medical journal citations.</h1>
	</div>

	<button on:click={setTheme} class="theme-switch"> <i class={`fa-solid ${themeIcon}`} /></button>
	<div class="links">
		<a href={buttonRoute}><button class="user-guide"> {buttonText} </button></a>
		<a href="https://github.com/zenDev-2/CiteClinic" target="#"><i class="fa-brands fa-github" /></a
		>
	</div>
</nav>
<slot />
<footer>
	<img class="footer-img" src="/footer-img-min.png" alt="Wolf" />
	<p>made by CK</p>
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
		--blue: #387dfe;
		--overlay-top: 0;

		--text: #030a11;
		--background: #d8e8f8;
		--primary: #3c6e9f;
		--secondary: #a9ccef;
		--accent: #2066ac;
	}

	:root[data-theme='light'] {
		--text: #030a11;
		--background: #d8e8f8;
		--primary: #3c6e9f;
		--secondary: #a9ccef;
		--accent: #2066ac;
		--placeholder: #000000ca;
		--textarea: #fff;
	}
	:root[data-theme='dark'] {
		--text: #eef5fc;
		--background: #071727;
		--primary: #6091c3;
		--secondary: #103356;
		--accent: #3f7fbf;
		--placeholder: #ffffff87;
		--textarea: #201f26;
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
		background-color: var(--background);
		color: var(--text);
		// background-image: linear-gradient(to right bottom, #04365a, #042d4a, #04243b, #041b2d, #01121f);
		// background-image: url('/blue-scatter-bg.svg');
		min-height: 100vh;
		// -webkit-backdrop-filter: blur(0.4em) brightness(55%);
		// backdrop-filter: blur(0.4em) brightness(55%);
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
			color: var(--accent);
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
		// background-color: #032741;
		background-color: var(--background);
		box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
			rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
	}
	.masthead {
		display: flex;
		align-items: center;
		gap: 1rem;

		img {
			width: 100%;
			max-width: 35px;
		}
	}

	.tagline {
		h1 {
			font-size: clamp(1rem, 4vw, 1.6rem);
			margin: 0;
			span {
				color: var(--accent);
			}
		}
	}

	.theme-switch {
		margin: 0;
		min-height: 40px;
		width: 40px;
		font-weight: 600;
		font-size: 1rem;
		transition: all 0.4s;
		border: transparent;
		border-radius: 50%;
		padding: 0.5em;
		background-color: var(--accent);
		cursor: pointer;
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
			background-color: var(--accent);
			color: #fff;
			&:hover {
				cursor: pointer;
				background-color: var(--secondary);
			}
			&:focus {
				outline: transparent;
				background-color: var(--secondary);
			}
		}
		a {
			color: var(--accent);
			.fa-github {
				font-size: 2.5rem;
				transition: 0.2s all;
				&:hover {
					color: var(--secondary);
				}
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
		box-shadow: rgba(0, 0, 0, 0.4) 0px -2px 20px, rgba(0, 0, 0, 0.2) 0px 3px 0px inset;

		p {
			margin: 0;
			padding: 0.5em 0em;
			font-weight: 400;
		}

		img {
			max-width: 22.5px;
			height: auto;
		}
	}

	@media (min-width: 900px) {
		button.user-guide {
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
</style>
