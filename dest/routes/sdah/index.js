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
var sdah_1 = require("./../../models/sdah");
var config_1 = require("./config");
var indexes_1 = require("./indexes");
var hymnal_1 = require("./../hymnal");
var SDAHRoutes = /** @class */ (function (_super) {
    __extends(SDAHRoutes, _super);
    function SDAHRoutes() {
        return _super.call(this, 'sdah', sdah_1.SDAH, indexes_1.indexes, config_1.appDetails) || this;
    }
    return SDAHRoutes;
}(hymnal_1.HymnalRoutes));
var routes = new SDAHRoutes().get();
module.exports = routes;
