/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-06-01T23:37:49.197Z
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
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../util.js')) :
  typeof define === 'function' && define.amd ? define(['../util.js'], factory) :
  (global = global || self, global.Drawer = factory(global.Util));
}(this, function (util_js) { 'use strict';

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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var Rectangle =
  /*#__PURE__*/
  function () {
    function Rectangle() {
      for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }

      if (paths.length === 4) {
        var x1 = paths[0],
            y1 = paths[1],
            x2 = paths[2],
            y2 = paths[3];
        this.coordsX = {
          x1: x1,
          x2: x2
        };
        this.coordsY = {
          y1: y1,
          y2: y2
        };
      } else if (paths.length === 2) {
        var _paths$ = paths[0],
            _x = _paths$.x1,
            _y = _paths$.y1;
        var _paths$2 = paths[1],
            _x2 = _paths$2.x2,
            _y2 = _paths$2.y2;
        this.coordsX = {
          x1: _x,
          x2: _x2
        };
        this.coordsY = {
          y1: _y,
          y2: _y2
        };
      }
    } // getter


    _createClass(Rectangle, [{
      key: "width",
      get: function get() {
        return Math.abs(this.displacementX);
      }
    }, {
      key: "height",
      get: function get() {
        return Math.abs(this.displacementY);
      }
    }, {
      key: "greaterWidth",
      get: function get() {
        return this.width > this.height;
      }
    }, {
      key: "greaterHeight",
      get: function get() {
        return !this.greaterWidth;
      }
    }]);

    return Rectangle;
  }();

  var VectorRectangle =
  /*#__PURE__*/
  function (_Rectangle) {
    _inheritsLoose(VectorRectangle, _Rectangle);

    // eslint-disable-next-line no-useless-constructor
    function VectorRectangle() {
      for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }

      return _Rectangle.call.apply(_Rectangle, [this].concat(paths)) || this;
    }

    _createClass(VectorRectangle, [{
      key: "displacementX",
      get: function get() {
        return this.coordsX.x2 - this.coordsX.x1;
      }
    }, {
      key: "displacementY",
      get: function get() {
        return this.coordsY.y2 - this.coordsY.y1;
      }
    }, {
      key: "diagonalLength",
      get: function get() {
        if (!this.displacementY) {
          return this.displacementX;
        } else if (!this.displacementX) {
          return this.displacementY;
        }

        return Math.sqrt(Math.pow(this.displacementY, 2) + Math.pow(this.displacementX, 2));
      }
    }]);

    return VectorRectangle;
  }(Rectangle);

  var DIRECTION = 'bottom';
  var DIMENSION = 'dimension';
  var DISPLACEMENT = 'displacement';
  var EVENT_OBJ = 'event';
  var THRESHOLD = 'threshold';
  var BELOW_THRESHOLD = 'belowthreshold';
  var OPEN = 'open';
  var CLOSE = 'close';
  var UNIT = 'px';
  var MAX_START_AREA = 25;
  var THRESHOLD_VALUE = 0.667;
  var FALSE_TOUCH_START_POINT = 2;

  var Bottom =
  /*#__PURE__*/
  function () {
    /**
     * @param {{}} options
     * an object containing all required properties
     * @param {Bound} bound a boundary object
     */
    function Bottom(options, bound) {
      this.options = options;
      this.bound = bound;
      /**
       * Drawer Element
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      /**
       * Size of device window
       * @type {Function}
       */

      this._winSize = this.options.sizeOfWindow || Bottom._windowSize;
      /**
       * @type {number}
       */

      this.winSize = this._winSize();
      /**
       * @type {number}
       */

      this.height = this.options.SIZE;
      this.unit = this.options.unit || UNIT;
      /**
       * @type {number}
       * A minimum area where the draw-start is sensitive
       */

      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA);
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `0` and `1.0`
       * @type {number}
       */

      this.threshold = this.options.threshold || THRESHOLD_VALUE;
      this.threshold = util_js.validateThreshold(this.threshold); // Touch coordinates (Touch Start)

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
      this._context = this;
    }
    /**
     * The `touchstart` event handler for the `Bottom` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Bottom.prototype;

    _proto.start = function start(e, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var WIN_HEIGHT = this.winSize;
      var start = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.startX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.startY = start;
      /**
       * The `Drawer`'s `Bottom` class uses the `CSS property`, `bottom`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(Bottom._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - (WIN_HEIGHT - bound.lower)) + this.unit : "-" + (bound.upper - (WIN_HEIGHT - start)) + this.unit;
      var displacement = "-" + (bound.upper - (WIN_HEIGHT - FALSE_TOUCH_START_POINT)) + this.unit;

      if (start <= WIN_HEIGHT && start >= this.minArea && currentPosition !== util_js.ZERO) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ] = e, _response[DIMENSION] = dimension, _response[DISPLACEMENT] = displacement, _response);
        fn.call(this._context, response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Bottom` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(e, fn) {
      /* eslint complexity: ["error", 25] */
      var WIN_HEIGHT = this.winSize;
      var FALSE_HEIGHT = WIN_HEIGHT - this.bound.upper;
      var resume = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.resumeX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeY = resume;
      var currentPosition = parseFloat(Bottom._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nextAction = this.positionOnStart === util_js.ZERO ? CLOSE : OPEN;
      var start = this.startY;
      var height = bound.upper || this.height;
      /**
       * When the touch doesn't start from the max-height
       * of the element ignore `start` and use `height`
       * as starting point.
       */

      var virtualStart = start < FALSE_HEIGHT ? FALSE_HEIGHT : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `height` is the max dimension, and the `start` can
       * only be less than the `height` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
       * reading from `resume` is subtracted from the `height` to
       * get the accurate position to update the drawer with.
       *
       *
       * **WHY IT IS LIKE THIS `height - (WIN_HEIGHT - resume)`**
       *
       * `WIN_HEIGHT - resume` converts it from a vector to a scalar.
       * Keeping it as a vector makes the dimension inaccurate
       * as the `bottom` property of the `HTMLElement.style` is the one being updated and not the `top`,
       * so the css `bottom` property is an enough respect for its direction.
       *
       * *__If it should be respected then:__*,
       * 1. The `Bottom Drawer class` would be updating `top css property` and not `bottom`, i.e, initialy an element that uses the `Bottom Drawer` must have a `css file` that defines a `css top property` for the element and not a `bottom` property; As in
       * ```scss
       * .menu {
       *   top: // (window size + height of the element)px
       * }
       * ```
       * 2. Cardinal's `Bottom Drawer class` can always update
       * as `HTMLElement.style.top = ${height - resume}px`, and
       * not as it is now.
       * This way there is no `bottom` property respecting the direction
       * So the vector attribute of the dimension is preserved.
       */

      var dimension = "-" + (height - (WIN_HEIGHT - resume)) + this.unit;
      /**
       * Dimension for closing. When the drawer is being closed,
       * the `height` is the max dimension and the `start` could
       * possibly be more than the `height`
       * or less than the `height`.
       * To assure an accurate dimension the `virtualStart`
       * determines whether to use the `height` as starting point
       * or the actual `start`. If the actual start is more than
       * `height`, the height becomes the start point else the `start`
       */

      var vdimension = "-" + (resume - virtualStart) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_HEIGHT && (start >= this.minArea || start >= FALSE_HEIGHT + currentPosition) && currentPosition !== util_js.ZERO && isBoundY && nextAction === OPEN && this.scrollControl && rect.displacementY < util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ] = e, _response2[DIMENSION] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_HEIGHT && Math.abs(currentPosition) < height - bound.lower && isBoundY && nextAction === CLOSE && this.scrollControl && rect.displacementY > util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ] = e, _response4[DIMENSION] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this._context, _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Bottom` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
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
      var WIN_HEIGHT = this.winSize;
      var FALSE_HEIGHT = WIN_HEIGHT - this.bound.upper;
      var end = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.endX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.endY = end;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Bottom._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
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
      }

      this.startX = -1;
      this.startY = -1;
      this.resumeX = -1;
      this.resumeY = -1;
      this.endX = -1;
      this.endY = -1; // OPEN LOGIC

      if (rect.displacementY < util_js.ZERO && (start >= this.minArea || start >= FALSE_HEIGHT + signedOffsetSide)) {
        if (offsetSide <= this.height * threshold) {
          thresholdState.state = [THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementY > util_js.ZERO && this.resumeY >= FALSE_HEIGHT) {
        action = CLOSE;

        if (offsetSide >= this.height * threshold) {
          thresholdState.state = [THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Bottom._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    };

    Bottom._windowSize = function _windowSize() {
      return window.screen.availHeight;
    } // no need for `window.onorientationchange`
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Bottom._windowSize();
      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA);
    };

    return Bottom;
  }();

  var DIRECTION$1 = 'left';
  var DIMENSION$1 = 'dimension';
  var DISPLACEMENT$1 = 'displacement';
  var EVENT_OBJ$1 = 'event';
  var THRESHOLD$1 = 'threshold';
  var BELOW_THRESHOLD$1 = 'belowthreshold';
  var OPEN$1 = 'open';
  var CLOSE$1 = 'close';
  var UNIT$1 = 'px';
  var MAX_START_AREA$1 = 25;
  var THRESHOLD_VALUE$1 = 0.667;
  var FALSE_TOUCH_START_POINT$1 = 2;

  var Left =
  /*#__PURE__*/
  function () {
    /**
     * @param {{}} options
     * an object containing all required properties
     * @param {Bound} bound a boundary object
     */
    function Left(options, bound) {
      this.options = options;
      this.bound = bound;
      /**
       * Drawer Element
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      /**
       * Size of device window
       *
       * unused: required in `Right` and `Bottom`
       * @type {Function}
       */

      this._winSize = this.options.sizeOfWindow || Left._windowSize;
      this.winSize = this._winSize();
      /**
       * @type {number}
       */

      this.width = this.options.SIZE;
      this.unit = this.options.unit || UNIT$1;
      /**
       * @type {number}
       * A maximum area where the draw-start is sensitive
       * Use set boundary (`bound`) if there's an initial
       * offset
       */

      this.maxArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA$1;
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `0` and `1.0`
       * @type {number}
       */

      this.threshold = this.options.threshold || THRESHOLD_VALUE$1;
      this.threshold = util_js.validateThreshold(this.threshold); // Touch coordinates (Touch Start)

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
      this._context = this;
    }
    /**
     * The `touchstart` event handler for the `Left` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
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
       * The `Drawer`'s `Left` class uses the `CSS property`, `left`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION$1].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - start) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$1) + this.unit;

      if (start >= util_js.ZERO && start <= this.maxArea && currentPosition !== util_js.ZERO) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$1] = e, _response[DIMENSION$1] = dimension, _response[DISPLACEMENT$1] = displacement, _response);
        fn.call(this._context, response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Left` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(e, fn) {
      /* eslint complexity: ["error", 25] */
      var resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION$1].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nextAction = this.positionOnStart === util_js.ZERO ? CLOSE$1 : OPEN$1;
      var start = this.startX;
      var width = bound.upper || this.width;
      /**
       * When the touch doesn't start from the max-width
       * of the element ignore `start` and use `width`
       * as starting point.
       */

      var virtualStart = start > width ? width : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `width` is the max dimension, and the `start` can
       * only be less than the `width` (from a range of `0` to
       * `this.maxArea` e.g `0` - `25`), so the current
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
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= util_js.ZERO && (start <= this.maxArea || start <= width + currentPosition) && currentPosition !== util_js.ZERO && isBoundX && nextAction === OPEN$1 && this.scrollControl && rect.displacementX > util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$1] = e, _response2[DIMENSION$1] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume <= width && Math.abs(currentPosition) < width - bound.lower && isBoundX && nextAction === CLOSE$1 && this.scrollControl && rect.displacementX < util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ$1] = e, _response4[DIMENSION$1] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this._context, _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Left` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
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
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Left._getStyle(this.element)[DIRECTION$1].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var width = bound.upper || this.width;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$1; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[EVENT_OBJ$1] = e, _response5.position = signedOffsetSide, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        var opposite = 'oppositeDimension';

        if (state === THRESHOLD$1 && trueForOpen || state === BELOW_THRESHOLD$1 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DIMENSION$1] = zero, _extends2.TIMING = TIMING, _extends2[opposite] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$1 && !trueForOpen || state === BELOW_THRESHOLD$1 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DIMENSION$1] = nonZero, _extends3.TIMING = TIMING, _extends3[opposite] = zero, _extends3), response);
        }

        return {};
      }

      this.startX = -1;
      this.startY = -1;
      this.resumeX = -1;
      this.resumeY = -1;
      this.endX = -1;
      this.endY = -1; // OPEN LOGIC

      if (rect.displacementX > util_js.ZERO && (start <= this.maxArea || start <= width + signedOffsetSide)) {
        if (offsetSide <= this.width * threshold) {
          thresholdState.state = [THRESHOLD$1, CLOSE$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$1, CLOSE$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementX < util_js.ZERO && this.resumeX <= this.width) {
        action = CLOSE$1;

        if (offsetSide >= this.width * threshold) {
          thresholdState.state = [THRESHOLD$1, OPEN$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$1, OPEN$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Left._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    };

    Left._windowSize = function _windowSize() {
      return window.screen.availWidth;
    };

    return Left;
  }();

  var DIRECTION$2 = 'right';
  var DIMENSION$2 = 'dimension';
  var DISPLACEMENT$2 = 'displacement';
  var EVENT_OBJ$2 = 'event';
  var THRESHOLD$2 = 'threshold';
  var BELOW_THRESHOLD$2 = 'belowthreshold';
  var OPEN$2 = 'open';
  var CLOSE$2 = 'close';
  var UNIT$2 = 'px';
  var MAX_START_AREA$2 = 25;
  var THRESHOLD_VALUE$2 = 0.667;
  var FALSE_TOUCH_START_POINT$2 = 2;

  var Right =
  /*#__PURE__*/
  function () {
    /**
     * @param {{}} options
     * an object containing all required properties
     * @param {Bound} bound a boundary object
     */
    function Right(options, bound) {
      this.options = options;
      this.bound = bound;
      /**
       * Drawer Element
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      /**
       * Size of device window
       * @type {Function}
       */

      this._winSize = this.options.sizeOfWindow || Right._windowSize;
      /**
       * @type {number}
       */

      this.winSize = this._winSize();
      /**
       * @type {number}
       */

      this.width = this.options.SIZE;
      this.unit = this.options.unit || UNIT$2;
      /**
       * @type {number}
       * A minimum area where the draw-start is sensitive
       */

      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA$2);
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `0` and `1.0`
       * @type {number}
       */

      this.threshold = this.options.threshold || THRESHOLD_VALUE$2;
      this.threshold = util_js.validateThreshold(this.threshold); // Touch coordinates (Touch Start)

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
      this._context = this;
    }
    /**
     * The `touchstart` event handler for the `Left` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Right.prototype;

    _proto.start = function start(e, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var WIN_WIDTH = this.winSize;
      var start = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.startX = start;
      this.startY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      /**
       * The `Drawer`'s `Right` class uses the `CSS property`, `right`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(Right._getStyle(this.element)[DIRECTION$2].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - (WIN_WIDTH - bound.lower)) + this.unit : "-" + (bound.upper - (WIN_WIDTH - start)) + this.unit;
      var displacement = "-" + (bound.upper - (WIN_WIDTH - FALSE_TOUCH_START_POINT$2)) + this.unit;

      if (start <= WIN_WIDTH && start >= this.minArea && currentPosition !== util_js.ZERO) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$2] = e, _response[DIMENSION$2] = dimension, _response[DISPLACEMENT$2] = displacement, _response);
        fn.call(this._context, response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Right` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(e, fn) {
      /* eslint complexity: ["error", 25] */
      var WIN_WIDTH = this.winSize;
      var FALSE_WIDTH = WIN_WIDTH - this.bound.upper;
      var resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var currentPosition = parseFloat(Right._getStyle(this.element)[DIRECTION$2].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nextAction = this.positionOnStart === util_js.ZERO ? CLOSE$2 : OPEN$2;
      var start = this.startX;
      var width = bound.upper || this.width;
      /**
       * When the touch doesn't start from the max-width
       * of the element ignore `start` and use `width`
       * as starting point.
       */

      var virtualStart = start < FALSE_WIDTH ? FALSE_WIDTH : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `width` is the max dimension, and the `start` can
       * only be less than the `width` (from a range of `0` to `this.maxArea` e.g `0` - `25`), so the current
       * reading from `resume` is subtracted from the `width` to
       * get the accurate position to update the drawer with.
       *
       *
       * **WHY IT IS LIKE THIS `width - (WIN_WIDTH - resume)`**
       *
       * `WIN_WIDTH - resume` converts it from a vector to a scalar.
       * Keeping it as a vector makes the dimension inaccurate
       * as the `right` property of the `HTMLElement.style` is the one being updated and not the `left`,
       * so the css `right` property is an enough respect for its direction.
       *
       * *__If it should be respected then:__*,
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

      var dimension = "-" + (width - (WIN_WIDTH - resume)) + this.unit;
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
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_WIDTH && (start >= this.minArea || start >= FALSE_WIDTH + currentPosition) && currentPosition !== util_js.ZERO && isBoundX && nextAction === OPEN$2 && this.scrollControl && rect.displacementX < util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$2] = e, _response2[DIMENSION$2] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_WIDTH && Math.abs(currentPosition) < width - bound.lower && isBoundX && nextAction === CLOSE$2 && this.scrollControl && rect.displacementX > util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ$2] = e, _response4[DIMENSION$2] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this._context, _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Right` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
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
      var WIN_WIDTH = this.winSize;
      var FALSE_WIDTH = WIN_WIDTH - this.bound.upper;
      var end = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.endX = end;
      this.endY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Right._getStyle(this.element)[DIRECTION$2].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$2; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[EVENT_OBJ$2] = e, _response5.position = signedOffsetSide, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        var opposite = 'oppositeDimension';

        if (state === THRESHOLD$2 && trueForOpen || state === BELOW_THRESHOLD$2 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DIMENSION$2] = zero, _extends2.TIMING = TIMING, _extends2[opposite] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$2 && !trueForOpen || state === BELOW_THRESHOLD$2 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DIMENSION$2] = nonZero, _extends3.TIMING = TIMING, _extends3[opposite] = zero, _extends3), response);
        }

        return {};
      }

      this.startX = -1;
      this.startY = -1;
      this.resumeX = -1;
      this.resumeY = -1;
      this.endX = -1;
      this.endY = -1; // OPEN LOGIC

      if (rect.displacementX < util_js.ZERO && (start >= this.minArea || start >= FALSE_WIDTH + signedOffsetSide)) {
        if (offsetSide <= this.width * threshold) {
          thresholdState.state = [THRESHOLD$2, CLOSE$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$2, CLOSE$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementX > util_js.ZERO && this.resumeX >= FALSE_WIDTH) {
        action = CLOSE$2;

        if (offsetSide >= this.width * threshold) {
          thresholdState.state = [THRESHOLD$2, OPEN$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$2, OPEN$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Right._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    };

    Right._windowSize = function _windowSize() {
      return window.screen.availWidth;
    } // no need for `window.onorientationchange`
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Right._windowSize();
      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA$2);
    };

    return Right;
  }();

  var DIRECTION$3 = 'top';
  var DIMENSION$3 = 'dimension';
  var DISPLACEMENT$3 = 'displacement';
  var EVENT_OBJ$3 = 'event';
  var THRESHOLD$3 = 'threshold';
  var BELOW_THRESHOLD$3 = 'belowthreshold';
  var OPEN$3 = 'open';
  var CLOSE$3 = 'close';
  var UNIT$3 = 'px';
  var MAX_START_AREA$3 = 25;
  var THRESHOLD_VALUE$3 = 0.667;
  var FALSE_TOUCH_START_POINT$3 = 2;

  var Top =
  /*#__PURE__*/
  function () {
    /**
     * @param {{}} options
     * an object containing all required properties
     * @param {Bound} bound a boundary object
     */
    function Top(options, bound) {
      this.options = options;
      this.bound = bound;
      /**
       * Drawer Element
       * @type {HTMLElement}
       */

      this.element = options.ELEMENT;
      /**
       * Size of device window
       *
       * unused: required in `Right` and `Bottom`
       * @type {Function}
       */

      this._winSize = this.options.sizeOfWindow || Top._windowSize;
      this.winSize = this._winSize();
      /**
       * @type {number}
       */

      this.height = this.options.SIZE;
      this.unit = this.options.unit || UNIT$3;
      /**
       * @type {number}
       * A maximum area where the draw-start is sensitive
       * Use set boundary (`bound`) if there's an initial
       * offset
       */

      this.maxArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA$3;
      /**
       * A threshold which the `touchmove` signal must attain
       * before being qualified to stay shown
       * the threshold should be a value between `0` and `1.0`
       * @type {number}
       */

      this.threshold = this.options.threshold || THRESHOLD_VALUE$3;
      this.threshold = util_js.validateThreshold(this.threshold); // Touch coordinates (Touch Start)

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
      this._context = this;
    }
    /**
     * The `touchstart` event handler for the `Top` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Top.prototype;

    _proto.start = function start(e, fn) {
      this.timing.start = new Date();
      var start = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.startX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.startY = start;
      /**
       * The `Drawer`'s `Top` class uses the `CSS property`, `top`
       * for updating and defining position of the drawn element
       */

      var currentPosition = parseFloat(Top._getStyle(this.element)[DIRECTION$3].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - start) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$3) + this.unit;

      if (start >= util_js.ZERO && start <= this.maxArea && currentPosition !== util_js.ZERO) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$3] = e, _response[DIMENSION$3] = dimension, _response[DISPLACEMENT$3] = displacement, _response);
        fn.call(this._context, response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Top` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(e, fn) {
      /* eslint complexity: ["error", 25] */
      var resume = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.resumeX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeY = resume;
      var currentPosition = parseFloat(Top._getStyle(this.element)[DIRECTION$3].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nextAction = this.positionOnStart === util_js.ZERO ? CLOSE$3 : OPEN$3;
      var start = this.startX;
      var height = bound.upper || this.height;
      /**
       * When the touch doesn't start from the max-height
       * of the element ignore `start` and use `height`
       * as starting point.
       */

      var virtualStart = start > height ? height : start;
      /**
       * Dimension for opening. When the drawer is being opened,
       * the `height` is the max dimension, and the `start` can
       * only be less than the `height` (from a range of `0` to
       * `this.maxArea` e.g `0` - `25`), so the current
       * reading from `resume` is subtracted from the `height` to
       * get the accurate position to update the drawer with.
       */

      var dimension = "-" + (height - resume) + this.unit;
      /**
       * Dimension for closing. When the drawer is being closed,
       * the `height` is the max dimension and the `start` could
       * possibly be more than the `height`
       * or less than the `height`.
       * To assure an accurate dimension the `virtualStart`
       * determines whether to use the `height` as starting point
       * or the actual `start`. If the actual start is more than
       * `height`, the height becomes the start point else the `start`
       */

      var vdimension = "-" + (virtualStart - resume) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= util_js.ZERO && (start <= this.maxArea || start <= height + currentPosition) && currentPosition !== util_js.ZERO && isBoundY && nextAction === OPEN$3 && this.scrollControl && rect.displacementY > util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$3] = e, _response2[DIMENSION$3] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume <= this.height && Math.abs(currentPosition) < height - bound.lower && isBoundY && nextAction === CLOSE$3 && this.scrollControl && rect.displacementY < util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ$3] = e, _response4[DIMENSION$3] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this._context, _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Top` drawer `class`
     * @param {TouchEvent} e an event `object`: An event `object`
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
      var end = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      this.endX = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.endY = end;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Top._getStyle(this.element)[DIRECTION$3].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var height = bound.upper || this.height;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$3; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[EVENT_OBJ$3] = e, _response5.position = signedOffsetSide, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        var opposite = 'oppositeDimension';

        if (state === THRESHOLD$3 && trueForOpen || state === BELOW_THRESHOLD$3 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DIMENSION$3] = zero, _extends2.TIMING = TIMING, _extends2[opposite] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$3 && !trueForOpen || state === BELOW_THRESHOLD$3 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DIMENSION$3] = nonZero, _extends3.TIMING = TIMING, _extends3[opposite] = zero, _extends3), response);
        }

        return {};
      }

      this.startX = -1;
      this.startY = -1;
      this.resumeX = -1;
      this.resumeY = -1;
      this.endX = -1;
      this.endY = -1; // OPEN LOGIC

      if (rect.displacementY > util_js.ZERO && (start <= this.maxArea || start <= height + signedOffsetSide)) {
        if (offsetSide <= this.height * threshold) {
          thresholdState.state = [THRESHOLD$3, CLOSE$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$3, CLOSE$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementY < util_js.ZERO && this.resumeY <= this.height) {
        action = CLOSE$3;

        if (offsetSide >= this.height * threshold) {
          thresholdState.state = [THRESHOLD$3, OPEN$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$3, OPEN$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Top._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? window.getComputedStyle(elt, pseudoElt) : window.getComputedStyle(elt);
    };

    Top._windowSize = function _windowSize() {
      return window.screen.availHeight;
    };

    return Top;
  }();

  var BELOW_THRESHOLD$4 = 'belowthreshold';
  var THRESHOLD$4 = 'threshold';
  var START = 'start';
  var MOVE = 'move';
  var END = 'end';
  var CLASS_TYPE = '[object SnappedDrawer]';

  var SnappedDrawer =
  /*#__PURE__*/
  function () {
    /**
     * @param {{}} options an object of configuration options
     * @param {Bound} bound a boundary object
     */
    function SnappedDrawer(options, bound) {
      this._options = options;
      /**
       * @type {HTMLElement}
       */

      this._element = options.ELEMENT;
      this._target = options.TARGET;
      this.events = ['touchstart', 'touchmove', 'touchend'];
      this._handlers = null;
      this._direction = options.DIRECTION;
      this._callibration = null;
      /**
       * @type {{}}
       */

      this._callbacks = null;
      this._context = this;

      this._setCalibration(this._direction, bound);
    } // enum


    var _proto = SnappedDrawer.prototype;

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
      var startfn = this._callbacks ? this._callbacks[START] : def;
      var movefn = this._callbacks ? this._callbacks[MOVE] : def;
      var endfn = this._callbacks ? this._callbacks[END] : def;

      var startHandler = function startHandler(e) {
        if (_this._direction !== null) {
          _this._callibration.start(e, startfn);
        } else {
          _this.deactivate();
        }
      };

      var moveHandler = function moveHandler(e) {
        if (_this._direction !== null) {
          _this._callibration.move(e, movefn);
        } else {
          _this.deactivate();
        }
      };

      var endHandler = function endHandler(e) {
        if (_this._direction !== null) {
          var state = {};

          _this._callibration.end(e, endfn, state); // state by Ref


          _this._processThresholdState(state);
        } else {
          _this.deactivate();
        }
      };

      this._register(startHandler, moveHandler, endHandler);

      for (var i = 0; i < this.events.length; i++) {
        this._target.addEventListener(this.events[i], this._handlers[i]);
      }
    }
    /**
     * A method provided by the `Drawer interface` to deactivate the drawer
     * @returns {void}
     */
    ;

    _proto.deactivate = function deactivate() {
      for (var i = 0; i < this.events.length; i++) {
        this._target.removeEventListener(this.events[i], this._handlers[i]);
      }

      this._register(null);
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
     * @returns {this} Returns an instance variable of the `Drawer` class
     */
    ;

    _proto.on = function on(event, fn) {
      this._registerCallbacks(event, fn);

      return this;
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;

      this._callibration.setContext(ctx);

      return this;
    };

    _proto.toString = function toString() {
      return CLASS_TYPE;
    };

    _proto._processThresholdState = function _processThresholdState(state) {
      if (Object.keys(state).length < 1) {
        return;
      }

      var thState = state.state[0];
      var vector = state.stateObj.rect;
      delete state.stateObj.rect;

      this._callbacks[thState].call(this._context, state.state, state.stateObj, vector);
    };

    _proto._setCalibration = function _setCalibration(point, bound) {
      switch (point) {
        case SnappedDrawer.UP:
          this._callibration = new Top(this._options, bound);
          break;

        case SnappedDrawer.LEFT:
          this._callibration = new Left(this._options, bound);
          break;

        case SnappedDrawer.DOWN:
          this._callibration = new Bottom(this._options, bound);
          break;

        case SnappedDrawer.RIGHT:
          this._callibration = new Right(this._options, bound);
          break;

        default:
          throw RangeError('Direction out of range');
      }
    };

    _proto._registerCallbacks = function _registerCallbacks(event, fn) {
      var _ref;

      this._callbacks = this._callbacks || (_ref = {}, _ref[START] = def, _ref[MOVE] = def, _ref[END] = def, _ref[THRESHOLD$4] = def, _ref[BELOW_THRESHOLD$4] = def, _ref);

      if (event in this._callbacks) {
        this._callbacks[event] = fn;
      }
    } // private
    ;

    _proto._register = function _register() {
      for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
        handlers[_key] = arguments[_key];
      }

      this._handlers = handlers;
    };

    return SnappedDrawer;
  }();

  _defineProperty(SnappedDrawer, "UP", 0);

  _defineProperty(SnappedDrawer, "LEFT", 1);

  _defineProperty(SnappedDrawer, "DOWN", 2);

  _defineProperty(SnappedDrawer, "RIGHT", 3);

  function def() {
    return false;
  }

  var Drawer = function Drawer() {};

  _defineProperty(Drawer, "SnappedDrawer", SnappedDrawer);

  _defineProperty(Drawer, "UP", SnappedDrawer.UP);

  _defineProperty(Drawer, "LEFT", SnappedDrawer.LEFT);

  _defineProperty(Drawer, "DOWN", SnappedDrawer.DOWN);

  _defineProperty(Drawer, "RIGHT", SnappedDrawer.RIGHT);

  return Drawer;

}));
//# sourceMappingURL=drawer.js.map
