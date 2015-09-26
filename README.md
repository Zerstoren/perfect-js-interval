# Interval JS
 Low CPU usage

 Work when browser not in focus
 When window is focused - maximal deviation 50 ms (when CPU is empty).
 Normal deviation with focused window 0-1 ms.
 When window is blured - maximal deviation 1 second.

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

// stop handling interval events
var fn = function() {};
window.intervalJS.on(window.intervalJS.EVERY_1_SECONDS);
```