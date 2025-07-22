const CACHE_NAME = "todo-pwa-v1"
const FILES_TO_CACHE = ["./", "./index.html", "./estilo.css", "./app.js", "./manifest.json"]

// Instalar Service Worker
self.addEventListener("install", (e) => {
  console.log("🔧 SW: Instalando...")
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 SW: Cacheando archivos")
      return cache.addAll(FILES_TO_CACHE)
    }),
  )
})

// Interceptar peticiones
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request)
    }),
  )
})
