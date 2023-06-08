<script>
  // *
  // ** PubMed Info Fetcher **
  // *

  // some sample urls
  // https://pubmed.ncbi.nlm.nih.gov/36184560/
  // https://pubmed.ncbi.nlm.nih.gov/31379367/
  // https://pubmed.ncbi.nlm.nih.gov/35298278/

  // Server Calls and Data Handling
  const parser = new DOMParser();
  let input;

  const fetchPage = async function () {
    try {
      const submitURL = new Promise((resolve) => {
        resolve(input.value);
        input.value = "";
      });
      const url = await submitURL;
      const response = await fetch(
        `http://localhost:3000/scholar-fetch?url=${url}`
      );
      const text = await response.text();
      return parser.parseFromString(text, "text/html");
    } catch (err) {
      console.error("URL likely invalid.", err);
    }
  };

  const parseData = async function () {
    // ** called from button submission
    try {
      const dom = await fetchPage();
      const bylines = Array.from(dom.querySelectorAll(".full-name"));
      const nameset = new Set();
      let names = [];
      bylines.forEach((e) => {
        // @ts-ignore
        if (!nameset.has(e.innerText)) {
          // @ts-ignore
          names.push(e.innerText);
          // @ts-ignore
          nameset.add(e.innerText);
        }
      });
      console.log(names);
    } catch (err) {
      console.error(err);
    }
  };
</script>

<div class="input-wrap">
  <input bind:this={input} type="text" class="url-input" />
  <button
    on:click={() => {
      parseData();
      input.value = "";
    }}
    type="submit"
    class="submit">submit</button
  >
</div>

<style>
  .input-wrap {
    max-width: 300px;
    width: 100%;
    margin: 4em auto;
  }
</style>
