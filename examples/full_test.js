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
let factor;
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
let tag_value;
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

const JS = (() => {
  if (typeof globalThis !== "undefined" && globalThis.JS) return globalThis.JS;
  const bridge = {
    global() {
      if (typeof globalThis !== "undefined") return globalThis;
      if (typeof window !== "undefined") return window;
      if (typeof self !== "undefined") return self;
      return {};
    },
    eval(code) {
      const source = String(code ?? "");
      return (function(execCode) { return eval(execCode); })(source);
    },
    get(path) {
      const root = this.global();
      if (!path) return root;
      return String(path).split(".").reduce((value, key) => (value == null ? value : value[key]), root);
    },
    set(path, value) {
      const root = this.global();
      if (!path) return value;
      const parts = String(path).split(".");
      const last = parts.pop();
      const target = parts.length ? parts.reduce((obj, key) => (obj == null ? obj : obj[key]), root) : root;
      if (target != null && last) {
        target[last] = value;
      }
      return value;
    }
  };
  if (typeof globalThis !== "undefined") globalThis.JS = bridge;
  return bridge;
})();

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

const __rubyStringAssign = (source, key, value) => {
  const original = String(source ?? "");
  const replacement = value == null ? "" : String(value);
  if (typeof key === "number" || typeof key === "bigint") {
    const index = Number(key);
    if (!Number.isInteger(index)) return original;
    const length = original.length;
    const normalized = index < 0 ? length + index : index;
    if (normalized < 0 || normalized > length) return original;
    if (normalized === length) return original + replacement;
    return original.slice(0, normalized) + replacement + original.slice(normalized + 1);
  }
  if (key instanceof RegExp) {
    const flags = key.flags.replace(/g/g, "");
    const regex = new RegExp(key.source, flags);
    return original.replace(regex, replacement);
  }
  const needle = key == null ? "" : String(key);
  if (!needle.length) return original;
  const position = original.indexOf(needle);
  if (position === -1) return original;
  return original.slice(0, position) + replacement + original.slice(position + needle.length);
};

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

__rubySend(JS, "eval", ["console.log('Hello from Ruby via JS.eval!')"], undefined);
factor = 7;
__rubySend(JS, "eval", [`const squared = ${factor} * ${factor}; console.log('Squared via JS code:', squared)`], undefined);
tag_value = "ruby-bridge";
__rubySend(JS, "global", [], undefined)["document"]["body"]["setAttribute"]("data-from-ruby", tag_value);
container = __rubySend(document, "createElement", ["div"], undefined);
(() => {
  const __stringAssignTarget1 = container["style"];
  const __stringAssignKey2 = "width";
  const __stringAssignValue3 = "100%";
  __stringAssignTarget1[__stringAssignKey2] = __stringAssignValue3;
  return __stringAssignValue3;
})();
(() => {
  const __stringAssignTarget5 = container["style"];
  const __stringAssignKey6 = "height";
  const __stringAssignValue7 = "100vh";
  __stringAssignTarget5[__stringAssignKey6] = __stringAssignValue7;
  return __stringAssignValue7;
})();
(() => {
  const __stringAssignTarget9 = container["style"];
  const __stringAssignKey10 = "margin";
  const __stringAssignValue11 = "0";
  __stringAssignTarget9[__stringAssignKey10] = __stringAssignValue11;
  return __stringAssignValue11;
})();
(() => {
  const __stringAssignTarget13 = container["style"];
  const __stringAssignKey14 = "display";
  const __stringAssignValue15 = "flex";
  __stringAssignTarget13[__stringAssignKey14] = __stringAssignValue15;
  return __stringAssignValue15;
})();
(() => {
  const __stringAssignTarget17 = container["style"];
  const __stringAssignKey18 = "alignItems";
  const __stringAssignValue19 = "center";
  __stringAssignTarget17[__stringAssignKey18] = __stringAssignValue19;
  return __stringAssignValue19;
})();
(() => {
  const __stringAssignTarget21 = container["style"];
  const __stringAssignKey22 = "justifyContent";
  const __stringAssignValue23 = "center";
  __stringAssignTarget21[__stringAssignKey22] = __stringAssignValue23;
  return __stringAssignValue23;
})();
(() => {
  const __stringAssignTarget25 = container["style"];
  const __stringAssignKey26 = "background";
  const __stringAssignValue27 = "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)";
  __stringAssignTarget25[__stringAssignKey26] = __stringAssignValue27;
  return __stringAssignValue27;
})();
(() => {
  const __stringAssignTarget29 = container["style"];
  const __stringAssignKey30 = "position";
  const __stringAssignValue31 = "relative";
  __stringAssignTarget29[__stringAssignKey30] = __stringAssignValue31;
  return __stringAssignValue31;
})();
__rubySend(document["body"], "appendChild", [container], undefined);
box = __rubySend(document, "createElement", ["div"], undefined);
(() => {
  const __stringAssignTarget33 = box["style"];
  const __stringAssignKey34 = "width";
  const __stringAssignValue35 = "220px";
  __stringAssignTarget33[__stringAssignKey34] = __stringAssignValue35;
  return __stringAssignValue35;
})();
(() => {
  const __stringAssignTarget37 = box["style"];
  const __stringAssignKey38 = "height";
  const __stringAssignValue39 = "140px";
  __stringAssignTarget37[__stringAssignKey38] = __stringAssignValue39;
  return __stringAssignValue39;
})();
(() => {
  const __stringAssignTarget41 = box["style"];
  const __stringAssignKey42 = "borderRadius";
  const __stringAssignValue43 = "16px";
  __stringAssignTarget41[__stringAssignKey42] = __stringAssignValue43;
  return __stringAssignValue43;
})();
(() => {
  const __stringAssignTarget45 = box["style"];
  const __stringAssignKey46 = "boxShadow";
  const __stringAssignValue47 = "0 10px 25px rgba(0,0,0,.25)";
  __stringAssignTarget45[__stringAssignKey46] = __stringAssignValue47;
  return __stringAssignValue47;
})();
(() => {
  const __stringAssignTarget49 = box["style"];
  const __stringAssignKey50 = "background";
  const __stringAssignValue51 = "linear-gradient(135deg, #6EE7F9 0%, #9333EA 100%)";
  __stringAssignTarget49[__stringAssignKey50] = __stringAssignValue51;
  return __stringAssignValue51;
})();
(() => {
  const __stringAssignTarget53 = box["style"];
  const __stringAssignKey54 = "position";
  const __stringAssignValue55 = "relative";
  __stringAssignTarget53[__stringAssignKey54] = __stringAssignValue55;
  return __stringAssignValue55;
})();
(() => {
  const __stringAssignTarget57 = box["style"];
  const __stringAssignKey58 = "cursor";
  const __stringAssignValue59 = "grab";
  __stringAssignTarget57[__stringAssignKey58] = __stringAssignValue59;
  return __stringAssignValue59;
})();
(() => {
  const __stringAssignTarget61 = box["style"];
  const __stringAssignKey62 = "userSelect";
  const __stringAssignValue63 = "none";
  __stringAssignTarget61[__stringAssignKey62] = __stringAssignValue63;
  return __stringAssignValue63;
})();
(() => {
  const __stringAssignTarget65 = box["style"];
  const __stringAssignKey66 = "touchAction";
  const __stringAssignValue67 = "none";
  __stringAssignTarget65[__stringAssignKey66] = __stringAssignValue67;
  return __stringAssignValue67;
})();
(() => {
  const __stringAssignTarget69 = box["style"];
  const __stringAssignKey70 = "willChange";
  const __stringAssignValue71 = "transform";
  __stringAssignTarget69[__stringAssignKey70] = __stringAssignValue71;
  return __stringAssignValue71;
})();
(() => {
  const __stringAssignTarget73 = box["style"];
  const __stringAssignKey74 = "transform";
  const __stringAssignValue75 = "translate3d(0px, 0px, 0)";
  __stringAssignTarget73[__stringAssignKey74] = __stringAssignValue75;
  return __stringAssignValue75;
})();
(() => {
  const __stringAssignTarget77 = box["style"];
  const __stringAssignKey78 = "transition";
  const __stringAssignValue79 = "transform .2s ease, width .2s ease, height .2s ease, box-shadow .2s ease";
  __stringAssignTarget77[__stringAssignKey78] = __stringAssignValue79;
  return __stringAssignValue79;
})();
default_transition = box["style"]["transition"];
__rubySend(container, "appendChild", [box], undefined);
label = __rubySend(document, "createElement", ["div"], undefined);
(() => {
  const __stringAssignTarget81 = label["style"];
  const __stringAssignKey82 = "color";
  const __stringAssignValue83 = "#fff";
  __stringAssignTarget81[__stringAssignKey82] = __stringAssignValue83;
  return __stringAssignValue83;
})();
(() => {
  const __stringAssignTarget85 = label["style"];
  const __stringAssignKey86 = "fontFamily";
  const __stringAssignValue87 = "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  __stringAssignTarget85[__stringAssignKey86] = __stringAssignValue87;
  return __stringAssignValue87;
})();
(() => {
  const __stringAssignTarget89 = label["style"];
  const __stringAssignKey90 = "fontSize";
  const __stringAssignValue91 = "14px";
  __stringAssignTarget89[__stringAssignKey90] = __stringAssignValue91;
  return __stringAssignValue91;
})();
(() => {
  const __stringAssignTarget93 = label["style"];
  const __stringAssignKey94 = "padding";
  const __stringAssignValue95 = "12px";
  __stringAssignTarget93[__stringAssignKey94] = __stringAssignValue95;
  return __stringAssignValue95;
})();
(() => {
  const __stringAssignTarget97 = label;
  const __stringAssignKey98 = "innerText";
  const __stringAssignValue99 = "Click / Tap / Drag me";
  if (typeof __stringAssignTarget97 === 'string' || __stringAssignTarget97 instanceof String) {
    const __stringAssignResult100 = __rubyStringAssign(__stringAssignTarget97, __stringAssignKey98, __stringAssignValue99);
    label = __stringAssignResult100;
    return __stringAssignValue99;
  }
  __stringAssignTarget97[__stringAssignKey98] = __stringAssignValue99;
  return __stringAssignValue99;
})();
__rubySend(box, "appendChild", [label], undefined);
handle = __rubySend(document, "createElement", ["div"], undefined);
(() => {
  const __stringAssignTarget101 = handle["style"];
  const __stringAssignKey102 = "position";
  const __stringAssignValue103 = "absolute";
  __stringAssignTarget101[__stringAssignKey102] = __stringAssignValue103;
  return __stringAssignValue103;
})();
(() => {
  const __stringAssignTarget105 = handle["style"];
  const __stringAssignKey106 = "right";
  const __stringAssignValue107 = "6px";
  __stringAssignTarget105[__stringAssignKey106] = __stringAssignValue107;
  return __stringAssignValue107;
})();
(() => {
  const __stringAssignTarget109 = handle["style"];
  const __stringAssignKey110 = "bottom";
  const __stringAssignValue111 = "6px";
  __stringAssignTarget109[__stringAssignKey110] = __stringAssignValue111;
  return __stringAssignValue111;
})();
(() => {
  const __stringAssignTarget113 = handle["style"];
  const __stringAssignKey114 = "width";
  const __stringAssignValue115 = "14px";
  __stringAssignTarget113[__stringAssignKey114] = __stringAssignValue115;
  return __stringAssignValue115;
})();
(() => {
  const __stringAssignTarget117 = handle["style"];
  const __stringAssignKey118 = "height";
  const __stringAssignValue119 = "14px";
  __stringAssignTarget117[__stringAssignKey118] = __stringAssignValue119;
  return __stringAssignValue119;
})();
(() => {
  const __stringAssignTarget121 = handle["style"];
  const __stringAssignKey122 = "borderRadius";
  const __stringAssignValue123 = "3px";
  __stringAssignTarget121[__stringAssignKey122] = __stringAssignValue123;
  return __stringAssignValue123;
})();
(() => {
  const __stringAssignTarget125 = handle["style"];
  const __stringAssignKey126 = "background";
  const __stringAssignValue127 = "rgba(255,255,255,.85)";
  __stringAssignTarget125[__stringAssignKey126] = __stringAssignValue127;
  return __stringAssignValue127;
})();
(() => {
  const __stringAssignTarget129 = handle["style"];
  const __stringAssignKey130 = "boxShadow";
  const __stringAssignValue131 = "0 1px 3px rgba(0,0,0,.3)";
  __stringAssignTarget129[__stringAssignKey130] = __stringAssignValue131;
  return __stringAssignValue131;
})();
(() => {
  const __stringAssignTarget133 = handle["style"];
  const __stringAssignKey134 = "cursor";
  const __stringAssignValue135 = "nwse-resize";
  __stringAssignTarget133[__stringAssignKey134] = __stringAssignValue135;
  return __stringAssignValue135;
})();
__rubySend(box, "appendChild", [handle], undefined);
__rubySend(box, "addEventListener", ["mouseenter", (e) => {
  return (() => {
  const __stringAssignTarget137 = box["style"];
  const __stringAssignKey138 = "boxShadow";
  const __stringAssignValue139 = "0 14px 32px rgba(0,0,0,.32)";
  __stringAssignTarget137[__stringAssignKey138] = __stringAssignValue139;
  return __stringAssignValue139;
})();
}], undefined);
__rubySend(box, "addEventListener", ["mouseleave", (e) => {
  return (() => {
  const __stringAssignTarget141 = box["style"];
  const __stringAssignKey142 = "boxShadow";
  const __stringAssignValue143 = "0 10px 25px rgba(0,0,0,.25)";
  __stringAssignTarget141[__stringAssignKey142] = __stringAssignValue143;
  return __stringAssignValue143;
})();
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
  let __result145;
  let __handled146 = false;
  try {
    __result145 = (() => {
    return window_obj = __rubySend(JS, "global", [], undefined)["window"];
  }).call(this);
  } catch (__error147) {
    if (!__handled146 && __rubyRescueMatch(__error147, ["NameError"])) {
      __result145 = (() => {
      return window_obj = null;
    }).call(this);
      __handled146 = true;
    }
    if (!__handled146) throw __error147;
  }
  return __result145;
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
  let __self152 = this;
  const __block153 = function(...__args154) {
    return (function(_timestamp) {
  pendingFrame = false;
  return (() => {
  const __stringAssignTarget148 = box["style"];
  const __stringAssignKey149 = "transform";
  const __stringAssignValue150 = `translate3d(${currentX}px, ${currentY}px, 0)`;
  __stringAssignTarget148[__stringAssignKey149] = __stringAssignValue150;
  return __stringAssignValue150;
})();
}).apply(__self152, __args154);
  };
  __block153.__rubyBind = (value) => {
    const __prev155 = __self152;
    __self152 = value;
    return () => {
      __self152 = __prev155;
    };
  };
  return __block153;
})();
schedule_transform = (() => {
  let __self156 = this;
  const __block157 = function(...__args158) {
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
}).apply(__self156, __args158);
  };
  __block157.__rubyBind = (value) => {
    const __prev159 = __self156;
    __self156 = value;
    return () => {
      __self156 = __prev159;
    };
  };
  return __block157;
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
  (() => {
  const __stringAssignTarget160 = box["style"];
  const __stringAssignKey161 = "cursor";
  const __stringAssignValue162 = "grabbing";
  __stringAssignTarget160[__stringAssignKey161] = __stringAssignValue162;
  return __stringAssignValue162;
})();
  (() => {
  const __stringAssignTarget164 = box["style"];
  const __stringAssignKey165 = "boxShadow";
  const __stringAssignValue166 = drag_shadow;
  __stringAssignTarget164[__stringAssignKey165] = __stringAssignValue166;
  return __stringAssignValue166;
})();
  (() => {
  const __stringAssignTarget168 = box["style"];
  const __stringAssignKey169 = "transition";
  const __stringAssignValue170 = "transform 0s, width .2s ease, height .2s ease, box-shadow .2s ease";
  __stringAssignTarget168[__stringAssignKey169] = __stringAssignValue170;
  return __stringAssignValue170;
})();
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
    (() => {
  const __stringAssignTarget172 = box["style"];
  const __stringAssignKey173 = "cursor";
  const __stringAssignValue174 = "grab";
  __stringAssignTarget172[__stringAssignKey173] = __stringAssignValue174;
  return __stringAssignValue174;
})();
    (() => {
  const __stringAssignTarget176 = box["style"];
  const __stringAssignKey177 = "boxShadow";
  const __stringAssignValue178 = base_shadow;
  __stringAssignTarget176[__stringAssignKey177] = __stringAssignValue178;
  return __stringAssignValue178;
})();
    (() => {
  const __stringAssignTarget180 = box["style"];
  const __stringAssignKey181 = "transition";
  const __stringAssignValue182 = default_transition;
  __stringAssignTarget180[__stringAssignKey181] = __stringAssignValue182;
  return __stringAssignValue182;
})();
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
  (() => {
  const __stringAssignTarget184 = box["style"];
  const __stringAssignKey185 = "transition";
  const __stringAssignValue186 = "none";
  __stringAssignTarget184[__stringAssignKey185] = __stringAssignValue186;
  return __stringAssignValue186;
})();
  (() => {
  const __stringAssignTarget188 = box["style"];
  const __stringAssignKey189 = "boxShadow";
  const __stringAssignValue190 = drag_shadow;
  __stringAssignTarget188[__stringAssignKey189] = __stringAssignValue190;
  return __stringAssignValue190;
})();
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
    (() => {
  const __stringAssignTarget192 = box["style"];
  const __stringAssignKey193 = "width";
  const __stringAssignValue194 = `${__rubyToInteger(newW)}px`;
  __stringAssignTarget192[__stringAssignKey193] = __stringAssignValue194;
  return __stringAssignValue194;
})();
    (() => {
  const __stringAssignTarget196 = box["style"];
  const __stringAssignKey197 = "height";
  const __stringAssignValue198 = `${__rubyToInteger(newH)}px`;
  __stringAssignTarget196[__stringAssignKey197] = __stringAssignValue198;
  return __stringAssignValue198;
})();
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
  (() => {
  const __stringAssignTarget200 = box["style"];
  const __stringAssignKey201 = "transition";
  const __stringAssignValue202 = resizePrevTransition || default_transition;
  __stringAssignTarget200[__stringAssignKey201] = __stringAssignValue202;
  return __stringAssignValue202;
})();
  (() => {
  const __stringAssignTarget204 = box["style"];
  const __stringAssignKey205 = "boxShadow";
  const __stringAssignValue206 = base_shadow;
  __stringAssignTarget204[__stringAssignKey205] = __stringAssignValue206;
  return __stringAssignValue206;
})();
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
(() => {
  const __stringAssignTarget208 = dropzone["style"];
  const __stringAssignKey209 = "position";
  const __stringAssignValue210 = "absolute";
  __stringAssignTarget208[__stringAssignKey209] = __stringAssignValue210;
  return __stringAssignValue210;
})();
(() => {
  const __stringAssignTarget212 = dropzone["style"];
  const __stringAssignKey213 = "top";
  const __stringAssignValue214 = "20px";
  __stringAssignTarget212[__stringAssignKey213] = __stringAssignValue214;
  return __stringAssignValue214;
})();
(() => {
  const __stringAssignTarget216 = dropzone["style"];
  const __stringAssignKey217 = "left";
  const __stringAssignValue218 = "20px";
  __stringAssignTarget216[__stringAssignKey217] = __stringAssignValue218;
  return __stringAssignValue218;
})();
(() => {
  const __stringAssignTarget220 = dropzone["style"];
  const __stringAssignKey221 = "width";
  const __stringAssignValue222 = "120px";
  __stringAssignTarget220[__stringAssignKey221] = __stringAssignValue222;
  return __stringAssignValue222;
})();
(() => {
  const __stringAssignTarget224 = dropzone["style"];
  const __stringAssignKey225 = "height";
  const __stringAssignValue226 = "80px";
  __stringAssignTarget224[__stringAssignKey225] = __stringAssignValue226;
  return __stringAssignValue226;
})();
(() => {
  const __stringAssignTarget228 = dropzone["style"];
  const __stringAssignKey229 = "border";
  const __stringAssignValue230 = "2px dashed rgba(255,255,255,.75)";
  __stringAssignTarget228[__stringAssignKey229] = __stringAssignValue230;
  return __stringAssignValue230;
})();
(() => {
  const __stringAssignTarget232 = dropzone["style"];
  const __stringAssignKey233 = "borderRadius";
  const __stringAssignValue234 = "8px";
  __stringAssignTarget232[__stringAssignKey233] = __stringAssignValue234;
  return __stringAssignValue234;
})();
(() => {
  const __stringAssignTarget236 = dropzone["style"];
  const __stringAssignKey237 = "color";
  const __stringAssignValue238 = "#fff";
  __stringAssignTarget236[__stringAssignKey237] = __stringAssignValue238;
  return __stringAssignValue238;
})();
(() => {
  const __stringAssignTarget240 = dropzone["style"];
  const __stringAssignKey241 = "display";
  const __stringAssignValue242 = "flex";
  __stringAssignTarget240[__stringAssignKey241] = __stringAssignValue242;
  return __stringAssignValue242;
})();
(() => {
  const __stringAssignTarget244 = dropzone["style"];
  const __stringAssignKey245 = "alignItems";
  const __stringAssignValue246 = "center";
  __stringAssignTarget244[__stringAssignKey245] = __stringAssignValue246;
  return __stringAssignValue246;
})();
(() => {
  const __stringAssignTarget248 = dropzone["style"];
  const __stringAssignKey249 = "justifyContent";
  const __stringAssignValue250 = "center";
  __stringAssignTarget248[__stringAssignKey249] = __stringAssignValue250;
  return __stringAssignValue250;
})();
(() => {
  const __stringAssignTarget252 = dropzone;
  const __stringAssignKey253 = "innerText";
  const __stringAssignValue254 = "Drop here";
  if (typeof __stringAssignTarget252 === 'string' || __stringAssignTarget252 instanceof String) {
    const __stringAssignResult255 = __rubyStringAssign(__stringAssignTarget252, __stringAssignKey253, __stringAssignValue254);
    dropzone = __stringAssignResult255;
    return __stringAssignValue254;
  }
  __stringAssignTarget252[__stringAssignKey253] = __stringAssignValue254;
  return __stringAssignValue254;
})();
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
(() => {
  const __stringAssignTarget256 = say;
  const __stringAssignKey257 = "love";
  const __stringAssignValue258 = "*love*";
  if (typeof __stringAssignTarget256 === 'string' || __stringAssignTarget256 instanceof String) {
    const __stringAssignResult259 = __rubyStringAssign(__stringAssignTarget256, __stringAssignKey257, __stringAssignValue258);
    say = __stringAssignResult259;
    return __stringAssignValue258;
  }
  __stringAssignTarget256[__stringAssignKey257] = __stringAssignValue258;
  return __stringAssignValue258;
})();
console.log((() => { say = __rubyUpcaseBang(say); return say; })());
__rubyTimes(5, (() => {
  let __self260 = this;
  const __block261 = function(...__args262) {
    return (function() {
  return console.log(say);
}).apply(__self260, __args262);
  };
  __block261.__rubyBind = (value) => {
    const __prev263 = __self260;
    __self260 = value;
    return () => {
      __self260 = __prev263;
    };
  };
  return __block261;
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
    return (() => {
  const __stringAssignTarget264 = this.__h;
  const __stringAssignKey265 = k;
  const __stringAssignValue266 = v;
  if (typeof __stringAssignTarget264 === 'string' || __stringAssignTarget264 instanceof String) {
    const __stringAssignResult267 = __rubyStringAssign(__stringAssignTarget264, __stringAssignKey265, __stringAssignValue266);
    this.__h = __stringAssignResult267;
    return __stringAssignValue266;
  }
  __stringAssignTarget264[__stringAssignKey265] = __stringAssignValue266;
  return __stringAssignValue266;
})();
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
    const __singleton268 = K;
    if (__singleton268 == null) { return; }
    __singleton268.cm = function() {
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
  let __result273;
  let __handled274 = false;
  try {
    __result273 = (() => {
    return __rubyRaise(__rubyEnsureError("ArgumentError"), "bad");
  }).call(this);
  } catch (__error275) {
    if (!__handled274 && __rubyRescueMatch(__error275, ["ArgumentError"])) {
      const e = __error275;
      __result273 = (() => {
      return __rubyClassName(e);
    }).call(this);
      __handled274 = true;
    }
    if (!__handled274) throw __error275;
  } finally {
    "always";
  }
  return __result273;
})();;
x = (() => {
  let __result276;
  let __handled277 = false;
  try {
    __result276 = (() => {
    return 1 / 0;
  }).call(this);
  } catch (__error278) {
    if (!__handled277 && true) {
      __result276 = (() => {
      return "err";
    }).call(this);
      __handled277 = true;
    }
    if (!__handled277) throw __error278;
  }
  return __result276;
})();;
t = new Thread((() => {
  let __self283 = this;
  const __block284 = function(...__args285) {
    return (function() {
  return (() => {
  const __stringAssignTarget279 = __rubySend(Thread, "current", [], undefined);
  const __stringAssignKey280 = "foo";
  const __stringAssignValue281 = 1;
  __stringAssignTarget279[__stringAssignKey280] = __stringAssignValue281;
  return __stringAssignValue281;
})();
}).apply(__self283, __args285);
  };
  __block284.__rubyBind = (value) => {
    const __prev286 = __self283;
    __self283 = value;
    return () => {
      __self283 = __prev286;
    };
  };
  return __block284;
})());
__f = new Fiber((() => {
  let __self287 = this;
  const __block288 = function(...__args289) {
    return (function() {
  __rubySend(Fiber, "yield", [], undefined)(1);
  return 2;
}).apply(__self287, __args289);
  };
  __block288.__rubyBind = (value) => {
    const __prev290 = __self287;
    __self287 = value;
    return () => {
      __self287 = __prev290;
    };
  };
  return __block288;
})());
e = new Enumerator((() => {
  let __self291 = this;
  const __block292 = function(...__args293) {
    return (function(y) {
  __rubyArrayPush(y, 1);
  return __rubyArrayPush(y, 2);
}).apply(__self291, __args293);
  };
  __block292.__rubyBind = (value) => {
    const __prev294 = __self291;
    __self291 = value;
    return () => {
      __self291 = __prev294;
    };
  };
  return __block292;
})());
__rubySend(File, "open", [__FILE__, "r"], (() => {
  let __self295 = this;
  const __block296 = function(...__args297) {
    return (function(f) {
  return __rubyGets();
}).apply(__self295, __args297);
  };
  __block296.__rubyBind = (value) => {
    const __prev298 = __self295;
    __self295 = value;
    return () => {
      __self295 = __prev298;
    };
  };
  return __block296;
})());
a = ["a", "b", "c"];
r = new RegExp("(\\d+)\\s+(?<name>\\w+)", "u");
h = "leading\n";
console.log(a[1], __rubyMatch(r, "123 abc")["name"], h);
const __case299 = [1, 2, 3];
const __pattern300 = (() => {
  const __value = __case299;
  if (__value == null) return null;
  const __bindings301 = {};
  if (!Array.isArray(__value)) return null;
  if (__value.length < 1) return null;
  const __elem302 = __value[0];
  const a = __elem302;
  __bindings301.a = a;
  const rest = __value.slice(1);
  __bindings301.rest = rest;
  if (!(a > 0)) return null;
  return __bindings301;
})();
if (__pattern300) {
  const a = __pattern300.a;
  const rest = __pattern300.rest;
  [a, rest];
}
x = 1;
const __case303 = { x: 1 };
const __pattern304 = (() => {
  const __value = __case303;
  if (__value == null) return null;
  const __bindings305 = {};
  if (typeof __value !== 'object') return null;
  let __found307 = false;
  let __prop306;
  if (!__found307 && Object.prototype.hasOwnProperty.call(__value, "x")) {
    __found307 = true;
    __prop306 = __value["x"];
  }
  if (!__found307 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("x"))) {
    __found307 = true;
    __prop306 = __value[Symbol.for("x")];
  }
  if (!__found307) return null;
  if (__prop306 !== x) return null;
  return __bindings305;
})();
if (__pattern304) {
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
  let __self324 = this;
  const __block325 = function(...__args326) {
    return (function(tp) {
}).apply(__self324, __args326);
  };
  __block325.__rubyBind = (value) => {
    const __prev327 = __self324;
    __self324 = value;
    return () => {
      __self324 = __prev327;
    };
  };
  return __block325;
})()), "enable", [], (() => {
  let __self312 = this;
  const __block313 = function(...__args314) {
    return (function() {
}).apply(__self312, __args314);
  };
  __block313.__rubyBind = (value) => {
    const __prev315 = __self312;
    __self312 = value;
    return () => {
      __self312 = __prev315;
    };
  };
  return __block313;
})());
function multi(__block) {
  __block ? __block(1) : undefined;
  return __block ? __block(2) : undefined;
}
if (typeof globalThis !== "undefined") { globalThis.multi = multi; }
__rubySend([1, 2], "map", [__rubySymbolProc("to_s")], undefined);
__rubySend(globalThis, "catch", ["k"], (() => {
  let __self328 = this;
  const __block329 = function(...__args330) {
    return (function() {
  return __rubySend(this, "throw", ["k", "val"], undefined);
}).apply(__self328, __args330);
  };
  __block329.__rubyBind = (value) => {
    const __prev331 = __self328;
    __self328 = value;
    return () => {
      __self328 = __prev331;
    };
  };
  return __block329;
})());
__rubySend(__rubySend(1, "tap", [], (() => {
  let __self348 = this;
  const __block349 = function(...__args350) {
    return (function(v) {
  return v + 1;
}).apply(__self348, __args350);
  };
  __block349.__rubyBind = (value) => {
    const __prev351 = __self348;
    __self348 = value;
    return () => {
      __self348 = __prev351;
    };
  };
  return __block349;
})()), "then", [], (() => {
  let __self336 = this;
  const __block337 = function(...__args338) {
    return (function(v) {
  return v * 2;
}).apply(__self336, __args338);
  };
  __block337.__rubyBind = (value) => {
    const __prev339 = __self336;
    __self336 = value;
    return () => {
      __self336 = __prev339;
    };
  };
  return __block337;
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
  let __self352 = this;
  const __block353 = function(...__args354) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self352, __args354);
  };
  __block353.__rubyBind = (value) => {
    const __prev355 = __self352;
    __self352 = value;
    return () => {
      __self352 = __prev355;
    };
  };
  return __block353;
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
  let __self356 = this;
  const __block357 = function(...__args358) {
    return (function() {
  console.log(`val  = ${__rubySend(this, "val", [], undefined)}`);
  console.log(`val2 = ${__rubySend(this, "val2", [], undefined)}`);
  return console.log(`val3 = ${__rubySend(this, "val3", [], undefined)}`);
}).apply(__self356, __args358);
  };
  __block357.__rubyBind = (value) => {
    const __prev359 = __self356;
    __self356 = value;
    return () => {
      __self356 = __prev359;
    };
  };
  return __block357;
})());
console.log("----- 14th check -----");
function f(...__args360) {
  const __blockCandidate361 = __args360.length ? __args360[__args360.length - 1] : undefined;
  const blk = typeof __blockCandidate361 === 'function' ? __blockCandidate361 : undefined;
  if (typeof __blockCandidate361 === 'function') __args360.pop();
  let __kwargs362 = {};
  if (__args360.length) {
    const __kwCandidate363 = __args360[__args360.length - 1];
    if (__kwCandidate363 && typeof __kwCandidate363 === 'object' && !Array.isArray(__kwCandidate363)) {
      __kwargs362 = __kwCandidate363;
      __args360.pop();
    } else if (true) {
      __kwargs362 = {};
    } else {
      __kwargs362 = undefined;
    }
  }
  if (__kwargs362 === undefined) __kwargs362 = {};
  const a = __args360.length ? __args360.shift() : undefined;
  let b = __args360.length ? __args360.shift() : undefined;
  if (b === undefined) b = 2;
  const rest = __args360.splice(0);
  const __kwUsed364 = new Set();
  if (__kwargs362 === undefined || !Object.prototype.hasOwnProperty.call(__kwargs362, "c")) {
    throw new Error("ArgumentError: missing keyword: c");
  }
  const c = __kwargs362["c"];
  __kwUsed364.add("c");
  let d = __kwargs362 && Object.prototype.hasOwnProperty.call(__kwargs362, "d") ? __kwargs362["d"] : 4;
  __kwUsed364.add("d");
  const kw = {};
  if (__kwargs362 && typeof __kwargs362 === 'object') {
    for (const __key in __kwargs362) {
      if (!Object.prototype.hasOwnProperty.call(__kwargs362, __key)) continue;
      if (__kwUsed364.has(__key)) continue;
      kw[__key] = __kwargs362[__key];
    }
  }
  return [a, b, rest, c, d, kw, __rubyClassName(blk)];
}
if (typeof globalThis !== "undefined") { globalThis.f = f; }
f(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self365 = this;
  const __block366 = function(...__args367) {
    return (function() {
}).apply(__self365, __args367);
  };
  __block366.__rubyBind = (value) => {
    const __prev368 = __self365;
    __self365 = value;
    return () => {
      __self365 = __prev368;
    };
  };
  return __block366;
})());
function g(...__args369) {
  const __blockCandidate370 = __args369.length ? __args369[__args369.length - 1] : undefined;
  const __block = typeof __blockCandidate370 === 'function' ? __blockCandidate370 : undefined;
  if (typeof __blockCandidate370 === 'function') __args369.pop();
  let __kwargs371 = undefined;
  if (__args369.length) {
    const __kwCandidate372 = __args369[__args369.length - 1];
    if (__kwCandidate372 && typeof __kwCandidate372 === 'object' && !Array.isArray(__kwCandidate372)) {
      __kwargs371 = __kwCandidate372;
      __args369.pop();
    } else if (false) {
    } else {
      __kwargs371 = undefined;
    }
  }
  const __forwardArgs373 = __args369.slice();
  return __rubySend(globalThis, "f", (__kwargs371 === undefined ? __forwardArgs373.slice() : __forwardArgs373.concat(__kwargs371)), __block);
}
if (typeof globalThis !== "undefined") { globalThis.g = g; }
console.log(g(1, 3, 4, 5, { c: 7, x: 9 }, (() => {
  let __self378 = this;
  const __block379 = function(...__args380) {
    return (function() {
}).apply(__self378, __args380);
  };
  __block379.__rubyBind = (value) => {
    const __prev381 = __self378;
    __self378 = value;
    return () => {
      __self378 = __prev381;
    };
  };
  return __block379;
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
    (() => { const __multi382 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi382, 2); return __multi382; })();
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
    const __blockCandidate383 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate383 === 'function' ? __blockCandidate383 : undefined;
    if (typeof __blockCandidate383 === 'function') args.pop();
    if ((() => { const __multi384 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi384, 2); return __multi384; })()) {
      value = __rubyFetch(args, 0);
      return this.where((() => {
  let __self385 = this;
  const __block386 = function(...__args387) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self385, __args387);
  };
  __block386.__rubyBind = (value) => {
    const __prev388 = __self385;
    __self385 = value;
    return () => {
      __self385 = __prev388;
    };
  };
  return __block386;
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
  let __self401 = this;
  const __block402 = function(...__args403) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self401, __args403);
  };
  __block402.__rubyBind = (value) => {
    const __prev404 = __self401;
    __self401 = value;
    return () => {
      __self401 = __prev404;
    };
  };
  return __block402;
})()), "to_a", [], undefined);
result.forEach((row) => {
  const __case426 = row;
  const __pattern427 = (() => {
    const __value = __case426;
    if (__value == null) return null;
    const __bindings428 = {};
    if (typeof __value !== 'object') return null;
    let __found430 = false;
    let __prop429;
    if (!__found430 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found430 = true;
      __prop429 = __value["name"];
    }
    if (!__found430 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("name"))) {
      __found430 = true;
      __prop429 = __value[Symbol.for("name")];
    }
    if (!__found430) return null;
    const name = __prop429;
    __bindings428.name = name;
    let __found432 = false;
    let __prop431;
    if (!__found432 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found432 = true;
      __prop431 = __value["age"];
    }
    if (!__found432 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("age"))) {
      __found432 = true;
      __prop431 = __value[Symbol.for("age")];
    }
    if (!__found432) return null;
    const age = __prop431;
    __bindings428.age = age;
    let __found434 = false;
    let __prop433;
    if (!__found434 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found434 = true;
      __prop433 = __value["role"];
    }
    if (!__found434 && Object.prototype.hasOwnProperty.call(__value, Symbol.for("role"))) {
      __found434 = true;
      __prop433 = __value[Symbol.for("role")];
    }
    if (!__found434) return null;
    const role = __prop433;
    __bindings428.role = role;
    return __bindings428;
  })();
  const __pattern435 = (() => {
    const __value = __case426;
    if (__value == null) return null;
    const __bindings436 = {};
    if (typeof __value !== 'object') return null;
    let __found438 = false;
    let __prop437;
    if (!__found438 && Object.prototype.hasOwnProperty.call(__value, "name")) {
      __found438 = true;
      __prop437 = __value["name"];
    }
    if (!__found438) return null;
    const name = __prop437;
    __bindings436.name = name;
    let __found440 = false;
    let __prop439;
    if (!__found440 && Object.prototype.hasOwnProperty.call(__value, "age")) {
      __found440 = true;
      __prop439 = __value["age"];
    }
    if (!__found440) return null;
    const age = __prop439;
    __bindings436.age = age;
    let __found442 = false;
    let __prop441;
    if (!__found442 && Object.prototype.hasOwnProperty.call(__value, "role")) {
      __found442 = true;
      __prop441 = __value["role"];
    }
    if (!__found442) return null;
    const role = __prop441;
    __bindings436.role = role;
    return __bindings436;
  })();
  if (__pattern427) {
    const name = __pattern427.name;
    const age = __pattern427.age;
    const role = __pattern427.role;
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if (__pattern435) {
    const name = __pattern435.name;
    const age = __pattern435.age;
    const role = __pattern435.role;
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
  let __self479 = this;
  const __block480 = function(...__args481) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self475 = this;
  const __block476 = function(...__args477) {
    return (function(_1) {
    return _1.length > 3;
  }).apply(__self475, __args477);
  };
  __block476.__rubyBind = (value) => {
    const __prev478 = __self475;
    __self475 = value;
    return () => {
      __self475 = __prev478;
    };
  };
  return __block476;
})()), "join", [" "], undefined);
}).apply(__self479, __args481);
  };
  __block480.__rubyBind = (value) => {
    const __prev482 = __self479;
    __self479 = value;
    return () => {
      __self479 = __prev482;
    };
  };
  return __block480;
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1503 = this;
  const __block1504 = function(...__args1505) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1503, __args1505);
  };
  __block1504.__rubyBind = (value) => {
    const __prev1506 = __self1503;
    __self1503 = value;
    return () => {
      __self1503 = __prev1506;
    };
  };
  return __block1504;
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
  let __self1515 = this;
  const __block1516 = function(...__args1517) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self1515, __args1517);
  };
  __block1516.__rubyBind = (value) => {
    const __prev1518 = __self1515;
    __self1515 = value;
    return () => {
      __self1515 = __prev1518;
    };
  };
  return __block1516;
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
    return (() => {
  const __stringAssignTarget1539 = __rubySend(this, "messages", [], undefined);
  const __stringAssignKey1540 = message_id;
  const __stringAssignValue1541 = block;
  __stringAssignTarget1539[__stringAssignKey1540] = __stringAssignValue1541;
  return __stringAssignValue1541;
})();
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
  let __self1543 = this;
  const __block1544 = function(...__args1545) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
}).apply(__self1543, __args1545);
  };
  __block1544.__rubyBind = (value) => {
    const __prev1546 = __self1543;
    __self1543 = value;
    return () => {
      __self1543 = __prev1546;
    };
  };
  return __block1544;
})());
__rubySend(Universe, "server_receiver", [{ message_id: "hello", content: "Salut depuis Universe 👽" }], undefined);
function avec_trois(val, val2, val3, __block) {
  if (typeof __block === 'function') {
    return __block ? __block(val, val2, val3) : undefined;
  }
}
if (typeof globalThis !== "undefined") { globalThis.avec_trois = avec_trois; }
avec_trois(1, 2, 3, (() => {
  let __self1547 = this;
  const __block1548 = function(...__args1549) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
}).apply(__self1547, __args1549);
  };
  __block1548.__rubyBind = (value) => {
    const __prev1550 = __self1547;
    __self1547 = value;
    return () => {
      __self1547 = __prev1550;
    };
  };
  return __block1548;
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
      i += 1;
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