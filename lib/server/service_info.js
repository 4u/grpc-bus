"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildServiceInfoIdentifier = void 0;
// Generates a unique string identifier for service connection info.
function buildServiceInfoIdentifier(info) {
    return info.serviceId + "-" + info.endpoint;
}
exports.buildServiceInfoIdentifier = buildServiceInfoIdentifier;
//# sourceMappingURL=service_info.js.map