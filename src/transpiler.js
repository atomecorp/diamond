const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');
const { Emitter } = require('./emitter');

function transpile(source, options = {}) {
  const tokenizer = new Tokenizer(source);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const emitter = new Emitter(options.emitter);
  const code = emitter.emit(ast);
  return { ast, code };
}

module.exports = { transpile, Tokenizer, Parser, Emitter };
