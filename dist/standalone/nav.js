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
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../util.js'), require('../drawer/index.js')) :
  typeof define === 'function' && define.amd ? define(['../util.js', '../drawer/index.js'], factory) :
  (global = global || self, global.Nav = factory(global.Util, global.Drawer));
}(this, function (util_js, Drawer) { 'use strict';

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

  var Backdrop =
  /*#__PURE__*/
  function () {
    function Backdrop(backdrop) {
      this.backdrop = backdrop;
    }

    var _proto = Backdrop.prototype;

    _proto.show = function show(time) {
      util_js.css(this.backdrop, {
        display: 'block',
        opacity: 1,
        transition: "opacity linear " + time / 1e3 + "s"
      });
    };

    _proto.hide = function hide(time) {
      var _this = this;

      util_js.css(this.backdrop, {
        opacity: 0,
        transition: "opacity linear " + time / 1e3 + "s"
      });
      window.setTimeout(function () {
        util_js.css(_this.backdrop, {
          display: 'none'
        });
      }, time);
    };

    _proto.setOpacity = function setOpacity(val) {
      util_js.css(this.backdrop, {
        display: 'block',
        opacity: val,
        transition: 'none'
      });
    };

    return Backdrop;
  }();

  // interface
  var STATE = {
    navstate: null,
    event: new Proxy({}, {
      set: function set(obj, prop, val) {
        if (typeof val !== 'function') {
          throw new TypeError("the set value: '" + val + "' is not callable");
        }

        obj[prop] = val;
        return true;
      }
    })
  };

  var ZERO = 0;
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
  var AUTO = 'auto';
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

      this.directionString = util_js.DIRECTIONS[this.direction];
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

      util_js.css(this.element, (_css = {}, _css[this.directionString] = response.dimension, _css.boxShadow = util_js.NAV_BOX_SHADOW[this.directionString], _css[EFFECT] = this.transition, _css));
      this._body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(response, rectangle) {
      var _css2;

      var curPos = this.direction === Drawer.UP || this.direction === Drawer.DOWN ? rectangle.coordsY.y2 : rectangle.coordsX.x2;
      util_js.css(this.element, (_css2 = {}, _css2[this.directionString] = response.dimension, _css2[EFFECT] = 'none', _css2[OVERFLOW] = HIDDEN, _css2));

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
        LOGIC = displacement > ZERO && displacement >= MPD && rect.greaterWidth;
      } else {
        LOGIC = displacement < ZERO && displacement <= MND && rect.greaterWidth;
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

      util_js.css(this.element, (_css3 = {}, _css3[EFFECT] = options.transition, _css3[OVERFLOW] = AUTO, _css3));

      if (!this.bound.lower) {
        this.element.style.boxShadow = 'none';
      }

      this._setState('close'); // callback for when nav is hidden


      if (STATE.event[util_js.NAVSTATE_EVENTS.hide]) {
        STATE.event[util_js.NAVSTATE_EVENTS.hide]();
      }
    };

    _proto._showPrep = function _showPrep(options) {
      var _css4;

      var buttonHash = util_js.getAttribute(this.options.INIT_ELEM, HREF) || util_js.getData(this.options.INIT_ELEM, HASH_ATTR);

      if (buttonHash) {
        window.location.hash = buttonHash;
      }

      this._body.style.overflow = HIDDEN;

      this._backdrop.show(this.options.TRANSITION);

      util_js.css(this.element, (_css4 = {}, _css4[EFFECT] = options.transition, _css4[OVERFLOW] = AUTO, _css4));

      this._setState('open'); // callback for when nav is shown


      if (STATE.event[util_js.NAVSTATE_EVENTS.show]) {
        STATE.event[util_js.NAVSTATE_EVENTS.show]();
      }
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
        throw new RangeError('Direction out of range');
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
        var curPos = util_js.css(this.element, this.directionString).replace(/[^\d]*$/, '');
        var upperBound = this.elementSize;
        var lowerBound = upperBound + parseInt(curPos, 10);
        return new util_js.Bound(lowerBound, upperBound);
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

      if (state < util_js.ZERO) {
        var buttonHash = util_js.getAttribute(this.button, 'href') || util_js.getData(this.button, 'data-href');

        if (buttonHash) {
          window.location.hash = buttonHash;
        }

        this._open();
      } else {
        this._close();
      }
    };

    NavService.css = function css(el, property, style) {
      return util_js.css(el, property, style);
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

      var style = (_style = {}, _style[this.direction] = util_js.ZERO, _style[EFFECT$1] = this.transition, _style.boxShadow = util_js.NAV_BOX_SHADOW[this.direction], _style);
      NavService.css(this.nav, style);
      this.backdrop.show(this.options.TRANSITION); // callback for when nav is shown

      if (STATE.event[util_js.NAVSTATE_EVENTS.show]) {
        STATE.event[util_js.NAVSTATE_EVENTS.show]();
      }

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
      this.backdrop.hide(this.options.TRANSITION); // callback for when nav is hidden

      if (STATE.event[util_js.NAVSTATE_EVENTS.hide]) {
        STATE.event[util_js.NAVSTATE_EVENTS.hide]();
      }

      this.alive = false;
      this._closeInvoked = true;
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

  var PopService =
  /*#__PURE__*/
  function () {
    function PopService(parentService, options) {
      this.options = options;
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

      window.addEventListener(this.event, this.handler, true);
      return 0;
    };

    _proto.deactivate = function deactivate() {
      window.removeEventListener(this.event, this.handler, true);

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

      if (oldHash === (util_js.getAttribute(this.button, 'href') || util_js.getData(this.button, 'data-href')) && STATE.navstate && STATE.navstate.alive) {
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

  var BACKDROP = 'backdrop';
  var MEDIA_DRAW = 'data-max-width';
  var CLASS_TYPE = '[object NavCard]';
  var NAME = 'Nav';
  var NAV = window[NAME] || null;

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
      util_js.css(this.backdrop, {
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
      var srcEl = this.src instanceof HTMLElement ? this.src : util_js.$(this.src);
      var destEl = this.dest instanceof HTMLElement ? this.dest : util_js.$(this.dest);
      var maxWidth = util_js.getData(destEl, MEDIA_DRAW);

      if (opts.useBackdrop) {
        var backdropclass = opts.backdrop || false; // if `opts.useBackdrop` and no `backdrop` given
        // append a custom backdrop

        if (!backdropclass) {
          destEl.insertAdjacentElement('beforeBegin', this.backdrop);
        } else if (typeof backdropclass === 'string') {
          // check if backdropclass is normal string or css class selector
          var backdrop = /^\./.test(backdropclass) ? backdropclass : "." + backdropclass;
          this.backdrop = util_js.$(backdrop);
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
        DIRECTION: util_js.DIRECTIONS[opts.direction],
        unit: opts.unit
      };

      var drawerOptions = _extends({}, defaultOptions, {
        MAX_WIDTH: maxWidth,
        DIRECTION: opts.direction,
        maxStartArea: opts.maxStartArea,
        threshold: opts.threshold
      });

      var hashOptions = {
        INIT_ELEM: defaultOptions.INIT_ELEM
      };
      return new NavMountWorker({
        defaultOptions: defaultOptions,
        drawerOptions: drawerOptions,
        hashOptions: hashOptions
      });
    };

    _proto.terminate = function terminate(service) {
      var flag = 0;
      flag |= service;

      if (flag & NavCard.SERVICES.Default && this.SheetService instanceof NavService) {
        this.SheetService.deactivate();
      }

      if (flag & NavCard.SERVICES.Drawer && this.Drawer instanceof NavDrawer) {
        this.Drawer.deactivate();
      }

      if (flag & NavCard.SERVICES.Hash && this.PopService instanceof PopService) {
        this.PopService.deactivate();
      }

      if (!flag) {
        throw new Error('a service id is required');
      }
    };

    _proto.toString = function toString() {
      return CLASS_TYPE;
    };

    NavCard.namespace = function namespace(name) {
      window[name] = window[name] || {};
      window[name][NAME] = NavCard;
      window[NAME] = NAV;
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

      this.PopService = new PopService(this.SheetService, options);
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

      this.SheetService = new NavService(options);
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
    maxStartArea: 25,
    threshold: 1 / 2,
    unit: 'px'
  });

  _defineProperty(NavCard, "SERVICES", {
    Default: 0x20,
    Drawer: 0x40,
    Pop: 0x80
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
      var DEFAULT_ACTIVE = !this._defaultAPI(this.options.defaultOptions).activate();
      var DRAWER_ACTIVE = !this._drawerAPI(this.options.drawerOptions).activate();
      var HASH_ACTIVE = !this._hashAPI(this.options.hashOptions).activate();
      return new Promise(function (resolve, reject) {
        if (!(DEFAULT_ACTIVE && DRAWER_ACTIVE && HASH_ACTIVE)) {
          reject(new Error('one or more services could not activate'));
          return;
        }

        resolve(NavStateEvent);
      });
    };

    _proto2.unmount = function unmount() {
      this.SheetService.forceDeactivate();
      this.Drawer.deactivate();
      this.PopService.deactivate();
    };

    _proto2.toString = function toString() {
      return '[object NavMountWorker]';
    };

    return NavMountWorker;
  }(NavCard);

  var NavStateEvent = {
    events: [util_js.NAVSTATE_EVENTS.show, util_js.NAVSTATE_EVENTS.hide],
    on: function on(event, handle) {
      if (!(NavStateEvent.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      STATE.event[event] = handle;
    },
    off: function off(event) {
      if (!(NavStateEvent.events.indexOf(event) + 1)) {
        throw new Error("unknown event '" + event + "'");
      }

      STATE.event[event] = null;
    }
  };

  return NavCard;

}));
//# sourceMappingURL=nav.js.map
