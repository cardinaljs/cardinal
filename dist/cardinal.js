(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Cardinal = factory());
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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  var POINT_ANGLE = 360;
  var HALF = 1 / 2;
  var PI = Math.PI;
  var RAD = PI / (POINT_ANGLE * HALF);
  var Circle =
  /*#__PURE__*/
  function () {
    function Circle(radius) {
      /**
       * @type {number}
       */
      this.radius = radius;
      this.diameter = this.radius * 2;
    }

    var _proto = Circle.prototype;

    _proto.areaOfSect = function areaOfSect(angle) {
      angle *= RAD;
      return angle / POINT_ANGLE * this.area;
    };

    _proto.lenOfSect = function lenOfSect(angle) {
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

  var ZERO = 0;
  var DEG = 1 / RAD;
  var RIGHT_ANGLE = POINT_ANGLE >> 2;
  /**
   * Enum of all quadrants from first to fourth.
   * The quadrant is not a usual one; it starts from the 12th
   * hand of the clock and moves anti-clockwise
   * @enum {number}
   * @const
   */

  var Quadrant = {
    FIRST: 90,
    SECOND: 180,
    THIRD: 270,
    FOURTH: 360 // There are two Triangles formed 1) Right angle 2) issoceles

  };

  var CircularPath =
  /*#__PURE__*/
  function (_Circle) {
    _inheritsLoose(CircularPath, _Circle);

    function CircularPath(radius, angles) {
      var _this;

      _this = _Circle.call(this, radius) || this;
      _this._angles = angles;
      _this.angles = angles.map(function (value) {
        return RAD * value;
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

    _proto._findOppUseSOH = function _findOppUseSOH(angle, hyp) {
      return Math.sin(angle) * hyp;
    }
    /**
     * Finds the value of the last two equal angles in the
     * triangle cut out of the circle.
     * There are three angles, one is given as `angleA`;
     * the other two are equal since two sides `b` & `c` are
     * equal i.e `b = c = radius`
     *
     * @param {number} angleA an angle in degree of the only unequal
     * part of the triangle
     * @returns {number} an angle in degree that reps the angle of the
     * two equal sides of the triangle
     */
    ;

    _proto._getLastTwoEqAngles = function _getLastTwoEqAngles(angleA) {
      return (POINT_ANGLE * HALF - this._radToDeg(angleA)) * HALF;
    };

    _proto._getQuadrant = function _getQuadrant(angle) {
      var quad;
      [Quadrant.FOURTH, Quadrant.THIRD, Quadrant.SECOND, Quadrant.FIRST].forEach(function (value, index, array) {
        if (angle > value) {
          quad = array[--index];
        } else {
          quad = array[index];
        }
      });
      return quad;
    };

    _proto._chordLength = function _chordLength(angle) {
      var radiusSq = Math.pow(this.radius, 2);
      /**
       * cosine rule [`a**2 = b**2 + c**2 - 2bc cos A`]
       *
       * `2 * radiusSq` stands as `b**2 + c**2`.
       * Therefore `b**2 + c**2 = 2bc` since `b = c = radius`.
       * Where `b` & `c` are two sides of a triangle cut
       * from the circle, enclosed with a chord, with the `theta`
       * joining them equal `angle`
       *
       * `angle` is the angle `theta` between the two radii
       * drawn from the centre of the circle
       */
      // a = a**2

      var a = 2 * radiusSq - 2 * radiusSq * Math.cos(angle);
      a = Math.sqrt(a);
      return a;
    };

    _createClass(CircularPath, [{
      key: "paths",
      get: function get() {
        var _this2 = this;

        var paths = [];

        this._angles.forEach(function (angle) {
          if (angle === ZERO || angle <= POINT_ANGLE && angle % RIGHT_ANGLE === ZERO) {
            paths.push(_this2.radius);
            return;
          }

          _this2._quad = _this2._getQuadrant(angle);
          angle = _this2._quad !== Quadrant.FIRST ? _this2._quad - angle : angle;

          var radAngle = _this2._degToRad(angle);

          var hyp = _this2._chordLength(radAngle); // RAT: Right Angle Triangle
          // These are the angles of a RAT that overlaps the circle
          // with its hypotenuse being the chord that closes the
          // inner "cut" triangle
          // angleAofRAT = 90 or what else do you think.


          var angleCofRAT = _this2._getLastTwoEqAngles(radAngle);

          var angleBofRAT = RIGHT_ANGLE - angleCofRAT; // what would be the path is the `opp` side with respect
          // to `angleBofRAT` i.e the line that faces it.

          paths.push(_this2._findOppUseSOH(_this2._degToRad(angleBofRAT), hyp));
        });

        return paths;
      }
    }]);

    return CircularPath;
  }(Circle);

  var MAX_THRESHOLD = 1;
  var MIN_ILLEGAL_THRESHOLD = 0;
  var NAV_BOX_SHADOW = '0.2rem 0 0.2rem 0 rgba(0,0,0,.4)';
  var ZERO$1 = 0;
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
  function getData(el, attr) {
    var prop = dataCamelCase(attr); // this may return `undefined` in some Safari

    if (el.dataset && el.dataset[prop]) {
      return el.dataset[prop];
    }

    return getAttribute(el, attr);
  }
  function validateThreshold(tsh) {
    if (tsh < MAX_THRESHOLD && tsh > MIN_ILLEGAL_THRESHOLD) {
      tsh = MAX_THRESHOLD - tsh;
      return tsh;
    } else if (tsh < MIN_ILLEGAL_THRESHOLD) {
      tsh = MAX_THRESHOLD;
      return tsh;
    }

    return MAX_THRESHOLD;
  }
  /**
   * @param {HTMLElement} el an HTMLElement whose style should
   * be accessed
   * @param {string | string[] | {}} property A property/properties
   * to set or get
   * @param {string | number} style value to set as
   * @returns {CSSStyleDeclaration | string} A css style property
   * or CSSStyleDeclaration object
   */

  function css(el, property, style) {
    if (style === void 0) {
      style = null;
    }

    var STYLEMAP = window.getComputedStyle(el);
    style = style || null;
    property = property || null;

    if (typeof property === 'string' && style !== null) {
      // setting one property
      el.style[property] = style;
      return null;
    }

    if (typeof property === 'object' && property instanceof Object) {
      // `style` MUST = null
      // setting many properties
      style = property;

      var _arr = Object.keys(style);

      for (var _i = 0; _i < _arr.length; _i++) {
        var prop = _arr[_i];
        el.style[prop] = style[prop];
      }
    } else if (property instanceof Array) {
      // return all values of properties in the array for
      // the element as object
      var ostyle = {};
      style = STYLEMAP;

      for (var _iterator = style, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
        ostyle[_prop] = style[_prop];
      }

      return ostyle;
    } else {
      // get style from property
      return STYLEMAP[property];
    }

    return STYLEMAP;
  }

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

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== Final.ZERO) {
        this.element.style.bottom = displacement || dimension;
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

  var Vector =
  /*#__PURE__*/
  function () {
    function Vector(x1, y1, x2, y2) {
      this.coordsX = {
        x1: x1,
        x2: x2
      };
      this.coordsY = {
        y1: y1,
        y2: y2
      };
    }

    _createClass(Vector, [{
      key: "displacementX",
      get: function get() {
        return this.coordsX.x2 - this.coordsX.x1;
      }
    }, {
      key: "displacementY",
      get: function get() {
        return this.coordsY.y2 - this.coordsY.y1;
      }
    }]);

    return Vector;
  }();

  var Rectangle$1 =
  /*#__PURE__*/
  function (_Vector) {
    _inheritsLoose(Rectangle, _Vector);

    function Rectangle(x1, y1, x2, y2) {
      return _Vector.call(this, x1, y1, x2, y2) || this;
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
  }(Vector);

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
  var THRESHOLD_VALUE = 0.666;
  var FALSE_TOUCH_START_POINT = 2;

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

      this.width = this.options.SIZE;
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
      this.threshold = validateThreshold(this.threshold); // Touch coordinates (Touch Start)

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

      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      this.positionOnStart = currentPosition;
      var dimension = "-" + (this.width - start) + this.unit;
      var displacement = "-" + (this.width - FALSE_TOUCH_START_POINT) + this.unit;

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== ZERO$1) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ] = e, _response[DIMENSION] = dimension, _response[DISPLACEMENT] = displacement, _response);
        fn.call(this.context || this, response, new Rectangle$1(this.startX, this.startY, -1, -1));
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
      var resume = e.changedTouches[0].pageX || e.changedTouches[0].clientX;
      this.resumeX = resume;
      this.resumeY = e.changedTouches[0].pageY || e.changedTouches[0].clientY;
      var currentPosition = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE : OPEN;
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
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlset = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== ZERO$1 && isBoundX && nextAction === OPEN && this.scrollControl && rect.displacementX > ZERO$1) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ] = e, _response2[DIMENSION] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this.context || this, response, rect);
      } // CLOSE LOGIC


      if (resume <= this.width && currentPosition <= this.width && isBoundX && nextAction === CLOSE && this.scrollControl && rect.displacementX < ZERO$1) {
        var _response4;

        var _response3 = (_response4 = {}, _response4[EVENT_OBJ] = e, _response4[DIMENSION] = vdimension, _response4.close = true, _response4.open = false, _response4);

        fn.call(this.context || this, _response3, rect);
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
      var rect = new Rectangle$1(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Left._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var nonZero = "-" + this.width + "px";
      var zero = "" + ZERO$1;
      var offsetSide = Math.abs(signedOffsetSide);
      var action = OPEN; // release the control for another session

      this.scrollControl = this.scrollControlSet = false; // eslint-disable-line no-multi-assign

      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE : OPEN;
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


      if (nextAction === OPEN && start <= this.maxArea) {
        if (offsetSide <= this.width * threshold) {
          thresholdState.state = [THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        } else {
          thresholdState.state = [BELOW_THRESHOLD, CLOSE];
          thresholdState.stateObj = getResponse(thresholdState.state[0], true);
        }

        fn.call(this, action);
        return;
      } // CLOSE LOGIC


      if (nextAction === CLOSE && rect.displacementX < ZERO$1 && this.resumeX <= this.width) {
        action = CLOSE;

        if (offsetSide > this.width * threshold) {
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
      var displacement = "-" + (this.width - START) + this.unit;

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== ZERO$1) {
        this.element.style.right = displacement || dimension;
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
      var displacement = "-" + (this.height - START) + this.unit;

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition != ZERO$1) {
        this.element.style.top = displacement || dimension;
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

  var BELOW_THRESHOLD$1 = 'belowthreshold';
  var THRESHOLD$1 = 'threshold';
  var START$1 = 'start';
  var MOVE = 'move';
  var END = 'end';

  var SnappedDrawer =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {{}} options an object of configuration options
     */
    function SnappedDrawer(options) {
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
      this._context = null;

      this._setCalibration(this._direction);
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
      var startfn = this._callbacks ? this._callbacks[START$1] : def;
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
      for (var i = 0; i < this.events; i++) {
        this._target.removeEventListener(this.events[i], this._handlers[i]);
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

    _proto._processThresholdState = function _processThresholdState(state) {
      if (Object.keys(state).length < 1) {
        return;
      }

      var thState = state.state[0];
      var vector = state.stateObj.rect;
      delete state.stateObj.rect;

      this._callbacks[thState].call(this._context || this, state.state, state.stateObj, vector);
    };

    _proto._setCalibration = function _setCalibration(point) {
      switch (point) {
        case SnappedDrawer.UP:
          this._callibration = new Top(this._options);
          break;

        case SnappedDrawer.LEFT:
          this._callibration = new Left(this._options);
          break;

        case SnappedDrawer.DOWN:
          this._callibration = new Bottom(this._options);
          break;

        case SnappedDrawer.RIGHT:
          this._callibration = new Right(this._options);
          break;

        default:
          throw RangeError('Direction out of range');
      }
    };

    _proto._registerCallbacks = function _registerCallbacks(event, fn) {
      var _ref;

      this._callbacks = this._callbacks || (_ref = {}, _ref[START$1] = def, _ref[MOVE] = def, _ref[END] = def, _ref[THRESHOLD$1] = def, _ref[BELOW_THRESHOLD$1] = def, _ref);

      if (event in this._callbacks) {
        this._callbacks[event] = fn;
      }
    } // private
    ;

    _proto._register = function _register() {
      for (var _len = arguments.length, handlers = new Array(_len), _key = 0; _key < _len; _key++) {
        handlers[_key] = arguments[_key];
      }

      this._handlers = [].concat(handlers);
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

  var Drawer$1 = function Drawer() {};

  _defineProperty(Drawer$1, "SnappedDrawer", SnappedDrawer);

  _defineProperty(Drawer$1, "UP", SnappedDrawer.UP);

  _defineProperty(Drawer$1, "LEFT", SnappedDrawer.LEFT);

  _defineProperty(Drawer$1, "DOWN", SnappedDrawer.DOWN);

  _defineProperty(Drawer$1, "RIGHT", SnappedDrawer.RIGHT);

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

  var TRANSITION_STYLE = "ease";
  var EFFECT = "transition";
  var TRANS_END = "transitionend";
  var UNIT$1 = "px";

  var NavService =
  /*#__PURE__*/
  function () {
    function NavService(options) {
      this.options = options;
      this.nav = options.ELEMENT;
      this.button = options.INIT_ELEM;
      this.backdrop = options.BACKDROP;
      this.backdropElement = this.backdrop.backdrop;
      this.event = options.DEFAULT_EVENT || 'click';
      this.direction = options.DIRECTION;
      this.width = this.nav.offsetWidth;
      this.trans_time = options.TRANSITION / 1e3;
      this.transition = this.direction + " " + TRANSITION_STYLE + " " + this.trans_time + "s"; // state of the nav, whether open or close

      this.alive = false;
    }

    var _proto = NavService.prototype;

    _proto._width = function _width(unit) {
      unit = unit || "";
      return this.width + unit;
    };

    _proto.activate = function activate() {
      var _this = this;

      this.button.addEventListener(this.event, function (e) {
        _this.handler.call(_this, e);
      });
      this.backdropElement.addEventListener(this.event, function () {
        _this._close();
      });
      this.nav.addEventListener(TRANS_END, function () {
        if (!_this.alive) {
          _this._cleanShadow();
        }
      });
      return 0;
    };

    _proto.handler = function handler() {
      var state = NavService.css(this.nav, this.direction).replace(/[^\d]*$/, '');
      state = /\.(?=\d)/.test(state) ? Math.floor(parseFloat(state)) : parseInt(state);

      if ("" + state + UNIT$1 == "-" + this._width(UNIT$1)) {
        this._open();
      } else {
        this._close();
      }
    };

    _proto._open = function _open() {
      var _style;

      var style = (_style = {}, _style[this.direction] = 0, _style[EFFECT] = this.transition, _style.boxShadow = NAV_BOX_SHADOW, _style);
      NavService.css(this.nav, style);
      this.backdrop.show(this.options.TRANSITION);
      this.alive = true;
    };

    _proto._close = function _close() {
      var _style2;

      var style = (_style2 = {}, _style2[this.direction] = "-" + this._width(UNIT$1), _style2[EFFECT] = this.transition, _style2);
      NavService.css(this.nav, style);
      this.backdrop.hide(this.options.TRANSITION);
      this.alive = false;
    };

    _proto._cleanShadow = function _cleanShadow() {
      NavService.css(this.nav, 'boxShadow', 'none');
    };

    NavService.css = function css$1(el, property, style) {
      return css(el, property, style);
    };

    _proto.deactivate = function deactivate() {
      this.button.removeEventListener(this.event, this.handler);
      return 0;
    };

    return NavService;
  }();

  var TRANSITION_STYLE$1 = 'ease';

  var HashState =
  /*#__PURE__*/
  function () {
    function HashState(options) {
      this.options = options;
      this.nav = options.ELEMENT;
      this.button = options.INIT_ELEM;
      this.backdrop = options.BACKDROP;
      this.event = 'hashchange';
      this.direction = options.DIRECTION;
      this.width = this.nav.offSetWidth;
      this.trans_time = options.transition / 1e3;
      this.transition = this.direction + " " + TRANSITION_STYLE$1 + " " + this.trans_time + "s"; // state of the nav, whether open or close

      this.alive = false;
    }

    var _proto = HashState.prototype;

    _proto.activate = function activate() {
      window.addEventListener(this.event, this.handler);
      return 0;
    };

    _proto.handler = function handler(e) {
      var hash = HashState._getHash(e);

      var ns = new NavService(this.options);

      if (hash === null) {
        ns._close();
      } else if (hash === this.button.getAttribute('href')) {
        ns._open();
      } else {
        return;
      }
    };

    HashState._getHash = function _getHash(e) {
      var hash = e.newURL;
      var indexOfHash = hash.lastIndexOf('#');
      hash = indexOfHash !== -1 ? hash.slice(indexOfHash).replace(/(?:[^\w\d-]+)$/) : null;
      return hash;
    };

    _proto.deactivate = function deactivate() {
      window.removeEventListener(this.event, this.handler);
      return 0;
    };

    return HashState;
  }();

  var ZERO$2 = 0;
  var KILO = 1e3;
  var MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.7;
  var MIN_POSITIVE_DISPLACEMENT = 40;
  var MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT;
  var TRANSITION_STYLE$2 = 'linear';
  var EFFECT$1 = 'transition';
  var TRANS_TIMING = '0.1s'; // This value is basic, the calc'ed value will depend on drawer speed

  var TRANS_TEMPLATE = TRANSITION_STYLE$2 + " " + TRANS_TIMING;
  var HIDDEN = 'hidden';
  var SCROLL = 'scroll';
  var START$2 = 'start';
  var MOVE$1 = 'move';
  var THRESHOLD$2 = 'threshold';
  var BELOW_THRESHOLD$2 = "below" + THRESHOLD$2;
  var DIRECTIONS = ['top', 'left', 'bottom', 'right'];

  var NavDrawer =
  /*#__PURE__*/
  function () {
    /**
     * Creates a new NavDrawer object. Providing the Left and Right
     * Drawer functionality.
     * Support for Top and Bottom may come in the future
     * @throws RangeError
     * @param {{}} options An options Object to configure the Drawer with
     */
    function NavDrawer(options) {
      this.options = options;
      /**
       * @type {HTMLElement}
       */

      this.element = this.options.ELEMENT;
      /**
       * @type {HTMLBodyElement}
       */

      this._body = this.options.BODY;
      this._backdrop = this.options.BACKDROP;
      /**
       * @type {number}
       */

      this.direction = this.options.DIRECTION;
      this.checkDirection();
      this.directionString = DIRECTIONS[this.direction];

      var o = _extends({}, options, {
        SIZE: this.elementSize,
        TARGET: document
      });

      this.drawer = new Drawer$1.SnappedDrawer(o);
      this.transition = this.directionString + " " + TRANS_TEMPLATE;
    }

    var _proto = NavDrawer.prototype;

    _proto.checkDirection = function checkDirection() {
      if (this.direction !== Drawer$1.LEFT && this.direction !== Drawer$1.RIGHT) {
        throw RangeError('Direction out of range');
      }
    };

    _proto.activate = function activate() {
      this.drawer.on(START$2, this._startHandler).on(MOVE$1, this._moveHandler).on(THRESHOLD$2, this._threshold).on(BELOW_THRESHOLD$2, this._belowThreshold).setContext(this).activate();
      return 0;
    };

    _proto.deactivate = function deactivate() {
      this.drawer.deactivate();
      return 0;
    };

    _proto._startHandler = function _startHandler(response, rectangle) {
      this.element.style[this.directionString] = response.displacement;
      this.element.style.boxShadow = NAV_BOX_SHADOW;
      this.element.style[EFFECT$1] = this.transition;
      this._body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(response, rectangle) {
      var curPos = this.direction === Drawer$1.UP || this.direction === Drawer$1.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2;
      this.element.style[this.directionString] = response.dimension;
      this.element.style[EFFECT$1] = this.transition;

      this._backdrop.setOpacity(curPos / this.elementSize);
    };

    _proto._threshold = function _threshold(state, stateObj) {
      var isOpen = state[1] === 'open';
      var options = {
        stateObj: stateObj
      };

      if (isOpen) {
        this._hide(options);
      } else {
        this._show(options);
      }
    };

    _proto._belowThreshold = function _belowThreshold(state, stateObj, rect) {
      var isClosed = state[1] !== 'open';
      var overallEventTime = stateObj.TIMING;
      var MTTOB = MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD;
      var MPD = MIN_POSITIVE_DISPLACEMENT;
      var MND = MIN_NEGATIVE_DISPLACEMENT;
      var displacement = this.direction === Drawer$1.UP || this.direction === Drawer$1.DOWN ? rect.displacementY : rect.displacementX;
      var options = {
        stateObj: stateObj
      };
      var LOGIC = this.direction === Drawer$1.LEFT ? displacement > ZERO$2 && displacement >= MPD && rect.greaterWidth : displacement < ZERO$2 && displacement <= MND && rect.greaterWidth;

      if (overallEventTime / KILO < MTTOB) {
        console.log(overallEventTime); // DIRECTION: Drawer.UP | Drawer.LEFT

        if (LOGIC) {
          console.log(true);

          this.__overrideBelowThresh(!isClosed, options);
        } else {
          if (isClosed) {
            // close it back didn't hit thresh. and can't override
            this._hide(options);
          } else {
            // open it back didn't hit thresh. and can't override because not enough displacement
            this._show(options);
          }
        }
      } else {
        if (isClosed) {
          // close it back didn't hit thresh. and can't override because not enough velocity or displacement
          this._hide(options);
        } else {
          // open it back didn't hit thresh. and can't override because not enough velocity or displacement
          this._show(options);
        }
      }
    };

    _proto._show = function _show(options) {
      this._body.style.overflow = HIDDEN;

      this._backdrop.show(this.options.TRANSITION);

      this.element.style[this.directionString] = options.stateObj.dimension;
    };

    _proto._hide = function _hide(options) {
      this._body.style.overflow = SCROLL;

      this._backdrop.hide(this.options.TRANSITION);

      this.element.style[this.directionString] = options.stateObj.dimension;
      this.element.style.boxShadow = 'none';
    };

    _proto.__overrideBelowThresh = function __overrideBelowThresh(isOpen, options) {
      if (isOpen) {
        this._body.style.overflow = SCROLL;

        this._backdrop.hide(this.options.TRANSITION);

        this.element.style[this.directionString] = options.stateObj.oppositeDimension;
        this.element.style.boxShadow = 'none';
      } else {
        this._body.style.overflow = HIDDEN;

        this._backdrop.show(this.options.TRANSITION);

        this.element.style[this.directionString] = options.stateObj.oppositeDimension;
      }
    };

    _createClass(NavDrawer, [{
      key: "elementSize",
      get: function get() {
        var axis = this.direction;

        if (axis === Drawer$1.UP || axis === Drawer$1.DOWN) {
          return this.element.offsetHeight;
        } else {
          return this.element.offsetWidth;
        }
      }
    }]);

    return NavDrawer;
  }();

  var BACKDROP = "backdrop";
  var DEF_CLASSNAME = "cardinal-navcard";
  var MEDIA_HASH = "data-hash-max-width";
  var MEDIA_DRAW = "data-draw-max-width";
  var _CLASS = "class";
  var EVENTS = {
    touchend: "touchend",
    touchmove: "touchmove",
    touchstart: "touchstart"
  };

  var NavCard =
  /*#__PURE__*/
  function () {
    function NavCard() {
      // **Do not insert the below element into DOM**

      /**
       * **Covert Backdrop**
       * just incase `options.backdrop = false`
       * prevent multiple `if` statements
       * so we don't have to check whether
       * backdrop is enabled anytime we want to access it
       * insert into DOM only:
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
        left: 0,
        zIndex: -1
      });
      this.body = document.body; // init with null

      this.Drawer = null;
      this.NavService = null;
      this.HashState = null;
      NavCard.defaultConfig = {
        type: "nav",
        transition: 500,
        event: "click",
        direction: "left",
        backdrop: false,
        backdropClass: null,
        accessAttr: "data-target",
        maxStartArea: 25,
        threshold: 1 / 2,
        unit: 'px'
      };
      NavCard.API = {
        DEFAULT: 0,
        DRAWER: 1,
        HASH: 2
      };
    }

    var _proto = NavCard.prototype;

    _proto.setup = function setup(_elem, options) {
      var element, backdrop, dataAccess, opts, HASH_NAV_MAX_WIDTH, NAV_DRAW_MAX_WIDTH, destinationId, destination;
      opts = NavCard.defaultConfig;

      if (options && "object" === typeof options) {
        var _arr = Object.keys(options);

        for (var _i = 0; _i < _arr.length; _i++) {
          var prop = _arr[_i];
          if (opts.hasOwnProperty(prop)) opts[prop] = options[prop];else continue;
        }
      }

      if (opts.backdrop) {
        var backdrop_class = !!opts.backdropClass ? opts.backdropClass : false; // if `opts.backdrop` and no `backdrop_class` given
        // append our custom backdrop

        if (!backdrop_class) this.body.append(this.backdrop);

        if (typeof backdrop_class === 'string') {
          // check if backdrop_class is normal string or css class selector
          backdrop = /^\./.test(backdrop_class) ? backdrop_class : "." + backdrop_class;
          this.backdrop = $(backdrop);
        }
      }

      dataAccess = opts.accessAttr;
      /**
       * Initialization element e.g <button ...</button>
       */

      element = $(_elem);
      destinationId = getData(element, dataAccess); // check if the data-* attribute value is a valid css selector
      // if not prepend a '#' to it as id selector is default

      var isCSS_Selector = /^(?:\#|\.|\u005b[^\u005c]\u005c)/.test(destinationId),
          isClass = /^\./.test(destinationId);
      destinationId = isCSS_Selector ? destinationId : "#" + destinationId;
      destination = $(destinationId); // we want a class too so in case we've got an id selector
      // find the classname or assign a unique class

      var default_class = DEF_CLASSNAME + "-" + unique(2 << 7);
      var classname = isClass ? destinationId : hasAttribute(destination, _CLASS) ? getAttribute(destination, _CLASS) : (setAttribute(destination, _CLASS, default_class), default_class);
      var classlist = classname.split(/\s+/);
      classname = "." + (classlist.length >= 2 ? classlist[0] + "." + classlist[1] : classname);
      destination = isClass ? destination : $(classname); // These attributes are used for the RWD(Responsive Web Design)
      // features. The navigation drawer module is best suited for mobile
      // touch devices. The program shouldn't listen for certain events on
      // desktop devices as side-nav may be hidden. The attribute here are
      // the screen sizes after which the nav is hidden.

      HASH_NAV_MAX_WIDTH = getData(destination, MEDIA_HASH);
      NAV_DRAW_MAX_WIDTH = getData(destination, MEDIA_DRAW);
      HASH_NAV_MAX_WIDTH = /px$/.test(HASH_NAV_MAX_WIDTH) ? HASH_NAV_MAX_WIDTH : HASH_NAV_MAX_WIDTH + "px";
      NAV_DRAW_MAX_WIDTH = /px$/.test(NAV_DRAW_MAX_WIDTH) ? NAV_DRAW_MAX_WIDTH : NAV_DRAW_MAX_WIDTH + "px";
      var defaultOptions = {
        ELEMENT: destination,
        INIT_ELEM: element,
        BACKDROP: new Backdrop(this.backdrop),
        BODY: this.body,
        TRANSITION: opts.transition,
        DIRECTION: ['top', 'left', 'bottom', 'right'][opts.direction],
        unit: options.unit
      };

      var drawerOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: NAV_DRAW_MAX_WIDTH
      }, EVENTS, {
        DIRECTION: opts.direction,
        maxStartArea: opts.maxStartArea,
        threshold: opts.threshold
      });

      var hashOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: HASH_NAV_MAX_WIDTH
      });

      this._drawerAPI(drawerOptions).activate();

      this._hashAPI(hashOptions).activate();

      this._defaultAPI(defaultOptions).activate();
    };

    _proto._drawerAPI = function _drawerAPI(options) {
      var _this = this;

      this.Drawer = new NavDrawer(options);
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

      this.HashState = new HashState(options);
      return {
        activate: function activate() {
          return _this2.HashState.activate();
        },
        deactivate: function deactivate() {
          return _this2.HashState.deactivate();
        }
      };
    };

    _proto._defaultAPI = function _defaultAPI(options) {
      var _this3 = this;

      this.NavService = new NavService(options);
      return {
        activate: function activate() {
          return _this3.NavService.activate();
        },
        deactivate: function deactivate() {
          return _this3.NavService.deactivate();
        }
      };
    };

    _proto.terminate = function terminate(state) {
      // this._*API(null).deactivate()
      switch (state) {
        case NavCard.API.DEFAULT:
          if (this.NavService instanceof NavService) this.NavService.deactivate();
          break;

        case NavCard.API.DRAWER:
          if (this.Drawer instanceof Drawer) this.Drawer.deactivate();
          break;

        case NavCard.API.HASH:
          if (this.HashState instanceof HashState) this.HashState.deactivate();
          break;

        default:
          this._drawerAPI(null).deactivate();

          this._hashAPI(null).deactivate();

          this._defaultAPI(null).deactivate();

      }
    };

    return NavCard;
  }();

  var Cardinal = function Cardinal() {};

  _defineProperty(Cardinal, "CircularPath", CircularPath);

  _defineProperty(Cardinal, "Drawer", Drawer$1);

  _defineProperty(Cardinal, "Nav", NavCard);

  return Cardinal;

}));
//# sourceMappingURL=cardinal.js.map
