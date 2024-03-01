"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const countries_controller_1 = require("./countries.controller");
const countries_service_1 = require("./countries.service");
const Country_1 = require("../../schemas/Country");
let CountriesModule = class CountriesModule {
};
exports.CountriesModule = CountriesModule;
exports.CountriesModule = CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: Country_1.Country.name, schema: Country_1.CountrySchema }]),
        ],
        controllers: [countries_controller_1.CountriesController],
        providers: [countries_service_1.CountriesService],
    })
], CountriesModule);
//# sourceMappingURL=countries.module.js.map