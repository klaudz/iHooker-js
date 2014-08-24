# iHooker-js

A simple kit for hooking methods and properties in JavaScript.
It might help debug code and even fix it or hack it.

## Getting Started

Here is a simple code that replaces `alert()` by `console.log()` by using iHooker.

```javascript
iHooker.hookMethod(window, "alert", function(original_alert, args) {
    // Replace alert() by console.log().
    console.log(args[0]);
});
```

## Documentation

### iHooker.hookMethod()

#### Summary

Hooks a method with its context and string name by using an anonymous function.

#### Syntax

```javascript
iHooker.hookMethod(context, methodName, hook)
```

#### Parameters

##### `context`{`object`}
  The context of the target method. `window` will be as the default context if leaves it `null`.
  
##### `methodName`{`string`}
  The string name of the target method. Make sure the name is valid, or may cause an exception.
  
##### `hook`{`function`}
  An anonymous function for hooking the target method.
  This `hook` function could be defined as `function(original_method, args)`.
  
  Arguments
  
  `original_method`, which is the first argument,
  is the reference of the original target function.
  `args`, which is the second,
  is the <arguments> object when the the original is called.
  
  Returns
  
  Returns, which is optional (depending on the target),
  for the target function.
  
#### Returns {`boolean`}

True if this method succeeds to hook; otherwise, false.

#### Examples

Please see the sample code in `Sample` Folder.

### iHooker.hookProperty()

#### Summary

Hooks a property with its context and string name by using a getter function and setter function.

#### Syntax

```javascript
iHooker.hookProperty(context, propertyName, getter, setter)
```

#### Parameters

##### `context`{`object`}
  The context of the target property.
  `window` will be as the default context if leaves it `null`.
  
##### `propertyName` {`string`}
  The string name of the target property.
  Make sure the name is valid, or may cause an exception.
  
##### `getter` {`function`}
  An anonymous function for hooking the target's getter.
  Leaves `null` if do not want to hook the getter.
  This `getter` function could be defined as `function(getValue)`.
  
  Arguments
  
  `getValue` is the original return value from the original getter.
  
  Returns
  
  Returns a value as a new return value for hooking getter.
  
##### `setter` {`function`}
  An anonymous function for hooking the target's setter.
  Leaves `null` if do not want to hook the setter.
  This `setter` function could be defined as `<function(setValue, currentValue)>`.
  
  Arguments
  
  `setValue` is the original value to set from the original setter.
  
  `currentValue` is the original value before doing set.
  
  Returns
  
  Returns a value as a new value to set for hooking setter.
  
#### Returns {`boolean`}

True if this method succeeds to hook; otherwise, false.
  
#### Examples

Please see the sample code in `Sample` Folder.
  
## Release

2014/8/15 - v1.0

## License

Copyright (c) 2014 Klaudz

http://klaudz.me/
