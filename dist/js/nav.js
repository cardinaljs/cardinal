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
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('../drawer/index.js')) :
  typeof define === 'function' && define.amd ? define(['../drawer/index.js'], factory) :
  (global = global || self, global.Nav = factory(global.Drawer));
}(this, function (BoundDrawer) { 'use strict';

  BoundDrawer = BoundDrawer && BoundDrawer.hasOwnProperty('default') ? BoundDrawer['default'] : BoundDrawer;

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

  var TRANSITION_STYLE = 'linear';
  var EFFECT = 'transition';
  var TRANS_TIMING = '0.1s'; // This value is basic, the calc'ed value will depend on drawer speed

  var OPACITY = 'opacity';
  var TRANS_TEMPLATE = TRANSITION_STYLE + " " + TRANS_TIMING;
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
      this.backdropTransition = OPACITY + " " + TRANS_TEMPLATE;
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
      this.element.style[EFFECT] = this.transition;
      this.body.style.overflow = HIDDEN;
    };

    _proto._moveHandler = function _moveHandler(response, rectangle) {
      this.element.style[this.directionString] = response.dimension;
      this.element.style[EFFECT] = this.transition;
    };

    _proto._threshold = function _threshold(state, stateObj) {
      var isOpen = state[1] === 'open';
      this.body.style.overflow = isOpen ? SCROLL : HIDDEN;
      this.element.style[this.directionString] = stateObj.dimension;
    };

    _proto._belowThreshold = function _belowThreshold(state, stateObj, rect) {
      var isClosed = state[1] !== 'open';
      this.body.style.overflow = isClosed ? SCROLL : HIDDEN;
      this.element.style[this.directionString] = stateObj.dimension;
      var overallEventTime = stateObj.TIMING;

      if (overallEventTime / 1e3 < 0.7) {
        console.log(overallEventTime);

        if (rect.width >= 30) {
          this.body.style.overflow = !isClosed ? SCROLL : HIDDEN;
          this.element.style[this.directionString] = stateObj.oppositeDimension;
          console.log("yeah " + rect.width);
        }
      }
    };

    return NavDrawer;
  }();

  var DISPLAY = "display";
  var TRANSITION_STYLE$1 = "ease";
  var TRANSITION_TIMING = "0.6s";
  var EFFECT$1 = "transition";
  var UNIT = "px";
  var TSTT = TRANSITION_STYLE$1 + " " + TRANSITION_TIMING;
  var BACKDROP_TRANS = "background " + TSTT + ",\n" + DISPLAY + " " + TSTT;
  var BACKDROP_BGA = "rgba(0,0,0,.4)";
  var BACKDROP_BGI = "rgba(0,0,0,0)";

  var NavService =
  /*#__PURE__*/
  function () {
    function NavService(options) {
      this.options = options;
      this.nav = options.ELEMENT;
      this.button = options.INIT_ELEM;
      this.backdrop = options.BACKDROP;
      this.event = options.DEFAULT_EVENT || 'click';
      this.direction = options.DIRECTION;
      this.width = this.nav.offsetWidth;
      this.trans_time = options.TRANSITION / 1e3;
      this.transition = this.direction + " " + TRANSITION_STYLE$1 + " " + this.trans_time + "s"; // state of the nav, whether open or close

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
      return 0;
    };

    _proto.handler = function handler() {
      console.log('clicked');
      NavService.backdrop_color = this.backdrop.style.background || this.backdrop.style.backgroundColor || BACKDROP_BGA;
      var state = NavService.css(this.nav, this.direction).replace(/[^\d]*$/, '');
      state = /\.(?=\d)/.test(state) ? Math.floor(parseFloat(state)) : parseInt(state);

      if ("" + state + UNIT == "-" + this._width(UNIT)) {
        this._open();
      } else {
        this._close();
      }
    };

    _proto._open = function _open() {
      var _style, _bdStyle;

      var style = (_style = {}, _style[this.direction] = 0, _style[EFFECT$1] = this.transition, _style);
      NavService.css(this.nav, style);
      var bdStyle = (_bdStyle = {
        background: NavService.backdrop_color
      }, _bdStyle[EFFECT$1] = BACKDROP_TRANS, _bdStyle[DISPLAY] = "BLOCK", _bdStyle);
      NavService.css(this.backdrop, bdStyle);
      this.alive = true;
    };

    _proto._close = function _close() {
      var _style2, _bdStyle2;

      var style = (_style2 = {}, _style2[this.direction] = "-" + this._width(UNIT), _style2[EFFECT$1] = this.transition, _style2);
      NavService.css(this.nav, style);
      var bdStyle = (_bdStyle2 = {
        background: BACKDROP_BGI
      }, _bdStyle2[EFFECT$1] = BACKDROP_TRANS, _bdStyle2[DISPLAY] = "NONE", _bdStyle2);
      NavService.css(this.backdrop, bdStyle);
      this.alive = false;
    };

    NavService.css = function css(el, property, style) {
      return _css(el, property, style);
    };

    _proto.deactivate = function deactivate() {
      this.button.removeEventListener(this.event, this.handler);
      return 0;
    };

    return NavService;
  }();

  function _css(el, property, style) {
    var STYLEMAP = window.getComputedStyle(el);
    /**
     * @param property?: string
     * @param style: string|Array|Object
     * @return void
     *     if called as a setter
     *
     */

    style = style || null;
    property = property || null;

    if (typeof property === "string" && style !== null) {
      // setting one property
      el.style[property] = style;
      return;
    }

    if (typeof property === "object" && property instanceof Object) {
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

    return void 0;
  }

  var TRANSITION_STYLE$2 = 'ease';

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
      this.transition = this.direction + " " + TRANSITION_STYLE$2 + " " + this.trans_time + "s"; // state of the nav, whether open or close

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
      this.backdrop.style = _css(this.backdrop, {
        background: 'rgba(0,0,0,.4)',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0
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
        BACKDROP: this.backdrop,
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

  var dataCamelCase = function dataCamelCase(data) {
    // remove 'data-' prefix and return camelCase string
    return camelCase(data.substring(5), "-");
  };

  var camelCase = function camelCase(data, delim) {
    if (delim === void 0) {
      delim = "-";
    }

    var list = data instanceof Array ? data : data.split(delim);
    return list.reduce(function (acc, cur) {
      return acc + cur.charAt(0).toUpperCase() + cur.slice(1);
    });
  };

  var unique = function unique(max) {
    return Math.floor(Math.random() * max);
  };

  var $ = function $() {
    /**
     * **This is not jQuery**
     * This selector is seperated as a function
     * so for extensibility. If you'd love jQuery's `$`
     * ```js
     * import jQuery from 'where/ever'
     * const $ = jQuery
     * // or
     * const $ = (...query) => jQuery(...query)
     * ```
     */
    return document.querySelectorAll(arguments.length <= 0 ? undefined : arguments[0])[0];
  };

  var getAttribute = function getAttribute(el, attr) {
    return el.getAttribute(attr);
  };

  var hasAttribute = function hasAttribute(el, attr) {
    return el.hasAttribute(attr);
  };

  var setAttribute = function setAttribute(el, attr, value) {
    el.setAttribute(attr, value);
  };

  var getData = function getData(el, attr) {
    var prop = dataCamelCase(attr); // this may return `undefined` in some Safari

    if (el.dataset && el.dataset[prop]) {
      return el.dataset[prop];
    } else {
      return getAttribute(el, attr);
    }
  };

  return NavCard;

}));
//# sourceMappingURL=nav.js.map
