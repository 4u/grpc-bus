"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    // Not an error; returned on success.
    StatusCode[StatusCode["OK"] = 0] = "OK";
    // The operation was cancelled, typically by the caller.
    StatusCode[StatusCode["CANCELLED"] = 1] = "CANCELLED";
    // Unknown error. For example, this error may be returned
    // when a Status value received from another address space
    // belongs to an error space that is not known in this address
    // space. Also errors raised by APIs that do not return enough
    // error information may be converted to this error.
    StatusCode[StatusCode["UNKNOWN"] = 2] = "UNKNOWN";
    // The client specified an invalid argument. Note that this
    // differs from FAILED_PRECONDITION. INVALID_ARGUMENT indicates
    // arguments that are problematic regardless of the state
    // of the system (e.g., a malformed file name).
    StatusCode[StatusCode["INVALID_ARGUMENT"] = 3] = "INVALID_ARGUMENT";
    // The deadline expired before the operation could complete.
    // For operations that change the state of the system, this
    // error may be returned even if the operation has completed
    // successfully. For example, a successful response from
    // a server could have been delayed long.
    StatusCode[StatusCode["DEADLINE_EXCEEDED"] = 4] = "DEADLINE_EXCEEDED";
    // Some requested entity (e.g., file or directory) was
    // not found. Note to server developers: if a request is denied
    // for an entire class of users, such as gradual feature rollout
    // or undocumented allowlist, NOT_FOUND may be used. If a request
    // is denied for some users within a class of users, such
    // as user-based access control, PERMISSION_DENIED must be used.
    StatusCode[StatusCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    // The entity that a client attempted to create (e.g., file
    // or directory) already exists.
    StatusCode[StatusCode["ALREADY_EXISTS"] = 6] = "ALREADY_EXISTS";
    // The caller does not have permission to execute the specified
    // operation. PERMISSION_DENIED must not be used for rejections
    // caused by exhausting some resource (use RESOURCE_EXHAUSTED
    // instead for those errors). PERMISSION_DENIED must not be used
    // if the caller can not be identified (use UNAUTHENTICATED instead
    // for those errors). This error code does not imply the request
    // is valid or the requested entity exists or satisfies other
    // pre-conditions.
    StatusCode[StatusCode["PERMISSION_DENIED"] = 7] = "PERMISSION_DENIED";
    // Some resource has been exhausted, perhaps a per-user quota,
    // or perhaps the entire file system is out of space.
    StatusCode[StatusCode["RESOURCE_EXHAUSTED"] = 8] = "RESOURCE_EXHAUSTED";
    // The operation was rejected because the system is not in a state
    // required for the operation's execution. For example, the directory
    // to be deleted is non-empty, an rmdir operation is applied
    // to a non-directory, etc. Service implementors can use the following
    // guidelines to decide between FAILED_PRECONDITION, ABORTED,
    // and UNAVAILABLE: (a) Use UNAVAILABLE if the client can retry just
    // the failing call. (b) Use ABORTED if the client should retry
    // at a higher level (e.g., when a client-specified test-and-set
    // fails, indicating the client should restart a read-modify-write
    // sequence).
    // (c) Use FAILED_PRECONDITION if the client should not retry until
    // the system state has been explicitly fixed. E.g., if an "rmdir"
    // fails because the directory is non-empty, FAILED_PRECONDITION should
    // be returned since the client should not retry unless the files
    // are deleted from the directory.
    StatusCode[StatusCode["FAILED_PRECONDITION"] = 9] = "FAILED_PRECONDITION";
    // 0	The operation was aborted, typically due to a concurrency issue such
    // as a sequencer check failure or transaction abort. See the guidelines
    // above for deciding between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE.
    StatusCode[StatusCode["ABORTED"] = 10] = "ABORTED";
    // 1	The operation was attempted past the valid range. E.g., seeking
    // or reading past end-of-file. Unlike INVALID_ARGUMENT, this error indicates
    // a problem that may be fixed if the system state changes. For example,
    // a 32-bit file system will generate INVALID_ARGUMENT if asked to read
    // at an offset that is not in the range [0,2^32-1], but it will generate
    // OUT_OF_RANGE if asked to read from an offset past the current file size.
    // There is a fair bit of overlap between FAILED_PRECONDITION and OUT_OF_RANGE.
    // We recommend using OUT_OF_RANGE (the more specific error) when it applies
    // so that callers who are iterating through a space can easily look for
    // an OUT_OF_RANGE error to detect when they are done.
    StatusCode[StatusCode["OUT_OF_RANGE"] = 11] = "OUT_OF_RANGE";
    // 2	The operation is not implemented or is not supported/enabled in this service.
    StatusCode[StatusCode["UNIMPLEMENTED"] = 12] = "UNIMPLEMENTED";
    // 3	Internal errors. This means that some invariants expected by the underlying
    // system have been broken. This error code is reserved for serious errors.
    StatusCode[StatusCode["INTERNAL"] = 13] = "INTERNAL";
    // 4	The service is currently unavailable. This is most likely a transient
    // condition, which can be corrected by retrying with a backoff. Note that
    // it is not always safe to retry non-idempotent operations.
    StatusCode[StatusCode["UNAVAILABLE"] = 14] = "UNAVAILABLE";
    // 5	Unrecoverable data loss or corruption.
    StatusCode[StatusCode["DATA_LOSS"] = 15] = "DATA_LOSS";
    // 6	The request does not have valid authentication credentials for the operation.
    StatusCode[StatusCode["UNAUTHENTICATED"] = 16] = "UNAUTHENTICATED";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
;
//# sourceMappingURL=types.js.map