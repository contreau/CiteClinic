export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","android-chrome-192x192.png","android-chrome-512x512.png","apple-touch-icon.png","favicon-16x16.png","favicon-32x32.png","favicon.ico","footer-img-min.png","logo.svg","og-img-min.jpg","site.webmanifest"]),
	mimeTypes: {".png":"image/png",".ico":"image/vnd.microsoft.icon",".svg":"image/svg+xml",".jpg":"image/jpeg",".webmanifest":"application/manifest+json"},
	_: {
		client: {"start":"_app/immutable/entry/start.bd3ff06c.js","app":"_app/immutable/entry/app.1722453b.js","imports":["_app/immutable/entry/start.bd3ff06c.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/singletons.fd8f3351.js","_app/immutable/chunks/index.9eacfd8f.js","_app/immutable/entry/app.1722453b.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/scheduler.2be30cba.js","_app/immutable/chunks/index.5edae3da.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/bmj",
				pattern: /^\/api\/bmj\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/bmj/_server.ts.js'))
			},
			{
				id: "/api/jama",
				pattern: /^\/api\/jama\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/jama/_server.ts.js'))
			},
			{
				id: "/api/lancet",
				pattern: /^\/api\/lancet\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/lancet/_server.ts.js'))
			},
			{
				id: "/api/nature",
				pattern: /^\/api\/nature\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/nature/_server.ts.js'))
			},
			{
				id: "/api/nejm",
				pattern: /^\/api\/nejm\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/nejm/_server.ts.js'))
			},
			{
				id: "/api/pubmed",
				pattern: /^\/api\/pubmed\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/pubmed/_server.ts.js'))
			},
			{
				id: "/user-guide",
				pattern: /^\/user-guide\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
