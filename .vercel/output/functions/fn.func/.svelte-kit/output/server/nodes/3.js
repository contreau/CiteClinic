

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/user-guide/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.78d72e57.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/index.5edae3da.js","_app/immutable/chunks/index.97de24fa.js"];
export const stylesheets = ["_app/immutable/assets/3.93a49318.css"];
export const fonts = [];
