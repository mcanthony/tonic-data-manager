---
layout: docs
title: Using webpack
prev_section: home
next_section: basic_url
permalink: /docs/webpack/
repo_path: /docs/guides/setup/webpack.md
---

# Get the library

To add the _Tonic Data Manager_ library to your project dependency, just edit
your _package.json_ file and add the following entry inside your _dependencies_
group.

```
"dependencies": {
    "tonic-data-manager": "^0.0.4",
    "monologue.js": "^0.3.3",
    [...]
}
```

> Adding the _monologue.js_ here at the root of your project will prevent
> Webpack to encapsulate several versions of it if used across other internal
> dependencies.

# Use the library

Inside a CommonJS module you can do the following in order to get access to it
like regular CommonJS module injection.


```
var TonicDataManager = require("tonic-data-manager"),
    dataManager = new TonicDataManager(),
    basePattern = "/data/images/{name}/{index}.png",
    readyCallback = {};

function downloadAllImages(name, numberOfImages) {
    var results = {
            "urls": [],
            "remoteUrls": [],
            "count": 0,
            "free": freeResources
        },
        options = {
            "name": name,
            "index": 0
        };

    function freeResources() {
        var count = results.remoteUrls.length;
        while(count--) {
            dataManager.free(results.remoteUrls[count]);
        }
    }

    function callback(data, envelope) {
        if(data.error) {
            // Got error
            return;
        }

        results.urls.push(data.url);
        results.remoteUrls.push(data.requestedURL);
        results.count++;

        if(results.count === numberOfImages) {
            readyCallback[name](results);
            delete readyCallback[name];
            dataManager.unregisterURL(name);
        }
    }

    // Register pattern
    dataManager.registerURL(name, basePattern, "blob", "image/png");

    // Attach internal callback
    dataManager.on(name, callback);

    // Fetch the image list
    for(var index = 0; index < numberOfImages; index++) {
        options.index = index;
        dataManager.fetch(name, options);
    }
}

// Register external user callback when all pictures are ready
function onReady(name, callback) {
    readyCallback[name] = callback;
}

// Expose our module so it can be used
module.exports = {
    download : downloadAllImages,
    onReady  : onReady
}

```

# Webpack Configuration

Webpack go through your application dependencies and bundle them within
JavaScript file(s) so they can be used within web pages.

For Webpack to work, you need to provide the entry point of your application
and describe in a configuration file how package should be resolved.
This is specially useful when you are not only requiring JavaScript file but CSS,
Stylus, Jade, Coffee or any other format that may need pre-processing.

Here is a basic setup that may work for you.

```
// webpack.config.js
var webpack = require('webpack');

module.exports = {
  plugins: [],
  entry: './lib/YOUR_APPLICATION_ENTRY_POINT.js',
  output: {
    path: './dist',
    filename: 'BUNDLE_NAME.js',
  },
  module: {
    preLoaders: [
      {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "jshint-loader!babel" // This will validate your code at bundle time and handle ES6/7
      }
    ]
  },
  jshint: {
    esnext: true,
    browser: true,
    globalstrict: true // Babel add 'use strict'
  },
};

```

And by extending the _scripts_ section of your _package.json_ file you can
have shortcut to build/bundle your application.

Here is the set of commands that we tend to use in _Tonic_ components:

```
"scripts": {
    "build": "webpack",
    "build:debug": "webpack --display-modules",
    "build:release": "webpack -p"
}
```

