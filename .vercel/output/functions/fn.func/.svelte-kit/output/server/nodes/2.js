

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.b40ee291.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/index.5edae3da.js","_app/immutable/chunks/index.9eacfd8f.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/index.97de24fa.js"];
export const stylesheets = ["_app/immutable/assets/2.068fb2e4.css"];
export const fonts = [];
