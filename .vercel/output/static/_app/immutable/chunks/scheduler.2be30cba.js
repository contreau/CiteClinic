function x(){}const F=t=>t;function k(t,n){for(const e in n)t[e]=n[e];return t}function w(t){return t()}function M(){return Object.create(null)}function j(t){t.forEach(w)}function A(t){return typeof t=="function"}function P(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function S(t){return Object.keys(t).length===0}function E(t,...n){if(t==null){for(const o of n)o(void 0);return x}const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function U(t,n,e){t.$$.on_destroy.push(E(n,e))}function B(t,n,e,o){if(t){const r=b(t,n,e,o);return t[0](r)}}function b(t,n,e,o){return t[1]&&o?k(e.ctx.slice(),t[1](o(n))):e.ctx}function C(t,n,e,o){if(t[2]&&o){const r=t[2](o(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const l=[],f=Math.max(n.dirty.length,r.length);for(let u=0;u<f;u+=1)l[u]=n.dirty[u]|r[u];return l}return n.dirty|r}return n.dirty}function D(t,n,e,o,r,l){if(r){const f=b(n,e,o,l);t.p(f,r)}}function G(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let o=0;o<e;o++)n[o]=-1;return n}return-1}function H(t){return t??""}function I(t,n,e){return t.set(e),n}function J(t){const n=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return n?[parseFloat(n[1]),n[2]||"px"]:[t,"px"]}let a;function _(t){a=t}function y(){if(!a)throw new Error("Function called outside component initialization");return a}function K(t){y().$$.on_mount.push(t)}function L(t){y().$$.after_update.push(t)}const i=[],p=[];let c=[];const g=[],m=Promise.resolve();let h=!1;function O(){h||(h=!0,m.then(v))}function N(){return O(),m}function q(t){c.push(t)}const d=new Set;let s=0;function v(){if(s!==0)return;const t=a;do{try{for(;s<i.length;){const n=i[s];s++,_(n),z(n.$$)}}catch(n){throw i.length=0,s=0,n}for(_(null),i.length=0,s=0;p.length;)p.pop()();for(let n=0;n<c.length;n+=1){const e=c[n];d.has(e)||(d.add(e),e())}c.length=0}while(i.length);for(;g.length;)g.pop()();h=!1,d.clear(),_(t)}function z(t){if(t.fragment!==null){t.update(),j(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(q)}}function Q(t){const n=[],e=[];c.forEach(o=>t.indexOf(o)===-1?n.push(o):e.push(o)),e.forEach(o=>o()),c=n}export{O as A,L as a,p as b,B as c,C as d,U as e,H as f,G as g,q as h,I as i,F as j,J as k,A as l,M as m,x as n,K as o,v as p,S as q,j as r,P as s,N as t,D as u,Q as v,a as w,_ as x,w as y,i as z};
