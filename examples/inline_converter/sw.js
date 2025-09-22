const CACHE = 'diamond-playground-v1';
const ASSETS = [
    './playground.html',
    './diamond.browser.js',
    './playground.app.js',
    './manifest.webmanifest',
    // CodeMirror core + ruby mode (JS + CSS) via jsDelivr - cache on first visit
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.css',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/lib/codemirror.min.js',
    'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/mode/ruby/ruby.min.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const req = e.request;
    // Network-first for CDN, cache-first for local
    if (req.url.startsWith('https://cdn.jsdelivr.net')) {
        e.respondWith(
            fetch(req).then((res) => {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(req, copy));
                return res;
            }).catch(() => caches.match(req))
        );
        return;
    }
    e.respondWith(
        caches.match(req).then((cached) => cached || fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
        }))
    );
});
