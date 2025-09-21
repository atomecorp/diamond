class Tokenizer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
    this.tokens = [];
    this.keywords = new Set([
      'def', 'end', 'class', 'module', 'if', 'elsif', 'else', 'unless', 'while', 'until', 'loop', 'do', 'then',
      'case', 'when', 'in', 'true', 'false', 'nil', 'return', 'self', 'break', 'yield', 'using', 'super',
      'begin', 'rescue', 'ensure'
    ]);
    this.multiChar = [
      '===', '==', '!=', '<=', '>=', '=>', '...', '..', '::', '&&=', '&&', '||=', '||', '**', '+=', '-=', '*=', '/=', '%=',
      '<<', '>>', '<=>', '=~', '!~', '&.', '->'
    ];
    this.singleChar = new Set([
      '(', ')', '{', '}', '[', ']', ',', '.', ':', ';', '+', '-', '*', '/', '%', '<', '>', '=', '!', '?',
      '\\', '|', '&', '@', '^'
    ]);
  }

  tokenize() {
    while (!this.isEOF()) {
      const char = this.peek();

      if (this.isWhitespace(char)) {
        this.consumeWhitespace();
        continue;
      }

      if (char === '#') {
        this.consumeComment();
        continue;
      }

      const heredoc = this.tryConsumeHeredoc();
      if (heredoc) {
        this.tokens.push(heredoc);
        continue;
      }

      if (char === '%' && (this.peek(1) === 'w' || this.peek(1) === 'W')) {
        this.tokens.push(this.consumePercentStringArray());
        continue;
      }

      if (char === '\"' || char === '\'') {
        this.tokens.push(this.consumeString());
        continue;
      }

      if (char === '/' && this.isRegexStart()) {
        this.tokens.push(this.consumeRegex());
        continue;
      }

      if (this.isDigit(char)) {
        this.tokens.push(this.consumeNumber());
        continue;
      }

      if (this.isIdentifierStart(char) || (char === '@' && this.isIdentifierStart(this.peek(1)))) {
        this.tokens.push(this.consumeIdentifier());
        continue;
      }

      const multi = this.matchMultiChar();
      if (multi) {
        this.tokens.push(this.createToken('OPERATOR', multi.value));
        this.advance(multi.length);
        continue;
      }

      if (this.singleChar.has(char)) {
        this.tokens.push(this.createToken('OPERATOR', char));
        this.advance();
        continue;
      }

      if (char === '\n') {
        this.tokens.push(this.createToken('NEWLINE', '\n'));
        this.advance();
        this.line += 1;
        this.column = 1;
        continue;
      }

      throw new SyntaxError(`Unexpected character '${char}' at ${this.line}:${this.column}`);
    }

    this.tokens.push(this.createToken('EOF', null));
    return this.tokens;
  }

  isRegexStart() {
    const prev = this.tokens[this.tokens.length - 1];
    if (!prev) return true;
    if (prev.type === 'NEWLINE') return true;
    if (prev.type === 'OPERATOR') {
      const disallow = new Set([')', ']', '}', '?']);
      return !disallow.has(prev.value);
    }
    if (prev.type === 'KEYWORD') {
      return ['if', 'elsif', 'unless', 'when', 'in', 'while', 'until', 'return', 'do', 'then'].includes(prev.value);
    }
    return false;
  }

  consumeRegex() {
    const startLine = this.line;
    const startColumn = this.column;
    this.advance();
    let pattern = '';
    let escaped = false;

    while (!this.isEOF()) {
      const char = this.peek();
      if (!escaped) {
        if (char === '\\') {
          escaped = true;
          pattern += char;
          this.advance();
          continue;
        }
        if (char === '/') {
          break;
        }
        if (char === '\n') {
          throw new SyntaxError(`Unterminated regex literal at ${startLine}:${startColumn}`);
        }
        pattern += char;
        this.advance();
        continue;
      }
      pattern += char;
      escaped = false;
      this.advance();
    }

    if (this.peek() !== '/') {
      throw new SyntaxError(`Unterminated regex literal at ${startLine}:${startColumn}`);
    }

    this.advance();

    let flags = '';
    while (!this.isEOF()) {
      const char = this.peek();
      if (!/[a-z]/i.test(char)) break;
      flags += char;
      this.advance();
    }

    return this.createToken('REGEX', { pattern, flags }, startLine, startColumn);
  }

  isEOF() {
    return this.position >= this.input.length;
  }

  peek(ahead = 0) {
    return this.input[this.position + ahead];
  }

  advance(step = 1) {
    this.position += step;
    this.column += step;
  }

  isWhitespace(char) {
    return char === ' ' || char === '\t' || char === '\r';
  }

  consumeWhitespace() {
    while (!this.isEOF()) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
      } else if (char === '\n') {
        // newline handled separately to preserve statement boundaries
        break;
      } else {
        break;
      }
    }
  }

  consumeComment() {
    while (!this.isEOF() && this.peek() !== '\n') {
      this.advance();
    }
  }

  consumeString() {
    const quote = this.peek();
    let value = '';
    let escaped = false;
    const startLine = this.line;
    const startColumn = this.column;
    this.advance();

    while (!this.isEOF()) {
      const char = this.peek();
      if (escaped) {
        value += this.translateEscape(char);
        escaped = false;
        this.advance();
        continue;
      }

      if (char === '\\') {
        escaped = true;
        this.advance();
        continue;
      }

      if (char === quote) {
        this.advance();
        return this.createToken('STRING', value, startLine, startColumn);
      }

      if (char === '\n') {
        throw new SyntaxError(`Unterminated string literal at ${startLine}:${startColumn}`);
      }

      value += char;
      this.advance();
    }

    throw new SyntaxError(`Unterminated string literal at ${startLine}:${startColumn}`);
  }

  translateEscape(char) {
    const map = { n: '\n', t: '\t', r: '\r', '\\': '\\', '\"': '\"', "'": "'" };
    return map[char] ?? char;
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  consumeNumber() {
    let value = '';
    const startLine = this.line;
    const startColumn = this.column;
    while (!this.isEOF() && /[0-9_]/.test(this.peek())) {
      value += this.peek();
      this.advance();
    }
    if (!this.isEOF() && this.peek() === '.') {
      if (this.isDigit(this.peek(1))) {
        value += '.';
        this.advance();
        while (!this.isEOF() && /[0-9_]/.test(this.peek())) {
          value += this.peek();
          this.advance();
        }
      }
    }
    value = value.replace(/_/g, '');
    return this.createToken('NUMBER', value, startLine, startColumn);
  }

  isIdentifierStart(char) {
    return /[A-Za-z_]/.test(char);
  }

  isIdentifierPart(char) {
    return /[A-Za-z0-9_?!]/.test(char);
  }

  consumeIdentifier() {
    const startLine = this.line;
    const startColumn = this.column;
    let value = '';

    if (this.peek() === '@') {
      value += '@';
      this.advance();
      if (this.peek() === '@') {
        value += '@';
        this.advance();
      }
    }

    while (!this.isEOF() && this.isIdentifierPart(this.peek())) {
      value += this.peek();
      this.advance();
    }

    const type = this.keywords.has(value) ? 'KEYWORD' : 'IDENTIFIER';
    return this.createToken(type, value, startLine, startColumn);
  }

  matchMultiChar() {
    for (const op of this.multiChar) {
      if (this.input.startsWith(op, this.position)) {
        return { value: op, length: op.length };
      }
    }
    return null;
  }

  createToken(type, value, line = this.line, column = this.column) {
    return { type, value, line, column };
  }

  tryConsumeHeredoc() {
    if (this.peek() !== '<' || this.peek(1) !== '<') {
      return null;
    }

    const startPos = this.position;
    const startLine = this.line;
    const startColumn = this.column;

    this.advance(2); // consume <<

    let indicator = '';
    if (this.peek() === '~' || this.peek() === '-') {
      indicator = this.peek();
      this.advance();
    }

    const labelStart = this.position;
    while (!this.isEOF() && this.isIdentifierPart(this.peek())) {
      this.advance();
    }

    if (this.position === labelStart) {
      this.position = startPos;
      this.column = startColumn;
      return null;
    }

    const label = this.input.slice(labelStart, this.position);

    if (this.peek() === '\r') {
      this.advance();
    }

    if (this.peek() !== '\n') {
      this.position = startPos;
      this.column = startColumn;
      return null;
    }

    this.advance();
    this.line += 1;
    this.column = 1;

    const lines = [];
    let currentLine = '';
    while (!this.isEOF()) {
      const char = this.peek();
      if (char === '\n') {
        const trimmed = currentLine.trim();
        if (trimmed === label && trimmed.length === label.length) {
          this.advance();
          this.line += 1;
          this.column = 1;
          const value = this.buildHeredocValue(lines, indicator === '~');
          return this.createToken('STRING', value, startLine, startColumn);
        }
        lines.push(currentLine);
        currentLine = '';
        this.advance();
        this.line += 1;
        this.column = 1;
        continue;
      }

      currentLine += char;
      this.advance();
    }

    throw new SyntaxError(`Unterminated heredoc <<${indicator}${label}`);
  }

  buildHeredocValue(lines, dedent) {
    if (!lines.length) return '\n';
    let processed = lines;
    if (dedent) {
      let minIndent = null;
      for (const line of lines) {
        if (!line.trim()) continue;
        const match = line.match(/^\s*/);
        const indent = match ? match[0].length : 0;
        if (minIndent === null || indent < minIndent) {
          minIndent = indent;
        }
      }
      if (minIndent && minIndent > 0) {
        processed = lines.map(line => line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line);
      }
    }
    return processed.join('\n') + '\n';
  }

  consumePercentStringArray() {
    const startLine = this.line;
    const startColumn = this.column;
    const isInterpolated = this.peek(1) === 'W';
    this.advance(2); // consume %w or %W

    const opening = this.peek();
    const closing = this.matchingDelimiter(opening);
    if (!closing) {
      throw new SyntaxError(`Unsupported delimiter for %w literal at ${startLine}:${startColumn}`);
    }

    this.advance(); // consume opening delimiter

    let buffer = '';
    const values = [];
    let escaped = false;

    while (!this.isEOF()) {
      const char = this.peek();

      if (!escaped && char === closing) {
        this.advance();
        if (buffer.length) {
          values.push(buffer);
        }
        return this.createToken('PERCENT_STRING_ARRAY', { values, interpolated: isInterpolated }, startLine, startColumn);
      }

      if (!escaped && char === '\\') {
        escaped = true;
        this.advance();
        continue;
      }

      if (!escaped && /\s/.test(char)) {
        if (buffer.length) {
          values.push(buffer);
          buffer = '';
        }
        this.advance();
        if (char === '\n') {
          this.line += 1;
          this.column = 1;
        }
        continue;
      }

      buffer += char;
      escaped = false;
      this.advance();
      if (char === '\n') {
        this.line += 1;
        this.column = 1;
      }
    }

    throw new SyntaxError(`Unterminated %w literal starting at ${startLine}:${startColumn}`);
  }

  matchingDelimiter(opening) {
    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '<': '>'
    };
    return pairs[opening] || opening;
  }
}

module.exports = { Tokenizer };
