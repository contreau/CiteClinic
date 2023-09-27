<script lang="ts">
	import { onNavigate } from '$app/navigation';
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
		<a href={buttonRoute}><button class="user-guide"> {buttonText} </button></a>
		<a href="https://github.com/zenDev-2/ScholarFetch" target="#"
			><i class="fa-brands fa-github" /></a
		>
	</div>
</nav>
<slot />
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

	h1 {
		margin: 0;
		font-size: 2.2rem;
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

	@media (min-width: 900px) {
		button.user-guide {
			min-width: 119px;
		}
	}
</style>
