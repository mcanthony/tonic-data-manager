# Tonic Data Manager #

This module allow the user to fetch data (JSON, Text, ArrayBuffer, blob) and
cache the result for future use. Additional pattern based URL request can
be achieved. Image can also be retrieved as a blob and can be display using
a generated browser url.

A new instance need to be created like the following example

```javascript
var TonicDataManager = require('tonic-data-manager'),
    instance = new TonicDataManager();
```

All listening is managed using [monolog.js](https://www.npmjs.com/package/monologue.js)
and might not be fully described here but can be used as described
[here](https://www.npmjs.com/package/monologue.js).

## fetchURL(url, type[, mimeType])

This method is used to fetch a data object from a static URL. The set of possible
data type are: [ json', 'text', 'blob', 'array' ]

For the **blob** type, an extra argument is required which is the mime type of
the Blob.

```javascript
var url = '/data/myJsonFile.json';
tonicDataManager.on(url, function(data, envelope) {
    console.log("Got " + data.data.type + " object from " + data.requestedURL + " - last access time: " + data.ts);
    console.log(data.data);
});

tonicDataManager.fetchURL(url, 'json');
```

## fetch(key, options)

This methods let you download a resource based on a previously registered pattern
with specific key/value pair replacement.

Here is a full example using that method:

```js
function onJsonData(data, envelope) {

    var jsonObj = data.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // Access data from JSON object
    console.log(" - str: " + jsonObj.str);
    console.log(" - array: " + jsonObj.array);
    console.log(" - nestedObject.a: " + jsonObj.nestedObject.a);
}

tonicDataManager.registerURL('jsonDataModel', '/data/{name}.json', 'json');
var subscription = tonicDataManager.on('jsonDataModel', onJsonData);
tonicDataManager.fetch('jsonDataModel', { name: 'info'});

// Then to stop listening: subscription.unsubscribe();
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

tonicDataManager.on(key, function(data, envelope) {
    console.log(
        "Got " + data.type + " object from " + data.requestedURL
        + " - last access time: " + data.ts
        + " - usable url: " + data.url);
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
function onJsonData(data, envelope) {
    var jsonObj = data.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // Access data from JSON object
    console.log(" - str: " + jsonObj.str);
    console.log(" - array: " + jsonObj.array);
    console.log(" - nestedObject.a: " + jsonObj.nestedObject.a);
}

function onTxtData(data, envelope) {
    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // Replace content inside your DOM
    var strHTML = data.data;
    $('.help').html(strHTML);
}

function onBlobData(data, envelope) {
    var blob = data.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // The URL let you provide a link to the blob
    console.log(" - Usable URL: " + data.url);
}

function onArrayData(data, envelope) {
    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // Replace content inside your DOM
    var Uint8ArrayObj = data.data;
    // [...]
}

function onImage(data, envelope) {
    var blob = data.data;

    // Print additional cache meta data
    console.log(" - Last read time: " + data.ts);
    console.log(" - Data Type: " + data.type);
    console.log(" - Requested URL: " + data.requestedURL);

    // The URL let you provide a link to the blob
    console.log(" - Usable URL: " + data.url);

    // Update the image in the DOM
    $('.image-to-refresh').attr('src', data.url);
}
```