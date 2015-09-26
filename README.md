# Interval JS

 Using:

```javascript

// Analogy of setInterval
window.intervalJS.on(
    window.intervalJS.EVERY_1_SECONDS
    function () {
        console.log('call');
    },
    this
);

// Analogy of setTimeout
window.intervalJS.once(
    window.intervalJS.EVERY_1_SECONDS
    function () {
        console.log('call');
    },
    this
);

// stop handling interval events00
var fn = function() {};
window.intervalJS.on(window.intervalJS.EVERY_1_SECONDS
```