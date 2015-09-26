(function () {
    'use strict';

    // Fixes for old browsers
    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame =
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( callback, element ) {
                window.setTimeout( callback, 1000 / 60 );
            };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame =
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.clearTimeout
    }

    /**
     * @constructor
     */
    var IntervalJS = function () {
        var self = this;

        this.frame = 0;

        // if you want to extend events list, add the constant to this list
        this.listOfEvents = [
            this.EVERY_05_SEC,
            this.EVERY_1_SEC,
            this.EVERY_5_SEC,
            this.EVERY_15_SEC,
            this.EVERY_30_SEC,
            this.EVERY_60_SEC
        ];

        this.listOfEvents.forEach(function (item) {
           this.nums[item] = 0;
           this.events[item] = [];
        }.bind(this));

        this.requestFrameFn = function () {
            self.processCall();
            self.requestFrameId = window.requestAnimationFrame(self.requestFrameFn);
        };

        if(document.hasFocus() === false) {
            this.onBlurWindow();
        } else {
            this.onFocusWindow();
        }

        window.onfocus = this.onFocusWindow.bind(this);
        window.onblur = this.onBlurWindow.bind(this);

    };

    /**
     * Keep last call time
     * @type {number}
     */
    IntervalJS.prototype.lastUpdate = (new window.Date().getTime());

    /**
     * Request animation frame function
     * @type {null}
     */
    IntervalJS.prototype.requestFrameFn = null;

    /**
     * Interval number
     * @type {null}
     */
    IntervalJS.prototype.intervalId = null;

    /**
     * Request animation frame number
     * @type {null}
     */
    IntervalJS.prototype.requestFrameId = null;

    /**
     * Keep, how many handlers stored for this event
     * @type {{}}
     */
    IntervalJS.prototype.nums = {};

    /**
     * Events object
     * @type {{}}
     */
    IntervalJS.prototype.events = {};

    /**
     * Number of frame executed
     * @type {number}
     */
    IntervalJS.prototype.frame = 1;

    /**
     * List of current events, you can extends this number. 1 seconds == 60 frames, minimal - 1 frame (16.6 milliseconds)
     * @type {number}
     */
    IntervalJS.prototype.EVERY_05_SEC = 30;
    IntervalJS.prototype.EVERY_1_SEC = 60;
    IntervalJS.prototype.EVERY_5_SEC = 300;
    IntervalJS.prototype.EVERY_15_SEC = 900;
    IntervalJS.prototype.EVERY_30_SEC = 1800;
    IntervalJS.prototype.EVERY_60_SEC = 3600;

    /**
     * Called when browser tab activated
     */
    IntervalJS.prototype.onFocusWindow = function () {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.requestFrameId = window.requestAnimationFrame(this.requestFrameFn);
    };

    /**
     * Called when browser tab deactivated
     */
    IntervalJS.prototype.onBlurWindow = function () {
        if (this.requestFrameId !== null) {
            window.cancelAnimationFrame(this.requestFrameId);
        }

        if (this.intervalId === null) {
            var self = this;
            this.intervalId = setInterval(function () {
                self.processCall()
            }, 16);
        }
    };

    /**
     * This is base method for checking, how many frames will be lost from previous iteration
     */
    IntervalJS.prototype.processCall = function () {
        var localUpdate = (new window.Date().getTime()),
            waitedTime = parseInt((localUpdate - this.lastUpdate), 10);

        if (waitedTime >= 100) {
            this.processFrame(
                parseInt(waitedTime / 16.6, 10)
            );
        } else {
            this.processFrame(1);
        }

        this.lastUpdate = localUpdate;
    };

    /**
     * Process number of frames and call all events
     * @param numberOfFrames
     */
    IntervalJS.prototype.processFrame = function (numberOfFrames) {
        var i, g;

        for (i = 0; i < numberOfFrames; i++) {
            this.frame += 1;

            for (g = 0; g < this.listOfEvents.length; g++) {
                if (this.nums[this.listOfEvents[g]] && this.frame % this.listOfEvents[g] === 0) {
                    this.trigger(this.listOfEvents[g]);
                }
            }
        }
    };

    /**
     * Subscribe to event by constant (number of frames), other constants will not work
     * @param eventName
     * @param fn
     * @param context
     */
    IntervalJS.prototype.on = function (eventName, fn, context) {
        this.nums[eventName] += 1;
        this.events[eventName].push({
            fn: fn,
            context: context
        });
    };

    /**
     * Subscribe to one time
     * @param eventName
     * @param fn
     * @param context
     */
    IntervalJS.prototype.once = function (eventName, fn, context) {
        var onceFn = function () {
            this.off(eventName, fn, context);
            fn.apply(context);
        };

        this.nums[eventName] += 1;
        this.events[eventName].push({
            fn: onceFn,
            context: this
        });
    };


    /**
     * Un subscribe
     * @param eventName
     * @param fn
     * @param context
     */
    IntervalJS.prototype.off = function (eventName, fn, context) {
        var index,
            obj = {
            fn: fn,
            context: context
        };

        this.nums[eventName] -= 1;
        index = this.events[eventName].indexOf(obj);
        if (index !== -1) {
            this.events[eventName].splice(index, 1);
        }
    };

    /**
     * Trigger by event name
     * @param eventName
     */
    IntervalJS.prototype.trigger = function (eventName) {
        var i, obj = this.events[eventName];

        for (i = 0; i < obj.length; i++) {
            obj[i].fn.apply(obj[i].context);
        }
    };

    // Only require js or global object.
    if (window.define) {
        define('intervalJS', function () {
            return new IntervalJS();
        });
    } else {
        window.intervalJS = new IntervalJS();
    }
})();
