/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-05-18T16:00:25.142Z
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
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../drawer/index.js')) :
  typeof define === 'function' && define.amd ? define(['../drawer/index.js'], factory) :
  (global = global || self, global.Nav = factory(global.Drawer));
}(this, function (Drawer) { 'use strict';

  Drawer = Drawer && Drawer.hasOwnProperty('default') ? Drawer['default'] : Drawer;

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

  var ZERO$1 = 0;
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
  var START = 'start';
  var MOVE = 'move';
  var THRESHOLD = 'threshold';
  var BELOW_THRESHOLD = "below" + THRESHOLD;
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
      this.drawer.on(START, this._startHandler).on(MOVE, this._moveHandler).on(THRESHOLD, this._threshold).on(BELOW_THRESHOLD, this._belowThreshold).setContext(this).activate();
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
        LOGIC = displacement > ZERO$1 && displacement >= MPD && rect.greaterWidth;
      } else {
        LOGIC = displacement < ZERO$1 && displacement <= MND && rect.greaterWidth;
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

      if (state < ZERO) {
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

  return NavCard;

}));
//# sourceMappingURL=nav.js.map
