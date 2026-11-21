// Strings & Statues: tallentaa pelin puhelimeen, jotta se toimii myös ilman nettiä.
// Nettiyhteyden ollessa päällä haetaan aina uusin versio, muuten käytetään tallennettua.
const CACHE = "strings-statues-v4";
const FILES = [
  "/sticks-statues.html",
  "/strings-statues.webmanifest",
  "/strings-statues-192.png",
  "/strings-statues-512.png",
  "/kuvat/strings-statues-bandi.jpg",
  "/kuvat/bandi/kuningas.png",
  "/kuvat/bandi/patsas-p.png",
  "/kuvat/bandi/patsas-e.png",
  "/musiikki/hopeful-road-trip.mp3",
  "/musiikki/latino-tribal.mp3",
  "/kuvat/bandi/sword-p.png",
  "/kuvat/bandi/sword-e.png",
  "/kuvat/bandi/sword-ikoni.png",
  "/kuvat/bandi/archer-p.png",
  "/kuvat/bandi/archer-e.png",
  "/kuvat/bandi/archer-ikoni.png",
  "/kuvat/bandi/spear-p.png",
  "/kuvat/bandi/spear-e.png",
  "/kuvat/bandi/spear-ikoni.png",
  "/kuvat/bandi/giant-p.png",
  "/kuvat/bandi/giant-e.png",
  "/kuvat/bandi/giant-ikoni.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("strings-statues-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || !FILES.includes(url.pathname)) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
