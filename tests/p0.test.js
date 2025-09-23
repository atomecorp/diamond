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

(function testNoImplicitReturnWhenLoopIsTail() {
  const { context } = runTranspiled(`
def only_loop
  i = 0
  while i < 2
    i += 1
  end
end
`);
  assert.strictEqual(vm.runInContext('only_loop()', context), undefined);
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

(function testRegexTokenizerVariants() {
  const cases = [
    {
      source: 'value = /abc/',
      expected: { pattern: 'abc', flags: '' }
    },
    {
      source: 'value = /[A-Z0-9_-]+/m',
      expected: { pattern: '[A-Z0-9_-]+', flags: 'm' }
    },
    {
      source: 'value = /translate(([-\\d.]+)px, ([-\\d.]+)px)/',
      expected: { pattern: 'translate(([-\\d.]+)px, ([-\\d.]+)px)', flags: '' }
    },
    {
      source: 'value = /path\\/to\\/file/i',
      expected: { pattern: 'path\\/to\\/file', flags: 'i' }
    },
    {
      source: 'value = /[a-z\\/]+\\s*\\]/im',
      expected: { pattern: '[a-z\\/]+\\s*\\]', flags: 'im' }
    }
  ];

  for (const { source, expected } of cases) {
    const tokenizer = new Tokenizer(source);
    const tokens = tokenizer.tokenize();
    const regexToken = tokens.find(token => token.type === 'REGEX');
    assert.ok(regexToken, `Expected regex token for source: ${source}`);
    assert.strictEqual(regexToken.value.pattern, expected.pattern, `Pattern mismatch for source: ${source}`);
    assert.strictEqual(regexToken.value.flags, expected.flags, `Flags mismatch for source: ${source}`);
  }
})();

console.log('P0 tests passed');
