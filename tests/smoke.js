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
`, `
function greeting() {
  return "salut";
}
`);

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

run('safe navigation operator maps to optional chain', 'user&.logout', `
user?.logout();
`);

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
`, '\nitems.forEach((item, i) => {\n  return console.log(' + '`' + '${i}: ${item}' + '`' + ');\n});\n');

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
