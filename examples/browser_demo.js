let a;
let b;
let c;
let choix;
let fs;
let invoice;
let list;
let obj;
let processed;
let q;
let remove_short;
let result;
let reverse_text;
let rows;
let text;
let to_capitalize;
let u;
let worker;

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
  const input = String(value ?? "");
  const regex = pattern instanceof RegExp ? pattern : new RegExp(String(pattern));
  const result = input.match(regex);
  if (!result) return null;
  return {
    captures: () => result.slice(1)
  };
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
  const missing = receiver.method_missing;
  if (typeof missing === "function") {
    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];
    return missing.apply(receiver, missingArgs);
  }
  throw new Error(`NoMethodError: undefined method ${methodName}`);
};

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

const __rubyImplicitCall = (receiver, name) => {
  let target = receiver;
  if (target == null && typeof globalThis !== "undefined") {
    target = globalThis;
  }
  if (target == null) return undefined;
  const member = target[name];
  if (typeof member === "function") {
    return member.call(target);
  }
  return member;
};

const __rubyMatchHashPattern = (value, descriptors) => {
  if (value == null || typeof value !== "object") return null;
  const bindings = {};
  for (const descriptor of descriptors) {
    const { binding, keys } = descriptor;
    let matched = false;
    for (const key of keys) {
      if (key in value) {
        bindings[binding] = value[key];
        matched = true;
        break;
      }
    }
    if (!matched) return null;
  }
  return bindings;
};

function f(...__args1) {
  const __blockCandidate2 = __args1.length ? __args1[__args1.length - 1] : undefined;
  const blk = typeof __blockCandidate2 === 'function' ? __blockCandidate2 : undefined;
  if (typeof __blockCandidate2 === 'function') __args1.pop();
  let __kwargs3 = {};
  if (__args1.length) {
    const __kwCandidate4 = __args1[__args1.length - 1];
    if (__kwCandidate4 && typeof __kwCandidate4 === 'object' && !Array.isArray(__kwCandidate4)) {
      __kwargs3 = __kwCandidate4;
      __args1.pop();
    } else if (true) {
      __kwargs3 = {};
    } else {
      __kwargs3 = undefined;
    }
  }
  if (__kwargs3 === undefined) __kwargs3 = {};
  const a = __args1.length ? __args1.shift() : undefined;
  let b = __args1.length ? __args1.shift() : undefined;
  if (b === undefined) b = 2;
  const rest = __args1.splice(0);
  const __kwUsed5 = new Set();
  if (__kwargs3 === undefined || !Object.prototype.hasOwnProperty.call(__kwargs3, "c")) {
    throw new Error("ArgumentError: missing keyword: c");
  }
  const c = __kwargs3["c"];
  __kwUsed5.add("c");
  let d = __kwargs3 && Object.prototype.hasOwnProperty.call(__kwargs3, "d") ? __kwargs3["d"] : 4;
  __kwUsed5.add("d");
  const kw = {};
  if (__kwargs3 && typeof __kwargs3 === 'object') {
    for (const __key in __kwargs3) {
      if (!Object.prototype.hasOwnProperty.call(__kwargs3, __key)) continue;
      if (__kwUsed5.has(__key)) continue;
      kw[__key] = __kwargs3[__key];
    }
  }
  return [a, b, rest, c, d, kw, __rubyClassName(blk)];
}
__rubySend(this, "f", [1, 3, 4, 5, { c: 7, x: 9 }], (() => {
  let __self6 = this;
  const __block7 = function(...__args8) {
    return (function() {
}).apply(__self6, __args8);
  };
  __block7.__rubyBind = (value) => {
    const __prev9 = __self6;
    __self6 = value;
    return () => {
      __self6 = __prev9;
    };
  };
  return __block7;
})());
function g(...__args10) {
  const __blockCandidate11 = __args10.length ? __args10[__args10.length - 1] : undefined;
  const __block = typeof __blockCandidate11 === 'function' ? __blockCandidate11 : undefined;
  if (typeof __blockCandidate11 === 'function') __args10.pop();
  let __kwargs12 = undefined;
  if (__args10.length) {
    const __kwCandidate13 = __args10[__args10.length - 1];
    if (__kwCandidate13 && typeof __kwCandidate13 === 'object' && !Array.isArray(__kwCandidate13)) {
      __kwargs12 = __kwCandidate13;
      __args10.pop();
    } else if (false) {
    } else {
      __kwargs12 = undefined;
    }
  }
  const __forwardArgs14 = __args10.slice();
  return __rubySend(this, "f", (__kwargs12 === undefined ? __forwardArgs14.slice() : __forwardArgs14.concat(__kwargs12)), __block);
}
console.log(__rubySend(this, "g", [1, 3, 4, 5, { c: 7, x: 9 }], (() => {
  let __self19 = this;
  const __block20 = function(...__args21) {
    return (function() {
}).apply(__self19, __args21);
  };
  __block20.__rubyBind = (value) => {
    const __prev22 = __self19;
    __self19 = value;
    return () => {
      __self19 = __prev22;
    };
  };
  return __block20;
})()));
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
    return this.__tasks.forEach((() => {
  let __self23 = this;
  const __block24 = function(...__args25) {
    return (function(task, i) {
      return console.log(`${i + 1}. ${task}`);
    }).apply(__self23, __args25);
  };
  __block24.__rubyBind = (value) => {
    const __prev26 = __self23;
    __self23 = value;
    return () => {
      __self23 = __prev26;
    };
  };
  return __block24;
})());
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
function avec_trois(val, val2, val3, __block) {
  if (typeof __block === 'function') {
    return __block ? __block(val, val2, val3) : undefined;
  }
}
__rubySend(this, "avec_trois", [1, 2, 3], (() => {
  let __self27 = this;
  const __block28 = function(...__args29) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
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
a = { toto: "titi", tata: "tutu" };
console.log(a["tata"]);
a = { "toto": "titi", "tata": "tutu" };
console.log(__rubyClassName(a));
b = 42;
c = 0.687654354654654;
console.log(b);
console.log(__rubyClassName(b));
console.log(c);
console.log(__rubyClassName(c));
c = eval("puts('hi there')");
console.log(__rubyClassName(c));
class MyDynamicClass {
  static my_attr_accessor(...names) {
    return names.forEach((() => {
  let __self39 = this;
  const __block40 = function(...__args41) {
    return (function(name) {
      this.prototype[name] = function() {
        return this[__rubyIvarName(`@${name}`)];
      };
      return this.prototype[`${name}=`] = function(value) {
        return this[__rubyIvarName(`@${name}`)] = value;
      };
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
  }
}
__rubySend(MyDynamicClass, "my_attr_accessor", ["name", "age"], undefined);
obj = new MyDynamicClass();
obj["name="]("Alice");
obj["age="](30);
console.log(__rubySend(obj, "name", [], undefined));
console.log(__rubySend(obj, "age", [], undefined));
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
__rubySend(User, "attr_with_callback", ["email"], (() => {
  let __self51 = this;
  const __block52 = function(...__args53) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self51, __args53);
  };
  __block52.__rubyBind = (value) => {
    const __prev54 = __self51;
    __self51 = value;
    return () => {
      __self51 = __prev54;
    };
  };
  return __block52;
})());
u = new User();
u["email="]("alice@example.com");
u["email="]("bob@example.com");
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
  let __self91 = this;
  const __block92 = function(...__args93) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self87 = this;
  const __block88 = function(...__args89) {
    return (function(_1) {
    return _1.length > 3;
  }).apply(__self87, __args89);
  };
  __block88.__rubyBind = (value) => {
    const __prev90 = __self87;
    __self87 = value;
    return () => {
      __self87 = __prev90;
    };
  };
  return __block88;
})()), "join", [" "], undefined);
}).apply(__self91, __args93);
  };
  __block92.__rubyBind = (value) => {
    const __prev94 = __self91;
    __self91 = value;
    return () => {
      __self91 = __prev94;
    };
  };
  return __block92;
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1115 = this;
  const __block1116 = function(...__args1117) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1115, __args1117);
  };
  __block1116.__rubyBind = (value) => {
    const __prev1118 = __self1115;
    __self1115 = value;
    return () => {
      __self1115 = __prev1118;
    };
  };
  return __block1116;
})()), "apply", [to_capitalize], undefined), "apply", [remove_short], undefined), "apply", [reverse_text], undefined), "result", [], undefined);
console.log(processed);
const Forwardable = {};
const StringPredicates = {};
String.prototype["split_predicate"] = function() {
  let attr;
  let op;
  let op_map;
  (() => { const __multi1119 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi1119, 2); return __multi1119; })();
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
    const __blockCandidate1120 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate1120 === 'function' ? __blockCandidate1120 : undefined;
    if (typeof __blockCandidate1120 === 'function') args.pop();
    if ((() => { const __multi1121 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi1121, 2); return __multi1121; })()) {
      value = __rubyFetch(args, 0);
      return __rubySend(this, "where", [], (() => {
  let __self1122 = this;
  const __block1123 = function(...__args1124) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self1122, __args1124);
  };
  __block1123.__rubyBind = (value) => {
    const __prev1125 = __self1122;
    __self1122 = value;
    return () => {
      __self1122 = __prev1125;
    };
  };
  return __block1123;
})());
    }
    return (() => {   const __superMethod = super.method_missing;   if (typeof __superMethod !== 'function') {     throw new Error("NoMethodError: undefined method " + String(arguments[0]) + " for " + String(this));   }   return __superMethod.apply(this, arguments); })();
  }
  ["respond_to_missing?"](name, _) {
    if (_ === undefined) _ = false;
    return !!__rubySend(String(name), "split_predicate", [], undefined) || (() => {   const __superMethod = super["respond_to_missing?"];   if (typeof __superMethod !== 'function') {     throw new Error("NoMethodError: super has no method respond_to_missing?");   }   return __superMethod.apply(this, arguments); })();
  }
}
// extend Forwardable
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
  let __self1138 = this;
  const __block1139 = function(...__args1140) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self1138, __args1140);
  };
  __block1139.__rubyBind = (value) => {
    const __prev1141 = __self1138;
    __self1138 = value;
    return () => {
      __self1138 = __prev1141;
    };
  };
  return __block1139;
})()), "to_a", [], undefined);
result.forEach((() => {
  let __self1145 = this;
  const __block1146 = function(...__args1147) {
    return (function(row) {
  const __case1142 = row;
  let __pattern1143;
  let __pattern1144;
  if ((__pattern1143 = __rubyMatchHashPattern(__case1142, [{ binding: "name", keys: ["name"] }, { binding: "age", keys: ["age"] }, { binding: "role", keys: ["role"] }]))) {
    const name = __pattern1143["name"];
    const age = __pattern1143["age"];
    const role = __pattern1143["role"];
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if ((__pattern1144 = __rubyMatchHashPattern(__case1142, [{ binding: "name", keys: ["name"] }, { binding: "age", keys: ["age"] }, { binding: "role", keys: ["role"] }]))) {
    const name = __pattern1144["name"];
    const age = __pattern1144["age"];
    const role = __pattern1144["role"];
    return console.log(`${name} (${age}) — ${role}`);
  }
}).apply(__self1145, __args1147);
  };
  __block1146.__rubyBind = (value) => {
    const __prev1148 = __self1145;
    __self1145 = value;
    return () => {
      __self1145 = __prev1148;
    };
  };
  return __block1146;
})());
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
  let __self1149 = this;
  const __block1150 = function(...__args1151) {
    return (function() {
  console.log(`val  = ${__rubyImplicitCall(this, "val")}`);
  console.log(`val2 = ${__rubyImplicitCall(this, "val2")}`);
  return console.log(`val3 = ${__rubyImplicitCall(this, "val3")}`);
}).apply(__self1149, __args1151);
  };
  __block1150.__rubyBind = (value) => {
    const __prev1152 = __self1149;
    __self1149 = value;
    return () => {
      __self1149 = __prev1152;
    };
  };
  return __block1150;
})());
class Universe {
  static messages() {
    return this.__messages ||= {  };
  }
  static on(message_id, block) {
    return __rubyImplicitCall(Universe, "messages")[message_id] = block;
  }
  static server_receiver(params) {
    let callback_found;
    callback_found = __rubyImplicitCall(Universe, "messages")[params["message_id"]];
    if (typeof callback_found === 'function') {
      return callback_found(params);
    }
  }
}
__rubySend(Universe, "on", ["hello"], (() => {
  let __self1153 = this;
  const __block1154 = function(...__args1155) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
}).apply(__self1153, __args1155);
  };
  __block1154.__rubyBind = (value) => {
    const __prev1156 = __self1153;
    __self1153 = value;
    return () => {
      __self1153 = __prev1156;
    };
  };
  return __block1154;
})());
__rubySend(Universe, "server_receiver", [{ message_id: "hello", content: "Salut depuis Universe 👽" }], undefined);
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
    return __rubyInstanceExec(__rubySend(this, "grab", [parent], undefined), [hash_content], bloc);
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
  let __self1157 = this;
  const __block1158 = function(...__args1159) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self1157, __args1159);
  };
  __block1158.__rubyBind = (value) => {
    const __prev1160 = __self1157;
    __self1157 = value;
    return () => {
      __self1157 = __prev1160;
    };
  };
  return __block1158;
})()], undefined);
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
function test_equal(val) {
  if (val === undefined) val = 42;
  return console.log(`val = ${val}`);
}
__rubySend(this, "test_equal", [], undefined);
function test_multi(...val) {
  return console.log(`val = ${val}`);
}
__rubySend(this, "test_multi", [1, 2, 3, 4, 5], undefined);
function str_interpolate(name) {
  return `Hello, ${name}!`;
}
console.log(__rubySend(this, "str_interpolate", ["Alice"], undefined));
function str_concat(str) {
  return __rubyToInteger(str) + 100;
}
console.log(__rubySend(this, "str_concat", ["12"], undefined));