// Module dependencies and constants
var request = require('./request.js'),
    PatternMap = require('./pattern.js'),
    Monologue = require('monologue.js'),
    typeFnMap = {
        json:  request.fetchJSON,
        text:  request.fetchTxt,
        blob:  request.fetchBlob,
        arraybuffer: request.fetchArray,
        array: request.fetchArray
    };

// Internal helper that return the current time
function ts() {
    return new Date().getTime();
}

function updateDataSize(data) {
    if(data.type === 'json') {
        data.size = JSON.stringify(data.data).length;
    } else if(data.type === 'blob') {
        data.size = data.data.size;
    } else {
        data.size = data.data.length;
    }
    return data.size;
}

// Should use converter
// flipArrayEndianness = function(array) {
//   var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
//   for (var i=0; i<array.byteLength; i+=array.BYTES_PER_ELEMENT) {
//     for (var j=i+array.BYTES_PER_ELEMENT-1, k=i; j>k; j--, k++) {
//       var tmp = u8[k];
//       u8[k] = u8[j];
//       u8[j] = tmp;
//     }
//   }
//   return array;
// }

// TonicDataManager definition
export default function TonicDataManager(cacheSize = 1000000000) {
    this.pattern = new PatternMap();
    this.keyToTypeMap = {};
    this.cacheSize = cacheSize;
    this.cacheData = {
        cache: {},
        modified: 0,
        ts: 0,
        size: 0
    };
}

// Add Observer pattern to TonicDataManager using Monologue.js
Monologue.mixInto(TonicDataManager);

TonicDataManager.prototype.destroy = function() {
    this.off();
    this.clear();
}

// Fetch data in an asynchronous manner
// This will trigger an event using the key as the type
TonicDataManager.prototype.fetch = function (key, options) {
    var url = options ? this.pattern.getValue(key, options) : key,
        dataCached = this.cacheData.cache[url];

    if(dataCached) {
        if(!dataCached.pending) {
            this.cacheData.ts = dataCached.ts = ts();

            // Trigger the event after the return
            setTimeout( () => {
                var array = dataCached.keysToNotify || [ key ],
                    count = array.length;

                delete dataCached.keysToNotify;

                while(count--) {
                    this.emit(array[count], dataCached);
                }
            }, 0);
        } else {
            dataCached.keysToNotify.push(key);
        }
    } else {
        // Run Garbage collector to free memory if need be
        this.gc();

        // Prevent double fetch
        this.cacheData.cache[url] = { pending: true, keysToNotify: [key] };

        // Need to fetch the data on the web
        var self = this,
            typeFnMime = this.keyToTypeMap[key],
            type = typeFnMime[0],
            fn = typeFnMime[1],
            mimeType = typeFnMime[2],
            callback = function(error, data) {
                if(error) {
                    delete self.cacheData.cache[url];
                    self.emit(key, { error, data: { key: key, options: options, url: url, typeFnMime: typeFnMime}});
                    return null;
                }

                dataCached = {
                    data: data,
                    type: type,
                    requestedURL: url,
                    pending: false
                };

                // Handle internal url for image blob
                if(mimeType && mimeType.indexOf('image') !== -1) {
                    dataCached.url = window.URL.createObjectURL(data);
                }

                // Update memory usage
                self.cacheData.size += updateDataSize(dataCached);

                // Update ts
                self.cacheData.modified = self.cacheData.ts = dataCached.ts = ts();

                // Trigger the event
                var array = self.cacheData.cache[url].keysToNotify,
                    count = array.length;

                // Store it in the cache
                self.cacheData.cache[url] = dataCached;

                while(count--) {
                    self.emit(array[count], dataCached);
                }
            };

        fn(url, mimeType ? mimeType : callback, callback);
    }

    return url;
}

// Fetch data from URL
TonicDataManager.prototype.fetchURL = function (url, type, mimeType) {
    this.keyToTypeMap[url] = [type, typeFnMap[type], mimeType];
    return this.fetch(url);
}

// Get data in cache
TonicDataManager.prototype.get = function(url, freeCache) {
    var dataObj = this.cacheData.cache[url];
    if(freeCache) {
        this.free(url);
    }
    return dataObj;
}

// Free a fetched data
TonicDataManager.prototype.free = function(url) {
    var dataCached = this.cacheData.cache[url];
    if(dataCached && dataCached.url) {
        window.URL.revokeObjectURL(dataCached.url);
        delete dataCached.url;
    }

    delete this.cacheData.cache[url];
    this.off(url);
}

// Register a key/pattern for future use
// Type can only be ['json', 'text', 'blob', 'array']
// mimeType is only required for blob
TonicDataManager.prototype.registerURL = function(key, filePattern, type, mimeType) {
    this.pattern.registerPattern(key, filePattern);
    this.keyToTypeMap[key] = [type, typeFnMap[type], mimeType];
}

// Free previously registered URL
TonicDataManager.prototype.unregisterURL = function(key) {
    this.pattern.unregisterPattern(key);
    delete this.keyToTypeMap[key];
    this.off(key);
}

// Empty cache
TonicDataManager.prototype.clear = function() {
    var urlToDelete = [];
    for(var url in this.cacheData.cache) {
        urlToDelete.push(url);
    }

    var count = urlToDelete.length;
    while(count--) {
        this.free(urlToDelete[count]);
    }
    this.cacheData.size = 0;
}

TonicDataManager.prototype.gc = function() {
    if(this.cacheData.size > this.cacheSize) {
        console.log('Free cache memory', this.cacheData.size);
        this.clear();
    }
}

TonicDataManager.prototype.setCacheSize = function(sizeBeforeGC) {
    this.cacheSize = sizeBeforeGC;
}

TonicDataManager.prototype.getCacheSize = function() {
    return this.cacheSize;
}

TonicDataManager.prototype.getMemoryUsage = function() {
    return this.cacheData.size;
}
