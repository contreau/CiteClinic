

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.d05b5e90.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/index.5edae3da.js","_app/immutable/chunks/stores.a9409df6.js","_app/immutable/chunks/singletons.fd8f3351.js","_app/immutable/chunks/index.9eacfd8f.js"];
export const stylesheets = [];
export const fonts = [];
