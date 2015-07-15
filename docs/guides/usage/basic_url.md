---
layout: docs
title: Simple download
prev_section: webpack
next_section: pattern
permalink: /docs/basic_url/
---

Tonic Data Manager let you download any kind of data remotely. It is optimized
for repetitive remote data retrieval but can also be used for simple and one
time URL request.

The following code base illustrate how to fetch data using the _Tonic Data Manager library_.

```
// Optional if Bower or DropIn setup are used.
var TonicDataManager = require('tonic-data-manager'),
    tonicDataManager = new TonicDataManager();
//
// Download url for JSON data
var urlJSON = '/data/myData.json';
//
// Attach data handler
tonicDataManager.on(urlJSON, function(data, envelope){
    // The second argument will free the internal cache
    var myJsonObject = tonicDataManager.get(urlJSON, true).data; // = data.data;
    //
    // Do what you want with the JSON object
    // but be aware that because we free the resource
    // any following get will be undefined.
});
//
// Trigger the download urlJSON
tonicDataManager.fetchURL(urlJSON, 'json');
```
