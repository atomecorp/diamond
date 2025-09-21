let say;

const __rubyUpcaseBang = (value) => String(value ?? "").toUpperCase();

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

say = "I love Ruby";
console.log(say);
say["love"] = "*love*";
console.log((() => { say = __rubyUpcaseBang(say); return say; })());
__rubySend(5, "times", [], (() => {
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