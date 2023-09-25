<script lang="ts"></script>

<div class="extra-padding-container">
	<h2>Using ScholarFetch</h2>

	<p>
		<em>ScholarFetch</em> is an in-development web application that allows users to easily
		<b> scrape citation information </b> from research journal sites and
		<b> generate modifiable, styled UI citation components </b> for use on their sites.
	</p>
	👩‍💻<b>Intended Userbase:</b> Web developers/web content managers for research institutions or
	universities that frequently update publications for resident doctors or researchers.
	<p />
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
		generated is in <a href="https://library.viu.ca/citing/vancouver" target="#">Vancouver Style</a
		>. This may change if there is specific user demand for other citation formats.
	</p>
	<h3>Feature Requests & Issues</h3>
	<p>
		Got a feature or specific support you'd like to see in ScholarFetch? Encountered a bug or issue?
		Post it on the GitHub repository's <a
			href="https://github.com/zenDev-2/ScholarFetch/issues"
			target="#">issues section</a
		>.
	</p>
</div>

<style lang="scss">
	.extra-padding-container {
		padding: 0 7em;
		flex: 1 0 auto; // sticks footer to bottom
	}
	h2 {
		text-align: center;
	}
</style>
