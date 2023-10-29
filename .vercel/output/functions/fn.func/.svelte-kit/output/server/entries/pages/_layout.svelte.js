import { c as create_ssr_component, a as subscribe, b as add_attribute, e as escape } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate" || key === "on_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const onNavigate = /* @__PURE__ */ client_method("on_navigate");
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: ":root{font-family:system-ui;line-height:1.6;font-size:1.125rem;color-scheme:light dark;color:rgba(255, 255, 255, 0.87);--green:#35fb9f;--blue:#387dfe;--overlay-top:0}:root[data-theme=light]{--text:#030a11;--background:#d8e8f8;--primary:#3c6e9f;--secondary:#a9ccef;--accent:#2066ac;--placeholder:#00000079;--textarea:#fff}:root[data-theme=dark]{--text:#eef5fc;--background:#071727;--primary:#6091c3;--secondary:#103356;--accent:#3f7fbf;--placeholder:#ffffff87;--textarea:#201f26}*,*::after,*::before{box-sizing:border-box}html,body{margin:0;padding:0;scroll-behavior:smooth}.padding-container{padding:0.5em 5em}body{background-color:var(--background);color:var(--text);min-height:100vh;margin:0 auto;position:relative;display:flex;flex-direction:column}p.logotext{margin:0;font-size:2rem;font-weight:600}p.logotext span{color:var(--accent)}img{display:block}.logo{min-width:45px;height:auto}nav{display:flex;align-items:center;justify-content:space-between;width:100%;background-color:var(--background);box-shadow:rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset}.masthead{display:flex;align-items:center;gap:1rem}.masthead img{width:100%;max-width:35px}.tagline h1{font-size:clamp(1rem, 4vw, 1.6rem);margin:0}.tagline h1 span{color:var(--accent)}.theme-switch{margin:0;min-height:42px;width:42px;font-weight:600;font-size:1rem;transition:all 0.4s;border:solid 1px transparent;border-radius:50%;padding:0.5em;background-color:var(--accent);cursor:pointer}.theme-switch:focus-visible{outline:transparent;background-color:var(--secondary)}.links{display:flex;align-items:center;gap:3rem}.links button{margin:0;font-weight:600;font-size:1rem;transition:all 0.4s;border:transparent;border-radius:10px;padding:0.5em;background-color:var(--accent);color:#fff}.links button:hover{cursor:pointer;background-color:var(--secondary)}.links button:focus-visible{outline:transparent;background-color:var(--secondary)}.links a{color:var(--accent)}.links a .fa-github{font-size:2.5rem;transition:0.2s all}.links a .fa-github:hover{color:var(--secondary)}footer{display:flex;align-items:center;justify-content:center;gap:0.5rem;text-align:center;flex-shrink:0;background-color:var(--background);box-shadow:rgba(0, 0, 0, 0.4) 0px -2px 20px, rgba(0, 0, 0, 0.2) 0px 3px 0px inset}footer p{margin:0;padding:0.5em 0em;font-weight:400}footer img{max-width:22.5px;height:auto}@media(min-width: 900px){button.user-guide{min-width:119px}}@media(max-width: 1200px){nav{flex-direction:column;gap:1rem}nav.padding-container{padding:0.5em 1em}.tagline{text-align:center}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  onNavigate((navigation) => {
    if (!document.startViewTransition)
      return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
  let buttonText = "User Guide";
  let buttonRoute = "/user-guide";
  let themeIcon = "fa-moon";
  $$result.css.add(css);
  {
    {
      if ($page.route.id === "/user-guide") {
        buttonText = "Home Page";
        buttonRoute = "/";
      } else {
        buttonText = "User Guide";
        buttonRoute = "/user-guide";
      }
    }
  }
  $$unsubscribe_page();
  return `<nav class="padding-container"><div class="masthead" data-svelte-h="svelte-15iq6u8"><p class="logotext"><span>Cite</span>Clinic</p> <img class="logo" src="/logo.svg" alt="Blue Cross"></div> <div class="tagline" data-svelte-h="svelte-17pzr7f"><h1>Generate <span><em>styled</em></span> medical journal citations.</h1></div> <button class="theme-switch"><i${add_attribute("class", `fa-solid ${themeIcon}`, 0)}></i></button> <div class="links"><a${add_attribute("href", buttonRoute, 0)}><button class="user-guide">${escape(buttonText)}</button></a> <a href="https://github.com/zenDev-2/CiteClinic" target="#" data-svelte-h="svelte-1r3pasw"><i class="fa-brands fa-github"></i></a></div></nav> ${slots.default ? slots.default({}) : ``} <footer data-svelte-h="svelte-p4rkj0"><img class="footer-img" src="/footer-img-min.png" alt="Wolf"> <p>made by CK</p> </footer>`;
});
export {
  Layout as default
};
