---
layout: docs
title: Type management
prev_section: pattern
permalink: /docs/download_type/
---

Tonic Data Manager handle various data type which may need different handling.
This guide will go through all the possible types and how to interact with them.

## JSON

Let's pretend the server JSON file is as follow:

```
{
    "str": "Some string",
    "array": [ "a", "b", "c", 1, 2, 3],
    "nestedObject": {
        "a": 1,
        "b": "c"
    }
}
```

Let's define the callback function that we will be using for the JSON data handling.

```
function onJsonData(error, cacheDataObject) {
    if(error) {
        // Something wrong happened
        throw error;
    }
    //
    var jsonObj = cacheDataObject.data;
    //
    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);
    //
    // Access data from JSON object
    console.log(" - str: " + jsonObj.str);
    console.log(" - array: " + jsonObj.array);
    console.log(" - nestedObject.a: " + jsonObj.nestedObject.a);
}
```

### URL based

```
var url = '/data/info.json';
tonicDataManager.on(url, onJsonData);
tonicDataManager.fetchURL(url, 'json');
```

### Pattern based

```
tonicDataManager.registerURL('jsonDataModel', '/data/{name}.json', 'json');
tonicDataManager.on('jsonDataModel', onJsonData);
tonicDataManager.fetch('jsonDataModel', { name: 'info'});
```

## Text

Let's pretend the server Text file is an html template like that:

```<p>Hello world</p>```

Let's define the callback function that we will be using for the Text data handling.

```
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
```

### URL based

```
var url = '/data/text.html';
tonicDataManager.on(url, onTxtData);
tonicDataManager.fetchURL(url, 'text');
```

### Pattern based

```
tonicDataManager.registerURL('help-template', '/data/{name}.{ext}', 'text');
tonicDataManager.on('help-template', onTxtData);
tonicDataManager.fetch('help-template', { name: 'text', ext: 'html'});
```

## Blob

Binary large object can be of any type, but require a mime type to properly work.

Here is an example on how a blob data object can be used via a callback.

```
function onBlobData(error, cacheDataObject) {
    var blob = cacheDataObject.data;
    // Print additional cache meta data
    console.log(" - Last read time: " + cacheDataObject.ts);
    console.log(" - Data Type: " + cacheDataObject.type);
    console.log(" - Requested URL: " + cacheDataObject.requestedURL);
    // The URL let you provide a link to the blob
    console.log(" - Usable URL: " + cacheDataObject.url);
}
```

### URL based

```
var url = '/data/data.dat';
tonicDataManager.on(url, onBlobData);
tonicDataManager.fetchURL(url, 'blob', 'application/octet-stream');
```

### Pattern based

```
tonicDataManager.registerURL('blob-data', '/data/{name}.{ext}', 'blob', 'application/octet-stream');
tonicDataManager.on('blob-data', onBlobData);
tonicDataManager.fetch('blob-data', { name: 'data', ext: 'dat'});
```

## Array buffer

Array buffer is actually a Uint8Array array type.

The callback could be as following:

```
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
```

### URL based

```
var url = '/data/data.dat';
tonicDataManager.on(url, onArrayData);
tonicDataManager.fetchURL(url, 'array');
```

### Pattern based

```
tonicDataManager.registerURL('array-buffer', '/data/{name}.{ext}', 'array');
tonicDataManager.on('array-buffer', onArrayData);
tonicDataManager.fetch('array-buffer', { name: 'data', ext: 'dat'});
```

## Images

Images are nothing more than a blob. So if you want to download images and 
use them inside your DOM, you can do so with the following callback and similar
request as the standard blob call.

```
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

The only thing that you need to make sure is that the mime type is the proper
image type mimetype like **'image/png'**.

### URL based

```
var url = '/data/image.png';
tonicDataManager.on(url, onImage);
tonicDataManager.fetchURL(url, 'blob', 'image/png');
```

### Pattern based

```
tonicDataManager.registerURL('image', '/data/{name}.png', 'blob', 'image/png');
tonicDataManager.on('image', onImage);
tonicDataManager.fetch('image', { name: 'image'});
```
