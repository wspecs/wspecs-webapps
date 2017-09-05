"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var router_1 = require("./../router");
var HomeRoutes = /** @class */ (function (_super) {
    __extends(HomeRoutes, _super);
    function HomeRoutes() {
        return _super.call(this, 'home') || this;
    }
    HomeRoutes.prototype.home = function (req, res) {
        res.send('hello');
    };
    HomeRoutes.prototype.get = function () {
        this.router.get('/', this.home);
        return _super.prototype.get.call(this);
    };
    return HomeRoutes;
}(router_1.BasicRoutes));
var routes = new HomeRoutes().get();
module.exports = routes;
