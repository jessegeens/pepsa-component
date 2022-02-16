"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHandler = void 0;
const community_server_1 = require("@solid/community-server");
class TestHandler extends community_server_1.HttpHandler {
    //private readonly config: RootConfiguration;
    constructor( /*config: RootConfiguration*/) {
        super();
        //this.config = config;
    }
    handle({ request, response }) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = (0, community_server_1.getLoggerFor)(this);
            logger.warn(`AnonymizationHandler called on request: ${request.method}`);
        });
    }
}
exports.TestHandler = TestHandler;
//# sourceMappingURL=TestHandler.js.map