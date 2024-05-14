/*!
 * matter-attractors 0.1.6 by Liam Brummitt 2017-05-15
 * https://github.com/liabru/matter-attractors
 * License MIT
 */

! function (t, r) {
    "object" == typeof exports && "object" == typeof module ? module.exports = r(require("matter-js")) : "function" == typeof define && define.amd ? define(["matter-js"], r) : "object" == typeof exports ? exports.MatterAttractors = r(require("matter-js")) : t.MatterAttractors = r(t.Matter)
}(this, function (t) {
    return function (t) {
        function r(o) {
            if (e[o]) return e[o].exports;
            var n = e[o] = {
                i: o,
                l: !1,
                exports: {}
            };
            return t[o].call(n.exports, n, n.exports, r), n.l = !0, n.exports
        }
        var e = {};
        return r.m = t, r.c = e, r.i = function (t) {
            return t
        }, r.d = function (t, e, o) {
            r.o(t, e) || Object.defineProperty(t, e, {
                configurable: !1,
                enumerable: !0,
                get: o
            })
        }, r.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return r.d(e, "a", e), e
        }, r.o = function (t, r) {
            return Object.prototype.hasOwnProperty.call(t, r)
        }, r.p = "/libs", r(r.s = 1)
    }([function (r, e) {
        r.exports = t
    }, function (t, r, e) {
        "use strict";
        var o = e(0),
            n = {
                name: "matter-attractors",
                version: "0.1.4",
                for: "matter-js@^0.12.0",
                install: function (t) {
                    t.after("Body.create", function () {
                        n.Body.init(this)
                    }), t.before("Engine.update", function (t) {
                        n.Engine.update(t)
                    })
                },
                Body: {
                    init: function (t) {
                        t.plugin.attractors = t.plugin.attractors || []
                    }
                },
                Engine: {
                    update: function (t) {
                        for (var r = t.world, e = o.Composite.allBodies(r), n = 0; n < e.length; n += 1) {
                            var i = e[n],
                                a = i.plugin.attractors;
                            if (a && a.length > 0)
                                for (var s = n + 1; s < e.length; s += 1)
                                    for (var u = e[s], c = 0; c < a.length; c += 1) {
                                        var p = a[c],
                                            f = p;
                                        o.Common.isFunction(p) && (f = p(i, u)), f && o.Body.applyForce(u, u.position, f)
                                    }
                        }
                    }
                },
                Attractors: {
                    gravityConstant: .001,
                    gravity: function (t, r) {
                        var e = o.Vector.sub(r.position, t.position),
                            i = o.Vector.magnitudeSquared(e) || 1e-4,
                            a = o.Vector.normalise(e),
                            s = -n.Attractors.gravityConstant * (t.mass * r.mass / i),
                            u = o.Vector.mult(a, s);
                        o.Body.applyForce(t, t.position, o.Vector.neg(u)), o.Body.applyForce(r, r.position, u)
                    }
                }
            };
        o.Plugin.register(n), t.exports = n
    }])
});