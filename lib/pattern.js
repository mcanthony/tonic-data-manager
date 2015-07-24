// The goal of that module is to be able to register a set of String pattern
// and have a simple way to evaluate that pattern from an object.
// Here is an example on how the following module can be used.
//
//     var m = new PatternMap();
//     m.registerPattern('imagesURL', '{time}/{pressure}/{phi}_{theta}.png');
//     m.registerPattern('jsonURL', '{time}/{pressure}/data.json');
//     var time = [1, 2, 3, 4, 5, 6],
//         pressure = [34, 35, 36],
//         phi = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
//         theta = [0, 20, 40, 60, 80];
//
//     timeCount =  time.length;
//     var options = {};
//     while(timeCount--) {
//        options.time = time[timeCount];
//        pressureCount = pressure.length;
//        while(pressureCount--) {
//           options.pressure = pressure[pressureCount];
//           phiCount = phi.length;
//           while(phiCount--) {
//              options.phi = phi[phiCount];
//              thetaCount = theta.length;
//              while(thetaCount--) {
//                 options.theta = theta[thetaCount];
//                 console.log(" => Image: " + m.getValue('imageURL', options));
//              }
//           }
//           console.log(" => JSON: " + m.getValue('jsonURL', options));
//        }
//     }
//     m.unregisterPattern('imageURL');

export default function PatternMap() {
    this.keyPatternMap = {};
}

// Register a pattern to a given key
PatternMap.prototype.registerPattern = function(key, pattern) {
    this.keyPatternMap[key] = pattern;
};

// Unregister a key
PatternMap.prototype.unregisterPattern = function(key) {
    delete this.keyPatternMap[key];
}

// Evaluate the pattern base on its registered key and set of key to be replaced
PatternMap.prototype.getValue = function(key, options) {
    var result = this.keyPatternMap[key],
        keyPattern = ['{', '}'];

    for(var opt in options) {
        result = result.replace(keyPattern.join(opt), options[opt]);
    }

    return result;
}
