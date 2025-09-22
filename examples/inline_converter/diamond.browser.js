var Diamond = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/tokenizer.js
  var require_tokenizer = __commonJS({
    "src/tokenizer.js"(exports, module) {
      var Tokenizer = class {
        constructor(input) {
          this.input = input;
          this.position = 0;
          this.line = 1;
          this.column = 1;
          this.tokens = [];
          this.keywords = /* @__PURE__ */ new Set([
            "def",
            "end",
            "class",
            "module",
            "if",
            "elsif",
            "else",
            "unless",
            "while",
            "until",
            "loop",
            "do",
            "then",
            "case",
            "when",
            "in",
            "true",
            "false",
            "nil",
            "return",
            "self",
            "break",
            "yield",
            "using",
            "super",
            "begin",
            "rescue",
            "ensure"
          ]);
          this.multiChar = [
            "===",
            "==",
            "!=",
            "<=",
            ">=",
            "=>",
            "...",
            "..",
            "::",
            "&&=",
            "&&",
            "||=",
            "||",
            "**",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "<<",
            ">>",
            "<=>",
            "=~",
            "!~",
            "&.",
            "->"
          ];
          this.singleChar = /* @__PURE__ */ new Set([
            "(",
            ")",
            "{",
            "}",
            "[",
            "]",
            ",",
            ".",
            ":",
            ";",
            "+",
            "-",
            "*",
            "/",
            "%",
            "<",
            ">",
            "=",
            "!",
            "?",
            "\\",
            "|",
            "&",
            "@",
            "^"
          ]);
        }
        tokenize() {
          while (!this.isEOF()) {
            const char = this.peek();
            if (this.isWhitespace(char)) {
              this.consumeWhitespace();
              continue;
            }
            if (char === "#") {
              this.consumeComment();
              continue;
            }
            const heredoc = this.tryConsumeHeredoc();
            if (heredoc) {
              this.tokens.push(heredoc);
              continue;
            }
            if (char === "%" && (this.peek(1) === "w" || this.peek(1) === "W")) {
              this.tokens.push(this.consumePercentStringArray());
              continue;
            }
            if (char === '"' || char === "'") {
              this.tokens.push(this.consumeString());
              continue;
            }
            if (char === "/" && this.isRegexStart()) {
              this.tokens.push(this.consumeRegex());
              continue;
            }
            if (this.isDigit(char)) {
              this.tokens.push(this.consumeNumber());
              continue;
            }
            if (this.isIdentifierStart(char) || char === "@" && this.isIdentifierStart(this.peek(1))) {
              this.tokens.push(this.consumeIdentifier());
              continue;
            }
            const multi = this.matchMultiChar();
            if (multi) {
              this.tokens.push(this.createToken("OPERATOR", multi.value));
              this.advance(multi.length);
              continue;
            }
            if (this.singleChar.has(char)) {
              this.tokens.push(this.createToken("OPERATOR", char));
              this.advance();
              continue;
            }
            if (char === "\n") {
              this.tokens.push(this.createToken("NEWLINE", "\n"));
              this.advance();
              this.line += 1;
              this.column = 1;
              continue;
            }
            throw new SyntaxError(`Unexpected character '${char}' at ${this.line}:${this.column}`);
          }
          this.tokens.push(this.createToken("EOF", null));
          return this.tokens;
        }
        isRegexStart() {
          const prev = this.tokens[this.tokens.length - 1];
          if (!prev) return true;
          if (prev.type === "NEWLINE") return true;
          if (prev.type === "OPERATOR") {
            const disallow = /* @__PURE__ */ new Set([")", "]", "}", "?"]);
            return !disallow.has(prev.value);
          }
          if (prev.type === "KEYWORD") {
            return ["if", "elsif", "unless", "when", "in", "while", "until", "return", "do", "then"].includes(prev.value);
          }
          return false;
        }
        consumeRegex() {
          const startLine = this.line;
          const startColumn = this.column;
          this.advance();
          let pattern = "";
          let escaped = false;
          while (!this.isEOF()) {
            const char = this.peek();
            if (!escaped) {
              if (char === "\\") {
                escaped = true;
                pattern += char;
                this.advance();
                continue;
              }
              if (char === "/") {
                break;
              }
              if (char === "\n") {
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
          if (this.peek() !== "/") {
            throw new SyntaxError(`Unterminated regex literal at ${startLine}:${startColumn}`);
          }
          this.advance();
          let flags = "";
          while (!this.isEOF()) {
            const char = this.peek();
            if (!/[a-z]/i.test(char)) break;
            flags += char;
            this.advance();
          }
          return this.createToken("REGEX", { pattern, flags }, startLine, startColumn);
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
          return char === " " || char === "	" || char === "\r";
        }
        consumeWhitespace() {
          while (!this.isEOF()) {
            const char = this.peek();
            if (char === " " || char === "	" || char === "\r") {
              this.advance();
            } else if (char === "\n") {
              break;
            } else {
              break;
            }
          }
        }
        consumeComment() {
          while (!this.isEOF() && this.peek() !== "\n") {
            this.advance();
          }
        }
        consumeString() {
          const quote = this.peek();
          let value = "";
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
            if (char === "\\") {
              escaped = true;
              this.advance();
              continue;
            }
            if (char === quote) {
              this.advance();
              return this.createToken("STRING", value, startLine, startColumn);
            }
            if (char === "\n") {
              throw new SyntaxError(`Unterminated string literal at ${startLine}:${startColumn}`);
            }
            value += char;
            this.advance();
          }
          throw new SyntaxError(`Unterminated string literal at ${startLine}:${startColumn}`);
        }
        translateEscape(char) {
          const map = { n: "\n", t: "	", r: "\r", "\\": "\\", '"': '"', "'": "'" };
          return map[char] ?? char;
        }
        isDigit(char) {
          return /[0-9]/.test(char);
        }
        consumeNumber() {
          let value = "";
          const startLine = this.line;
          const startColumn = this.column;
          while (!this.isEOF() && /[0-9_]/.test(this.peek())) {
            value += this.peek();
            this.advance();
          }
          if (!this.isEOF() && this.peek() === ".") {
            if (this.isDigit(this.peek(1))) {
              value += ".";
              this.advance();
              while (!this.isEOF() && /[0-9_]/.test(this.peek())) {
                value += this.peek();
                this.advance();
              }
            }
          }
          value = value.replace(/_/g, "");
          return this.createToken("NUMBER", value, startLine, startColumn);
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
          let value = "";
          if (this.peek() === "@") {
            value += "@";
            this.advance();
            if (this.peek() === "@") {
              value += "@";
              this.advance();
            }
          }
          while (!this.isEOF() && this.isIdentifierPart(this.peek())) {
            value += this.peek();
            this.advance();
          }
          const type = this.keywords.has(value) ? "KEYWORD" : "IDENTIFIER";
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
          if (this.peek() !== "<" || this.peek(1) !== "<") {
            return null;
          }
          const startPos = this.position;
          const startLine = this.line;
          const startColumn = this.column;
          this.advance(2);
          let indicator = "";
          if (this.peek() === "~" || this.peek() === "-") {
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
          if (this.peek() === "\r") {
            this.advance();
          }
          if (this.peek() !== "\n") {
            this.position = startPos;
            this.column = startColumn;
            return null;
          }
          this.advance();
          this.line += 1;
          this.column = 1;
          const lines = [];
          let currentLine = "";
          while (!this.isEOF()) {
            const char = this.peek();
            if (char === "\n") {
              const trimmed = currentLine.trim();
              if (trimmed === label && trimmed.length === label.length) {
                this.advance();
                this.line += 1;
                this.column = 1;
                const value = this.buildHeredocValue(lines, indicator === "~");
                return this.createToken("STRING", value, startLine, startColumn);
              }
              lines.push(currentLine);
              currentLine = "";
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
          if (!lines.length) return "\n";
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
              processed = lines.map((line) => line.startsWith(" ".repeat(minIndent)) ? line.slice(minIndent) : line);
            }
          }
          return processed.join("\n") + "\n";
        }
        consumePercentStringArray() {
          const startLine = this.line;
          const startColumn = this.column;
          const isInterpolated = this.peek(1) === "W";
          this.advance(2);
          const opening = this.peek();
          const closing = this.matchingDelimiter(opening);
          if (!closing) {
            throw new SyntaxError(`Unsupported delimiter for %w literal at ${startLine}:${startColumn}`);
          }
          this.advance();
          let buffer = "";
          const values = [];
          let escaped = false;
          while (!this.isEOF()) {
            const char = this.peek();
            if (!escaped && char === closing) {
              this.advance();
              if (buffer.length) {
                values.push(buffer);
              }
              return this.createToken("PERCENT_STRING_ARRAY", { values, interpolated: isInterpolated }, startLine, startColumn);
            }
            if (!escaped && char === "\\") {
              escaped = true;
              this.advance();
              continue;
            }
            if (!escaped && /\s/.test(char)) {
              if (buffer.length) {
                values.push(buffer);
                buffer = "";
              }
              this.advance();
              if (char === "\n") {
                this.line += 1;
                this.column = 1;
              }
              continue;
            }
            buffer += char;
            escaped = false;
            this.advance();
            if (char === "\n") {
              this.line += 1;
              this.column = 1;
            }
          }
          throw new SyntaxError(`Unterminated %w literal starting at ${startLine}:${startColumn}`);
        }
        matchingDelimiter(opening) {
          const pairs = {
            "(": ")",
            "[": "]",
            "{": "}",
            "<": ">"
          };
          return pairs[opening] || opening;
        }
      };
      module.exports = { Tokenizer };
    }
  });

  // src/parser.js
  var require_parser = __commonJS({
    "src/parser.js"(exports, module) {
      var Parser = class {
        constructor(tokens) {
          this.tokens = tokens;
          this.current = 0;
          this.allowMultiAssign = true;
        }
        parse() {
          const body = [];
          while (!this.check("EOF")) {
            this.skipNewlines();
            if (this.check("EOF")) break;
            body.push(this.parseStatement());
            this.consumeStatementTerminator();
          }
          return { type: "Program", body };
        }
        parseStatement() {
          this.allowMultiAssign = true;
          if (this.match("KEYWORD", "def")) return this.parseMethodDefinition();
          if (this.match("KEYWORD", "class")) return this.parseClassDefinition();
          if (this.match("KEYWORD", "module")) return this.parseModuleDeclaration();
          if (this.match("KEYWORD", "if")) return this.parseIfStatement();
          if (this.match("KEYWORD", "unless")) return this.parseUnlessStatement();
          if (this.match("KEYWORD", "while")) return this.parseWhileStatement();
          if (this.match("KEYWORD", "loop")) return this.parseLoopStatement();
          if (this.match("KEYWORD", "case")) return this.parseCaseStatement();
          if (this.match("KEYWORD", "return")) return this.parseReturnStatement();
          if (this.match("KEYWORD", "break")) return { type: "BreakStatement" };
          if (this.match("KEYWORD", "using")) return this.parseUsingStatement();
          const expr = this.parseAssignment();
          if (this.check("KEYWORD", "if") || this.check("KEYWORD", "unless")) {
            const modifier = this.advance();
            const test = this.parseExpression();
            const expressionStmt = { type: "ExpressionStatement", expression: expr };
            if (modifier.value === "if") {
              return {
                type: "IfStatement",
                test,
                consequent: { type: "BlockStatement", body: [expressionStmt] },
                alternate: null
              };
            }
            return {
              type: "IfStatement",
              test,
              consequent: null,
              alternate: { type: "BlockStatement", body: [expressionStmt] }
            };
          }
          return { type: "ExpressionStatement", expression: expr };
        }
        parseMethodDefinition() {
          const { target, name } = this.parseMethodTargetAndName();
          const params = this.parseMethodParameters();
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close method definition");
          const bodyNode = { type: "BlockStatement", body };
          const methodNode = {
            type: "MethodDefinition",
            id: { type: "Identifier", name },
            target,
            params,
            body: bodyNode
          };
          if (this.containsYield(bodyNode)) {
            methodNode.usesYield = true;
          }
          return methodNode;
        }
        parseMethodTargetAndName() {
          let target = null;
          if (this.check("KEYWORD", "self") && this.peekNextIs(".")) {
            this.advance();
            target = { type: "SelfExpression" };
            this.advance();
            const name2 = this.parseMethodName();
            return { target, name: name2 };
          }
          if (this.check("IDENTIFIER") && this.peekNextIs(".")) {
            const receiver = this.advance();
            target = { type: "Identifier", name: receiver.value };
            this.advance();
            const name2 = this.parseMethodName();
            return { target, name: name2 };
          }
          const name = this.parseMethodName();
          return { target, name };
        }
        parseMethodName() {
          if (this.check("IDENTIFIER") || this.check("KEYWORD")) {
            const token = this.advance();
            let name = token.value;
            if (this.match("OPERATOR", "=")) {
              name += "=";
            }
            return name;
          }
          if (this.match("OPERATOR", "[")) {
            this.consume("OPERATOR", "]", "Expected ']' after '[' in method name");
            let name = "[]";
            if (this.match("OPERATOR", "=")) {
              name += "=";
            }
            return name;
          }
          const operatorToken = this.matchOperatorMethodToken();
          if (operatorToken) {
            return operatorToken;
          }
          throw new SyntaxError("Expected method name after def");
        }
        matchOperatorMethodToken() {
          const token = this.peek();
          if (!token || token.type !== "OPERATOR") return null;
          const simpleOperators = /* @__PURE__ */ new Set([
            "+",
            "-",
            "*",
            "/",
            "%",
            "**",
            "<<",
            ">>",
            "&",
            "|",
            "^",
            "<",
            "<=",
            ">",
            ">=",
            "==",
            "===",
            "!=",
            "<=>",
            "=~",
            "!~",
            "!",
            "~"
          ]);
          if (token.value === "+" || token.value === "-" || token.value === "~") {
            this.advance();
            if (this.match("OPERATOR", "@")) {
              return token.value + "@";
            }
            if (this.check("OPERATOR", "=")) {
              this.advance();
              return token.value + "=";
            }
            return token.value;
          }
          if (simpleOperators.has(token.value)) {
            this.advance();
            return token.value;
          }
          return null;
        }
        parseModuleDeclaration() {
          const nameToken = this.consume("IDENTIFIER", void 0, "Expected module name");
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close module");
          return {
            type: "ModuleDeclaration",
            id: { type: "Identifier", name: nameToken.value },
            body: { type: "BlockStatement", body }
          };
        }
        parseUsingStatement() {
          const nameToken = this.consumeIdentifier("Expected refinement module name after using");
          return {
            type: "UsingStatement",
            id: { type: "Identifier", name: nameToken.value }
          };
        }
        parseMethodParameters() {
          const params = [];
          if (!this.match("OPERATOR", "(")) {
            return params;
          }
          if (!this.check("OPERATOR", ")")) {
            while (true) {
              if (this.match("OPERATOR", "...")) {
                params.push({ type: "ForwardingParameter" });
                break;
              }
              if (this.match("OPERATOR", "**")) {
                const kwRest = this.consumeIdentifier("Expected keyword rest parameter name");
                params.push({ type: "KeywordRestParameter", name: kwRest.value });
                if (!this.match("OPERATOR", ",")) break;
                continue;
              }
              if (this.match("OPERATOR", "*")) {
                if (this.match("OPERATOR", "*")) {
                  const kwRest = this.consumeIdentifier("Expected keyword rest parameter name");
                  params.push({ type: "KeywordRestParameter", name: kwRest.value });
                } else {
                  const rest = this.consumeIdentifier("Expected rest parameter name");
                  params.push({ type: "RestParameter", name: rest.value });
                }
                if (!this.match("OPERATOR", ",")) break;
                continue;
              }
              if (this.match("OPERATOR", "&")) {
                if (this.check("IDENTIFIER") || this.check("KEYWORD")) {
                  const block = this.advance();
                  params.push({ type: "BlockParameter", name: block.value });
                } else {
                  params.push({ type: "BlockParameter", name: "__block" });
                }
                if (!this.match("OPERATOR", ",")) break;
                continue;
              }
              const paramToken = this.consumeIdentifier("Expected parameter name");
              if (this.match("OPERATOR", "=")) {
                const defaultValue = this.parseExpression();
                params.push({
                  type: "OptionalParameter",
                  name: paramToken.value,
                  default: defaultValue
                });
                if (!this.match("OPERATOR", ",")) break;
                continue;
              }
              if (this.check("OPERATOR", ":")) {
                this.advance();
                this.skipNewlines();
                if (this.check("OPERATOR", ",") || this.check("OPERATOR", ")")) {
                  params.push({ type: "KeywordParameter", name: paramToken.value });
                } else {
                  const defaultValue = this.parseExpression();
                  params.push({
                    type: "KeywordOptionalParameter",
                    name: paramToken.value,
                    default: defaultValue
                  });
                }
                if (!this.match("OPERATOR", ",")) break;
                continue;
              }
              params.push({ type: "Identifier", name: paramToken.value });
              if (!this.match("OPERATOR", ",")) break;
            }
          }
          this.consume("OPERATOR", ")", "Expected closing ) after parameters");
          return params;
        }
        parseClassDefinition() {
          if (this.match("OPERATOR", "<<")) {
            const target = this.parseExpression();
            this.consumeStatementTerminator();
            const body2 = this.parseBlock(["end"]);
            this.consume("KEYWORD", "end", "Expected 'end' to close singleton class block");
            return {
              type: "SingletonClassDeclaration",
              target,
              body: { type: "BlockStatement", body: body2 }
            };
          }
          const nameToken = this.consume("IDENTIFIER", void 0, "Expected class name");
          let superClass = null;
          if (this.match("OPERATOR", "<")) {
            superClass = this.parsePrimary();
          }
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close class");
          return {
            type: "ClassDeclaration",
            id: { type: "Identifier", name: nameToken.value },
            superClass,
            body: { type: "BlockStatement", body }
          };
        }
        parseIfStatement() {
          const test = this.parseExpression();
          this.consumeOptionalThen();
          this.consumeStatementTerminator();
          const consequent = this.parseBlock(["elsif", "else", "end"]);
          let alternate = null;
          if (this.match("KEYWORD", "elsif")) {
            alternate = this.parseIfStatement();
          } else if (this.match("KEYWORD", "else")) {
            this.consumeStatementTerminator();
            const alternateBody = this.parseBlock(["end"]);
            this.consume("KEYWORD", "end", "Expected 'end' to close else branch");
            alternate = { type: "BlockStatement", body: alternateBody };
            return {
              type: "IfStatement",
              test,
              consequent: { type: "BlockStatement", body: consequent },
              alternate
            };
          } else {
            this.consume("KEYWORD", "end", "Expected 'end' to close if statement");
          }
          return {
            type: "IfStatement",
            test,
            consequent: { type: "BlockStatement", body: consequent },
            alternate
          };
        }
        parseUnlessStatement() {
          const test = this.parseExpression();
          this.consumeOptionalThen();
          this.consumeStatementTerminator();
          const mainBody = this.parseBlock(["else", "end"]);
          let elseBody = null;
          if (this.match("KEYWORD", "else")) {
            this.consumeStatementTerminator();
            elseBody = this.parseBlock(["end"]);
          }
          this.consume("KEYWORD", "end", "Expected 'end' to close unless statement");
          const alternateBlock = { type: "BlockStatement", body: mainBody };
          const consequentBlock = elseBody ? { type: "BlockStatement", body: elseBody } : { type: "BlockStatement", body: [] };
          return {
            type: "IfStatement",
            test,
            consequent: consequentBlock,
            alternate: alternateBlock
          };
        }
        parseWhileStatement() {
          const test = this.parseExpression();
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close while");
          return {
            type: "WhileStatement",
            test,
            body: { type: "BlockStatement", body }
          };
        }
        parseLoopStatement() {
          this.consume("KEYWORD", "do", "Expected 'do' after loop");
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close loop");
          return {
            type: "LoopStatement",
            body: { type: "BlockStatement", body }
          };
        }
        parseCaseStatement() {
          let test = null;
          if (!this.check("NEWLINE") && !this.check("KEYWORD", "when") && !this.check("KEYWORD", "in")) {
            test = this.parseExpression();
          }
          this.consumeStatementTerminator();
          const clauses = [];
          while (true) {
            if (this.match("KEYWORD", "when")) {
              const tests = [];
              do {
                tests.push(this.parseExpression());
              } while (this.match("OPERATOR", ","));
              this.consumeStatementTerminator();
              const body = this.parseBlock(["when", "in", "else", "end"]);
              clauses.push({ type: "WhenClause", tests, body: { type: "BlockStatement", body } });
              continue;
            }
            if (this.match("KEYWORD", "in")) {
              const pattern = this.parsePattern();
              let guard = null;
              if (this.match("KEYWORD", "if")) {
                guard = { type: "PatternGuard", condition: this.parseExpression(), negated: false };
              } else if (this.match("KEYWORD", "unless")) {
                guard = { type: "PatternGuard", condition: this.parseExpression(), negated: true };
              }
              this.match("KEYWORD", "then");
              this.consumeStatementTerminator();
              const body = this.parseBlock(["when", "in", "else", "end"]);
              clauses.push({ type: "PatternClause", pattern, guard, body: { type: "BlockStatement", body } });
              continue;
            }
            break;
          }
          let alternate = null;
          if (this.match("KEYWORD", "else")) {
            this.consumeStatementTerminator();
            const altBody = this.parseBlock(["end"]);
            alternate = { type: "BlockStatement", body: altBody };
          }
          this.consume("KEYWORD", "end", "Expected 'end' to close case statement");
          return { type: "CaseStatement", test, clauses, alternate };
        }
        parseReturnStatement() {
          const modifierAhead = this.check("KEYWORD", "if") || this.check("KEYWORD", "unless");
          if (this.isTerminator(this.peek()) || modifierAhead) {
            const statement2 = { type: "ReturnStatement", argument: null };
            if (modifierAhead && (this.match("KEYWORD", "if") || this.match("KEYWORD", "unless"))) {
              const keyword = this.previous().value;
              const test = this.parseExpression();
              if (keyword === "if") {
                return {
                  type: "IfStatement",
                  test,
                  consequent: { type: "BlockStatement", body: [statement2] },
                  alternate: null
                };
              }
              return {
                type: "IfStatement",
                test: { type: "UnaryExpression", operator: "!", argument: test },
                consequent: { type: "BlockStatement", body: [statement2] },
                alternate: null
              };
            }
            return statement2;
          }
          const argument = this.parseExpression();
          const statement = { type: "ReturnStatement", argument };
          if (this.match("KEYWORD", "if") || this.match("KEYWORD", "unless")) {
            const keyword = this.previous().value;
            const test = this.parseExpression();
            if (keyword === "if") {
              return {
                type: "IfStatement",
                test,
                consequent: { type: "BlockStatement", body: [statement] },
                alternate: null
              };
            }
            return {
              type: "IfStatement",
              test: { type: "UnaryExpression", operator: "!", argument: test },
              consequent: { type: "BlockStatement", body: [statement] },
              alternate: null
            };
          }
          return statement;
        }
        parsePattern() {
          if (this.match("OPERATOR", "{")) {
            return this.parseHashPattern(true);
          }
          if (this.match("OPERATOR", "[")) {
            return this.parseArrayPattern(true);
          }
          if (this.check("IDENTIFIER")) {
            const identifier = this.advance();
            return { type: "Identifier", name: identifier.value };
          }
          if (this.match("OPERATOR", "*")) {
            const restName = this.consumeIdentifier("Expected identifier after * in pattern");
            return { type: "RestPattern", argument: { type: "Identifier", name: restName.value } };
          }
          return this.parseExpression();
        }
        parseHashPattern(openConsumed = false) {
          if (!openConsumed) {
            this.consume("OPERATOR", "{", "Expected '{' to start hash pattern");
          }
          const entries = [];
          while (!this.check("OPERATOR", "}")) {
            this.skipNewlines();
            if (this.check("OPERATOR", "}")) break;
            let keyNode;
            let binding = null;
            let value = null;
            if (this.check("STRING")) {
              const keyToken = this.advance();
              keyNode = { type: "StringLiteral", value: keyToken.value };
              this.consume("OPERATOR", "=>", "Expected '=>' after string key in pattern");
              const bindingToken = this.consume("IDENTIFIER", void 0, "Expected binding name in pattern");
              binding = { type: "Identifier", name: bindingToken.value };
            } else if (this.check("IDENTIFIER")) {
              const labelToken = this.advance();
              keyNode = { type: "SymbolLiteral", name: labelToken.value };
              this.consume("OPERATOR", ":", "Expected ':' after key in pattern");
              if (this.check("IDENTIFIER") && !this.peekNextIs(":")) {
                const bindingToken = this.advance();
                binding = { type: "Identifier", name: bindingToken.value };
              } else if (this.check("OPERATOR", "^")) {
                this.advance();
                value = { type: "PinExpression", expression: this.parseExpression() };
              } else if (this.check("OPERATOR", "{")) {
                value = this.parseHashPattern();
              } else if (this.check("OPERATOR", "[")) {
                value = this.parseArrayPattern();
              } else if (this.isPatternValueStart(this.peek())) {
                value = this.parsePatternValue();
              } else {
                binding = { type: "Identifier", name: labelToken.value };
              }
            } else {
              throw new SyntaxError("Unsupported hash pattern entry");
            }
            entries.push({ key: keyNode, binding, value });
            this.match("OPERATOR", ",");
            this.skipNewlines();
          }
          this.consume("OPERATOR", "}", "Expected '}' to close pattern");
          return { type: "HashPattern", entries };
        }
        parseArrayPattern(openConsumed = false) {
          if (!openConsumed) {
            this.consume("OPERATOR", "[", "Expected '[' to start array pattern");
          }
          const elements = [];
          let restElement = null;
          while (!this.check("OPERATOR", "]")) {
            this.skipNewlines();
            if (this.check("OPERATOR", "]")) break;
            if (this.match("OPERATOR", "*")) {
              if (this.check("IDENTIFIER")) {
                const token = this.advance();
                restElement = { type: "Identifier", name: token.value };
              } else {
                restElement = { type: "Identifier", name: null };
              }
              break;
            }
            const element = this.parsePatternValue();
            elements.push(element);
            this.skipNewlines();
            if (!this.match("OPERATOR", ",")) break;
          }
          this.consume("OPERATOR", "]", "Expected ']' to close pattern");
          return { type: "ArrayPattern", elements, rest: restElement };
        }
        parsePatternValue() {
          if (this.match("OPERATOR", "^")) {
            return { type: "PinExpression", expression: this.parseExpression() };
          }
          if (this.match("OPERATOR", "{")) {
            return this.parseHashPattern(true);
          }
          if (this.match("OPERATOR", "[")) {
            return this.parseArrayPattern(true);
          }
          if (this.check("IDENTIFIER")) {
            const token = this.advance();
            return { type: "Identifier", name: token.value };
          }
          return this.parseExpression();
        }
        isPatternValueStart(token) {
          if (!token) return false;
          if (token.type === "IDENTIFIER") return true;
          if (token.type === "NUMBER" || token.type === "STRING") return true;
          if (token.type === "OPERATOR" && ["{", "[", "^"].includes(token.value)) return true;
          return false;
        }
        parseBlock(stopKeywords) {
          const body = [];
          while (!this.check("EOF") && !this.checkAny(stopKeywords)) {
            this.skipNewlines();
            if (this.checkAny(stopKeywords)) break;
            body.push(this.parseStatement());
            this.consumeStatementTerminator();
          }
          return body;
        }
        parseAssignment() {
          const left = this.parseRescueExpression();
          if (this.allowMultiAssign && this.check("OPERATOR", ",") && this.isAssignableNode(left)) {
            const checkpoint = this.current;
            try {
              const targets = [this.ensureAssignable(left)];
              while (this.match("OPERATOR", ",")) {
                const target = this.parseRescueExpression();
                targets.push(this.ensureAssignable(target));
              }
              this.consume("OPERATOR", "=", "Expected = after multiple assignment");
              const right = this.parseAssignment();
              return {
                type: "MultiAssignmentExpression",
                targets,
                right
              };
            } catch (error) {
              if (error instanceof SyntaxError) {
                this.current = checkpoint;
              } else {
                throw error;
              }
            }
          }
          if (this.match("OPERATOR", "=") || this.matchAssignmentOperator()) {
            const operator = this.previous();
            const right = this.parseAssignment();
            return {
              type: "AssignmentExpression",
              operator: operator.value,
              left: this.ensureAssignable(left),
              right
            };
          }
          return left;
        }
        parseRescueExpression() {
          let expr = this.parseConditional();
          if (!this.check("KEYWORD", "rescue")) {
            return expr;
          }
          const primary = expr;
          this.advance();
          const rescueExpression = this.parseExpression();
          const bodyBlock = this.wrapExpressionAsBlock(primary);
          const rescueBlock = this.wrapExpressionAsBlock(rescueExpression);
          return {
            type: "BeginRescueExpression",
            body: bodyBlock,
            rescues: [
              {
                type: "RescueClause",
                exceptions: [],
                binding: null,
                body: rescueBlock
              }
            ],
            elseBody: null,
            ensureBody: null,
            inline: true
          };
        }
        parseConditional() {
          let expr = this.parseLogicalOr();
          if (this.match("OPERATOR", "?")) {
            const consequent = this.parseExpression();
            this.consume("OPERATOR", ":", "Expected ':' in conditional expression");
            const alternate = this.parseExpression();
            expr = { type: "ConditionalExpression", test: expr, consequent, alternate };
          }
          return expr;
        }
        matchAssignmentOperator() {
          const operators = ["+=", "-=", "*=", "/=", "%=", "||=", "&&="];
          for (const op of operators) {
            if (this.match("OPERATOR", op)) return true;
          }
          return false;
        }
        ensureAssignable(node) {
          if (!node) throw new SyntaxError("Invalid assignment target");
          const valid = ["Identifier", "InstanceVariable", "ClassVariable", "MemberExpression"];
          if (valid.includes(node.type)) return node;
          throw new SyntaxError("Invalid assignment target");
        }
        isAssignableNode(node) {
          if (!node) return false;
          const valid = ["Identifier", "InstanceVariable", "ClassVariable", "MemberExpression"];
          return valid.includes(node.type);
        }
        isIndexableExpression(node) {
          if (!node) return false;
          const valid = [
            "Identifier",
            "MemberExpression",
            "OptionalMemberExpression",
            "InstanceVariable",
            "ClassVariable",
            "SelfExpression"
          ];
          return valid.includes(node.type);
        }
        parseLogicalOr() {
          let expr = this.parseLogicalAnd();
          while (this.match("OPERATOR", "||")) {
            const operator = this.previous().value;
            const right = this.parseLogicalAnd();
            expr = { type: "LogicalExpression", operator, left: expr, right };
          }
          return expr;
        }
        parseLogicalAnd() {
          let expr = this.parseEquality();
          while (this.match("OPERATOR", "&&")) {
            const operator = this.previous().value;
            const right = this.parseEquality();
            expr = { type: "LogicalExpression", operator, left: expr, right };
          }
          return expr;
        }
        parseEquality() {
          let expr = this.parseRange();
          while (this.match("OPERATOR", "==") || this.match("OPERATOR", "!=")) {
            const operator = this.previous().value;
            const right = this.parseRange();
            expr = { type: "BinaryExpression", operator, left: expr, right };
          }
          return expr;
        }
        parseRange() {
          let expr = this.parseComparison();
          if (this.match("OPERATOR", "..") || this.match("OPERATOR", "...")) {
            const operator = this.previous().value;
            const right = this.parseRange();
            expr = {
              type: "RangeExpression",
              start: expr,
              end: right,
              exclusive: operator === "..."
            };
          }
          return expr;
        }
        parseComparison() {
          let expr = this.parseTerm();
          while (this.match("OPERATOR", "<") || this.match("OPERATOR", ">") || this.match("OPERATOR", "<=") || this.match("OPERATOR", ">=")) {
            const operator = this.previous().value;
            const right = this.parseTerm();
            expr = { type: "BinaryExpression", operator, left: expr, right };
          }
          return expr;
        }
        parseTerm() {
          let expr = this.parseFactor();
          while (true) {
            if (this.match("OPERATOR", "+") || this.match("OPERATOR", "-")) {
              const operator = this.previous().value;
              const right = this.parseFactor();
              expr = { type: "BinaryExpression", operator, left: expr, right };
              continue;
            }
            if (this.match("OPERATOR", "<<")) {
              const operator = this.previous().value;
              const right = this.parseFactor();
              expr = { type: "BinaryExpression", operator, left: expr, right };
              continue;
            }
            break;
          }
          return expr;
        }
        parseFactor() {
          let expr = this.parseUnary();
          while (this.match("OPERATOR", "*") || this.match("OPERATOR", "/") || this.match("OPERATOR", "%")) {
            const operator = this.previous().value;
            const right = this.parseUnary();
            expr = { type: "BinaryExpression", operator, left: expr, right };
          }
          return expr;
        }
        parseUnary() {
          if (this.match("OPERATOR", "!") || this.match("OPERATOR", "-") || this.match("OPERATOR", "+")) {
            const operator = this.previous().value;
            const argument = this.parseUnary();
            return { type: "UnaryExpression", operator, argument };
          }
          if (this.match("OPERATOR", "&")) {
            const expression = this.parseUnary();
            if (expression.type === "SymbolLiteral") {
              return { type: "ToProcExpression", argument: expression };
            }
            return { type: "BlockPassExpression", expression };
          }
          return this.parseCall();
        }
        isKeywordArgumentStart() {
          const current = this.peek();
          const next = this.tokens[this.current + 1];
          if (!current || !next) return false;
          if (current.type !== "IDENTIFIER") return false;
          if (next.type !== "OPERATOR" || next.value !== ":") return false;
          return true;
        }
        parseKeywordArgumentGroup() {
          const properties = [];
          while (true) {
            const keyToken = this.consumeIdentifier("Expected keyword argument name");
            const keyNode = { type: "Identifier", name: keyToken.value };
            this.consume("OPERATOR", ":", "Expected ':' after keyword argument name");
            this.skipNewlines();
            const value = this.parseExpression();
            properties.push({ key: keyNode, value });
            if (!this.check("OPERATOR", ",")) break;
            const next = this.tokens[this.current + 1];
            const after = this.tokens[this.current + 2];
            if (!(next && next.type === "IDENTIFIER" && after && after.type === "OPERATOR" && after.value === ":")) {
              break;
            }
            this.advance();
          }
          return { type: "HashExpression", properties, keyword: true };
        }
        parseCall() {
          let expr = this.parsePrimary();
          while (true) {
            while (true) {
              if (this.check("NEWLINE")) {
                const next = this.tokens[this.current + 1];
                if (next && next.type === "OPERATOR") {
                  if (next.value === "." || next.value === "&.") {
                    this.advance();
                    continue;
                  }
                }
                break;
              }
              if (this.match("OPERATOR", "(")) {
                const args = [];
                if (!this.check("OPERATOR", ")")) {
                  const parseArgument = () => {
                    if (this.match("OPERATOR", "...")) {
                      args.push({ type: "ForwardingArguments" });
                      return;
                    }
                    if (this.isKeywordArgumentStart()) {
                      args.push(this.parseKeywordArgumentGroup());
                    } else {
                      const previous = this.allowMultiAssign;
                      this.allowMultiAssign = false;
                      args.push(this.parseExpression());
                      this.allowMultiAssign = previous;
                    }
                  };
                  parseArgument();
                  while (this.check("OPERATOR", ",")) {
                    this.advance();
                    parseArgument();
                  }
                }
                this.consume("OPERATOR", ")", "Expected closing ) after arguments");
                expr = { type: "CallExpression", callee: expr, arguments: args };
                continue;
              }
              if (this.match("OPERATOR", "&.")) {
                const propertyToken = this.consumeIdentifier("Expected method name after &.");
                expr = {
                  type: "OptionalMemberExpression",
                  object: expr,
                  property: { type: "Identifier", name: propertyToken.value },
                  computed: false
                };
                const nextToken = this.peek();
                if (!(nextToken && nextToken.type === "OPERATOR" && (nextToken.value === "(" || nextToken.value === "="))) {
                  expr = this.ensureCallExpression(expr);
                }
                continue;
              }
              if (this.match("OPERATOR", ".")) {
                const propertyToken = this.consumeIdentifier("Expected property name after .");
                expr = {
                  type: "MemberExpression",
                  object: expr,
                  property: { type: "Identifier", name: propertyToken.value },
                  computed: false
                };
                const nextToken = this.peek();
                if (!(nextToken && nextToken.type === "OPERATOR" && (nextToken.value === "(" || nextToken.value === "="))) {
                  expr = this.ensureCallExpression(expr);
                }
                continue;
              }
              if (this.match("OPERATOR", "[")) {
                const index = this.parseExpression();
                this.consume("OPERATOR", "]", "Expected closing ]");
                expr = {
                  type: "MemberExpression",
                  object: expr,
                  property: index,
                  computed: true
                };
                continue;
              }
              if (this.canAttachBlock(expr) && (this.check("KEYWORD", "do") || this.check("OPERATOR", "{"))) {
                expr = this.attachBlock(expr);
                continue;
              }
              break;
            }
            expr = this.wrapImplicitCall(expr);
            if (this.canCommandCall(expr)) {
              const args = [];
              const parseArgument = () => {
                if (this.match("OPERATOR", "...")) {
                  args.push({ type: "ForwardingArguments" });
                  return;
                }
                if (this.isKeywordArgumentStart()) {
                  args.push(this.parseKeywordArgumentGroup());
                } else {
                  const previous = this.allowMultiAssign;
                  this.allowMultiAssign = false;
                  args.push(this.parseExpression());
                  this.allowMultiAssign = previous;
                }
              };
              parseArgument();
              while (this.check("OPERATOR", ",")) {
                this.advance();
                parseArgument();
              }
              expr = { type: "CallExpression", callee: expr, arguments: args };
              continue;
            }
            break;
          }
          return expr;
        }
        wrapImplicitCall(expr) {
          if (!expr) return expr;
          if (!["MemberExpression", "OptionalMemberExpression"].includes(expr.type)) {
            return expr;
          }
          if (expr.type === "MemberExpression" && expr.computed) {
            return expr;
          }
          if (expr.type === "OptionalMemberExpression" && expr.computed) {
            return expr;
          }
          if (!this.shouldImplicitCall()) return expr;
          return { type: "CallExpression", callee: expr, arguments: [] };
        }
        ensureCallExpression(expr) {
          if (expr.type === "CallExpression") return expr;
          return { type: "CallExpression", callee: expr, arguments: [] };
        }
        canAttachBlock(expr) {
          if (!expr) return false;
          return ["Identifier", "CallExpression", "MemberExpression", "OptionalMemberExpression"].includes(expr.type);
        }
        attachBlock(expr) {
          let current = expr;
          while (true) {
            if (this.check("KEYWORD", "do") && this.canAttachBlock(current)) {
              this.advance();
              current = this.ensureCallExpression(current);
              const block = this.parseDoBlock();
              current.block = block;
              continue;
            }
            if (this.check("OPERATOR", "{") && this.canAttachBlock(current)) {
              const block = this.parseBraceBlock();
              current = this.ensureCallExpression(current);
              current.block = block;
              continue;
            }
            break;
          }
          return current;
        }
        parseDoBlock() {
          const params = this.parseBlockParameters();
          this.consumeStatementTerminator();
          const body = this.parseBlock(["end"]);
          this.consume("KEYWORD", "end", "Expected 'end' to close block");
          return { params, body: { type: "BlockStatement", body } };
        }
        parseBlockParameters() {
          const params = [];
          if (!this.match("OPERATOR", "|")) return params;
          if (!this.check("OPERATOR", "|")) {
            do {
              const token = this.consume("IDENTIFIER", void 0, "Expected block parameter");
              params.push({ type: "Identifier", name: token.value });
            } while (this.match("OPERATOR", ","));
          }
          this.consume("OPERATOR", "|", "Expected closing | for block parameters");
          return params;
        }
        shouldImplicitCall() {
          const token = this.peek();
          if (!token) return true;
          if (token.type === "NEWLINE" || token.type === "EOF") return true;
          if (token.type === "KEYWORD" && ["end", "else", "elsif", "when"].includes(token.value)) return true;
          if (token.type === "OPERATOR" && [")", "]", "}", ","].includes(token.value)) return true;
          return false;
        }
        parsePrimary() {
          if (this.match("NUMBER")) {
            return { type: "NumericLiteral", value: Number(this.previous().value) };
          }
          if (this.match("REGEX")) {
            const token = this.previous();
            return { type: "RegExpLiteral", pattern: token.value.pattern, flags: token.value.flags };
          }
          if (this.match("STRING")) {
            return { type: "StringLiteral", value: this.previous().value };
          }
          if (this.match("PERCENT_STRING_ARRAY")) {
            const token = this.previous();
            return {
              type: "ArrayExpression",
              elements: token.value.values.map((value) => ({ type: "StringLiteral", value }))
            };
          }
          if (this.match("KEYWORD", "true")) {
            return { type: "BooleanLiteral", value: true };
          }
          if (this.match("KEYWORD", "false")) {
            return { type: "BooleanLiteral", value: false };
          }
          if (this.match("KEYWORD", "nil")) {
            return { type: "NullLiteral", value: null };
          }
          if (this.match("KEYWORD", "self")) {
            return { type: "SelfExpression" };
          }
          if (this.match("KEYWORD", "super")) {
            const args = [];
            if (this.match("OPERATOR", "(")) {
              if (!this.check("OPERATOR", ")")) {
                do {
                  args.push(this.parseExpression());
                } while (this.match("OPERATOR", ","));
              }
              this.consume("OPERATOR", ")", "Expected closing ) after super arguments");
            } else if (!this.isTerminator(this.peek())) {
              args.push(this.parseExpression());
              while (this.match("OPERATOR", ",")) {
                args.push(this.parseExpression());
              }
            }
            return { type: "SuperCall", arguments: args };
          }
          if (this.match("KEYWORD", "begin")) {
            return this.parseBeginExpression();
          }
          if (this.match("OPERATOR", ":")) {
            const token = this.consumeSymbolToken("Expected symbol name after :");
            return { type: "SymbolLiteral", name: token.value };
          }
          if (this.match("IDENTIFIER")) {
            const token = this.previous();
            if (token.value.startsWith("@@")) {
              return { type: "ClassVariable", name: token.value.slice(2) };
            }
            if (token.value.startsWith("@")) {
              return { type: "InstanceVariable", name: token.value.slice(1) };
            }
            const name = token.value;
            if (name === "block_given?") {
              const nextToken = this.peek();
              if (!(nextToken && nextToken.type === "OPERATOR" && nextToken.value === "(")) {
                return {
                  type: "CallExpression",
                  callee: { type: "Identifier", name },
                  arguments: []
                };
              }
            }
            return { type: "Identifier", name };
          }
          if (this.match("OPERATOR", "(")) {
            const expr = this.parseExpression();
            this.consume("OPERATOR", ")", "Expected closing )");
            return expr;
          }
          if (this.match("OPERATOR", "[")) {
            const elements = [];
            this.skipNewlines();
            if (!this.check("OPERATOR", "]")) {
              while (true) {
                elements.push(this.parseExpression());
                this.skipNewlines();
                if (!this.match("OPERATOR", ",")) break;
                this.skipNewlines();
              }
            }
            this.consume("OPERATOR", "]", "Expected closing ]");
            return { type: "ArrayExpression", elements };
          }
          if (this.match("OPERATOR", "{")) {
            const properties = [];
            if (!this.check("OPERATOR", "}")) {
              do {
                const keyToken = this.consumeKey();
                let value;
                if (this.match("OPERATOR", "=>")) {
                  value = this.parseExpression();
                } else if (this.match("OPERATOR", ":")) {
                  value = this.parseExpression();
                } else {
                  throw new SyntaxError("Expected '=>' or ':' in hash");
                }
                properties.push({ key: keyToken, value });
              } while (this.match("OPERATOR", ","));
            }
            this.consume("OPERATOR", "}", "Expected closing }");
            return { type: "HashExpression", properties };
          }
          if (this.match("OPERATOR", "->")) {
            return this.parseLambda();
          }
          if (this.match("KEYWORD", "yield")) {
            const args = [];
            const previous = this.allowMultiAssign;
            this.allowMultiAssign = false;
            if (this.match("OPERATOR", "(")) {
              if (!this.check("OPERATOR", ")")) {
                const parseArgument = () => {
                  args.push(this.parseExpression());
                };
                parseArgument();
                while (this.check("OPERATOR", ",")) {
                  this.advance();
                  parseArgument();
                }
              }
              this.consume("OPERATOR", ")", "Expected closing ) after yield arguments");
            } else if (!this.isTerminator(this.peek())) {
              args.push(this.parseExpression());
              while (this.check("OPERATOR", ",")) {
                this.advance();
                args.push(this.parseExpression());
              }
            }
            this.allowMultiAssign = previous;
            return { type: "YieldExpression", arguments: args };
          }
          throw new SyntaxError(`Unexpected token ${this.peek().type} ${this.peek().value ?? ""}`);
        }
        consumeKey() {
          if (this.match("STRING")) {
            return { type: "StringLiteral", value: this.previous().value };
          }
          if (this.match("IDENTIFIER")) {
            return { type: "Identifier", name: this.previous().value };
          }
          if (this.match("OPERATOR", ":")) {
            const token = this.consumeSymbolToken("Expected symbol name");
            return { type: "SymbolLiteral", name: token.value };
          }
          throw new SyntaxError("Invalid hash key");
        }
        consumeSymbolToken(message) {
          if (this.check("IDENTIFIER")) return this.advance();
          if (this.check("KEYWORD")) return this.advance();
          if (this.check("OPERATOR")) return this.advance();
          throw new SyntaxError(message);
        }
        parseExpression() {
          return this.parseAssignment();
        }
        consume(type, value, message) {
          if (message === void 0) {
            message = value;
            value = void 0;
          }
          if (this.check(type, value)) return this.advance();
          throw new SyntaxError(message);
        }
        consumeIdentifier(message) {
          if (this.check("IDENTIFIER")) return this.advance();
          if (this.check("KEYWORD")) return this.advance();
          throw new SyntaxError(message);
        }
        parseBraceBlock(openConsumed = false) {
          if (!openConsumed) {
            this.consume("OPERATOR", "{", "Expected '{' to start block");
          }
          const params = this.parseBlockParameters();
          this.consumeStatementTerminator();
          const body = [];
          while (!this.check("EOF") && !this.check("OPERATOR", "}")) {
            this.skipNewlines();
            if (this.check("OPERATOR", "}")) break;
            body.push(this.parseStatement());
            this.consumeStatementTerminator();
          }
          this.consume("OPERATOR", "}", "Expected '}' to close block");
          return { params, body: { type: "BlockStatement", body } };
        }
        parseLambda() {
          const params = [];
          if (this.match("OPERATOR", "(")) {
            if (!this.check("OPERATOR", ")")) {
              do {
                if (this.match("OPERATOR", "*")) {
                  const rest = this.consumeIdentifier("Expected rest parameter name");
                  params.push({ type: "RestParameter", name: rest.value });
                  continue;
                }
                const param = this.consumeIdentifier("Expected parameter name");
                params.push({ type: "Identifier", name: param.value });
              } while (this.match("OPERATOR", ","));
            }
            this.consume("OPERATOR", ")", "Expected closing ) after lambda parameters");
          }
          let block;
          if (this.match("OPERATOR", "{")) {
            block = this.parseBraceBlock(true);
          } else if (this.match("KEYWORD", "do")) {
            block = this.parseDoBlock();
          } else {
            throw new SyntaxError("Expected block after lambda");
          }
          const lambdaParams = params.length ? params : block.params;
          return {
            type: "LambdaExpression",
            params: lambdaParams,
            body: block.body
          };
        }
        wrapExpressionAsBlock(expression) {
          return {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression
              }
            ]
          };
        }
        parseBeginExpression() {
          this.consumeStatementTerminator();
          const bodyStatements = this.parseBlock(["rescue", "else", "ensure", "end"]);
          const bodyBlock = { type: "BlockStatement", body: bodyStatements };
          const rescues = [];
          while (this.match("KEYWORD", "rescue")) {
            rescues.push(this.parseRescueClause());
          }
          let elseBody = null;
          if (this.match("KEYWORD", "else")) {
            this.consumeStatementTerminator();
            const elseStatements = this.parseBlock(["ensure", "end"]);
            elseBody = { type: "BlockStatement", body: elseStatements };
          }
          let ensureBody = null;
          if (this.match("KEYWORD", "ensure")) {
            this.consumeStatementTerminator();
            const ensureStatements = this.parseBlock(["end"]);
            ensureBody = { type: "BlockStatement", body: ensureStatements };
          }
          this.consume("KEYWORD", "end", "Expected 'end' to close begin/rescue block");
          return {
            type: "BeginRescueExpression",
            body: bodyBlock,
            rescues,
            elseBody,
            ensureBody,
            inline: false
          };
        }
        parseRescueClause() {
          const exceptions = [];
          if (!this.isRescueClauseTerminator(this.peek())) {
            do {
              exceptions.push(this.parseExpression());
            } while (this.match("OPERATOR", ","));
          }
          let binding = null;
          if (this.match("OPERATOR", "=>")) {
            const identifier = this.consumeIdentifier("Expected rescue variable name");
            binding = { type: "Identifier", name: identifier.value };
          }
          this.consumeStatementTerminator();
          const bodyStatements = this.parseBlock(["rescue", "else", "ensure", "end"]);
          return {
            type: "RescueClause",
            exceptions,
            binding,
            body: { type: "BlockStatement", body: bodyStatements }
          };
        }
        isRescueClauseTerminator(token) {
          if (!token) return true;
          if (token.type === "NEWLINE" || token.type === "EOF") return true;
          if (token.type === "OPERATOR" && token.value === "=>") return true;
          if (token.type === "KEYWORD" && ["do", "then"].includes(token.value)) return true;
          return false;
        }
        containsYield(node) {
          if (!node || typeof node !== "object") return false;
          switch (node.type) {
            case "YieldExpression":
              return true;
            case "BlockStatement":
              return node.body.some((child) => this.containsYield(child));
            case "ExpressionStatement":
              return this.containsYield(node.expression);
            case "IfStatement":
              return this.containsYield(node.test) || node.consequent && this.containsYield(node.consequent) || node.alternate && this.containsYield(node.alternate);
            case "AssignmentExpression":
              return this.containsYield(node.left) || this.containsYield(node.right);
            case "CallExpression":
              if (this.containsYield(node.callee)) return true;
              if (node.arguments.some((arg) => this.containsYield(arg))) return true;
              if (node.block) return this.containsYield(node.block.body);
              return false;
            case "MemberExpression":
              return this.containsYield(node.object) || node.computed && this.containsYield(node.property);
            case "BinaryExpression":
            case "LogicalExpression":
              return this.containsYield(node.left) || this.containsYield(node.right);
            case "UnaryExpression":
              return this.containsYield(node.argument);
            case "ConditionalExpression":
              return this.containsYield(node.test) || this.containsYield(node.consequent) || this.containsYield(node.alternate);
            case "CaseStatement":
              if (node.test && this.containsYield(node.test)) return true;
              for (const clause of node.clauses) {
                if (clause.type === "WhenClause" && clause.tests) {
                  if (clause.tests.some((test) => this.containsYield(test))) return true;
                }
                if (this.containsYield(clause.body)) return true;
              }
              return node.alternate ? this.containsYield(node.alternate) : false;
            case "BeginRescueExpression":
              if (this.containsYield(node.body)) return true;
              if (node.rescues) {
                for (const clause of node.rescues) {
                  if (clause.exceptions && clause.exceptions.some((exception) => this.containsYield(exception))) {
                    return true;
                  }
                  if (this.containsYield(clause.body)) return true;
                }
              }
              if (node.elseBody && this.containsYield(node.elseBody)) return true;
              if (node.ensureBody && this.containsYield(node.ensureBody)) return true;
              return false;
            default:
              return false;
          }
        }
        peekNextIs(value) {
          const token = this.tokens[this.current + 1];
          if (!token) return false;
          if (typeof value === "string") {
            return token.type === "OPERATOR" && token.value === value;
          }
          return token.type === value;
        }
        match(type, value) {
          if (this.check(type, value)) {
            this.advance();
            return true;
          }
          return false;
        }
        check(type, value) {
          if (this.isAtEnd()) return type === "EOF";
          const token = this.peek();
          if (token.type !== type) return false;
          if (value === void 0) return true;
          return token.value === value;
        }
        checkAny(keywords) {
          if (!Array.isArray(keywords)) return false;
          for (const word of keywords) {
            if (this.check("KEYWORD", word)) return true;
          }
          return false;
        }
        advance() {
          if (!this.isAtEnd()) this.current += 1;
          return this.previous();
        }
        isAtEnd() {
          return this.peek().type === "EOF";
        }
        peek() {
          return this.tokens[this.current];
        }
        previous() {
          return this.tokens[this.current - 1];
        }
        skipNewlines() {
          while (this.match("NEWLINE")) {
          }
        }
        consumeStatementTerminator() {
          let consumed = false;
          while (true) {
            if (this.match("NEWLINE")) {
              consumed = true;
              continue;
            }
            if (this.match("OPERATOR", ";")) {
              consumed = true;
              continue;
            }
            break;
          }
          return consumed;
        }
        consumeOptionalThen() {
          this.match("KEYWORD", "then");
        }
        isTerminator(token) {
          if (!token) return true;
          if (token.type === "NEWLINE") return true;
          if (token.type === "EOF") return true;
          if (token.type === "KEYWORD" && token.value === "end") return true;
          return false;
        }
        canCommandCall(expr) {
          if (!expr) return false;
          if (!["Identifier", "MemberExpression", "CallExpression", "OptionalMemberExpression"].includes(expr.type)) return false;
          const token = this.peek();
          if (!token) return false;
          if (token.type === "NEWLINE" || token.type === "EOF") return false;
          if (token.type === "KEYWORD" && ["end", "else", "elsif", "when"].includes(token.value)) return false;
          if (token.type === "OPERATOR" && [")", "}", "]", "=", "+=", "-=", "*=", "/=", "%=", "=>"].includes(token.value)) return false;
          if (!this.isExpressionStart(token)) return false;
          return true;
        }
        isExpressionStart(token) {
          if (!token) return false;
          if (token.type === "IDENTIFIER") return true;
          if (token.type === "NUMBER" || token.type === "STRING") return true;
          if (token.type === "PERCENT_STRING_ARRAY") return true;
          if (token.type === "KEYWORD" && ["true", "false", "nil", "self"].includes(token.value)) return true;
          if (token.type === "OPERATOR" && ["(", "[", ":", "!"].includes(token.value)) return true;
          return false;
        }
      };
      module.exports = { Parser };
    }
  });

  // src/emitter.js
  var require_emitter = __commonJS({
    "src/emitter.js"(exports, module) {
      var { Tokenizer } = require_tokenizer();
      var { Parser } = require_parser();
      var Emitter = class {
        constructor(options = {}) {
          this.indentSize = options.indent ?? 2;
          this.indentLevel = 0;
          this.scopeInfo = /* @__PURE__ */ new Map();
          this.runtimeHelpers = /* @__PURE__ */ new Set();
          this.uniqueIdCounter = 0;
          this.injectedRequires = /* @__PURE__ */ new Set();
          this.reservedWords = /* @__PURE__ */ new Set([
            "enum",
            "await",
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "export",
            "extends",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
            "yield",
            "let",
            "static",
            "implements",
            "interface",
            "package",
            "private",
            "protected",
            "public",
            "null",
            "true",
            "false",
            "arguments"
          ]);
        }
        emit(program) {
          this.collectProgram(program);
          return this.emitProgram(program);
        }
        emitProgram(node) {
          const scope = this.scopeInfo.get(node);
          const hoistedLines = [];
          if (scope && scope.hoisted.size) {
            for (const name of [...scope.hoisted].sort()) {
              const safeName = this.getRenamedName(scope, name);
              hoistedLines.push(this.indent() + `let ${safeName};`);
            }
          }
          const bodyLines = [];
          for (const statement of node.body) {
            const code = this.emitStatement(statement, { scopeNode: node, scopeStack: [node] });
            if (code) bodyLines.push(code);
          }
          const helperLines = this.buildRuntimePrelude();
          if (!helperLines.length) {
            if (hoistedLines.length && bodyLines.length) {
              return [...hoistedLines, ...bodyLines].join("\n");
            }
            if (hoistedLines.length) return hoistedLines.join("\n");
            if (bodyLines.length) return bodyLines.join("\n");
            return "";
          }
          const segments = [];
          if (hoistedLines.length) segments.push(hoistedLines);
          segments.push(helperLines);
          if (bodyLines.length) segments.push(bodyLines);
          const lines = [];
          segments.forEach((segment, index) => {
            if (index > 0) lines.push("");
            lines.push(...segment);
          });
          return lines.join("\n");
        }
        requireRuntime(helperName) {
          this.runtimeHelpers.add(helperName);
        }
        buildRuntimePrelude() {
          if (!this.runtimeHelpers.size) return [];
          const lines = [];
          if (this.runtimeHelpers.has("fileConstant")) {
            if (lines.length) lines.push("");
            lines.push("const __FILE__ = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && typeof globalThis.__FILE__ !== "undefined") {');
            lines.push("    return globalThis.__FILE__;");
            lines.push("  }");
            lines.push('  if (typeof __rubySourceFile !== "undefined") return __rubySourceFile;');
            lines.push('  return "unknown.rb";');
            lines.push("})();");
            lines.push('if (typeof globalThis !== "undefined") { globalThis.__FILE__ = __FILE__; }');
          }
          if (this.runtimeHelpers.has("bindingHelper")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyBinding = () => ({ locals: {} });");
          }
          if (this.runtimeHelpers.has("print")) {
            lines.push("const __rubyPrint = (...chunks) => {");
            lines.push('  const text = chunks.map(chunk => String(chunk ?? "")).join("");');
            lines.push('  if (typeof process !== "undefined" && process.stdout && process.stdout.write) {');
            lines.push("    process.stdout.write(text);");
            lines.push('  } else if (typeof console !== "undefined" && console.log) {');
            lines.push("    console.log(text);");
            lines.push("  }");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("gets")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyGets = (...promptParts) => {");
            lines.push('  const message = promptParts.length ? promptParts.map(part => String(part ?? "")).join("") : "";');
            lines.push('  if (typeof prompt === "function") {');
            lines.push("    const result = prompt(message);");
            lines.push('    return result == null ? "" : result;');
            lines.push("  }");
            lines.push('  console.warn("gets() is not supported in this environment.");');
            lines.push('  return "";');
            lines.push("};");
          }
          if (this.runtimeHelpers.has("putsGlobal")) {
            if (lines.length) lines.push("");
            lines.push('if (typeof globalThis !== "undefined" && !globalThis.puts) {');
            lines.push("  globalThis.puts = (...values) => {");
            lines.push('    if (typeof console !== "undefined" && console.log) {');
            lines.push("      console.log(...values);");
            lines.push("    }");
            lines.push("  };");
            lines.push("}");
          }
          if (this.runtimeHelpers.has("className")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyClassName = (value) => {");
            lines.push('  if (value === null || value === undefined) return "NilClass";');
            const typeLogic = [
              '  if (value === true) return "TrueClass";',
              '  if (value === false) return "FalseClass";',
              '  if (typeof value === "string") return "String";',
              '  if (typeof value === "symbol") return "Symbol";',
              '  if (typeof value === "number") return Number.isFinite(value) && Number.isInteger(value) ? "Integer" : "Float";',
              '  if (typeof value === "bigint") return "Integer";',
              '  if (Array.isArray(value)) return "Array";',
              '  if (value instanceof Map) return "Hash";',
              '  if (value instanceof Set) return "Set";',
              '  if (typeof value === "function") return "Proc";',
              '  if (typeof value === "object") {',
              "    const proto = Object.getPrototypeOf(value);",
              '    if (!proto || proto === Object.prototype) return "Hash";',
              '    if (value.constructor && typeof value.constructor.name === "string" && value.constructor.name.length) {',
              "      return value.constructor.name;",
              "    }",
              '    return "Object";',
              "  }",
              "  return typeof value;"
            ];
            lines.push(...typeLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("ivarName")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyIvarName = (name) => {");
            lines.push('  const str = String(name ?? "");');
            lines.push('  const clean = str.startsWith("@") ? str.slice(1) : str;');
            lines.push('  return "__" + clean;');
            lines.push("};");
          }
          if (this.runtimeHelpers.has("strip")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyStrip = (value) => String(value ?? "").trim();');
          }
          if (this.runtimeHelpers.has("split")) {
            if (lines.length) lines.push("");
            lines.push('const __rubySplit = (value) => String(value ?? "").split(/\\s+/);');
          }
          if (this.runtimeHelpers.has("reverseString")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyReverse = (value) => String(value ?? "").split("").reverse().join("");');
          }
          if (this.runtimeHelpers.has("capitalize")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyCapitalize = (value) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push("  if (!str.length) return str;");
            lines.push("  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("upcase")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyUpcase = (value) => String(value ?? "").toUpperCase();');
          }
          if (this.runtimeHelpers.has("downcase")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyDowncase = (value) => String(value ?? "").toLowerCase();');
          }
          if (this.runtimeHelpers.has("swapcase")) {
            if (lines.length) lines.push("");
            lines.push("const __rubySwapcase = (value) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push('  let result = "";');
            lines.push("  for (let index = 0; index < str.length; index += 1) {");
            lines.push("    const ch = str[index];");
            lines.push("    const upper = ch.toUpperCase();");
            lines.push("    const lower = ch.toLowerCase();");
            lines.push("    if (ch === upper && ch !== lower) {");
            lines.push("      result += lower;");
            lines.push("    } else if (ch === lower && ch !== upper) {");
            lines.push("      result += upper;");
            lines.push("    } else {");
            lines.push("      result += ch;");
            lines.push("    }");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("capitalizeBang")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyCapitalizeBang = (value) => __rubyCapitalize(value);");
          }
          if (this.runtimeHelpers.has("reverseBang")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyReverseBang = (value) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push('  return str.split("").reverse().join("");');
            lines.push("};");
          }
          if (this.runtimeHelpers.has("upcaseBang")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyUpcaseBang = (value) => String(value ?? "").toUpperCase();');
          }
          if (this.runtimeHelpers.has("downcaseBang")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyDowncaseBang = (value) => String(value ?? "").toLowerCase();');
          }
          if (this.runtimeHelpers.has("stripBang")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyStripBang = (value) => __rubyStrip(value);");
          }
          if (this.runtimeHelpers.has("swapcaseBang")) {
            if (lines.length) lines.push("");
            lines.push("const __rubySwapcaseBang = (value) => __rubySwapcase(value);");
          }
          if (this.runtimeHelpers.has("ljust")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyLjust = (value, width, padding) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push("  const target = Number(width);");
            lines.push("  if (!Number.isFinite(target) || target <= str.length) return str;");
            lines.push('  const pad = padding === undefined ? " " : String(padding);');
            lines.push("  if (!pad.length) return str;");
            lines.push("  let result = str;");
            lines.push("  while (result.length < target) {");
            lines.push("    const remaining = target - result.length;");
            lines.push("    result += pad.repeat(Math.ceil(remaining / pad.length)).slice(0, remaining);");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("rjust")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyRjust = (value, width, padding) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push("  const target = Number(width);");
            lines.push("  if (!Number.isFinite(target) || target <= str.length) return str;");
            lines.push('  const pad = padding === undefined ? " " : String(padding);');
            lines.push("  if (!pad.length) return str;");
            lines.push("  let result = str;");
            lines.push("  while (result.length < target) {");
            lines.push("    const remaining = target - result.length;");
            lines.push("    const chunk = pad.repeat(Math.ceil(remaining / pad.length)).slice(0, remaining);");
            lines.push("    result = chunk + result;");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("chars")) {
            if (lines.length) lines.push("");
            lines.push('const __rubyChars = (value) => Array.from(String(value ?? ""));');
          }
          if (this.runtimeHelpers.has("gsub")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyGsub = (value, pattern, replacement, block) => {");
            lines.push('  const source = String(value ?? "");');
            lines.push("  const buildRegex = (input) => {");
            const gsubLogic = [
              "    if (input instanceof RegExp) {",
              '      const flags = input.flags.includes("g") ? input.flags : input.flags + "g";',
              "      return new RegExp(input.source, flags);",
              "    }",
              '    const escaped = String(input ?? "").replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");',
              '    return new RegExp(escaped, "g");'
            ];
            lines.push(...gsubLogic);
            lines.push("  };");
            lines.push("  const regex = buildRegex(pattern);");
            lines.push('  if (typeof block === "function") {');
            lines.push("    return source.replace(regex, (...matchParts) => {");
            lines.push("      const captures = matchParts.slice(0, -2);");
            lines.push("      return block(...captures);");
            lines.push("    });");
            lines.push("  }");
            lines.push('  const replacementValue = replacement === undefined ? "" : String(replacement);');
            lines.push("  return source.replace(regex, replacementValue);");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("collectionInclude")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyCollectionInclude = (collection, item) => {");
            lines.push("  if (Array.isArray(collection)) {");
            lines.push("    for (let index = 0; index < collection.length; index += 1) {");
            lines.push("      if (collection[index] === item) return true;");
            lines.push("    }");
            lines.push("    return false;");
            lines.push("  }");
            lines.push("  if (collection == null) return false;");
            lines.push("  const str = String(collection);");
            lines.push("  return str.includes(String(item));");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("minus")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyMinus = (left, right) => {");
            lines.push("  if (Array.isArray(left)) {");
            lines.push("    const rightValues = Array.isArray(right) ? right : [right];");
            lines.push("    return left.filter((item) => rightValues.every((other) => other !== item));");
            lines.push("  }");
            lines.push("  const leftNumber = Number(left);");
            lines.push("  const rightNumber = Number(right);");
            lines.push("  if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {");
            lines.push("    return leftNumber - rightNumber;");
            lines.push("  }");
            lines.push("  return left - right;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("times")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyTimes = (value, block) => {");
            lines.push("  const numeric = Number(value);");
            const timesLogic = [
              "  const count = Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;",
              '  if (typeof block !== "function") {',
              "    return Array.from({ length: count }, (_, index) => index);",
              "  }",
              "  for (let index = 0; index < count; index += 1) {",
              "    block(index);",
              "  }",
              "  return value;"
            ];
            lines.push(...timesLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("upto")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyUpto = (value, limit, block) => {");
            const uptoLogic = [
              "  const start = Number(value);",
              "  const end = Number(limit);",
              "  if (!Number.isFinite(start) || !Number.isFinite(end)) {",
              '    return typeof block === "function" ? value : [];',
              "  }",
              "  const from = Math.floor(start);",
              "  const to = Math.floor(end);",
              '  if (typeof block !== "function") {',
              "    const result = [];",
              "    for (let current = from; current <= to; current += 1) {",
              "      result.push(current);",
              "    }",
              "    return result;",
              "  }",
              "  for (let current = from; current <= to; current += 1) {",
              "    block(current);",
              "  }",
              "  return value;"
            ];
            lines.push(...uptoLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("downto")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyDownto = (value, limit, block) => {");
            const downtoLogic = [
              "  const start = Number(value);",
              "  const end = Number(limit);",
              "  if (!Number.isFinite(start) || !Number.isFinite(end)) {",
              '    return typeof block === "function" ? value : [];',
              "  }",
              "  const from = Math.floor(start);",
              "  const to = Math.floor(end);",
              '  if (typeof block !== "function") {',
              "    const result = [];",
              "    for (let current = from; current >= to; current -= 1) {",
              "      result.push(current);",
              "    }",
              "    return result;",
              "  }",
              "  for (let current = from; current >= to; current -= 1) {",
              "    block(current);",
              "  }",
              "  return value;"
            ];
            lines.push(...downtoLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayPush")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyArrayPush = (target, ...values) => {");
            lines.push("  if (Array.isArray(target)) {");
            lines.push("    target.push(...values);");
            lines.push("    return target;");
            lines.push("  }");
            lines.push('  if (target && typeof target.push === "function") {');
            lines.push("    target.push(...values);");
            lines.push("    return target;");
            lines.push("  }");
            lines.push("  return target;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayReject")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyReject = (collection, block) => {");
            lines.push("  if (!Array.isArray(collection)) return [];");
            lines.push('  if (typeof block !== "function") return collection.slice();');
            lines.push("  const result = [];");
            lines.push("  for (let index = 0; index < collection.length; index += 1) {");
            lines.push("    if (!block(collection[index], index)) {");
            lines.push("      result.push(collection[index]);");
            lines.push("    }");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayShuffle")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyShuffle = (collection) => {");
            lines.push("  if (!Array.isArray(collection)) return [];");
            lines.push("  const result = collection.slice();");
            lines.push("  for (let index = result.length - 1; index > 0; index -= 1) {");
            lines.push("    const swapIndex = Math.floor(Math.random() * (index + 1));");
            lines.push("    const temp = result[index];");
            lines.push("    result[index] = result[swapIndex];");
            lines.push("    result[swapIndex] = temp;");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayUniq")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyUniq = (collection) => {");
            lines.push("  if (!Array.isArray(collection)) return [];");
            lines.push("  const seen = new Set();");
            lines.push("  const result = [];");
            lines.push("  for (let index = 0; index < collection.length; index += 1) {");
            lines.push("    const value = collection[index];");
            lines.push("    if (seen.has(value)) continue;");
            lines.push("    seen.add(value);");
            lines.push("    result.push(value);");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arraySample")) {
            if (lines.length) lines.push("");
            lines.push("const __rubySample = (collection, count) => {");
            lines.push("  if (!Array.isArray(collection) || collection.length === 0) {");
            lines.push("    return count === undefined ? undefined : [];");
            lines.push("  }");
            lines.push("  if (count === undefined) {");
            lines.push("    const index = Math.floor(Math.random() * collection.length);");
            lines.push("    return collection[index];");
            lines.push("  }");
            lines.push("  const total = Number(count);");
            lines.push("  if (!Number.isFinite(total) || total <= 0) return [];");
            lines.push("  const pool = collection.slice();");
            lines.push("  const result = [];");
            lines.push("  const max = Math.min(pool.length, Math.floor(total));");
            lines.push("  for (let index = 0; index < max; index += 1) {");
            lines.push("    const pick = Math.floor(Math.random() * pool.length);");
            lines.push("    const [value] = pool.splice(pick, 1);");
            lines.push("    result.push(value);");
            lines.push("  }");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayFirst")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyFirst = (collection, count) => {");
            lines.push("  if (!Array.isArray(collection)) return count === undefined ? undefined : [];");
            lines.push("  if (count === undefined) return collection[0];");
            lines.push("  const total = Number(count);");
            lines.push("  if (!Number.isFinite(total) || total <= 0) return [];");
            lines.push("  return collection.slice(0, Math.floor(total));");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("arrayLast")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyLast = (collection, count) => {");
            lines.push("  if (!Array.isArray(collection)) return count === undefined ? undefined : [];");
            lines.push("  if (count === undefined) return collection.length ? collection[collection.length - 1] : undefined;");
            lines.push("  const total = Number(count);");
            lines.push("  if (!Number.isFinite(total) || total <= 0) return [];");
            lines.push("  const size = Math.floor(total);");
            lines.push("  if (!collection.length) return [];");
            lines.push("  const start = Math.max(0, collection.length - size);");
            lines.push("  return collection.slice(start);");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("symbolProc")) {
            if (lines.length) lines.push("");
            lines.push("const __rubySymbolProc = (name) => {");
            lines.push("  switch (name) {");
            lines.push('    case "capitalize":');
            lines.push("      return (value) => __rubyCapitalize(value);");
            lines.push('    case "swapcase":');
            lines.push("      return (value) => __rubySwapcase(value);");
            lines.push('    case "upcase":');
            lines.push('      return (value) => String(value ?? "").toUpperCase();');
            lines.push('    case "downcase":');
            lines.push('      return (value) => String(value ?? "").toLowerCase();');
            lines.push('    case "reverse":');
            lines.push('      return (value) => String(value ?? "").split("").reverse().join("");');
            lines.push("    default:");
            lines.push("      return (value, ...rest) => {");
            lines.push("        if (value == null) return value;");
            lines.push("        const method = value[name];");
            lines.push('        return typeof method === "function" ? method.apply(value, rest) : value;');
            lines.push("      };");
            lines.push("  }");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("lazy")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyLazy = (value) => {");
            lines.push('  if (value && typeof value === "object" && value.__isRubyLazy) return value;');
            lines.push("  if (Array.isArray(value)) {");
            lines.push("    const base = value.slice();");
            lines.push("    const wrapper = {");
            lines.push("      __isRubyLazy: true,");
            lines.push("      __target: base,");
            lines.push("      select(block) {");
            lines.push('        const fn = typeof block === "function" ? block : (item) => item;');
            lines.push("        const result = base.filter((item, index) => fn(item, index));");
            lines.push("        return __rubyLazy(result);");
            lines.push("      },");
            lines.push("      map(block) {");
            lines.push('        const fn = typeof block === "function" ? block : (item) => item;');
            lines.push("        return __rubyLazy(base.map((item, index) => fn(item, index)));");
            lines.push("      },");
            lines.push("      to_a() {");
            lines.push("        return base.slice();");
            lines.push("      },");
            lines.push("      first() {");
            lines.push("        return base[0];");
            lines.push("      },");
            lines.push("      forEach(...args) {");
            lines.push("        return base.forEach(...args);");
            lines.push("      }");
            lines.push("    };");
            lines.push("    wrapper.filter = wrapper.select;");
            lines.push("    wrapper[Symbol.iterator] = function() {");
            lines.push("      return base[Symbol.iterator]();");
            lines.push("    };");
            lines.push("    return wrapper;");
            lines.push("  }");
            lines.push("  return value;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("range")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyRange = (start, end, exclusive = false) => {");
            lines.push("  const coerceNumber = (value) => {");
            lines.push('    if (typeof value === "number") return value;');
            lines.push('    if (typeof value === "bigint") return Number(value);');
            const coerceLogic = [
              "    const parsed = Number(value);",
              "    return Number.isNaN(parsed) ? null : parsed;"
            ];
            lines.push(...coerceLogic);
            lines.push("  };");
            lines.push("  const fromNumber = coerceNumber(start);");
            lines.push("  const toNumber = coerceNumber(end);");
            lines.push("  const numeric = fromNumber !== null && toNumber !== null;");
            lines.push("  const ascending = !numeric ? true : fromNumber <= toNumber;");
            lines.push("  const buildNumeric = (stepValue) => {");
            const buildNumericLogic = [
              "    const step = stepValue === undefined ? (ascending ? 1 : -1) : Number(stepValue);",
              "    if (!Number.isFinite(step) || step === 0) return [];",
              "    if (ascending && step < 0) return [];",
              "    if (!ascending && step > 0) return [];",
              "    const limit = (value) => {",
              "      if (ascending) {",
              "        return exclusive ? value < toNumber : value <= toNumber;",
              "      }",
              "      return exclusive ? value > toNumber : value >= toNumber;",
              "    };",
              "    const values = [];",
              "    for (let current = fromNumber; limit(current); current += step) {",
              "      values.push(current);",
              "      if (current === toNumber) break;",
              "    }",
              "    return values;"
            ];
            lines.push(...buildNumericLogic);
            lines.push("  };");
            lines.push("  const buildFallback = () => {");
            lines.push("    const values = [start];");
            lines.push("    if (!exclusive || start !== end) values.push(end);");
            lines.push("    return values;");
            lines.push("  };");
            lines.push("  const buildValues = (stepValue) => numeric ? buildNumeric(stepValue) : buildFallback();");
            lines.push("  const range = {");
            lines.push("    to_a() {");
            lines.push("      return buildValues();");
            lines.push("    },");
            lines.push("    each(block) {");
            lines.push("      const values = buildValues();");
            lines.push('      if (typeof block !== "function") return values;');
            lines.push("      for (let index = 0; index < values.length; index += 1) {");
            lines.push("        block(values[index]);");
            lines.push("      }");
            lines.push("      return range;");
            lines.push("    },");
            lines.push("    step(stepValue, block) {");
            lines.push("      let stepAmount = stepValue;");
            lines.push("      let fn = block;");
            lines.push('      if (typeof block !== "function" && typeof stepValue === "function") {');
            lines.push("        fn = stepValue;");
            lines.push("        stepAmount = undefined;");
            lines.push("      }");
            lines.push("      const values = buildValues(stepAmount);");
            lines.push('      if (typeof fn !== "function") return values;');
            lines.push("      for (let index = 0; index < values.length; index += 1) {");
            lines.push("        fn(values[index]);");
            lines.push("      }");
            lines.push("      return range;");
            lines.push("    }");
            lines.push("  };");
            lines.push("  range[Symbol.iterator] = function* () {");
            lines.push("    const values = buildValues();");
            lines.push("    for (let index = 0; index < values.length; index += 1) {");
            lines.push("      yield values[index];");
            lines.push("    }");
            lines.push("  };");
            lines.push("  return range;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("fetch")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyFetch = (collection, key, fallback) => {");
            lines.push("  if (Array.isArray(collection)) {");
            lines.push("    const index = Number(key);");
            lines.push("    if (Number.isInteger(index) && index >= 0 && index < collection.length) {");
            lines.push("      return collection[index];");
            lines.push("    }");
            lines.push('  } else if (collection && typeof collection === "object") {');
            lines.push("    const prop = String(key);");
            lines.push("    if (prop in collection) {");
            lines.push("      return collection[prop];");
            lines.push("    }");
            lines.push("  }");
            lines.push("  if (fallback !== undefined) {");
            lines.push('    return typeof fallback === "function" ? fallback() : fallback;');
            lines.push("  }");
            lines.push('  throw new Error("KeyError");');
            lines.push("};");
          }
          if (this.runtimeHelpers.has("match")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyMatch = (value, pattern) => {");
            const logic = [
              "  let input = value;",
              "  let regex = pattern;",
              '  if (value instanceof RegExp || (value && typeof value === "object" && typeof value.exec === "function")) {',
              "    regex = value;",
              "    input = pattern;",
              "  }",
              '  const normalizedInput = String(input ?? "");',
              "  const normalizedRegex = regex instanceof RegExp ? regex : new RegExp(String(regex));",
              "  const result = normalizedInput.match(normalizedRegex);",
              "  if (!result) return null;",
              "  const wrapper = {",
              "    captures: () => result.slice(1)",
              "  };",
              "  result.slice(1).forEach((value, index) => { wrapper[index] = value; });",
              '  if (result.groups && typeof result.groups === "object") {',
              "    for (const [key, value] of Object.entries(result.groups)) {",
              "      wrapper[key] = value;",
              "    }",
              "  }",
              "  return wrapper;"
            ];
            lines.push(...logic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("publicSend")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyPublicSend = (receiver, methodName, ...args) => {");
            lines.push("  if (receiver == null) return undefined;");
            lines.push("  const fn = receiver[methodName];");
            lines.push('  if (typeof fn === "function") {');
            lines.push("    return fn.apply(receiver, args);");
            lines.push("  }");
            lines.push('  if (typeof methodName === "string") {');
            lines.push("    const rhs = args[0];");
            lines.push("    switch (methodName) {");
            lines.push('      case ">": return receiver > rhs;');
            lines.push('      case ">=": return receiver >= rhs;');
            lines.push('      case "<": return receiver < rhs;');
            lines.push('      case "<=": return receiver <= rhs;');
            lines.push('      case "==": return receiver === rhs;');
            lines.push('      case "!=": return receiver !== rhs;');
            lines.push('      case "===": return receiver === rhs;');
            lines.push('      case "!==": return receiver !== rhs;');
            lines.push("      default: break;");
            lines.push("    }");
            lines.push("  }");
            lines.push("  return receiver[methodName];");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("send")) {
            if (lines.length) lines.push("");
            lines.push("const __rubySend = (receiver, methodName, args = [], block) => {");
            lines.push("  if (receiver == null) return undefined;");
            const helperLogic = [
              "  const fn = receiver[methodName];",
              '  if (typeof fn === "function") {',
              "    const callArgs = block === undefined ? args : [...args, block];",
              "    return fn.apply(receiver, callArgs);",
              "  }",
              '  if (typeof methodName === "string") {',
              '    if (methodName === "tap") {',
              '      if (typeof block === "function") {',
              '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
              '        try { block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
              "      }",
              "      return receiver;",
              "    }",
              '    if (methodName === "then" || methodName === "yield_self") {',
              '      if (typeof block === "function") {',
              '        const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
              '        try { return block.call(receiver, receiver); } finally { if (typeof restore === "function") restore(); }',
              "      }",
              "      return receiver;",
              "    }",
              '    if (methodName === "catch") {',
              "      const tag = args[0];",
              '      if (typeof block !== "function") return undefined;',
              '      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(receiver) : null;',
              "      try {",
              "        return block.call(receiver);",
              "      } catch (error) {",
              "        if (error && error.__rubyThrowTag !== undefined) {",
              "          if (tag === undefined || tag === error.__rubyThrowTag || String(tag) === String(error.__rubyThrowTag)) {",
              "            return error.__rubyThrowValue;",
              "          }",
              "        }",
              "        throw error;",
              "      } finally {",
              '        if (typeof restore === "function") restore();',
              "      }",
              "    }",
              '    if (methodName === "throw") {',
              "      const tag = args[0];",
              "      const value = args.length > 1 ? args[1] : undefined;",
              '      const error = new Error("throw");',
              "      error.__rubyThrowTag = tag;",
              "      error.__rubyThrowValue = value;",
              "      throw error;",
              "    }",
              "  }",
              "  const missing = receiver.method_missing;",
              '  if (typeof missing === "function") {',
              "    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];",
              "    return missing.apply(receiver, missingArgs);",
              "  }",
              "  throw new Error(`NoMethodError: undefined method ${methodName}`);"
            ];
            lines.push(...helperLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("thread")) {
            if (lines.length) lines.push("");
            lines.push("const Thread = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && globalThis.Thread) return globalThis.Thread;');
            lines.push("  class Thread {");
            lines.push("    constructor(block) {");
            lines.push("      this.value = undefined;");
            lines.push("      Thread.__stack.push(this);");
            lines.push("      try {");
            lines.push('        if (typeof block === "function") {');
            lines.push('          const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(this) : null;');
            lines.push("          try {");
            lines.push("            this.value = block();");
            lines.push("          } finally {");
            lines.push('            if (typeof restore === "function") restore();');
            lines.push("          }");
            lines.push("        }");
            lines.push("      } finally {");
            lines.push("        Thread.__stack.pop();");
            lines.push("      }");
            lines.push("    }");
            lines.push("    static current() {");
            lines.push("      const stack = Thread.__stack;");
            lines.push("      return stack[stack.length - 1] || Thread.__root;");
            lines.push("    }");
            lines.push("  }");
            lines.push("  Thread.__root = {};");
            lines.push("  Thread.__stack = [Thread.__root];");
            lines.push('  if (typeof globalThis !== "undefined") globalThis.Thread = Thread;');
            lines.push("  return Thread;");
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("fiber")) {
            if (lines.length) lines.push("");
            lines.push("const Fiber = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && globalThis.Fiber) return globalThis.Fiber;');
            lines.push("  class Fiber {");
            lines.push("    constructor(block) {");
            lines.push("      this.value = undefined;");
            lines.push('      this.block = typeof block === "function" ? block : null;');
            lines.push("      if (this.block) {");
            lines.push('        const restore = typeof this.block.__rubyBind === "function" ? this.block.__rubyBind(this) : null;');
            lines.push("        try {");
            lines.push("          this.value = this.block();");
            lines.push("        } finally {");
            lines.push('          if (typeof restore === "function") restore();');
            lines.push("        }");
            lines.push("      }");
            lines.push("    }");
            lines.push("    static yield() {");
            lines.push("      return (value) => value;");
            lines.push("    }");
            lines.push("  }");
            lines.push('  if (typeof globalThis !== "undefined") globalThis.Fiber = Fiber;');
            lines.push("  return Fiber;");
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("enumerator")) {
            if (lines.length) lines.push("");
            lines.push("const Enumerator = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && globalThis.Enumerator) return globalThis.Enumerator;');
            lines.push("  class Enumerator {");
            lines.push("    constructor(block) {");
            lines.push("      this.__values = [];");
            lines.push('      this.__builder = typeof block === "function" ? block : null;');
            lines.push("      if (this.__builder) {");
            lines.push('        const restore = typeof this.__builder.__rubyBind === "function" ? this.__builder.__rubyBind(this) : null;');
            lines.push("        const yielder = {");
            lines.push("          push: (value) => {");
            lines.push("            this.__values.push(value);");
            lines.push("            return value;");
            lines.push("          }");
            lines.push("        };");
            lines.push("        try {");
            lines.push("          this.__builder(yielder);");
            lines.push("        } finally {");
            lines.push('          if (typeof restore === "function") restore();');
            lines.push("        }");
            lines.push("      }");
            lines.push("    }");
            lines.push("    each(block) {");
            lines.push('      if (typeof block === "function") {');
            lines.push("        for (const value of this.__values) {");
            lines.push('          const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(this) : null;');
            lines.push('          try { block.call(this, value); } finally { if (typeof restore === "function") restore(); }');
            lines.push("        }");
            lines.push("      }");
            lines.push("      return this;");
            lines.push("    }");
            lines.push("    toArray() {");
            lines.push("      return this.__values.slice();");
            lines.push("    }");
            lines.push("    [Symbol.iterator]() {");
            lines.push("      return this.__values[Symbol.iterator]();");
            lines.push("    }");
            lines.push("  }");
            lines.push('  if (typeof globalThis !== "undefined") globalThis.Enumerator = Enumerator;');
            lines.push("  return Enumerator;");
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("file")) {
            if (lines.length) lines.push("");
            lines.push("const File = (() => {");
            lines.push('  const existing = typeof globalThis !== "undefined" ? globalThis.File : undefined;');
            lines.push('  if (existing && typeof existing.open === "function") return existing;');
            const fileLines = [
              '  const File = existing && typeof existing === "object" ? existing : {};',
              "  File.open = (path, mode, block) => {",
              "    const fileObject = {",
              '      gets: () => ""',
              "    };",
              '    if (typeof block === "function") {',
              '      const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(fileObject) : null;',
              "      try {",
              "        return block.call(fileObject, fileObject);",
              "      } finally {",
              '        if (typeof restore === "function") restore();',
              "      }",
              "    }",
              "    return fileObject;",
              "  };",
              '  if (typeof globalThis !== "undefined") globalThis.File = File;',
              "  return File;"
            ];
            lines.push(...fileLines);
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("struct")) {
            if (lines.length) lines.push("");
            lines.push("const Struct = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && globalThis.Struct) return globalThis.Struct;');
            lines.push("  class Struct {");
            lines.push("    constructor(...members) {");
            lines.push("      const names = members.map(member => {");
            lines.push('        const stringName = typeof member === "string" ? member : String(member);');
            lines.push('        return stringName.startsWith(":") ? stringName.slice(1) : stringName;');
            lines.push("      });");
            lines.push("      return class {");
            lines.push("        constructor(...values) {");
            lines.push("          names.forEach((name, index) => {");
            lines.push("            this[name] = values[index];");
            lines.push("          });");
            lines.push("        }");
            lines.push("      };");
            lines.push("    }");
            lines.push("  }");
            lines.push('  if (typeof globalThis !== "undefined") globalThis.Struct = Struct;');
            lines.push("  return Struct;");
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("tracePoint")) {
            if (lines.length) lines.push("");
            lines.push("const TracePoint = (() => {");
            lines.push('  if (typeof globalThis !== "undefined" && globalThis.TracePoint) return globalThis.TracePoint;');
            lines.push("  class TracePoint {");
            lines.push("    constructor(eventName, block) {");
            lines.push("      this.eventName = eventName;");
            lines.push('      this.block = typeof block === "function" ? block : null;');
            lines.push("    }");
            lines.push("    enable(block) {");
            lines.push('      const fn = typeof block === "function" ? block : this.block;');
            lines.push('      if (typeof fn === "function") {');
            lines.push('        const restore = typeof fn.__rubyBind === "function" ? fn.__rubyBind(this) : null;');
            lines.push("        try {");
            lines.push("          return fn.call(this, this);");
            lines.push("        } finally {");
            lines.push('          if (typeof restore === "function") restore();');
            lines.push("        }");
            lines.push("      }");
            lines.push("      return this;");
            lines.push("    }");
            lines.push("  }");
            lines.push('  if (typeof globalThis !== "undefined") globalThis.TracePoint = TracePoint;');
            lines.push("  return TracePoint;");
            lines.push("})();");
          }
          if (this.runtimeHelpers.has("instanceEval")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyInstanceEval = (receiver, block) => {");
            lines.push('  if (typeof block !== "function") return undefined;');
            const evalLogic = [
              "  const target = receiver !== undefined ? receiver : undefined;",
              '  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;',
              "  try {",
              "    return block.call(target);",
              "  } finally {",
              '    if (typeof restore === "function") restore();',
              "  }"
            ];
            lines.push(...evalLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("instanceExec")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyInstanceExec = (receiver, args, block) => {");
            lines.push('  if (typeof block !== "function") return undefined;');
            const execLogic = [
              "  const target = receiver !== undefined ? receiver : undefined;",
              "  const argList = Array.isArray(args) ? args : [];",
              '  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;',
              "  try {",
              "    return block.apply(target, argList);",
              "  } finally {",
              '    if (typeof restore === "function") restore();',
              "  }"
            ];
            lines.push(...execLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("multiAssign")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyMultiAssign = (value, count) => {");
            lines.push("  if (value == null) {");
            lines.push("    return Array.from({ length: count }, () => undefined);");
            lines.push("  }");
            lines.push("  if (Array.isArray(value)) {");
            lines.push("    const result = value.slice(0, count);");
            lines.push("    while (result.length < count) result.push(undefined);");
            lines.push("    return result;");
            lines.push("  }");
            lines.push("  const result = [value];");
            lines.push("  while (result.length < count) result.push(undefined);");
            lines.push("  return result;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("chomp")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyChomp = (value) => {");
            lines.push('  const str = String(value ?? "");');
            lines.push('  if (str.endsWith("\\r\\n")) return str.slice(0, -2);');
            lines.push('  if (str.endsWith("\\n")) return str.slice(0, -1);');
            lines.push('  if (str.endsWith("\\r")) return str.slice(0, -1);');
            lines.push("  return str;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("toInteger")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyToInteger = (value) => {");
            lines.push('  const str = String(value ?? "").trimStart();');
            lines.push("  const match = str.match(/^[+-]?\\d+/);");
            lines.push("  if (!match) return 0;");
            lines.push("  const parsed = parseInt(match[0], 10);");
            lines.push("  return Number.isNaN(parsed) ? 0 : parsed;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("toFloat")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyToFloat = (value) => {");
            lines.push('  const num = parseFloat(String(value ?? ""));');
            lines.push("  return Number.isNaN(num) ? 0 : num;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("strftime")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyStrftime = (format) => {");
            lines.push("  const date = new Date();");
            lines.push("  const replacements = {");
            lines.push('    "%Y": String(date.getFullYear()),');
            lines.push('    "%m": String(date.getMonth() + 1).padStart(2, "0"),');
            lines.push('    "%d": String(date.getDate()).padStart(2, "0")');
            lines.push("  };");
            lines.push('  return String(format ?? "").replace(/%[Ymd]/g, (match) => replacements[match] ?? match);');
            lines.push("};");
          }
          if (this.runtimeHelpers.has("rescueMatch")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyRescueMatch = (error, matchers) => {");
            lines.push("  if (!matchers || matchers.length === 0) return true;");
            lines.push("  for (const matcher of matchers) {");
            lines.push("    if (matcher == null) continue;");
            lines.push('    if (typeof matcher === "function") {');
            lines.push("      if (error instanceof matcher) return true;");
            lines.push("      continue;");
            lines.push("    }");
            lines.push('    if (typeof matcher === "string") {');
            lines.push("      if (error && error.name === matcher) return true;");
            lines.push("      continue;");
            lines.push("    }");
            lines.push('    if (typeof matcher === "object" && typeof matcher.test === "function") {');
            lines.push("      if (matcher.test(error)) return true;");
            lines.push("      continue;");
            lines.push("    }");
            lines.push("    if (matcher === error) return true;");
            lines.push("    if (String(matcher) === (error && error.name)) return true;");
            lines.push("  }");
            lines.push("  return false;");
            lines.push("};");
          }
          if (this.runtimeHelpers.has("includeMixin")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyInclude = (klass, mixin) => {");
            lines.push("  if (!klass || !mixin) return klass;");
            const includeLogic = [
              "  const target = klass && klass.prototype ? klass.prototype : klass;",
              "  const descriptors = Object.getOwnPropertyDescriptors(mixin);",
              "  for (const key of Reflect.ownKeys(descriptors)) {",
              '    if (key === "constructor") continue;',
              "    Object.defineProperty(target, key, descriptors[key]);",
              "  }",
              "  return klass;"
            ];
            lines.push(...includeLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("extendMixin")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyExtend = (klass, mixin) => {");
            lines.push("  if (!klass || !mixin) return klass;");
            const extendLogic = [
              "  const descriptors = Object.getOwnPropertyDescriptors(mixin);",
              "  for (const key of Reflect.ownKeys(descriptors)) {",
              '    if (key === "constructor") continue;',
              "    Object.defineProperty(klass, key, descriptors[key]);",
              "  }",
              "  return klass;"
            ];
            lines.push(...extendLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("prependMixin")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyPrepend = (klass, mixin) => {");
            lines.push("  if (!klass || !mixin) return klass;");
            const prependLogic = [
              "  const target = klass && klass.prototype ? klass.prototype : klass;",
              "  const descriptors = Object.getOwnPropertyDescriptors(mixin);",
              "  for (const key of Reflect.ownKeys(descriptors)) {",
              '    if (key === "constructor") continue;',
              "    Object.defineProperty(target, key, descriptors[key]);",
              "  }",
              "  return klass;"
            ];
            lines.push(...prependLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("defineSingleton")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyDefineSingleton = (target, name, fn) => {");
            lines.push("  if (target == null) return undefined;");
            lines.push('  const key = name == null ? undefined : (typeof name === "symbol" ? name : String(name));');
            const defineLogic = [
              "  if (key === undefined) return undefined;",
              "  const assignKey = key;",
              '  const callable = typeof fn === "function" ? fn : (() => fn);',
              "  target[assignKey] = callable;",
              "  return callable;"
            ];
            lines.push(...defineLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("ensureError")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyEnsureError = (name) => {");
            const ensureLogic = [
              '  const errorName = typeof name === "string" ? name : String(name ?? "Error");',
              '  if (typeof globalThis !== "undefined") {',
              "    const existing = globalThis[errorName];",
              '    if (typeof existing === "function") return existing;',
              "    const ctor = class extends Error {",
              "      constructor(message) {",
              "        super(message);",
              "        this.name = errorName;",
              "      }",
              "    };",
              '    Object.defineProperty(ctor, "name", { value: errorName });',
              "    globalThis[errorName] = ctor;",
              "    return ctor;",
              "  }",
              "  return Error;"
            ];
            lines.push(...ensureLogic);
            lines.push("};");
          }
          if (this.runtimeHelpers.has("raise")) {
            if (lines.length) lines.push("");
            lines.push("const __rubyRaise = (...args) => {");
            const raiseLogic = [
              '  if (!args.length) { throw new Error("RuntimeError"); }',
              "  const first = args[0];",
              "  if (first instanceof Error) { throw first; }",
              '  if (typeof first === "function") {',
              "    const message = args[1] !== undefined ? args[1] : undefined;",
              "    throw new first(message);",
              "  }",
              '  if (typeof first === "string") {',
              "    throw new Error(first);",
              "  }",
              '  if (first && typeof first === "object" && first.message !== undefined) {',
              "    throw first;",
              "  }",
              "  throw new Error(String(first));"
            ];
            lines.push(...raiseLogic);
            lines.push("};");
          }
          return lines;
        }
        emitStatement(node, context = {}) {
          switch (node.type) {
            case "ExpressionStatement":
              return this.emitExpressionStatement(node, context);
            case "MethodDefinition":
              return this.emitMethodDefinition(node, context);
            case "ClassDeclaration":
              return this.emitClassDeclaration(node, context);
            case "ModuleDeclaration":
              return this.emitModuleDeclaration(node, context);
            case "IfStatement":
              return this.emitIfStatement(node, context);
            case "WhileStatement":
              return this.emitWhileStatement(node, context);
            case "LoopStatement":
              return this.emitLoopStatement(node, context);
            case "ReturnStatement":
              return this.indent() + this.emitReturnStatement(node, context);
            case "BlockStatement":
              return this.indent() + this.emitBlockStatement(node, context);
            case "CaseStatement":
              return this.emitCaseStatement(node, context);
            case "BreakStatement":
              return this.indent() + "break;";
            case "UsingStatement":
              return this.emitUsingStatement(node, context);
            case "SingletonClassDeclaration":
              return this.emitSingletonClassDeclaration(node, context);
            default:
              throw new Error(`Unsupported statement type: ${node.type}`);
          }
        }
        emitExpressionStatement(node, context = {}) {
          const indent = this.indent();
          const expressionNode = node.expression;
          if (this.isAttrMacroCall(expressionNode)) {
            return this.emitAttrMacro(expressionNode, context);
          }
          if (this.isRequireCall(expressionNode)) {
            return this.emitRequireCall(expressionNode, context);
          }
          if (this.isExtendCall(expressionNode)) {
            return this.emitExtendCall(expressionNode, context);
          }
          if (this.isDefDelegatorsCall(expressionNode, context)) {
            return this.emitDefDelegators(expressionNode, context);
          }
          if (this.isRefineCall(expressionNode)) {
            return this.emitRefineCall(expressionNode, context);
          }
          const normalized = this.normalizeExpressionForStatement(expressionNode, context);
          const expressionCode = this.emitExpression(normalized, { ...context, statement: true });
          if (expressionCode === "") return null;
          if (context.inFunction && context.isTail && context.allowImplicitReturn !== false) {
            return `${indent}return ${expressionCode};`;
          }
          return `${indent}${expressionCode};`;
        }
        normalizeExpressionForStatement(expr, context = {}) {
          if (!expr) return expr;
          if (expr.type === "CallExpression") return expr;
          if (expr.type === "AssignmentExpression") return expr;
          if (expr.type === "Identifier") {
            if (this.isIdentifierDeclared(expr.name, context)) {
              return expr;
            }
            return { type: "CallExpression", callee: expr, arguments: [] };
          }
          if (expr.type === "MemberExpression" || expr.type === "OptionalMemberExpression") {
            return { type: "CallExpression", callee: expr, arguments: [] };
          }
          return expr;
        }
        isAttrMacroCall(expr) {
          if (!expr || expr.type !== "CallExpression") return false;
          if (expr.callee.type !== "Identifier") return false;
          return ["attr_accessor", "attr_reader", "attr_writer"].includes(expr.callee.name);
        }
        emitAttrMacro(expr, context) {
          const indent = this.indent();
          const attributeNames = expr.arguments.map((arg) => this.extractSymbolName(arg) ?? (arg.type === "StringLiteral" ? arg.value : null)).filter(Boolean);
          if (!attributeNames.length) {
            const args = expr.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `${indent}// ${expr.callee.name}(${args})`;
          }
          const target = context.currentClassName ? `${context.currentClassName}.prototype` : "this";
          const lines = [];
          for (const name of attributeNames) {
            const ivar = this.instanceVariableKey(name);
            if (expr.callee.name !== "attr_writer") {
              lines.push(`${target}[${this.quote(name)}] = function() { return this.${ivar}; };`);
            }
            if (expr.callee.name !== "attr_reader") {
              lines.push(`${target}[${this.quote(`${name}=`)}] = function(value) { this.${ivar} = value; return value; };`);
            }
          }
          return lines.join("\n");
        }
        isRequireCall(expr) {
          return expr && expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "require";
        }
        emitRequireCall(expr, context) {
          const indent = this.indent();
          if (!expr.arguments.length) {
            return `${indent}// require`;
          }
          const first = expr.arguments[0];
          if (first.type === "StringLiteral") {
            if (first.value === "forwardable") {
              if (this.injectedRequires.has("forwardable")) {
                return `${indent}// require "forwardable"`;
              }
              this.injectedRequires.add("forwardable");
              return `${indent}const Forwardable = {};`;
            }
            return `${indent}// require "${first.value}"`;
          }
          const rendered = this.emitExpression(first, context);
          return `${indent}// require ${rendered}`;
        }
        isExtendCall(expr) {
          return expr && expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "extend";
        }
        emitExtendCall(expr, context) {
          const indent = this.indent();
          const args = expr.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
          return `${indent}// extend ${args}`;
        }
        isDefDelegatorsCall(expr, context) {
          return expr && expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "def_delegators";
        }
        emitDefDelegators(expr, context = {}) {
          const indent = this.indent();
          const methods = expr.arguments.slice(1).map((arg) => this.resolveDelegatorMethodName(arg)).filter(Boolean);
          if (!methods.length) {
            const args = expr.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `${indent}// def_delegators(${args})`;
          }
          if (!context.inClass) {
            const args = expr.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `${indent}// def_delegators(${args})`;
          }
          const className = context.currentClassName;
          const receiver = className ? `${className}.prototype` : "this";
          const target = this.resolveDelegatorTarget(expr.arguments[0], context);
          const lines = [];
          const innerIndent = " ".repeat(this.indentSize);
          for (const methodName of methods) {
            lines.push(`${receiver}[${this.quote(methodName)}] = function(...args) {`);
            lines.push(`${innerIndent}const __target = ${target};`);
            lines.push(`${innerIndent}const __fn = __target != null ? __target[${this.quote(methodName)}] : undefined;`);
            lines.push(`${innerIndent}return typeof __fn === "function" ? __fn.apply(__target, args) : undefined;`);
            lines.push("};");
          }
          return lines.join("\n");
        }
        resolveDelegatorTarget(node, context) {
          if (!node) return "this";
          if (node.type === "SymbolLiteral") {
            const name = node.name;
            if (name.startsWith("@@")) {
              const prop = name.slice(2);
              const owner = context.currentClassName ? `${context.currentClassName}` : "this.constructor";
              return `${owner}.${prop}`;
            }
            if (name.startsWith("@")) {
              return this.instanceVariableReference(name.slice(1));
            }
            return `this[${this.quote(name)}]`;
          }
          return this.emitExpression(node, context);
        }
        resolveDelegatorMethodName(node) {
          if (!node) return null;
          if (node.type === "SymbolLiteral") return node.name;
          if (node.type === "Identifier") return node.name;
          if (node.type === "StringLiteral") return node.value;
          return null;
        }
        prepareMethodParameters(params, scope, options = {}) {
          const structures = [];
          let hasKeywords = false;
          let hasForwarding = false;
          for (const param of params) {
            switch (param.type) {
              case "Identifier": {
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "positional", name: safeName, original: param.name });
                break;
              }
              case "OptionalParameter": {
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "optional", name: safeName, original: param.name, default: param.default });
                break;
              }
              case "RestParameter": {
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "rest", name: safeName });
                break;
              }
              case "BlockParameter": {
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "block", name: safeName });
                break;
              }
              case "KeywordParameter": {
                hasKeywords = true;
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "keywordRequired", name: safeName, key: param.name });
                break;
              }
              case "KeywordOptionalParameter": {
                hasKeywords = true;
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "keywordOptional", name: safeName, key: param.name, default: param.default });
                break;
              }
              case "KeywordRestParameter": {
                hasKeywords = true;
                const safeName = this.getRenamedName(scope, param.name);
                structures.push({ kind: "keywordRest", name: safeName });
                break;
              }
              case "ForwardingParameter": {
                hasForwarding = true;
                structures.push({ kind: "forwarding" });
                break;
              }
              default:
                throw new Error(`Unsupported parameter type: ${param.type}`);
            }
          }
          const useGeneric = hasKeywords || hasForwarding;
          const result = {
            useGeneric,
            paramSignature: [],
            optionalParams: [],
            blockParamName: null,
            blockFromRest: null,
            genericInfo: null
          };
          if (useGeneric) {
            const rawArgsName = this.generateUniqueId("__args");
            const positional = [];
            const optional = [];
            let restName = null;
            const keywordRequired = [];
            const keywordOptional = [];
            let keywordRest = null;
            let blockName = null;
            for (const info of structures) {
              switch (info.kind) {
                case "positional":
                  positional.push({ name: info.name });
                  break;
                case "optional":
                  optional.push({ name: info.name, default: info.default });
                  break;
                case "rest":
                  restName = info.name;
                  break;
                case "block":
                  blockName = info.name;
                  break;
                case "keywordRequired":
                  keywordRequired.push({ name: info.name, key: info.key });
                  break;
                case "keywordOptional":
                  keywordOptional.push({ name: info.name, key: info.key, default: info.default });
                  break;
                case "keywordRest":
                  keywordRest = info.name;
                  break;
                case "forwarding":
                  break;
                default:
                  break;
              }
            }
            if (!blockName && options.usesYield) {
              blockName = "__block";
            }
            result.paramSignature = [`...${rawArgsName}`];
            result.blockParamName = blockName;
            result.genericInfo = {
              rawArgsName,
              positional,
              optional,
              rest: restName,
              keywordRequired,
              keywordOptional,
              keywordRest,
              hasExplicitKeywords: hasKeywords,
              blockParamName: blockName,
              usesYield: options.usesYield,
              forwarding: hasForwarding
            };
          } else {
            const paramNames = [];
            let restName = null;
            let blockName = null;
            let blockFromRest = null;
            const optionalParams = [];
            for (const info of structures) {
              switch (info.kind) {
                case "positional":
                  paramNames.push(info.name);
                  break;
                case "optional":
                  paramNames.push(info.name);
                  optionalParams.push({ name: info.name, default: info.default });
                  break;
                case "rest":
                  paramNames.push(`...${info.name}`);
                  restName = info.name;
                  break;
                case "block":
                  blockName = info.name;
                  if (restName) {
                    blockFromRest = { rest: restName, block: info.name };
                  } else {
                    paramNames.push(info.name);
                  }
                  break;
                default:
                  break;
              }
            }
            if (options.usesYield && !blockName) {
              blockName = "__block";
              if (restName) {
                blockFromRest = { rest: restName, block: blockName };
              } else {
                paramNames.push(blockName);
              }
            }
            result.paramSignature = paramNames;
            result.optionalParams = optionalParams;
            result.blockParamName = blockName;
            result.blockFromRest = blockFromRest;
          }
          return result;
        }
        isRefineCall(expr) {
          return expr && expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "refine";
        }
        emitRefineCall(expr, context) {
          const indent = this.indent();
          let targetExpr = "Object";
          let blockNode = expr.block;
          if (!blockNode && expr.arguments[0] && expr.arguments[0].type === "CallExpression" && expr.arguments[0].block) {
            targetExpr = this.emitExpression(expr.arguments[0].callee, context);
            blockNode = expr.arguments[0].block;
          } else if (expr.arguments[0]) {
            targetExpr = this.emitExpression(expr.arguments[0], context);
          }
          if (!blockNode) {
            const args = expr.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `${indent}// refine(${args})`;
          }
          const lines = [];
          const bodyStatements = blockNode.body.body;
          for (const statement of bodyStatements) {
            if (statement.type === "MethodDefinition") {
              lines.push(this.emitRefinedMethod(targetExpr, statement, context));
            } else {
              const stmt = this.emitStatement(statement, context);
              if (stmt) lines.push(stmt);
            }
          }
          if (!lines.length) {
            return `${indent}// refine ${targetExpr}`;
          }
          return lines.join("\n");
        }
        emitRefinedMethod(targetExpr, methodNode, context) {
          const indent = this.indent();
          const scope = this.scopeInfo.get(methodNode);
          const parameterAnalysis = this.prepareMethodParameters(methodNode.params, scope, { usesYield: !!methodNode.usesYield });
          const paramsCode = parameterAnalysis.paramSignature.join(", ");
          const fnBody = this.emitFunctionBody(
            methodNode.body,
            {
              ...context,
              scopeNode: methodNode,
              scopeStack: [methodNode, ...context.scopeStack || []],
              inFunction: true,
              allowImplicitReturn: true,
              methodType: "instance",
              blockParamName: parameterAnalysis.blockParamName,
              optionalParams: parameterAnalysis.optionalParams,
              blockFromRest: parameterAnalysis.blockFromRest,
              methodBlockInfo: parameterAnalysis.blockFromRest,
              currentMethodName: methodNode.id.name,
              ...parameterAnalysis.genericInfo ? { genericArgsInfo: parameterAnalysis.genericInfo } : {}
            },
            scope
          );
          return `${indent}${targetExpr}.prototype[${this.quote(methodNode.id.name)}] = function(${paramsCode}) ${fnBody};`;
        }
        emitExpression(node, context = {}) {
          switch (node.type) {
            case "Identifier": {
              const name = node.name;
              const resolved = this.resolveIdentifierName(name, context);
              if (resolved !== name) {
                return resolved;
              }
              const declared = this.isIdentifierDeclared(name, context);
              if (!declared) {
                const allowGlobal = context && context.allowGlobalIdentifier;
                if (name === "__FILE__") {
                  this.requireRuntime("fileConstant");
                  return "__FILE__";
                }
                if (name === "binding") {
                  this.requireRuntime("bindingHelper");
                  return "__rubyBinding()";
                }
                const runtimeConstants = {
                  Thread: "thread",
                  Fiber: "fiber",
                  Enumerator: "enumerator",
                  File: "file",
                  Struct: "struct",
                  TracePoint: "tracePoint"
                };
                if (Object.prototype.hasOwnProperty.call(runtimeConstants, name)) {
                  this.requireRuntime(runtimeConstants[name]);
                  return name;
                }
                if (/^[A-Z]/.test(name) && this.isRubyExceptionConstant(name)) {
                  this.requireRuntime("ensureError");
                  return `__rubyEnsureError(${this.quote(name)})`;
                }
                if (/^[A-Z]/.test(name)) {
                  return name;
                }
                if (allowGlobal) {
                  return name;
                }
                this.requireRuntime("send");
                const receiver = this.resolveImplicitCallReceiver(context);
                return `__rubySend(${receiver}, ${this.quote(name)}, [], undefined)`;
              }
              if (!context.disableMethodLookup && this.isMethodName(name, context)) {
                this.requireRuntime("send");
                const receiver = this.resolveImplicitCallReceiver(context);
                return `__rubySend(${receiver}, ${this.quote(name)}, [], undefined)`;
              }
              return resolved;
            }
            case "InstanceVariable":
              return this.instanceVariableReference(node.name);
            case "ClassVariable":
              return `this.constructor.${node.name}`;
            case "SelfExpression":
              return "this";
            case "NumericLiteral":
              return String(node.value);
            case "StringLiteral":
              return this.emitStringLiteral(node, context);
            case "RegExpLiteral":
              return this.emitRegExpLiteral(node);
            case "BooleanLiteral":
              return node.value ? "true" : "false";
            case "NullLiteral":
              return "null";
            case "RangeExpression":
              return this.emitRangeExpression(node, context);
            case "SymbolLiteral":
              return this.quote(node.name);
            case "ArrayExpression":
              return `[${node.elements.map((el) => this.emitExpression(el, context)).join(", ")}]`;
            case "HashExpression":
              return this.emitObjectLiteral(node, context);
            case "UnaryExpression":
              return `${node.operator}${this.emitExpression(node.argument, context)}`;
            case "BinaryExpression":
              return this.emitBinaryExpression(node, context);
            case "LogicalExpression":
              return `${this.emitExpression(node.left, context)} ${node.operator} ${this.emitExpression(node.right, context)}`;
            case "AssignmentExpression":
              return this.emitAssignmentExpression(node, context);
            case "MultiAssignmentExpression":
              return this.emitMultiAssignmentExpression(node, context);
            case "CallExpression":
              return this.emitCallExpression(node, context);
            case "MemberExpression":
              return this.emitMemberExpression(node, context);
            case "OptionalMemberExpression":
              return this.emitOptionalMemberExpression(node, context);
            case "BlockStatement":
              return this.emitBlockStatement(node, context);
            case "ConditionalExpression":
              return `${this.emitExpression(node.test, context)} ? ${this.emitExpression(node.consequent, context)} : ${this.emitExpression(node.alternate, context)}`;
            case "LambdaExpression":
              return this.emitLambdaExpression(node, context);
            case "YieldExpression":
              return this.emitYieldExpression(node, context);
            case "SuperCall":
              return this.emitSuperCall(node, context);
            case "BeginRescueExpression":
              return this.emitBeginRescueExpression(node, context);
            default:
              throw new Error(`Unsupported expression type: ${node.type}`);
          }
        }
        emitAssignmentExpression(node, context) {
          const left = this.emitAssignmentTarget(node.left, context);
          const right = this.emitExpression(node.right, context);
          if (node.operator === "=") {
            if (node.left.type === "MemberExpression" && !node.left.computed && node.left.property.type === "Identifier") {
              const objectCode = this.emitExpression(node.left.object, context);
              const methodName = `${node.left.property.name}=`;
              return `${objectCode}[${this.quote(methodName)}](${right})`;
            }
            return `${left} = ${right}`;
          }
          return `${left} ${node.operator} ${right}`;
        }
        emitMultiAssignmentExpression(node, context) {
          const targets = node.targets.map((target) => this.emitAssignmentTarget(target, context));
          const right = this.emitExpression(node.right, context);
          if (targets.length <= 1) {
            const target = targets[0] ?? "undefined";
            return `${target} = ${right}`;
          }
          this.requireRuntime("multiAssign");
          const tempVar = this.generateUniqueId("__multi");
          const destructure = `[${targets.join(", ")}] = __rubyMultiAssign(${tempVar}, ${targets.length});`;
          return `(() => { const ${tempVar} = ${right}; ${destructure} return ${tempVar}; })()`;
        }
        emitAssignmentTarget(target, context) {
          if (!target) return "undefined";
          switch (target.type) {
            case "Identifier":
              return this.resolveIdentifierName(target.name, context);
            case "InstanceVariable":
              return this.instanceVariableReference(target.name);
            case "MemberExpression":
            case "OptionalMemberExpression":
              return this.emitExpression(target, context);
            default:
              return this.emitExpression(target, context);
          }
        }
        emitCallExpression(node, context) {
          const calleeName = this.extractCalleeName(node.callee);
          const receiverCode = this.extractCalleeObjectCode(node.callee, context);
          const processedArgs = [];
          let blockPassExpression = null;
          for (const arg of node.arguments) {
            if (arg && arg.type === "BlockPassExpression") {
              blockPassExpression = this.emitBlockPassExpression(arg, context);
              continue;
            }
            if (arg && arg.type === "ForwardingArguments") {
              processedArgs.push({ node: arg, code: null });
              continue;
            }
            processedArgs.push({ node: arg, code: this.emitArgumentExpression(arg, context) });
          }
          const inlineBlockNode = node.block || null;
          const inlineBlockCode = inlineBlockNode ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true }) : null;
          let blockCode = inlineBlockCode || blockPassExpression;
          if (calleeName === "proc") {
            if (blockCode) {
              return blockCode;
            }
            if (processedArgs.length) {
              const codes = processedArgs.map((entry) => entry.code);
              return `${calleeName}(${codes.join(", ")})`;
            }
            return `${calleeName}()`;
          }
          if (node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.object.type === "Identifier" && node.callee.object.name === "Proc" && node.callee.property.type === "Identifier" && node.callee.property.name === "new") {
            if (node.block) {
              return this.emitBlockFunction(node.block, context, { forceImplicitIdentifiers: true });
            }
          }
          if (calleeName === "block_given?") {
            return this.emitBlockGiven(context);
          }
          const isMemberIdentifier = node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier";
          const visibilityKeywords = /* @__PURE__ */ new Set(["private", "public", "protected", "module_function"]);
          if (calleeName && !isMemberIdentifier && visibilityKeywords.has(calleeName)) {
            return "";
          }
          if (calleeName === "include" && !isMemberIdentifier) {
            return this.emitIncludeCall(node, context);
          }
          if (calleeName === "extend" && !isMemberIdentifier) {
            return this.emitExtendCall(node, context);
          }
          if (calleeName === "prepend" && !isMemberIdentifier) {
            return this.emitPrependCall(node, context);
          }
          if (calleeName === "define_method") {
            return this.emitDefineMethod(node, context);
          }
          if (calleeName === "instance_variable_get") {
            return this.emitInstanceVariableGet(node, context, receiverCode);
          }
          if (calleeName === "instance_variable_set") {
            return this.emitInstanceVariableSet(node, context, receiverCode);
          }
          if (calleeName === "eval") {
            this.requireRuntime("putsGlobal");
          }
          if (calleeName === "puts") {
            const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `console.log(${args})`;
          }
          if (calleeName === "print") {
            this.requireRuntime("print");
            const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return args.length ? `__rubyPrint(${args})` : "__rubyPrint()";
          }
          if (calleeName === "p") {
            const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return args.length ? `console.log(${args})` : "console.log()";
          }
          if (calleeName === "gets") {
            this.requireRuntime("gets");
            const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return args.length ? `__rubyGets(${args})` : "__rubyGets()";
          }
          const callArgs = this.buildCallArguments(processedArgs, blockCode);
          const { finalArgCodes, argsArray, argsWithBlock, blockArg } = callArgs;
          if (node.callee.type === "Identifier" && calleeName === "raise") {
            this.requireRuntime("raise");
            const raiseArgs = argsWithBlock.join(", ");
            return raiseArgs.length ? `__rubyRaise(${raiseArgs})` : "__rubyRaise()";
          }
          let memberProperty = null;
          let memberObjectCode = null;
          if (node.callee.type === "OptionalMemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier") {
            memberProperty = node.callee.property.name;
            memberObjectCode = this.emitExpression(node.callee.object, {
              ...context,
              disableMethodLookup: true,
              allowGlobalIdentifier: true
            });
          } else if (node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier") {
            memberProperty = node.callee.property.name;
            memberObjectCode = this.emitExpression(node.callee.object, {
              ...context,
              disableMethodLookup: true,
              allowGlobalIdentifier: true
            });
            if (node.callee.object.type === "Identifier" && node.callee.object.name === "gets") {
              memberObjectCode = this.emitGetsCall();
            }
          }
          if (memberProperty && memberObjectCode) {
            const bangInfo = this.getStringBangInfo(memberProperty);
            if (bangInfo && node.arguments.length === 0 && node.callee.object && node.callee.object.type === "Identifier") {
              this.requireRuntime(bangInfo.runtime);
              if (bangInfo.dependencies) {
                for (const dep of bangInfo.dependencies) {
                  this.requireRuntime(dep);
                }
              }
              return `(() => { ${memberObjectCode} = ${bangInfo.helper}(${memberObjectCode}); return ${memberObjectCode}; })()`;
            }
            if (memberProperty === "times" && node.arguments.length === 0) {
              this.requireRuntime("times");
              if (blockCode) {
                return `__rubyTimes(${memberObjectCode}, ${blockCode})`;
              }
              return `__rubyTimes(${memberObjectCode})`;
            }
            if (memberProperty === "upto" && processedArgs.length >= 1) {
              this.requireRuntime("upto");
              const limitArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              if (blockCode) {
                return `__rubyUpto(${memberObjectCode}, ${limitArg}, ${blockCode})`;
              }
              return `__rubyUpto(${memberObjectCode}, ${limitArg})`;
            }
            if (memberProperty === "downto" && processedArgs.length >= 1) {
              this.requireRuntime("downto");
              const limitArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              if (blockCode) {
                return `__rubyDownto(${memberObjectCode}, ${limitArg}, ${blockCode})`;
              }
              return `__rubyDownto(${memberObjectCode}, ${limitArg})`;
            }
            if (memberProperty === "public_send") {
              const methodArg = node.arguments[0];
              const methodNameLiteral = this.extractSymbolName(methodArg);
              if (methodNameLiteral && node.arguments.length >= 2) {
                const right = this.emitExpression(node.arguments[1], context);
                const left = memberObjectCode;
                const operatorMap = {
                  "==": "===",
                  "!=": "!=="
                };
                const jsOperator = operatorMap[methodNameLiteral] ?? methodNameLiteral;
                if ([">", ">=", "<", "<=", "===", "!=="].includes(jsOperator)) {
                  return `${left} ${jsOperator} ${right}`;
                }
              }
              this.requireRuntime("publicSend");
              const argCodes = node.arguments.map((arg) => this.emitExpression(arg, context));
              const argsTail = argCodes.length ? `, ${argCodes.join(", ")}` : "";
              return `__rubyPublicSend(${memberObjectCode}${argsTail})`;
            }
            if (memberProperty === "strftime" && this.isTimeNowExpression(node.callee.object)) {
              this.requireRuntime("strftime");
              const format = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
              return `__rubyStrftime(${format})`;
            }
            if (memberProperty === "strip" && node.arguments.length === 0) {
              this.requireRuntime("strip");
              return `__rubyStrip(${memberObjectCode})`;
            }
            if (memberProperty === "upcase" && node.arguments.length === 0) {
              this.requireRuntime("upcase");
              return `__rubyUpcase(${memberObjectCode})`;
            }
            if (memberProperty === "downcase" && node.arguments.length === 0) {
              this.requireRuntime("downcase");
              return `__rubyDowncase(${memberObjectCode})`;
            }
            if (memberProperty === "split" && node.arguments.length === 0) {
              this.requireRuntime("split");
              return `__rubySplit(${memberObjectCode})`;
            }
            if (memberProperty === "chomp" && node.arguments.length === 0) {
              this.requireRuntime("chomp");
              return `__rubyChomp(${memberObjectCode})`;
            }
            if (memberProperty === "reverse" && node.arguments.length === 0) {
              this.requireRuntime("reverseString");
              return `__rubyReverse(${memberObjectCode})`;
            }
            if (memberProperty === "capitalize" && node.arguments.length === 0) {
              this.requireRuntime("capitalize");
              return `__rubyCapitalize(${memberObjectCode})`;
            }
            if (memberProperty === "swapcase" && node.arguments.length === 0) {
              this.requireRuntime("swapcase");
              return `__rubySwapcase(${memberObjectCode})`;
            }
            if (memberProperty === "ljust") {
              this.requireRuntime("ljust");
              const widthArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              const padArg = processedArgs[1] && processedArgs[1].code ? processedArgs[1].code : "undefined";
              return `__rubyLjust(${memberObjectCode}, ${widthArg}, ${padArg})`;
            }
            if (memberProperty === "rjust") {
              this.requireRuntime("rjust");
              const widthArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              const padArg = processedArgs[1] && processedArgs[1].code ? processedArgs[1].code : "undefined";
              return `__rubyRjust(${memberObjectCode}, ${widthArg}, ${padArg})`;
            }
            if (memberProperty === "max" && node.arguments.length === 0) {
              return `Math.max(...${memberObjectCode})`;
            }
            if (memberProperty === "chars" && node.arguments.length === 0) {
              this.requireRuntime("chars");
              return `__rubyChars(${memberObjectCode})`;
            }
            if (memberProperty === "gsub" && processedArgs.length >= 1) {
              this.requireRuntime("gsub");
              const patternArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              const replacementArg = processedArgs[1] && processedArgs[1].code ? processedArgs[1].code : "undefined";
              if (blockCode) {
                return `__rubyGsub(${memberObjectCode}, ${patternArg}, undefined, ${blockCode})`;
              }
              return `__rubyGsub(${memberObjectCode}, ${patternArg}, ${replacementArg})`;
            }
            if (memberProperty === "include?" && node.arguments.length === 1) {
              this.requireRuntime("collectionInclude");
              const searchValue = this.emitExpression(node.arguments[0], context);
              return `__rubyCollectionInclude(${memberObjectCode}, ${searchValue})`;
            }
            if (memberProperty === "to_i" && node.arguments.length === 0) {
              this.requireRuntime("toInteger");
              return `__rubyToInteger(${memberObjectCode})`;
            }
            if (memberProperty === "to_f" && node.arguments.length === 0) {
              this.requireRuntime("toFloat");
              return `__rubyToFloat(${memberObjectCode})`;
            }
            if (memberProperty === "to_sym" && node.arguments.length === 0) {
              return `String(${memberObjectCode})`;
            }
            if (memberProperty === "to_s" && node.arguments.length === 0) {
              return `String(${memberObjectCode})`;
            }
            if (memberProperty === "size" && node.arguments.length === 0) {
              return `${memberObjectCode}.length`;
            }
            if (memberProperty === "is_a?" && node.arguments.length === 1) {
              const argNode = node.arguments[0];
              if (argNode.type === "Identifier" && argNode.name === "Proc") {
                const objectRef = memberObjectCode ?? this.emitExpression(node.callee.object, context);
                return `typeof ${objectRef} === 'function'`;
              }
            }
            if (memberProperty === "select" && blockCode) {
              return `${memberObjectCode}.filter(${blockCode})`;
            }
            if (memberProperty === "reject") {
              this.requireRuntime("arrayReject");
              if (blockCode) {
                return `__rubyReject(${memberObjectCode}, ${blockCode})`;
              }
              return `__rubyReject(${memberObjectCode})`;
            }
            if (memberProperty === "class" && node.arguments.length === 0) {
              this.requireRuntime("className");
              return `__rubyClassName(${memberObjectCode})`;
            }
            if (memberProperty === "freeze" && node.arguments.length === 0) {
              return `Object.freeze(${memberObjectCode})`;
            }
            if (memberProperty === "lazy" && node.arguments.length === 0) {
              this.requireRuntime("lazy");
              return `__rubyLazy(${memberObjectCode})`;
            }
            if (memberProperty === "fetch") {
              this.requireRuntime("fetch");
              const indexArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
              if (node.arguments.length > 1) {
                const defaultArg = this.emitExpression(node.arguments[1], context);
                return `__rubyFetch(${memberObjectCode}, ${indexArg}, ${defaultArg})`;
              }
              return `__rubyFetch(${memberObjectCode}, ${indexArg})`;
            }
            if (memberProperty === "first") {
              this.requireRuntime("arrayFirst");
              const countArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              return `__rubyFirst(${memberObjectCode}${processedArgs.length ? `, ${countArg}` : ""})`;
            }
            if (memberProperty === "last") {
              this.requireRuntime("arrayLast");
              const countArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              return `__rubyLast(${memberObjectCode}${processedArgs.length ? `, ${countArg}` : ""})`;
            }
            if (memberProperty === "push") {
              this.requireRuntime("arrayPush");
              const pushArgs = processedArgs.map((arg) => arg.code).filter(Boolean);
              const argsTail = pushArgs.length ? `, ${pushArgs.join(", ")}` : "";
              return `__rubyArrayPush(${memberObjectCode}${argsTail})`;
            }
            if (memberProperty === "shuffle" && node.arguments.length === 0 && !blockCode) {
              this.requireRuntime("arrayShuffle");
              return `__rubyShuffle(${memberObjectCode})`;
            }
            if (memberProperty === "uniq" && node.arguments.length === 0 && !blockCode) {
              this.requireRuntime("arrayUniq");
              return `__rubyUniq(${memberObjectCode})`;
            }
            if (memberProperty === "sample") {
              this.requireRuntime("arraySample");
              const sampleArg = processedArgs[0] && processedArgs[0].code ? processedArgs[0].code : "undefined";
              return processedArgs.length ? `__rubySample(${memberObjectCode}, ${sampleArg})` : `__rubySample(${memberObjectCode})`;
            }
            if (memberProperty === "match") {
              this.requireRuntime("match");
              const pattern = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
              return `__rubyMatch(${memberObjectCode}, ${pattern})`;
            }
            if (memberProperty === "instance_eval" && blockCode && !processedArgs.length) {
              this.requireRuntime("instanceEval");
              const evalBlock = inlineBlockNode ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true }) : blockCode;
              return `__rubyInstanceEval(${memberObjectCode}, ${evalBlock})`;
            }
            if (memberProperty === "instance_exec" && blockCode) {
              this.requireRuntime("instanceExec");
              const execArgs = finalArgCodes.length ? `[${finalArgCodes.join(", ")}]` : "[]";
              return `__rubyInstanceExec(${memberObjectCode}, ${execArgs}, ${blockCode})`;
            }
            if (memberProperty === "define_singleton_method") {
              return this.emitDefineSingletonMethodCall(node, context, {
                objectCode: memberObjectCode,
                inlineBlockNode,
                blockCode,
                processedArgs
              });
            }
          }
          let isConstructorCall = false;
          let calleeCode;
          if (node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier" && node.callee.property.name === "new") {
            calleeCode = this.emitExpression(node.callee.object, context);
            isConstructorCall = true;
          } else if (node.callee.type === "Identifier" && context.classLevel && context.currentClassName) {
            calleeCode = `${context.currentClassName}.${node.callee.name}`;
          } else if (node.callee.type === "Identifier" && context.methodType === "instance") {
            const scope = context.scopeNode ? this.scopeInfo.get(context.scopeNode) : null;
            const isDeclared = scope ? scope.declared.has(node.callee.name) : false;
            calleeCode = isDeclared ? node.callee.name : `this.${node.callee.name}`;
          } else if (node.callee.type === "Identifier") {
            if (context.methodType === "static" && !this.isIdentifierDeclared(node.callee.name, context) && this.isMethodName(node.callee.name, context)) {
              calleeCode = `this.${node.callee.name}`;
            } else {
              calleeCode = node.callee.name;
            }
          } else {
            calleeCode = this.emitExpression(node.callee, { ...context, disableMethodLookup: true });
          }
          const hasForwardingArg = processedArgs.some((entry) => entry.node && entry.node.type === "ForwardingArguments");
          if (hasForwardingArg) {
            const explicitArgs = processedArgs.filter((entry) => !entry.node || entry.node.type !== "ForwardingArguments");
            if (explicitArgs.length) {
              throw new Error("Forwarding arguments cannot be combined with explicit arguments in this transpiler");
            }
            const forwardingInfo = context.forwardingInfo;
            if (!forwardingInfo) {
              throw new Error("Forwarding arguments used outside of a forwarding method");
            }
            const positionalName = forwardingInfo.positionalName;
            const keywordExpr = forwardingInfo.keywordName || "undefined";
            const blockExpr = forwardingInfo.blockName || "undefined";
            const argsExpr = `(${keywordExpr} === undefined ? ${positionalName}.slice() : ${positionalName}.concat(${keywordExpr}))`;
            if (!memberProperty && node.callee.type === "Identifier") {
              if (calleeName === "eval") {
                const evalArgsExpr = blockExpr !== "undefined" ? `${argsExpr}.concat(${blockExpr})` : argsExpr;
                return `eval.apply(undefined, ${evalArgsExpr})`;
              }
              this.requireRuntime("send");
              const implicitReceiver = this.resolveImplicitCallReceiver(context);
              return `__rubySend(${implicitReceiver}, ${this.quote(calleeName)}, ${argsExpr}, ${blockExpr})`;
            }
            if (memberProperty) {
              this.requireRuntime("send");
              return `__rubySend(${memberObjectCode}, ${this.quote(memberProperty)}, ${argsExpr}, ${blockExpr})`;
            }
            const appliedArgs = blockExpr !== "undefined" ? `${argsExpr}.concat(${blockExpr})` : argsExpr;
            return `${calleeCode}.apply(this, ${appliedArgs})`;
          }
          if (!memberProperty && node.callee.type === "Identifier") {
            if (calleeName === "instance_eval" && blockCode && !finalArgCodes.length) {
              this.requireRuntime("instanceEval");
              const receiverExpr = this.resolveImplicitCallReceiver(context);
              const evalBlock = inlineBlockNode ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true }) : blockCode;
              return `__rubyInstanceEval(${receiverExpr}, ${evalBlock})`;
            }
            if (calleeName === "instance_exec" && blockCode) {
              this.requireRuntime("instanceExec");
              const execArgs = finalArgCodes.length ? `[${finalArgCodes.join(", ")}]` : "[]";
              const receiverExpr = this.resolveImplicitCallReceiver(context);
              return `__rubyInstanceExec(${receiverExpr}, ${execArgs}, ${blockCode})`;
            }
            if (calleeName === "eval") {
              const callArgs2 = argsWithBlock.join(", ");
              return callArgs2.length ? `eval(${callArgs2})` : "eval()";
            }
            const handledNames = ["proc", "instance_eval", "instance_exec", "block_given?", "define_method", "instance_variable_get", "instance_variable_set", "puts", "print", "gets"];
            const isStaticMethod = context.methodType === "static" && this.isMethodName(node.callee.name, context);
            const needsImplicitSend = !this.isValidMethodName(node.callee.name) || !this.isIdentifierDeclared(node.callee.name, context) && !handledNames.includes(node.callee.name) && !isStaticMethod;
            if (needsImplicitSend) {
              if (context.forceImplicitIdentifiers || !this.isValidMethodName(node.callee.name)) {
                this.requireRuntime("send");
                const implicitReceiver = this.resolveImplicitCallReceiver(context);
                return `__rubySend(${implicitReceiver}, ${this.quote(node.callee.name)}, ${argsArray}, ${blockArg})`;
              }
            }
          }
          if (memberProperty === "call" && node.callee.type !== "OptionalMemberExpression") {
            const args = finalArgCodes.join(", ");
            return `${memberObjectCode}(${args})`;
          }
          if (blockCode && node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier" && (node.callee.property.name === "each" || node.callee.property.name === "each_with_index")) {
            const objectCode = this.emitExpression(node.callee.object, context);
            let iteratorBlock = blockCode;
            if (inlineBlockNode) {
              const functionBlock = this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true, asFunction: true });
              iteratorBlock = this.convertFunctionToArrow(functionBlock);
            }
            return `${objectCode}.forEach(${iteratorBlock})`;
          }
          if (node.callee.type === "OptionalMemberExpression") {
            const objectCode = this.emitExpression(node.callee.object, context);
            const args = argsWithBlock.join(", ");
            const callSuffix = args.length ? `(${args})` : "()";
            if (node.callee.computed) {
              const propertyCode = this.emitExpression(node.callee.property, context);
              return `${objectCode}?.[${propertyCode}]${callSuffix}`;
            }
            return `${objectCode}?.${node.callee.property.name}${callSuffix}`;
          }
          if (!isConstructorCall && node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property.type === "Identifier") {
            this.requireRuntime("send");
            const objectCode = this.emitExpression(node.callee.object, {
              ...context,
              disableMethodLookup: true,
              allowGlobalIdentifier: true
            });
            return `__rubySend(${objectCode}, ${this.quote(node.callee.property.name)}, ${argsArray}, ${blockArg})`;
          }
          if (isConstructorCall) {
            const ctorArgs = argsWithBlock.join(", ");
            return `new ${calleeCode}(${ctorArgs})`;
          }
          return `${calleeCode}(${argsWithBlock.join(", ")})`;
        }
        extractCalleeName(callee) {
          if (!callee) return null;
          if (callee.type === "Identifier") return callee.name;
          if (callee.type === "MemberExpression" && !callee.computed && callee.property.type === "Identifier") {
            return callee.property.name;
          }
          return null;
        }
        extractCalleeObjectCode(callee, context) {
          if (callee && callee.type === "MemberExpression") {
            const objectContext = {
              ...context,
              disableMethodLookup: true,
              allowGlobalIdentifier: true
            };
            if (callee.object && callee.object.type === "Identifier" && context.methodType === "static" && this.isMethodName(callee.object.name, context)) {
              objectContext.disableMethodLookup = false;
              objectContext.allowGlobalIdentifier = false;
            }
            return this.emitExpression(callee.object, objectContext);
          }
          return null;
        }
        extractSymbolName(node) {
          if (!node) return null;
          if (node.type === "SymbolLiteral") return node.name;
          if (node.type === "StringLiteral") return node.value;
          if (node.type === "Identifier" && !node.name.startsWith("__")) return node.name;
          return null;
        }
        emitArgumentExpression(arg, context) {
          if (!arg) return "";
          if (arg.type === "ToProcExpression") {
            return this.emitToProcExpression(arg, context);
          }
          if (arg.type === "BlockPassExpression") {
            return this.emitBlockPassExpression(arg, context);
          }
          return this.emitExpression(arg, context);
        }
        buildCallArguments(processedArgs, blockCode) {
          const positionalArgs = [];
          const keywordArgs = [];
          for (const entry of processedArgs) {
            if (entry.node && entry.node.keyword) {
              keywordArgs.push(entry);
            } else {
              positionalArgs.push(entry);
            }
          }
          let keywordObjectCode = null;
          if (keywordArgs.length === 1) {
            keywordObjectCode = keywordArgs[0].code;
          } else if (keywordArgs.length > 1) {
            keywordObjectCode = `Object.assign({}, ${keywordArgs.map((arg) => arg.code).join(", ")})`;
          }
          const positionalCodes = positionalArgs.map((entry) => entry.code);
          const finalArgCodes = keywordObjectCode ? [...positionalCodes, keywordObjectCode] : [...positionalCodes];
          const argsArray = finalArgCodes.length ? `[${finalArgCodes.join(", ")}]` : "[]";
          const blockArg = blockCode ? blockCode : "undefined";
          const argsWithBlock = blockCode ? [...finalArgCodes, blockCode] : [...finalArgCodes];
          return {
            positionalArgs,
            keywordArgs,
            keywordObjectCode,
            positionalCodes,
            finalArgCodes,
            argsArray,
            blockArg,
            argsWithBlock
          };
        }
        emitToProcExpression(node, context) {
          if (node.argument.type === "SymbolLiteral") {
            const name = node.argument.name;
            this.requireRuntime("symbolProc");
            if (name === "capitalize") {
              this.requireRuntime("capitalize");
            }
            if (name === "swapcase") {
              this.requireRuntime("swapcase");
            }
            return `__rubySymbolProc(${this.quote(name)})`;
          }
          return this.emitExpression(node.argument, context);
        }
        emitGetsCall() {
          this.requireRuntime("gets");
          return "__rubyGets()";
        }
        emitBlockPassExpression(node, context) {
          if (node.expression.type === "ToProcExpression") {
            return this.emitToProcExpression(node.expression, context);
          }
          return this.emitExpression(node.expression, context);
        }
        emitLambdaExpression(node, context = {}) {
          const scope = this.scopeInfo.get(node);
          let paramNames = node.params.map((param) => this.getRenamedName(scope, param.name));
          if (!paramNames.length) {
            const inferred = this.inferImplicitParams(node.body);
            if (scope) {
              inferred.forEach((name) => scope.declared.add(name));
            }
            paramNames = inferred;
          }
          const paramsCode = paramNames.length ? `(${paramNames.join(", ")})` : "()";
          const body = this.emitFunctionBody(
            node.body,
            {
              ...context,
              scopeNode: node,
              scopeStack: [node, ...context.scopeStack || []],
              inFunction: true,
              allowImplicitReturn: true,
              blockParamName: null
            },
            scope
          );
          return `${paramsCode} => ${body}`;
        }
        emitYieldExpression(node, context = {}) {
          const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
          const target = context.blockParamName ?? "__block";
          const call = args.length ? `${target}(${args})` : `${target}()`;
          return `${target} ? ${call} : undefined`;
        }
        emitBlockGiven(context = {}) {
          const target = context.blockParamName ?? "__block";
          return `typeof ${target} === 'function'`;
        }
        emitSuperCall(node, context = {}) {
          const methodName = context.currentMethodName;
          const isStatic = context.methodType === "static";
          const hasArgs = node.arguments && node.arguments.length > 0;
          const argExpressions = hasArgs ? node.arguments.map((arg) => this.emitExpression(arg, context)) : [];
          const argList = argExpressions.join(", ");
          if (methodName) {
            const accessor = this.isValidMethodName(methodName) ? `super.${methodName}` : `super[${this.quote(methodName)}]`;
            const receiver = isStatic ? "this" : "this";
            const guardLines = [];
            guardLines.push(`(() => {`);
            guardLines.push(`  const __superMethod = ${accessor};`);
            guardLines.push(`  if (typeof __superMethod !== 'function') {`);
            if (methodName === "method_missing") {
              const receiverExpr = isStatic ? "this" : "this";
              const missingExpr = argExpressions.length ? argExpressions[0] : "arguments[0]";
              guardLines.push(`    throw new Error("NoMethodError: undefined method " + String(${missingExpr}) + " for " + String(${receiverExpr}));`);
            } else {
              guardLines.push(`    throw new Error(${this.quote(`NoMethodError: super has no method ${methodName}`)});`);
            }
            guardLines.push("  }");
            if (hasArgs) {
              guardLines.push(`  return __superMethod.call(${receiver}${argList.length ? ", " + argList : ""});`);
            } else {
              guardLines.push(`  return __superMethod.apply(${receiver}, arguments);`);
            }
            guardLines.push("})()");
            return guardLines.join(" ");
          }
          if (hasArgs) {
            return `super(${argList})`;
          }
          return "super(...arguments)";
        }
        resolveDefineMethodTarget(context, callee) {
          if (callee && callee.type === "MemberExpression") {
            return `${this.emitExpression(callee.object, context)}.prototype`;
          }
          if (context.methodType === "static") {
            return "this.prototype";
          }
          if (context.classLevel && context.currentClassName) {
            return `${context.currentClassName}.prototype`;
          }
          return "this";
        }
        resolveImplicitReceiver(context) {
          if (context.methodType === "static") return "this";
          if (context.classLevel && context.currentClassName) {
            return `${context.currentClassName}.prototype`;
          }
          return "this";
        }
        emitDefineMethod(node, context) {
          if (!node.block) {
            const callee = this.emitExpression(node.callee, context);
            const args = node.arguments.map((arg) => this.emitExpression(arg, context)).join(", ");
            return `${callee}(${args})`;
          }
          const nameArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
          const target = this.resolveDefineMethodTarget(context, node.callee);
          const blockContext = { ...context, methodType: "instance" };
          delete blockContext.classLevel;
          const fn = this.emitBlockFunction(node.block, blockContext, { asFunction: true });
          return `${target}[${nameArg}] = ${fn}`;
        }
        emitInstanceVariableGet(node, context, receiverCode) {
          const target = receiverCode ?? this.resolveImplicitReceiver(context);
          const arg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
          this.requireRuntime("ivarName");
          return `${target}[__rubyIvarName(${arg})]`;
        }
        emitInstanceVariableSet(node, context, receiverCode) {
          const target = receiverCode ?? this.resolveImplicitReceiver(context);
          const nameArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : "undefined";
          const valueArg = node.arguments[1] ? this.emitExpression(node.arguments[1], context) : "undefined";
          this.requireRuntime("ivarName");
          return `${target}[__rubyIvarName(${nameArg})] = ${valueArg}`;
        }
        emitBeginRescueExpression(node, context = {}) {
          const resultVar = this.generateUniqueId("__result");
          const handledVar = this.generateUniqueId("__handled");
          const errorVar = this.generateUniqueId("__error");
          const lines = ["(() => {"];
          this.indentLevel += 1;
          lines.push(`${this.indent()}let ${resultVar};`);
          lines.push(`${this.indent()}let ${handledVar} = false;`);
          const bodyScope = this.scopeInfo.get(node.body);
          const tryContext = {
            ...context,
            scopeNode: node.body,
            scopeStack: [node.body, ...context.scopeStack || []],
            inFunction: true,
            allowImplicitReturn: true
          };
          const bodyCode = this.emitFunctionBody(node.body, tryContext, bodyScope);
          lines.push(`${this.indent()}try {`);
          this.indentLevel += 1;
          lines.push(`${this.indent()}${resultVar} = (() => ${bodyCode}).call(this);`);
          if (node.elseBody) {
            const elseScope = this.scopeInfo.get(node.elseBody);
            const elseContext = {
              ...context,
              scopeNode: node.elseBody,
              scopeStack: [node.elseBody, ...context.scopeStack || []],
              inFunction: true,
              allowImplicitReturn: true
            };
            const elseCode = this.emitFunctionBody(node.elseBody, elseContext, elseScope);
            lines.push(`${this.indent()}${resultVar} = (() => ${elseCode}).call(this);`);
          }
          this.indentLevel -= 1;
          lines.push(`${this.indent()}} catch (${errorVar}) {`);
          this.indentLevel += 1;
          if (node.rescues && node.rescues.length) {
            for (const clause of node.rescues) {
              const condition = this.buildRescueCondition(clause, errorVar, context);
              const clauseScope = this.scopeInfo.get(clause.body);
              const clauseContext = {
                ...context,
                scopeNode: clause.body,
                scopeStack: [clause.body, ...context.scopeStack || []],
                inFunction: true,
                allowImplicitReturn: true
              };
              const clauseBody = this.emitFunctionBody(clause.body, clauseContext, clauseScope);
              lines.push(`${this.indent()}if (!${handledVar} && ${condition}) {`);
              this.indentLevel += 1;
              if (clause.binding) {
                const bindingName = this.getRenamedName(clauseScope, clause.binding.name);
                lines.push(`${this.indent()}const ${bindingName} = ${errorVar};`);
              }
              lines.push(`${this.indent()}${resultVar} = (() => ${clauseBody}).call(this);`);
              lines.push(`${this.indent()}${handledVar} = true;`);
              this.indentLevel -= 1;
              lines.push(`${this.indent()}}`);
            }
          }
          lines.push(`${this.indent()}if (!${handledVar}) throw ${errorVar};`);
          this.indentLevel -= 1;
          if (node.ensureBody) {
            const ensureBlock = this.emitBlockStatement(node.ensureBody, {
              ...context,
              scopeStack: [node.ensureBody, ...context.scopeStack || []]
            });
            lines.push(`${this.indent()}} finally ${ensureBlock}`);
          } else {
            lines.push(`${this.indent()}}`);
          }
          lines.push(`${this.indent()}return ${resultVar};`);
          this.indentLevel -= 1;
          lines.push(`${this.indent()}})();`);
          return lines.join("\n");
        }
        buildRescueCondition(clause, errorVar, context) {
          if (!clause.exceptions || !clause.exceptions.length) {
            return "true";
          }
          this.requireRuntime("rescueMatch");
          const expressions = clause.exceptions.map((exception) => this.emitRescueMatcher(exception, context));
          const matcherList = expressions.join(", ");
          return `__rubyRescueMatch(${errorVar}, [${matcherList}])`;
        }
        emitRescueMatcher(node, context) {
          if (!node) return "undefined";
          if (node.type === "Identifier" && /^[A-Z]/.test(node.name)) {
            return this.quote(node.name);
          }
          return this.emitExpression(node, context);
        }
        instanceVariableReference(name) {
          return `this.${this.instanceVariableKey(name)}`;
        }
        instanceVariableKey(name) {
          return `__${name}`;
        }
        isTimeNowExpression(node) {
          if (!node) return false;
          if (node.type === "CallExpression") {
            return this.isTimeNowExpression(node.callee);
          }
          if (node.type === "MemberExpression" && !node.computed) {
            const isNow = node.property.type === "Identifier" && node.property.name === "now";
            if (isNow) {
              return node.object && node.object.type === "Identifier" && node.object.name === "Time";
            }
            return false;
          }
          return false;
        }
        emitMemberExpression(node, context) {
          const objectContext = {
            ...context,
            disableMethodLookup: true,
            allowGlobalIdentifier: true
          };
          if (node.object && node.object.type === "Identifier" && context.methodType === "static" && this.isMethodName(node.object.name, context)) {
            objectContext.disableMethodLookup = false;
            objectContext.allowGlobalIdentifier = false;
          }
          const objectCode = this.emitExpression(node.object, objectContext);
          if (node.computed) {
            const propertyCode = this.emitExpression(node.property, context);
            return `${objectCode}[${propertyCode}]`;
          }
          return `${objectCode}.${node.property.name}`;
        }
        emitOptionalMemberExpression(node, context) {
          const objectContext = {
            ...context,
            disableMethodLookup: true,
            allowGlobalIdentifier: true
          };
          if (node.object && node.object.type === "Identifier" && context.methodType === "static" && this.isMethodName(node.object.name, context)) {
            objectContext.disableMethodLookup = false;
            objectContext.allowGlobalIdentifier = false;
          }
          let objectCode = this.emitExpression(node.object, objectContext);
          if (["LogicalExpression", "BinaryExpression", "ConditionalExpression"].includes(node.object.type)) {
            objectCode = `(${objectCode})`;
          }
          if (node.computed) {
            const propertyCode = this.emitExpression(node.property, context);
            return `${objectCode}?.[${propertyCode}]`;
          }
          return `${objectCode}?.${node.property.name}`;
        }
        emitObjectLiteral(node, context) {
          const props = node.properties.map((prop) => {
            const key = this.formatObjectKey(prop.key);
            const value = this.emitExpression(prop.value, context);
            return `${key}: ${value}`;
          });
          return `{ ${props.join(", ")} }`;
        }
        emitBinaryExpression(node, context) {
          if (node.operator === "<<") {
            this.requireRuntime("arrayPush");
            const left2 = this.emitExpression(node.left, context);
            const right2 = this.emitExpression(node.right, context);
            return `__rubyArrayPush(${left2}, ${right2})`;
          }
          if (node.operator === "-") {
            this.requireRuntime("minus");
            const leftExpr = this.emitExpression(node.left, context);
            const rightExpr = this.emitExpression(node.right, context);
            return `__rubyMinus(${leftExpr}, ${rightExpr})`;
          }
          const left = node.left.type === "LogicalExpression" ? `(${this.emitExpression(node.left, context)})` : this.emitExpression(node.left, context);
          const right = node.right.type === "LogicalExpression" ? `(${this.emitExpression(node.right, context)})` : this.emitExpression(node.right, context);
          return `${left} ${this.mapBinaryOperator(node.operator)} ${right}`;
        }
        emitStringLiteral(node, context) {
          if (!node.value.includes("#{")) {
            return this.quote(node.value);
          }
          const parts = this.splitInterpolatedString(node.value);
          const rendered = parts.map((part) => {
            if (part.type === "text") {
              return this.escapeTemplateText(part.value);
            }
            const expressionNode = this.parseEmbeddedExpression(part.value);
            return "${" + this.emitExpression(expressionNode, context) + "}";
          });
          return "`" + rendered.join("") + "`";
        }
        emitRegExpLiteral(node) {
          let source = node.pattern.replace(/\\A/g, "^").replace(/\\z/g, "$");
          const pattern = JSON.stringify(source).slice(1, -1);
          let filteredFlags = (node.flags || "").replace(/[^gimuy]/g, "");
          if (!filteredFlags.includes("u") && /\(\?<[^>]+>/.test(source)) {
            filteredFlags += "u";
          }
          return `new RegExp("${pattern}", "${filteredFlags}")`;
        }
        emitRangeExpression(node, context) {
          this.requireRuntime("range");
          const wrapIfNeeded = (subNode, code) => {
            if (!subNode) return code;
            const needsParens = /* @__PURE__ */ new Set([
              "BinaryExpression",
              "LogicalExpression",
              "ConditionalExpression",
              "AssignmentExpression",
              "RangeExpression"
            ]);
            return needsParens.has(subNode.type) ? `(${code})` : code;
          };
          const start = this.emitExpression(node.start, context);
          const end = this.emitExpression(node.end, context);
          const startCode = wrapIfNeeded(node.start, start);
          const endCode = wrapIfNeeded(node.end, end);
          const exclusiveFlag = node.exclusive ? "true" : "false";
          return `__rubyRange(${startCode}, ${endCode}, ${exclusiveFlag})`;
        }
        emitMethodDefinition(node, context = {}) {
          const scope = this.scopeInfo.get(node);
          const indent = this.indent();
          const isStatic = context.inClass && node.target && node.target.type === "SelfExpression";
          const isConstructor = !isStatic && context.inClass && node.id.name === "initialize";
          const methodName = isConstructor ? "constructor" : node.id.name;
          const parameterAnalysis = this.prepareMethodParameters(node.params, scope, { usesYield: !!node.usesYield });
          const paramsCode = parameterAnalysis.paramSignature.join(", ");
          let header;
          const isTopLevelMethod = !context.inClass && !context.inModule && !context.singletonTarget && !context.currentClassName;
          if (context.inClass) {
            if (isConstructor) {
              header = `${indent}${methodName}(${paramsCode})`;
            } else {
              const methodKey = this.isValidMethodName(methodName) ? methodName : `[${this.quote(methodName)}]`;
              const prefix = isStatic ? "static " : "";
              header = `${indent}${prefix}${methodKey}(${paramsCode})`;
            }
          } else {
            if (this.isValidMethodName(methodName)) {
              header = `${indent}function ${methodName}(${paramsCode})`;
            } else {
              const tempName = this.generateUniqueId("__method");
              header = `${indent}const ${tempName} = function(${paramsCode})`;
            }
          }
          const allowImplicitReturn = !(context.inClass && methodName === "constructor");
          const body = this.emitFunctionBody(
            node.body,
            {
              ...context,
              scopeNode: node,
              scopeStack: [node, ...context.scopeStack || []],
              inFunction: true,
              allowImplicitReturn,
              methodType: isStatic ? "static" : isTopLevelMethod ? "instance" : "instance",
              topLevelMethod: isTopLevelMethod,
              blockParamName: parameterAnalysis.blockParamName,
              optionalParams: parameterAnalysis.optionalParams,
              blockFromRest: parameterAnalysis.blockFromRest,
              methodBlockInfo: parameterAnalysis.blockFromRest,
              currentMethodName: methodName,
              ...parameterAnalysis.genericInfo ? { genericArgsInfo: parameterAnalysis.genericInfo } : {}
            },
            scope
          );
          let result = `${header} ${body}`;
          if (isTopLevelMethod && this.isValidMethodName(methodName)) {
            result += `
${indent}if (typeof globalThis !== "undefined") { globalThis.${methodName} = ${methodName}; }`;
          }
          return result;
        }
        emitFunctionBody(bodyNode, context, scope) {
          let code = "{\n";
          this.indentLevel += 1;
          const lines = [];
          if (scope) {
            for (const name of [...scope.hoisted].sort()) {
              const safeName = this.getRenamedName(scope, name);
              lines.push(this.indent() + `let ${safeName};`);
            }
          }
          if (context.genericArgsInfo) {
            const setup = this.buildGenericArgsHandling(context.genericArgsInfo, context);
            lines.push(...setup.lines);
            if (setup.forwardingInfo) {
              context.forwardingInfo = setup.forwardingInfo;
            }
          }
          if (context.optionalParams && context.optionalParams.length) {
            for (const param of context.optionalParams) {
              const defaultValue = this.emitExpression(param.default, context);
              lines.push(this.indent() + `if (${param.name} === undefined) ${param.name} = ${defaultValue};`);
            }
          }
          if (context.blockFromRest && context.blockFromRest.rest && context.blockFromRest.block) {
            const restName = context.blockFromRest.rest;
            const blockName = context.blockFromRest.block;
            const candidate = this.generateUniqueId("__blockCandidate");
            const candidateDecl = `${candidate}`;
            const blockCheck = `typeof ${candidateDecl} === 'function'`;
            lines.push(this.indent() + `const ${candidateDecl} = ${restName}.length ? ${restName}[${restName}.length - 1] : undefined;`);
            lines.push(this.indent() + `const ${blockName} = ${blockCheck} ? ${candidateDecl} : undefined;`);
            lines.push(this.indent() + `if (${blockCheck}) ${restName}.pop();`);
          }
          for (let index = 0; index < bodyNode.body.length; index += 1) {
            const statement = bodyNode.body[index];
            const isTail = index === bodyNode.body.length - 1;
            const stmtContext = { ...context, isTail };
            delete stmtContext.blockFromRest;
            delete stmtContext.optionalParams;
            delete stmtContext.genericArgsInfo;
            const stmt = this.emitStatement(statement, stmtContext);
            if (stmt) lines.push(stmt);
          }
          this.indentLevel -= 1;
          if (lines.length) {
            code += lines.join("\n") + "\n" + this.indent() + "}";
          } else {
            code += this.indent() + "}";
          }
          return code;
        }
        buildGenericArgsHandling(info, context) {
          const lines = [];
          const indent = this.indent();
          const argsName = info.rawArgsName;
          const forwardingInfo = {};
          const needsBlock = !!info.blockParamName || info.usesYield || info.forwarding;
          const blockVarName = info.blockParamName || (info.usesYield || info.forwarding ? "__block" : null);
          if (needsBlock) {
            const candidate = this.generateUniqueId("__blockCandidate");
            lines.push(`${indent}const ${candidate} = ${argsName}.length ? ${argsName}[${argsName}.length - 1] : undefined;`);
            lines.push(`${indent}const ${blockVarName} = typeof ${candidate} === 'function' ? ${candidate} : undefined;`);
            lines.push(`${indent}if (typeof ${candidate} === 'function') ${argsName}.pop();`);
            context.blockParamName = blockVarName;
            forwardingInfo.blockName = blockVarName;
          }
          const hasExplicitKeywords = info.keywordRequired.length > 0 || info.keywordOptional.length > 0 || !!info.keywordRest;
          const needsKeywordHandling = hasExplicitKeywords || info.forwarding;
          let keywordVarName = null;
          if (needsKeywordHandling) {
            keywordVarName = info.keywordVarName || this.generateUniqueId("__kwargs");
            info.keywordVarName = keywordVarName;
            const candidate = this.generateUniqueId("__kwCandidate");
            const baseValue = hasExplicitKeywords ? "{}" : "undefined";
            lines.push(`${indent}let ${keywordVarName} = ${baseValue};`);
            lines.push(`${indent}if (${argsName}.length) {`);
            lines.push(`${indent}  const ${candidate} = ${argsName}[${argsName}.length - 1];`);
            lines.push(`${indent}  if (${candidate} && typeof ${candidate} === 'object' && !Array.isArray(${candidate})) {`);
            lines.push(`${indent}    ${keywordVarName} = ${candidate};`);
            lines.push(`${indent}    ${argsName}.pop();`);
            lines.push(`${indent}  } else if (${hasExplicitKeywords ? "true" : "false"}) {`);
            if (hasExplicitKeywords) {
              lines.push(`${indent}    ${keywordVarName} = {};`);
            }
            lines.push(`${indent}  } else {`);
            lines.push(`${indent}    ${keywordVarName} = undefined;`);
            lines.push(`${indent}  }`);
            lines.push(`${indent}}`);
            if (hasExplicitKeywords) {
              lines.push(`${indent}if (${keywordVarName} === undefined) ${keywordVarName} = {};`);
            }
            forwardingInfo.keywordName = keywordVarName;
          }
          const positionalAssignments = info.positional || [];
          for (const entry of positionalAssignments) {
            lines.push(`${indent}const ${entry.name} = ${argsName}.length ? ${argsName}.shift() : undefined;`);
          }
          const optionalAssignments = info.optional || [];
          for (const entry of optionalAssignments) {
            const defaultCode = this.emitExpression(entry.default, context);
            lines.push(`${indent}let ${entry.name} = ${argsName}.length ? ${argsName}.shift() : undefined;`);
            lines.push(`${indent}if (${entry.name} === undefined) ${entry.name} = ${defaultCode};`);
          }
          if (info.rest) {
            lines.push(`${indent}const ${info.rest} = ${argsName}.splice(0);`);
          } else if (!info.forwarding) {
            lines.push(`${indent}if (${argsName}.length) {`);
            lines.push(`${indent}  throw new Error("ArgumentError: wrong number of arguments");`);
            lines.push(`${indent}}`);
          }
          let usedKeysSet = null;
          if (hasExplicitKeywords && (info.keywordRequired.length || info.keywordOptional.length || !info.keywordRest)) {
            usedKeysSet = this.generateUniqueId("__kwUsed");
            lines.push(`${indent}const ${usedKeysSet} = new Set();`);
          }
          const hasOwnCall = (keyLiteral) => `Object.prototype.hasOwnProperty.call(${keywordVarName}, ${keyLiteral})`;
          for (const entry of info.keywordRequired || []) {
            const keyLiteral = this.quote(entry.key);
            lines.push(`${indent}if (${keywordVarName} === undefined || !${hasOwnCall(keyLiteral)}) {`);
            lines.push(`${indent}  throw new Error(${this.quote(`ArgumentError: missing keyword: ${entry.key}`)});`);
            lines.push(`${indent}}`);
            lines.push(`${indent}const ${entry.name} = ${keywordVarName}[${keyLiteral}];`);
            if (usedKeysSet) {
              lines.push(`${indent}${usedKeysSet}.add(${keyLiteral});`);
            }
          }
          for (const entry of info.keywordOptional || []) {
            const keyLiteral = this.quote(entry.key);
            const defaultCode = this.emitExpression(entry.default, context);
            if (!hasExplicitKeywords) {
              lines.push(`${indent}const ${entry.name} = ${defaultCode};`);
            } else {
              lines.push(`${indent}let ${entry.name} = ${keywordVarName} && ${hasOwnCall(keyLiteral)} ? ${keywordVarName}[${keyLiteral}] : ${defaultCode};`);
            }
            if (usedKeysSet) {
              lines.push(`${indent}${usedKeysSet}.add(${keyLiteral});`);
            }
          }
          if (info.keywordRest) {
            lines.push(`${indent}const ${info.keywordRest} = {};`);
            lines.push(`${indent}if (${keywordVarName} && typeof ${keywordVarName} === 'object') {`);
            lines.push(`${indent}  for (const __key in ${keywordVarName}) {`);
            lines.push(`${indent}    if (!Object.prototype.hasOwnProperty.call(${keywordVarName}, __key)) continue;`);
            if (usedKeysSet) {
              lines.push(`${indent}    if (${usedKeysSet}.has(__key)) continue;`);
            }
            lines.push(`${indent}    ${info.keywordRest}[__key] = ${keywordVarName}[__key];`);
            lines.push(`${indent}  }`);
            lines.push(`${indent}}`);
          } else if (hasExplicitKeywords) {
            const unknownKeys = this.generateUniqueId("__unknownKw");
            lines.push(`${indent}const ${unknownKeys} = [];`);
            lines.push(`${indent}for (const __key in ${keywordVarName}) {`);
            lines.push(`${indent}  if (!Object.prototype.hasOwnProperty.call(${keywordVarName}, __key)) continue;`);
            if (usedKeysSet) {
              lines.push(`${indent}  if (${usedKeysSet}.has(__key)) continue;`);
            }
            lines.push(`${indent}  ${unknownKeys}.push(__key);`);
            lines.push(`${indent}}`);
            lines.push(`${indent}if (${unknownKeys}.length) {`);
            lines.push(`${indent}  throw new Error("ArgumentError: unknown keyword" + (${unknownKeys}.length > 1 ? "s" : "") + ": " + ${unknownKeys}.join(', '));`);
            lines.push(`${indent}}`);
          }
          if (info.forwarding) {
            const forwardArgs = this.generateUniqueId("__forwardArgs");
            lines.push(`${indent}const ${forwardArgs} = ${argsName}.slice();`);
            forwardingInfo.positionalName = forwardArgs;
            forwardingInfo.keywordName = keywordVarName || "undefined";
            forwardingInfo.blockName = blockVarName || "undefined";
          }
          return { lines, forwardingInfo: info.forwarding ? forwardingInfo : null };
        }
        emitBlockFunction(block, context = {}, options = {}) {
          const params = this.resolveBlockParameters(block);
          const scope = this.scopeInfo.get(block);
          const baseContext = { ...context };
          delete baseContext.blockFromRest;
          delete baseContext.optionalParams;
          const forceImplicit = options.forceImplicitIdentifiers ?? baseContext.forceImplicitIdentifiers ?? false;
          const fnContext = {
            ...baseContext,
            scopeNode: block,
            scopeStack: [block, ...baseContext.scopeStack || []],
            inFunction: true,
            allowImplicitReturn: options.allowImplicitReturn !== void 0 ? options.allowImplicitReturn : true,
            forceImplicitIdentifiers: forceImplicit
          };
          const body = this.emitFunctionBody(block.body, fnContext, scope);
          const paramList = params.join(", ");
          const innerFunction = `function(${paramList}) ${body}`;
          if (options.asFunction) {
            return innerFunction;
          }
          const selfVar = this.generateUniqueId("__self");
          const blockVar = this.generateUniqueId("__block");
          const argsVar = this.generateUniqueId("__args");
          const prevVar = this.generateUniqueId("__prev");
          const lines = [];
          lines.push("(() => {");
          lines.push(`  let ${selfVar} = this;`);
          lines.push(`  const ${blockVar} = function(...${argsVar}) {`);
          lines.push(`    return (${innerFunction}).apply(${selfVar}, ${argsVar});`);
          lines.push("  };");
          lines.push(`  ${blockVar}.__rubyBind = (value) => {`);
          lines.push(`    const ${prevVar} = ${selfVar};`);
          lines.push(`    ${selfVar} = value;`);
          lines.push("    return () => {");
          lines.push(`      ${selfVar} = ${prevVar};`);
          lines.push("    };");
          lines.push("  };");
          lines.push(`  return ${blockVar};`);
          lines.push("})()");
          return lines.join("\n");
        }
        resolveBlockParameters(block) {
          const scope = this.scopeInfo.get(block);
          if (block.params && block.params.length) {
            return block.params.map((param) => this.getRenamedName(scope, param.name));
          }
          const inferred = this.inferImplicitParams(block.body);
          if (scope) {
            inferred.forEach((name) => scope.declared.add(name));
          }
          return inferred;
        }
        inferImplicitParams(body) {
          const names = /* @__PURE__ */ new Set();
          const visit = (node) => {
            if (!node || typeof node !== "object") return;
            if (Array.isArray(node)) {
              node.forEach(visit);
              return;
            }
            switch (node.type) {
              case "Identifier":
                if (/^_[0-9]+$/.test(node.name)) {
                  names.add(node.name);
                }
                break;
              case "LambdaExpression":
                return;
              case "BlockStatement":
                node.body.forEach(visit);
                return;
              default:
                for (const key in node) {
                  if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
                  const value = node[key];
                  if (key === "params") continue;
                  if (key === "body" && node.type === "LambdaExpression") continue;
                  visit(value);
                }
            }
          };
          visit(body);
          return Array.from(names).sort((a, b) => {
            const numA = parseInt(a.slice(1), 10);
            const numB = parseInt(b.slice(1), 10);
            return numA - numB;
          });
        }
        emitClassDeclaration(node, context = {}) {
          const indent = this.indent();
          const extendsPart = node.superClass ? ` extends ${this.emitExpression(node.superClass, context)}` : "";
          const className = node.id.name;
          const { body, trailing } = this.emitClassBody(node.body, { ...context, currentClassName: className });
          let code = `${indent}class ${className}${extendsPart} ${body}`;
          if (trailing.length) {
            code += "\n" + trailing.map((line) => `${indent}${line}`).join("\n");
          }
          return code;
        }
        emitSingletonClassDeclaration(node, context = {}) {
          const indent = this.indent();
          let targetCode;
          if (node.target && node.target.type === "SelfExpression" && context.currentClassName) {
            targetCode = context.currentClassName;
          } else {
            targetCode = this.emitExpression(node.target, context);
          }
          const targetVar = this.generateUniqueId("__singleton");
          const lines = [`${indent}(() => {`];
          this.indentLevel += 1;
          const innerIndent = this.indent();
          lines.push(`${innerIndent}const ${targetVar} = ${targetCode};`);
          lines.push(`${innerIndent}if (${targetVar} == null) { return; }`);
          const bodyContext = {
            ...context,
            singletonTarget: targetVar,
            scopeStack: [node.body, ...context.scopeStack || []]
          };
          const bodyIndentLevel = this.indentLevel;
          for (const statement of node.body.body) {
            this.indentLevel = bodyIndentLevel;
            if (statement.type === "MethodDefinition") {
              lines.push(this.emitSingletonMethodDefinition(statement, bodyContext));
            } else {
              const emitted = this.emitStatement(statement, bodyContext);
              if (emitted) lines.push(emitted);
            }
          }
          this.indentLevel = bodyIndentLevel - 1;
          lines.push(`${this.indent()}})();`);
          return lines.join("\n");
        }
        emitSingletonMethodDefinition(node, context = {}) {
          const scope = this.scopeInfo.get(node);
          const indent = this.indent();
          const methodName = node.id.name;
          const parameterAnalysis = this.prepareMethodParameters(node.params, scope, { usesYield: !!node.usesYield });
          const paramsCode = parameterAnalysis.paramSignature.join(", ");
          const fnContext = {
            ...context,
            scopeNode: node,
            scopeStack: [node, ...context.scopeStack || []],
            inFunction: true,
            allowImplicitReturn: true,
            methodType: "static",
            blockParamName: parameterAnalysis.blockParamName,
            optionalParams: parameterAnalysis.optionalParams,
            blockFromRest: parameterAnalysis.blockFromRest,
            currentMethodName: methodName,
            ...parameterAnalysis.genericInfo ? { genericArgsInfo: parameterAnalysis.genericInfo } : {}
          };
          const bodyCode = this.emitFunctionBody(node.body, fnContext, scope);
          const accessor = this.isValidMethodName(methodName) ? `${context.singletonTarget}.${methodName}` : `${context.singletonTarget}[${this.quote(methodName)}]`;
          return `${indent}${accessor} = function(${paramsCode}) ${bodyCode};`;
        }
        emitModuleMethodDefinition(node, context = {}) {
          const scope = this.scopeInfo.get(node);
          const moduleName = context.currentModuleName;
          const indent = this.indent();
          const methodName = node.id.name;
          const parameterAnalysis = this.prepareMethodParameters(node.params, scope, { usesYield: !!node.usesYield });
          const paramsCode = parameterAnalysis.paramSignature.join(", ");
          const fnContext = {
            ...context,
            scopeNode: node,
            scopeStack: [node, ...context.scopeStack || []],
            inFunction: true,
            allowImplicitReturn: true,
            methodType: "module",
            blockParamName: parameterAnalysis.blockParamName,
            optionalParams: parameterAnalysis.optionalParams,
            blockFromRest: parameterAnalysis.blockFromRest,
            currentMethodName: methodName,
            ...parameterAnalysis.genericInfo ? { genericArgsInfo: parameterAnalysis.genericInfo } : {}
          };
          const bodyCode = this.emitFunctionBody(node.body, fnContext, scope);
          const accessor = this.isValidMethodName(methodName) ? `${moduleName}.${methodName}` : `${moduleName}[${this.quote(methodName)}]`;
          return `${indent}${accessor} = function(${paramsCode}) ${bodyCode};`;
        }
        emitDefineSingletonMethodCall(node, context, info) {
          const { objectCode, inlineBlockNode, blockCode, processedArgs } = info;
          this.requireRuntime("defineSingleton");
          const nameArg = node.arguments[0];
          const nameExpr = this.resolveDefineSingletonName(nameArg, context);
          let fnExpr = null;
          if (inlineBlockNode) {
            fnExpr = this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true, asFunction: true });
          } else if (blockCode) {
            fnExpr = blockCode;
          } else if (node.arguments[1]) {
            fnExpr = this.emitExpression(node.arguments[1], context);
          } else if (processedArgs.length) {
            fnExpr = processedArgs[processedArgs.length - 1].code;
          }
          if (!fnExpr) {
            fnExpr = "undefined";
          }
          const target = objectCode ?? this.emitExpression(node.callee.object, context);
          return `__rubyDefineSingleton(${target}, ${nameExpr}, ${fnExpr})`;
        }
        resolveDefineSingletonName(node, context) {
          if (!node) return "undefined";
          if (node.type === "SymbolLiteral") {
            return this.quote(node.name);
          }
          if (node.type === "StringLiteral") {
            return this.quote(node.value);
          }
          return this.emitExpression(node, context);
        }
        emitIncludeCall(node, context = {}) {
          if (!node.arguments.length) return "";
          const mixin = this.emitExpression(node.arguments[0], context);
          const target = context.currentClassName || this.resolveImplicitCallReceiver(context);
          this.requireRuntime("includeMixin");
          return `__rubyInclude(${target}, ${mixin})`;
        }
        emitExtendCall(node, context = {}) {
          if (!node.arguments.length) return "";
          const mixin = this.emitExpression(node.arguments[0], context);
          const target = context.currentClassName || this.resolveImplicitCallReceiver(context);
          this.requireRuntime("extendMixin");
          return `__rubyExtend(${target}, ${mixin})`;
        }
        emitPrependCall(node, context = {}) {
          if (!node.arguments.length) return "";
          const mixin = this.emitExpression(node.arguments[0], context);
          const target = context.currentClassName || this.resolveImplicitCallReceiver(context);
          this.requireRuntime("prependMixin");
          return `__rubyPrepend(${target}, ${mixin})`;
        }
        emitModuleDeclaration(node, context = {}) {
          const indent = this.indent();
          const moduleName = node.id.name;
          const lines = [`${indent}const ${moduleName} = {};`];
          const moduleContext = { ...context, inModule: true, currentModuleName: moduleName };
          this.indentLevel += 1;
          for (const statement of node.body.body) {
            let stmt;
            if (statement.type === "MethodDefinition") {
              stmt = this.emitModuleMethodDefinition(statement, moduleContext);
            } else {
              stmt = this.emitStatement(statement, moduleContext);
            }
            if (stmt) lines.push(stmt);
          }
          this.indentLevel -= 1;
          return lines.join("\n");
        }
        emitUsingStatement(node) {
          const indent = this.indent();
          return `${indent}// using ${node.id.name}`;
        }
        emitClassBody(bodyNode, context) {
          let code = "{\n";
          this.indentLevel += 1;
          const lines = [];
          const trailing = [];
          const classScopeStack = [bodyNode, ...context.scopeStack || []];
          for (const statement of bodyNode.body) {
            if (statement.type === "MethodDefinition") {
              const stmtCode = this.emitMethodDefinition(statement, {
                ...context,
                inClass: true,
                scopeNode: statement,
                scopeStack: classScopeStack
              });
              if (stmtCode) lines.push(stmtCode);
            } else {
              const stmtCode = this.emitStatement(statement, {
                ...context,
                classLevel: true,
                inClass: true,
                scopeStack: classScopeStack
              });
              if (stmtCode) trailing.push(stmtCode.replace(/^\s+/, ""));
            }
          }
          this.indentLevel -= 1;
          if (lines.length) {
            code += lines.join("\n") + "\n" + this.indent() + "}";
          } else {
            code += this.indent() + "}";
          }
          return { body: code, trailing };
        }
        emitIfStatement(node, context = {}, options = {}) {
          const indent = this.indent();
          const keyword = options.isElseIf ? "else if" : "if";
          const branchContext = context.isTail ? context : { ...context, allowImplicitReturn: false };
          let code = `${indent}${keyword} (${this.emitExpression(node.test, context)}) ${this.emitBlockStatement(node.consequent, branchContext)}`;
          if (node.alternate) {
            if (node.alternate.type === "IfStatement") {
              code += "\n" + this.emitIfStatement(node.alternate, context, { isElseIf: true });
            } else {
              code += "\n" + indent + "else " + this.emitBlockStatement(node.alternate, branchContext);
            }
          }
          return code;
        }
        emitWhileStatement(node, context = {}) {
          const indent = this.indent();
          return `${indent}while (${this.emitExpression(node.test, context)}) ${this.emitBlockStatement(node.body, context)}`;
        }
        emitLoopStatement(node, context = {}) {
          const indent = this.indent();
          return `${indent}while (true) ${this.emitBlockStatement(node.body, context)}`;
        }
        emitReturnStatement(node, context = {}) {
          if (!node.argument) return "return;";
          return `return ${this.emitExpression(node.argument, context)};`;
        }
        emitBlockStatement(node, context = {}) {
          let code = "{\n";
          this.indentLevel += 1;
          const lines = [];
          for (let index = 0; index < node.body.length; index += 1) {
            const statement = node.body[index];
            const isTail = index === node.body.length - 1;
            const stmtContext = { ...context, isTail };
            const stmt = this.emitStatement(statement, stmtContext);
            if (stmt) lines.push(stmt);
          }
          this.indentLevel -= 1;
          if (lines.length) {
            code += lines.join("\n") + "\n" + this.indent() + "}";
          } else {
            code += this.indent() + "}";
          }
          return code;
        }
        emitCaseStatement(node, context = {}) {
          if (!node.clauses.length) return "";
          const indent = this.indent();
          const lines = [];
          const preludeLines = [];
          const clauseInfos = [];
          const hasPatternClause = node.clauses.some((clause) => clause.type === "PatternClause");
          let valueReference = node.test ? this.emitCaseTestExpression(node.test, context) : null;
          if (hasPatternClause && valueReference) {
            const caseVar = this.generateUniqueId("__case");
            preludeLines.push(`${indent}const ${caseVar} = ${valueReference};`);
            valueReference = caseVar;
          }
          for (const clause of node.clauses) {
            if (clause.type === "PatternClause") {
              const matcher = this.buildPatternMatcher(clause, valueReference ?? "undefined", context, indent);
              preludeLines.push(...matcher.setupLines);
              const block = this.prependBlockLines(
                this.emitBlockStatement(clause.body, context),
                matcher.bindingLines
              );
              clauseInfos.push({ condition: matcher.condition, block });
            } else {
              const condition = this.emitCaseCondition(valueReference, clause, context);
              const block = this.emitBlockStatement(clause.body, context);
              clauseInfos.push({ condition, block });
            }
          }
          lines.push(...preludeLines);
          clauseInfos.forEach((info, index) => {
            const keyword = index === 0 ? "if" : "else if";
            lines.push(`${indent}${keyword} (${info.condition}) ${info.block}`);
          });
          if (node.alternate) {
            lines.push(`${indent}else ${this.emitBlockStatement(node.alternate, context)}`);
          }
          return lines.join("\n");
        }
        emitCaseCondition(valueReference, clause, context) {
          const expressions = clause.tests.map((test) => this.emitExpression(test, context));
          if (valueReference) {
            return expressions.map((expr) => `${valueReference} === ${expr}`).join(" || ");
          }
          if (expressions.length === 0) return "true";
          return expressions.join(" || ");
        }
        emitCaseTestExpression(node, context) {
          if (!node) return null;
          if (node.type === "Identifier") {
            return node.name;
          }
          return this.emitExpression(node, context);
        }
        buildPatternMatcher(clause, valueExpression, context, baseIndent) {
          const matchVar = this.generateUniqueId("__pattern");
          const step = " ".repeat(this.indentSize);
          const indent1 = baseIndent + step;
          const indent2 = indent1 + step;
          const bindingsVar = this.generateUniqueId("__bindings");
          const clauseScope = this.scopeInfo.get(clause.body);
          const guardContext = {
            ...context,
            scopeStack: [clause.body, ...context.scopeStack || []]
          };
          const patternState = {
            baseIndent,
            indent1,
            indent2,
            indentStep: step,
            bindingsVar,
            clauseScope,
            guardContext,
            bindingInfos: [],
            context,
            lines: []
          };
          patternState.lines.push(`${indent1}if (__value == null) return null;`);
          patternState.lines.push(`${indent1}const ${bindingsVar} = {};`);
          const success = this.appendPattern(clause.pattern, "__value", patternState);
          if (!success) {
            return {
              setupLines: [`${baseIndent}const ${matchVar} = null;`],
              condition: matchVar,
              bindingLines: []
            };
          }
          if (clause.guard) {
            const guardCode = this.emitExpression(clause.guard.condition, guardContext);
            if (clause.guard.negated) {
              patternState.lines.push(`${indent1}if (${guardCode}) return null;`);
            } else {
              patternState.lines.push(`${indent1}if (!(${guardCode})) return null;`);
            }
          }
          patternState.lines.push(`${indent1}return ${bindingsVar};`);
          const setupLines = [
            `${baseIndent}const ${matchVar} = (() => {`,
            `${indent1}const __value = ${valueExpression};`,
            ...patternState.lines,
            `${baseIndent}})();`
          ];
          const bindingIndent = baseIndent + step;
          const bindingLines = patternState.bindingInfos.map((info) => `${bindingIndent}const ${info.safeName} = ${matchVar}.${info.safeName};`);
          return { setupLines, condition: matchVar, bindingLines };
        }
        appendPattern(pattern, valueVar, state) {
          if (!pattern || typeof pattern !== "object") return false;
          switch (pattern.type) {
            case "HashPattern":
              return this.appendHashPattern(pattern, valueVar, state);
            case "ArrayPattern":
              return this.appendArrayPattern(pattern, valueVar, state);
            case "Identifier": {
              const safeName = this.getRenamedName(state.clauseScope, pattern.name);
              state.lines.push(`${state.indent1}const ${safeName} = ${valueVar};`);
              state.lines.push(`${state.indent1}${state.bindingsVar}.${safeName} = ${safeName};`);
              state.bindingInfos.push({ safeName });
              return true;
            }
            default:
              return false;
          }
        }
        appendHashPattern(pattern, valueVar, state) {
          state.lines.push(`${state.indent1}if (typeof ${valueVar} !== 'object') return null;`);
          for (const entry of pattern.entries) {
            const accessVar = this.generateUniqueId("__prop");
            const foundVar = this.generateUniqueId("__found");
            const keys = this.resolvePatternKeyExpressions(entry.key, state.context);
            state.lines.push(`${state.indent1}let ${foundVar} = false;`);
            state.lines.push(`${state.indent1}let ${accessVar};`);
            for (const expr of keys) {
              state.lines.push(`${state.indent1}if (!${foundVar} && Object.prototype.hasOwnProperty.call(${valueVar}, ${expr})) {`);
              state.lines.push(`${state.indent2}${foundVar} = true;`);
              state.lines.push(`${state.indent2}${accessVar} = ${valueVar}[${expr}];`);
              state.lines.push(`${state.indent1}}`);
            }
            state.lines.push(`${state.indent1}if (!${foundVar}) return null;`);
            if (entry.value) {
              if (entry.value.type === "PinExpression") {
                const pinExpr = this.emitExpression(entry.value.expression, state.context);
                state.lines.push(`${state.indent1}if (${accessVar} !== ${pinExpr}) return null;`);
              } else {
                return false;
              }
            }
            if (entry.binding && entry.binding.name) {
              const safeName = this.getRenamedName(state.clauseScope, entry.binding.name);
              state.lines.push(`${state.indent1}const ${safeName} = ${accessVar};`);
              state.lines.push(`${state.indent1}${state.bindingsVar}.${safeName} = ${safeName};`);
              state.bindingInfos.push({ safeName });
            }
          }
          return true;
        }
        appendArrayPattern(pattern, valueVar, state) {
          state.lines.push(`${state.indent1}if (!Array.isArray(${valueVar})) return null;`);
          const required = pattern.elements.length;
          if (pattern.rest) {
            state.lines.push(`${state.indent1}if (${valueVar}.length < ${required}) return null;`);
          } else {
            state.lines.push(`${state.indent1}if (${valueVar}.length !== ${required}) return null;`);
          }
          for (let index = 0; index < pattern.elements.length; index += 1) {
            const element = pattern.elements[index];
            const elementVar = this.generateUniqueId("__elem");
            state.lines.push(`${state.indent1}const ${elementVar} = ${valueVar}[${index}];`);
            if (!element) continue;
            if (element.type === "Identifier") {
              const safeName = this.getRenamedName(state.clauseScope, element.name);
              state.lines.push(`${state.indent1}const ${safeName} = ${elementVar};`);
              state.lines.push(`${state.indent1}${state.bindingsVar}.${safeName} = ${safeName};`);
              state.bindingInfos.push({ safeName });
              continue;
            }
            if (element.type === "PinExpression") {
              const pinExpr = this.emitExpression(element.expression, state.context);
              state.lines.push(`${state.indent1}if (${elementVar} !== ${pinExpr}) return null;`);
              continue;
            }
            return false;
          }
          if (pattern.rest && pattern.rest.name) {
            const startIndex = pattern.elements.length;
            const safeName = this.getRenamedName(state.clauseScope, pattern.rest.name);
            state.lines.push(`${state.indent1}const ${safeName} = ${valueVar}.slice(${startIndex});`);
            state.lines.push(`${state.indent1}${state.bindingsVar}.${safeName} = ${safeName};`);
            state.bindingInfos.push({ safeName });
          }
          return true;
        }
        resolvePatternKeyExpressions(keyNode, context) {
          if (!keyNode) return ["undefined"];
          switch (keyNode.type) {
            case "SymbolLiteral": {
              const literal = this.quote(keyNode.name);
              const symbolExpr = `Symbol.for(${literal})`;
              return Array.from(/* @__PURE__ */ new Set([literal, symbolExpr]));
            }
            case "Identifier": {
              const literal = this.quote(keyNode.name);
              const symbolExpr = `Symbol.for(${literal})`;
              return Array.from(/* @__PURE__ */ new Set([literal, symbolExpr]));
            }
            case "StringLiteral":
              return [this.quote(keyNode.value)];
            default:
              return [this.emitExpression(keyNode, context)];
          }
        }
        convertFunctionToArrow(fnSource) {
          if (typeof fnSource !== "string") return fnSource;
          if (!/^function\s*\(/.test(fnSource)) return fnSource;
          const paramsConverted = fnSource.replace(/^function\s*\(/, "(");
          return paramsConverted.replace(/\)\s*{/, ") => {");
        }
        isRubyExceptionConstant(name) {
          const known = /* @__PURE__ */ new Set([
            "ArgumentError",
            "RuntimeError",
            "StandardError",
            "TypeError",
            "NameError",
            "NoMethodError",
            "IndexError",
            "KeyError",
            "RangeError",
            "IOError",
            "EOFError",
            "SystemCallError"
          ]);
          return known.has(name);
        }
        prependBlockLines(block, lines) {
          if (!lines.length) return block;
          const parts = block.split("\n");
          parts.splice(1, 0, ...lines);
          return parts.join("\n");
        }
        collectPattern(pattern, scope) {
          if (!pattern || typeof pattern !== "object") return;
          switch (pattern.type) {
            case "HashPattern":
              for (const entry of pattern.entries) {
                if (entry.binding && entry.binding.name) {
                  scope.declared.add(entry.binding.name);
                  this.registerReservedName(scope, entry.binding.name);
                }
                if (entry.value) this.collectPattern(entry.value, scope);
              }
              break;
            case "ArrayPattern":
              for (const element of pattern.elements) {
                this.collectPattern(element, scope);
              }
              if (pattern.rest && pattern.rest.name) {
                scope.declared.add(pattern.rest.name);
                this.registerReservedName(scope, pattern.rest.name);
              }
              break;
            case "PinExpression":
              this.collectNode(pattern.expression, scope);
              break;
            case "Identifier":
              scope.declared.add(pattern.name);
              this.registerReservedName(scope, pattern.name);
              break;
            default:
              this.collectNode(pattern, scope);
              break;
          }
        }
        splitInterpolatedString(value) {
          const parts = [];
          let cursor = 0;
          while (cursor < value.length) {
            const start = value.indexOf("#{", cursor);
            if (start === -1) {
              const text2 = value.slice(cursor);
              if (text2.length) parts.push({ type: "text", value: text2 });
              break;
            }
            const text = value.slice(cursor, start);
            if (text.length) parts.push({ type: "text", value: text });
            let depth = 1;
            let index = start + 2;
            let expression = "";
            while (index < value.length && depth > 0) {
              const char = value[index];
              if (char === "{") {
                depth += 1;
                expression += char;
              } else if (char === "}") {
                depth -= 1;
                if (depth === 0) {
                  index += 1;
                  break;
                }
                expression += char;
              } else {
                expression += char;
              }
              index += 1;
            }
            if (depth !== 0) {
              throw new Error("Unterminated interpolation in string literal");
            }
            parts.push({ type: "expression", value: expression.trim() });
            cursor = index;
          }
          return parts;
        }
        escapeTemplateText(text) {
          return text.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
        }
        parseEmbeddedExpression(fragment) {
          const tokenizer = new Tokenizer(fragment);
          const tokens = tokenizer.tokenize();
          const parser = new Parser(tokens);
          const ast = parser.parse();
          if (ast.body.length !== 1) {
            throw new Error("Interpolation expressions must resolve to a single expression");
          }
          const statement = ast.body[0];
          if (statement.type !== "ExpressionStatement") {
            throw new Error("Interpolation expressions must be valid Ruby expressions");
          }
          return statement.expression;
        }
        mapBinaryOperator(op) {
          if (op === "==") return "===";
          if (op === "!=") return "!==";
          return op;
        }
        getStringBangInfo(name) {
          const mapping = {
            "capitalize!": { helper: "__rubyCapitalizeBang", runtime: "capitalizeBang", dependencies: ["capitalize"] },
            "reverse!": { helper: "__rubyReverseBang", runtime: "reverseBang" },
            "upcase!": { helper: "__rubyUpcaseBang", runtime: "upcaseBang" },
            "downcase!": { helper: "__rubyDowncaseBang", runtime: "downcaseBang" },
            "strip!": { helper: "__rubyStripBang", runtime: "stripBang", dependencies: ["strip"] },
            "swapcase!": { helper: "__rubySwapcaseBang", runtime: "swapcaseBang", dependencies: ["swapcase"] }
          };
          return mapping[name] || null;
        }
        generateUniqueId(prefix = "__temp") {
          this.uniqueIdCounter += 1;
          return `${prefix}${this.uniqueIdCounter}`;
        }
        quote(value) {
          const escaped = value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/"/g, '\\"');
          return `"${escaped}"`;
        }
        isReservedIdentifier(name) {
          return this.reservedWords.has(name);
        }
        isValidMethodName(name) {
          if (!name) return false;
          if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) return false;
          return !this.isReservedIdentifier(name);
        }
        registerReservedName(scope, name) {
          if (!scope || !name || !this.isReservedIdentifier(name)) return;
          if (!scope.renamed) scope.renamed = /* @__PURE__ */ new Map();
          if (scope.renamed.has(name)) return;
          let suffix = "_";
          let candidate = `${name}${suffix}`;
          const taken = new Set(scope.renamed ? [...scope.renamed.values()] : []);
          while (this.isReservedIdentifier(candidate) || taken.has(candidate)) {
            suffix += "_";
            candidate = `${name}${suffix}`;
          }
          scope.renamed.set(name, candidate);
        }
        reserveName(scope, name) {
          if (!scope || !name) return;
          if (!scope.renamed) scope.renamed = /* @__PURE__ */ new Map();
          if (scope.renamed.has(name)) return scope.renamed.get(name);
          const taken = /* @__PURE__ */ new Set([
            ...scope.declared ? scope.declared : [],
            ...scope.hoisted ? scope.hoisted : [],
            ...scope.renamed ? scope.renamed.values() : []
          ]);
          let index = 0;
          let candidate;
          do {
            candidate = index === 0 ? `__${name}` : `__${name}${index}`;
            index += 1;
          } while (taken.has(candidate) || this.isReservedIdentifier(candidate));
          scope.renamed.set(name, candidate);
          if (scope.declared && scope.declared.has(name)) {
            scope.declared.delete(name);
            scope.declared.add(candidate);
          }
          if (scope.hoisted && scope.hoisted.has(name)) {
            scope.hoisted.delete(name);
            scope.hoisted.add(candidate);
          }
          return candidate;
        }
        getRenamedName(scope, name) {
          if (!scope || !name) return name;
          if (scope.renamed && scope.renamed.has(name)) {
            return scope.renamed.get(name);
          }
          return name;
        }
        isIdentifierDeclared(name, context = {}) {
          if (!name) return false;
          const stack = [];
          if (context.scopeStack && context.scopeStack.length) {
            stack.push(...context.scopeStack);
          }
          if (context.scopeNode && !stack.includes(context.scopeNode)) {
            stack.push(context.scopeNode);
          }
          for (const scopeNode of stack) {
            const scope = this.scopeInfo.get(scopeNode);
            if (scope && scope.declared && scope.declared.has(name)) {
              return true;
            }
          }
          return false;
        }
        isDeclaredInScopeChain(name, scope) {
          let current = scope;
          while (current) {
            if (current.declared) {
              if (current.declared.has(name)) return true;
              if (current.renamed && current.renamed.has(name)) {
                const mapped = current.renamed.get(name);
                if (current.declared.has(mapped)) return true;
              }
            }
            current = current.parent ?? null;
          }
          return false;
        }
        isMethodName(name, context = {}) {
          if (!name) return false;
          const stack = [];
          if (context.scopeStack && context.scopeStack.length) {
            stack.push(...context.scopeStack);
          }
          if (context.scopeNode && !stack.includes(context.scopeNode)) {
            stack.push(context.scopeNode);
          }
          for (const scopeNode of stack) {
            const scope = this.scopeInfo.get(scopeNode);
            if (scope && scope.methods && scope.methods.has(name)) {
              return true;
            }
          }
          return false;
        }
        resolveImplicitCallReceiver(context = {}) {
          if (context && typeof context.implicitReceiver === "string") {
            return context.implicitReceiver;
          }
          if (context && context.topLevelMethod) {
            return "globalThis";
          }
          if (context && context.scopeNode && context.scopeNode.type === "Program") {
            return "globalThis";
          }
          if (context.methodType === "static" && context.currentClassName) {
            return "this";
          }
          if (context.classLevel && context.currentClassName) {
            return context.currentClassName;
          }
          return "this";
        }
        resolveIdentifierName(name, context = {}) {
          if (!name) return name;
          const stack = context.scopeStack && context.scopeStack.length ? context.scopeStack : context.scopeNode ? [context.scopeNode] : [];
          for (const scopeNode of stack) {
            const scope = this.scopeInfo.get(scopeNode);
            if (scope && scope.renamed && scope.renamed.has(name)) {
              return scope.renamed.get(name);
            }
          }
          return name;
        }
        formatObjectKey(keyNode) {
          if (!keyNode) return "undefined";
          switch (keyNode.type) {
            case "Identifier":
              return keyNode.name;
            case "StringLiteral":
              return this.quote(keyNode.value);
            case "SymbolLiteral":
              return keyNode.name;
            default:
              return this.emitExpression(keyNode);
          }
        }
        indent() {
          return " ".repeat(this.indentLevel * this.indentSize);
        }
        collectProgram(node) {
          if (this.scopeInfo.has(node)) return;
          const scope = this.createScope(null);
          scope.kind = "program";
          this.scopeInfo.set(node, scope);
          for (const statement of node.body) {
            this.collectNode(statement, scope);
          }
        }
        collectMethod(node, parentScope = null) {
          if (this.scopeInfo.has(node)) return;
          if (parentScope && node.id && node.id.name && this.isValidMethodName(node.id.name)) {
            const name = node.id.name;
            if (parentScope.declared && parentScope.declared.has(name) || parentScope.hoisted && parentScope.hoisted.has(name)) {
              this.reserveName(parentScope, name);
            }
            if (parentScope.kind === "program") {
              parentScope.declared.add(name);
            }
            if (parentScope.methods) {
              parentScope.methods.add(name);
            }
          } else if (parentScope && parentScope.methods && node.id && node.id.name) {
            parentScope.methods.add(node.id.name);
          }
          const scope = this.createScope(parentScope);
          for (const param of node.params) {
            if (!param) continue;
            if (param.name) {
              scope.declared.add(param.name);
              this.registerReservedName(scope, param.name);
            }
            if (param.type === "OptionalParameter" && param.default) {
              this.collectNode(param.default, scope);
            }
            if (param.type === "KeywordOptionalParameter" && param.default) {
              this.collectNode(param.default, scope);
            }
          }
          if (node.usesYield && !node.params.some((param) => param.type === "BlockParameter")) {
            scope.declared.add("__block");
          }
          this.scopeInfo.set(node, scope);
          this.collectNode(node.body, scope);
        }
        createScope(parent = null) {
          return { declared: /* @__PURE__ */ new Set(), hoisted: /* @__PURE__ */ new Set(), renamed: /* @__PURE__ */ new Map(), methods: /* @__PURE__ */ new Set(), parent };
        }
        collectNode(node, scope) {
          if (!node || typeof node !== "object") return;
          switch (node.type) {
            case "Program":
              this.collectProgram(node);
              break;
            case "BlockStatement":
              for (const stmt of node.body) this.collectNode(stmt, scope);
              break;
            case "ExpressionStatement":
              this.collectNode(node.expression, scope);
              break;
            case "AssignmentExpression":
              this.recordAssignment(node.left, scope);
              this.collectNode(node.right, scope);
              break;
            case "MultiAssignmentExpression":
              if (Array.isArray(node.targets)) {
                for (const target of node.targets) {
                  this.recordAssignment(target, scope);
                }
              }
              this.collectNode(node.right, scope);
              break;
            case "BinaryExpression":
            case "LogicalExpression":
              this.collectNode(node.left, scope);
              this.collectNode(node.right, scope);
              break;
            case "UnaryExpression":
              this.collectNode(node.argument, scope);
              break;
            case "CallExpression":
              this.collectNode(node.callee, scope);
              for (const arg of node.arguments) this.collectNode(arg, scope);
              if (node.block) this.collectBlock(node.block, scope);
              break;
            case "MemberExpression":
              this.collectNode(node.object, scope);
              if (node.computed) this.collectNode(node.property, scope);
              break;
            case "OptionalMemberExpression":
              this.collectNode(node.object, scope);
              if (node.computed) this.collectNode(node.property, scope);
              break;
            case "ArrayExpression":
              for (const element of node.elements) this.collectNode(element, scope);
              break;
            case "HashExpression":
              for (const prop of node.properties) this.collectNode(prop.value, scope);
              break;
            case "IfStatement":
              this.collectNode(node.test, scope);
              this.collectNode(node.consequent, scope);
              if (node.alternate) this.collectNode(node.alternate, scope);
              break;
            case "WhileStatement":
              this.collectNode(node.test, scope);
              this.collectNode(node.body, scope);
              break;
            case "LoopStatement":
              this.collectNode(node.body, scope);
              break;
            case "ReturnStatement":
              if (node.argument) this.collectNode(node.argument, scope);
              break;
            case "ConditionalExpression":
              this.collectNode(node.test, scope);
              this.collectNode(node.consequent, scope);
              this.collectNode(node.alternate, scope);
              break;
            case "CaseStatement":
              if (node.test) this.collectNode(node.test, scope);
              for (const clause of node.clauses) {
                if (clause.type === "PatternClause") {
                  this.collectPattern(clause.pattern, scope);
                } else if (clause.tests) {
                  for (const test of clause.tests) this.collectNode(test, scope);
                }
                this.collectNode(clause.body, scope);
              }
              if (node.alternate) this.collectNode(node.alternate, scope);
              break;
            case "MethodDefinition":
              this.collectMethod(node, scope);
              break;
            case "LambdaExpression":
              this.collectLambda(node, scope);
              break;
            case "SingletonClassDeclaration":
              this.collectNode(node.target, scope);
              this.collectNode(node.body, scope);
              break;
            case "BeginRescueExpression":
              this.collectNode(node.body, scope);
              if (node.rescues) {
                for (const clause of node.rescues) {
                  if (clause.binding && clause.binding.name) {
                    scope.declared.add(clause.binding.name);
                    this.registerReservedName(scope, clause.binding.name);
                  }
                  for (const ex of clause.exceptions || []) {
                    this.collectNode(ex, scope);
                  }
                  this.collectNode(clause.body, scope);
                }
              }
              if (node.elseBody) this.collectNode(node.elseBody, scope);
              if (node.ensureBody) this.collectNode(node.ensureBody, scope);
              break;
            case "ToProcExpression":
              this.collectNode(node.argument, scope);
              break;
            case "BlockPassExpression":
              this.collectNode(node.expression, scope);
              break;
            case "YieldExpression":
              for (const argument of node.arguments) this.collectNode(argument, scope);
              break;
            case "ClassDeclaration":
              if (!this.scopeInfo.has(node.body)) {
                const classScope = this.createScope(scope);
                classScope.kind = "class";
                this.scopeInfo.set(node.body, classScope);
                this.collectNode(node.body, classScope);
              } else {
                const classScope = this.scopeInfo.get(node.body);
                this.collectNode(node.body, classScope);
              }
              break;
            case "ModuleDeclaration":
              if (node.body) this.collectNode(node.body, scope);
              break;
            default:
              break;
          }
        }
        collectBlock(block, parentScope) {
          if (!block || this.scopeInfo.has(block)) return;
          const scope = this.createScope(parentScope);
          for (const param of block.params) {
            scope.declared.add(param.name);
            this.registerReservedName(scope, param.name);
          }
          if (!block.params.length) {
            const inferred = this.inferImplicitParams(block.body);
            inferred.forEach((name) => scope.declared.add(name));
          }
          this.scopeInfo.set(block, scope);
          this.collectNode(block.body, scope);
        }
        collectLambda(node, parentScope) {
          if (this.scopeInfo.has(node)) return;
          const scope = this.createScope(parentScope);
          for (const param of node.params) {
            scope.declared.add(param.name);
            this.registerReservedName(scope, param.name);
          }
          if (!node.params.length) {
            const inferred = this.inferImplicitParams(node.body);
            inferred.forEach((name) => scope.declared.add(name));
          }
          this.scopeInfo.set(node, scope);
          this.collectNode(node.body, scope);
        }
        recordAssignment(target, scope) {
          if (!target || !scope) return;
          if (target.type === "Identifier") {
            const original = target.name;
            if (this.isDeclaredInScopeChain(original, scope.parent ?? null)) return;
            if (!scope.renamed || !scope.renamed.has(original)) {
              this.registerReservedName(scope, original);
            }
            const mapped = scope.renamed && scope.renamed.has(original) ? scope.renamed.get(original) : original;
            if (!scope.declared.has(mapped)) {
              scope.declared.add(mapped);
              scope.hoisted.add(mapped);
            }
          } else if (target.type === "MemberExpression") {
            this.collectNode(target.object, scope);
            if (target.computed) this.collectNode(target.property, scope);
          }
        }
      };
      module.exports = { Emitter };
    }
  });

  // src/transpiler.js
  var require_transpiler = __commonJS({
    "src/transpiler.js"(exports, module) {
      var { Tokenizer } = require_tokenizer();
      var { Parser } = require_parser();
      var { Emitter } = require_emitter();
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
    }
  });
  return require_transpiler();
})();
