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
  let __self1 = this;
  const __block2 = function(...__args3) {
    return (function(task, i) {
      return console.log(`${i + 1}. ${task}`);
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
  let __self5 = this;
  const __block6 = function(...__args7) {
    return (function(a, b) {
  return console.log(`a = ${a}, b = ${b}`);
}).apply(__self5, __args7);
  };
  __block6.__rubyBind = (value) => {
    const __prev8 = __self5;
    __self5 = value;
    return () => {
      __self5 = __prev8;
    };
  };
  return __block6;
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
  let __self17 = this;
  const __block18 = function(...__args19) {
    return (function(name) {
      this.prototype[name] = function() {
        return this[__rubyIvarName(`@${name}`)];
      };
      return this.prototype[`${name}=`] = function(value) {
        return this[__rubyIvarName(`@${name}`)] = value;
      };
    }).apply(__self17, __args19);
  };
  __block18.__rubyBind = (value) => {
    const __prev20 = __self17;
    __self17 = value;
    return () => {
      __self17 = __prev20;
    };
  };
  return __block18;
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
  let __self29 = this;
  const __block30 = function(...__args31) {
    return (function(new_email) {
    return console.log(`📩 Email mis à jour: ${new_email}`);
  }).apply(__self29, __args31);
  };
  __block30.__rubyBind = (value) => {
    const __prev32 = __self29;
    __self29 = value;
    return () => {
      __self29 = __prev32;
    };
  };
  return __block30;
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
  let __self69 = this;
  const __block70 = function(...__args71) {
    return (function(str) {
  return __rubySend(__rubySplit(str).filter((() => {
  let __self65 = this;
  const __block66 = function(...__args67) {
    return (function(_1) {
    return _1.length > 3;
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
})()), "join", [" "], undefined);
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
})();
reverse_text = (str) => {
  return __rubyReverse(str);
};
text = "bonjour à tous les amis du ruby";
processed = __rubySend(__rubySend(__rubySend(__rubySend(__rubySend(new TextProcessor(text), "transform", [], (() => {
  let __self1093 = this;
  const __block1094 = function(...__args1095) {
    return (function(_1) {
  return __rubyStrip(_1);
}).apply(__self1093, __args1095);
  };
  __block1094.__rubyBind = (value) => {
    const __prev1096 = __self1093;
    __self1093 = value;
    return () => {
      __self1093 = __prev1096;
    };
  };
  return __block1094;
})()), "apply", [to_capitalize], undefined), "apply", [remove_short], undefined), "apply", [reverse_text], undefined), "result", [], undefined);
console.log(processed);
const Forwardable = {};
const StringPredicates = {};
String.prototype["split_predicate"] = function() {
  let attr;
  let op;
  let op_map;
  (() => { const __multi1097 = __rubyMatch(this, new RegExp("^(\\w+)_(gt|lt|eq)$", ""))?.captures(); [attr, op] = __rubyMultiAssign(__multi1097, 2); return __multi1097; })();
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
    const __blockCandidate1098 = args.length ? args[args.length - 1] : undefined;
    const __block = typeof __blockCandidate1098 === 'function' ? __blockCandidate1098 : undefined;
    if (typeof __blockCandidate1098 === 'function') args.pop();
    if ((() => { const __multi1099 = __rubySend(String(name), "split_predicate", [], undefined); [attr, op] = __rubyMultiAssign(__multi1099, 2); return __multi1099; })()) {
      value = __rubyFetch(args, 0);
      return __rubySend(this, "where", [], (() => {
  let __self1100 = this;
  const __block1101 = function(...__args1102) {
    return (function(row) {
        return __rubyPublicSend(row[attr] || row[String(attr)], op, value);
      }).apply(__self1100, __args1102);
  };
  __block1101.__rubyBind = (value) => {
    const __prev1103 = __self1100;
    __self1100 = value;
    return () => {
      __self1100 = __prev1103;
    };
  };
  return __block1101;
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
  let __self1116 = this;
  const __block1117 = function(...__args1118) {
    return (function(_1) {
  return (_1["role"] || _1["role"]) === "dev";
}).apply(__self1116, __args1118);
  };
  __block1117.__rubyBind = (value) => {
    const __prev1119 = __self1116;
    __self1116 = value;
    return () => {
      __self1116 = __prev1119;
    };
  };
  return __block1117;
})()), "to_a", [], undefined);
result.forEach((() => {
  let __self1123 = this;
  const __block1124 = function(...__args1125) {
    return (function(row) {
  const __case1120 = row;
  let __pattern1121;
  let __pattern1122;
  if ((__pattern1121 = __rubyMatchHashPattern(__case1120, [{ binding: "name", keys: ["name"] }, { binding: "age", keys: ["age"] }, { binding: "role", keys: ["role"] }]))) {
    const name = __pattern1121["name"];
    const age = __pattern1121["age"];
    const role = __pattern1121["role"];
    return console.log(`${name} (${age}) — ${role}`);
  }
  else if ((__pattern1122 = __rubyMatchHashPattern(__case1120, [{ binding: "name", keys: ["name"] }, { binding: "age", keys: ["age"] }, { binding: "role", keys: ["role"] }]))) {
    const name = __pattern1122["name"];
    const age = __pattern1122["age"];
    const role = __pattern1122["role"];
    return console.log(`${name} (${age}) — ${role}`);
  }
}).apply(__self1123, __args1125);
  };
  __block1124.__rubyBind = (value) => {
    const __prev1126 = __self1123;
    __self1123 = value;
    return () => {
      __self1123 = __prev1126;
    };
  };
  return __block1124;
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
  let __self1127 = this;
  const __block1128 = function(...__args1129) {
    return (function() {
  console.log(`val  = ${__rubyImplicitCall(this, "val")}`);
  console.log(`val2 = ${__rubyImplicitCall(this, "val2")}`);
  return console.log(`val3 = ${__rubyImplicitCall(this, "val3")}`);
}).apply(__self1127, __args1129);
  };
  __block1128.__rubyBind = (value) => {
    const __prev1130 = __self1127;
    __self1127 = value;
    return () => {
      __self1127 = __prev1130;
    };
  };
  return __block1128;
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
  let __self1131 = this;
  const __block1132 = function(...__args1133) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
}).apply(__self1131, __args1133);
  };
  __block1132.__rubyBind = (value) => {
    const __prev1134 = __self1131;
    __self1131 = value;
    return () => {
      __self1131 = __prev1134;
    };
  };
  return __block1132;
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
  let __self1135 = this;
  const __block1136 = function(...__args1137) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self1135, __args1137);
  };
  __block1136.__rubyBind = (value) => {
    const __prev1138 = __self1135;
    __self1135 = value;
    return () => {
      __self1135 = __prev1138;
    };
  };
  return __block1136;
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