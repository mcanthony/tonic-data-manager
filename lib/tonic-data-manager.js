// Keep around fetched data
var request = require('./request.js'),
    pattern = require('./pattern.js'),
    EventEmitter = require('node-event-emitter').EventEmitter,
    emitter = new EventEmitter(),
    cacheData = {
        cache: {},
        modified: 0,
        ts: 0
    },
    keyToTypeMap = {},
    typeFnMap = {
        json:  request.fetchJSON,
        text:  request.fetchTxt,
        blob:  request.fetchBlob,
        array: request.fetchArray
    };

// Internal helper that return the current time
function ts() {
    return new Date().getTime();
}

// Register a key/pattern for future use
// Type can only be ['json', 'text', 'blob', 'array']
// mimeType is only required for blob
function registerURL(key, filePattern, type, mimeType) {
    pattern.registerPattern(key, filePattern);
    keyToTypeMap[key] = [type, typeFnMap[type], mimeType];
}

// Free previously registered URL
function unregisterURL(key) {
    pattern.unregisterPattern(key);
    delete keyToTypeMap[key];
    emitter.removeAllListeners(key);
}

function fetchURL(url, type, mimeType) {
    keyToTypeMap[url] = [type, typeFnMap[type], mimeType];
    return fetch(url);
}

// Fetch data in an asynchronous manner
// This will trigger an event using the key as the type
function fetch(key, options) {
    var url = options ? pattern.getValue(key, options) : key,
        dataCached = cacheData.cache[url];

    if(dataCached) {
        cacheData.ts = dataCached.ts = ts();

        // Trigger the event after the return
        setTimeout(function(){
            emitter.emit(key, dataCached);
        }, 0);
    } else {
        // Need to fetch the data on the web
        var typeFnMime = keyToTypeMap[key],
            type = typeFnMime[0],
            fn = typeFnMime[1],
            mimeType = typeFnMime[2],
            callback = function(error, data) {
                if(error) {
                    console.error(error);
                    emitter.emit('error', error, { key: key, options: options, url: url, typeFnMime: typeFnMime});
                    console.log("=====> error in callback");
                    return null;
                }

                dataCached = {
                    data: data,
                    type: type,
                    requestedURL: url
                };

                // Handle internal url for image blob
                if(mimeType && mimeType.indexOf('image') !== -1) {
                    dataCached.url = window.URL.createObjectURL(data);
                }

                // Update ts
                cacheData.modified = cacheData.ts = dataCached.ts = ts();

                // Store it in the cache
                cacheData.cache[url] = dataCached;

                // Trigger the event
                emitter.emit(key, dataCached);
            };

        fn(url, mimeType ? mimeType : callback, callback);
    }

    return url;
}

// Free a fetched data
function free(url) {
    var dataCached = cacheData.cache[url];
    if(dataCached && dataCached.url) {
        window.URL.revokeObjectURL(dataCached.url);
        delete dataCached.url;
    }

    delete cacheData.cache[url];
    emitter.removeAllListeners(url);
}

// Get data in cache
function get(url, freeCache) {
    var dataObj = cacheData.cache[url];
    if(freeCache) {
        free(url);
    }
    return dataObj;
}

// Empty cache
function clear() {
    var urlToDelete = [];
    for(var url in cacheData.cache) {
        urlToDelete.push(url);
    }
    
    var count = urlToDelete.length;
    while(count--) {
        free(urlToDelete[count]);
    }
}

// Expose public methods
module.exports = fetch;
module.exports.fetchURL = fetchURL;
module.exports.get = get;
module.exports.free = free;
module.exports.registerURL = registerURL;
module.exports.unregisterURL = unregisterURL;
module.exports.fetch = fetch;
module.exports.clear = clear;

// Expose events api to the module as well
module.exports.on = function(event, listener) {
    emitter.on(event, listener);
};
