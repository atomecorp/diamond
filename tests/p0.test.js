const assert = require('node:assert');
const vm = require('node:vm');
const { transpile, Tokenizer } = require('../src/transpiler');

function runTranspiled(source) {
  const { code } = transpile(source);
  const sandbox = { console };
  sandbox.globalThis = sandbox;
  const context = vm.createContext(sandbox);
  vm.runInContext(code, context);
  return { code, context };
}

(function testImplicitReturnInLoop() {
  const { context } = runTranspiled(`
def counter
  i = 0
  while i < 3
    i += 1
  end
  i
end
`);
  assert.strictEqual(vm.runInContext('counter()', context), 3);
})();

(function testStringAssign() {
  const { context } = runTranspiled(`
s = "hello"
result = (s["he"] = "ye")
after = s
`);
  assert.strictEqual(vm.runInContext('result', context), 'ye');
  assert.strictEqual(vm.runInContext('after', context), 'yello');
})();

(function testRegexTokenizer() {
  const tokenizer = new Tokenizer('value = /[a-z\\/]+\\s*\\]/i');
  const tokens = tokenizer.tokenize();
  const regexToken = tokens.find(token => token.type === 'REGEX');
  assert.ok(regexToken, 'Expected regex token');
  assert.strictEqual(regexToken.value.pattern, '[a-z\\/]+\\s*\\]');
  assert.strictEqual(regexToken.value.flags, 'i');
})();

console.log('P0 tests passed');
