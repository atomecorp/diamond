const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Emitter } = require('./emitter');

function normalizeMode(mode) {
  if (typeof mode !== 'string') return 'strict';
  const lowered = mode.toLowerCase();
  return lowered === 'fast' ? 'fast' : 'strict';
}

function transpile(source, options = {}) {
  const tokenizer = new Tokenizer(source);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const mode = normalizeMode(options.mode);
  const emitterOptions = { mode, ...(options.emitter || {}) };
  const emitter = new Emitter(emitterOptions);
  const code = emitter.emit(ast);
  return { ast, code };
}

const api = { transpile, Tokenizer, Parser, Emitter };

const browserGlobal = typeof window !== 'undefined'
  ? window
  : (typeof self !== 'undefined' ? self : null);

if (browserGlobal) {
  browserGlobal.Diamond = browserGlobal.Diamond || {};
  browserGlobal.Diamond.transpile = transpile;
}

module.exports = api;
