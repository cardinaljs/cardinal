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
    };

    _proto._firstPath = function _firstPath() {
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
    };

    _proto._resolvePath = function _resolvePath(val, quadrant) {
      var _this3 = this;

      var paths = [];

      this._angles.forEach(function (angle) {
        if (angle === ZERO || angle <= POINT_ANGLE && angle % RIGHT_ANGLE === ZERO) {
          paths.push(_this3.radius);
          return;
        }

        _this3._quad = _this3._getQuadrant(angle);
        angle = _this3._quad !== Quadrant.FIRST ? _this3._quad - angle : angle;

        var radAngle = _this3._degToRad(angle);

        var hyp = _this3._chordLength(radAngle); // RAT: Right Angle Triangle
        // These are the angles of a RAT that overlaps the circle
        // with its hypotenuse being the chord that closes the
        // inner "cut" triangle
        // angleAofRAT = 90 or what else do you think.


        var angleCofRAT = _this3._getLastTwoEqAngles(radAngle);

        var angleBofRAT = RIGHT_ANGLE - angleCofRAT; // what would be the path is the `opp` side with respect
        // to `angleBofRAT` i.e the line that faces it.

        paths.push(_this3._findOppUseSOH(_this3._degToRad(angleBofRAT), hyp));
      });

      return paths;
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
      key: "path",
      get: function get() {}
    }]);

    return CircularPath;
  }(Circle);

  // constants
  var BLUR_SPREAD_SHADE = '0.7rem 0 rgba(0,0,0,.3)';
  var NAV_BOX_SHADOW = {
    top: "0 0.2rem " + BLUR_SPREAD_SHADE,
    left: "0.2rem 0 " + BLUR_SPREAD_SHADE,
    bottom: "0 -0.2rem " + BLUR_SPREAD_SHADE,
    right: "-0.2rem 0 " + BLUR_SPREAD_SHADE
  };
  var ZERO$1 = 0;
  var DIRECTIONS = ['top', 'left', 'bottom', 'right']; // classes
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
  function getData(el, attr) {
    var prop = dataCamelCase(attr); // this may return `undefined` in some Safari

    if (el.dataset && el.dataset[prop]) {
      return el.dataset[prop];
    }

    return getAttribute(el, attr);
  }
  function validateThreshold(tsh) {
    var MAX_THRESHOLD = 1;
    var MIN_ILLEGAL_THRESHOLD = 0;

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
    var STYLEMAP = window.getComputedStyle(el);

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
    } else if (property instanceof Array) {
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
    } else {
      // get style from property
      return STYLEMAP[property];
    }

    return STYLEMAP;
  }

  var VectorRectangle =
  /*#__PURE__*/
  function () {
    function VectorRectangle(x1, y1, x2, y2) {
      this.coordsX = {
        x1: x1,
        x2: x2
      };
      this.coordsY = {
        y1: y1,
        y2: y2
      };
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
  }();

  var Rectangle =
  /*#__PURE__*/
  function (_VectorRectangle) {
    _inheritsLoose(Rectangle, _VectorRectangle);

    // eslint-disable-next-line no-useless-constructor
    function Rectangle(x1, y1, x2, y2) {
      return _VectorRectangle.call(this, x1, y1, x2, y2) || this;
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
  }(VectorRectangle);

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

      if (start <= WIN_HEIGHT && start >= this.minArea && currentPosition !== ZERO$1) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ] = e, _response[DIMENSION] = dimension, _response[DISPLACEMENT] = displacement, _response);
        fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1));
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
      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE : OPEN;
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
      var rect = new Rectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_HEIGHT && (start >= this.minArea || start >= FALSE_HEIGHT + currentPosition) && currentPosition !== ZERO$1 && isBoundY && nextAction === OPEN && this.scrollControl && rect.displacementY < ZERO$1) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ] = e, _response2[DIMENSION] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_HEIGHT && Math.abs(currentPosition) < height - bound.lower && isBoundY && nextAction === CLOSE && this.scrollControl && rect.displacementY > ZERO$1) {
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
      var rect = new Rectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Bottom._getStyle(this.element)[DIRECTION].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO$1;
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


      if (rect.displacementY < ZERO$1 && (start >= this.minArea || start >= FALSE_HEIGHT + signedOffsetSide)) {
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


      if (rect.displacementY > ZERO$1 && this.resumeY >= FALSE_HEIGHT) {
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

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== ZERO$1) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$1] = e, _response[DIMENSION$1] = dimension, _response[DISPLACEMENT$1] = displacement, _response);
        fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1));
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
      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE$1 : OPEN$1;
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
      var rect = new Rectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= ZERO$1 && (start <= this.maxArea || start <= width + currentPosition) && currentPosition !== ZERO$1 && isBoundX && nextAction === OPEN$1 && this.scrollControl && rect.displacementX > ZERO$1) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$1] = e, _response2[DIMENSION$1] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume <= width && Math.abs(currentPosition) < width - bound.lower && isBoundX && nextAction === CLOSE$1 && this.scrollControl && rect.displacementX < ZERO$1) {
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
      var rect = new Rectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Left._getStyle(this.element)[DIRECTION$1].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO$1;
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
      } // OPEN LOGIC


      if (rect.displacementX > ZERO$1 && (start <= this.maxArea || start <= width + signedOffsetSide)) {
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


      if (rect.displacementX < ZERO$1 && this.resumeX <= this.width) {
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

      this.startX = -1;
      this.startY = -1;
      this.resumeX = -1;
      this.resumeY = -1;
      this.endX = -1;
      this.endY = -1;
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

      if (start <= WIN_WIDTH && start >= this.minArea && currentPosition !== ZERO$1) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$2] = e, _response[DIMENSION$2] = dimension, _response[DISPLACEMENT$2] = displacement, _response);
        fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1));
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
      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE$2 : OPEN$2;
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
      var rect = new Rectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundX = rect.greaterWidth;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundX;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start <= WIN_WIDTH && (start >= this.minArea || start >= FALSE_WIDTH + currentPosition) && currentPosition !== ZERO$1 && isBoundX && nextAction === OPEN$2 && this.scrollControl && rect.displacementX < ZERO$1) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$2] = e, _response2[DIMENSION$2] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume >= FALSE_WIDTH && Math.abs(currentPosition) < width - bound.lower && isBoundX && nextAction === CLOSE$2 && this.scrollControl && rect.displacementX > ZERO$1) {
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
      var rect = new Rectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startX;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Right._getStyle(this.element)[DIRECTION$2].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO$1;
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
      } // OPEN LOGIC


      if (rect.displacementX < ZERO$1 && (start >= this.minArea || start >= FALSE_WIDTH + signedOffsetSide)) {
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


      if (rect.displacementX > ZERO$1 && this.resumeX >= FALSE_WIDTH) {
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

      if (start >= ZERO$1 && start <= this.maxArea && currentPosition !== ZERO$1) {
        var _response;

        var response = (_response = {}, _response[EVENT_OBJ$3] = e, _response[DIMENSION$3] = dimension, _response[DISPLACEMENT$3] = displacement, _response);
        fn.call(this._context, response, new Rectangle(this.startX, this.startY, -1, -1));
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
      var nextAction = this.positionOnStart === ZERO$1 ? CLOSE$3 : OPEN$3;
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
      var rect = new Rectangle(this.startX, this.startY, this.resumeX, this.resumeY);
      var isBoundY = rect.greaterHeight;

      if (!this.scrollControlSet) {
        this.scrollControl = isBoundY;
        this.scrollControlSet = !this.scrollControlSet;
      } // OPEN LOGIC


      if (start >= ZERO$1 && (start <= this.maxArea || start <= height + currentPosition) && currentPosition !== ZERO$1 && isBoundY && nextAction === OPEN$3 && this.scrollControl && rect.displacementY > ZERO$1) {
        var _response2;

        var response = (_response2 = {}, _response2[EVENT_OBJ$3] = e, _response2[DIMENSION$3] = dimension, _response2.open = true, _response2.close = false, _response2);
        fn.call(this._context, response, rect);
      } // CLOSE LOGIC


      if (resume <= this.height && Math.abs(currentPosition) < height - bound.lower && isBoundY && nextAction === CLOSE$3 && this.scrollControl && rect.displacementY < ZERO$1) {
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
      var rect = new Rectangle(this.startX, this.startY, this.endX, this.endY);
      var start = this.startY;
      var TIMING = this.timing.end.getTime() - this.timing.start.getTime();
      var threshold = this.threshold;
      var signedOffsetSide = parseFloat(Top._getStyle(this.element)[DIRECTION$3].replace(/[^\d]*$/, ''));
      var bound = this.bound;
      var nonZero = "" + bound.slack + this.unit;
      var zero = "" + ZERO$1;
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
      } // OPEN LOGIC


      if (rect.displacementY > ZERO$1 && (start <= this.maxArea || start <= height + signedOffsetSide)) {
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


      if (rect.displacementY < ZERO$1 && this.resumeY <= this.height) {
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
      return '[object SnappedDrawer]';
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

  var STATE = {
    navstate: null
  };

  var HashState =
  /*#__PURE__*/
  function () {
    function HashState(parentService, options) {
      this.options = options;
      this.parentService = parentService;
      this.button = options.INIT_ELEM;
      this.event = 'hashchange';
      this.handler = null;
    }

    var _proto = HashState.prototype;

    _proto.activate = function activate() {
      var _this = this;

      var handler = function handler(e) {
        _this._hashchange(e);
      };

      this._register(handler);

      window.addEventListener(this.event, this.handler);
      return 0;
    };

    _proto.deactivate = function deactivate() {
      window.removeEventListener(this.event, this.handler);

      this._register(null);

      return 0;
    };

    _proto._hashchange = function _hashchange(e) {
      var oldHash = HashState._getHash(e.oldURL);

      if (oldHash === getAttribute(this.button, 'href') && STATE.navstate && STATE.navstate.alive) {
        this.parentService._close();
      }
    };

    _proto._register = function _register(handler) {
      this.handler = handler;
    };

    HashState._getHash = function _getHash(uri) {
      var hash = uri;
      var indexOfHash = hash.lastIndexOf('#');
      hash = indexOfHash !== -1 ? hash.slice(indexOfHash).replace(/(?:[^\w\d-]+)$/) : null;
      return hash;
    };

    return HashState;
  }();

  var ZERO$2 = 0;
  var KILO = 1e3;
  var MIN_TIME_TO_OVERRIDE_BELOWTHRESHOLD = 0.5;
  var MIN_POSITIVE_DISPLACEMENT = 10;
  var MIN_NEGATIVE_DISPLACEMENT = -MIN_POSITIVE_DISPLACEMENT;
  var TRANSITION_STYLE = 'linear';
  var EFFECT = 'transition';
  var OVERFLOW = 'overflow';
  var TRANS_TIMING = '0.1s';
  var TRANS_TEMPLATE = TRANSITION_STYLE + " " + TRANS_TIMING;
  var HIDDEN = 'hidden';
  var SCROLL = 'scroll';
  var HREF = 'href';
  var HASH_ATTR = "data-" + HREF;
  var START$1 = 'start';
  var MOVE$1 = 'move';
  var THRESHOLD$5 = 'threshold';
  var BELOW_THRESHOLD$5 = "below" + THRESHOLD$5;
  var MAX_TIME = KILO;
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
     */
    function NavDrawer(options) {
      this.options = options;
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

      this.drawer = new Drawer.SnappedDrawer(o, this.bound);
      this.transition = this.directionString + " " + TRANS_TEMPLATE;
    }

    var _proto = NavDrawer.prototype;

    _proto.activate = function activate() {
      this.drawer.on(START$1, this._startHandler).on(MOVE$1, this._moveHandler).on(THRESHOLD$5, this._threshold).on(BELOW_THRESHOLD$5, this._belowThreshold).setContext(this).activate();
      return 0;
    };

    _proto.deactivate = function deactivate() {
      this.drawer.deactivate();
      return 0;
    };

    _proto._startHandler = function _startHandler(response) {
      var _css;

      css(this.element, (_css = {}, _css[this.directionString] = response.dimension, _css.boxShadow = NAV_BOX_SHADOW[this.directionString], _css[EFFECT] = this.transition, _css));
      this._body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(response, rectangle) {
      var _css2;

      var curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2;
      css(this.element, (_css2 = {}, _css2[this.directionString] = response.dimension, _css2[EFFECT] = 'none', _css2[OVERFLOW] = HIDDEN, _css2));

      if (this.direction === Drawer.RIGHT) {
        var WIN_SIZE = window.screen.availWidth;
        curPos = WIN_SIZE - curPos;

        this._backdrop.setOpacity(curPos / this.elementSize);

        return;
      }

      this._backdrop.setOpacity(curPos / this.elementSize);
    };

    _proto._threshold = function _threshold(state, stateObj) {
      var isOpen = state[1] === 'open';
      var options = {
        stateObj: stateObj,
        transition: this.directionString + " ease " + this._calcSpeed(stateObj.TIMING) / KILO + "s"
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
      var displacement = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rect.displacementY : rect.displacementX;
      var options = {
        stateObj: stateObj,
        transition: this.directionString + " ease " + this._calcSpeed(stateObj.TIMING) / KILO + "s"
      };
      var LOGIC;

      if (this.direction === Drawer.LEFT && isClosed || this.direction === Drawer.RIGHT && !isClosed) {
        LOGIC = displacement > ZERO$2 && displacement >= MPD && rect.greaterWidth;
      } else {
        LOGIC = displacement < ZERO$2 && displacement <= MND && rect.greaterWidth;
      }

      if (overallEventTime / KILO < MTTOB) {
        // DIRECTION: Drawer.UP | Drawer.LEFT
        if (LOGIC) {
          this._overrideBelowThresh(!isClosed, options);
        } else {
          if (isClosed) {
            // close it back didn't hit thresh. and can't override
            this._hide(options);

            return;
          } // open it back didn't hit thresh. and can't override because not enough displacement


          this._show(options);
        }
      } else {
        if (isClosed) {
          // close it back didn't hit thresh. and can't override because not enough velocity or displacement
          this._hide(options);

          return;
        } // open it back didn't hit thresh. and can't override because not enough velocity or displacement


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

      this._body.style.overflow = SCROLL;

      this._backdrop.hide(this.options.TRANSITION);

      css(this.element, (_css3 = {}, _css3[EFFECT] = options.transition, _css3[OVERFLOW] = SCROLL, _css3));

      if (!this.bound.lower) {
        this.element.style.boxShadow = 'none';
      }

      this._setState('open');
    };

    _proto._showPrep = function _showPrep(options) {
      var _css4;

      window.location.hash = getAttribute(this.options.INIT_ELEM, HREF) || getData(this.options.INIT_ELEM, HASH_ATTR);
      this._body.style.overflow = HIDDEN;

      this._backdrop.show(this.options.TRANSITION);

      css(this.element, (_css4 = {}, _css4[EFFECT] = options.transition, _css4[OVERFLOW] = SCROLL, _css4));

      this._setState('open');
    };

    _proto._calcSpeed = function _calcSpeed(time) {
      if (time >= MAX_TIME) {
        return MAX_SPEED;
      }

      var percent = 100;
      var percentage = time / MAX_TIME * percent;
      return percentage / percent * MAX_SPEED;
    };

    _proto._checkDirection = function _checkDirection() {
      if (this.direction !== Drawer.LEFT && this.direction !== Drawer.RIGHT) {
        throw RangeError('Direction out of range');
      }
    };

    _proto._setState = function _setState(mode) {
      switch (mode) {
        case 'open':
          STATE.navstate = {
            alive: true,
            activity: {
              service: this,
              action: mode
            }
          };
          break;

        case 'close':
          STATE.navstate = {
            alive: false,
            activity: {
              service: this,
              action: mode
            }
          };
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
        var curPos = css(this.element, this.directionString).replace(/[^\d]*$/, '');
        var upperBound = this.elementSize;
        var lowerBound = upperBound + parseInt(curPos, 10);
        return new Bound(lowerBound, upperBound);
      }
    }]);

    return NavDrawer;
  }();

  var TRANSITION_STYLE$1 = 'ease';
  var EFFECT$1 = 'transition';
  var TRANS_END = 'transitionend';

  var NavService =
  /*#__PURE__*/
  function () {
    function NavService(options) {
      this.options = options;
      this.nav = options.ELEMENT;
      this.button = options.INIT_ELEM;
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

      this._closeClicked = false;
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

      var ClickHandler = function ClickHandler(e) {
        _this.handler(e);
      };

      var BackdropHandler = function BackdropHandler() {
        _this._close();
      };

      var TransitionHandler = function TransitionHandler() {
        if (!_this.alive && _this._closeClicked) {
          _this._cleanShadow();

          _this._closeClicked = false;
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
      throw new ReferenceError('cannot deactivate API specified as default. This service must be kept running');
    };

    _proto.forceDeactivate = function forceDeactivate() {
      this.button.removeEventListener(this.event, this._handlers.ClickHandler);
      this.backdropElement.removeEventListener(this.event, this._handlers.BackdropHandler);

      if (this._initialState === "-" + this._width('px')) {
        this.nav.removeEventListener(TRANS_END, this._handlers.TransitionHandler);
      }

      this._register(null);
    };

    _proto.handler = function handler(e) {
      e.preventDefault();
      window.location.hash = getAttribute(this.button, 'href');

      var state = NavService._toNum(NavService.css(this.nav, this.direction));

      if (state < ZERO$1) {
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

      var style = (_style = {}, _style[this.direction] = ZERO$1, _style[EFFECT$1] = this.transition, _style.boxShadow = NAV_BOX_SHADOW[this.direction], _style);
      NavService.css(this.nav, style);
      this.backdrop.show(this.options.TRANSITION);
      this.alive = true;
      var state = {
        alive: this.alive,
        activity: {
          service: this,
          action: 'open'
        }
      };
      STATE.navstate = state;
    };

    _proto._close = function _close() {
      var _style2;

      var style = (_style2 = {}, _style2[this.direction] = this._initialState, _style2[EFFECT$1] = this.transition, _style2);
      NavService.css(this.nav, style);
      this.backdrop.hide(this.options.TRANSITION);
      this.alive = false;
      this._closeClicked = true;
      var state = {
        alive: this.alive,
        activity: {
          service: this,
          action: 'close'
        }
      };
      STATE.navstate = state;
    };

    _proto._cleanShadow = function _cleanShadow() {
      NavService.css(this.nav, 'boxShadow', 'none');
    };

    return NavService;
  }();

  var BACKDROP = 'backdrop';
  var DEF_CLASSNAME = 'cardinal-navcard';
  var MEDIA_HASH = 'data-hash-max-width';
  var MEDIA_DRAW = 'data-draw-max-width';
  var _CLASS = 'class';

  var NavCard =
  /*#__PURE__*/
  function () {
    function NavCard() {
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
      this.body = document.body;
      this.Drawer = null;
      this.NavService = null;
      this.HashState = null;
    }

    var _proto = NavCard.prototype;

    _proto.setup = function setup(el, options) {
      if (!el) {
        throw new TypeError('expected \'el\' to be selector string or HTMLElement');
      }

      var _ = 1,
          backdrop = _.backdrop,
          HASH_NAV_MAX_WIDTH = _.HASH_NAV_MAX_WIDTH,
          NAV_DRAW_MAX_WIDTH = _.NAV_DRAW_MAX_WIDTH,
          destinationId = _.destinationId,
          destination = _.destination;
      var opts = NavCard.defaultConfig;

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

      var dataAccess = opts.accessAttr;
      /**
       * Initialization element e.g <button ...</button>
       */

      var element = el instanceof HTMLElement ? el : $(el);
      destinationId = getData(element, dataAccess); // check if the data-* attribute value is a valid css selector
      // if not prepend a '#' to it as id selector is default

      var isCSSSelector = /^(?:#|\.|\u005b[^\u005c]\u005c)/.test(destinationId);
      var isClass = /^\./.test(destinationId);
      destinationId = isCSSSelector ? destinationId : "#" + destinationId;
      destination = $(destinationId); // we want a class too, so in case we've got an id selector
      // find the classname or assign a unique class

      var defaultClass = DEF_CLASSNAME + "-" + unique(2 << 7); // eslint-disable-next-line no-nested-ternary

      var classname = isClass ? destinationId : hasAttribute(destination, _CLASS) ? getAttribute(destination, _CLASS) : (setAttribute(destination, _CLASS, defaultClass), defaultClass);
      var classlist = classname.split(/\s+/); // eslint-disable-next-line prefer-template

      classname = '.' + (classlist.length >= 2 ? classlist[0] + '.' + classlist[1] : classname);
      destination = isClass ? destination : $(classname);

      if (opts.backdrop) {
        var backdropclass = opts.backdropClass || false; // if `opts.backdrop` and no `backdropclass` given
        // append our custom backdrop

        if (!backdropclass) {
          destination.insertAdjacentElement('beforeBegin', this.backdrop);
        }

        if (typeof backdropclass === 'string') {
          // check if backdropclass is normal string or css class selector
          backdrop = /^\./.test(backdropclass) ? backdropclass : "." + backdropclass;
          this.backdrop = $(backdrop);
        }
      }

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
        DIRECTION: DIRECTIONS[opts.direction],
        unit: options.unit
      };

      var drawerOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: NAV_DRAW_MAX_WIDTH,
        DIRECTION: opts.direction,
        maxStartArea: opts.maxStartArea,
        threshold: opts.threshold
      });

      var hashOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: HASH_NAV_MAX_WIDTH
      });

      return new NavMountWorker(Object.assign({}, {
        defaultOptions: defaultOptions
      }, {
        drawerOptions: drawerOptions
      }, {
        hashOptions: hashOptions
      }));
    };

    _proto.toString = function toString() {
      return '[object NavCard]';
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

      this.HashState = new HashState(this.NavService, options);
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

    _proto.terminate = function terminate(service) {
      // this._*API(null).deactivate()
      switch (service) {
        case NavCard.SERVICES.Default:
          if (this.NavService instanceof NavService) {
            this.NavService.deactivate();
          }

          break;

        case NavCard.SERVICES.Drawer:
          if (this.Drawer instanceof NavDrawer) {
            this.Drawer.deactivate();
          }

          break;

        case NavCard.SERVICES.Hash:
          if (this.HashState instanceof HashState) {
            this.HashState.deactivate();
          }

          break;

        default:
          throw new Error('a service id is required');
      }
    };

    return NavCard;
  }();

  _defineProperty(NavCard, "defaultConfig", {
    transition: 500,
    direction: 'left',
    backdrop: false,
    backdropClass: null,
    accessAttr: 'data-target',
    maxStartArea: 25,
    threshold: 1 / 2,
    unit: 'px'
  });

  _defineProperty(NavCard, "SERVICES", {
    Default: 2,
    Drawer: 4,
    Hash: 8
  });

  var NavMountWorker =
  /*#__PURE__*/
  function (_NavCard) {
    _inheritsLoose(NavMountWorker, _NavCard);

    function NavMountWorker(options) {
      var _this4;

      _this4 = _NavCard.call(this) || this;
      _this4.options = options;
      return _this4;
    }

    var _proto2 = NavMountWorker.prototype;

    _proto2.mount = function mount() {
      this._defaultAPI(this.options.defaultOptions).activate();

      this._drawerAPI(this.options.drawerOptions).activate();

      this._hashAPI(this.options.hashOptions).activate();
    };

    _proto2.unmount = function unmount() {
      this.NavService.forceDeactivate();
      this.Drawer.deactivate();
      this.HashState.deactivate();
    };

    return NavMountWorker;
  }(NavCard);

  var Cardinal = function Cardinal() {};

  _defineProperty(Cardinal, "CircularPath", CircularPath);

  _defineProperty(Cardinal, "Drawer", Drawer);

  _defineProperty(Cardinal, "Nav", NavCard);

  return Cardinal;

}));
//# sourceMappingURL=cardinal.js.map
