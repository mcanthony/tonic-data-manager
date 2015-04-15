---
layout: docs
title: Pattern based
prev_section: basic_url
next_section: download_type
permalink: /docs/pattern/
---

Tonic Data Manager excel in pattern oriented requests. This guide will illustrate how to structure some code that will make repetitive request
to fetch a given set of data objects.

```
// Optional if Bower or DropIn setup are used.
var tonicDataManager = require('tonic-data-manager');
```

Let's register the types of requests we will be making

```
// Data url pattern registering
tonicDataManager.registerURL('image', '/data/{name}/{idx}.png', 'blob', 'image/png');
tonicDataManager.registerURL('model', '/data/{name}/info.json', 'json');
tonicDataManager.registerURL('help', '/data/{name}/desc_{idx}.html', 'text');
```

Attach data handler when the data is available on the client

```
tonicDataManager.on('image', onImageAvailable);
tonicDataManager.on('model', onDataAvailable);
tonicDataManager.on('help', onHelpAvailable);
// functions definition
function onImageAvailable(error, cacheObject) {
    // Update image url to show the given one
    $('.image-viewer').attr('src', cacheObject.url);
}
function onDataAvailable(error, cacheObject) {
    playImageStack(cacheObject.data);
}
function onHelpAvailable(error, cacheObject) {
    // Update the image description
    $('.image-viewer-description').html(cacheObject.data);
}
```

Let's define how we play the image set


```
var options = { name: "vacation-2014" };
function playImageStack(idList) {
    options.list = idList;
    options.currentIndex = 0;
    options.idx = options.list[options.currentIndex];
    //
    function next() {
        tonicDataManager.fetch('image', options);
        tonicDataManager.fetch('help', options);
        //
        options.currentIndex++;
        //
        if(options.currentIndex < options.list.length) {
            setTimeout(next, 5000);
        }
    }
}
```

And start the animation by fetching the data model

```
tonicDataManager.fetch('model', options);
```
