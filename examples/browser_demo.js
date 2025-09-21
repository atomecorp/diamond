let fs;
let obj;
let worker;

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
  let __self1 = this;
  const __block2 = function(...__args3) {
    return (function() {
  console.log(`val  = ${__rubyImplicitCall(this, "val")}`);
  console.log(`val2 = ${__rubyImplicitCall(this, "val2")}`);
  return console.log(`val3 = ${__rubyImplicitCall(this, "val3")}`);
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
  let __self5 = this;
  const __block6 = function(...__args7) {
    return (function(params) {
  return console.log(`Message reçu: ${params["content"]}`);
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
  let __self9 = this;
  const __block10 = function(...__args11) {
    return (function(h) {
  return __rubySend(this, "log", [h], undefined);
}).apply(__self9, __args11);
  };
  __block10.__rubyBind = (value) => {
    const __prev12 = __self9;
    __self9 = value;
    return () => {
      __self9 = __prev12;
    };
  };
  return __block10;
})()], undefined);