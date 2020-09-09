"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var service_1 = require("./service");
var Client = /** @class */ (function () {
    function Client(protoRoot, send) {
        this.protoRoot = protoRoot;
        this.send = send;
        this.serviceIdCounter = 1;
        this.services = {};
        this.recurseBuildTree(protoRoot, null);
    }
    Client.prototype.handleMessage = function (message) {
        if (message.serviceCreate) {
            this.handleServiceCreate(message.serviceCreate);
        }
        if (message.callCreate) {
            this.handleCallCreate(message.callCreate);
        }
        if (message.callEvent) {
            this.handleCallEvent(message.callEvent);
        }
        if (message.callEnded) {
            this.handleCallEnded(message.callEnded);
        }
        if (message.serviceRelease) {
            this.handleServiceRelease(message.serviceRelease);
        }
    };
    Object.defineProperty(Client.prototype, "root", {
        /*
         * Returns the ProtoBuf.Root containing service constructor functions.
         */
        get: function () {
            return this.protoRoot;
        },
        enumerable: false,
        configurable: true
    });
    // Clears all ongoing calls + services, etc
    Client.prototype.reset = function () {
        for (var serviceId in this.services) {
            /* istanbul ignore next */
            if (!this.services.hasOwnProperty(serviceId)) {
                continue;
            }
            var service = this.services[serviceId];
            service.end();
        }
        this.services = {};
    };
    Client.prototype.recurseBuildTree = function (tree, identifier) {
        var _this = this;
        var nextIdentifier = tree.name;
        if (identifier && identifier.length) {
            nextIdentifier = identifier + '.' + nextIdentifier;
        }
        if (tree.methods && Object.keys(tree.methods).length) {
            return function (endpoint) {
                return _this.buildService(tree, nextIdentifier, endpoint);
            };
        }
        if (tree.nested) {
            for (var childName in tree.nested) {
                if (!tree.nested.hasOwnProperty(childName)) {
                    continue;
                }
                tree.nested[childName] = this.recurseBuildTree(tree.nested[childName], nextIdentifier);
                if (childName[0] !== childName[0].toLowerCase() || !(childName in tree)) {
                    tree[childName] = tree.nested[childName];
                }
            }
        }
        return tree;
    };
    // Build a service and return a service handle promise.
    Client.prototype.buildService = function (serviceMeta, method, endpoint) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var sid = _this.serviceIdCounter++;
            var info = {
                serviceId: method,
                endpoint: endpoint,
            };
            var service = new service_1.Service(serviceMeta, sid, info, {
                resolve: resolve,
                reject: reject,
            }, _this.send);
            service.initStub();
            _this.services[sid] = service;
            service.disposed.subscribe(function () {
                delete _this.services[sid];
            });
            _this.send({
                serviceCreate: {
                    serviceId: sid,
                    serviceInfo: info,
                },
            });
        });
    };
    Client.prototype.handleServiceCreate = function (msg) {
        var service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCreateResponse(msg);
    };
    Client.prototype.handleCallCreate = function (msg) {
        var service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCallCreateResponse(msg);
    };
    Client.prototype.handleServiceRelease = function (msg) {
        var svc = this.services[msg.serviceId];
        if (!svc) {
            return;
        }
        svc.handleServiceRelease(msg);
    };
    Client.prototype.handleCallEnded = function (msg) {
        var svc = this.services[msg.serviceId];
        if (!svc) {
            return;
        }
        svc.handleCallEnded(msg);
    };
    Client.prototype.handleCallEvent = function (msg) {
        var service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCallEvent(msg);
    };
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map