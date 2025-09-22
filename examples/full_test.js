let MYCONST;
let __f;
let a;
let apply_transform;
let b;
let base_shadow;
let box;
let c;
let choix;
let cleanup_resize;
let container;
let currentX;
let currentY;
let default_transition;
let dragPointerId;
let drag_shadow;
let dragging;
let drop_check;
let dropzone;
let fs;
let h;
let handle;
let invoice;
let isOver;
let label;
let list;
let m;
let moveDrag;
let obj;
let pendingFrame;
let processed;
let q;
let r;
let raf_candidate;
let raf_fn;
let remove_short;
let resizeOffsetX;
let resizeOffsetY;
let resizePointerId;
let resizePrevTransition;
let resizing;
let restantes;
let result;
let reverse_text;
let rows;
let say;
let schedule_transform;
let startDrag;
let startH;
let startW;
let startX;
let startY;
let stopDrag;
let t;
let text;
let to_capitalize;
let u;
let villes;
let visitees;
let window_obj;
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

const __rubyToFloat = (value) => {
  const num = parseFloat(String(value ?? ""));
  return Number.isNaN(num) ? 0 : num;
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

container = __rubySend(document, "createElement", ["div"], undefined);
container["style"]["width"] = "100%";
container["style"]["height"] = "100vh";
container["style"]["margin"] = "0";
container["style"]["display"] = "flex";
container["style"]["alignItems"] = "center";
container["style"]["justifyContent"] = "center";
container["style"]["background"] = "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)";
container["style"]["position"] = "relative";
__rubySend(document["body"], "appendChild", [container], undefined);
box = __rubySend(document, "createElement", ["div"], undefined);
box["style"]["width"] = "220px";
box["style"]["height"] = "140px";
box["style"]["borderRadius"] = "16px";
box["style"]["boxShadow"] = "0 10px 25px rgba(0,0,0,.25)";
box["style"]["background"] = "linear-gradient(135deg, #6EE7F9 0%, #9333EA 100%)";
box["style"]["position"] = "relative";
box["style"]["cursor"] = "grab";
box["style"]["userSelect"] = "none";
box["style"]["touchAction"] = "none";
box["style"]["willChange"] = "transform";
box["style"]["transform"] = "translate3d(0px, 0px, 0)";
box["style"]["transition"] = "transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease";
default_transition = box["style"]["transition"];
__rubySend(container, "appendChild", [box], undefined);
label = __rubySend(document, "createElement", ["div"], undefined);
label["style"]["color"] = "#fff";
label["style"]["fontFamily"] = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
label["style"]["fontSize"] = "14px";
label["style"]["padding"] = "12px";
label["innerText"] = "Click / Tap / Drag me";
__rubySend(box, "appendChild", [label], undefined);
handle = __rubySend(document, "createElement", ["div"], undefined);
handle["style"]["position"] = "absolute";
handle["style"]["right"] = "6px";
handle["style"]["bottom"] = "6px";
handle["style"]["width"] = "14px";
handle["style"]["height"] = "14px";
handle["style"]["borderRadius"] = "3px";
handle["style"]["background"] = "rgba(255,255,255,.85)";
handle["style"]["boxShadow"] = "0 1px 3px rgba(0,0,0,.3)";
handle["style"]["cursor"] = "nwse-resize";
__rubySend(box, "appendChild", [handle], undefined);
__rubySend(box, "addEventListener", ["mouseenter", (e) => {
  return box["style"]["boxShadow"] = "0 14px 32px rgba(0,0,0,.32)";
}], undefined);
__rubySend(box, "addEventListener", ["mouseleave", (e) => {
  return box["style"]["boxShadow"] = "0 10px 25px rgba(0,0,0,.25)";
}], undefined);
__rubySend(box, "addEventListener", ["click", (e) => {
  return __rubySend(console, "log", ["clicked"], undefined);
}], undefined);
__rubySend(box, "addEventListener", ["touchstart", (e) => {
  return __rubySend(console, "log", ["tap"], undefined);
}], undefined);
dragging = false;
dragPointerId = null;
startX = 0;
startY = 0;
currentX = 0;
currentY = 0;
pendingFrame = false;
window_obj = null;
(() => {
  let __result1;
  let __handled2 = false;
  try {
    __result1 = (() => {
    return window_obj = __rubySend(JS, "global", [], undefined)["window"];
  }).call(this);
  } catch (__error3) {
    if (!__handled2 && __rubyRescueMatch(__error3, ["NameError"])) {
      __result1 = (() => {
      return window_obj = null;
    }).call(this);
      __handled2 = true;
    }
    if (!__handled2) throw __error3;
  }
  return __result1;
})();;
raf_fn = null;
if (window_obj) {
  raf_candidate = window_obj["requestAnimationFrame"];
  if (raf_candidate) {
    raf_fn = raf_candidate;
  }
}
apply_transform = null;
apply_transform = (() => {
  let __self4 = this;
  const __block5 = function(...__args6) {
    return (function(_timestamp) {
  pendingFrame = false;
  return box["style"]["transform"] = `translate3d(${currentX}px, ${currentY}px, 0)`;
}).apply(__self4, __args6);
  };
  __block5.__rubyBind = (value) => {
    const __prev7 = __self4;
    __self4 = value;
    return () => {
      __self4 = __prev7;
    };
  };
  return __block5;
})();
schedule_transform = (() => {
  let __self8 = this;
  const __block9 = function(...__args10) {
    return (function() {
  if (raf_fn) {
    if (pendingFrame) {
    }
    else {
      pendingFrame = true;
      return raf_fn((ts) => {
        return apply_transform(ts);
      });
    }
  }
  else {
    return apply_transform(null);
  }
}).apply(__self8, __args10);
  };
  __block9.__rubyBind = (value) => {
    const __prev11 = __self8;
    __self8 = value;
    return () => {
      __self8 = __prev11;
    };
  };
  return __block9;
})();
base_shadow = box["style"]["boxShadow"];
drag_shadow = "0 8px 18px rgba(0,0,0,.22)";
drop_check = null;
startDrag = (event) => {
  dragging = true;
  dragPointerId = event["pointerId"];
  if (box["setPointerCapture"]) {
    box["setPointerCapture"](dragPointerId);
  }
  box["style"]["cursor"] = "grabbing";
  box["style"]["boxShadow"] = drag_shadow;
  box["style"]["transition"] = "transform 0s, width .2s ease, height .2s ease, box-shadow .2s ease";
  startX = __rubyMinus(event["clientX"], currentX);
  startY = __rubyMinus(event["clientY"], currentY);
  if (event["preventDefault"]) {
    return event["preventDefault"]();
  }
};
moveDrag = (event) => {
  if (dragging && dragPointerId && event["pointerId"] === dragPointerId) {
    currentX = __rubyMinus(event["clientX"], startX);
    currentY = __rubyMinus(event["clientY"], startY);
    return schedule_transform();
  }
};
stopDrag = () => {
  if (dragging) {
    dragging = false;
    if (dragPointerId && box["releasePointerCapture"]) {
      box["releasePointerCapture"](dragPointerId);
    }
    dragPointerId = null;
    box["style"]["cursor"] = "grab";
    box["style"]["boxShadow"] = base_shadow;
    box["style"]["transition"] = default_transition;
    return schedule_transform();
  }
};
__rubySend(box, "addEventListener", ["pointerdown", (event) => {
  let button;
  if (!resizing) {
    button = event["button"];
    if (button === null || button === 0) {
      return startDrag(event);
    }
  }
}], undefined);
resizing = false;
resizePointerId = null;
startW = 0;
startH = 0;
resizeOffsetX = 0;
resizeOffsetY = 0;
resizePrevTransition = "";
__rubySend(handle, "addEventListener", ["pointerdown", (event) => {
  resizing = true;
  resizePointerId = event["pointerId"];
  if (handle["setPointerCapture"]) {
    handle["setPointerCapture"](resizePointerId);
  }
  startX = event["clientX"];
  startY = event["clientY"];
  startW = box["offsetWidth"];
  startH = box["offsetHeight"];
  resizeOffsetX = currentX;
  resizeOffsetY = currentY;
  resizePrevTransition = box["style"]["transition"] || default_transition;
  box["style"]["transition"] = "none";
  box["style"]["boxShadow"] = drag_shadow;
  if (event["stopPropagation"]) {
    event["stopPropagation"]();
  }
  if (event["preventDefault"]) {
    return event["preventDefault"]();
  }
}], undefined);
__rubySend(document, "addEventListener", ["pointermove", (event) => {
  let dh;
  let dw;
  let newH;
  let newW;
  if (resizing && resizePointerId && event["pointerId"] === resizePointerId) {
    dw = __rubyMinus(event["clientX"], startX);
    dh = __rubyMinus(event["clientY"], startY);
    newW = Math.max(...[100, __rubyToFloat(startW) + dw]);
    newH = Math.max(...[80, __rubyToFloat(startH) + dh]);
    currentX = resizeOffsetX + __rubyMinus(newW, __rubyToFloat(startW)) / 2;
    currentY = resizeOffsetY + __rubyMinus(newH, __rubyToFloat(startH)) / 2;
    box["style"]["width"] = `${__rubyToInteger(newW)}px`;
    box["style"]["height"] = `${__rubyToInteger(newH)}px`;
    return schedule_transform();
  }
  else if (dragging && dragPointerId && event["pointerId"] === dragPointerId) {
    return moveDrag(event);
  }
}], undefined);
cleanup_resize = () => {
  resizing = false;
  if (handle["releasePointerCapture"] && resizePointerId) {
    handle["releasePointerCapture"](resizePointerId);
  }
  resizePointerId = null;
  box["style"]["transition"] = resizePrevTransition || default_transition;
  box["style"]["boxShadow"] = base_shadow;
  return schedule_transform();
};
__rubySend(document, "addEventListener", ["pointerup", (event) => {
  if (resizing && resizePointerId && event["pointerId"] === resizePointerId) {
    cleanup_resize();
    if (event["preventDefault"]) {
      return event["preventDefault"]();
    }
  }
  else if (dragging && dragPointerId && event["pointerId"] === dragPointerId) {
    stopDrag();
    if (drop_check) {
      return drop_check(event["clientX"], event["clientY"]);
    }
  }
}], undefined);
__rubySend(document, "addEventListener", ["pointercancel", (event) => {
  if (resizing && resizePointerId && event["pointerId"] === resizePointerId) {
    return cleanup_resize();
  }
  else if (dragging && dragPointerId && event["pointerId"] === dragPointerId) {
    return stopDrag();
  }
}], undefined);
dropzone = __rubySend(document, "createElement", ["div"], undefined);
dropzone["style"]["position"] = "absolute";
dropzone["style"]["top"] = "20px";
dropzone["style"]["left"] = "20px";
dropzone["style"]["width"] = "120px";
dropzone["style"]["height"] = "80px";
dropzone["style"]["border"] = "2px dashed rgba(255,255,255,.75)";
dropzone["style"]["borderRadius"] = "8px";
dropzone["style"]["color"] = "#fff";
dropzone["style"]["display"] = "flex";
dropzone["style"]["alignItems"] = "center";
dropzone["style"]["justifyContent"] = "center";
dropzone["innerText"] = "Drop here";
__rubySend(container, "appendChild", [dropzone], undefined);
isOver = (el, x, y) => {
  let r;
  r = el["getBoundingClientRect"]();
  return x >= r["left"] && x <= r["right"] && y >= r["top"] && y <= r["bottom"];
};
drop_check = (clientX, clientY) => {
  if (isOver(dropzone, clientX, clientY)) {
    currentX = 20;
    currentY = 20;
    schedule_transform();
    return __rubySend(console, "log", ["dropped"], undefined);
  }
};
console.log("----- Full example -----");
say = "I love Ruby";
console.log(say);
say["love"] = "*love*";
console.log((() => { say = __rubyUpcaseBang(say); return say; })());
__rubyTimes(5, (() => {
  let __self12 = this;
  const __block13 = function(...__args14) {
    return (function() {
  return console.log(say);
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
    const __singleton16 = K;
    if (__singleton16 == null) { return; }
    __singleton16.cm = function() {
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
  let __result21;
  let __handled22 = false;
  try {
    __result21 = (() => {
    return __rubyRaise(__rubyEnsureError("ArgumentError"), "bad");
  }).call(this);
  } catch (__error23) {
    if (!__handled22 && __rubyRescueMatch(__error23, ["ArgumentError"])) {
      const e = __error23;
      __result21 = (() => {
      return __rubyClassName(e);
    }).call(this);
      __handled22 = true;
    }
    if (!__handled22) throw __error23;
  } finally {
    "always";
  }
  return __result21;
})();;
x = (() => {
  let __result24;
  let __handled25 = false;
  try {
    __result24 = (() => {
    return 1 / 0;
  }).call(this);
  } catch (__error26) {
    if (!__handled25 && true) {
      __result24 = (() => {
      return "err";
    }).call(this);
      __handled25 = true;
    }
    if (!__handled25) throw __error26;
  }
  return __result24;
})();;
t = new Thread((() => {
  let __self27 = this;
  const __block28 = function(...__args29) {
    return (function() {
  return __rubySend(Thread, "current", [], undefined)["foo"] = 1;
}).apply(__self27, __args29);
  };
  __block28.__rubyBind = (value) => {
    const __prev30 = __self27;
    __self27 = value;
    return () => {
      __self27 = __prev30;
    };
  };
  return __block28;
})());
__f = new Fiber((() => {
  let __self31 = this;
  const __block32 = function(...__args33) {
    return (function() {
  __rubySend(Fiber, "yield", [], undefined)(1);
  return 2;
}).apply(__self31, __args33);
  };
  __block32.__rubyBind = (value) => {
    const __prev34 = __self31;
    __self31 = value;
    return () => {
      __self31 = __prev34;
    };
  };
  return __block32;
})());
e = new Enumerator((() => {
  let __self35 = this;
  const __block36 = function(...__args37) {
    return (function(y) {
  __rubyArrayPush(y, 1);
  return __rubyArrayPush(y, 2);
}).apply(__self35, __args37);
  };
  __block36.__rubyBind = (value) => {
    const __prev38 = __self35;
    __self35 = value;
    return () => {
      __self35 = __prev38;
    };
  };
  return __block36;
})());
__rubySend(File, "open", [__FILE__, "r"], (() => {
  let __self39 = this;
  const __block40 = function(...__args41) {
    return (function(f) {
  return __rubyGets();
}).apply(__self39, __args41);
  };
  __block40.__rubyBind = (value) => {
    const __prev42 = __self39;
    __self39 = value;
    return () => {
      __self39 = __prev42;
    };
  };
  return __block40;
})());
a = ["a", "b", "c"];
r = new RegExp("(\\d+)\\s+(?<name>\\w+)", "u");
h = "leading\n";
console.log(a[1], __rubyMatch(r, "123 abc")["name"], h);
const __case43 = [1, 2, 3];
const __pattern44 = (() => {
  const __value = __case43;
  if (__value == null) return null;
  const __bindings45 = {};
  if (!Array.isArray(__value)) return null;
  if (__value.length < 1) return null;
  const __elem46 = __value[0];
  const a = __elem46;
  __bindings45.a = a;
  const rest = __value.slice(1);
  __bindings45.rest = rest;
  if (!(a > 0)) return null;
  return __bindings45;
})();
if (__pattern44) {
  const a = __pattern44.a;
  const rest = __pattern44.rest;
  [a, rest];
}
x = 1;
const __case47 = { x: 1 };
const __pattern48 = (() => {
  const __value = __case47;
  if (__value == null) return null;
  const __bindings49 = {};
  if (typeof __value !== 'object') return null;
  let __found51 = false;
  let __prop50;
  if (!__found51 && Object.prototype.hasOwnProperty.call(__value, "x")) {
    __found51 = true;
    __prop50 = __value["x"];
  }
  if (!__found51 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("x"))) {
    __found51 = true;
    __prop50 = __value[Symbol.for("x")];
  }
  if (!__found51) return null;
  if (__prop50 !== x) return null;
  return __bindings49;
})();
if (__pattern48) {
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
  let __self68 = this;
  const __block69 = function(...__args70) {
    return (function(tp) {
}).apply(__self68, __args70);
  };
  __block69.__rubyBind = (value) => {
    const __prev71 = __self68;
    __self68 = value;
    return () => {
      __self68 = __prev71;
    };
  };
  return __block69;
})()), "enable", [], (() => {
  let __self56 = this;
  const __block57 = function(...__args58) {
    return (function() {
}).apply(__self56, __args58);
  };
  __block57.__rubyBind = (value) => {
    const __prev59 = __self56;
    __self56 = value;
    return () => {
      __self56 = __prev59;
    };
  };
  return __block57;
})());
function multi(__block) {
  __block ? __block(1) : undefined;
  return __block ? __block(2) : undefined;
}
if (typeof globalThis !== "undefined") { globalThis.multi = multi; }
__rubySend([1, 2], "map", [__rubySymbolProc("to_s")], undefined);
__rubySend(globalThis, "catch", ["k"], (() => {
  let __self72 = this;
  const __block73 = function(...__args74) {
    return (function() {
  return __rubySend(this, "throw", ["k", "val"], undefined);
}).apply(__self72, __args74);
  };
  __block73.__rubyBind = (value) => {
    const __prev75 = __self72;
    __self72 = value;
    return () => {
      __self72 = __prev75;
    };
  };
  return __block73;
})());
__rubySend(__rubySend(1, "tap", [], (() => {
  let __self92 = this;
  const __block93 = function(...__args94) {
    return (function(v) {
  return v + 1;
}).apply(__self92, __args94);
  };
  __block93.__rubyBind = (value) => {
    const __prev95 = __self92;
    __self92 = value;
    return () => {
      __self92 = __prev95;
    };
  };
  return __block93;
})()), "then", [], (() => {
  let __self80 = this;
  const __block81 = function(...__args82) {
    return (function(v) {
  return v * 2;
}).apply(__self80, __args82);
  };
  __block81.__rubyBind = (value) => {
    const __prev83 = __self80;
    __self80 = value;
    return () => {
      __self80 = __prev83;
    };
  };
  return __block81;
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
  let __self96 = this;
  const __block97 = function(...__args98) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self96, __args98);
  };
  __block97.__rubyBind = (value) => {
    const __prev99 = __self96;
    __self96 = value;
    return () => {
      __self96 = __prev99;
    };
  };
  return __block97;
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
  let __self100 = this;
  const __block101 = function(...__args102) {
    return (function() {
  console.log(`val  = ${__rubySend(this, "val", [], undefined)}`);
  console.log(`val2 = ${__rubySend(this, "val2", [], undefined)}`);
  return console.log(`val3 = ${__rubySend(this, "val3", [], undefined)}`);
}).apply(__self100, __args102);
  };
  __block101.__rubyBind = (value) => {
    const __prev103 = __self100;
    __self100 = value;
    return () => {
      __self100 = __prev103;
    };
  };
  return __block101;
})());
console.log("----- 14th check -----");
function f(...__args104) {
  const __blockCandidate105 = __args104.length ? __args104[__args104.length - 1] : undefined;
  const blk = typeof __blockCandidate105 === 'function' ? __blockCandidate105 : undefined;
  if (typeof __blockCandidate105 === 'function') __args104.pop();
  let __kwargs106 = {};
  if (__args104.length) {
    const __kwCandidate107 = __args104[__args104.length - 1];
    if (__kwCandidate107 && typeof __kwCandidate107 === 'object' && !Array.isArray(__kwCandidate107)) {
      __kwargs106 = __kwCandidate107;
      __args104.pop();
    } else if (true) {
      __kwargs106 = {};
    } else {
      __kwargs106 = undefined;
    }
  }
  if (__kwargs106 === undefined) __kwargs106 = {};
  const a = __args104.length ? __args104.shift() : undefined;
  let b = __args104.length ? __args104.shift() : undefined;
  if (b === undefined) b = 2;
  const rest = __args104.splice(0);
  const __kwUsed108 = new Set();
  if (__kwargs106 === undefined || !Object.prototype.hasOwnProperty.call(__kwargs106, "c")) {
    throw new Error("ArgumentError: missing keyword: c");
  }
  const c = __kwargs106["c"];
  __kwUsed108.add("c");
  let d = __kwargs106 && Object.prototype.hasOwnProperty.call(__kwargs106, "d") ? __kwargs106["d"] : 4;
  __kwUsed108.add("d");
  const kw = {};
  if (__kwargs106 && typeof __kwargs106 === 'object') {
    for (const __key in __kwargs106) {
      if (!Object.prototype.hasOwnProperty.call(__kwargs106, __key)) continue;
      if (__kwUsed108.has(__key)) continue;
      kw[__key] = __kwargs106[__key];
    }
  }
  return [a, b, rest, c, d, kw, __rubyClassName(blk)];
}
if (typeof globalThis !== "undefined") { globalThis.f = f; }
f(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self109 = this;
  const __block110 = function(...__args111) {
    return (function() {
}).apply(__self109, __args111);
  };
  __block110.__rubyBind = (value) => {
    const __prev112 = __self109;
    __self109 = value;
    return () => {
      __self109 = __prev112;
    };
  };
  return __block110;
})());
function g(...__args113) {
  const __blockCandidate114 = __args113.length ? __args113[__args113.length - 1] : undefined;
  const __block = typeof __blockCandidate114 === 'function' ? __blockCandidate114 : undefined;
  if (typeof __blockCandidate114 === 'function') __args113.pop();
  let __kwargs115 = undefined;
  if (__args113.length) {
    const __kwCandidate116 = __args113[__args113.length - 1];
    if (__kwCandidate116 && typeof __kwCandidate116 === 'object' && !Array.isArray(__kwCandidate116)) {
      __kwargs115 = __kwCandidate116;
      __args113.pop();
    } else if (false) {
    } else {
      __kwargs115 = undefined;
    }
  }
  const __forwardArgs117 = __args113.slice();
  return __rubySend(globalThis, "f", (__kwargs115 === undefined ? __forwardArgs117.slice() : __forwardArgs117.concat(__kwargs115)), __block);
}
if (typeof globalThis !== "undefined") { globalThis.g = g; }
console.log(g(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self122 = this;
  const __block123 = function(...__args124) {
    return (function() {
}).apply(__self122, __args124);
  };
  __block123.__rubyBind = (value) => {
    const __prev125 = __self122;
    __self122 = value;
    return () => {
      __self122 = __prev125;
    };
  };
  return __block123;
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
    (() => { const __multi126 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi126, 2); return __multi126; })();
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
    const __blockCandidate127 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate127 === 'function' ? __blockCandidate127 : undefined;
    if (typeof __blockCandidate127 === 'function') args.pop();
    if ((() => { const __multi128 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi128, 2); return __multi128; })()) {
      value = __rubyFetch(args, 0);
      return this.where((() => {
  let __self129 = this;
  const __block130 = function(...__args131) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self129, __args131);
  };
  __block130.__rubyBind = (value) => {
    const __prev132 = __self129;
    __self129 = value;
    return () => {
      __self129 = __prev132;
    };
  };
  return __block130;
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
  let __self145 = this;
  const __block146 = function(...__args147) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self145, __args147);
  };
  __block146.__rubyBind = (value) => {
    const __prev148 = __self145;
    __self145 = value;
    return () => {
      __self145 = __prev148;
    };
  };
  return __block146;
})()), "to_a", [], undefined);
result.forEach((row) => {
  const __case170 = row;
  const __pattern171 = (() => {
    const __value = __case170;
    if (__value == null) return null;
    const __bindings172 = {};
    if (typeof __value !== 'object') return null;
    let __found174 = false;
    let __prop173;
    if (!__found174 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found174 = true;
      __prop173 = __value["name"];
    }
    if (!__found174 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("name"))) {
      __found174 = true;
      __prop173 = __value[Symbol.for("name")];
    }
    if (!__found174) return null;
    const name = __prop173;
    __bindings172.name = name;
    let __found176 = false;
    let __prop175;
    if (!__found176 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found176 = true;
      __prop175 = __value["age"];
    }
    if (!__found176 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("age"))) {
      __found176 = true;
      __prop175 = __value[Symbol.for("age")];
    }
    if (!__found176) return null;
    const age = __prop175;
    __bindings172.age = age;
    let __found178 = false;
    let __prop177;
    if (!__found178 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found178 = true;
      __prop177 = __value["role"];
    }
    if (!__found178 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("role"))) {
      __found178 = true;
      __prop177 = __value[Symbol.for("role")];
    }
    if (!__found178) return null;
    const role = __prop177;
    __bindings172.role = role;
    return __bindings172;
  })();
  const __pattern179 = (() => {
    const __value = __case170;
    if (__value == null) return null;
    const __bindings180 = {};
    if (typeof __value !== 'object') return null;
    let __found182 = false;
    let __prop181;
    if (!__found182 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found182 = true;
      __prop181 = __value["name"];
    }
    if (!__found182) return null;
    const name = __prop181;
    __bindings180.name = name;
    let __found184 = false;
    let __prop183;
    if (!__found184 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found184 = true;
      __prop183 = __value["age"];
    }
    if (!__found184) return null;
    const age = __prop183;
    __bindings180.age = age;
    let __found186 = false;
    let __prop185;
    if (!__found186 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found186 = true;
      __prop185 = __value["role"];
    }
    if (!__found186) return null;
    const role = __prop185;
    __bindings180.role = role;
    return __bindings180;
  })();
  if (__pattern171) {
    const name = __pattern171.name;
    const age = __pattern171.age;
    const role = __pattern171.role;
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if (__pattern179) {
    const name = __pattern179.name;
    const age = __pattern179.age;
    const role = __pattern179.role;
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
  let __self223 = this;
  const __block224 = function(...__args225) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self219 = this;
  const __block220 = function(...__args221) {
    return (function(_1) {
    return _1.length > 3;
  }).apply(__self219, __args221);
  };
  __block220.__rubyBind = (value) => {
    const __prev222 = __self219;
    __self219 = value;
    return () => {
      __self219 = __prev222;
    };
  };
  return __block220;
})()), "join", [" "], undefined);
}).apply(__self223, __args225);
  };
  __block224.__rubyBind = (value) => {
    const __prev226 = __self223;
    __self223 = value;
    return () => {
      __self223 = __prev226;
    };
  };
  return __block224;
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1247 = this;
  const __block1248 = function(...__args1249) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1247, __args1249);
  };
  __block1248.__rubyBind = (value) => {
    const __prev1250 = __self1247;
    __self1247 = value;
    return () => {
      __self1247 = __prev1250;
    };
  };
  return __block1248;
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
  let __self1259 = this;
  const __block1260 = function(...__args1261) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self1259, __args1261);
  };
  __block1260.__rubyBind = (value) => {
    const __prev1262 = __self1259;
    __self1259 = value;
    return () => {
      __self1259 = __prev1262;
    };
  };
  return __block1260;
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
    return __rubySend(this, "messages", [], undefined)[message_id] = block;
  }
  static server_receiver(params) {
    let callback_found;
    callback_found = __rubySend(this, "messages", [], undefined)[params["message_id"]];
    if (typeof callback_found === 'function') {
      return callback_found(params);
    }
  }
}
__rubySend(Universe, "on", ["hello"], (() => {
  let __self1283 = this;
  const __block1284 = function(...__args1285) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
}).apply(__self1283, __args1285);
  };
  __block1284.__rubyBind = (value) => {
    const __prev1286 = __self1283;
    __self1283 = value;
    return () => {
      __self1283 = __prev1286;
    };
  };
  return __block1284;
})());
__rubySend(Universe, "server_receiver", [{ message_id: "hello", content: "Salut depuis Universe 👽" }], undefined);
function avec_trois(val, val2, val3, __block) {
  if (typeof __block === 'function') {
    return __block ? __block(val, val2, val3) : undefined;
  }
}
if (typeof globalThis !== "undefined") { globalThis.avec_trois = avec_trois; }
avec_trois(1, 2, 3, (() => {
  let __self1287 = this;
  const __block1288 = function(...__args1289) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
}).apply(__self1287, __args1289);
  };
  __block1288.__rubyBind = (value) => {
    const __prev1290 = __self1287;
    __self1287 = value;
    return () => {
      __self1287 = __prev1290;
    };
  };
  return __block1288;
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
      console.log(`Hello ${this.__name}!`);
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