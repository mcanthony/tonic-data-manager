module.exports = function(config) {
  config.set({
    basePath: '..',
    frameworks: [ 'jasmine' ],
    browsers: [
        'PhantomJS',
        'Chrome', 
        // 'ChromeCanary',
        'Safari',
        'Firefox',
        // 'IE',
    ], 
    files: [
        'https://raw.githubusercontent.com/peerlibrary/Blob.js/peerlibrary/Blob.js', // To fix blob issue with PhantomJS
        'dist/tonic-data-manager.js',
        'tests/*-browser-*.js',
        'lib/tests/**/*.js'
    ],
    exclude: [
        'lib/tests/**/*-node-only.js'
    ],
    proxies: {
        '/data': 'http://localhost:3000'
    }
  });
};
