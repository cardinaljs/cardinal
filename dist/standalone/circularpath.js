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
  (global = global || self, global.CircularPath = factory(global.Util));
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

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
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

          out.push(new util_js.Path(x, y));
        });
        return out;
      }
    }]);

    return CircularPath;
  }(Circle);

  return CircularPath;

}));
//# sourceMappingURL=circularpath.js.map
