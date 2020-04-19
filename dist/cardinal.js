/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-08-17T23:09:34.883Z
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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Cardinal = {}));
}(this, function (exports) { 'use strict';

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

  // constants
  var BLUR_SPREAD_SHADE = '0.7rem 0 rgba(0,0,0,.3)';
  var NAV_BOX_SHADOW = {
    top: "0 0.2rem " + BLUR_SPREAD_SHADE,
    left: "0.2rem 0 " + BLUR_SPREAD_SHADE,
    bottom: "0 -0.2rem " + BLUR_SPREAD_SHADE,
    right: "-0.2rem 0 " + BLUR_SPREAD_SHADE
  };
  var ZERO = 0;
  var DIRECTIONS = ['top', 'left', 'bottom', 'right'];
  var NAVSTATE_EVENTS = {
    show: 'show',
    hide: 'hide'
  };
  var DrawerResponseInterface = {
    position: 'position',
    posOnStart: 'posOnStart',
    dimension: 'dimension',
    displacement: 'displacement',
    oppositeDimension: 'oppositeDimension',
    close: 'closing',
    open: 'opening'
  };
  var WINDOW = window; // classes

  var Path =
  /*#__PURE__*/
  function () {
    function Path(x, y) {
      this.x = x;
      this.y = y;
    }
    /**
     * Get difference between two paths
     * @param {Path} path1 Path Object
     * @param {Path} path2 Path Object
     * @returns {Path} A different Path
     */


    Path.pathDifference = function pathDifference(path1, path2) {
      var x = path1.x - path2.x;
      var y = path1.y - path2.y;
      return new Path(x, y);
    }
    /**
     * Join two different paths
     * @param {Path} path1 Path Object
     * @param {Path} path2 Path Object
     * @returns {Path} A joined Path
     */
    ;

    Path.join = function join(path1, path2) {
      var x = path1.x + path2.x;
      var y = path1.y + path2.y;
      return new Path(x, y);
    };

    return Path;
  }();
  var Bound =
  /*#__PURE__*/
  function () {
    function Bound(lower, upper) {
      this.lower = lower;
      this.upper = upper;
    }

    _createClass(Bound, [{
      key: "gap",
      get: function get() {
        return this.upper - this.lower;
      }
    }, {
      key: "slack",
      get: function get() {
        return this.lower - this.upper;
      }
    }]);

    return Bound;
  }();
  var ActivityManager =
  /*#__PURE__*/
  function () {
    function ActivityManager(activity) {
      this.activity = activity;
      this.running = false;
      this.id = Date.now();
    }

    var _proto = ActivityManager.prototype;

    _proto.run = function run() {
      this.running = true;
    };

    _proto.derun = function derun() {
      this.running = false;
    };

    _proto.isRunning = function isRunning() {
      return this.running;
    };

    return ActivityManager;
  }(); // functions

  function dataCamelCase(data) {
    // remove 'data-' prefix and return camelCase string
    return camelCase(data.substring(5), '-');
  }
  function camelCase(data, delim) {
    if (delim === void 0) {
      delim = '-';
    }

    var list = data instanceof Array ? data : data.split(delim);
    return list.reduce(function (acc, cur) {
      return acc + cur.charAt(0).toUpperCase() + cur.slice(1);
    });
  }
  function unique(max) {
    if (max === void 0) {
      max = 1;
    }

    return Math.floor(Math.random() * max);
  }
  function $(query) {
    return document.querySelectorAll(query)[0];
  }
  function getAttribute(el, attr) {
    return el.getAttribute(attr);
  }
  function hasAttribute(el, attr) {
    return el.hasAttribute(attr);
  }
  function setAttribute(el, attr, value) {
    el.setAttribute(attr, value);
  }
  function getData(el, dataName) {
    var prop = dataCamelCase(dataName); // this may return `undefined` in some Safari

    if (el.dataset && el.dataset[prop]) {
      return el.dataset[prop];
    }

    return getAttribute(el, dataName.substring(5));
  }
  function offsetRight(el) {
    return WINDOW.screen.width - el.offsetLeft - el.offsetWidth;
  }
  function offsetBottom(el) {
    return WINDOW.screen.height - el.offsetTop - el.offsetHeight;
  }
  function resolveThreshold(threshold) {
    var MAX_THRESHOLD = 1;
    var MIN_ILLEGAL_THRESHOLD = 0;

    if (threshold < MAX_THRESHOLD && threshold > MIN_ILLEGAL_THRESHOLD) {
      threshold = MAX_THRESHOLD - threshold;
      return threshold;
    } else if (threshold < MIN_ILLEGAL_THRESHOLD) {
      threshold = MAX_THRESHOLD;
      return threshold;
    }

    return MAX_THRESHOLD;
  }
  /**
   * @param {HTMLElement} el an HTMLElement whose style should
   * be accessed
   * @param {string | string[] | {}} property A property/properties
   * to set or get
   * @param {string | number} value value to set as
   * @returns {CSSStyleDeclaration | string} A css style property
   * or CSSStyleDeclaration object
   */

  function css() {
    if (arguments.length < 1) {
      return null;
    }

    var el = arguments.length <= 0 ? undefined : arguments[0];
    var property = arguments.length <= 1 ? undefined : arguments[1];
    var value = arguments.length <= 2 ? undefined : arguments[2];
    var STYLEMAP = WINDOW.getComputedStyle(el);

    if (typeof property === 'string' && value) {
      // setting one property
      el.style[property] = value;
      return null;
    }

    if (typeof property === 'object' && property instanceof Object) {
      // `style` MUST = null
      // setting many properties
      value = property;

      var _arr = Object.keys(value);

      for (var _i = 0; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        el.style[prop] = value[prop];
      }

      return null;
    } else if (Array.isArray(property)) {
      // return all values of properties in the array for
      // the element as object
      var ostyle = {};

      for (var _iterator = STYLEMAP, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var _prop = _ref;
        ostyle[_prop] = STYLEMAP[_prop];
      }

      return ostyle;
    } else if (typeof property === 'string') {
      // get value of property
      return STYLEMAP[property];
    }

    return STYLEMAP;
  }

  var POINT_ANGLE = 360;
  var PI = Math.PI;
  var RAD = PI / (POINT_ANGLE >> 1);
  var Circle =
  /*#__PURE__*/
  function () {
    function Circle(radius) {
      this.radius = radius;
      this.diameter = this.radius * 2;
    }

    var _proto = Circle.prototype;

    _proto.areaOfSect = function areaOfSect(angle) {
      angle *= RAD;
      return angle / POINT_ANGLE * this.area;
    };

    _proto.arc = function arc(angle) {
      angle *= RAD;
      return angle / POINT_ANGLE * this.circumference;
    };

    _createClass(Circle, [{
      key: "area",
      get: function get() {
        return PI * Math.pow(this.radius, 2);
      }
    }, {
      key: "circumference",
      get: function get() {
        return 2 * PI * this.radius;
      }
    }]);

    return Circle;
  }();

  var DEG = 1 / RAD;
  /**
   * Enum of all quadrants from first to fourth.
   * The quadrant is not a usual one; it starts from the 12th
   * hand of the clock and moves anti-clockwise
   * @enum {number}
   * @const
   */

  var Quadrant = {
    FIRST: 360,
    SECOND: 90,
    THIRD: 180,
    FOURTH: 270
  };

  var CircularPath =
  /*#__PURE__*/
  function (_Circle) {
    _inheritsLoose(CircularPath, _Circle);

    function CircularPath(radius) {
      var _this;

      _this = _Circle.call(this, radius) || this;

      for (var _len = arguments.length, angles = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        angles[_key - 1] = arguments[_key];
      }

      _this._angles = angles;
      _this.angles = angles.map(function (value) {
        return _this._degToRad(value);
      });
      _this._quad = null;
      return _this;
    }

    var _proto = CircularPath.prototype;

    // private
    _proto._degToRad = function _degToRad(deg) {
      return RAD * deg;
    };

    _proto._radToDeg = function _radToDeg(rad) {
      return DEG * rad;
    };

    _proto._findPath = function _findPath(angle) {
      // const quad = this.getQuadrant(DEG_ANGLE)
      return [parseFloat((this.radius * Math.cos(angle)).toFixed(3)), parseFloat((this.radius * Math.sin(angle)).toFixed(3))];
    };

    _proto.getQuadrant = function getQuadrant(angle) {
      if (angle <= Quadrant.FIRST) {
        return Quadrant.FIRST;
      } else if (angle <= Quadrant.SECOND && angle > Quadrant.FIRST) {
        return Quadrant.SECOND;
      } else if (angle <= Quadrant.THIRD && angle > Quadrant.SECOND) {
        return Quadrant.THIRD;
      } else if (angle <= Quadrant.FOURTH && angle > Quadrant.THIRD) {
        return Quadrant.FOURTH;
      }

      throw RangeError('Quadrant out of range');
    };

    _createClass(CircularPath, [{
      key: "paths",
      get: function get() {
        var _this2 = this;

        /**
         * @type {Path[]}
         */
        var out = [];
        this.angles.forEach(function (value) {
          var _this2$_findPath = _this2._findPath(value),
              x = _this2$_findPath[0],
              y = _this2$_findPath[1];

          out.push(new Path(x, y));
        });
        return out;
      }
    }]);

    return CircularPath;
  }(Circle);

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
      this.threshold = resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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

      var currentPosition = offsetBottom(this.element);
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - (WIN_HEIGHT - start)) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT) + this.unit;

      if (start <= WIN_HEIGHT && start >= this.minArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[DrawerResponseInterface.position] = currentPosition, _response[DrawerResponseInterface.dimension] = dimension, _response[DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY));
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
      var currentPosition = offsetBottom(this.element);
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


      if (start <= WIN_HEIGHT && (start >= this.minArea || start >= FALSE_HEIGHT - currentPosition) && currentPosition < ZERO && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY < ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[DrawerResponseInterface.position] = currentPosition, _response2[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[DrawerResponseInterface.dimension] = dimension, _response2[DrawerResponseInterface.open] = true, _response2[DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_HEIGHT && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY > ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[DrawerResponseInterface.position] = currentPosition, _response4[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[DrawerResponseInterface.dimension] = vdimension, _response4[DrawerResponseInterface.close] = true, _response4[DrawerResponseInterface.open] = false, _response4);

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
      var signedOffsetSide = offsetBottom(this.element);
      var bound = this.bound;
      var customBound = new Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO;
      var height = bound.upper || this.height;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[DrawerResponseInterface.position] = signedOffsetSide, _response5[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD && trueForOpen || state === BELOW_THRESHOLD && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD && !trueForOpen || state === BELOW_THRESHOLD && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementY <= ZERO && (start >= this.minArea || start >= FALSE_HEIGHT - signedOffsetSide)) {
        /**
         * Threshold resolution is done here to get the original
         * set value of the threshold before the first resolution
         * Here it's the original value of threshold needed, if
         * it was a legal value.
         * value = 0.75
         * value = resolve(value) => 0.25
         * resolve(value) => 0.75
         */
        if (rect.height >= customBound.gap * resolveThreshold(threshold)) {
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


      if (rect.displacementY >= ZERO && this.resumeY >= FALSE_HEIGHT) {
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
      return pseudoElt ? WINDOW.getComputedStyle(elt, pseudoElt) : WINDOW.getComputedStyle(elt);
    };

    Bottom._windowSize = function _windowSize() {
      return WINDOW.screen.height;
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
      this.threshold = resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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

      if (start >= ZERO && start <= this.maxArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[DrawerResponseInterface.position] = currentPosition, _response[DrawerResponseInterface.dimension] = dimension, _response[DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY));
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


      if (start >= ZERO && (start <= this.maxArea || start <= width + currentPosition) && currentPosition < ZERO && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX > ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[DrawerResponseInterface.position] = currentPosition, _response2[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[DrawerResponseInterface.dimension] = dimension, _response2[DrawerResponseInterface.open] = true, _response2[DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume <= width && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX < ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[DrawerResponseInterface.position] = currentPosition, _response4[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[DrawerResponseInterface.dimension] = vdimension, _response4[DrawerResponseInterface.close] = true, _response4[DrawerResponseInterface.open] = false, _response4);

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
      var customBound = new Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO;
      var width = bound.upper || this.width;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$1; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[DrawerResponseInterface.position] = signedOffsetSide, _response5[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$1 && trueForOpen || state === BELOW_THRESHOLD$1 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$1 && !trueForOpen || state === BELOW_THRESHOLD$1 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementX >= ZERO && (start <= this.maxArea || start <= width + signedOffsetSide)) {
        if (rect.width >= customBound.gap * resolveThreshold(threshold)) {
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


      if (rect.displacementX <= ZERO && this.resumeX <= width) {
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
      return pseudoElt ? WINDOW.getComputedStyle(elt, pseudoElt) : WINDOW.getComputedStyle(elt);
    };

    Left._windowSize = function _windowSize() {
      return WINDOW.screen.width;
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
      this.threshold = resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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

      var currentPosition = offsetRight(this.element);
      var bound = this.bound;
      this.positionOnStart = currentPosition;
      var dimension = bound.lower ? "-" + (bound.upper - bound.lower) + this.unit : "-" + (bound.upper - (WIN_WIDTH - start)) + this.unit;
      var displacement = "-" + (bound.upper - FALSE_TOUCH_START_POINT$2) + this.unit;

      if (start <= WIN_WIDTH && start >= this.minArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[DrawerResponseInterface.position] = currentPosition, _response[DrawerResponseInterface.dimension] = dimension, _response[DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY));
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
      var currentPosition = offsetRight(this.element);
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


      if (start <= WIN_WIDTH && (start >= this.minArea || start >= FALSE_WIDTH - currentPosition) && currentPosition < ZERO && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX < ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[DrawerResponseInterface.position] = currentPosition, _response2[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[DrawerResponseInterface.dimension] = dimension, _response2[DrawerResponseInterface.open] = true, _response2[DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_WIDTH && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundX && this.scrollControl && rect.displacementX > ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[DrawerResponseInterface.position] = currentPosition, _response4[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[DrawerResponseInterface.dimension] = vdimension, _response4[DrawerResponseInterface.close] = true, _response4[DrawerResponseInterface.open] = false, _response4);

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
      var signedOffsetSide = offsetRight(this.element);
      var bound = this.bound;
      var customBound = new Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO;
      var width = bound.upper || this.width;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$2; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[DrawerResponseInterface.position] = signedOffsetSide, _response5[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$2 && trueForOpen || state === BELOW_THRESHOLD$2 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$2 && !trueForOpen || state === BELOW_THRESHOLD$2 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementX <= ZERO && (start >= this.minArea || start >= FALSE_WIDTH - signedOffsetSide)) {
        if (rect.width >= customBound.gap * resolveThreshold(threshold)) {
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


      if (rect.displacementX >= ZERO && this.resumeX >= FALSE_WIDTH) {
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
      return pseudoElt ? WINDOW.getComputedStyle(elt, pseudoElt) : WINDOW.getComputedStyle(elt);
    };

    Right._windowSize = function _windowSize() {
      return WINDOW.screen.width;
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
      this.threshold = resolveThreshold(this.threshold); // Touch coordinates (Touch Start)

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

      if (start >= ZERO && start <= maxArea && currentPosition === bound.slack) {
        var _response;

        var response = (_response = {}, _response[DrawerResponseInterface.position] = currentPosition, _response[DrawerResponseInterface.dimension] = dimension, _response[DrawerResponseInterface.displacement] = displacement, _response);
        fn.call(this._context, new Service(touchEvent), response, new Path(this.startX, this.startY));
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


      if (start >= ZERO && (start <= this.maxArea || start <= height + currentPosition) && currentPosition < ZERO && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY > ZERO) {
        var _response2;

        var response = (_response2 = {}, _response2[DrawerResponseInterface.position] = currentPosition, _response2[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response2[DrawerResponseInterface.dimension] = dimension, _response2[DrawerResponseInterface.open] = true, _response2[DrawerResponseInterface.close] = false, _response2);
        fn.call(this._context, new Service(touchEvent), response, rect);
      } // CLOSE LOGIC


      if (resume <= this.height && Math.abs(currentPosition) < bound.gap && rect.width < bound.gap && isBoundY && this.scrollControl && rect.displacementY < ZERO) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[DrawerResponseInterface.position] = currentPosition, _response4[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response4[DrawerResponseInterface.dimension] = vdimension, _response4[DrawerResponseInterface.close] = true, _response4[DrawerResponseInterface.open] = false, _response4);

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
      var customBound = new Bound(bound.upper + this.positionOnStart, bound.upper);
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO;
      var height = bound.upper || this.height;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN$3; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var response = (_response5 = {}, _response5[DrawerResponseInterface.position] = signedOffsetSide, _response5[DrawerResponseInterface.posOnStart] = this.positionOnStart, _response5.rect = rect, _response5);

      function getResponse(state, trueForOpen) {
        if (state === THRESHOLD$3 && trueForOpen || state === BELOW_THRESHOLD$3 && !trueForOpen) {
          var _extends2;

          return _extends((_extends2 = {}, _extends2[DrawerResponseInterface.dimension] = zero, _extends2.TIMING = TIMING, _extends2[DrawerResponseInterface.oppositeDimension] = nonZero, _extends2), response);
        } else if (state === THRESHOLD$3 && !trueForOpen || state === BELOW_THRESHOLD$3 && trueForOpen) {
          var _extends3;

          return _extends((_extends3 = {}, _extends3[DrawerResponseInterface.dimension] = nonZero, _extends3.TIMING = TIMING, _extends3[DrawerResponseInterface.oppositeDimension] = zero, _extends3), response);
        }

        return {};
      } // OPEN LOGIC


      if (rect.displacementY >= ZERO && (start <= this.maxArea || start <= height + signedOffsetSide)) {
        if (rect.height >= customBound.gap * resolveThreshold(threshold)) {
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


      if (rect.displacementY <= ZERO && this.resumeY <= height) {
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
      return pseudoElt ? WINDOW.getComputedStyle(elt, pseudoElt) : WINDOW.getComputedStyle(elt);
    };

    Top._windowSize = function _windowSize() {
      return WINDOW.screen.height;
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
      var size = this._direction === SnappedDrawer.UP || this._direction === SnappedDrawer.DOWN ? WINDOW.screen.height : WINDOW.screen.width;

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

  var Backdrop =
  /*#__PURE__*/
  function () {
    function Backdrop(backdrop) {
      this.backdrop = backdrop;
    }

    var _proto = Backdrop.prototype;

    _proto.show = function show(time) {
      css(this.backdrop, {
        display: 'block',
        opacity: 1,
        transition: "opacity linear " + time / 1e3 + "s"
      });
    };

    _proto.hide = function hide(time) {
      var _this = this;

      css(this.backdrop, {
        opacity: 0,
        transition: "opacity linear " + time / 1e3 + "s"
      });
      window.setTimeout(function () {
        css(_this.backdrop, {
          display: 'none'
        });
      }, time);
    };

    _proto.setOpacity = function setOpacity(val) {
      css(this.backdrop, {
        display: 'block',
        opacity: val,
        transition: 'none'
      });
    };

    return Backdrop;
  }();

  var ZERO$1 = 0;
  var KILO = 1e3;
  var MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.5;
  var MIN_POSITIVE_DISPLACEMENT = 10;
  var MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT;
  var TRANSITION_STYLE = 'linear'; // 'cubic-bezier(0, 0.5, 0, 1)'

  var EFFECT = 'transition';
  var OVERFLOW = 'overflow';
  var TRANS_TIMING = '0.1s';
  var TRANS_TEMPLATE = TRANSITION_STYLE + " " + TRANS_TIMING;
  var HIDDEN = 'hidden';
  var SCROLL = 'scroll';
  var AUTO = 'auto';
  var HREF = 'href';
  var HASH_ATTR = "data-" + HREF;
  var START$1 = 'start';
  var MOVE$1 = 'move';
  var THRESHOLD$5 = 'threshold';
  var BELOW_THRESHOLD$5 = "below" + THRESHOLD$5;
  var MIN_SPEED = 100;
  var MAX_SPEED = 500;

  var NavDrawer =
  /*#__PURE__*/
  function () {
    /**
     * Creates a new NavDrawer object. Providing the Left and Right
     * Drawer functionality.
     * Support for Top and Bottom may come in the future
     * @throws RangeError
     * @param {{}} options An options Object to configure the Drawer with
     * @param {{}} state An activity and service manager
     */
    function NavDrawer(options, state) {
      this.options = options;
      this.state = state;
      this.element = this.options.ELEMENT;
      this._body = this.options.BODY;
      this._backdrop = this.options.BACKDROP;
      this.direction = this.options.DIRECTION;

      this._checkDirection();

      this.directionString = DIRECTIONS[this.direction];
      this.bound = this._bound;

      var o = _extends({}, options, {
        SIZE: this.elementSize,
        TARGET: document
      });

      this.drawer = new Drawer.SnappedDrawer(o, this.bound, Drawer.DrawerManagementStore);
      Drawer.DrawerManagementStore.pushActivity(this.state.activity);
      this.transition = this.directionString + " " + TRANS_TEMPLATE;
    }

    var _proto = NavDrawer.prototype;

    _proto.activate = function activate() {
      this.drawer.on(START$1, this._startHandler).on(MOVE$1, this._moveHandler).on(THRESHOLD$5, this._threshold).on(BELOW_THRESHOLD$5, this._belowThreshold).setContext(this).activate();
      this.drawer.setServiceID(this.state.activity.id);
      return 0;
    };

    _proto.deactivate = function deactivate() {
      this.drawer.deactivate();
      return 0;
    };

    _proto._startHandler = function _startHandler(service, response) {
      var _css;

      service.lock();
      this.state.activity.run();
      css(this.element, (_css = {}, _css[this.directionString] = response.dimension, _css.boxShadow = NAV_BOX_SHADOW[this.directionString], _css[EFFECT] = this.transition, _css));
      this._body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(service, response, rectangle) {
      var _css2;

      service.lock();
      var curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2;
      css(this.element, (_css2 = {}, _css2[this.directionString] = response.dimension, _css2[EFFECT] = 'none', _css2[OVERFLOW] = HIDDEN, _css2));

      if (this.direction === Drawer.RIGHT) {
        var WIN_SIZE = WINDOW.screen.width;
        curPos = WIN_SIZE - curPos;

        this._backdrop.setOpacity(curPos / this.elementSize);

        return;
      }

      this._backdrop.setOpacity(curPos / this.elementSize);
    };

    _proto._threshold = function _threshold(service, state, stateObj, rect) {
      service.lock();
      var isOpen = state[1] === 'open';
      var options = {
        stateObj: stateObj,
        transition: this.directionString + " " + TRANSITION_STYLE + " " + this._calcSpeed(stateObj.TIMING, rect.width) / KILO + "s"
      };

      if (isOpen) {
        this._hide(options);
      } else {
        this._show(options);
      }
    };

    _proto._belowThreshold = function _belowThreshold(service, state, stateObj, rect) {
      service.lock();
      var isClosed = state[1] !== 'open';
      var overallEventTime = stateObj.TIMING;
      var MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD;
      var MPD = MIN_POSITIVE_DISPLACEMENT;
      var MND = MIN_NEGATIVE_DISPLACEMENT;
      var displacement = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rect.displacementY : rect.displacementX;
      var options = {
        stateObj: stateObj,
        transition: this.directionString + " " + TRANSITION_STYLE + " " + this._calcSpeed(stateObj.TIMING, rect.width) / KILO + "s"
      };
      var LOGIC;

      if (this.direction === Drawer.LEFT && isClosed || this.direction === Drawer.RIGHT && !isClosed) {
        LOGIC = displacement > ZERO$1 && displacement >= MPD && rect.greaterWidth;
      } else {
        LOGIC = displacement < ZERO$1 && displacement <= MND && rect.greaterWidth;
      }

      if (overallEventTime / KILO < MTTOB) {
        if (LOGIC) {
          this._overrideBelowThresh(!isClosed, options);
        } else {
          if (isClosed) {
            // Close it. Can't override
            this._hide(options);

            return;
          } // Open it. Can't override. Not enough displacement


          this._show(options);
        }
      } else {
        if (isClosed) {
          // close it
          this._hide(options);

          return;
        } // open it


        this._show(options);
      }
    };

    _proto._show = function _show(options) {
      this._showPrep(options);

      this.element.style[this.directionString] = options.stateObj.dimension;
    };

    _proto._hide = function _hide(options) {
      this._hidePrep(options);

      this.element.style[this.directionString] = options.stateObj.dimension;
    };

    _proto._overrideBelowThresh = function _overrideBelowThresh(isOpen, options) {
      if (isOpen) {
        this._hidePrep(options);

        this.element.style[this.directionString] = options.stateObj.oppositeDimension;
      } else {
        this._showPrep(options);

        this.element.style[this.directionString] = options.stateObj.oppositeDimension;
      }
    };

    _proto._hidePrep = function _hidePrep(options) {
      var _css3;

      this.state.activity.derun();
      this._body.style.overflow = SCROLL;

      this._backdrop.hide(this.options.TRANSITION);

      css(this.element, (_css3 = {}, _css3[EFFECT] = options.transition, _css3[OVERFLOW] = AUTO, _css3));

      if (!this.bound.lower) {
        this.element.style.boxShadow = 'none';
      }

      this._setState('close'); // callback for when nav is hidden


      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)();
      }
    };

    _proto._showPrep = function _showPrep(options) {
      var _css4;

      var buttonHash = getAttribute(this.options.INIT_ELEM, HREF) || getData(this.options.INIT_ELEM, HASH_ATTR);

      if (buttonHash) {
        WINDOW.location.hash = buttonHash;
      }

      this._body.style.overflow = HIDDEN;

      this._backdrop.show(this.options.TRANSITION);

      css(this.element, (_css4 = {}, _css4[EFFECT] = options.transition, _css4[OVERFLOW] = AUTO, _css4));

      this._setState('open'); // callback for when nav is shown


      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.show)();
      }
    };

    _proto._calcSpeed = function _calcSpeed(time, distance) {
      var distanceRemain = this.elementSize - distance;

      if (~Math.sign(distanceRemain)) {
        var newTime = distanceRemain * time / distance;

        if (newTime > MAX_SPEED) {
          newTime = MAX_SPEED;
        } else if (newTime < MIN_SPEED) {
          newTime = MIN_SPEED;
        }

        return newTime;
      }

      return 0;
    };

    _proto._checkDirection = function _checkDirection() {
      if (this.direction !== Drawer.LEFT && this.direction !== Drawer.RIGHT) {
        throw new RangeError('Direction out of range');
      }
    };

    _proto._setState = function _setState(mode) {
      switch (mode) {
        case 'open':
          this.state.activity.run();
          break;

        case 'close':
          this.state.activity.derun();
          break;

        default:
          throw new Error('this should never happen');
      }
    };

    _createClass(NavDrawer, [{
      key: "elementSize",
      get: function get() {
        var axis = this.direction;

        if (axis === Drawer.UP || axis === Drawer.DOWN) {
          return this.element.offsetHeight;
        }

        return this.element.offsetWidth;
      }
      /**
       * @returns {Bound} a boundary object: Bound
       */

    }, {
      key: "_bound",
      get: function get() {
        var upperBound = this.elementSize;

        if (this.direction === Drawer.RIGHT) {
          var _lowerBound = WINDOW.screen.width - this.element.offsetLeft;

          return new Bound(_lowerBound, upperBound);
        }

        var lowerBound = upperBound + this.element.offsetLeft;
        return new Bound(lowerBound, upperBound);
      }
    }]);

    return NavDrawer;
  }();

  var TRANSITION_STYLE$1 = 'cubic-bezier(0, 0.5, 0, 1)';
  var EFFECT$1 = 'transition';
  var TRANS_END = 'transitionend';

  var NavService =
  /*#__PURE__*/
  function () {
    function NavService(options, state) {
      this.options = options;
      this.state = state;
      this.nav = options.ELEMENT;
      this.button = options.INIT_ELEM;
      this.body = options.BODY;
      this.backdrop = options.BACKDROP;
      this.backdropElement = this.backdrop.backdrop;
      this.event = 'click';
      this.direction = options.DIRECTION;
      this.width = this.nav.offsetWidth;
      this.transTime = options.TRANSITION / 1e3;
      this.transition = this.direction + " " + TRANSITION_STYLE$1 + " " + this.transTime + "s"; // state of the nav, whether open or close

      this.alive = false; // diff. btw. event triggered from Drawer class and on here

      /**
       * @private
       */

      this._closeInvoked = false;
      /**
       * @readonly
       * @private
       */

      this._initialState = NavService.css(this.nav, this.direction);
      this._handlers = null;
    }

    var _proto = NavService.prototype;

    _proto.activate = function activate() {
      var _this = this;

      var ClickHandler = function ClickHandler(mouseEvent) {
        _this.handler(mouseEvent);
      };

      var BackdropHandler = function BackdropHandler() {
        _this._close();
      };

      var TransitionHandler = function TransitionHandler() {
        if (!_this.alive && _this._closeInvoked) {
          _this._cleanShadow();

          _this._closeInvoked = false;
        }
      };

      this._register({
        ClickHandler: ClickHandler,
        BackdropHandler: BackdropHandler,
        TransitionHandler: TransitionHandler
      });

      this.button.addEventListener(this.event, this._handlers.ClickHandler);
      this.backdropElement.addEventListener(this.event, this._handlers.BackdropHandler);

      if (this._initialState === "-" + this._width('px')) {
        this.nav.addEventListener(TRANS_END, this._handlers.TransitionHandler);
      }

      return 0;
    };

    _proto.deactivate = function deactivate() {
      throw new ReferenceError('cannot deactivate a default service. This service must be kept running');
    };

    _proto.forceDeactivate = function forceDeactivate() {
      this.button.removeEventListener(this.event, this._handlers.ClickHandler);
      this.backdropElement.removeEventListener(this.event, this._handlers.BackdropHandler);

      if (this._initialState === "-" + this._width('px')) {
        this.nav.removeEventListener(TRANS_END, this._handlers.TransitionHandler);
      }

      this._register(null);
    };

    _proto.handler = function handler(mouseEvent) {
      mouseEvent.preventDefault();

      var state = NavService._toNum(NavService.css(this.nav, this.direction));

      if (state < ZERO) {
        var buttonHash = getAttribute(this.button, 'href') || getData(this.button, 'data-href');

        if (buttonHash) {
          WINDOW.location.hash = buttonHash;
        }

        this._open();
      } else {
        this._close();
      }
    };

    NavService.css = function css$1(el, property, style) {
      return css(el, property, style);
    };

    NavService._toNum = function _toNum(val) {
      val = val.replace(/[^\d]*$/, '');
      return /\.(?=\d)/.test(val) ? Math.round(parseFloat(val)) : parseInt(val, 10);
    };

    _proto._width = function _width(unit) {
      unit = unit || '';
      return this.width + unit;
    };

    _proto._register = function _register(handler) {
      this._handlers = handler;
    };

    _proto._open = function _open() {
      var _style;

      var style = (_style = {}, _style[this.direction] = ZERO, _style[EFFECT$1] = this.transition, _style.boxShadow = NAV_BOX_SHADOW[this.direction], _style);
      NavService.css(this.nav, style);
      this.backdrop.show(this.options.TRANSITION);
      NavService.css(this.body, 'overflow', 'hidden'); // callback for when nav is shown

      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.show)();
      }

      this.alive = true;
      this.state.activity.run();
    };

    _proto._close = function _close() {
      var _style2;

      var style = (_style2 = {}, _style2[this.direction] = this._initialState, _style2[EFFECT$1] = this.transition, _style2);
      NavService.css(this.nav, style);
      this.backdrop.hide(this.options.TRANSITION);
      NavService.css(this.body, 'overflow', 'initial'); // callback for when nav is hidden

      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)();
      }

      this.alive = false;
      this._closeInvoked = true;
      this.state.activity.derun();
    };

    _proto._cleanShadow = function _cleanShadow() {
      NavService.css(this.nav, 'boxShadow', 'none');
    };

    return NavService;
  }();

  var PopService =
  /*#__PURE__*/
  function () {
    function PopService(parentService, options, state) {
      this.options = options;
      this.state = state;
      this.parentService = parentService;
      this.button = options.INIT_ELEM;
      this.event = 'hashchange';
      this.handler = null;
    }

    var _proto = PopService.prototype;

    _proto.activate = function activate() {
      var _this = this;

      var handler = function handler(hashChangeEvent) {
        _this._hashchange(hashChangeEvent);
      };

      this._register(handler);

      WINDOW.addEventListener(this.event, this.handler, true);
      return 0;
    };

    _proto.deactivate = function deactivate() {
      WINDOW.removeEventListener(this.event, this.handler, true);

      this._register(null);

      return 0;
    }
    /**
     * @param {HashChangeEvent} hashChangeEvent Event object
     * @returns {void}
     */
    ;

    _proto._hashchange = function _hashchange(hashChangeEvent) {
      var oldHash = PopService._getHash(hashChangeEvent.oldURL);

      if (oldHash === (getAttribute(this.button, 'href') || getData(this.button, 'data-href')) && this.state.activity.isRunning()) {
        hashChangeEvent.stopImmediatePropagation();

        this.parentService._close();
      }
    };

    _proto._register = function _register(handler) {
      this.handler = handler;
    };

    PopService._getHash = function _getHash(uri) {
      var hash = uri;
      var indexOfHash = hash.lastIndexOf('#');
      hash = indexOfHash !== -1 ? hash.slice(indexOfHash).replace(/(?:[^\w\d-]+)$/) : null;
      return hash;
    };

    return PopService;
  }();

  var EventInterface = {
    SHOW: 'show',
    HIDE: 'hide'
  };

  var State =
  /*#__PURE__*/
  function () {
    function State(activity) {
      var _this$_stateEventRegi;

      this.activity = activity; // activity manager

      this._stateEventRegistry = (_this$_stateEventRegi = {}, _this$_stateEventRegi[EventInterface.SHOW] = null, _this$_stateEventRegi[EventInterface.HIDE] = null, _this$_stateEventRegi);
    }

    var _proto = State.prototype;

    _proto.getStateEventHandler = function getStateEventHandler(type) {
      if (Object.values(EventInterface).indexOf(type) !== -1) {
        return this._stateEventRegistry[type];
      }

      throw new Error('unknown event type');
    };

    _proto.isRegisteredEvent = function isRegisteredEvent(type) {
      return typeof this._stateEventRegistry[type] === 'function';
    };

    _createClass(State, [{
      key: "onshow",
      set: function set(val) {
        if (typeof val !== 'function') {
          throw new TypeError('value is not a callable type');
        }

        this._stateEventRegistry.show = val;
        return true;
      }
    }, {
      key: "onhide",
      set: function set(val) {
        if (typeof val !== 'function') {
          throw new TypeError('value is not a callable type');
        }

        this._stateEventRegistry.hide = val;
        return true;
      }
    }]);

    return State;
  }();

  var BACKDROP = 'backdrop';
  var MEDIA_DRAW = 'data-max-width';
  var CLASS_TYPE$1 = '[object NavCard]';
  var NAME = 'Nav';
  var NAV = WINDOW[NAME] || null;

  var NavCard =
  /*#__PURE__*/
  function () {
    function NavCard(src, dest) {
      /**
       * Covert Backdrop
       * ----------------
       * Just incase `options.backdrop = false`
       * prevents multiple `if` statements
       * so we don't have to check whether
       * backdrop is enabled anytime we want to access it.
       *
       * Insert into DOM only:
       * when `options.backdrop = true`
       * `options.backdropClass` is undefined
       */
      this.backdrop = document.createElement('div');
      this.backdrop.className = BACKDROP;
      css(this.backdrop, {
        background: 'rgba(0,0,0,.4)',
        height: '100%',
        width: '100%',
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0
      });
      this.src = src;
      this.dest = dest;
      this.body = document.body;
      this.Drawer = null;
      this.SheetService = null;
      this.PopService = null;
      this._Activity = new ActivityManager(this);
      this.State = new State(this._Activity);
    }

    var _proto = NavCard.prototype;

    _proto.setup = function setup(options) {
      if (!this.src) {
        throw new TypeError("expected " + NAME + " to be constructed with at least 'src' argument:\n        expected 'src' to be selector string or HTMLElement.\n          constructor(src: string | HTMLElement, dest?: string | HTMLElement)");
      }

      var opts = typeof Object.assign === 'function' ? Object.assign({}, NavCard.defaultConfig) : _extends({}, NavCard.defaultConfig);

      if (options && typeof options === 'object') {
        var _arr = Object.keys(options);

        for (var _i = 0; _i < _arr.length; _i++) {
          var prop = _arr[_i];

          if (Object.prototype.hasOwnProperty.call(opts, prop)) {
            opts[prop] = options[prop];
          } else {
            continue;
          }
        }
      }

      this.dest = this.dest ? this.dest : opts.dest;
      var srcEl = this.src instanceof HTMLElement ? this.src : $(this.src);
      var destEl = this.dest instanceof HTMLElement ? this.dest : $(this.dest);
      var maxWidth = getData(destEl, MEDIA_DRAW);

      if (opts.useBackdrop) {
        var backdropclass = opts.backdrop || false; // if `opts.useBackdrop` and no `backdrop` given
        // append a custom backdrop

        if (!backdropclass) {
          destEl.insertAdjacentElement('beforeBegin', this.backdrop);
        } else if (typeof backdropclass === 'string') {
          // check if backdropclass is normal string or css class selector
          var backdrop = /^\./.test(backdropclass) ? backdropclass : "." + backdropclass;
          this.backdrop = $(backdrop);
        } else if (backdropclass instanceof HTMLElement) {
          this.backdrop = backdropclass;
        } else {
          throw new TypeError('expected \'options.backdrop\' to be a selector string or HTMLElement.');
        }
      }

      maxWidth = /px$/.test(maxWidth) ? maxWidth : maxWidth + "px";
      var defaultOptions = {
        ELEMENT: destEl,
        INIT_ELEM: srcEl,
        BACKDROP: new Backdrop(this.backdrop),
        BODY: this.body,
        TRANSITION: opts.transition,
        DIRECTION: DIRECTIONS[opts.direction],
        unit: opts.unit
      };

      var drawerOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: maxWidth,
        DIRECTION: opts.direction,
        maxStartArea: opts.maxStartArea,
        threshold: opts.threshold,
        scrollableContainer: opts.scrollableContainer,
        CustomDrawer: opts.CustomDrawer
      });

      var hashOptions = {
        INIT_ELEM: defaultOptions.INIT_ELEM
      };
      return new NavMountWorker(this, {
        defaultOptions: defaultOptions,
        drawerOptions: drawerOptions,
        hashOptions: hashOptions
      });
    };

    _proto.terminate = function terminate(service) {
      service |= 0;

      if (service & NavCard.SERVICES.Default && this.SheetService instanceof NavService) {
        this.SheetService.deactivate();
      }

      if (service & NavCard.SERVICES.Drawer && this.Drawer instanceof NavDrawer) {
        this.Drawer.deactivate();
      }

      if (service & NavCard.SERVICES.Hash && this.PopService instanceof PopService) {
        this.PopService.deactivate();
      }

      if (!service) {
        throw new Error('a service id is required');
      }
    };

    _proto.toString = function toString() {
      return CLASS_TYPE$1;
    };

    NavCard.namespace = function namespace(name) {
      WINDOW[name] = WINDOW[name] || {};
      WINDOW[name][NAME] = NavCard;
      WINDOW[NAME] = NAV;
    };

    _proto._drawerAPI = function _drawerAPI(options) {
      var _this = this;

      var CustomDrawer = options.CustomDrawer;
      this.Drawer = CustomDrawer && typeof CustomDrawer === 'object' ? new CustomDrawer(options, this.State) : new NavDrawer(options, this.State);
      return {
        activate: function activate() {
          return _this.Drawer.activate();
        },
        deactivate: function deactivate() {
          return _this.Drawer.deactivate();
        }
      };
    };

    _proto._hashAPI = function _hashAPI(options) {
      var _this2 = this;

      this.PopService = new PopService(this.SheetService, options, this.State);
      return {
        activate: function activate() {
          return _this2.PopService.activate();
        },
        deactivate: function deactivate() {
          return _this2.PopService.deactivate();
        }
      };
    };

    _proto._defaultAPI = function _defaultAPI(options) {
      var _this3 = this;

      this.SheetService = new NavService(options, this.State);
      return {
        activate: function activate() {
          return _this3.SheetService.activate();
        },
        deactivate: function deactivate() {
          return _this3.SheetService.deactivate();
        }
      };
    };

    return NavCard;
  }();

  _defineProperty(NavCard, "defaultConfig", {
    transition: 500,
    direction: -1,
    useBackdrop: false,
    backdrop: null,
    dest: null,
    scrollableContainer: null,
    maxStartArea: 25,
    threshold: 1 / 2,
    unit: 'px',
    CustomDrawer: null
  });

  _defineProperty(NavCard, "SERVICES", {
    Default: 0x20,
    Drawer: 0x40,
    Pop: 0x80
  });

  var NavMountWorker =
  /*#__PURE__*/
  function () {
    function NavMountWorker(borrowedContext, options) {
      this.$this = borrowedContext;
      this.options = options;
    }

    var _proto2 = NavMountWorker.prototype;

    _proto2.mount = function mount() {
      var _this4 = this;

      var DEFAULT_ACTIVE = !this.$this._defaultAPI(this.options.defaultOptions).activate();
      var DRAWER_ACTIVE = !this.$this._drawerAPI(this.options.drawerOptions).activate();
      var HASH_ACTIVE = !this.$this._hashAPI(this.options.hashOptions).activate();
      return new Promise(function (resolve, reject) {
        if (!(DEFAULT_ACTIVE && DRAWER_ACTIVE && HASH_ACTIVE)) {
          reject(new Error('one or more services could not activate'));
          return;
        }

        resolve(new NavStateEvent(_this4.$this, _this4.$this.State));
      });
    };

    _proto2.unmount = function unmount() {
      this.$this.SheetService.forceDeactivate();
      this.$this.Drawer.deactivate();
      this.$this.PopService.deactivate();
    };

    _proto2.toString = function toString() {
      return '[object NavMountWorker]';
    };

    return NavMountWorker;
  }();

  var NavStateEvent =
  /*#__PURE__*/
  function () {
    function NavStateEvent($this, state) {
      this.events = [NAVSTATE_EVENTS.show, NAVSTATE_EVENTS.hide];
      this.$this = $this;
      this._State = state;
    }

    var _proto3 = NavStateEvent.prototype;

    _proto3.on = function on(event, handle) {
      if (handle === void 0) {
        handle = function handle() {
          return false;
        };
      }

      if (!(this.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      this._State["on" + event] = handle.bind(this.$this);
    };

    _proto3.off = function off(event) {
      if (!(this.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      this._State["on" + event] = null;
    };

    return NavStateEvent;
  }();

  var ZERO$2 = 0;
  var KILO$1 = 1e3;
  var MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD$1 = 0.1;
  var MIN_POSITIVE_DISPLACEMENT$1 = 15;
  var MIN_NEGATIVE_DISPLACEMENT$1 = -MIN_POSITIVE_DISPLACEMENT$1;
  var TRANSITION_STYLE$2 = 'linear';
  var EFFECT$2 = 'transition';
  var OVERFLOW$1 = 'overflow';
  var TRANS_TIMING$1 = '0.1s';
  var TRANS_TEMPLATE$1 = TRANSITION_STYLE$2 + " " + TRANS_TIMING$1;
  var HIDDEN$1 = 'hidden';
  var SCROLL$1 = 'scroll';
  var AUTO$1 = 'auto';
  var HREF$1 = 'href';
  var HASH_ATTR$1 = "data-" + HREF$1;
  var START$2 = 'start';
  var MOVE$2 = 'move';
  var THRESHOLD$6 = 'threshold';
  var BELOW_THRESHOLD$6 = "below" + THRESHOLD$6;
  var MAX_TIME = KILO$1;
  var MAX_SPEED$1 = 500;
  var MarkIndex = {
    high: 'high',
    mid: 'mid',
    low: 'low'
  };

  var SheetDrawer =
  /*#__PURE__*/
  function () {
    /**
     * Creates a new SheetDrawer object. Providing the Top and Bottom
     * Drawer functionality
     * @throws RangeError
     * @param {{}} options An options Object to configure the Drawer with
     * @param {State} state An activity and service manager
     */
    function SheetDrawer(options, state) {
      var _this$marks;

      this.options = options;
      this.state = state;
      this.element = this.options.ELEMENT;
      this._body = this.options.BODY;
      this.backdrop = this.options.BACKDROP;
      this.direction = this.options.DIRECTION;
      this._scCheck = this.options.scrollableContainer;
      this._sc = this._scCheck || document.createElement('div');

      this._checkDirection();

      this.directionString = DIRECTIONS[this.direction];
      this.bound = this._bound;
      this._oldbound = null;

      var o = _extends({}, options, {
        SIZE: this.elementSize,
        TARGET: document
      });

      this.drawer = new Drawer.SnappedDrawer(o, this.bound, Drawer.DrawerManagementStore);
      Drawer.DrawerManagementStore.pushActivity(this.state.activity);
      this.transition = this.directionString + " " + TRANS_TEMPLATE$1;
      this.marks = (_this$marks = {}, _this$marks[MarkIndex.high] = ZERO$2, _this$marks[MarkIndex.mid] = this.bound.slack * resolveThreshold(options.threshold), _this$marks[MarkIndex.low] = document.documentElement.clientHeight - this.element.offsetTop - this.elementSize, _this$marks);
      this._Control = {
        touchMoveExited: false,
        lastMetredPos: 0
      };
    }

    var _proto = SheetDrawer.prototype;

    _proto.activate = function activate() {
      this.drawer.on(START$2, this._startHandler).on(MOVE$2, this._moveHandler).on(THRESHOLD$6, this._threshold).on(BELOW_THRESHOLD$6, this._belowThreshold).setContext(this).activate();
      this.drawer.setServiceID(this.state.activity.id);
      return 0;
    };

    _proto.deactivate = function deactivate() {
      this.drawer.deactivate();
      return 0;
    };

    _proto._startHandler = function _startHandler(service, response) {
      var _css;

      service.lock();
      this.state.activity.run();
      css(this.element, (_css = {}, _css[this.directionString] = !this.bound.lower ? response.dimension : null, _css.boxShadow = NAV_BOX_SHADOW[this.directionString], _css[EFFECT$2] = this.transition, _css));
      this._body.style.overflow = HIDDEN$1;
    };

    _proto._moveHandler = function _moveHandler(service, response, rectangle) {
      var _css2;

      service.lock();
      var WIN_SIZE = WINDOW.screen.height;
      var curPos = rectangle.coordsY.y2;

      if (response.posOnStart === this.marks[MarkIndex.high] && (this._scCheck && this._sc.scrollTop !== ZERO$2 || !this._scCheck)) {
        this._Control.touchMoveExited = true;
        this._Control.lastMetredPos = curPos;
        return;
      }

      this._Control.touchMoveExited = false;
      var customDimension = this.direction === Drawer.DOWN ? this._Control.lastMetredPos - curPos + response.posOnStart : -this._Control.lastMetredPos + curPos + response.posOnStart;
      css(this.element, (_css2 = {}, _css2[this.directionString] = response.dimension, _css2[EFFECT$2] = 'none', _css2[OVERFLOW$1] = HIDDEN$1, _css2));
      css(this._sc, OVERFLOW$1, HIDDEN$1);

      if (response.posOnStart === this.marks[MarkIndex.high] && response.closing) {
        css(this.element, this.directionString, SheetDrawer._toUnit(customDimension, this.options.unit));
      }

      if (Math.round(response.posOnStart) === Math.round(this.marks[MarkIndex.mid]) && response.opening && this.direction === Drawer.DOWN) {
        this._sc.scrollTo(0, -rectangle.displacementY);
      }

      if (this.direction === Drawer.DOWN) {
        curPos = WIN_SIZE - curPos;
      }

      this.backdrop.setOpacity(curPos / this.elementSize);
    };

    _proto._threshold = function _threshold(service, state, stateObj) {
      service.lock();
      var isOpen = state[1] === 'open';
      var options = {
        stateObj: stateObj,
        transition: this.directionString + " ease " + this._calcSpeed(stateObj.TIMING) / KILO$1 + "s"
      };

      if (isOpen) {
        this._hide(options);
      } else {
        this._show(options);
      }
    };

    _proto._belowThreshold = function _belowThreshold(service, state, stateObj, rect) {
      service.lock();
      var isClosed = state[1] !== 'open';
      var overallEventTime = stateObj.TIMING;
      var MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD$1;
      var MPD = MIN_POSITIVE_DISPLACEMENT$1;
      var MND = MIN_NEGATIVE_DISPLACEMENT$1;
      var displacement = rect.displacementY;
      var options = {
        rect: rect,
        stateObj: stateObj,
        transition: this.directionString + " ease " + this._calcSpeed(stateObj.TIMING) / KILO$1 + "s"
      };
      var position = stateObj.position;
      var minForwardVelocity = MPD / MTTOB; // pixel/second: pps

      var minBackwardVelocity = MND / MTTOB; // pps

      var velocity = displacement / (overallEventTime / KILO$1);
      var LOGIC = this.direction === Drawer.UP && isClosed || this.direction === Drawer.DOWN && !isClosed ? velocity > minForwardVelocity && rect.greaterHeight : velocity < minBackwardVelocity && rect.greaterHeight;

      if (LOGIC) {
        this._overrideBelowThresh(!isClosed, options);

        return;
      }

      if (isClosed) {
        this.element.style[this.directionString] = SheetDrawer._toUnit(position >= this.marks[MarkIndex.mid] ? (this._halfHidePrep(options), this.marks[MarkIndex.mid]) : (this._hidePrep(options), this.marks[MarkIndex.low]), this.options.unit);
      } else {
        this._showPrep(options);

        this.element.style[this.directionString] = SheetDrawer._toUnit(position >= this.marks[MarkIndex.mid] ? this.marks[MarkIndex.mid] : this.marks[MarkIndex.high], this.options.unit);
      }
    };

    _proto._show = function _show(options) {
      if (this._Control.touchMoveExited) {
        this._Control.touchMoveExited = false;
        return;
      }

      css(this._sc, OVERFLOW$1, SCROLL$1);

      this._showPrep(options);

      this.element.style[this.directionString] = SheetDrawer._toUnit(this.marks[MarkIndex.high], this.options.unit);
    };

    _proto._hide = function _hide(options) {
      if (this._Control.touchMoveExited) {
        this._Control.touchMoveExited = false;
        return;
      }

      this._hidePrep(options);

      this.element.style[this.directionString] = SheetDrawer._toUnit(this.marks[MarkIndex.low], this.options.unit);
    };

    _proto._overrideBelowThresh = function _overrideBelowThresh(isOpen, options) {
      var _options$stateObj = options.stateObj,
          oppositeDimension = _options$stateObj.oppositeDimension,
          position = _options$stateObj.position;
      var isDownDrawer = this.direction === Drawer.DOWN;

      if (isOpen) {
        if (this._Control.touchMoveExited) {
          this._Control.touchMoveExited = false;
          return;
        }

        this.element.style[this.directionString] = SheetDrawer._toUnit(position >= this.marks[MarkIndex.mid] ? this.marks[MarkIndex.mid] : this.marks[MarkIndex.low], this.options.unit);

        this._halfHidePrep(options);
      } else {
        var halfDimension = SheetDrawer._toUnit(this.marks[MarkIndex.mid], this.options.unit);

        this._showPrep(options);

        this.element.style[this.directionString] = isDownDrawer ? halfDimension : oppositeDimension;
      }
    };

    _proto._halfHidePrep = function _halfHidePrep(options) {
      var _css3;

      this._body.style.overflow = HIDDEN$1;
      css(this.element, (_css3 = {}, _css3[EFFECT$2] = options.transition, _css3[OVERFLOW$1] = AUTO$1, _css3));
    };

    _proto._hidePrep = function _hidePrep(options) {
      var _css4;

      this._body.style.overflow = SCROLL$1;
      this.backdrop.hide(this.options.TRANSITION);
      css(this.element, (_css4 = {}, _css4[EFFECT$2] = options.transition, _css4[OVERFLOW$1] = AUTO$1, _css4));

      if (!this.bound.lower) {
        this.element.style.boxShadow = 'none';
      }

      this._setState('close'); // callback for when nav is hidden


      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)();
      }
    };

    _proto._showPrep = function _showPrep(options) {
      var _css5;

      var buttonHash = getAttribute(this.options.INIT_ELEM, HREF$1) || getData(this.options.INIT_ELEM, HASH_ATTR$1);

      if (buttonHash) {
        WINDOW.location.hash = buttonHash;
      }

      this._body.style.overflow = options.bodyOverflow || HIDDEN$1;
      this.backdrop.show(this.options.TRANSITION);
      css(this.element, (_css5 = {}, _css5[EFFECT$2] = options.transition, _css5[OVERFLOW$1] = AUTO$1, _css5));

      this._setState('open'); // callback for when nav is shown


      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.show)();
      }
    };

    _proto._calcSpeed = function _calcSpeed(time) {
      if (time >= MAX_TIME) {
        return MAX_SPEED$1;
      }

      var percent = 100;
      var percentage = time / MAX_TIME * percent;
      return percentage / percent * MAX_SPEED$1;
    };

    _proto._checkDirection = function _checkDirection() {
      if (this.direction !== Drawer.UP && this.direction !== Drawer.DOWN) {
        throw new RangeError('Direction out of range');
      }
    };

    _proto._setState = function _setState(mode) {
      switch (mode) {
        case 'open':
          this.state.activity.run();
          break;

        case 'close':
          this.state.activity.derun();
          break;

        default:
          throw new Error('this should never happen');
      }
    };

    _proto._updateBound = function _updateBound() {
      var bound = this._bound;
      this._oldbound = new Bound(this.bound.lower, this.bound.upper);
      this.bound.lower = bound.lower;
    };

    SheetDrawer._toUnit = function _toUnit(value, unit) {
      if (unit === void 0) {
        unit = 'px';
      }

      return value + unit;
    };

    _createClass(SheetDrawer, [{
      key: "elementSize",
      get: function get() {
        return this.element.offsetHeight;
      }
    }, {
      key: "_bound",
      get: function get() {
        var upperBound = this.elementSize;

        if (this.direction === Drawer.DOWN) {
          // get `element.offsetBottom`
          var _lowerBound = WINDOW.screen.height - this.element.offsetTop;

          return new Bound(_lowerBound, upperBound);
        }

        var lowerBound = upperBound + this.element.offsetTop;
        return new Bound(lowerBound, upperBound);
      }
    }]);

    return SheetDrawer;
  }();

  var TRANSITION_STYLE$3 = 'ease';
  var EFFECT$3 = 'transition';
  var TRANS_END$1 = 'transitionend';
  var SCROLL$2 = 'scroll';
  var HIDDEN$2 = 'hidden';
  /**
   * This Service is pretty much similar to NavService
   * @see {@link ../nav/navservice.js}
   * "Extend the NavService class"; you may think, but
   * things will get a lot messy.
   * Some little bit of copy-and-paste and tweaking was done.
   */

  var SheetService =
  /*#__PURE__*/
  function () {
    function SheetService(options, state) {
      this.options = options;
      this.state = state;
      this.sheet = options.ELEMENT;
      this.button = options.INIT_ELEM;
      this.backdrop = options.BACKDROP;
      this.backdropElement = this.backdrop.backdrop;
      this._body = options.BODY;
      this.event = 'click';
      this.direction = options.DIRECTION;
      this.height = this.sheet.offsetHeight;
      this.transTime = options.TRANSITION / 1e3;
      this.transition = this.direction + " " + TRANSITION_STYLE$3 + " " + this.transTime + "s"; // state of the nav, whether open or close

      this.alive = false; // diff. btw. event triggered from Drawer class and on here

      /**
       * @private
       */

      this._closeInvoked = false;
      /**
       * @readonly
       * @private
       */

      this._initialState = SheetService.css(this.sheet, this.direction);
      this._handlers = null;
    }

    var _proto = SheetService.prototype;

    _proto.activate = function activate() {
      var _this = this;

      var ClickHandler = function ClickHandler(mouseEvent) {
        _this.handler(mouseEvent);
      };

      var BackdropHandler = function BackdropHandler() {
        _this._close();
      };

      var TransitionHandler = function TransitionHandler() {
        if (!_this.alive && _this._closeInvoked) {
          _this._cleanShadow();

          _this._closeInvoked = false;
        }
      };

      this._register({
        ClickHandler: ClickHandler,
        BackdropHandler: BackdropHandler,
        TransitionHandler: TransitionHandler
      });

      this.button.addEventListener(this.event, this._handlers.ClickHandler);
      this.backdropElement.addEventListener(this.event, this._handlers.BackdropHandler);

      if (this._initialState === "-" + this._height('px')) {
        this.sheet.addEventListener(TRANS_END$1, this._handlers.TransitionHandler);
      }

      return 0;
    };

    _proto.deactivate = function deactivate() {
      throw new ReferenceError('cannot deactivate a default service. This service must be kept running');
    };

    _proto.forceDeactivate = function forceDeactivate() {
      this.button.removeEventListener(this.event, this._handlers.ClickHandler);
      this.backdropElement.removeEventListener(this.event, this._handlers.BackdropHandler);

      if (this._initialState === "-" + this._height('px')) {
        this.sheet.removeEventListener(TRANS_END$1, this._handlers.TransitionHandler);
      }

      this._register(null);
    };

    _proto.handler = function handler(mouseEvent) {
      mouseEvent.preventDefault();

      var state = SheetService._toNum(SheetService.css(this.sheet, this.direction));

      if (state < ZERO) {
        var buttonHash = getAttribute(this.button, 'href') || getData(this.button, 'data-href');

        if (buttonHash) {
          WINDOW.location.hash = buttonHash;
        }

        this._open();
      } else {
        this._close();
      }
    };

    SheetService.css = function css$1(el, property, style) {
      return css(el, property, style);
    };

    SheetService._toNum = function _toNum(val) {
      val = val.replace(/[^\d]*$/, '');
      return /\.(?=\d)/.test(val) ? Math.round(parseFloat(val)) : parseInt(val, 10);
    };

    _proto._height = function _height(unit) {
      unit = unit || '';
      return this.height + unit;
    };

    _proto._register = function _register(handler) {
      this._handlers = handler;
    };

    _proto._open = function _open() {
      var _style;

      var style = (_style = {}, _style[this.direction] = ZERO, _style[EFFECT$3] = this.transition, _style.boxShadow = NAV_BOX_SHADOW[this.direction], _style);
      SheetService.css(this.sheet, style);
      this.backdrop.show(this.options.TRANSITION);
      this._body.style.overflow = HIDDEN$2; // callback for when nav is shown

      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.show)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.show)();
      }

      this.alive = true;
      this.state.activity.run();
    };

    _proto._close = function _close() {
      var _style2;

      var style = (_style2 = {}, _style2[this.direction] = this._initialState, _style2[EFFECT$3] = this.transition, _style2);
      SheetService.css(this.sheet, style);
      this.backdrop.hide(this.options.TRANSITION);
      this._body.style.overflow = SCROLL$2; // callback for when nav is hidden

      if (this.state.isRegisteredEvent(NAVSTATE_EVENTS.hide)) {
        this.state.getStateEventHandler(NAVSTATE_EVENTS.hide)();
      }

      this.alive = false;
      this._closeInvoked = true;
      this.state.activity.derun();
    };

    _proto._cleanShadow = function _cleanShadow() {
      SheetService.css(this.sheet, 'boxShadow', 'none');
    };

    return SheetService;
  }();

  var CLASS_TYPE$2 = '[object Sheet]';
  var NAME$1 = 'Sheet';
  var SHEET = WINDOW[NAME$1] || null;

  var Sheet =
  /*#__PURE__*/
  function (_NavCard) {
    _inheritsLoose(Sheet, _NavCard);

    function Sheet(src, dest) {
      var _this;

      _this = _NavCard.call(this, src, dest) || this;
      _this.SheetService = null;
      Sheet.defaultConfig.threshold = 2 / 3;
      return _this;
    }
    /**
     * @override
     */


    var _proto = Sheet.prototype;

    _proto.setup = function setup(options) {
      var navMountWorker = _NavCard.prototype.setup.call(this, options);

      return new SheetMountWorker(this, navMountWorker.options);
    }
    /**
     * @override
     */
    ;

    _proto.terminate = function terminate(service) {
      service |= 0;

      if (service & NavCard.SERVICES.Default && this.SheetService instanceof SheetService) {
        this.SheetService.deactivate();
      }

      if (service & NavCard.SERVICES.Drawer && this.Drawer instanceof SheetDrawer) {
        this.Drawer.deactivate();
      }

      if (service & NavCard.SERVICES.Pop && this.PopService) {
        /**
         * we can't strictly determine that `this.PopService`
         * is an instance of PopService class.
         * This is an edge case as there is no access to that
         * type.
         */
        this.PopService.deactivate(); // or super.terminate(...)
      }

      if (!service) {
        throw new Error('a service id is required');
      }
    }
    /**
     * @override
     */
    ;

    _proto.toString = function toString() {
      return CLASS_TYPE$2;
    }
    /**
     * @override
     */
    ;

    Sheet.namespace = function namespace(name) {
      WINDOW[name] = WINDOW[name] || {};
      WINDOW[name][NAME$1] = Sheet;
      WINDOW[NAME$1] = SHEET;
    }
    /**
     * @override
     */
    ;

    _proto._drawerAPI = function _drawerAPI(options) {
      var _this2 = this;

      var CustomDrawer = options.CustomDrawer;
      this.Drawer = CustomDrawer && typeof CustomDrawer === 'object' ? new CustomDrawer(options, this.State) : new SheetDrawer(options, this.State);
      return {
        activate: function activate() {
          return _this2.Drawer.activate();
        },
        deactivate: function deactivate() {
          return _this2.Drawer.deactivate();
        }
      };
    }
    /**
     * @override
     */
    ;

    _proto._hashAPI = function _hashAPI(options) {
      var Interface = _NavCard.prototype._hashAPI.call(this, options);

      this.PopService.parentService = this.SheetService;
      return Interface;
    }
    /**
     * @override
     */
    ;

    _proto._defaultAPI = function _defaultAPI(options) {
      var _this3 = this;

      this.SheetService = new SheetService(options, this.State);
      return {
        activate: function activate() {
          return _this3.SheetService.activate();
        },
        deactivate: function deactivate() {
          return _this3.SheetService.deactivate();
        }
      };
    };

    return Sheet;
  }(NavCard);

  var SheetMountWorker =
  /*#__PURE__*/
  function () {
    function SheetMountWorker(borrowedContext, options) {
      this.$this = borrowedContext;
      this.options = options;
    }

    var _proto2 = SheetMountWorker.prototype;

    _proto2.mount = function mount() {
      var _this4 = this;

      var DEFAULT_ACTIVE = !this.$this._defaultAPI(this.options.defaultOptions).activate();
      var DRAWER_ACTIVE = !this.$this._drawerAPI(this.options.drawerOptions).activate();
      var HASH_ACTIVE = !this.$this._hashAPI(this.options.hashOptions).activate();
      return new Promise(function (resolve, reject) {
        if (!(DEFAULT_ACTIVE && DRAWER_ACTIVE && HASH_ACTIVE)) {
          reject(new Error('one or more services could not activate'));
          return;
        }

        resolve(new SheetStateEvent(_this4.$this, _this4.$this.State));
      });
    };

    _proto2.unmount = function unmount() {
      this.SheetService.forceDeactivate();
      this.Drawer.deactivate();
      this.PopService.deactivate();
    };

    _proto2.toString = function toString() {
      return '[object SheetMountWorker]';
    };

    return SheetMountWorker;
  }();

  var SheetStateEvent =
  /*#__PURE__*/
  function () {
    function SheetStateEvent($this, state) {
      this.events = [NAVSTATE_EVENTS.show, NAVSTATE_EVENTS.hide];
      this.$this = $this;
      this._State = state;
    }

    var _proto3 = SheetStateEvent.prototype;

    _proto3.on = function on(event, handle) {
      if (handle === void 0) {
        handle = function handle() {
          return false;
        };
      }

      if (!(this.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      this._State["on" + event] = handle.bind(this.$this);
    };

    _proto3.off = function off(event) {
      if (!(this.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      this._State["on" + event] = null;
    };

    return SheetStateEvent;
  }();

  var Util = {
    NAV_BOX_SHADOW: NAV_BOX_SHADOW,
    ZERO: ZERO,
    DIRECTIONS: DIRECTIONS,
    NAVSTATE_EVENTS: NAVSTATE_EVENTS,
    Path: Path,
    Bound: Bound,
    dataCamelCase: dataCamelCase,
    camelCase: camelCase,
    unique: unique,
    $: $,
    getAttribute: getAttribute,
    hasAttribute: hasAttribute,
    setAttribute: setAttribute,
    getData: getData,
    resolveThreshold: resolveThreshold,
    css: css
  };

  exports.CircularPath = CircularPath;
  exports.Drawer = Drawer;
  exports.Nav = NavCard;
  exports.Sheet = Sheet;
  exports.Util = Util;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=cardinal.js.map
