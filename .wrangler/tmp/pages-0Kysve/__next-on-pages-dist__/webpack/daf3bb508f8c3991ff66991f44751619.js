var g={},S=(R,O,M)=>(g.__chunk_6834=(d,h,i)=>{"use strict";var p=Object.create,s=Object.defineProperty,l=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,f=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty,m=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of c(t))w.call(e,r)||r===n||s(e,r,{get:()=>t[r],enumerable:!(o=l(t,r))||o.enumerable});return e},q=((e,t)=>function(){return t||(0,e[c(e)[0]])((t={exports:{}}).exports,t),t.exports})({"../../node_modules/dedent-tabs/dist/dedent-tabs.js"(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(t){for(var n=typeof t=="string"?[t]:t.raw,o="",r=0;r<n.length;r++)if(o+=n[r].replace(/\\\n[ \t]*/g,"").replace(/\\`/g,"`").replace(/\\\$/g,"$").replace(/\\\{/g,"{"),r<(1>=arguments.length?0:arguments.length-1)){var P=o.substring(o.lastIndexOf(`
`)+1).match(/^(\s*)\S?/);o+=((1>r+1||arguments.length<=r+1?void 0:arguments[r+1])+"").replace(/\n/g,`
`+P[1])}var b=o.split(`
`),a=null;if(b.forEach(function(u){var D=Math.min,y=u.match(/^(\s+)\S+/);if(y){var j=y[1].length;a=a?D(a,j):j}}),a!==null){var k=a;o=b.map(function(u){return u[0]===" "||u[0]==="	"?u.slice(k):u}).join(`
`)}return o.trim().replace(/\\n/g,`
`)}}}),_={};((e,t)=>{for(var n in t)s(e,n,{get:t[n],enumerable:!0})})(_,{getOptionalRequestContext:()=>x,getRequestContext:()=>E}),d.exports=m(s({},"__esModule",{value:!0}),_),i(3010);var v=((e,t,n)=>(n=e!=null?p(f(e)):{},m(!t&&e&&e.__esModule?n:s(n,"default",{value:e,enumerable:!0}),e)))(q()),C=Symbol.for("__cloudflare-request-context__");function x(){let e=O[C];if((process?.release?.name==="node"?"nodejs":"edge")=="nodejs")throw Error(v.default`
			\`getRequestContext\` and \`getOptionalRequestContext\` can only be run
			inside the edge runtime, so please make sure to have included
			\`export const runtime = 'edge'\` in all the routes using such functions
			(regardless of whether they are used directly or indirectly through imports).
		`);return e}function E(){let e=x();if(!e)throw process?.env?.NEXT_PHASE==="phase-production-build"?Error(v.default`
				\n\`getRequestContext\` is being called at the top level of a route file, this is not supported
				for more details see https://developers.cloudflare.com/pages/framework-guides/nextjs/ssr/troubleshooting/#top-level-getrequestcontext \n
			`):Error("Failed to retrieve the Cloudflare request context.");return e}},g.__chunk_5721=(d,h,i)=>{"use strict";i.d(h,{x:()=>s});var p=i(6834);function s(){try{let l=(0,p.getRequestContext)(),c=l?.env,f=c?.DB;if(!f)throw Error("D1 Database 'DB' is not bound. Please check your Cloudflare Pages settings / wrangler.toml");return f}catch(l){throw console.error("\u274C Critical: getDB() failed:",l),l}}},g.__chunk_3010=()=>{},g);export{S as __getNamedExports};
