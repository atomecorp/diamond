let MYCONST;
let __f;
let a;
let b;
let c;
let choix;
let fs;
let h;
let invoice;
let list;
let obj;
let processed;
let q;
let r;
let remove_short;
let result;
let reverse_text;
let rows;
let t;
let text;
let to_capitalize;
let u;
let worker;
let x;
let y;

const __FILE__ = (() => {
  if (typeof globalThis !== "undefined" && typeof globalThis.__FILE__ !== "undefined") {
    return globalThis.__FILE__;
  }
  if (typeof __rubySourceFile !== "undefined") return __rubySourceFile;
  return "unknown.rb";
})();
if (typeof globalThis !== "undefined") { globalThis.__FILE__ = __FILE__; }

const __rubyBinding = () => ({ locals: {} });
const __rubyPrint = (...chunks) => {
  const text = chunks.map(chunk => String(chunk ?? "")).join("");
  if (typeof process !== "undefined" && process.stdout && process.stdout.write) {
    process.stdout.write(text);
  } else if (typeof console !== "undefined" && console.log) {
    console.log(text);
  }
};

const __rubyGets = (...promptParts) => {
  const message = promptParts.length ? promptParts.map(part => String(part ?? "")).join("") : "";
  if (typeof prompt === "function") {
    const result = prompt(message);
    return result == null ? "" : result;
  }
  console.warn("gets() is not supported in this environment.");
  return "";
};

if (typeof globalThis !== "undefined" && !globalThis.puts) {
  globalThis.puts = (...values) => {
    if (typeof console !== "undefined" && console.log) {
      console.log(...values);
    }
  };
}

const __rubyClassName = (value) => {
  if (value === null || value === undefined) return "NilClass";
  if (value === true) return "TrueClass";
  if (value === false) return "FalseClass";
  if (typeof value === "string") return "String";
  if (typeof value === "symbol") return "Symbol";
  if (typeof value === "number") return Number.isFinite(value) && Number.isInteger(value) ? "Integer" : "Float";
  if (typeof value === "bigint") return "Integer";
  if (Array.isArray(value)) return "Array";
  if (value instanceof Map) return "Hash";
  if (value instanceof Set) return "Set";
  if (typeof value === "function") return "Proc";
  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (!proto || proto === Object.prototype) return "Hash";
    if (value.constructor && typeof value.constructor.name === "string" && value.constructor.name.length) {
      return value.constructor.name;
    }
    return "Object";
  }
  return typeof value;
};

const __rubyIvarName = (name) => {
  const str = String(name ?? "");
  const clean = str.startsWith("@") ? str.slice(1) : str;
  return "__" + clean;
};

const __rubyStrip = (value) => String(value ?? "").trim();

const __rubySplit = (value) => String(value ?? "").split(/\s+/);

const __rubyReverse = (value) => String(value ?? "").split("").reverse().join("");

const __rubyCapitalize = (value) => {
  const str = String(value ?? "");
  if (!str.length) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const __rubySymbolProc = (name) => {
  switch (name) {
    case "capitalize":
      return (value) => __rubyCapitalize(value);
    default:
      return (value, ...rest) => {
        if (value == null) return value;
        const method = value[name];
        return typeof method === "function" ? method.apply(value, rest) : value;
      };
  }
};

const __rubyLazy = (value) => {
  if (value && typeof value === "object" && value.__isRubyLazy) return value;
  if (Array.isArray(value)) {
    const base = value.slice();
    const wrapper = {
      __isRubyLazy: true,
      __target: base,
      select(block) {
        const fn = typeof block === "function" ? block : (item) => item;
        const result = base.filter((item, index) => fn(item, index));
        return __rubyLazy(result);
      },
      map(block) {
        const fn = typeof block === "function" ? block : (item) => item;
        return __rubyLazy(base.map((item, index) => fn(item, index)));
      },
      to_a() {
        return base.slice();
      },
      first() {
        return base[0];
      },
      forEach(...args) {
        return base.forEach(...args);
      }
    };
    wrapper.filter = wrapper.select;
    wrapper[Symbol.iterator] = function() {
      return base[Symbol.iterator]();
    };
    return wrapper;
  }
  return value;
};

const __rubyFetch = (collection, key, fallback) => {
  if (Array.isArray(collection)) {
    const index = Number(key);
    if (Number.isInteger(index) && index >= 0 && index < collection.length) {
      return collection[index];
    }
  } else if (collection && typeof collection === "object") {
    const prop = String(key);
    if (prop in collection) {
      return collection[prop];
    }
  }
  if (fallback !== undefined) {
    return typeof fallback === "function" ? fallback() : fallback;
  }
  throw new Error("KeyError");
};

const __rubyMatch = (value, pattern) => {
  let input = value;
  let regex = pattern;
  if (value instanceof RegExp || (value && typeof value === "object" && typeof value.exec === "function")) {
    regex = value;
    input = pattern;
  }
  const normalizedInput = String(input ?? "");
  const normalizedRegex = regex instanceof RegExp ? regex : new RegExp(String(regex));
  const result = normalizedInput.match(normalizedRegex);
  if (!result) return null;
  const wrapper = {
    captures: () => result.slice(1)
  };
  result.slice(1).forEach((value, index) => { wrapper[index] = value; });
  if (result.groups && typeof result.groups === "object") {
    for (const [key, value] of Object.entries(result.groups)) {
      wrapper[key] = value;
    }
  }
  return wrapper;
};

const __rubyPublicSend = (receiver, methodName, ...args) => {
  if (receiver == null) return undefined;
  const fn = receiver[methodName];
  if (typeof fn === "function") {
    return fn.apply(receiver, args);
  }
  if (typeof methodName === "string") {
    const rhs = args[0];
    switch (methodName) {
      case ">": return receiver > rhs;
      case ">=": return receiver >= rhs;
      case "<": return receiver < rhs;
      case "<=": return receiver <= rhs;
      case "==": return receiver === rhs;
      case "!=": return receiver !== rhs;
      case "===": return receiver === rhs;
      case "!==": return receiver !== rhs;
      default: break;
    }
  }
  return receiver[methodName];
};

const __rubySend = (receiver, methodName, args = [], block) => {
  if (receiver == null) return undefined;
  const fn = receiver[methodName];
  if (typeof fn === "function") {
    const callArgs = block === undefined ? args : [...args, block];
    return fn.apply(receiver, callArgs);
  }
  if (typeof methodName === "string") {
    if (methodName === "tap") {
      if (typeof block === "function") {
        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }
      }
      return receiver;
    }
    if (methodName === "then" || methodName === "yield_self") {
      if (typeof block === "function") {
        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }
      }
      return receiver;
    }
    if (methodName === "catch") {
      const tag = args[0];
      if (typeof block !== "function") return undefined;
      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;
      try {
        return block.call(receiver);
      } catch (error) {
        if (error && error.__rubyThrowTag !== undefined) {
          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {
            return error.__rubyThrowValue;
          }
        }
        throw error;
      } finally {
        if (typeof restore === "function") restore();
      }
    }
    if (methodName === "throw") {
      const tag = args[0];
      const value = args.length > 1 ? args[1] : undefined;
      const error = new Error("throw");
      error.__rubyThrowTag = tag;
      error.__rubyThrowValue = value;
      throw error;
    }
  }
  const missing = receiver.method_missing;
  if (typeof missing === "function") {
    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];
    return missing.apply(receiver, missingArgs);
  }
  throw new Error(`NoMethodError: undefined method ${methodName}`);
};

const Thread = (() => {
  if (typeof globalThis !== "undefined" && globalThis.Thread) return globalThis.Thread;
  class Thread {
    constructor(block) {
      this.value = undefined;
      Thread.__stack.push(this);
      try {
        if (typeof block === "function") {
          const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(this) : null;
          try {
            this.value = block();
          } finally {
            if (typeof restore === "function") restore();
          }
        }
      } finally {
        Thread.__stack.pop();
      }
    }
    static current() {
      const stack = Thread.__stack;
      return stack[stack.length - 1] || Thread.__root;
    }
  }
  Thread.__root = {};
  Thread.__stack = [Thread.__root];
  if (typeof globalThis !== "undefined") globalThis.Thread = Thread;
  return Thread;
})();

const Fiber = (() => {
  if (typeof globalThis !== "undefined" && globalThis.Fiber) return globalThis.Fiber;
  class Fiber {
    constructor(block) {
      this.value = undefined;
      this.block = typeof block === "function" ? block : null;
      if (this.block) {
        const restore = typeof this.block.__rubyBind === "function" ? this.block.__rubyBind(this) : null;
        try {
          this.value = this.block();
        } finally {
          if (typeof restore === "function") restore();
        }
      }
    }
    static yield() {
      return (value) => value;
    }
  }
  if (typeof globalThis !== "undefined") globalThis.Fiber = Fiber;
  return Fiber;
})();

const Enumerator = (() => {
  if (typeof globalThis !== "undefined" && globalThis.Enumerator) return globalThis.Enumerator;
  class Enumerator {
    constructor(block) {
      this.__values = [];
      this.__builder = typeof block === "function" ? block : null;
      if (this.__builder) {
        const restore = typeof this.__builder.__rubyBind === "function" ? this.__builder.__rubyBind(this) : null;
        const yielder = {
          push: (value) => {
            this.__values.push(value);
            return value;
          }
        };
        try {
          this.__builder(yielder);
        } finally {
          if (typeof restore === "function") restore();
        }
      }
    }
    each(block) {
      if (typeof block === "function") {
        for (const value of this.__values) {
          const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(this) : null;
          try { block.call(this, value); } finally { if (typeof restore === "function") restore(); }
        }
      }
      return this;
    }
    toArray() {
      return this.__values.slice();
    }
    [Symbol.iterator]() {
      return this.__values[Symbol.iterator]();
    }
  }
  if (typeof globalThis !== "undefined") globalThis.Enumerator = Enumerator;
  return Enumerator;
})();

const File = (() => {
  const existing = typeof globalThis !== "undefined" ? globalThis.File : undefined;
  if (existing && typeof existing.open === "function") return existing;
  const File = existing && typeof existing === "object" ? existing : {};
  File.open = (path, mode, block) => {
    const fileObject = {
      gets: () => ""
    };
    if (typeof block === "function") {
      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(fileObject) : null;
      try {
        return block.call(fileObject, fileObject);
      } finally {
        if (typeof restore === "function") restore();
      }
    }
    return fileObject;
  };
  if (typeof globalThis !== "undefined") globalThis.File = File;
  return File;
})();

const Struct = (() => {
  if (typeof globalThis !== "undefined" && globalThis.Struct) return globalThis.Struct;
  class Struct {
    constructor(...members) {
      const names = members.map(member => {
        const stringName = typeof member === "string" ? member : String(member);
        return stringName.startsWith(":") ? stringName.slice(1) : stringName;
      });
      return class {
        constructor(...values) {
          names.forEach((name, index) => {
            this[name] = values[index];
          });
        }
      };
    }
  }
  if (typeof globalThis !== "undefined") globalThis.Struct = Struct;
  return Struct;
})();

const TracePoint = (() => {
  if (typeof globalThis !== "undefined" && globalThis.TracePoint) return globalThis.TracePoint;
  class TracePoint {
    constructor(eventName, block) {
      this.eventName = eventName;
      this.block = typeof block === "function" ? block : null;
    }
    enable(block) {
      const fn = typeof block === "function" ? block : this.block;
      if (typeof fn === "function") {
        const restore = typeof fn.__rubyBind === "function" ? fn.__rubyBind(this) : null;
        try {
          return fn.call(this, this);
        } finally {
          if (typeof restore === "function") restore();
        }
      }
      return this;
    }
  }
  if (typeof globalThis !== "undefined") globalThis.TracePoint = TracePoint;
  return TracePoint;
})();

const __rubyInstanceEval = (receiver, block) => {
  if (typeof block !== "function") return undefined;
  const target = receiver !== undefined ? receiver : undefined;
  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;
  try {
    return block.call(target);
  } finally {
    if (typeof restore === "function") restore();
  }
};

const __rubyInstanceExec = (receiver, args, block) => {
  if (typeof block !== "function") return undefined;
  const target = receiver !== undefined ? receiver : undefined;
  const argList = Array.isArray(args) ? args : [];
  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;
  try {
    return block.apply(target, argList);
  } finally {
    if (typeof restore === "function") restore();
  }
};

const __rubyMultiAssign = (value, count) => {
  if (value == null) {
    return Array.from({ length: count }, () => undefined);
  }
  if (Array.isArray(value)) {
    const result = value.slice(0, count);
    while (result.length < count) result.push(undefined);
    return result;
  }
  const result = [value];
  while (result.length < count) result.push(undefined);
  return result;
};

const __rubyChomp = (value) => {
  const str = String(value ?? "");
  if (str.endsWith("\r\n")) return str.slice(0, -2);
  if (str.endsWith("\n")) return str.slice(0, -1);
  if (str.endsWith("\r")) return str.slice(0, -1);
  return str;
};

const __rubyToInteger = (value) => {
  const str = String(value ?? "").trimStart();
  const match = str.match(/^[+-]?\d+/);
  if (!match) return 0;
  const parsed = parseInt(match[0], 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const __rubyStrftime = (format) => {
  const date = new Date();
  const replacements = {
    "%Y": String(date.getFullYear()),
    "%m": String(date.getMonth() + 1).padStart(2, "0"),
    "%d": String(date.getDate()).padStart(2, "0")
  };
  return String(format ?? "").replace(/%[Ymd]/g, (match) => replacements[match] ?? match);
};

const __rubyRescueMatch = (error, matchers) => {
  if (!matchers || matchers.length === 0) return true;
  for (const matcher of matchers) {
    if (matcher == null) continue;
    if (typeof matcher === "function") {
      if (error instanceof matcher) return true;
      continue;
    }
    if (typeof matcher === "string") {
      if (error && error.name === matcher) return true;
      continue;
    }
    if (typeof matcher === "object" && typeof matcher.test === "function") {
      if (matcher.test(error)) return true;
      continue;
    }
    if (matcher === error) return true;
    if (String(matcher) === (error && error.name)) return true;
  }
  return false;
};

const __rubyInclude = (klass, mixin) => {
  if (!klass || !mixin) return klass;
  const target = klass && klass.prototype ? klass.prototype : klass;
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (key === "constructor") continue;
    Object.defineProperty(target, key, descriptors[key]);
  }
  return klass;
};

const __rubyExtend = (klass, mixin) => {
  if (!klass || !mixin) return klass;
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (key === "constructor") continue;
    Object.defineProperty(klass, key, descriptors[key]);
  }
  return klass;
};

const __rubyPrepend = (klass, mixin) => {
  if (!klass || !mixin) return klass;
  const target = klass && klass.prototype ? klass.prototype : klass;
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    if (key === "constructor") continue;
    Object.defineProperty(target, key, descriptors[key]);
  }
  return klass;
};

const __rubyDefineSingleton = (target, name, fn) => {
  if (target == null) return undefined;
  const key = name == null ? undefined : (typeof name === "symbol" ? name : String(name));
  if (key === undefined) return undefined;
  const assignKey = key;
  const callable = typeof fn === "function" ? fn : (() => fn);
  target[assignKey] = callable;
  return callable;
};

const __rubyEnsureError = (name) => {
  const errorName = typeof name === "string" ? name : String(name ?? "Error");
  if (typeof globalThis !== "undefined") {
    const existing = globalThis[errorName];
    if (typeof existing === "function") return existing;
    const ctor = class extends Error {
      constructor(message) {
        super(message);
        this.name = errorName;
      }
    };
    Object.defineProperty(ctor, "name", { value: errorName });
    globalThis[errorName] = ctor;
    return ctor;
  }
  return Error;
};

const __rubyRaise = (...args) => {
  if (!args.length) { throw new Error("RuntimeError"); }
  const first = args[0];
  if (first instanceof Error) { throw first; }
  if (typeof first === "function") {
    const message = args[1] !== undefined ? args[1] : undefined;
    throw new first(message);
  }
  if (typeof first === "string") {
    throw new Error(first);
  }
  if (first && typeof first === "object" && first.message !== undefined) {
    throw first;
  }
  throw new Error(String(first));
};

class C {
  ["[]"](k) {
    return k * 2;
  }
  ["[]="](k, v) {
    this.__h ||= {  };
    return this.__h[k] = v;
  }
  ["+@"]() {
    return "plus_unary";
  }
  ["-@"]() {
    return "minus_unary";
  }
  coerce(o) {
    return [o, this];
  }
}
class K {
  secret() {
    return "ok";
  }
  static alt() {
    return "alt";
  }
}
(() => {
    const __singleton1 = K;
    if (__singleton1 == null) { return; }
    __singleton1.cm = function() {
      return "class_method";
    };
  })();
obj = new K();
__rubyDefineSingleton(K, "dyn", function() {
  return "dyn";
});
const M = {};
  M.z = function() {
    return "m";
  };
class D {
}
__rubyInclude(D, M);
__rubyExtend(D, M)
__rubyPrepend(D, M);
const N = {};
  N.mf = function() {
    return "mf";
  };
const Hooks = {};
  Hooks.included = function(base) {
    return __rubySend(base, "const_set", ["X", 1], undefined);
  };
  Hooks.method_added = function(name) {
  };
(() => {
  let __result6;
  let __handled7 = false;
  try {
    __result6 = (() => {
    return __rubyRaise(__rubyEnsureError("ArgumentError"), "bad");
  }).call(this);
  } catch (__error8) {
    if (!__handled7 && __rubyRescueMatch(__error8, ["ArgumentError"])) {
      const e = __error8;
      __result6 = (() => {
      return __rubyClassName(e);
    }).call(this);
      __handled7 = true;
    }
    if (!__handled7) throw __error8;
  } finally {
    "always";
  }
  return __result6;
})();;
x = (() => {
  let __result9;
  let __handled10 = false;
  try {
    __result9 = (() => {
    return 1 / 0;
  }).call(this);
  } catch (__error11) {
    if (!__handled10 && true) {
      __result9 = (() => {
      return "err";
    }).call(this);
      __handled10 = true;
    }
    if (!__handled10) throw __error11;
  }
  return __result9;
})();;
t = new Thread((() => {
  let __self12 = this;
  const __block13 = function(...__args14) {
    return (function() {
  return __rubySend(Thread, "current", [], undefined)["foo"] = 1;
}).apply(__self12, __args14);
  };
  __block13.__rubyBind = (value) => {
    const __prev15 = __self12;
    __self12 = value;
    return () => {
      __self12 = __prev15;
    };
  };
  return __block13;
})());
__f = new Fiber((() => {
  let __self16 = this;
  const __block17 = function(...__args18) {
    return (function() {
  __rubySend(Fiber, "yield", [], undefined)(1);
  return 2;
}).apply(__self16, __args18);
  };
  __block17.__rubyBind = (value) => {
    const __prev19 = __self16;
    __self16 = value;
    return () => {
      __self16 = __prev19;
    };
  };
  return __block17;
})());
e = new Enumerator((() => {
  let __self20 = this;
  const __block21 = function(...__args22) {
    return (function(y) {
  y.push(1);
  return y.push(2);
}).apply(__self20, __args22);
  };
  __block21.__rubyBind = (value) => {
    const __prev23 = __self20;
    __self20 = value;
    return () => {
      __self20 = __prev23;
    };
  };
  return __block21;
})());
__rubySend(File, "open", [__FILE__, "r"], (() => {
  let __self24 = this;
  const __block25 = function(...__args26) {
    return (function(f) {
  return __rubyGets();
}).apply(__self24, __args26);
  };
  __block25.__rubyBind = (value) => {
    const __prev27 = __self24;
    __self24 = value;
    return () => {
      __self24 = __prev27;
    };
  };
  return __block25;
})());
a = ["a", "b", "c"];
r = new RegExp("(\\d+)\\s+(?<name>\\w+)", "u");
h = "leading\n";
console.log(a[1], __rubyMatch(r, "123 abc")["name"], h);
const __case28 = [1, 2, 3];
const __pattern29 = (() => {
  const __value = __case28;
  if (__value == null) return null;
  const __bindings30 = {};
  if (!Array.isArray(__value)) return null;
  if (__value.length < 1) return null;
  const __elem31 = __value[0];
  const a = __elem31;
  __bindings30.a = a;
  const rest = __value.slice(1);
  __bindings30.rest = rest;
  if (!(a > 0)) return null;
  return __bindings30;
})();
if (__pattern29) {
  const a = __pattern29.a;
  const rest = __pattern29.rest;
  [a, rest];
}
x = 1;
const __case32 = { x: 1 };
const __pattern33 = (() => {
  const __value = __case32;
  if (__value == null) return null;
  const __bindings34 = {};
  if (typeof __value !== 'object') return null;
  let __found36 = false;
  let __prop35;
  if (!__found36 && Object.prototype.hasOwnProperty.call(__value, "x")) {
    __found36 = true;
    __prop35 = __value["x"];
  }
  if (!__found36 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("x"))) {
    __found36 = true;
    __prop35 = __value[Symbol.for("x")];
  }
  if (!__found36) return null;
  if (__prop35 !== x) return null;
  return __bindings34;
})();
if (__pattern33) {
  "same";
}
MYCONST = Object.freeze(new new Struct("a")(1));
x = -1;
if (true) {
  y = 1;
}
z = a = 1 ? "t" : "f";
b = __rubyBinding();
eval("1+1", b);
__rubySend(new TracePoint("call", (() => {
  let __self53 = this;
  const __block54 = function(...__args55) {
    return (function(tp) {
}).apply(__self53, __args55);
  };
  __block54.__rubyBind = (value) => {
    const __prev56 = __self53;
    __self53 = value;
    return () => {
      __self53 = __prev56;
    };
  };
  return __block54;
})()), "enable", [], (() => {
  let __self41 = this;
  const __block42 = function(...__args43) {
    return (function() {
}).apply(__self41, __args43);
  };
  __block42.__rubyBind = (value) => {
    const __prev44 = __self41;
    __self41 = value;
    return () => {
      __self41 = __prev44;
    };
  };
  return __block42;
})());
function multi(__block) {
  __block ? __block(1) : undefined;
  return __block ? __block(2) : undefined;
}
if (typeof globalThis !== "undefined") { globalThis.multi = multi; }
__rubySend([1, 2], "map", [__rubySymbolProc("to_s")], undefined);
__rubySend(globalThis, "catch", ["k"], (() => {
  let __self57 = this;
  const __block58 = function(...__args59) {
    return (function() {
  return __rubySend(this, "throw", ["k", "val"], undefined);
}).apply(__self57, __args59);
  };
  __block58.__rubyBind = (value) => {
    const __prev60 = __self57;
    __self57 = value;
    return () => {
      __self57 = __prev60;
    };
  };
  return __block58;
})());
__rubySend(__rubySend(1, "tap", [], (() => {
  let __self77 = this;
  const __block78 = function(...__args79) {
    return (function(v) {
  return v + 1;
}).apply(__self77, __args79);
  };
  __block78.__rubyBind = (value) => {
    const __prev80 = __self77;
    __self77 = value;
    return () => {
      __self77 = __prev80;
    };
  };
  return __block78;
})()), "then", [], (() => {
  let __self65 = this;
  const __block66 = function(...__args67) {
    return (function(v) {
  return v * 2;
}).apply(__self65, __args67);
  };
  __block66.__rubyBind = (value) => {
    const __prev68 = __self65;
    __self65 = value;
    return () => {
      __self65 = __prev68;
    };
  };
  return __block66;
})());
console.log(__rubySend(__rubySend(__rubySplit("hello"), "map", [__rubySymbolProc("capitalize")], undefined), "join", [" "], undefined));
console.log("----- 16th check -----");
class FileSystem {
  constructor(name) {
    this.__name = name;
  }
  grab(parent) {
    return parent;
  }
  file_handler(parent, filename, content, bloc) {
    let hash_content;
    hash_content = { filename: filename, content: content };
    return __rubyInstanceExec(this.grab(parent), [hash_content], bloc);
  }
}
class FileWorker {
  constructor(user) {
    this.__user = user;
  }
  log(hash) {
    console.log(`[${this.__user}] traite le fichier: ${hash["filename"]}`);
    return console.log(`Contenu: ${hash["content"]}`);
  }
}
fs = new FileSystem("FS1");
worker = new FileWorker("Alice");
__rubySend(fs, "file_handler", [worker, "notes.txt", "Hello World !", (() => {
  let __self81 = this;
  const __block82 = function(...__args83) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self81, __args83);
  };
  __block82.__rubyBind = (value) => {
    const __prev84 = __self81;
    __self81 = value;
    return () => {
      __self81 = __prev84;
    };
  };
  return __block82;
})()], undefined);
console.log("----- 15th check -----");
class Contexte {
  constructor(val, val2, val3) {
    this.__val = val;
    this.__val2 = val2;
    this.__val3 = val3;
  }
  exec(bloc) {
    return __rubyInstanceEval(this, bloc);
  }
}
Contexte.prototype["val"] = function() { return this.__val; };
Contexte.prototype["val="] = function(value) { this.__val = value; return value; };
Contexte.prototype["val2"] = function() { return this.__val2; };
Contexte.prototype["val2="] = function(value) { this.__val2 = value; return value; };
Contexte.prototype["val3"] = function() { return this.__val3; };
Contexte.prototype["val3="] = function(value) { this.__val3 = value; return value; };
obj = new Contexte(10, 20, 30);
__rubySend(obj, "exec", [], (() => {
  let __self85 = this;
  const __block86 = function(...__args87) {
    return (function() {
  console.log(`val  = ${__rubySend(this, "val", [], undefined)}`);
  console.log(`val2 = ${__rubySend(this, "val2", [], undefined)}`);
  return console.log(`val3 = ${__rubySend(this, "val3", [], undefined)}`);
}).apply(__self85, __args87);
  };
  __block86.__rubyBind = (value) => {
    const __prev88 = __self85;
    __self85 = value;
    return () => {
      __self85 = __prev88;
    };
  };
  return __block86;
})());
console.log("----- 14th check -----");
function f(...__args89) {
  const __blockCandidate90 = __args89.length ? __args89[__args89.length - 1] : undefined;
  const blk = typeof __blockCandidate90 === 'function' ? __blockCandidate90 : undefined;
  if (typeof __blockCandidate90 === 'function') __args89.pop();
  let __kwargs91 = {};
  if (__args89.length) {
    const __kwCandidate92 = __args89[__args89.length - 1];
    if (__kwCandidate92 && typeof __kwCandidate92 === 'object' && !Array.isArray(__kwCandidate92)) {
      __kwargs91 = __kwCandidate92;
      __args89.pop();
    } else if (true) {
      __kwargs91 = {};
    } else {
      __kwargs91 = undefined;
    }
  }
  if (__kwargs91 === undefined) __kwargs91 = {};
  const a = __args89.length ? __args89.shift() : undefined;
  let b = __args89.length ? __args89.shift() : undefined;
  if (b === undefined) b = 2;
  const rest = __args89.splice(0);
  const __kwUsed93 = new Set();
  if (__kwargs91 === undefined || !Object.prototype.hasOwnProperty.call(__kwargs91, "c")) {
    throw new Error("ArgumentError: missing keyword: c");
  }
  const c = __kwargs91["c"];
  __kwUsed93.add("c");
  let d = __kwargs91 && Object.prototype.hasOwnProperty.call(__kwargs91, "d") ? __kwargs91["d"] : 4;
  __kwUsed93.add("d");
  const kw = {};
  if (__kwargs91 && typeof __kwargs91 === 'object') {
    for (const __key in __kwargs91) {
      if (!Object.prototype.hasOwnProperty.call(__kwargs91, __key)) continue;
      if (__kwUsed93.has(__key)) continue;
      kw[__key] = __kwargs91[__key];
    }
  }
  return [a, b, rest, c, d, kw, __rubyClassName(blk)];
}
if (typeof globalThis !== "undefined") { globalThis.f = f; }
f(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self94 = this;
  const __block95 = function(...__args96) {
    return (function() {
}).apply(__self94, __args96);
  };
  __block95.__rubyBind = (value) => {
    const __prev97 = __self94;
    __self94 = value;
    return () => {
      __self94 = __prev97;
    };
  };
  return __block95;
})());
function g(...__args98) {
  const __blockCandidate99 = __args98.length ? __args98[__args98.length - 1] : undefined;
  const __block = typeof __blockCandidate99 === 'function' ? __blockCandidate99 : undefined;
  if (typeof __blockCandidate99 === 'function') __args98.pop();
  let __kwargs100 = undefined;
  if (__args98.length) {
    const __kwCandidate101 = __args98[__args98.length - 1];
    if (__kwCandidate101 && typeof __kwCandidate101 === 'object' && !Array.isArray(__kwCandidate101)) {
      __kwargs100 = __kwCandidate101;
      __args98.pop();
    } else if (false) {
    } else {
      __kwargs100 = undefined;
    }
  }
  const __forwardArgs102 = __args98.slice();
  return __rubySend(globalThis, "f", (__kwargs100 === undefined ? __forwardArgs102.slice() : __forwardArgs102.concat(__kwargs100)), __block);
}
if (typeof globalThis !== "undefined") { globalThis.g = g; }
console.log(g(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self107 = this;
  const __block108 = function(...__args109) {
    return (function() {
}).apply(__self107, __args109);
  };
  __block108.__rubyBind = (value) => {
    const __prev110 = __self107;
    __self107 = value;
    return () => {
      __self107 = __prev110;
    };
  };
  return __block108;
})()));
console.log("----- 13th check -----");
function str_concat(str) {
  return __rubyToInteger(str) + 100;
}
if (typeof globalThis !== "undefined") { globalThis.str_concat = str_concat; }
console.log(str_concat("12"));
console.log("----- 12th check -----");
function str_interpolate(name) {
  return `Hello, ${name}!`;
}
if (typeof globalThis !== "undefined") { globalThis.str_interpolate = str_interpolate; }
console.log(str_interpolate("Alice"));
console.log("----- 11th check -----");
function test_equal(val) {
  if (val === undefined) val = 42;
  return console.log(`val = ${val}`);
}
if (typeof globalThis !== "undefined") { globalThis.test_equal = test_equal; }
__rubySend(globalThis, "test_equal", [], undefined);
function test_multi(...val) {
  return console.log(`val = ${val}`);
}
if (typeof globalThis !== "undefined") { globalThis.test_multi = test_multi; }
test_multi(1, 2, 3, 4, 5);
console.log("----- 10th check -----");
const Forwardable = {};
const StringPredicates = {};
  String.prototype["split_predicate"] = function() {
    let attr;
    let op;
    let op_map;
    (() => { const __multi111 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi111, 2); return __multi111; })();
    if (!attr) {
      return null;
    }
    op_map = Object.freeze({ "gt": ">", "lt": "<", "eq": "==" });
    return [String(attr), __rubyFetch(op_map, op)];
  };
class Query {
  constructor(enum_) {
    this.__enum = __rubyLazy(enum_);
  }
  where(block) {
    return new Query(this.__enum.filter(block));
  }
  method_missing(name, ...args) {
    let attr;
    let op;
    let value;
    const __blockCandidate112 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate112 === 'function' ? __blockCandidate112 : undefined;
    if (typeof __blockCandidate112 === 'function') args.pop();
    if ((() => { const __multi113 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi113, 2); return __multi113; })()) {
      value = __rubyFetch(args, 0);
      return this.where((() => {
  let __self114 = this;
  const __block115 = function(...__args116) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self114, __args116);
  };
  __block115.__rubyBind = (value) => {
    const __prev117 = __self114;
    __self114 = value;
    return () => {
      __self114 = __prev117;
    };
  };
  return __block115;
})());
    }
    return (() => {   const __superMethod = super.method_missing;   if (typeof __superMethod !== 'function') {     throw new Error("NoMethodError: undefined method " + String(arguments[0]) + " for " + String(this));   }   return __superMethod.apply(this, arguments); })();
  }
  ["respond_to_missing?"](name, _) {
    if (_ === undefined) _ = false;
    return !!__rubySend(String(name), "split_predicate", [], undefined) || (() => {   const __superMethod = super["respond_to_missing?"];   if (typeof __superMethod !== 'function') {     throw new Error("NoMethodError: super has no method respond_to_missing?");   }   return __superMethod.apply(this, arguments); })();
  }
}
__rubyExtend(Query, Forwardable)
// using StringPredicates
Query.prototype["first"] = function(...args) {
  const __target = this.__enum;
  const __fn = __target != null ? __target["first"] : undefined;
  return typeof __fn === "function" ? __fn.apply(__target, args) : undefined;
};
Query.prototype["to_a"] = function(...args) {
  const __target = this.__enum;
  const __fn = __target != null ? __target["to_a"] : undefined;
  return typeof __fn === "function" ? __fn.apply(__target, args) : undefined;
};
rows = Object.freeze([{ name: "Alice", age: 30, role: "dev" }, { "name": "Bob", "age": 25, "role": "ops" }, { name: "Cara", age: 35, role: "dev" }]);
q = new Query(rows);
result = __rubySend(__rubySend(__rubySend(q, "age_gt", [28], undefined), "where", [], (() => {
  let __self130 = this;
  const __block131 = function(...__args132) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self130, __args132);
  };
  __block131.__rubyBind = (value) => {
    const __prev133 = __self130;
    __self130 = value;
    return () => {
      __self130 = __prev133;
    };
  };
  return __block131;
})()), "to_a", [], undefined);
result.forEach((row) => {
  const __case155 = row;
  const __pattern156 = (() => {
    const __value = __case155;
    if (__value == null) return null;
    const __bindings157 = {};
    if (typeof __value !== 'object') return null;
    let __found159 = false;
    let __prop158;
    if (!__found159 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found159 = true;
      __prop158 = __value["name"];
    }
    if (!__found159 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("name"))) {
      __found159 = true;
      __prop158 = __value[Symbol.for("name")];
    }
    if (!__found159) return null;
    const name = __prop158;
    __bindings157.name = name;
    let __found161 = false;
    let __prop160;
    if (!__found161 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found161 = true;
      __prop160 = __value["age"];
    }
    if (!__found161 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("age"))) {
      __found161 = true;
      __prop160 = __value[Symbol.for("age")];
    }
    if (!__found161) return null;
    const age = __prop160;
    __bindings157.age = age;
    let __found163 = false;
    let __prop162;
    if (!__found163 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found163 = true;
      __prop162 = __value["role"];
    }
    if (!__found163 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("role"))) {
      __found163 = true;
      __prop162 = __value[Symbol.for("role")];
    }
    if (!__found163) return null;
    const role = __prop162;
    __bindings157.role = role;
    return __bindings157;
  })();
  const __pattern164 = (() => {
    const __value = __case155;
    if (__value == null) return null;
    const __bindings165 = {};
    if (typeof __value !== 'object') return null;
    let __found167 = false;
    let __prop166;
    if (!__found167 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found167 = true;
      __prop166 = __value["name"];
    }
    if (!__found167) return null;
    const name = __prop166;
    __bindings165.name = name;
    let __found169 = false;
    let __prop168;
    if (!__found169 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found169 = true;
      __prop168 = __value["age"];
    }
    if (!__found169) return null;
    const age = __prop168;
    __bindings165.age = age;
    let __found171 = false;
    let __prop170;
    if (!__found171 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found171 = true;
      __prop170 = __value["role"];
    }
    if (!__found171) return null;
    const role = __prop170;
    __bindings165.role = role;
    return __bindings165;
  })();
  if (__pattern156) {
    const name = __pattern156.name;
    const age = __pattern156.age;
    const role = __pattern156.role;
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if (__pattern164) {
    const name = __pattern164.name;
    const age = __pattern164.age;
    const role = __pattern164.role;
    return console.log(`${name} (${age}) — ${role}`);
  }
});
console.log("----- 9th check -----");
class TextProcessor {
  constructor(text) {
    this.__text = text;
  }
  transform(__block) {
    if (typeof __block === 'function') {
      this.__text = __block ? __block(this.__text) : undefined;
    }
    return this;
  }
  apply(proc) {
    this.__text = proc(this.__text);
    return this;
  }
  result() {
    return this.__text;
  }
}
to_capitalize = (str) => {
  return __rubySend(__rubySend(__rubySplit(str), "map", [__rubySymbolProc("capitalize")], undefined), "join", [" "], undefined);
};
remove_short = (() => {
  let __self208 = this;
  const __block209 = function(...__args210) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self204 = this;
  const __block205 = function(...__args206) {
    return (function(_1) {
    return _1.length > 3;
  }).apply(__self204, __args206);
  };
  __block205.__rubyBind = (value) => {
    const __prev207 = __self204;
    __self204 = value;
    return () => {
      __self204 = __prev207;
    };
  };
  return __block205;
})()), "join", [" "], undefined);
}).apply(__self208, __args210);
  };
  __block209.__rubyBind = (value) => {
    const __prev211 = __self208;
    __self208 = value;
    return () => {
      __self208 = __prev211;
    };
  };
  return __block209;
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1232 = this;
  const __block1233 = function(...__args1234) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1232, __args1234);
  };
  __block1233.__rubyBind = (value) => {
    const __prev1235 = __self1232;
    __self1232 = value;
    return () => {
      __self1232 = __prev1235;
    };
  };
  return __block1233;
})()), "apply", [to_capitalize], undefined), "apply", [remove_short], undefined), "apply", [reverse_text], undefined), "result", [], undefined);
console.log(processed);
console.log("----- 8th check -----");
class Invoice {
  constructor(client, amount) {
    this.__client = client;
    this.__amount = amount;
  }
  to_text() {
    return `======================
     FACTURE
======================
Client : ${this.__client}
Montant: ${this.__amount} €
Date   : ${__rubyStrftime("%d/%m/%Y")}
======================
`;
  }
}
invoice = new Invoice("Alice Dupont", 250);
console.log(__rubySend(invoice, "to_text", [], undefined));
console.log("----- 7th check -----");
class Model {
  static attr_with_callback(name, callback) {
    this.prototype[name] = function() {
      return this[__rubyIvarName(`@${name}`)];
    };
    return this.prototype[`${name}=`] = function(value) {
      this[__rubyIvarName(`@${name}`)] = value;
      if (callback) {
        return callback(value);
      }
    };
  }
}
class User extends Model {
}
User.attr_with_callback("email", (() => {
  let __self1244 = this;
  const __block1245 = function(...__args1246) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self1244, __args1246);
  };
  __block1245.__rubyBind = (value) => {
    const __prev1247 = __self1244;
    __self1244 = value;
    return () => {
      __self1244 = __prev1247;
    };
  };
  return __block1245;
})());
u = new User();
u["email="]("alice@example.com");
u["email="]("bob@example.com");
console.log("----- 6th check -----");
class MyDynamicClass {
  static my_attr_accessor(...names) {
    return names.forEach((name) => {
      this.prototype[name] = function() {
        return this[__rubyIvarName(`@${name}`)];
      };
      return this.prototype[`${name}=`] = function(value) {
        return this[__rubyIvarName(`@${name}`)] = value;
      };
    });
  }
}
MyDynamicClass.my_attr_accessor("name", "age");
obj = new MyDynamicClass();
obj["name="]("Alice");
obj["age="](30);
console.log(__rubySend(obj, "name", [], undefined));
console.log(__rubySend(obj, "age", [], undefined));
console.log("----- 5th check -----");
c = eval("puts('hi there')");
console.log(__rubyClassName(c));
console.log("----- 4th check -----");
a = { "toto": "titi", "tata": "tutu" };
console.log(__rubyClassName(a));
b = 42;
c = 0.687654354654654;
console.log(b);
console.log(__rubyClassName(b));
console.log(c);
console.log(__rubyClassName(c));
console.log("----- 3rd check -----");
a = { toto: "titi", tata: "tutu" };
console.log(a["tata"]);
console.log("----- 2nd check -----");
class Universe {
  static messages() {
    return this.__messages ||= {  };
  }
  static on(message_id, block) {
    return __rubySend(Universe, "messages", [], undefined)[message_id] = block;
  }
  static server_receiver(params) {
    let callback_found;
    callback_found = __rubySend(Universe, "messages", [], undefined)[params["message_id"]];
    if (typeof callback_found === 'function') {
      return callback_found(params);
    }
  }
}
__rubySend(Universe, "on", ["hello"], (() => {
  let __self1268 = this;
  const __block1269 = function(...__args1270) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
}).apply(__self1268, __args1270);
  };
  __block1269.__rubyBind = (value) => {
    const __prev1271 = __self1268;
    __self1268 = value;
    return () => {
      __self1268 = __prev1271;
    };
  };
  return __block1269;
})());
__rubySend(Universe, "server_receiver", [{ message_id: "hello", content: "Salut depuis Universe 👽" }], undefined);
function avec_trois(val, val2, val3, __block) {
  if (typeof __block === 'function') {
    return __block ? __block(val, val2, val3) : undefined;
  }
}
if (typeof globalThis !== "undefined") { globalThis.avec_trois = avec_trois; }
avec_trois(1, 2, 3, (() => {
  let __self1272 = this;
  const __block1273 = function(...__args1274) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
}).apply(__self1272, __args1274);
  };
  __block1273.__rubyBind = (value) => {
    const __prev1275 = __self1272;
    __self1272 = value;
    return () => {
      __self1272 = __prev1275;
    };
  };
  return __block1273;
})());
console.log("----- 1st check -----");
class Greeter {
  constructor(name) {
    this.__name = name;
  }
  greet(times) {
    let i;
    i = 0;
    while (i < times) {
      return console.log(`Hello ${this.__name}!`);
      return i += 1;
    }
  }
}
__rubySend(new Greeter("Jean"), "greet", [2], undefined);
console.log("----- 0st check -----");
class Task {
  constructor(title) {
    this.__title = title;
    this.__done = false;
  }
  mark_done() {
    return this.__done = true;
  }
  to_s() {
    let status;
    status = this.__done ? "[✔]" : "[ ]";
    return `${status} ${this.__title}`;
  }
}
Task.prototype["title"] = function() { return this.__title; };
Task.prototype["title="] = function(value) { this.__title = value; return value; };
Task.prototype["done"] = function() { return this.__done; };
Task.prototype["done="] = function(value) { this.__done = value; return value; };
class TodoList {
  constructor() {
    this.__tasks = [];
  }
  add_task(title) {
    return this.__tasks.push(new Task(title));
  }
  show() {
    console.log("\n--- Mes Tâches ---");
    return this.__tasks.forEach((task, i) => {
      return console.log(`${i + 1}. ${task}`);
    });
  }
  mark_task_done(index) {
    let task;
    task = this.__tasks[index - 1];
    return task?.mark_done();
  }
}
list = new TodoList();
while (true) {
  console.log("\n1. Ajouter une tâche");
  console.log("2. Voir les tâches");
  console.log("3. Marquer une tâche comme faite");
  console.log("4. Quitter");
  __rubyPrint("> ");
  choix = __rubyToInteger(__rubyGets());
  if (choix === 1) {
    __rubyPrint("Nom de la tâche : ");
    __rubySend(list, "add_task", [__rubyChomp(__rubyGets())], undefined);
  }
  else if (choix === 2) {
    __rubySend(list, "show", [], undefined);
  }
  else if (choix === 3) {
    __rubySend(list, "show", [], undefined);
    __rubyPrint("Numéro de la tâche à cocher : ");
    __rubySend(list, "mark_task_done", [__rubyToInteger(__rubyGets())], undefined);
  }
  else if (choix === 4) {
    console.log("Au revoir !");
    break;
  }
  else {
    console.log("Choix invalide.");
  }
}