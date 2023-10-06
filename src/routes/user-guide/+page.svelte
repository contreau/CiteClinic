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

				<li><a href="">Editable Example</a></li>

				<li><a href="">Supported Sites</a></li>

				<li><a href="#submit-feedback">Submit Feedback</a></li>
			</ul>
		</aside>
		<section class="grid-item guide-content">
			<p>
				<em>CiteClinic</em> is a web application that allows users to easily
				<b> scrape citation information </b> from medical journal sites and
				<b> generate modifiable, styled UI citation components </b> for use on their sites.
			</p>
			👩‍💻<b>Intended Userbase:</b> Web developers/web content managers for research institutions or
			universities that frequently update publications for resident doctors or researchers.
			<p />
			<h3 id="how-it-works">How it Works</h3>
			<p>CiteClinic scrapes primarily from page metadata.</p>
			<h3>Supported Journal Sites</h3>
			<ul>
				<li>New England Journal of Medicine</li>
				<li>PubMed</li>
				<li>Nature</li>
				<li>The Lancet</li>
				<li>JAMA Network</li>
				<li>British Medical Journal</li>
			</ul>
			<h3>Citation Format</h3>
			<p>
				Because several of the supported journal sites are medical-focused, the citation format
				generated is in <a href="https://library.viu.ca/citing/vancouver" target="#"
					>Vancouver Style</a
				>. This may change if there is specific user demand for other citation formats.
			</p>
			<h3 id="submit-feedback">Feature Requests & Issues</h3>
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

	.guide-content {
		border-left: solid 1px #fff;
		padding-left: 2rem;

		p:first-of-type {
			margin-top: 0;
		}
	}
</style>
