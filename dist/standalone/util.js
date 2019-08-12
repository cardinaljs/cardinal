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
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Util = {}));
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

  exports.NAV_BOX_SHADOW = NAV_BOX_SHADOW;
  exports.ZERO = ZERO;
  exports.DIRECTIONS = DIRECTIONS;
  exports.NAVSTATE_EVENTS = NAVSTATE_EVENTS;
  exports.DrawerResponseInterface = DrawerResponseInterface;
  exports.WINDOW = WINDOW;
  exports.Path = Path;
  exports.Bound = Bound;
  exports.ActivityManager = ActivityManager;
  exports.dataCamelCase = dataCamelCase;
  exports.camelCase = camelCase;
  exports.unique = unique;
  exports.$ = $;
  exports.getAttribute = getAttribute;
  exports.hasAttribute = hasAttribute;
  exports.setAttribute = setAttribute;
  exports.getData = getData;
  exports.offsetRight = offsetRight;
  exports.offsetBottom = offsetBottom;
  exports.resolveThreshold = resolveThreshold;
  exports.css = css;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=util.js.map
