/*!
  * Cardinal v1.0.0
  * Repository: https://github.com/cardinaljs/cardinal
  * Copyright 2019 Caleb Pitan. All rights reserved.
  * Build Date: 2019-04-15T12:08:04.261Z
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
}(this, function (BoundDrawer) { 'use strict';

  BoundDrawer = BoundDrawer && BoundDrawer.hasOwnProperty('default') ? BoundDrawer['default'] : BoundDrawer;

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

  var Final = function Final() {};

  _defineProperty(Final, "START", 2);

  _defineProperty(Final, "HIDDEN", 'hidden');

  _defineProperty(Final, "ZERO", 0);

  _defineProperty(Final, "DISPLAY", 'block');
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
  function css(el, property, style) {
    var STYLEMAP = window.getComputedStyle(el);
    style = style || null;
    property = property || null;

    if (typeof property === 'string' && style !== null) {
      // setting one property
      el.style[property] = style;
      return;
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
        transition: "opacity linear " + time / 1e3
      });
    };

    _proto.hide = function hide(time) {
      var _this = this;

      css(this.backdrop, {
        opacity: 0,
        transition: "opacity linear " + time / 1e3
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
  var UNIT = "px";

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
      this.backdropElement.addEventListener(this.event, function (e) {
        _this.handler.call(_this, e);
      });
      return 0;
    };

    _proto.handler = function handler() {
      var state = NavService.css(this.nav, this.direction).replace(/[^\d]*$/, '');
      state = /\.(?=\d)/.test(state) ? Math.floor(parseFloat(state)) : parseInt(state);

      if ("" + state + UNIT == "-" + this._width(UNIT)) {
        this._open();
      } else {
        this._close();
      }
    };

    _proto._open = function _open() {
      var _style;

      var style = (_style = {}, _style[this.direction] = 0, _style[EFFECT] = this.transition, _style);
      NavService.css(this.nav, style);
      this.backdrop.show(this.options.TRANSITION);
      this.alive = true;
    };

    _proto._close = function _close() {
      var _style2;

      var style = (_style2 = {}, _style2[this.direction] = "-" + this._width(UNIT), _style2[EFFECT] = this.transition, _style2);
      NavService.css(this.nav, style);
      this.backdrop.hide(this.options.TRANSITION);
      this.alive = false;
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

  var TRANSITION_STYLE$2 = 'linear';
  var EFFECT$1 = 'transition';
  var TRANS_TIMING = '0.1s'; // This value is basic, the calc'ed value will depend on drawer speed
  var TRANS_TEMPLATE = TRANSITION_STYLE$2 + " " + TRANS_TIMING;
  var HIDDEN = 'hidden';
  var SCROLL = 'scroll';
  var START = 'start';
  var MOVE = 'move';
  var THRESHOLD = 'threshold';
  var BELOW_THRESHOLD = "below" + THRESHOLD;
  var DIRECTIONS = ['top', 'left', 'bottom', 'right'];

  var NavDrawer =
  /*#__PURE__*/
  function () {
    /**
     *
     * @param {{}} options An options Object to configure the Drawer with
     */
    function NavDrawer(options) {
      this.options = options;
      /**
       * @type {HTMLElement}
       */

      this.element = this.options.ELEMENT;
      /**
       * @type {HTMLElement}
       */

      this.body = this.options.BODY;
      /**
       * @type {HTMLElement}
       */

      this.backdrop = this.options.BACKDROP;
      /**
       * @type {string}
       */

      this.direction = this.options.DIRECTION;
      this.directionString = DIRECTIONS[this.direction];
      this.handlers = [];
      this.events = [this.options.touchstart, this.options.touchmove, this.options.touchend];

      var o = _extends({}, options, {
        TARGET: document
      });

      this.drawer = new BoundDrawer(o);
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

    _proto._startHandler = function _startHandler(response, rectangle) {
      this.element.style[this.directionString] = response.displacement;
      this.element.style[EFFECT$1] = this.transition;
      this.body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(response, rectangle) {
      this.element.style[this.directionString] = response.dimension;
      this.element.style[EFFECT$1] = this.transition;
      this.backdrop.setOpacity(rectangle.coordsX.x2 / this.elementSize);
    };

    _proto._threshold = function _threshold(state, stateObj) {
      var wasOpen = state[1] === 'open';

      if (wasOpen) {
        this.body.style.overflow = SCROLL;
        this.backdrop.hide(this.options.TRANSITION);
      } else {
        this.body.style.overflow = HIDDEN;
        this.backdrop.show(this.options.TRANSITION);
      }

      this.element.style[this.directionString] = stateObj.dimension;
    };

    _proto._belowThreshold = function _belowThreshold(state, stateObj, rect) {
      var wasClosed = state[1] !== 'open';
      var overallEventTime = stateObj.TIMING;

      if (overallEventTime / 1e3 < 0.7) {
        console.log(overallEventTime);
        var displacement = this.direction === BoundDrawer.UP || this.direction === BoundDrawer.DOWN ? rect.displacementY : rect.displacementX;

        if (displacement > 0 && displacement >= 40 && rect.greaterWidth) {
          this.body.style.overflow = !wasClosed ? SCROLL : HIDDEN;
          this.element.style[this.directionString] = stateObj.oppositeDimension;
          this.backdrop.show(this.options.TRANSITION);
          console.log("yeah " + rect.width);
        } else if (displacement < 0 && displacement <= -40 && rect.greaterWidth) {
          if (!wasClosed) {
            this.body.style.overflow = SCROLL;
            this.backdrop.hide(this.options.TRANSITION);
          } else {
            this.body.style.overflow = HIDDEN;
            this.backdrop.show(this.options.TRANSITION);
          }

          this.element.style[this.directionString] = stateObj.oppositeDimension;
        }
      } else {
        if (wasClosed) {
          this.body.style.overflow = SCROLL;
          this.backdrop.hide(this.options.TRANSITION);
        } else {
          this.body.style.overflow = HIDDEN;
          this.backdrop.show(this.options.TRANSITION);
        }

        this.element.style[this.directionString] = stateObj.dimension;
      }
    };

    _createClass(NavDrawer, [{
      key: "elementSize",
      get: function get() {
        var axis = this.direction;

        if (axis === BoundDrawer.UP || axis === BoundDrawer.DOWN) {
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

  return NavCard;

}));
//# sourceMappingURL=nav.js.map
