"use strict";
exports.__esModule = true;
// Library
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var observable_hooks_1 = require("observable-hooks");
// Temp vars
var payload = {};
// This should be a library eventually
exports.RulesEngine = {
    applyRule: function (_a) {
        var rules = _a.rules, successCallback = _a.successCallback, failureCallback = _a.failureCallback, errorCallback = _a.errorCallback;
        return observable_hooks_1.useObservableState(function (event$) { return event$.pipe(operators_1.distinctUntilChanged(), operators_1.map(function (action) {
            payload = action;
            if (rules.length) {
                var processedRuleErrors_1 = [];
                rules.map(function (rule) {
                    var processRules = rule(action);
                    if (processRules && processRules.error) {
                        processedRuleErrors_1.push(processRules);
                    }
                    return rule;
                });
                return processedRuleErrors_1;
            }
            return [];
        }), operators_1.mergeMap(function (processedErrors) { return rxjs_1.iif(function () { return processedErrors.length === 0; }, successCallback(payload), failureCallback(processedErrors)); }), operators_1.catchError(function (error) { return errorCallback(error); })); });
    }
};
