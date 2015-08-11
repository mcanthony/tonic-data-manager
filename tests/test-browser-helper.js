(function(window){
    var callbackStack = [],
        callbackFnStack = [],
        intervalID = null;
    // ----------------------------------------------------------------------------

    function start() {
        intervalID = setInterval(processCallbackFnStack, 200);
        callbackStack = [];
        callbackFnStack = [];
    };

    // ----------------------------------------------------------------------------

    function callback(error, response) {
        callbackStack.push({error: error, response: response});
    };

    // ----------------------------------------------------------------------------

    function waitAndRun(fn) {
        callbackFnStack.push(fn);
    }

    // ----------------------------------------------------------------------------

    function processCallbackFnStack() {
        if(callbackStack.length > 0 && callbackFnStack.length > 0) {
            var data = callbackStack.shift(),
                fn = callbackFnStack.shift();

            fn(data);
        }
    }

    // ----------------------------------------------------------------------------

    function done(fn) {
        window.clearInterval(intervalID);
        intervalID = null;
        fn();
    }

    // ----------------------------------------------------------------------------

    window.testHelper = callback;
    window.testHelper.start = start;
    window.testHelper.waitAndRun = waitAndRun;
    window.testHelper.done = done;

})(window);
