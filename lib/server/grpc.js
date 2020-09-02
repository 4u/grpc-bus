"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePassthroughClientConstructor = exports.getPassthroughServiceAttrs = exports.fullyQualifiedName = void 0;
// GRPC methods copied from the GRPC codebase.
// This is to not have a dependence on grpc at runtime in this library.
var _ = require("lodash");
function fullyQualifiedName(meta) {
    if (meta === null || meta === undefined) {
        return '';
    }
    var name = meta.name;
    var parentName = fullyQualifiedName(meta.parent);
    if (parentName && parentName.length) {
        name = parentName + '.' + name;
    }
    return name;
}
exports.fullyQualifiedName = fullyQualifiedName;
function ensureBuffer(inp) {
    if (typeof inp === 'string') {
        return new Buffer(inp);
    }
    if (typeof inp === 'object') {
        // detect ByteBuffer
        if (inp.constructor !== Buffer) {
            return inp.toBuffer();
        }
    }
    return inp;
}
function getPassthroughServiceAttrs(service, options) {
    var prefix = '/' + fullyQualifiedName(service) + '/';
    var res = {};
    if (!service.resolved) {
        service.resolveAll();
    }
    for (var methodName in service.methods) {
        if (!service.methods.hasOwnProperty(methodName)) {
            continue;
        }
        var method = service.methods[methodName];
        res[_.camelCase(method.name)] = {
            path: prefix + method.name,
            requestStream: !!method.requestStream,
            responseStream: !!method.responseStream,
            requestType: method.resolvedRequestType,
            responseType: method.resolvedResponseType,
            requestSerialize: ensureBuffer,
            requestDeserialize: _.identity,
            responseSerialize: ensureBuffer,
            responseDeserialize: _.identity,
        };
    }
    return res;
}
exports.getPassthroughServiceAttrs = getPassthroughServiceAttrs;
function makePassthroughClientConstructor(grpc, service, options) {
    var methodAttrs = getPassthroughServiceAttrs(service, options);
    var Client = grpc.makeGenericClientConstructor(methodAttrs, fullyQualifiedName(service), false);
    Client.service = service;
    Client.service.grpc_options = options;
    return Client;
}
exports.makePassthroughClientConstructor = makePassthroughClientConstructor;
//# sourceMappingURL=grpc.js.map