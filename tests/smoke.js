#!/usr/bin/env node
const assert = require('assert');
const { transpile } = require('../src/transpiler');

function normalize(str) {
  return str.trim().replace(/\r\n/g, '\n');
}

function run(name, input, expected) {
  const { code } = transpile(input);
  const normalized = normalize(code);
  const expectedNormalized = normalize(expected);
  try {
    assert.strictEqual(normalized, expectedNormalized);
    console.log(`✔ ${name}`);
  } catch (error) {
    console.error(`✖ ${name}`);
    console.error('Expected:\n' + expectedNormalized);
    console.error('Received:\n' + normalized);
    process.exitCode = 1;
  }
}

run('local assignment hoists declaration', 'x = 42', `
let x;
x = 42;
`);

run('puts maps to console.log', 'puts "hi"', `
console.log("hi");
`);

run('class with initialize becomes constructor', `
class User
  def initialize(name)
    @name = name
  end
end
`, `
class User {
  constructor(name) {
    this.__name = name;
  }
}
`);

run('string interpolation becomes template literal', 'puts "Hello #{@name}!"', `
console.log(\`Hello \${this.__name}!\`);
`);

run('implicit return on method body', `
def greeting
  "salut"
end
`, [
  'function greeting() {',
  '  return "salut";',
  '}',
  'if (typeof globalThis !== "undefined") { globalThis.greeting = greeting; }'
].join('\n'));

run('case statement desugars to if/else chain', `
case x
when 1
  puts "one"
when 2, 3
  puts "multi"
else
  puts "other"
end
`, `
if (x === 1) {
  console.log("one");
}
else if (x === 2 || x === 3) {
  console.log("multi");
}
else {
  console.log("other");
}
`);

run('safe navigation operator maps to optional chain', 'user&.logout', [
  'const __rubySend = (receiver, methodName, args = [], block) => {',
  '  if (receiver == null) return undefined;',
  '  const fn = receiver[methodName];',
  '  if (typeof fn === "function") {',
  '    const callArgs = block === undefined ? args : [...args, block];',
  '    return fn.apply(receiver, callArgs);',
  '  }',
  '  if (typeof methodName === "string") {',
  '    if (methodName === "tap") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "then" || methodName === "yield_self") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "catch") {',
  '      const tag = args[0];',
  '      if (typeof block !== "function") return undefined;',
  '      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '      try {',
  '        return block.call(receiver);',
  '      } catch (error) {',
  '        if (error && error.__rubyThrowTag !== undefined) {',
  '          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {',
  '            return error.__rubyThrowValue;',
  '          }',
  '        }',
  '        throw error;',
  '      } finally {',
  '        if (typeof restore === "function") restore();',
  '      }',
  '    }',
  '    if (methodName === "throw") {',
  '      const tag = args[0];',
  '      const value = args.length > 1 ? args[1] : undefined;',
  '      const error = new Error("throw");',
  '      error.__rubyThrowTag = tag;',
  '      error.__rubyThrowValue = value;',
  '      throw error;',
  '    }',
  '  }',
  '  const missing = receiver.method_missing;',
  '  if (typeof missing === "function") {',
  '    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];',
  '    return missing.apply(receiver, missingArgs);',
  '  }',
  '  throw new Error(`NoMethodError: undefined method ${methodName}`);',
  '};',
  '',
  '__rubySend(globalThis, "user", [], undefined)?.logout();'
].join('\n'));

run('loop do becomes while true', `
loop do
  puts "tick"
  break
end
`, `
while (true) {
  console.log("tick");
  break;
}
`);

run('each_with_index block maps to forEach', `
items.each_with_index do |item, i|
  puts "#{i}: #{item}"
end
`, [
  'const __rubySend = (receiver, methodName, args = [], block) => {',
  '  if (receiver == null) return undefined;',
  '  const fn = receiver[methodName];',
  '  if (typeof fn === "function") {',
  '    const callArgs = block === undefined ? args : [...args, block];',
  '    return fn.apply(receiver, callArgs);',
  '  }',
  '  if (typeof methodName === "string") {',
  '    if (methodName === "tap") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "then" || methodName === "yield_self") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "catch") {',
  '      const tag = args[0];',
  '      if (typeof block !== "function") return undefined;',
  '      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '      try {',
  '        return block.call(receiver);',
  '      } catch (error) {',
  '        if (error && error.__rubyThrowTag !== undefined) {',
  '          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {',
  '            return error.__rubyThrowValue;',
  '          }',
  '        }',
  '        throw error;',
  '      } finally {',
  '        if (typeof restore === "function") restore();',
  '      }',
  '    }',
  '    if (methodName === "throw") {',
  '      const tag = args[0];',
  '      const value = args.length > 1 ? args[1] : undefined;',
  '      const error = new Error("throw");',
  '      error.__rubyThrowTag = tag;',
  '      error.__rubyThrowValue = value;',
  '      throw error;',
  '    }',
  '  }',
  '  const missing = receiver.method_missing;',
  '  if (typeof missing === "function") {',
  '    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];',
  '    return missing.apply(receiver, missingArgs);',
  '  }',
  '  throw new Error(`NoMethodError: undefined method ${methodName}`);',
  '};',
  '',
  '__rubySend(globalThis, "items", [], undefined).forEach((item, i) => {',
  '  return console.log(`${i}: ${item}`);',
  '});'
].join('\n'));

run('class helper reports Ruby type', 'puts({}.class)', `
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

console.log(__rubyClassName({  }));
`);

run('numeric iteration helpers generate loops', `5.times { |i| puts i }
1.upto(3) { |n| puts n }
5.downto(1) { |n| puts n }`, `
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

const __rubyUpto = (value, limit, block) => {
  const start = Number(value);
  const end = Number(limit);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return typeof block === "function" ? value : [];
  }
  const from = Math.floor(start);
  const to = Math.floor(end);
  if (typeof block !== "function") {
    const result = [];
    for (let current = from; current <= to; current += 1) {
      result.push(current);
    }
    return result;
  }
  for (let current = from; current <= to; current += 1) {
    block(current);
  }
  return value;
};

const __rubyDownto = (value, limit, block) => {
  const start = Number(value);
  const end = Number(limit);
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return typeof block === "function" ? value : [];
  }
  const from = Math.floor(start);
  const to = Math.floor(end);
  if (typeof block !== "function") {
    const result = [];
    for (let current = from; current >= to; current -= 1) {
      result.push(current);
    }
    return result;
  }
  for (let current = from; current >= to; current -= 1) {
    block(current);
  }
  return value;
};

__rubyTimes(5, (() => {
  let __self1 = this;
  const __block2 = function(...__args3) {
    return (function(i) {
  return console.log(i);
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
__rubyUpto(1, 3, (() => {
  let __self5 = this;
  const __block6 = function(...__args7) {
    return (function(n) {
  return console.log(n);
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
__rubyDownto(5, 1, (() => {
  let __self9 = this;
  const __block10 = function(...__args11) {
    return (function(n) {
  return console.log(n);
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
})());
`);

run('string helpers map to lightweight runtime', `"Hello".upcase
"Hello".downcase
"hi".ljust(5, ".")
"Hello".gsub("H", "J")
"hello".chars`, [
  "const __rubyUpcase = (value) => String(value ?? \"\").toUpperCase();",
  "",
  "const __rubyDowncase = (value) => String(value ?? \"\").toLowerCase();",
  "",
  "const __rubyLjust = (value, width, padding) => {",
  "  const str = String(value ?? \"\");",
  "  const target = Number(width);",
  "  if (!Number.isFinite(target) || target <= str.length) return str;",
  "  const pad = padding === undefined ? \" \" : String(padding);",
  "  if (!pad.length) return str;",
  "  let result = str;",
  "  while (result.length < target) {",
  "    const remaining = target - result.length;",
  "    result += pad.repeat(Math.ceil(remaining / pad.length)).slice(0, remaining);",
  "  }",
  "  return result;",
  "};",
  "",
  "const __rubyChars = (value) => Array.from(String(value ?? \"\"));",
  "",
  "const __rubyGsub = (value, pattern, replacement, block) => {",
  "  const source = String(value ?? \"\");",
  "  const buildRegex = (input) => {",
  "    if (input instanceof RegExp) {",
  "      const flags = input.flags.includes(\"g\") ? input.flags : input.flags + \"g\";",
  "      return new RegExp(input.source, flags);",
  "    }",
  "    const escaped = String(input ?? \"\").replace(/[.*+?^${}()|[\\]\\\\]/g, \"\\\\$&\");",
  "    return new RegExp(escaped, \"g\");",
  "  };",
  "  const regex = buildRegex(pattern);",
  "  if (typeof block === \"function\") {",
  "    return source.replace(regex, (...matchParts) => {",
  "      const captures = matchParts.slice(0, -2);",
  "      return block(...captures);",
  "    });",
  "  }",
  "  const replacementValue = replacement === undefined ? \"\" : String(replacement);",
  "  return source.replace(regex, replacementValue);",
  "};",
  "",
  "__rubyUpcase(\"Hello\");",
  "__rubyDowncase(\"Hello\");",
  "__rubyLjust(\"hi\", 5, \".\");",
  "__rubyGsub(\"Hello\", \"H\", \"J\");",
  "__rubyChars(\"hello\");"
].join('\n'));

run('array helpers preserve Ruby semantics', `[1,2,3].reject { |x| x.even? }\n[1,2,3].first(2)\n[1,2,3].last\n[1,2,3].push(4)\n[1,2,2,3].uniq\n[1,2,3].shuffle\n[1,2,3].sample`, [
  'const __rubyArrayPush = (target, ...values) => {',
  '  if (Array.isArray(target)) {',
  '    target.push(...values);',
  '    return target;',
  '  }',
  '  if (target && typeof target.push === "function") {',
  '    target.push(...values);',
  '    return target;',
  '  }',
  '  return target;',
  '};',
  '',
  'const __rubyReject = (collection, block) => {',
  '  if (!Array.isArray(collection)) return [];',
  '  if (typeof block !== "function") return collection.slice();',
  '  const result = [];',
  '  for (let index = 0; index < collection.length; index += 1) {',
  '    if (!block(collection[index], index)) {',
  '      result.push(collection[index]);',
  '    }',
  '  }',
  '  return result;',
  '};',
  '',
  'const __rubyShuffle = (collection) => {',
  '  if (!Array.isArray(collection)) return [];',
  '  const result = collection.slice();',
  '  for (let index = result.length - 1; index > 0; index -= 1) {',
  '    const swapIndex = Math.floor(Math.random() * (index + 1));',
  '    const temp = result[index];',
  '    result[index] = result[swapIndex];',
  '    result[swapIndex] = temp;',
  '  }',
  '  return result;',
  '};',
  '',
  'const __rubyUniq = (collection) => {',
  '  if (!Array.isArray(collection)) return [];',
  '  const seen = new Set();',
  '  const result = [];',
  '  for (let index = 0; index < collection.length; index += 1) {',
  '    const value = collection[index];',
  '    if (seen.has(value)) continue;',
  '    seen.add(value);',
  '    result.push(value);',
  '  }',
  '  return result;',
  '};',
  '',
  'const __rubySample = (collection, count) => {',
  '  if (!Array.isArray(collection) || collection.length === 0) {',
  '    return count === undefined ? undefined : [];',
  '  }',
  '  if (count === undefined) {',
  '    const index = Math.floor(Math.random() * collection.length);',
  '    return collection[index];',
  '  }',
  '  const total = Number(count);',
  '  if (!Number.isFinite(total) || total <= 0) return [];',
  '  const pool = collection.slice();',
  '  const result = [];',
  '  const max = Math.min(pool.length, Math.floor(total));',
  '  for (let index = 0; index < max; index += 1) {',
  '    const pick = Math.floor(Math.random() * pool.length);',
  '    const [value] = pool.splice(pick, 1);',
  '    result.push(value);',
  '  }',
  '  return result;',
  '};',
  '',
  'const __rubyFirst = (collection, count) => {',
  '  if (!Array.isArray(collection)) return count === undefined ? undefined : [];',
  '  if (count === undefined) return collection[0];',
  '  const total = Number(count);',
  '  if (!Number.isFinite(total) || total <= 0) return [];',
  '  return collection.slice(0, Math.floor(total));',
  '};',
  '',
  'const __rubyLast = (collection, count) => {',
  '  if (!Array.isArray(collection)) return count === undefined ? undefined : [];',
  '  if (count === undefined) return collection.length ? collection[collection.length - 1] : undefined;',
  '  const total = Number(count);',
  '  if (!Number.isFinite(total) || total <= 0) return [];',
  '  const size = Math.floor(total);',
  '  if (!collection.length) return [];',
  '  const start = Math.max(0, collection.length - size);',
  '  return collection.slice(start);',
  '};',
  '',
  'const __rubySend = (receiver, methodName, args = [], block) => {',
  '  if (receiver == null) return undefined;',
  '  const fn = receiver[methodName];',
  '  if (typeof fn === "function") {',
  '    const callArgs = block === undefined ? args : [...args, block];',
  '    return fn.apply(receiver, callArgs);',
  '  }',
  '  if (typeof methodName === "string") {',
  '    if (methodName === "tap") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "then" || methodName === "yield_self") {',
  '      if (typeof block === "function") {',
  '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
  '      }',
  '      return receiver;',
  '    }',
  '    if (methodName === "catch") {',
  '      const tag = args[0];',
  '      if (typeof block !== "function") return undefined;',
  '      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
  '      try {',
  '        return block.call(receiver);',
  '      } catch (error) {',
  '        if (error && error.__rubyThrowTag !== undefined) {',
  '          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {',
  '            return error.__rubyThrowValue;',
  '          }',
  '        }',
  '        throw error;',
  '      } finally {',
  '        if (typeof restore === "function") restore();',
  '      }',
  '    }',
  '    if (methodName === "throw") {',
  '      const tag = args[0];',
  '      const value = args.length > 1 ? args[1] : undefined;',
  '      const error = new Error("throw");',
  '      error.__rubyThrowTag = tag;',
  '      error.__rubyThrowValue = value;',
  '      throw error;',
  '    }',
  '  }',
  '  const missing = receiver.method_missing;',
  '  if (typeof missing === "function") {',
  '    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];',
  '    return missing.apply(receiver, missingArgs);',
  '  }',
  '  throw new Error(`NoMethodError: undefined method ${methodName}`);',
  '};',
  '',
  '__rubyReject([1, 2, 3], (() => {',
  '  let __self1 = this;',
  '  const __block2 = function(...__args3) {',
  '    return (function(x) {',
  '  return __rubySend(x, "even?", [], undefined);',
  '}).apply(__self1, __args3);',
  '  };',
  '  __block2.__rubyBind = (value) => {',
  '    const __prev4 = __self1;',
  '    __self1 = value;',
  '    return () => {',
  '      __self1 = __prev4;',
  '    };',
  '  };',
  '  return __block2;',
  '})());',
  '__rubyFirst([1, 2, 3], 2);',
  '__rubyLast([1, 2, 3]);',
  '__rubyArrayPush([1, 2, 3], 4);',
  '__rubyUniq([1, 2, 2, 3]);',
  '__rubyShuffle([1, 2, 3]);',
  '__rubySample([1, 2, 3]);'
].join('\n'))

run('ranges translate to helper-backed objects', '(1..3).each { |n| puts n }', `
const __rubyRange = (start, end, exclusive = false) => {
  const coerceNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "bigint") return Number(value);
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };
  const fromNumber = coerceNumber(start);
  const toNumber = coerceNumber(end);
  const numeric = fromNumber !== null && toNumber !== null;
  const ascending = !numeric ? true : fromNumber <= toNumber;
  const buildNumeric = (stepValue) => {
    const step = stepValue === undefined ? (ascending ? 1 : -1) : Number(stepValue);
    if (!Number.isFinite(step) || step === 0) return [];
    if (ascending && step < 0) return [];
    if (!ascending && step > 0) return [];
    const limit = (value) => {
      if (ascending) {
        return exclusive ? value < toNumber : value <= toNumber;
      }
      return exclusive ? value > toNumber : value >= toNumber;
    };
    const values = [];
    for (let current = fromNumber; limit(current); current += step) {
      values.push(current);
      if (current === toNumber) break;
    }
    return values;
  };
  const buildFallback = () => {
    const values = [start];
    if (!exclusive || start !== end) values.push(end);
    return values;
  };
  const buildValues = (stepValue) => numeric ? buildNumeric(stepValue) : buildFallback();
  const range = {
    to_a() {
      return buildValues();
    },
    each(block) {
      const values = buildValues();
      if (typeof block !== "function") return values;
      for (let index = 0; index < values.length; index += 1) {
        block(values[index]);
      }
      return range;
    },
    step(stepValue, block) {
      let stepAmount = stepValue;
      let fn = block;
      if (typeof block !== "function" && typeof stepValue === "function") {
        fn = stepValue;
        stepAmount = undefined;
      }
      const values = buildValues(stepAmount);
      if (typeof fn !== "function") return values;
      for (let index = 0; index < values.length; index += 1) {
        fn(values[index]);
      }
      return range;
    }
  };
  range[Symbol.iterator] = function* () {
    const values = buildValues();
    for (let index = 0; index < values.length; index += 1) {
      yield values[index];
    }
  };
  return range;
};

__rubyRange(1, 3, false).forEach((n) => {
  return console.log(n);
});
`);
