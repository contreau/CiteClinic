<script>
  import FetchModule from "./lib/FetchModule.svelte";
  import JournalDisplay from "./lib/JournalDisplay.svelte";
</script>

<nav>
  <div class="masthead">
    <h1>ScholarFetch</h1>
    <img src="/green-scroll.png" alt="Green Scroll" />
  </div>
  <div class="links">
    <a href="https://github.com/zenDev-2/ScholarFetch" target="#"
      ><i class="fa-brands fa-github" /></a
    >
  </div>
</nav>
<main>
  <JournalDisplay />
  <FetchModule />
</main>

<style lang="scss">
  nav {
    width: 100%;
    position: sticky;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5em 5em;
    background-color: var(--bg-color);
  }
  .masthead {
    // border: solid 1px #fff;
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      width: 100%;
      max-width: 35px;
    }
  }

  .links {
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
  main {
    padding: 0.5em 5em 0 5em;
  }

  h1 {
    margin: 0;
    font-size: 2.2rem;
  }
</style>
