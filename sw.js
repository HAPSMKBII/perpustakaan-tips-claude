// Tips Claude — service worker
// Tukar VERSI setiap kali index.html atau ikon dikemas kini. tips.json tidak memerlukannya (sentiasa diambil dari rangkaian dahulu).
const VERSI = 'tips-claude-v1-2026-11-21';
const FON = 'tips-claude-fon';
const WAJIB = ['./index.html', './tips.json'];
const PILIHAN = ['./', './manifest.webmanifest', './ikon-192.png', './ikon-512.png',
  './ikon-maskable-512.png', './apple-touch-icon.png', './favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI)
    .then(c => c.addAll(WAJIB).then(() => Promise.all(PILIHAN.map(f => c.add(f).catch(() => {})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSI && k !== FON).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// ---- Peti masuk (IndexedDB yang sama dengan halaman) ----
function bukaDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('tips-claude', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('peti', { keyPath: 'id' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function simpan(items) {
  const d = await bukaDB();
  await new Promise((res, rej) => {
    const tx = d.transaction('peti', 'readwrite');
    items.forEach(i => tx.objectStore('peti').put(i));
    tx.oncomplete = res; tx.onerror = () => rej(tx.error);
  });
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

async function terimaKongsi(req) {
  const asas = self.registration.scope;
  try {
    const f = await req.formData();
    const masa = new Date().toISOString();
    const teks = [f.get('title'), f.get('text'), f.get('url')]
      .map(x => (x || '').toString().trim()).filter(Boolean)
      .filter((x, i, a) => a.indexOf(x) === i).join('\n');
    const items = [];
    if (teks) items.push({ id: uid(), masa, jenis: 'teks', teks, dikongsi: true });
    for (const g of f.getAll('gambar')) {
      if (g && g.size) items.push({ id: uid(), masa, jenis: 'gambar', nama: g.name, blob: g, dikongsi: true });
    }
    if (items.length) await simpan(items);
    const cs = await self.clients.matchAll({ type: 'window' });
    cs.forEach(c => c.postMessage('peti-baru'));
    return Response.redirect(asas + '?dikongsi=' + items.length + '#peti', 303);
  } catch (err) {
    return Response.redirect(asas + '?ralat=1#peti', 303);
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  if (req.method === 'POST' && url.pathname.endsWith('/kongsi')) {
    e.respondWith(terimaKongsi(req));
    return;
  }
  if (req.method !== 'GET') return;

  // Fon Google: cache dahulu (supaya berfungsi luar talian selepas kali pertama)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FON).then(c => c.match(req).then(r => r || fetch(req).then(n => { c.put(req, n.clone()); return n; }))));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Halaman dan tips.json: rangkaian dahulu, cache jika luar talian
  if (req.mode === 'navigate' || url.pathname.endsWith('/tips.json')) {
    const kunci = req.mode === 'navigate' ? './index.html' : './tips.json';
    e.respondWith(fetch(req).then(r => {
      if (r.ok) { const k = r.clone(); caches.open(VERSI).then(c => c.put(kunci, k)); }
      return r;
    }).catch(() => caches.match(kunci)));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
