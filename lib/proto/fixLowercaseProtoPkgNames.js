"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixLowercaseProtoPkgNames = void 0;
function fixLowercaseProtoPkgNames(root) {
    var temp = root;
    if (!temp.FIXED_LOWERCASE && temp.nested) {
        temp.FIXED_LOWERCASE = true;
        Object.keys(temp.nested).forEach(function (key) {
            if (!(key in temp)) {
                temp[key] = temp.nested[key];
                fixLowercaseProtoPkgNames(temp[key]);
            }
        });
    }
    return temp;
}
exports.fixLowercaseProtoPkgNames = fixLowercaseProtoPkgNames;
//# sourceMappingURL=fixLowercaseProtoPkgNames.js.map