// Module dependencies and constants
var request = require('./request.js'),
    PatternMap = require('./pattern.js'),
    Monologue = require('monologue.js'),
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

// TonicDataManager definition
export default function TonicDataManager() {
    this.pattern = new PatternMap();
    this.keyToTypeMap = {};
    this.cacheData = {
        cache: {},
        modified: 0,
        ts: 0
    };
}

// Add Observer pattern to TonicDataManager using Monologue.js
Monologue.mixInto(TonicDataManager);


// Fetch data in an asynchronous manner
// This will trigger an event using the key as the type
TonicDataManager.prototype.fetch = function (key, options) {
    var url = options ? this.pattern.getValue(key, options) : key,
        dataCached = this.cacheData.cache[url];

    if(dataCached) {
        this.cacheData.ts = dataCached.ts = ts();

        // Trigger the event after the return
        setTimeout( () => {
            this.emit(key, dataCached);
        }, 0);
    } else {
        // Need to fetch the data on the web
        var self = this,
            typeFnMime = this.keyToTypeMap[key],
            type = typeFnMime[0],
            fn = typeFnMime[1],
            mimeType = typeFnMime[2],
            callback = function(error, data) {
                if(error) {
                    self.emit(key, { error, data: { key: key, options: options, url: url, typeFnMime: typeFnMime}});
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
                self.cacheData.modified = self.cacheData.ts = dataCached.ts = ts();

                // Store it in the cache
                self.cacheData.cache[url] = dataCached;

                // Trigger the event
                self.emit(key, dataCached);
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
}
