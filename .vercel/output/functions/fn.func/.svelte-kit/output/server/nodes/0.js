

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.10b814e2.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/index.5edae3da.js","_app/immutable/chunks/singletons.fd8f3351.js","_app/immutable/chunks/index.9eacfd8f.js","_app/immutable/chunks/stores.a9409df6.js"];
export const stylesheets = ["_app/immutable/assets/0.07079263.css"];
export const fonts = [];
