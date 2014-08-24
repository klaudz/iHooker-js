/**
 * Created by klaudz on 8/15/14.
 */

/**
 * A simple kit for hooking methods and properties in JavaScript.
 * It might help debug code and even fix it or hack it.
 *
 * @class iHooker
 * @method hookMethod(context, methodName, hook)
 * @method hookProperty(context, propertyName, getter, setter)
 */
var iHooker = {
    info: {
        version: "1.0",
        author: "klaudz"
    },
    private: {}
};
iHooker._ = iHooker.private; // the light name of .private

iHooker.extend = function() {
    var target = null, options = null;
    if (arguments.length > 1) {
        target = arguments[0];
        options = arguments[1];
    } else if (arguments.length === 1) {
        target = this;
        options = arguments[0];
    }
    if (target && options) {
        var keys = Object.keys(options);
        for (var i in keys) {
            var key = keys[i];
            var value = options[key];
            target[key] = value;
        }
    }
};

// public methods
iHooker.extend({
    /**
     * Hooks a method with its context and string name by using an anonymous function.
     *
     * @param context {object}
     *                      The context of the target method.
     *                      <window> will be as the default context if leaves it <null>.
     * @param methodName {string}
     *                      The string name of the target method.
     *                      Make sure the name is valid, or may cause an exception.
     * @param hook {function}
     *                      An anonymous function for hooking the target method.
     *                      This <hook> function could be defined as
     *                      <function(original_method, args)>.
     *                      [Arguments]
     *                      <original_method>, which is the first argument,
     *                      is the reference of the original target function.
     *                      <args>, which is the second,
     *                      is the <arguments> object when the the original is called.
     *                      [Returns]
     *                      <returns>, which is optional (depending on the target),
     *                      for the target function.
     * @returns {boolean}   True if this method succeeds to hook; otherwise, false.
     */
    hookMethod: function (context, methodName, hook) {
        if (this._.isMethodName(methodName)
            && this._.isFunction(hook))
        {
            context = context || window;
            var func = context[methodName];
            if (this._.isFunction(func)) {
                var original_function = func;
                var replaced_function = function() {
                    return hook(original_function, arguments);
                };
                context[methodName] = replaced_function;
                return true;
            }
        }
        return false;
    },

    /**
     * Hooks a property with its context and string name by using a getter function and setter function.
     *
     * @param context {object}
     *                      The context of the target property.
     *                      <window> will be as the default context if leaves it <null>.
     * @param propertyName {string}
     *                      The string name of the target property.
     *                      Make sure the name is valid, or may cause an exception.
     * @param getter {function}
     *                      An anonymous function for hooking the target's getter.
     *                      Leaves <null> if do not want to hook the getter.
     *                      This <getter> function could be defined as
     *                      <function(getValue)>.
     *                      [Arguments]
     *                      <getValue> is the original return value from the original getter.
     *                      [Returns]
     *                      <returns> a value as a new return value for hooking getter.
     * @param setter {function}
     *                      An anonymous function for hooking the target's setter.
     *                      Leaves <null> if do not want to hook the setter.
     *                      This <setter> function could be defined as
     *                      <function(setValue, currentValue)>.
     *                      [Arguments]
     *                      <setValue> is the original value to set from the original setter.
     *                      <currentValue> is the original value before doing set.
     *                      [Returns]
     *                      <returns> a value as a new value to set for hooking setter.
     * @returns {boolean} True if this method succeeds to hook; otherwise, false.
     */
    hookProperty: function(context, propertyName, getter, setter) {
        if (context
            && this._.isPropertyName(propertyName)
            && (this._.isFunction(getter) || this._.isFunction(setter)))
        {
            var $_propertyName = "$_" + propertyName;
            if (context[$_propertyName] === undefined) {
                // haven't hooked
                // backup the property value to a "$_"-prefix property
                var property = context[propertyName];
                if (property !== undefined) {
                    context[$_propertyName] = property; // backup
                }
            }

            var hookers = {};
            if (this._.isFunction(getter)) {
                iHooker.extend(hookers, {
                    get: function () {
                        return getter(context[$_propertyName]);
                    }
                })
            }
            if (this._.isFunction(setter)) {
                iHooker.extend(hookers, {
                    set: function (value) {
                        context[$_propertyName] = setter(value, context[$_propertyName]);
                    }
                });
            }
            Object.defineProperty(context, propertyName, hookers);
            return true;
        }
        return false;
    }
});

// private methods
iHooker.extend(iHooker.private, {
    isPropertyName: function(arg) {
        if (this.isString(arg)) {
            var regExpString = "^" + "[_$a-z][_$a-z0-9]*" + "$";
            var regExp = new RegExp(regExpString, "ig");
            // var regExp = /^[_$a-z][_$a-z0-9]*$/ig;
            return regExp.test(arg);
        }
        return false;
    },

    isMethodName: function(arg) {
        if (this.isString(arg)) {
            var regExpString = "^" + "[_$a-z][_$a-z0-9]*(\\[.*\\])?" + "$"; // lazily make it simple in "[...]"
            var regExp = new RegExp(regExpString, "ig");
            // var regExp = /^[_$a-z][_$a-z0-9]*(\[.*\])?$/ig;
            return regExp.test(arg);
        }
        return false;
    },

    isString: function(arg) {
        return (typeof(arg) === typeof(""));
    },

    isFunction: function (arg) {
        return (typeof(arg) === typeof(function () {}));
    }
});

iHooker.extend(iHooker, iHooker.info);
