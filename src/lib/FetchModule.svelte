<script>
  import {
    parseData_NEJM,
    parseData,
    parseData_AMJM,
    parseData_LANCET,
    parseData_JAMA,
    parseData_BMJ,
  } from "./fetchFunctions";

  import {
    pubmedPARAMS,
    naturePARAMS,
    nejmPARAMS,
    lancetPARAMS,
    jamaPARAMS,
    bmjPARAMS,
  } from "./parameters";

  // *
  // ** Fetch Module **
  // *

  // sample PubMed urls
  // https://pubmed.ncbi.nlm.nih.gov/36184560/
  // https://pubmed.ncbi.nlm.nih.gov/31379367/
  // https://pubmed.ncbi.nlm.nih.gov/35298278/

  // sample Nature urls
  // https://www.nature.com/articles/s41591-023-02392-7
  // https://www.nature.com/articles/s41598-023-32742-x

  // sample AMJM urls
  // https://www.amjmed.com/article/S0002-9343(23)00345-5/fulltext
  // https://www.amjmed.com/article/S0002-9343(00)00308-9/fulltext

  // sample NEJM urls
  // https://www.nejm.org/doi/full/10.1056/NEJMoa2101195
  // https://www.nejm.org/doi/full/10.1056/NEJMoa0708638

  // sample Lancet urls
  // https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00191-2/fulltext

  // sample JAMA urls
  // https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2795976?resultClick=1

  let input;
  let sourceSelect = "";

  // submit button event function
  const launchFetch = (input) => {
    switch (sourceSelect) {
      case "PubMed":
        parseData(input, pubmedPARAMS);
        input.value = "";
        input.focus();
        break;
      case "Nature":
        parseData(input, naturePARAMS);
        input.value = "";
        input.focus();
        break;
      case "AMJM":
        parseData_AMJM(input);
        input.value = "";
        input.focus();
        break;
      case "NEJM":
        parseData_NEJM(input, nejmPARAMS);
        input.value = "";
        input.focus();
        break;
      case "Lancet":
        parseData_LANCET(input, lancetPARAMS);
        input.value = "";
        input.focus();
        break;
      case "JAMA":
        parseData_JAMA(input, jamaPARAMS);
        input.value = "";
        input.focus();
        break;
      case "BMJ":
        parseData_BMJ(input, bmjPARAMS);
        input.value = "";
        input.focus();
        break;
    }
  };
</script>

<div class="input-wrap">
  <p>
    Source: {sourceSelect}
  </p>
  <input bind:this={input} type="text" class="url-input" />

  <select bind:value={sourceSelect} name="source" id="source-select">
    <option value="">Select</option>
    <option value="PubMed">PubMed</option>
    <option value="Nature">Nature</option>
    <option value="AMJM">AMJM</option>
    <option value="NEJM">NEJM</option>
    <option value="Lancet">The Lancet</option>
    <option value="JAMA">JAMA Network</option>
    <option value="BMJ">British Medical Journal</option>
  </select>

  <button
    on:click={() => {
      launchFetch(input);
    }}
    type="submit"
    class="submit">Submit</button
  >
</div>

<style>
  .input-wrap {
    max-width: 400px;
    width: 100%;
    margin: 0 auto;
  }

  p {
    margin: 0;
  }
</style>
