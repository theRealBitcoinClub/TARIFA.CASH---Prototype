var workbox=function(){"use strict";try{self.workbox.v["workbox:sw:3.6.1"]=1}catch(t){}const t="https://storage.googleapis.com/workbox-cdn/releases/3.6.1",e={backgroundSync:"background-sync",broadcastUpdate:"broadcast-cache-update",cacheableResponse:"cacheable-response",core:"core",expiration:"cache-expiration",googleAnalytics:"google-analytics",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams"};return new class{constructor(){return this.v={},this.t={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.e=this.t.debug?"dev":"prod",this.s=!1,new Proxy(this,{get(t,s){if(t[s])return t[s];const o=e[s];return o&&t.loadModule(`workbox-${o}`),t[s]}})}setConfig(t={}){if(this.s)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.t,t),this.e=this.t.debug?"dev":"prod"}skipWaiting(){self.addEventListener("install",()=>self.skipWaiting())}clientsClaim(){self.addEventListener("activate",()=>self.clients.claim())}loadModule(t){const e=this.o(t);try{importScripts(e),this.s=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}o(e){if(this.t.modulePathCb)return this.t.modulePathCb(e,this.t.debug);let s=[t];const o=`${e}.${this.e}.js`,r=this.t.modulePathPrefix;return r&&""===(s=r.split("/"))[s.length-1]&&s.splice(s.length-1,1),s.push(o),s.join("/")}}}();

//# sourceMappingURL=workbox-sw.js.map

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 100,
        // Cache for a maximum of a month
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ],
  })
);

workbox.precaching.precacheAndRoute([
    /* { url: '/static/css/app.c74d77475e5133728fe31c96a9f55b1c.css', revision: '383678' },
    { url: '/static/css/app.c74d77475e5133728fe31c96a9f55b1c.css.map', revision: '383678' },
    { url: '/static/js/app.0e61caafb560892622e4.js', revision: '383678' },
    { url: '/static/js/app.0e61caafb560892622e4.js.map', revision: '383678' },
    { url: '/static/js/vendor.e72f404bf5172d91f0e5.js', revision: '383678' },
    { url: '/static/js/vendor.e72f404bf5172d91f0e5.js.map', revision: '383678' }, */
    { url: '/static/qrcode.min.js', revision: '383678' },
    { url: '/static/noty.css', revision: '383678' },
    { url: '/static/loading.svg', revision: '383678' },
    { url: '/static/firebaseui.css', revision: '383680' }
    /* { url: '/index.html', revision: '383680' } */
]);
