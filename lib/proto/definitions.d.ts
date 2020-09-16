export declare const PROTO_DEFINITIONS: {
    nested: {
        GrpcBus: {
            nested: {
                GBClientMessage: {
                    fields: {
                        serviceCreate: {
                            type: string;
                            id: number;
                        };
                        serviceRelease: {
                            type: string;
                            id: number;
                        };
                        callCreate: {
                            type: string;
                            id: number;
                        };
                        callEnd: {
                            type: string;
                            id: number;
                        };
                        callSend: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBServerMessage: {
                    fields: {
                        serviceCreate: {
                            type: string;
                            id: number;
                        };
                        serviceRelease: {
                            type: string;
                            id: number;
                        };
                        callCreate: {
                            type: string;
                            id: number;
                        };
                        callEvent: {
                            type: string;
                            id: number;
                        };
                        callEnded: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBKeyValue: {
                    fields: {
                        key: {
                            type: string;
                            id: number;
                        };
                        value: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBMetadata: {
                    fields: {
                        fields: {
                            rule: string;
                            type: string;
                            id: number;
                        };
                    };
                };
                GBServiceInfo: {
                    fields: {
                        endpoint: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCreateService: {
                    fields: {
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        serviceInfo: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBReleaseService: {
                    fields: {
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCallInfo: {
                    fields: {
                        methodId: {
                            type: string;
                            id: number;
                        };
                        binArgument: {
                            type: string;
                            id: number;
                        };
                        meta: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCreateCall: {
                    fields: {
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        callId: {
                            type: string;
                            id: number;
                        };
                        info: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCallEnded: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBEndCall: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBSendCall: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        binData: {
                            type: string;
                            id: number;
                        };
                        isEnd: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCreateServiceResult: {
                    fields: {
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        result: {
                            type: string;
                            id: number;
                        };
                        errorDetails: {
                            type: string;
                            id: number;
                        };
                    };
                    nested: {
                        ECreateServiceResult: {
                            values: {
                                SUCCESS: number;
                                INVALID_ID: number;
                                GRPC_ERROR: number;
                            };
                        };
                    };
                };
                GBReleaseServiceResult: {
                    fields: {
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCreateCallResult: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        result: {
                            type: string;
                            id: number;
                        };
                        errorDetails: {
                            type: string;
                            id: number;
                        };
                    };
                    nested: {
                        ECreateCallResult: {
                            values: {
                                SUCCESS: number;
                                INVALID_ID: number;
                                GRPC_ERROR: number;
                            };
                        };
                    };
                };
                GBCallEvent: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                        event: {
                            type: string;
                            id: number;
                        };
                        jsonData: {
                            type: string;
                            id: number;
                        };
                        binData: {
                            type: string;
                            id: number;
                        };
                    };
                };
                GBCallEnd: {
                    fields: {
                        callId: {
                            type: string;
                            id: number;
                        };
                        serviceId: {
                            type: string;
                            id: number;
                        };
                    };
                };
            };
        };
    };
};
