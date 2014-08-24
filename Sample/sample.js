/**
 * Created by klaudz on 8/15/14.
 */

/**
 * Sample 1, hooks <alert(message)> method.
 */
iHooker.hookMethod(window, "alert", function(original_alert, args) {
    // Replace alert() by console.log().
    console.log(args[0]);
    // Do not call the original alert() method.
    // original_alert(args[0]);
});

/**
 * Sample 2, hooks <Klaudz.shout(message)> method.
 */
iHooker.hookMethod(Klaudz, "shout", function(original_Klaudz$shout, args) {
    var message = args[0];
    if (message === "fuck") {
        // Filter the dirty.
        message = "hello world";
    }
    // Call the original Klaudz.shout() method with the new message argument
    // and return.
    return original_Klaudz$shout(message);
});

/**
 * Sample 3, hooks getter and setter of <Klaudz.version> property.
 */
console.log(Klaudz.version); // Logs "1".
iHooker.hookProperty(Klaudz, "version",
    function(getValue) {
        // Hook the getter.
        // Mischievously make a joke that returns a version plus 0.1.
        return getValue + 0.1;
    },
    function (setValue, currentValue) {
        // Hook the setter.
        // Hooking here makes sure the new version is always greater than the old.
        if (setValue > currentValue) {
            return setValue;
        } else {
            return currentValue;
        }
    }
);
console.log(Klaudz.version); // Logs "1.1".
Klaudz.version = 2.0;
Klaudz.version = 1.0;
console.log(Klaudz.version); // Logs "2.1".
