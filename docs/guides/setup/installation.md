---
layout: docs
title: Setup
next_section: webpack
permalink: /docs/home/
---

Tonic Data Manager is a library that is meant to be easily integrated into
your environment. For that we provide three way of integration.

## npm dependency

Our preferred integration path is through npm using _require_ within your
code and relying on _WebPack_ or _Browserify_ to package all your code
dependency into a single or multiple JavaScript files that are dedicated
for your application.

Tonic Data Manager can be added to your package.json with the following 
configuration subset.

```
"dependencies": {
    "tonic-data-manager": "latest"
}
```

or if you want the latest code base that has not been publish yet to the npm
registry.

```
"dependencies": {
    "tonic-data-manager": ""Kitware/tonic-data-manager"
}
```

To read more on how to use the library within your code and how to
configure _WebPack_ to package your application with all its
dependency. You can refer to the 
**_[WebPack documentation guide](/docs/webpack)_**.

## Bower dependency

On top of a _npm_ module, we also generate a packaged version of the 
**Tonic Data Manager** library that can be used as a standalone file.
This file can be retrieved using _bower_.

```
bower file config snippet
FIXME 
=> Need to register
=> Need to show bower dependency snippet
```

This will extend the global namespace with a **_tonicDataManager_** which
provides the same API as the **_Tonic Data Manager_** module.

## Drop in

You can download manually our packaged version **_[here][JS-File]_** for an
integration into your code base.

[JS-File]: https://raw.githubusercontent.com/Kitware/tonic-data-manager/master/dist/tonic-data-manager.js
