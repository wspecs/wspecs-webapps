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
var hl_1 = require("./../../models/hl");
var config_1 = require("./config");
var indexes_1 = require("./indexes");
var hymnal_1 = require("./../hymnal");
var HLRoutes = /** @class */ (function (_super) {
    __extends(HLRoutes, _super);
    function HLRoutes() {
        return _super.call(this, 'hl', hl_1.HL, indexes_1.indexes, config_1.appDetails) || this;
    }
    return HLRoutes;
}(hymnal_1.HymnalRoutes));
var routes = new HLRoutes().get();
module.exports = routes;
