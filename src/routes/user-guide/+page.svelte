<script lang="ts">
	import { fade } from 'svelte/transition';
	let exampleInput: string = "This text's display updates as you type.";
</script>

<svelte:head>
	<title>User Guide • CiteClinic</title>
	<meta
		name="description"
		content="Learn how to best use CiteClinic and its important features in this user guide."
	/>
	<meta name="title" content="User Guide • CiteClinic" />
	<meta property="og:title" content="User Guide • CiteClinic" />
	<meta property="og:url" content="https://citeclinic.app/user-guide" />
	<meta
		property="og:description"
		content="Learn how to best use CiteClinic and its important features in this user guide."
	/>
</svelte:head>

<div
	class="extra-padding-container"
	in:fade={{ duration: 200, delay: 200 }}
	out:fade={{ duration: 200 }}
>
	<h2>User Guide</h2>

	<div class="content-grid">
		<aside class="grid-item sidenav">
			<ul>
				<li><a href="#purpose">Purpose & Audience</a></li>

				<li><a href="#how-it-works">How it works</a></li>

				<li><a href="#example-edit">Editable Example</a></li>

				<li><a href="#submit-feedback">Submit Feedback</a></li>
			</ul>
		</aside>
		<article class="grid-item guide-content">
			<section>
				<h3 id="purpose">Purpose & Audience</h3>
				<p>
					<em>CiteClinic</em> allows you to easily
					<b> retrieve citation information </b> from any journal article with a valid Digital
					Object Identifier (DOI) and
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
					CiteClinic interfaces with the <a
						href="https://api.crossref.org/swagger-ui/index.html"
						target="#"
						aria-label="Crossref API">Crossref API</a
					>. Because of CiteClinic's focus on the medical community, it produces citations in
					<a href="https://library.viu.ca/citing/vancouver" target="#" aria-label="Vancouver Style"
						>Vancouver Style</a
					>. This may change if there is specific user demand for other citation formats.
				</p>

				<p><b>User Flow:</b></p>

				<ol>
					<li>
						Type or paste a valid DOI string into the input bar, then click the "CITE" button.
					</li>
					<li>
						A citation is generated and housed under its own tab on the page. Tabs can be navigated
						between and deleted.
					</li>
					<li>Edit the text fields to see live changes to your citation.</li>
					<li>Modify border thickness, border color, and box shadow styles.</li>
					<li>
						Copy the HTML and CSS of your styled citation, which are regenerated with each change.
					</li>
					<li>Copy just the raw text, if desired.</li>
					<li><b>You can have a maximum of 8 active citations on the page.</b></li>
				</ol>

				<div class="null-warning">
					<p>
						<b><u>IMPORTANT NOTES</u></b>
					</p>
					<ul>
						<li>
							This tool is designed for <b>journal articles</b> – valid DOI strings for non-journal articles
							may be rejected by CiteClinic's API configuration. An error message will flash upon submitting
							such a DOI.
						</li>
						<li>
							CiteClinic will alert you if there is a <b>null</b> value for a field, meaning that it
							is empty in the Crossref database.
							<b>Review and make any desired edits to your citations before exporting</b>.
						</li>
					</ul>
				</div>
			</section>

			<hr class="section-break-symbol" />

			<section>
				<h3 id="example-edit">Editable Example</h3>
				<p>
					After your citation is generated, you can edit the individual fields that compose it. Try
					editing the text in the field below to see changes in the live display.
				</p>
				<div class="example-edit">
					<p id="modifiable-field"><b>Edit this field</b></p>
					<textarea
						aria-labelledby="modifiable-field"
						spellcheck="false"
						bind:value={exampleInput}
					/>
				</div>

				<p class="live-display-subtitle"><b>Live Display</b></p>
				<div class="example-display">
					<p>{exampleInput}</p>
				</div>
			</section>

			<hr class="section-break-symbol" />

			<section>
				<h3 id="submit-feedback">Submit Feedback</h3>
				<p>
					Got a feature or specific support you'd like to see in CiteClinic? Encountered a bug or
					issue? Post it on the GitHub repository's <a
						href="https://github.com/contreau/CiteClinic/issues"
						target="#"
						aria-label="GitHub Repository Issues Section">issues section</a
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
		color: var(--span);
	}

	h3 {
		text-decoration: underline;
	}

	.section-break-symbol {
		margin: 3rem auto;
		border: solid 0.5px var(--accent);
		border-radius: 15px;
	}

	a {
		color: var(--blue);
		transition: 0.2s all;
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
				color: var(--text);
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
		background-color: var(--background);
		border-left: solid 0.5px var(--accent);
		border-right: solid 0.5px var(--accent);
		padding: 0 2em;
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

	@media (max-width: 620px) {
		.extra-padding-container {
			padding: 0 0em;
		}
	}

	textarea {
		background-color: var(--textarea);
		color: var(--text);
		display: block;
		font-size: 1rem;
		font-family: system-ui;
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
		}
	}

	.example-display {
		background-color: #ffffff;
		color: #000;
		border-radius: 10px;
		border: solid 3px var(--primary);

		p {
			margin: 0;
			padding: 0.3em;
		}
	}

	.live-display-subtitle {
		margin-top: 0;
	}

	.null-warning {
		background-color: rgb(151, 201, 255);
		background-color: var(--nullfields);
		color: #000;
		border-radius: 10px;
		margin: 0;
		margin-top: 1.5rem;
		padding: 0.6em 1em;

		p {
			padding: 0;
			padding-bottom: 0.3em;
			margin: 0;
			text-align: center;
		}

		ul {
			margin: 0;
			padding-left: 1em;
		}
	}
</style>
