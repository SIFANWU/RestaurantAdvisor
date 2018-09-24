var version = 'version-1.1';
// get all files using '/'
var cacheFiles = [
    '/'
];

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(version).then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('activate', function (event) { // listen activate event
    event.waitUntil( // wait for activate event
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){ // clear old caches
                if(key !== version){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function (event) {
    var online = navigator.onLine;
    if (online){//when the app online, return the response from server.
        var url = event.request.clone();
        event.respondWith(fetch(url).then(function (res) {
            if(!res || res.status !== 200 || res.type !== 'basic'){
                return res;
            }
            var response = res.clone();

            caches.open(version).then(function(cache){ // save online resources to caches
                cache.put(event.request, response);
            });

            return res;
        }))
    }else {//when offline, return the response from cache.
        event.respondWith(
            caches.match(event.request).then(function(res){
                return res;
            })
        );
    }

});