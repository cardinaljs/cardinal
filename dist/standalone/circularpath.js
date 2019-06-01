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
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.CircularPath = factory());
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

  return CircularPath;

}));
//# sourceMappingURL=circularpath.js.map
