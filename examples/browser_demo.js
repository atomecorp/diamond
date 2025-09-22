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
let m;
let obj;
let processed;
let q;
let r;
let remove_short;
let restantes;
let result;
let reverse_text;
let rows;
let say;
let t;
let text;
let to_capitalize;
let u;
let villes;
let visitees;
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

const __rubySwapcase = (value) => {
  const str = String(value ?? "");
  let result = "";
  for (let index = 0; index < str.length; index += 1) {
    const ch = str[index];
    const upper = ch.toUpperCase();
    const lower = ch.toLowerCase();
    if (ch === upper && ch !== lower) {
      result += lower;
    } else if (ch === lower && ch !== upper) {
      result += upper;
    } else {
      result += ch;
    }
  }
  return result;
};

const __rubyCapitalizeBang = (value) => __rubyCapitalize(value);

const __rubyReverseBang = (value) => {
  const str = String(value ?? "");
  return str.split("").reverse().join("");
};

const __rubyUpcaseBang = (value) => String(value ?? "").toUpperCase();

const __rubyDowncaseBang = (value) => String(value ?? "").toLowerCase();

const __rubyMinus = (left, right) => {
  if (Array.isArray(left)) {
    const rightValues = Array.isArray(right) ? right : [right];
    return left.filter((item) => rightValues.every((other) => other !== item));
  }
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
    return leftNumber - rightNumber;
  }
  return left - right;
};

const __rubyTimes = (value, block) => {
  const numeric = Number(value);
  const count = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
  if (typeof block !== "function") {
    return Array.from({ length: count }, (_, index) => index);
  }
  for (let index = 0; index < count; index += 1) {
    block(index);
  }
  return value;
};

const __rubyArrayPush = (target, ...values) => {
  if (Array.isArray(target)) {
    target.push(...values);
    return target;
  }
  if (target && typeof target.push === "function") {
    target.push(...values);
    return target;
  }
  return target;
};

const __rubySymbolProc = (name) => {
  switch (name) {
    case "capitalize":
      return (value) => __rubyCapitalize(value);
    case "swapcase":
      return (value) => __rubySwapcase(value);
    case "upcase":
      return (value) => String(value ?? "").toUpperCase();
    case "downcase":
      return (value) => String(value ?? "").toLowerCase();
    case "reverse":
      return (value) => String(value ?? "").split("").reverse().join("");
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

console.log("----- Full example -----");
say = "I love Ruby";
console.log(say);
say["love"] = "*love*";
console.log((() => { say = __rubyUpcaseBang(say); return say; })());
__rubyTimes(5, (() => {
  let __self1 = this;
  const __block2 = function(...__args3) {
    return (function() {
  return console.log(say);
}).apply(__self1, __args3);
  };
  __block2.__rubyBind = (value) => {
    const __prev4 = __self1;
    __self1 = value;
    return () => {
      __self1 = __prev4;
    };
  };
  return __block2;
})());
a = "hello world";
(() => { a = __rubyCapitalizeBang(a); return a; })();
console.log(a);
(() => { a = __rubyReverseBang(a); return a; })();
console.log(a);
(() => { a = __rubyUpcaseBang(a); return a; })();
console.log(a);
(() => { a = __rubyDowncaseBang(a); return a; })();
console.log(a);
b = __rubySwapcase(a);
console.log(b);
console.log("----- new test 1 -----");
villes = ["Londres", "Oslo", "Paris", "Amsterdam", "Berlin"];
visitees = ["Berlin", "Oslo"];
restantes = __rubyMinus(villes, visitees);
console.log("Encore à visiter :");
console.log(restantes);
class Majordome {
  constructor(nom) {
    this.__nom = __rubyCapitalize(nom);
  }
  saluer() {
    return console.log(`Bonjour ${this.__nom} !`);
  }
}
m = new Majordome("patron");
__rubySend(m, "saluer", [], undefined);
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
    const __singleton5 = K;
    if (__singleton5 == null) { return; }
    __singleton5.cm = function() {
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
  let __result10;
  let __handled11 = false;
  try {
    __result10 = (() => {
    return __rubyRaise(__rubyEnsureError("ArgumentError"), "bad");
  }).call(this);
  } catch (__error12) {
    if (!__handled11 && __rubyRescueMatch(__error12, ["ArgumentError"])) {
      const e = __error12;
      __result10 = (() => {
      return __rubyClassName(e);
    }).call(this);
      __handled11 = true;
    }
    if (!__handled11) throw __error12;
  } finally {
    "always";
  }
  return __result10;
})();;
x = (() => {
  let __result13;
  let __handled14 = false;
  try {
    __result13 = (() => {
    return 1 / 0;
  }).call(this);
  } catch (__error15) {
    if (!__handled14 && true) {
      __result13 = (() => {
      return "err";
    }).call(this);
      __handled14 = true;
    }
    if (!__handled14) throw __error15;
  }
  return __result13;
})();;
t = new Thread((() => {
  let __self16 = this;
  const __block17 = function(...__args18) {
    return (function() {
  return __rubySend(Thread, "current", [], undefined)["foo"] = 1;
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
__f = new Fiber((() => {
  let __self20 = this;
  const __block21 = function(...__args22) {
    return (function() {
  __rubySend(Fiber, "yield", [], undefined)(1);
  return 2;
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
e = new Enumerator((() => {
  let __self24 = this;
  const __block25 = function(...__args26) {
    return (function(y) {
  __rubyArrayPush(y, 1);
  return __rubyArrayPush(y, 2);
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
__rubySend(File, "open", [__FILE__, "r"], (() => {
  let __self28 = this;
  const __block29 = function(...__args30) {
    return (function(f) {
  return __rubyGets();
}).apply(__self28, __args30);
  };
  __block29.__rubyBind = (value) => {
    const __prev31 = __self28;
    __self28 = value;
    return () => {
      __self28 = __prev31;
    };
  };
  return __block29;
})());
a = ["a", "b", "c"];
r = new RegExp("(\\d+)\\s+(?<name>\\w+)", "u");
h = "leading\n";
console.log(a[1], __rubyMatch(r, "123 abc")["name"], h);
const __case32 = [1, 2, 3];
const __pattern33 = (() => {
  const __value = __case32;
  if (__value == null) return null;
  const __bindings34 = {};
  if (!Array.isArray(__value)) return null;
  if (__value.length < 1) return null;
  const __elem35 = __value[0];
  const a = __elem35;
  __bindings34.a = a;
  const rest = __value.slice(1);
  __bindings34.rest = rest;
  if (!(a > 0)) return null;
  return __bindings34;
})();
if (__pattern33) {
  const a = __pattern33.a;
  const rest = __pattern33.rest;
  [a, rest];
}
x = 1;
const __case36 = { x: 1 };
const __pattern37 = (() => {
  const __value = __case36;
  if (__value == null) return null;
  const __bindings38 = {};
  if (typeof __value !== 'object') return null;
  let __found40 = false;
  let __prop39;
  if (!__found40 && Object.prototype.hasOwnProperty.call(__value, "x")) {
    __found40 = true;
    __prop39 = __value["x"];
  }
  if (!__found40 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("x"))) {
    __found40 = true;
    __prop39 = __value[Symbol.for("x")];
  }
  if (!__found40) return null;
  if (__prop39 !== x) return null;
  return __bindings38;
})();
if (__pattern37) {
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
  let __self57 = this;
  const __block58 = function(...__args59) {
    return (function(tp) {
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
})()), "enable", [], (() => {
  let __self45 = this;
  const __block46 = function(...__args47) {
    return (function() {
}).apply(__self45, __args47);
  };
  __block46.__rubyBind = (value) => {
    const __prev48 = __self45;
    __self45 = value;
    return () => {
      __self45 = __prev48;
    };
  };
  return __block46;
})());
function multi(__block) {
  __block ? __block(1) : undefined;
  return __block ? __block(2) : undefined;
}
if (typeof globalThis !== "undefined") { globalThis.multi = multi; }
__rubySend([1, 2], "map", [__rubySymbolProc("to_s")], undefined);
__rubySend(globalThis, "catch", ["k"], (() => {
  let __self61 = this;
  const __block62 = function(...__args63) {
    return (function() {
  return __rubySend(this, "throw", ["k", "val"], undefined);
}).apply(__self61, __args63);
  };
  __block62.__rubyBind = (value) => {
    const __prev64 = __self61;
    __self61 = value;
    return () => {
      __self61 = __prev64;
    };
  };
  return __block62;
})());
__rubySend(__rubySend(1, "tap", [], (() => {
  let __self81 = this;
  const __block82 = function(...__args83) {
    return (function(v) {
  return v + 1;
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
})()), "then", [], (() => {
  let __self69 = this;
  const __block70 = function(...__args71) {
    return (function(v) {
  return v * 2;
}).apply(__self69, __args71);
  };
  __block70.__rubyBind = (value) => {
    const __prev72 = __self69;
    __self69 = value;
    return () => {
      __self69 = __prev72;
    };
  };
  return __block70;
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
  let __self85 = this;
  const __block86 = function(...__args87) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
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
  let __self89 = this;
  const __block90 = function(...__args91) {
    return (function() {
  console.log(`val  = ${__rubySend(this, "val", [], undefined)}`);
  console.log(`val2 = ${__rubySend(this, "val2", [], undefined)}`);
  return console.log(`val3 = ${__rubySend(this, "val3", [], undefined)}`);
}).apply(__self89, __args91);
  };
  __block90.__rubyBind = (value) => {
    const __prev92 = __self89;
    __self89 = value;
    return () => {
      __self89 = __prev92;
    };
  };
  return __block90;
})());
console.log("----- 14th check -----");
function f(...__args93) {
  const __blockCandidate94 = __args93.length ? __args93[__args93.length - 1] : undefined;
  const blk = typeof __blockCandidate94 === 'function' ? __blockCandidate94 : undefined;
  if (typeof __blockCandidate94 === 'function') __args93.pop();
  let __kwargs95 = {};
  if (__args93.length) {
    const __kwCandidate96 = __args93[__args93.length - 1];
    if (__kwCandidate96 && typeof __kwCandidate96 === 'object' && !Array.isArray(__kwCandidate96)) {
      __kwargs95 = __kwCandidate96;
      __args93.pop();
    } else if (true) {
      __kwargs95 = {};
    } else {
      __kwargs95 = undefined;
    }
  }
  if (__kwargs95 === undefined) __kwargs95 = {};
  const a = __args93.length ? __args93.shift() : undefined;
  let b = __args93.length ? __args93.shift() : undefined;
  if (b === undefined) b = 2;
  const rest = __args93.splice(0);
  const __kwUsed97 = new Set();
  if (__kwargs95 === undefined || !Object.prototype.hasOwnProperty.call(__kwargs95, "c")) {
    throw new Error("ArgumentError: missing keyword: c");
  }
  const c = __kwargs95["c"];
  __kwUsed97.add("c");
  let d = __kwargs95 && Object.prototype.hasOwnProperty.call(__kwargs95, "d") ? __kwargs95["d"] : 4;
  __kwUsed97.add("d");
  const kw = {};
  if (__kwargs95 && typeof __kwargs95 === 'object') {
    for (const __key in __kwargs95) {
      if (!Object.prototype.hasOwnProperty.call(__kwargs95, __key)) continue;
      if (__kwUsed97.has(__key)) continue;
      kw[__key] = __kwargs95[__key];
    }
  }
  return [a, b, rest, c, d, kw, __rubyClassName(blk)];
}
if (typeof globalThis !== "undefined") { globalThis.f = f; }
f(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self98 = this;
  const __block99 = function(...__args100) {
    return (function() {
}).apply(__self98, __args100);
  };
  __block99.__rubyBind = (value) => {
    const __prev101 = __self98;
    __self98 = value;
    return () => {
      __self98 = __prev101;
    };
  };
  return __block99;
})());
function g(...__args102) {
  const __blockCandidate103 = __args102.length ? __args102[__args102.length - 1] : undefined;
  const __block = typeof __blockCandidate103 === 'function' ? __blockCandidate103 : undefined;
  if (typeof __blockCandidate103 === 'function') __args102.pop();
  let __kwargs104 = undefined;
  if (__args102.length) {
    const __kwCandidate105 = __args102[__args102.length - 1];
    if (__kwCandidate105 && typeof __kwCandidate105 === 'object' && !Array.isArray(__kwCandidate105)) {
      __kwargs104 = __kwCandidate105;
      __args102.pop();
    } else if (false) {
    } else {
      __kwargs104 = undefined;
    }
  }
  const __forwardArgs106 = __args102.slice();
  return __rubySend(globalThis, "f", (__kwargs104 === undefined ? __forwardArgs106.slice() : __forwardArgs106.concat(__kwargs104)), __block);
}
if (typeof globalThis !== "undefined") { globalThis.g = g; }
console.log(g(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self111 = this;
  const __block112 = function(...__args113) {
    return (function() {
}).apply(__self111, __args113);
  };
  __block112.__rubyBind = (value) => {
    const __prev114 = __self111;
    __self111 = value;
    return () => {
      __self111 = __prev114;
    };
  };
  return __block112;
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
    (() => { const __multi115 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi115, 2); return __multi115; })();
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
    const __blockCandidate116 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate116 === 'function' ? __blockCandidate116 : undefined;
    if (typeof __blockCandidate116 === 'function') args.pop();
    if ((() => { const __multi117 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi117, 2); return __multi117; })()) {
      value = __rubyFetch(args, 0);
      return this.where((() => {
  let __self118 = this;
  const __block119 = function(...__args120) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self118, __args120);
  };
  __block119.__rubyBind = (value) => {
    const __prev121 = __self118;
    __self118 = value;
    return () => {
      __self118 = __prev121;
    };
  };
  return __block119;
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
  let __self134 = this;
  const __block135 = function(...__args136) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self134, __args136);
  };
  __block135.__rubyBind = (value) => {
    const __prev137 = __self134;
    __self134 = value;
    return () => {
      __self134 = __prev137;
    };
  };
  return __block135;
})()), "to_a", [], undefined);
result.forEach((row) => {
  const __case159 = row;
  const __pattern160 = (() => {
    const __value = __case159;
    if (__value == null) return null;
    const __bindings161 = {};
    if (typeof __value !== 'object') return null;
    let __found163 = false;
    let __prop162;
    if (!__found163 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found163 = true;
      __prop162 = __value["name"];
    }
    if (!__found163 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("name"))) {
      __found163 = true;
      __prop162 = __value[Symbol.for("name")];
    }
    if (!__found163) return null;
    const name = __prop162;
    __bindings161.name = name;
    let __found165 = false;
    let __prop164;
    if (!__found165 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found165 = true;
      __prop164 = __value["age"];
    }
    if (!__found165 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("age"))) {
      __found165 = true;
      __prop164 = __value[Symbol.for("age")];
    }
    if (!__found165) return null;
    const age = __prop164;
    __bindings161.age = age;
    let __found167 = false;
    let __prop166;
    if (!__found167 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found167 = true;
      __prop166 = __value["role"];
    }
    if (!__found167 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("role"))) {
      __found167 = true;
      __prop166 = __value[Symbol.for("role")];
    }
    if (!__found167) return null;
    const role = __prop166;
    __bindings161.role = role;
    return __bindings161;
  })();
  const __pattern168 = (() => {
    const __value = __case159;
    if (__value == null) return null;
    const __bindings169 = {};
    if (typeof __value !== 'object') return null;
    let __found171 = false;
    let __prop170;
    if (!__found171 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found171 = true;
      __prop170 = __value["name"];
    }
    if (!__found171) return null;
    const name = __prop170;
    __bindings169.name = name;
    let __found173 = false;
    let __prop172;
    if (!__found173 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found173 = true;
      __prop172 = __value["age"];
    }
    if (!__found173) return null;
    const age = __prop172;
    __bindings169.age = age;
    let __found175 = false;
    let __prop174;
    if (!__found175 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found175 = true;
      __prop174 = __value["role"];
    }
    if (!__found175) return null;
    const role = __prop174;
    __bindings169.role = role;
    return __bindings169;
  })();
  if (__pattern160) {
    const name = __pattern160.name;
    const age = __pattern160.age;
    const role = __pattern160.role;
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if (__pattern168) {
    const name = __pattern168.name;
    const age = __pattern168.age;
    const role = __pattern168.role;
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
  let __self212 = this;
  const __block213 = function(...__args214) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self208 = this;
  const __block209 = function(...__args210) {
    return (function(_1) {
    return _1.length > 3;
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
})()), "join", [" "], undefined);
}).apply(__self212, __args214);
  };
  __block213.__rubyBind = (value) => {
    const __prev215 = __self212;
    __self212 = value;
    return () => {
      __self212 = __prev215;
    };
  };
  return __block213;
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1236 = this;
  const __block1237 = function(...__args1238) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1236, __args1238);
  };
  __block1237.__rubyBind = (value) => {
    const __prev1239 = __self1236;
    __self1236 = value;
    return () => {
      __self1236 = __prev1239;
    };
  };
  return __block1237;
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
  let __self1248 = this;
  const __block1249 = function(...__args1250) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self1248, __args1250);
  };
  __block1249.__rubyBind = (value) => {
    const __prev1251 = __self1248;
    __self1248 = value;
    return () => {
      __self1248 = __prev1251;
    };
  };
  return __block1249;
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
  let __self1272 = this;
  const __block1273 = function(...__args1274) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
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
__rubySend(Universe, "server_receiver", [{ message_id: "hello", content: "Salut depuis Universe 👽" }], undefined);
function avec_trois(val, val2, val3, __block) {
  if (typeof __block === 'function') {
    return __block ? __block(val, val2, val3) : undefined;
  }
}
if (typeof globalThis !== "undefined") { globalThis.avec_trois = avec_trois; }
avec_trois(1, 2, 3, (() => {
  let __self1276 = this;
  const __block1277 = function(...__args1278) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
}).apply(__self1276, __args1278);
  };
  __block1277.__rubyBind = (value) => {
    const __prev1279 = __self1276;
    __self1276 = value;
    return () => {
      __self1276 = __prev1279;
    };
  };
  return __block1277;
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
    return __rubyArrayPush(this.__tasks, new Task(title));
  }
  show() {
    console.log("\n--- Mes Tâches ---");
    return this.__tasks.forEach((task, i) => {
      return console.log(`${i + 1}. ${task}`);
    });
  }
  mark_task_done(index) {
    let task;
    task = this.__tasks[__rubyMinus(index, 1)];
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