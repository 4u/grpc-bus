"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const service_1 = require("./service");
class Client {
    constructor(protoRoot, send) {
        this.protoRoot = protoRoot;
        this.send = send;
        this.serviceIdCounter = 1;
        this.services = {};
        this.recurseBuildTree(protoRoot, null);
    }
    handleMessage(message) {
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
    }
    /*
     * Returns the ProtoBuf.Root containing service constructor functions.
     */
    get root() {
        return this.protoRoot;
    }
    // Clears all ongoing calls + services, etc
    reset() {
        for (let serviceId in this.services) {
            /* istanbul ignore next */
            if (!this.services.hasOwnProperty(serviceId)) {
                continue;
            }
            let service = this.services[serviceId];
            service.end();
        }
        this.services = {};
    }
    recurseBuildTree(tree, identifier) {
        let nextIdentifier = tree.name;
        if (identifier && identifier.length) {
            nextIdentifier = identifier + '.' + nextIdentifier;
        }
        if (tree.methods && Object.keys(tree.methods).length) {
            return (endpoint) => {
                return this.buildService(tree, nextIdentifier, endpoint);
            };
        }
        if (tree.nested) {
            for (let childName in tree.nested) {
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
    }
    // Build a service and return a service handle promise.
    buildService(serviceMeta, method, endpoint) {
        return new Promise((resolve, reject) => {
            let sid = this.serviceIdCounter++;
            let info = {
                serviceId: method,
                endpoint: endpoint,
            };
            let service = new service_1.Service(serviceMeta, sid, info, {
                resolve: resolve,
                reject: reject,
            }, this.send);
            service.initStub();
            this.services[sid] = service;
            service.disposed.subscribe(() => {
                delete this.services[sid];
            });
            this.send({
                serviceCreate: {
                    serviceId: sid,
                    serviceInfo: info,
                },
            });
        });
    }
    handleServiceCreate(msg) {
        let service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCreateResponse(msg);
    }
    handleCallCreate(msg) {
        let service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCallCreateResponse(msg);
    }
    handleServiceRelease(msg) {
        let svc = this.services[msg.serviceId];
        if (!svc) {
            return;
        }
        svc.handleServiceRelease(msg);
    }
    handleCallEnded(msg) {
        let svc = this.services[msg.serviceId];
        if (!svc) {
            return;
        }
        svc.handleCallEnded(msg);
    }
    handleCallEvent(msg) {
        let service = this.services[msg.serviceId];
        if (!service) {
            return;
        }
        service.handleCallEvent(msg);
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map