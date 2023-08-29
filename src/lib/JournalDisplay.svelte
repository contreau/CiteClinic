<h2>Generate styled citations with just a url.</h2>
<div class="journal-showcase">
	<a href="https://www.nejm.org/" target="#">
		<div class="journal-item nejm">New England Journal of Medicine</div>
	</a>
	<a href="https://pubmed.ncbi.nlm.nih.gov/" target="#">
		<div class="journal-item pubmed">PubMed</div>
	</a>
	<a href="https://www.nature.com/" target="#">
		<div class="journal-item nature">Nature</div>
	</a>
	<a href="https://www.thelancet.com/" target="#">
		<div class="journal-item lancet">The Lancet</div>
	</a>
	<a href="https://jamanetwork.com/" target="#">
		<div class="journal-item jama">JAMA Network</div>
	</a>
	<a href="https://www.bmj.com/" target="#">
		<div class="journal-item bmj">British Medical Journal</div>
	</a>
</div>

<style lang="scss">
	h2 {
		margin-top: 0rem;
		text-align: center;
		font-size: 1.75rem;
	}

	a {
		text-decoration: none;
	}

	.journal-showcase {
		display: flex;
		align-items: center;
		justify-content: space-around;
		border-top: solid 2px #35fb9f;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		padding-top: 1em;

		.journal-item {
			font-weight: 600;
			color: #fff;
			padding: 0.3em 0.5em;
			// border: solid 1px #fff;
			border-radius: 10px;
			transition: filter 0.4s, transform 0.2s;
			&:hover,
			&:focus {
				filter: brightness(0.8);
				transform: scale(1.1);
			}
		}

		.nejm {
			background-color: #bb2f39;
		}
		.pubmed {
			background-color: #1872c0;
		}
		.nature {
			background-color: #212121;
		}
		.lancet {
			background-color: #088798;
		}
		.jama {
			background-color: #d21f72;
		}
		.bmj {
			background-color: #034796;
		}
	}
</style>
