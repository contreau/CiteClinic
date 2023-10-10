<script lang="ts">
	import { fly } from 'svelte/transition';
	let exampleInput: string = 'This text field will update as you type.';
</script>

<svelte:head>
	<title>User Guide • CiteClinic</title>
	<meta
		name="description"
		content="Learn how to best use CiteClinic and its important features in this user guide."
	/>
</svelte:head>

<div
	class="extra-padding-container"
	in:fly={{ x: 200, duration: 200, delay: 200 }}
	out:fly={{ x: 200, duration: 200 }}
>
	<h2>User Guide</h2>

	<div class="content-grid">
		<aside class="grid-item sidenav">
			<ul>
				<li><a href="#purpose">Purpose & Audience</a></li>

				<li><a href="#how-it-works">How it works</a></li>

				<li><a href="#example-edit">Editable Example</a></li>

				<li><a href="#supported-sites">Supported Sites</a></li>

				<li><a href="#submit-feedback">Submit Feedback</a></li>
			</ul>
		</aside>
		<article class="grid-item guide-content">
			<section>
				<h3 id="purpose">Purpose & Audience</h3>
				<p>
					<em>CiteClinic</em> allows you to easily
					<b> scrape citation information </b> from medical journal sites and
					<b> generate modifiable, optionally styled UI citation components </b> for use on your site
					or CMS of choice.
				</p>
				<p>
					This is a tool for web developers or site administrators who frequently update publication
					listings for resident doctors, researchers, professors, etc.
				</p>
			</section>

			<hr class="section-break-symbol" />

			<section>
				<h3 id="how-it-works">How it Works</h3>
				<p>
					CiteClinic scrapes citation fields primarily from the page metadata. Depending on the
					site, a few of the citation fields are gathered from live page elements, which is a
					slightly slower process.
				</p>

				<p>
					A ready-to-copy citation is then generated. You can copy its raw text, or choose between a
					few different CSS styles.
				</p>
				<p>
					Because of CiteClinic's focus on medical journals, it produces citations in <a
						href="https://library.viu.ca/citing/vancouver"
						target="#">Vancouver Style</a
					>. This may change if there is specific user demand for other citation formats.
				</p>
			</section>

			<hr class="section-break-symbol" />

			<section>
				<h3 id="example-edit">Editable Example</h3>
				<p>
					After your citation is generated, you can edit the individual fields that compose it. Not
					all generations are perfect - make your own edits for any incorrect or missing
					information.
				</p>
				<div class="example-edit">
					<p><b>Edit this field</b></p>
					<textarea spellcheck="false" bind:value={exampleInput} />
				</div>

				<p class="live-display-subtitle"><b>Live Display</b></p>
				<div class="example-display">
					<p>{exampleInput}</p>
				</div>

				<p class="null-warning">
					<i class="fa-solid fa-triangle-exclamation" /> Note: if a generated field reads 'null', it
					indicates that CiteClinic could not determine it from your provided URL.
				</p>
			</section>

			<hr class="section-break-symbol" />
			<section>
				<h3 id="supported-sites">Supported Journal Sites</h3>
				<ul>
					<li><a href="https://www.nejm.org" target="#">New England Journal of Medicine</a></li>
					<li><a href="https://pubmed.ncbi.nlm.nih.gov" target="#">PubMed</a></li>
					<li><a href="https://www.nature.com/" target="#">Nature</a></li>
					<li><a href="https://www.thelancet.com/" target="#">The Lancet</a></li>
					<li><a href="https://jamanetwork.com/" target="#">JAMA Network</a></li>
					<li><a href="https://www.bmj.com/" target="#">British Medical Journal</a></li>
				</ul>
			</section>

			<hr class="section-break-symbol" />

			<section>
				<h3 id="submit-feedback">Submit Feedback</h3>
				<p>
					Got a feature or specific support you'd like to see in CiteClinic? Encountered a bug or
					issue? Post it on the GitHub repository's <a
						href="https://github.com/zenDev-2/CiteClinic/issues"
						target="#">issues section</a
					>.
				</p>
			</section>
		</article>
	</div>
</div>

<style lang="scss">
	.extra-padding-container {
		padding: 0 7em;
		flex: 1 0 auto; // sticks footer to bottom
	}
	h2 {
		text-align: center;
	}

	h3 {
		text-decoration: underline;
	}

	.section-break-symbol {
		margin: 3rem auto;
		border: solid 1px #5e96fd;
		border-radius: 15px;
	}

	a {
		color: var(--blue);
		transition: 0.2s all;
		&:hover {
			color: #fff;
		}
	}

	.content-grid {
		display: grid;
		grid-template-columns: 250px minmax(10px, 1fr);
	}

	.sidenav {
		position: sticky;
		top: 4rem;
		align-self: start;
		ul {
			margin: 0;
			padding: 0;
			list-style-type: none;

			li + li {
				margin-top: 0.8em;
			}

			a {
				color: #fff;
				text-decoration: none;
				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.sidenav,
	.guide-content p {
		padding-top: 1em;
	}

	.guide-content {
		background-color: #01111d;
		border-left: solid 1px #fff;
		border-top-right-radius: 15px;
		border-bottom-right-radius: 15px;
		padding: 0 2em;
		box-shadow: #ffffffc4 1px 1px;
	}

	.guide-content > section:first-of-type h3 {
		margin-top: 0.8rem;
	}

	@media (max-width: 950px) {
		.extra-padding-container {
			padding: 0 2em;
		}

		.content-grid {
			grid-template-columns: 1fr;
		}

		.sidenav {
			position: static;
			ul {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-wrap: wrap;
				gap: 1.4rem;
				padding-bottom: 1.2em;

				li + li {
					margin-top: 0;
				}
			}
		}
	}

	textarea {
		background-color: #201f26;
		display: block;
		font-size: 0.9rem;
		width: 100%;
		margin-bottom: 0.5rem;
		resize: none;
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

	.example-display {
		background-color: #ffffff;
		color: #000;
		border-radius: 10px;
		border: solid 3px #8d8d8d;

		p {
			margin: 0;
			padding: 0.3em;
		}
	}

	.live-display-subtitle {
		margin-top: 0;
	}

	p.null-warning {
		background-color: rgb(252, 205, 17);
		color: #000;
		border-radius: 10px;
		margin: 0;
		margin-top: 1.5rem;
		padding: 0.4em;
	}
</style>
