/* Service Worker per a DAWPJ8 - substitueix AppCache
   Crea una cache amb recursos essencials i serveix en mode cache-first.
    * @version 1.0
 * date 21.01.2026
 * @author sergi.grau@fje.edu
*/

// Nom de la cache actual (incrementar per forçar recache)
const NOM_CACHE = 'daw2-cache-v1';

// Recursos bàsics que es pre-cachen a l'instal·lació
const RECURSOS_PRECACHE = [
  '/',
  '/M09_AppCache.html',
  '/M01_semantic.html',
  '/M03_audio.html',
  '/M05_geolocalitzacio.html',
  '/M15_file_api.html',
  '/css/estils.css'
];

/**
 * Install event
 * Pre-cacheja els recursos definits a `ASSETS_TO_CACHE`.
 * Crida `skipWaiting()` per passar a l'estat `activated` més ràpidament.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(NOM_CACHE).then(cache => cache.addAll(RECURSOS_PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event
 * Elimina versions antigues de la cache (mantenint només `CACHE_NAME`)
 * i pren control immediat dels clients amb `clients.claim()`.
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== NOM_CACHE).map(k => caches.delete(k))
    ))
    .then(() => self.clients.claim())
  );
});

/**
 * Fetch event
 * Estratègia: cache-first. Retorna la resposta de la cache si existeix,
 * altrament fa fetch i, si és exitós i és del mateix origen, l'emmagatzema
 * a la cache per ús futur. En cas d'error (offline), retorna la pàgina
 * principal pre-cachejada com a fallback.
 */
self.addEventListener('fetch', event => {
  // Evitar interceptar peticions de diferents orígens (CORS) o devtools
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      if(cached) return cached;
      return fetch(req).then(networkResp => {
        // opcional: afegir al cache recursos navegats del mateix origen
        if (networkResp && networkResp.status === 200 && req.url.startsWith(self.location.origin)){
          const respClone = networkResp.clone();
          caches.open(NOM_CACHE).then(cache => cache.put(req, respClone));
        }
        return networkResp;
      }).catch(() => {
        // fallback senzill: retornar la pàgina principal si està en cache
        return caches.match('/M09_AppCache.html');
      });
    })
  );
});
