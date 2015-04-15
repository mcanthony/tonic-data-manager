# Tonic Data Manager #

This module allow the user to fetch data (JSON, Text, ArrayBuffer, blob) and 
cache the result for future use. Additional pattern based URL request can 
be achieved. Image can also be retrieved as a blob and can be display using
a generated browser url.

## fetchURL(url, type[, mimeType])

This method is used to fetch a data object from a static URL. The set of possible
data type are: [ json', 'text', 'blob', 'array' ]

For the **blob** type, an extra argument is required which is the mime type of
the Blob.

```javascript
var url = '/data/myJsonFile.json';
tonicDataManager.on(url, function(error, dataObject) {
    console.log("Got " + dataObject.type + " object from " + dataObject.requestedURL + " - last access time: " + dataObject.ts);
    console.log(dataObject.data);
});

tonicDataManager.fetchURL(url, 'json');
```

## fetch(key, options)

This methods let you download a resource based on a previously registered pattern
with specific key/value pair replacement.

Here is a full example using that method:

```js
function onJsonData(error, cacheDataObject) {
    if(error) {
        // Something wrong happened
        throw error;
    }

    var jsonObj = cacheDataObject.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // Access data from JSON object
    console.log(" - str: " + jsonObj.str);
    console.log(" - array: " + jsonObj.array);
    console.log(" - nestedObject.a: " + jsonObj.nestedObject.a);
}

tonicDataManager.registerURL('jsonDataModel', '/data/{name}.json', 'json');
tonicDataManager.on('jsonDataModel', onJsonData);
tonicDataManager.fetch('jsonDataModel', { name: 'info'});
```

## get(url[, freeCache])

This method will return the downloaded data object if available or an **undefined**
object.

The _freeCache_ argument is optional and should be *true* if you want to remove
the given resource from the cache.

The standard returned object will looks like that:

```js
{
    ts: 23423452, // Last access time in milliseconds.
    data: "str" | { json: 'data'} | Blob() | Uint8Array(), // Raw data depending of the fetch data type.
    type: 'text' | 'json' | 'blob' | 'arraybuffer',
    url: ...internal browser url to point to the data..., // This can be use to render images
    requestedURL: '/origin/requested/url'
}
```

## free(url)

Remove the entry from the cache based on the **requestedURL** of a cache entry.

## registerURL(key, urlPattern, type, mimeType)

This allow you to register pattern based URL to ease data fetching from it.

```js
var pattern = '/data/{ds}/image_{idx}.png';
var key = 'image_ds'
tonicDataManager.registerURL(key, pattern, 'blob', 'image/png');

tonicDataManager.on(key, function(error, dataObject) {
    console.log(
        "Got " + dataObject.type + " object from " + dataObject.requestedURL 
        + " - last access time: " + dataObject.ts 
        + " - usable url: " + dataObject.url);
});

tonicDataManager.fetch(key, { idx: 0, ds: 'temperature' });
tonicDataManager.fetch(key, { idx: 1, ds: 'temperature' });
tonicDataManager.fetch(key, { idx: 2, ds: 'temperature' });
tonicDataManager.fetch(key, { idx: 0, ds: 'pressure' });
tonicDataManager.fetch(key, { idx: 1, ds: 'pressure' });
tonicDataManager.fetch(key, { idx: 2, ds: 'pressure' });
```

## unregisterURL(key)

Remove the pattern from the registry.

## clear()

Empty the content of the cache.

## on(event, listener)

Attach a listener to a **url** or a pattern key.

Here is a list of possible listener functions

```js
function onJsonData(error, cacheDataObject) {
    if(error) {
        // Something wrong happened
        throw error;
    }

    var jsonObj = cacheDataObject.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // Access data from JSON object
    console.log(" - str: " + jsonObj.str);
    console.log(" - array: " + jsonObj.array);
    console.log(" - nestedObject.a: " + jsonObj.nestedObject.a);
}

function onTxtData(error, cacheDataObject) {
    if(error) {
        // Something wrong happened
        throw error;
    }

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // Replace content inside your DOM
    var strHTML = cacheDataObject.data;
    $('.help').html(strHTML);
}

function onBlobData(error, cacheDataObject) {
    var blob = cacheDataObject.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // The URL let you provide a link to the blob
    console.log(" - Usable URL: " + cacheDataObject.url);
}

function onArrayData(error, cacheDataObject) {
    if(error) {
        // Something wrong happened
        throw error;
    }

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // Replace content inside your DOM
    var Uint8ArrayObj = cacheDataObject.data;
    // [...]
}

function onImage(error, cacheDataObject) {
    var blob = cacheDataObject.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);

    // The URL let you provide a link to the blob
    console.log(" - Usable URL: " + cacheDataObject.url);

    // Update the image in the DOM
    $('.image-to-refresh').attr('src', cacheDataObject.url);
}
```
