/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-04-10T18:25:21.430Z
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  * http://www.apache.org/licenses/LICENSE-2.0
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Drawer = factory());
}(this, function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  var Final =
  /*#__PURE__*/
  function () {
    function Final() {}

    Final.validateThreshold = function validateThreshold(tsh) {
      if (tsh < 1) {
        tsh = 1 - tsh;
        return tsh;
      } else if (tsh >= 1) {
        tsh = 1 / 1e10;
        return tsh;
      }
    };

    return Final;
  }();

  _defineProperty(Final, "START", 2);

  _defineProperty(Final, "HIDDEN", 'hidden');

  _defineProperty(Final, "ZERO", 0);

  _defineProperty(Final, "DISPLAY", 'block');

  var Bottom =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {*} options
     * an object containing all required properties
     */
    function Bottom(options) {
      this.options = options;
      this.element = options.ELEMENT;
      /**
       * Size of device window
       */

      this.winSize = this.options.sizeOfWindow || window.screen.availHeight;
      this.height = this.element.offsetHeight;
      this.unit = this.options.unit;
      /**
       * @type number
       * A maximum area where the draw-start is sensitive
       */

      this.maxArea = this.winSize - this.options.maxStartArea;
      this.context = null;
    }

    var _proto = Bottom.prototype;

    _proto.start = function start(e) {
      var start = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var startX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      /**
       * The `Drawer`'s `Top` class uses the `CSS property` `top`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(this.element.style.bottom.replace(/[^\d]*$/, ''));
      var dimension = "-" + (this.height - start) + this.unit;
      var displacement = "-" + (this.height - Final.START) + this.unit;

      if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
        this.element.style.bottom = displacement || dimension; // Block every scroll job on the screen

        document.body.style.overflow = Final.HIDDEN;
      }
    };

    _proto.move = function move() {};

    _proto.end = function end() {};

    _proto.setContext = function setContext(ctx) {
      this.context = ctx;
      return this;
    };

    Bottom._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    } // no need for `window.onorientationchange`
    ;

    _proto._loopWinSizeChangeEvent = function _loopWinSizeChangeEvent() {
      var _this = this;

      window.setInterval(function () {
        _this.winSize = window.screen.availWidth;
      }, 1e3);
    };

    return Bottom;
  }();

  var Rectangle$1 =
  /*#__PURE__*/
  function () {
    function Rectangle(x1, y1, x2, y2) {
      this.coordsX = {
        x1: x1,
        x2: x2
      };
      this.coordsY = {
        y1: y1,
        y2: y2
      };
    } // getter


    var _proto = Rectangle.prototype;

    // methods
    _proto.wGTh = function wGTh() {
      return this.width > this.height;
    };

    _proto.hGTw = function hGTw() {
      return !this.wGTh();
    };

    _createClass(Rectangle, [{
      key: "width",
      get: function get() {
        return Math.abs(this.coordsX.x2 - this.coordsX.x1);
      }
    }, {
      key: "height",
      get: function get() {
        return Math.abs(this.coordsY.y2 - this.coordsY.y1);
      }
    }]);

    return Rectangle;
  }();

  var DIRECTION = 'left';
  var DIMENSION = 'dimension';
  var DISPLACEMENT = 'displacement';
  var EVENT_OBJ = 'event';
  var THRESHOLD = 'threshold';
  var BELOW_THRESHOLD = 'belowthreshold';
  var OPEN = 'open';
  var CLOSE = 'close';
  var UNIT = 'px';
  var MAX_START_AREA = 25;
  var THRESHOLD_VALUE = 0.666666666;

  var Left =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {{}} options
     * an object containing all required properties
     */
    function Left(options) {
      this.options = options;
      /**
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      /**
       * Size of device window
       * @type {number}
       */

      this.winSize = this.options.sizeOfWindow || window.screen.availWidth;
      /**
       * @type {number}
       */

      this.width = this.element.offsetWidth;
      this.unit = this.options.unit || UNIT;
      /**
       * @type {number}
       * A maximum area where the draw-start is sensitive
       */

      this.maxArea = this.options.maxStartArea || MAX_START_AREA;
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `0` and `1.0`
       * @type {number}
       */

      this.threshold = this.options.threshold || THRESHOLD_VALUE;
      this.threshold = Final.validateThreshold(this.threshold); // Touch coordinates (Touch Start)

      this.startX = -1;
      this.startY = -1; // Touch coordinates (Touch Move)

      this.resumeX = -1;
      this.resumeY = -1; // Touch coordinates (Touch End) [these may not be important]

      this.endX = -1;
      this.endY = -1;
      /**
       * A control for scroll. This control prevents
       * a clash between coordinates dancing between
       * the (&delta;`X`) coords and (&delta;`Y`) coords.
       * Utilising the `Rectangle` class to get bounds
       * and isolate territories
       * @type {boolean}
       */

      this.scrollControlSet = false;
      this.scrollControl = null;
      this.timing = {
        /**
         * @type {Date}
         */
        start: null,

        /**
         * @type {Date}
         */
        end: null
      };
      this.context = null;
    }
    /**
     * The `touchstart` event handler for the `Left` drawer `class`
     * @param {{}} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Left.prototype;

    _proto.start = function start(e, fn) {
      this.timing.start = new Date();
      var start = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.startX = start;
      this.startY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      /**
       * The `Drawer`'s `Left` class uses the `CSS property` -- `left`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      this.positionOnStart = currentPosition;
      var dimension = "-" + (this.width - start) + this.unit;
      var displacement = "-" + (this.width - Final.START) + this.unit;

      if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ] = e, _response[DIMENSION] = dimension, _response[DISPLACEMENT] = displacement, _response);
        fn.call(this.context || this, response, new Rectangle$1(this.startX, this.startY, -1, -1)); // this.element.style.left = displacement || dimension
        // Block every scroll job on the screen
        // document.body.style.overflow = Final.HIDDEN
      }
    }
    /**
     * The `touchstart` event handler for the `Left` drawer `class`
     * @param {{}} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(e, fn) {
      var resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var nextAction = this.positionOnStart === Final.ZERO ? CLOSE : OPEN;
      var start = this.startX;
      var width = this.width;
      /**
       * When the touch doesn't start from the max-width
       * of the element ignore `start` and use `width`
       * as starting point.
       */

      var virtualStart = start > width ? width : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `width` is the max dimension, and the `start` can
       * only be less than the `width` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
       * reading from `resume` is subtracted from the `width` to
       * get the accurate position to update the drawer with.
       */

      var dimension = "-" + (width - resume) + this.unit;
      /**
       * Dimension for closing. When the drawer is being closed,
       * the `width` is the max dimension and the `start` could
       * possibly be more than the `width`
       * or less than the `width`.
       * To assure an accurate dimension the `virtualStart`
       * determines whether to use the `width` as starting point
       * or the actual `start`. If the actual start is more than
       * `width`, the width becomes the start point else the `start`
       */

      var vdimension = "-" + (virtualStart - resume) + this.unit;
      var rect = new Rectangle$1(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.wGTh();

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlset = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO && isBoundX && nextAction === OPEN && this.scrollControl) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ] = e, _response2[DIMENSION] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this.context || this, response, rect); // this.element.style[DIRECTION] = dimension
      } // CLOSE LOGIC


      if (start <= this.width && isBoundX && nextAction === CLOSE && this.scrollControl) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ] = e, _response4[DIMENSION] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this.context || this, _response3, rect); // this.element.style[DIRECTION] = vdimension
      }
    }
    /**
     * The `touchstart` event handler for the `Left` drawer `class`
     * @param {{}} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchend` event.
     * @param {Function} fn - a callback function called when the `end`
     * event is triggered
     * @param {{}} thresholdState - a state object which should be passed
     * by reference for updating by this method
     * @returns {void}
     */
    ;

    _proto.end = function end(e, fn, thresholdState) {
      var _response5;

      this.timing.end = new Date();
      var end = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.endX = end;
      this.endY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var rect = new Rectangle$1(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var nonZero = "-" + this.width + "px";
      var zero = "" + Final.ZERO;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[EVENT_OBJ] = e, _response5.position = signedOffsetSide, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        var opposite = 'oppositeDimension';

        if (state === THRESHOLD && trueForOpen || state === BELOW_THRESHOLD && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DIMENSION] = zero, _extends2.TIMING = TIMING, _extends2[opposite] = nonZero, _extends2), response);
        } else if (state === THRESHOLD && !trueForOpen || state === BELOW_THRESHOLD && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DIMENSION] = nonZero, _extends3.TIMING = TIMING, _extends3[opposite] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (offsetSide <= this.width * threshold && this.startX <= this.maxArea) {
        thresholdState.state = [THRESHOLD, CLOSE];
        thresholdState.stateObj = getResponse(thresholdState.state[0], true); // this.element.style[DIRECTION] = zero
      } else {
        thresholdState.state = [BELOW_THRESHOLD, CLOSE];
        thresholdState.stateObj = getResponse(thresholdState.state[0], true); // this.element.style[DIRECTION] = nonZero
      } // CLOSE LOGIC


      if (start > this.maxArea && offsetSide !== this.width) {
        action = CLOSE;

        if (offsetSide > this.width * threshold) {
          thresholdState.state = [THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false); // this.element.style[DIRECTION] = nonZero
        } else {
          thresholdState.state = [BELOW_THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false); // this.element.style[DIRECTION] = zero
        }
      }

      fn.call(this, action);
    };

    _proto.setContext = function setContext(ctx) {
      this.context = ctx;
      return this;
    };

    Left._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    } // no need for `window.onorientationchange`
    ;

    _proto._loopWinSizeChangeEvent = function _loopWinSizeChangeEvent() {
      var _this = this;

      window.setInterval(function () {
        _this.winSize = window.screen.availWidth;
      }, 1e3); // eslint-disable-line no-magic-numbers
    };

    return Left;
  }();

  var DIRECTION$1 = 'right';

  var Right =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {*} options
     * an object containing all required properties
     */
    function Right(options) {
      this.options = options; // the target element, not listening to,
      // but reacting to event

      this.element = options.ELEMENT;
      /**
       * @type number
       * Size of device window in pixels
       */

      this.winSize = this.options.sizeOfWindow || window.screen.availWidth;
      /**
       * @type number
       * A numerical representation of the
       * target element's width
       */

      this.width = this.element.offsetWidth;
      this.unit = this.options.UNIT;
      /**
       * @type number
       * A maximum area where the draw-start is sensitive
       */

      this.maxArea = this.winSize - this.options.maxStartArea;
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `1.0` and `0`
       * @type number
       */

      this.threshold = this.options.threshold; // Touch coordinates (Touch Start)

      this.startX = -1;
      this.startY = -1; // Touch coordinates (Touch Move)

      this.resumeX = -1;
      this.resumeY = -1;
      /**
       * A control for scroll. This control prevents
       * a clash between coordinates dancing between
       * the (&delta;`X`) coords and (&delta;`Y`) coords.
       * Utilising the `Rectangle` class to get bounds
       * and isolate territories
       * @type boolean
       */

      this.scrollControlSet = false;
      this.scrollControl = null;
      this.context = null;
    }

    var _proto = Right.prototype;

    _proto.start = function start() {
      var start = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.startX = start;
      this.startY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      /**
       * The `Drawer`'s `Right` class uses the `CSS property` `Right`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(this.element.style.right.replace(/[^\d]*$/, ''));
      var dimension = "-" + (this.width - (this.winSize - start)) + this.unit;
      var displacement = "-" + (this.width - Final.START) + this.unit;

      if (start >= Final.ZERO && start <= this.maxArea && currentPosition !== Final.ZERO) {
        this.element.style.right = displacement || dimension; // Block every scroll job on the screen

        document.body.style.overflow = Final.HIDDEN;
      }
    }
    /**
     * The `touchmove` event handler for the `Right` drawer `class`
     * @param {*} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     */
    ;

    _proto.move = function move() {
      var resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var currentPosition = parseFloat(this.element.style[DIRECTION$1].replace(/[^\d]*$/, ''));
      var start = this.startX;
      var width = this.width;
      /**
       * When the touch doesn't start from the max-width
       * of the element ignore `start` and use `width`
       * as starting point.
       */

      var virtualStart = start < this.winSize - width ? this.winSize - width : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `width` is the max dimension, and the `start` can
       * only be less than the `width` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
       * reading from `resume` is subtracted from the `width` to
       * get the accurate position to update the drawer with.
       *
       *
       * **WHY IT IS LIKE THIS `width - (this.winSize - resume)`**
       *
       * `this.winSize - resume` converts it from a vector to a scalar.
       * Keeping it as a vector makes the dimension inaccurate
       * as the `right` property of the `HTMLElement.style` is the one being updated and not the left,
       * so the css `right` property is an enough respect for its direction.
       *
       * *__If it should be respected then__*,
       * 1. The `Right Drawer class` would be updating `left css property` and not `right`, i.e, initialy an element that uses the `Right Drawer` must have a `css file` that defines a `css left property` for the element and not a `right` property; As in
       * ```scss
       * .menu {
       *   left: // (window size + width of the element)px
       * }
       * ```
       * 2. Cardinal's `Right Drawer class` can always update
       * as `HTMLElement.style.left = ${width - resume}px`, and
       * not as it is now.
       * This way there is no `right` property respecting the direction
       * So the vector attribute of the dimension is preserved.
       */

      var dimension = "-" + (width - (this.winSize - resume)) + this.unit;
      /**
       * Dimension for closing. When the drawer is being closed,
       * the `width` is the max dimension and the `start` could
       * possibly be more than the `width`
       * or less than the `width`.
       * To assure an accurate dimension the `virtualStart`
       * determines whether to use the `width` as starting point
       * or the actual `start`. If the actual start is more than
       * `width`, the width becomes the start point else the `start`
       */

      var vdimension = "-" + (resume - virtualStart) + this.unit;
      var backdropSheet = {
        opacity: (this.winSize - resume) / width,
        display: Final.DISPLAY
      };
      var rect = new Rectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.wGTh(); // eslint-disable-next-line no-unused-expression, no-sequence, no-extra-parens

      !this.scrollControlSet && (this.scrollControl = isBoundX), this.scrollControlset = !this.scrollControlSet;
    };

    _proto.end = function end() {};

    _proto.setContext = function setContext(ctx) {
      this.context = ctx;
      return this;
    };

    Right._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    } // no need for `window.onorientationchange`
    ;

    _proto._loopWinSizeChangeEvent = function _loopWinSizeChangeEvent() {
      var _this = this;

      window.setInterval(function () {
        _this.winSize = window.screen.availWidth;
      }, 1e3);
    };

    return Right;
  }();

  var Top =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {*} options
     * an object containing all required properties
     */
    function Top(options) {
      this.options = options;
      this.element = options.ELEMENT;
      /**
       * Size of device window
       */

      this.winSize = this.options.sizeOfWindow || window.screen.availHeight;
      this.height = this.element.offsetHeight;
      this.unit = this.options.unit;
      /**
       * @type number
       * A maximum area where the draw-start is sensitive
       */

      this.maxArea = this.options.maxStartArea;
      this.context = null;
    }

    var _proto = Top.prototype;

    _proto.start = function start(e) {
      var start = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var startX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      /**
       * The `Drawer`'s `Top` class uses the `CSS property` `top`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(this.element.style.top.replace(/[^\d]*$/, ''));
      var dimension = "-" + (this.height - start) + this.unit;
      var displacement = "-" + (this.height - Final.START) + this.unit;

      if (start >= Final.ZERO && start <= this.maxArea && currentPosition != Final.ZERO) {
        this.element.style.top = displacement || dimension; // Block every scroll job on the screen

        document.body.style.overflow = Final.HIDDEN;
      }
    };

    _proto.move = function move() {};

    _proto.end = function end() {};

    _proto.setContext = function setContext(ctx) {
      this.context = ctx;
      return this;
    };

    Top._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    } // no need for `window.onorientationchange`
    ;

    _proto._loopWinSizeChangeEvent = function _loopWinSizeChangeEvent() {
      var _this = this;

      window.setInterval(function () {
        _this.winSize = window.screen.availWidth;
      }, 1e3);
    };

    return Top;
  }();

  var START = 'start';
  var MOVE = 'move';
  var END = 'end';
  var THRESHOLD$1 = 'threshold';
  var BELOW_THRESHOLD$1 = 'belowthreshold';

  var Drawer =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {{}} options - an object of configuration options
     */
    function Drawer(options) {
      this.options = options;
      /**
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      this.target = options.TARGET;
      this.events = ['touchstart', 'touchmove', 'touchend'];
      this.handlers = null;
      this.direction = options.DIRECTION;
      this.up = new Top(this.options);
      this.down = new Bottom(this.options);
      this.left = new Left(this.options);
      this.right = new Right(this.options);
      /**
       *
       * @type {{}}
       */

      this.callbacks = null;
      this.context = null;
    } // enum


    var _proto = Drawer.prototype;

    // eslint-disable-line no-magic-numbers
    // public

    /**
     * Make sure event handlers are registered using `Drawer.on(...)` before
     * calling `Drawer.activate()`
     *
     * @see {@link Drawer#on | Drawer.on}
     * @returns {void}
     */
    _proto.activate = function activate() {
      var _this = this;

      // get registered callbacks or set default
      var startfn = this.callbacks ? this.callbacks[START] : def;
      var movefn = this.callbacks ? this.callbacks[MOVE] : def;
      var endfn = this.callbacks ? this.callbacks[END] : def;

      var startHandler = function startHandler(e) {
        if (_this.direction === Drawer.UP) {
          _this.up.start(e, startfn);
        } else if (_this.direction === Drawer.DOWN) {
          _this.down.start(e, startfn);
        } else if (_this.direction === Drawer.LEFT) {
          _this.left.start(e, startfn);
        } else if (_this.direction === Drawer.DOWN) {
          _this.right.start(e, startfn);
        } else {
          _this.deactivate();
        }
      };

      var moveHandler = function moveHandler(e) {
        if (_this.direction === Drawer.UP) {
          _this.up.move(e, movefn);
        } else if (_this.direction === Drawer.DOWN) {
          _this.down.move(e, movefn);
        } else if (_this.direction === Drawer.LEFT) {
          _this.left.move(e, movefn);
        } else if (_this.direction === Drawer.DOWN) {
          _this.right.move(e, movefn);
        } else {
          _this.deactivate();
        }
      };

      var endHandler = function endHandler(e) {
        if (_this.direction === Drawer.UP) {
          var state = {};

          _this.up.end(e, endfn, state); // `state` is passed by Ref


          _this._processThresholdState(state);
        } else if (_this.direction === Drawer.DOWN) {
          var _state = {};

          _this.down.end(e, endfn, _state);

          _this._processThresholdState(_state);
        } else if (_this.direction === Drawer.LEFT) {
          var _state2 = {};

          _this.left.end(e, endfn, _state2);

          _this._processThresholdState(_state2);
        } else if (_this.direction === Drawer.DOWN) {
          var _state3 = {};

          _this.right.end(e, endfn, _state3);

          _this._processThresholdState(_state3);
        } else {
          _this.deactivate();
        }
      };

      this._register(startHandler, moveHandler, endHandler);

      for (var i = 0; i < this.events.length; i++) {
        this.target.addEventListener(this.events[i], this.handlers[i]);
      }
    }
    /**
     * A method provided by the `Drawer interface` to deactivate the drawer
     * @returns {void}
     */
    ;

    _proto.deactivate = function deactivate() {
      for (var i = 0; i < this.events; i++) {
        this.target.removeEventListener(this.events[i], this.handlers[i]);
      }

      this._register();
    }
    /**
     * A function used to register callbacks for the `Drawer class` `touchstart`,
     * `touchmove` and `touchend` event handlers.
     *
     * Always call `Drawer.on(...)` before `Drawer.activate()`.
     * As in:
     * ```js
     * const drawer = new Drawer()
     * drawer.on(event, () => {
     *  // TODO
     * }).activate()
     * ```
     *
     * To prevent modifying the context of `this`, the
     * `drawer.setContext(...)` method should be invoked with an
     * argument which is the `this` context of the
     * `calling class` or alternatively using a wrapper function,
     * then call the main handler method.
     * ```js
     * class UseDrawer {
     *  // CODE
     *  method() {
     *    const drawer = new Drawer()
     *    drawer.on(...)
     *      .setContext(this)
     *      .activate()
     *  }
     * }
     * // OR
     * drawer.on(event, (stateObj) => {
     *  this.handler.call(this, stateObj)
     * }).activate()
     * ```
     *
     * Valid event types taken by this method are:
     * - `start`
     * - `move`
     * - `end`
     * - `threshold`
     * - `belowthreshold`
     * @param {string} event The event type as in the above list
     * @param {Function} fn A function to call when this event triggers
     * @returns {Drawer} Returns a instance of the `Drawer` class
     */
    ;

    _proto.on = function on(event, fn) {
      this._registerCallbacks(event, fn);

      return this;
    };

    _proto.setContext = function setContext(ctx) {
      this.context = ctx;
      this.left.setContext(ctx);
      this.right.setContext(ctx);
      this.up.setContext(ctx);
      this.down.setContext(ctx);
      return this;
    };

    _proto._processThresholdState = function _processThresholdState(state) {
      var thState = state.state[0];
      var rect = state.stateObj.rect;
      delete state.stateObj.rect;
      this.callbacks[thState].call(this.context || this, state.state, state.stateObj, rect);
    };

    _proto._registerCallbacks = function _registerCallbacks(event, fn) {
      var _ref;

      this.callbacks = this.callbacks || (_ref = {}, _ref[START] = def, _ref[MOVE] = def, _ref[END] = def, _ref[THRESHOLD$1] = def, _ref[BELOW_THRESHOLD$1] = def, _ref);

      if (event in this.callbacks) {
        this.callbacks[event] = fn;
      }
    } // private
    ;

    _proto._register = function _register() {
      for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
        handlers[_key] = arguments[_key];
      }

      this.handlers = [].concat(handlers);
    };

    return Drawer;
  }();

  _defineProperty(Drawer, "UP", 0);

  _defineProperty(Drawer, "LEFT", 1);

  _defineProperty(Drawer, "DOWN", 2);

  _defineProperty(Drawer, "RIGHT", 3);

  function def() {
    return false;
  }

  return Drawer;

}));
//# sourceMappingURL=drawer.js.map
