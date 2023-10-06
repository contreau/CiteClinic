<script lang="ts"></script>

<svelte:head>
	<title>User Guide • CiteClinic</title>
	<meta
		name="description"
		content="Learn how to best use CiteClinic and its important features in this user guide."
	/>
</svelte:head>

<div class="extra-padding-container">
	<h2>Using CiteClinic</h2>

	<div class="content-grid">
		<aside class="grid-item sidenav">
			<ul>
				<li><a href="#how-it-works">How it works</a></li>

				<li><a href="#example-edit">Editable Example</a></li>

				<li><a href="#supported-sites">Supported Sites</a></li>

				<li><a href="#submit-feedback">Submit Feedback</a></li>
			</ul>
		</aside>
		<section class="grid-item guide-content">
			<p>
				<em>CiteClinic</em> is a web application that allows users to easily
				<b> scrape citation information </b> from medical journal sites and
				<b> generate modifiable, styled UI citation components </b> for use on their sites.
			</p>
			<b>Intended Userbase:</b> Web developers/web content managers for research institutions or
			universities that frequently update publications for resident doctors or researchers.
			<p />

			<h3 id="how-it-works">How it Works</h3>
			<p>
				In an effort to perform well, CiteClinic scrapes citation data primarily from the target
				page's metadata. Depending on the site, a few of the citation fields are gathered from live
				page elements.
			</p>

			<p>
				Because of this application's focus on medical journals, the produced citation format
				generated is <a href="https://library.viu.ca/citing/vancouver" target="#">Vancouver Style</a
				>. This may change if there is specific user demand for other citation formats.
			</p>

			<h3 id="example-edit">Editable Example</h3>
			<h3 id="supported-sites">Supported Journal Sites</h3>
			<ul>
				<li>New England Journal of Medicine</li>
				<li>PubMed</li>
				<li>Nature</li>
				<li>The Lancet</li>
				<li>JAMA Network</li>
				<li>British Medical Journal</li>
			</ul>

			<h3 id="submit-feedback">Submit Feedback</h3>
			<p>
				Got a feature or specific support you'd like to see in ScholarFetch? Encountered a bug or
				issue? Post it on the GitHub repository's <a
					href="https://github.com/zenDev-2/CiteClinic/issues"
					target="#">issues section</a
				>.
			</p>
		</section>
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

	p a {
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
		box-shadow: #ffffff8b 1px 1px;

		p:first-of-type {
			margin-top: 0;
		}
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
</style>
