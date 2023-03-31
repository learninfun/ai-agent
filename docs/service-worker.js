var fileMayChangeCacheKey = 'filesMayChange';//10/03 08:34
var filesMayChange = [
  'index.html',
  'css/index.css',
  'js/helper.js',
  'js/index.js',
];
var staticFileCacheKey = 'staticFile';
var staticFile = [
  'vender/bootstrap-5.3.0-alpha2/css/bootstrap.min.css',
  'vender/highlight.js-11.7.0/default.min.css',
  'vender/highlight.js-11.7.0/atom-one-dark.min.css',
  
  'vender/jquery-3.6.4/jquery-3.6.4.slim.min.js',
  'vender/bootstrap-5.3.0-alpha2/js/bootstrap.bundle.min.js',
  'vender/handlebars-4.7.7/handlebars.min.js',
  'vender/markdown-it-13.0.1/markdown-it.min.js',
  'vender/highlight.js-11.7.0/highlight.min.js',
]

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil((async () => {
    const cacheMayChange = await caches.open(fileMayChangeCacheKey);
    await cacheMayChange.addAll(filesMayChange);

    const cacheStatic = await caches.open(staticFileCacheKey);
    await cacheStatic.addAll(staticFile);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  //只清除filesMayChange
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if(key===fileMayChangeCacheKey) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag == 'syncMoneyWatcher') {
    debugger;
    event.waitUntil(syncData());
  }
});

function syncData() {
  var spendDataArrStr = localStorage.setItem('spendDataArr');
  console.log("spendDataArrStr:"+spendDataArrStr);
  if(spendDataArrStr==''||spendDataArrStr==null) {
    return;
  }

  var spendDataArr = JSON.parse(spendDataArrStr);
  appendSpendData(spendDataArr);
}