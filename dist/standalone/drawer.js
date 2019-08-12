/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-08-12T00:27:59.638Z
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

  var Service =
  /*#__PURE__*/
  function () {
    function Service(event) {
      this._event = event;
    }

    var _proto = Service.prototype;

    _proto.lock = function lock() {
      this._event.stopImmediatePropagation();
    };

    _proto.inhibitSubTask = function inhibitSubTask() {
      this._event.preventDefault();
    };

    return Service;
  }();

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
        return Math.abs(this.coordsX.x2 - this.coordsX.x1);
      }
    }, {
      key: "height",
      get: function get() {
        return Math.abs(this.coordsY.y2 - this.coordsY.y1);
      }
    }, {
      key: "perimeter",
      get: function get() {
        return 2 * (this.width + this.height);
      }
    }, {
      key: "area",
      get: function get() {
        return this.width * this.height;
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
      key: "resultant",
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
      this.threshold = util_js.resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Bottom.prototype;

    _proto.start = function start(touchEvent, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var WIN_HEIGHT = this.winSize;
      var start = touchEvent.changedTouches[0].clientY;
      this.startX = touchEvent.changedTouches[0].clientX;
      this.startY = start;
      /**
       * The `Drawer`'s `Bottom` class uses the `CSS property`, `bottom`
       * for updating and defining position of the drawn element
       */

      var currentPosition = util_js.offsetBottom(this.element);
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - (WIN_HEIGHT - start)) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT) + this.unit;

      if (start <= WIN_HEIGHT && start >= this.minArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[util_js.DrawerResponseInterface.position] = currentPosition, _response[util_js.DrawerResponseInterface.dimension] = dimension, _response[util_js.DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Bottom` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(touchEvent, fn) {
      /* eslint complexity: ["error", 25] */
      var WIN_HEIGHT = this.winSize;
      var FALSE_HEIGHT = WIN_HEIGHT - this.bound.upper; // should be `-this.positionOnStart`

      var resume = touchEvent.changedTouches[0].clientY;
      this.resumeX = touchEvent.changedTouches[0].clientX;
      this.resumeY = resume;
      var currentPosition = util_js.offsetBottom(this.element);
      var bound = this.bound; // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

      var start = this.startY; // const height = bound.upper || this.height

      /**
       * When the touch doesn't start from the max-height
       * of the element ignore `start` and use `height`
       * as starting point.
       */

      var virtualStart = start < FALSE_HEIGHT ? FALSE_HEIGHT : start;
      var dimension = "" + (start - resume + this.positionOnStart) + this.unit; // const dimension = `-${height - bound.lower - (WIN_HEIGHT - resume)}${this.unit}`

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

      var vdimension = "-" + (-virtualStart + resume - this.positionOnStart) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_HEIGHT && (start >= this.minArea || start >= FALSE_HEIGHT - currentPosition) && currentPosition < util_js.ZERO && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY < util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[util_js.DrawerResponseInterface.position] = currentPosition, _response2[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[util_js.DrawerResponseInterface.dimension] = dimension, _response2[util_js.DrawerResponseInterface.open] = true, _response2[util_js.DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_HEIGHT && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY > util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[util_js.DrawerResponseInterface.position] = currentPosition, _response4[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[util_js.DrawerResponseInterface.dimension] = vdimension, _response4[util_js.DrawerResponseInterface.close] = true, _response4[util_js.DrawerResponseInterface.open] = false, _response4);

        fn.call(this._context, new Service(touchEvent), _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Bottom` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchend` event.
     * @param {Function} fn - a callback function called when the `end`
     * event is triggered
     * @param {{}} thresholdState - a state object which should be passed
     * by reference for updating by this method
     * @returns {void}
     */
    ;

    _proto.end = function end(touchEvent, fn, thresholdState) {
      var _response5;

      this.timing.end = new Date();
      var WIN_HEIGHT = this.winSize;
      var FALSE_HEIGHT = WIN_HEIGHT - this.bound.upper;
      var end = touchEvent.changedTouches[0].clientY;
      this.endX = touchEvent.changedTouches[0].clientX;
      this.endY = end;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = util_js.offsetBottom(this.element);
      var bound = this.bound;
      var customBound = new util_js.Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var height = bound.upper || this.height;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[util_js.DrawerResponseInterface.position] = signedOffsetSide, _response5[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD && trueForOpen || state === BELOW_THRESHOLD && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[util_js.DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[util_js.DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD && !trueForOpen || state === BELOW_THRESHOLD && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[util_js.DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[util_js.DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementY <= util_js.ZERO && (start >= this.minArea || start >= FALSE_HEIGHT - signedOffsetSide)) {
        /**
         * Threshold resolution is done here to get the original
         * set value of the threshold before the first resolution
         * Here it's the original value of threshold needed, if
         * it was a legal value.
         * value = 0.75
         * value = resolve(value) => 0.25
         * resolve(value) => 0.75
         */
        if (rect.height >= customBound.gap * util_js.resolveThreshold(threshold)) {
          thresholdState.state = [THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementY >= util_js.ZERO && this.resumeY >= FALSE_HEIGHT) {
        action = CLOSE;

        if (offsetSide >= height * threshold) {
          thresholdState.state = [THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD, OPEN];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Bottom._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? util_js.WINDOW.getComputedStyle(elt, pseudoElt) : util_js.WINDOW.getComputedStyle(elt);
    };

    Bottom._windowSize = function _windowSize() {
      return util_js.WINDOW.screen.height;
    } // no need for `window.onorientationchange`
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Bottom._windowSize();
      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA);
    };

    return Bottom;
  }();

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
      this.threshold = util_js.resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Left.prototype;

    _proto.start = function start(touchEvent, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var start = touchEvent.changedTouches[0].clientX;
      this.startX = start;
      this.startY = touchEvent.changedTouches[0].clientY;
      /**
       * The `Drawer`'s `Left` class uses the `CSS property`, `left`
       * for updating and defining position of the drawn element
       */

      var currentPosition = this.element.offsetLeft;
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - start) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$1) + this.unit;

      if (start >= util_js.ZERO && start <= this.maxArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[util_js.DrawerResponseInterface.position] = currentPosition, _response[util_js.DrawerResponseInterface.dimension] = dimension, _response[util_js.DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Left` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(touchEvent, fn) {
      /* eslint complexity: ["error", 25] */
      var resume = touchEvent.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = touchEvent.changedTouches[0].clientY;
      var currentPosition = this.element.offsetLeft;
      var bound = this.bound; // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

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

      var dimension = "" + (-start + resume + this.positionOnStart) + this.unit; // const dimension = `-${width - bound.lower - resume}${this.unit}`

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

      var vdimension = "-" + (virtualStart - resume - this.positionOnStart) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= util_js.ZERO && (start <= this.maxArea || start <= width + currentPosition) && currentPosition < util_js.ZERO && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX > util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[util_js.DrawerResponseInterface.position] = currentPosition, _response2[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[util_js.DrawerResponseInterface.dimension] = dimension, _response2[util_js.DrawerResponseInterface.open] = true, _response2[util_js.DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume <= width && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX < util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[util_js.DrawerResponseInterface.position] = currentPosition, _response4[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[util_js.DrawerResponseInterface.dimension] = vdimension, _response4[util_js.DrawerResponseInterface.close] = true, _response4[util_js.DrawerResponseInterface.open] = false, _response4);

        fn.call(this._context, new Service(touchEvent), _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Left` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchend` event.
     * @param {Function} fn - a callback function called when the `end`
     * event is triggered
     * @param {{}} thresholdState - a state object which should be passed
     * by reference for updating by this method
     * @returns {void}
     */
    ;

    _proto.end = function end(touchEvent, fn, thresholdState) {
      var _response5;

      this.timing.end = new Date();
      var end = touchEvent.changedTouches[0].clientX;
      this.endX = end;
      this.endY = touchEvent.changedTouches[0].clientY;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = this.element.offsetLeft;
      var bound = this.bound;
      var customBound = new util_js.Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var width = bound.upper || this.width;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$1; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[util_js.DrawerResponseInterface.position] = signedOffsetSide, _response5[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$1 && trueForOpen || state === BELOW_THRESHOLD$1 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[util_js.DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[util_js.DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$1 && !trueForOpen || state === BELOW_THRESHOLD$1 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[util_js.DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[util_js.DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementX >= util_js.ZERO && (start <= this.maxArea || start <= width + signedOffsetSide)) {
        if (rect.width >= customBound.gap * util_js.resolveThreshold(threshold)) {
          thresholdState.state = [THRESHOLD$1, CLOSE$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$1, CLOSE$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementX <= util_js.ZERO && this.resumeX <= width) {
        action = CLOSE$1;

        if (offsetSide >= width * threshold) {
          thresholdState.state = [THRESHOLD$1, OPEN$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$1, OPEN$1];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Left._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? util_js.WINDOW.getComputedStyle(elt, pseudoElt) : util_js.WINDOW.getComputedStyle(elt);
    };

    Left._windowSize = function _windowSize() {
      return util_js.WINDOW.screen.width;
    } // window size is not needed here; at least not yet
    // the major purpose of this is to update bound dependents
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Left._windowSize();
      this.minArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA$1;
    };

    return Left;
  }();

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
      this.threshold = util_js.resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Right.prototype;

    _proto.start = function start(touchEvent, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var WIN_WIDTH = this.winSize;
      var start = touchEvent.changedTouches[0].clientX;
      this.startX = start;
      this.startY = touchEvent.changedTouches[0].clientY;
      /**
       * The `Drawer`'s `Right` class uses the `CSS property`, `right`
       * for updating and defining position of the drawn element
       */

      var currentPosition = util_js.offsetRight(this.element);
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - (WIN_WIDTH - start)) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$2) + this.unit;

      if (start <= WIN_WIDTH && start >= this.minArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[util_js.DrawerResponseInterface.position] = currentPosition, _response[util_js.DrawerResponseInterface.dimension] = dimension, _response[util_js.DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Right` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(touchEvent, fn) {
      /* eslint complexity: ["error", 25] */
      var WIN_WIDTH = this.winSize;
      var FALSE_WIDTH = WIN_WIDTH - this.bound.upper;
      var resume = touchEvent.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = touchEvent.changedTouches[0].clientY;
      var currentPosition = util_js.offsetRight(this.element);
      var bound = this.bound; // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

      var start = this.startX; // const width = bound.upper || this.width

      /**
       * When the touch doesn't start from the max-width
       * of the element ignore `start` and use `width`
       * as starting point.
       */

      var virtualStart = start < FALSE_WIDTH ? FALSE_WIDTH : start;
      var dimension = "" + (start - resume + this.positionOnStart) + this.unit; // const dimension = `-${width - bound.lower - (WIN_WIDTH - resume)}${this.unit}`

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

      var vdimension = "-" + (-virtualStart + resume - this.positionOnStart) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_WIDTH && (start >= this.minArea || start >= FALSE_WIDTH - currentPosition) && currentPosition < util_js.ZERO && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX < util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[util_js.DrawerResponseInterface.position] = currentPosition, _response2[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[util_js.DrawerResponseInterface.dimension] = dimension, _response2[util_js.DrawerResponseInterface.open] = true, _response2[util_js.DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_WIDTH && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX > util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[util_js.DrawerResponseInterface.position] = currentPosition, _response4[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[util_js.DrawerResponseInterface.dimension] = vdimension, _response4[util_js.DrawerResponseInterface.close] = true, _response4[util_js.DrawerResponseInterface.open] = false, _response4);

        fn.call(this._context, new Service(touchEvent), _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Right` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchend` event.
     * @param {Function} fn - a callback function called when the `end`
     * event is triggered
     * @param {{}} thresholdState - a state object which should be passed
     * by reference for updating by this method
     * @returns {void}
     */
    ;

    _proto.end = function end(touchEvent, fn, thresholdState) {
      var _response5;

      this.timing.end = new Date();
      var WIN_WIDTH = this.winSize;
      var FALSE_WIDTH = WIN_WIDTH - this.bound.upper;
      var end = touchEvent.changedTouches[0].clientX;
      this.endX = end;
      this.endY = touchEvent.changedTouches[0].clientY;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = util_js.offsetRight(this.element);
      var bound = this.bound;
      var customBound = new util_js.Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var width = bound.upper || this.width;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$2; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[util_js.DrawerResponseInterface.position] = signedOffsetSide, _response5[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$2 && trueForOpen || state === BELOW_THRESHOLD$2 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[util_js.DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[util_js.DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$2 && !trueForOpen || state === BELOW_THRESHOLD$2 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[util_js.DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[util_js.DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementX <= util_js.ZERO && (start >= this.minArea || start >= FALSE_WIDTH - signedOffsetSide)) {
        if (rect.width >= customBound.gap * util_js.resolveThreshold(threshold)) {
          thresholdState.state = [THRESHOLD$2, CLOSE$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$2, CLOSE$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementX >= util_js.ZERO && this.resumeX >= FALSE_WIDTH) {
        action = CLOSE$2;

        if (offsetSide >= width * threshold) {
          thresholdState.state = [THRESHOLD$2, OPEN$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$2, OPEN$2];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Right._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? util_js.WINDOW.getComputedStyle(elt, pseudoElt) : util_js.WINDOW.getComputedStyle(elt);
    };

    Right._windowSize = function _windowSize() {
      return util_js.WINDOW.screen.width;
    } // no need for `window.onorientationchange`
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Right._windowSize();
      this.minArea = this.winSize - (this.bound.lower || this.options.maxStartArea || MAX_START_AREA$2);
    };

    return Right;
  }();

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
      this.threshold = util_js.resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchstart` event.
     * @param {Function} fn - a callback function called when the `start`
     * event is triggered
     * @returns {void}
     */


    var _proto = Top.prototype;

    _proto.start = function start(touchEvent, fn) {
      this.timing.start = new Date();

      this._updateOrientation();

      var start = touchEvent.changedTouches[0].clientY;
      this.startX = touchEvent.changedTouches[0].clientX;
      this.startY = start;
      /**
       * The `Drawer`'s `Top` class uses the `CSS property`, `top`
       * for updating and defining position of the drawn element
       */

      var currentPosition = this.element.offsetTop;
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - start) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$3) + this.unit;
      var maxArea = bound.lower || this.minArea;

      if (start >= util_js.ZERO && start <= maxArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[util_js.DrawerResponseInterface.position] = currentPosition, _response[util_js.DrawerResponseInterface.dimension] = dimension, _response[util_js.DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new util_js.Path(this.startX, this.startY));
      }
    }
    /**
     * The `touchmove` event handler for the `Top` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchmove` event.
     * @param {Function} fn - a callback function called when the `move`
     * event is triggered
     * @returns {void}
     */
    ;

    _proto.move = function move(touchEvent, fn) {
      /* eslint complexity: ["error", 25] */
      var resume = touchEvent.changedTouches[0].clientY;
      this.resumeX = touchEvent.changedTouches[0].clientX;
      this.resumeY = resume;
      var currentPosition = this.element.offsetTop;
      var bound = this.bound; // const nextAction = this.positionOnStart === ZERO ? CLOSE : OPEN

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

      var dimension = "" + (-start + resume + this.positionOnStart) + this.unit; // const dimension = `-${height - bound.lower - resume}${this.unit}`

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

      var vdimension = "-" + (virtualStart - resume - this.positionOnStart) + this.unit;
      var rect = new VectorRectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= util_js.ZERO && (start <= this.maxArea || start <= height + currentPosition) && currentPosition < util_js.ZERO && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY > util_js.ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[util_js.DrawerResponseInterface.position] = currentPosition, _response2[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[util_js.DrawerResponseInterface.dimension] = dimension, _response2[util_js.DrawerResponseInterface.open] = true, _response2[util_js.DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume <= this.height && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY < util_js.ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[util_js.DrawerResponseInterface.position] = currentPosition, _response4[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[util_js.DrawerResponseInterface.dimension] = vdimension, _response4[util_js.DrawerResponseInterface.close] = true, _response4[util_js.DrawerResponseInterface.open] = false, _response4);

        fn.call(this._context, new Service(touchEvent), _response3, rect);
      }
    }
    /**
     * The `touchend` event handler for the `Top` drawer `class`
     * @param {TouchEvent} touchEvent an event `object`: An event `object`
     * representing an `object` of all `properties` related
     * to the `touchend` event.
     * @param {Function} fn - a callback function called when the `end`
     * event is triggered
     * @param {{}} thresholdState - a state object which should be passed
     * by reference for updating by this method
     * @returns {void}
     */
    ;

    _proto.end = function end(touchEvent, fn, thresholdState) {
      var _response5;

      this.timing.end = new Date();
      var end = touchEvent.changedTouches[0].clientY;
      this.endX = touchEvent.changedTouches[0].clientX;
      this.endY = end;
      var rect = new VectorRectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = this.element.offsetTop;
      var bound = this.bound;
      var customBound = new util_js.Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + util_js.ZERO;
      var height = bound.upper || this.height;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$3; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[util_js.DrawerResponseInterface.position] = signedOffsetSide, _response5[util_js.DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$3 && trueForOpen || state === BELOW_THRESHOLD$3 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[util_js.DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[util_js.DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$3 && !trueForOpen || state === BELOW_THRESHOLD$3 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[util_js.DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[util_js.DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementY >= util_js.ZERO && (start <= this.maxArea || start <= height + signedOffsetSide)) {
        if (rect.height >= customBound.gap * util_js.resolveThreshold(threshold)) {
          thresholdState.state = [THRESHOLD$3, CLOSE$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$3, CLOSE$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (rect.displacementY <= util_js.ZERO && this.resumeY <= height) {
        action = CLOSE$3;

        if (offsetSide >= height * threshold) {
          thresholdState.state = [THRESHOLD$3, OPEN$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        } else {
          thresholdState.state = [BELOW_THRESHOLD$3, OPEN$3];
          thresholdState.stateObj = getResponse(thresholdState.state[0], false);
        }

        thresholdState.service = new Service(touchEvent);
        fn.call(this, action);
      }
    };

    _proto.setContext = function setContext(ctx) {
      this._context = ctx;
      return this;
    };

    Top._getStyle = function _getStyle(elt, pseudoElt) {
      return pseudoElt ? util_js.WINDOW.getComputedStyle(elt, pseudoElt) : util_js.WINDOW.getComputedStyle(elt);
    };

    Top._windowSize = function _windowSize() {
      return util_js.WINDOW.screen.height;
    } // window size is not need here; at least not yet
    // the major purpose of this is to update bound dependents
    ;

    _proto._updateOrientation = function _updateOrientation() {
      this.winSize = typeof this._winSize === 'function' ? this._winSize() : Top._windowSize();
      this.minArea = this.bound.lower || this.options.maxStartArea || MAX_START_AREA$3;
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
     * @param {{}} drawerManager an object that helps manage drawers
     * especially when more than one drawer service is running
     */
    function SnappedDrawer(options, bound, drawerManager) {
      this._options = options;
      this._drawerManager = drawerManager;
      this._element = options.ELEMENT;
      this._target = options.TARGET;
      this._handlers = null;
      this._direction = options.DIRECTION;
      this._calibration = null;
      this._callbacks = null;
      this._context = this;
      this._id = 0;
      this.events = ['touchstart', 'touchmove', 'touchend'];

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

      var startHandler = function startHandler(touchEvent) {
        var activity = _this._drawerManager.getRunningActivity();

        if (_this._calibration && (_this._id && activity && activity.id === _this._id || !activity && _this._isCoolSignal(_this._getSignal(touchEvent)))) {
          _this._calibration.start(touchEvent, startfn);
        }
      };

      var moveHandler = function moveHandler(touchEvent) {
        var activity = _this._drawerManager.getRunningActivity();

        if (_this._calibration && activity && activity.id === _this._id) {
          _this._calibration.move(touchEvent, movefn);
        }
      };

      var endHandler = function endHandler(touchEvent) {
        var activity = _this._drawerManager.getRunningActivity();

        if (_this._calibration && activity && activity.id === _this._id) {
          var state = {};

          _this._calibration.end(touchEvent, endfn, state); // state by Ref


          _this._processThresholdState(state);
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
     * A method used to register callbacks for the `Drawer class` `touchstart`,
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

      this._calibration.setContext(ctx);

      return this;
    };

    _proto.setServiceID = function setServiceID(id) {
      if (typeof id !== 'number') {
        throw new TypeError('expected `id` to be a unique number');
      }

      this._id = id;
    };

    _proto.toString = function toString() {
      return CLASS_TYPE;
    };

    _proto._processThresholdState = function _processThresholdState(state) {
      if (Object.keys(state).length < 1) {
        return;
      }

      var stateArray = state.state,
          stateObj = state.stateObj,
          service = state.service;
      var rect = stateObj.rect;

      this._callbacks[stateArray[0]].call(this._context, service, stateArray, stateObj, rect);
    };

    _proto._setCalibration = function _setCalibration(point, bound) {
      switch (point) {
        case SnappedDrawer.UP:
          this._calibration = new Top(this._options, bound);
          break;

        case SnappedDrawer.LEFT:
          this._calibration = new Left(this._options, bound);
          break;

        case SnappedDrawer.DOWN:
          this._calibration = new Bottom(this._options, bound);
          break;

        case SnappedDrawer.RIGHT:
          this._calibration = new Right(this._options, bound);
          break;

        default:
          throw RangeError('Direction out of range');
      }
    };

    _proto._isCoolSignal = function _isCoolSignal(signal) {
      var size = this._direction === SnappedDrawer.UP || this._direction === SnappedDrawer.DOWN ? util_js.WINDOW.screen.height : util_js.WINDOW.screen.width;

      switch (this._direction) {
        case SnappedDrawer.UP:
        case SnappedDrawer.LEFT:
          return signal <= size / 2;

        case SnappedDrawer.RIGHT:
        case SnappedDrawer.DOWN:
          return signal > size / 2;

        default:
          return false;
      }
    };

    _proto._getSignal = function _getSignal(emitter) {
      switch (this._direction) {
        case SnappedDrawer.UP:
        case SnappedDrawer.DOWN:
          return emitter.changedTouches[0].clientY;

        case SnappedDrawer.LEFT:
        case SnappedDrawer.RIGHT:
          return emitter.changedTouches[0].clientX;

        default:
          return null;
      }
    };

    _proto._registerCallbacks = function _registerCallbacks(event, fn) {
      var _ref;

      this._callbacks = this._callbacks || (_ref = {}, _ref[START] = def, _ref[MOVE] = def, _ref[END] = def, _ref[THRESHOLD$4] = def, _ref[BELOW_THRESHOLD$4] = def, _ref);

      if (event in this._callbacks) {
        this._callbacks[event] = fn;
      }
    };

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

  var DrawerManagementStore =
  /*#__PURE__*/
  function () {
    function DrawerManagementStore() {
      this.activities = [];
    }

    var _proto = DrawerManagementStore.prototype;

    _proto.pushActivity = function pushActivity(activity) {
      this.activities.push(activity);
    };

    _proto.getRunningActivity = function getRunningActivity() {
      return this.activities.find(function (activity) {
        return activity.isRunning();
      });
    };

    return DrawerManagementStore;
  }();

  var Drawer = function Drawer() {};

  _defineProperty(Drawer, "SnappedDrawer", SnappedDrawer);

  _defineProperty(Drawer, "UP", SnappedDrawer.UP);

  _defineProperty(Drawer, "LEFT", SnappedDrawer.LEFT);

  _defineProperty(Drawer, "DOWN", SnappedDrawer.DOWN);

  _defineProperty(Drawer, "RIGHT", SnappedDrawer.RIGHT);

  _defineProperty(Drawer, "DrawerManagementStore", new DrawerManagementStore());

  return Drawer;

}));
//# sourceMappingURL=drawer.js.map
