class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
    this.allowMultiAssign = true;
  }

  parse() {
    const body = [];
    while (!this.check('EOF')) {
      this.skipNewlines();
      if (this.check('EOF')) break;
      body.push(this.parseStatement());
      this.consumeStatementTerminator();
    }
    return { type: 'Program', body };
  }

  parseStatement() {
    this.allowMultiAssign = true;
    if (this.match('KEYWORD', 'def')) return this.parseMethodDefinition();
    if (this.match('KEYWORD', 'class')) return this.parseClassDefinition();
    if (this.match('KEYWORD', 'module')) return this.parseModuleDeclaration();
    if (this.match('KEYWORD', 'if')) return this.parseIfStatement();
    if (this.match('KEYWORD', 'while')) return this.parseWhileStatement();
    if (this.match('KEYWORD', 'loop')) return this.parseLoopStatement();
    if (this.match('KEYWORD', 'case')) return this.parseCaseStatement();
    if (this.match('KEYWORD', 'return')) return this.parseReturnStatement();
    if (this.match('KEYWORD', 'break')) return { type: 'BreakStatement' };
    if (this.match('KEYWORD', 'using')) return this.parseUsingStatement();

    const expr = this.parseAssignment();

    if (this.check('KEYWORD', 'if') || this.check('KEYWORD', 'unless')) {
      const modifier = this.advance();
      const test = this.parseExpression();
      const expressionStmt = { type: 'ExpressionStatement', expression: expr };
      if (modifier.value === 'if') {
        return {
          type: 'IfStatement',
          test,
          consequent: { type: 'BlockStatement', body: [expressionStmt] },
          alternate: null
        };
      }

      return {
        type: 'IfStatement',
        test,
        consequent: null,
        alternate: { type: 'BlockStatement', body: [expressionStmt] }
      };
    }

    return { type: 'ExpressionStatement', expression: expr };
  }

  parseMethodDefinition() {
    const { target, name } = this.parseMethodTargetAndName();

    const params = this.parseMethodParameters();

    this.consumeStatementTerminator();
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close method definition");

    const bodyNode = { type: 'BlockStatement', body };
    const methodNode = {
      type: 'MethodDefinition',
      id: { type: 'Identifier', name },
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

    if (this.check('KEYWORD', 'self') && this.peekNextIs('.')) {
      this.advance(); // consume self
      target = { type: 'SelfExpression' };
      this.advance(); // consume '.'
      const name = this.parseMethodName();
      return { target, name };
    }

    if (this.check('IDENTIFIER') && this.peekNextIs('.')) {
      const receiver = this.advance();
      target = { type: 'Identifier', name: receiver.value };
      this.advance(); // consume '.'
      const name = this.parseMethodName();
      return { target, name };
    }

    const name = this.parseMethodName();
    return { target, name };
  }

  parseMethodName() {
    if (this.check('IDENTIFIER') || this.check('KEYWORD')) {
      const token = this.advance();
      let name = token.value;
      if (this.match('OPERATOR', '=')) {
        name += '=';
      }
      return name;
    }

    if (this.match('OPERATOR', '[')) {
      this.consume('OPERATOR', ']', "Expected ']' after '[' in method name");
      let name = '[]';
      if (this.match('OPERATOR', '=')) {
        name += '=';
      }
      return name;
    }

    const operatorToken = this.matchOperatorMethodToken();
    if (operatorToken) {
      return operatorToken;
    }

    throw new SyntaxError('Expected method name after def');
  }

  matchOperatorMethodToken() {
    const token = this.peek();
    if (!token || token.type !== 'OPERATOR') return null;

    const simpleOperators = new Set([
      '+', '-', '*', '/', '%', '**', '<<', '>>', '&', '|', '^', '<', '<=', '>', '>=', '==', '===', '!=',
      '<=>', '=~', '!~', '!', '~'
    ]);

    if (token.value === '+' || token.value === '-' || token.value === '~') {
      this.advance();
      if (this.match('OPERATOR', '@')) {
        return token.value + '@';
      }
      if (this.check('OPERATOR', '=')) {
        this.advance();
        return token.value + '=';
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
    const nameToken = this.consume('IDENTIFIER', undefined, 'Expected module name');
    this.consumeStatementTerminator();
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close module");
    return {
      type: 'ModuleDeclaration',
      id: { type: 'Identifier', name: nameToken.value },
      body: { type: 'BlockStatement', body }
    };
  }

  parseUsingStatement() {
    const nameToken = this.consumeIdentifier('Expected refinement module name after using');
    return {
      type: 'UsingStatement',
      id: { type: 'Identifier', name: nameToken.value }
    };
  }

  parseMethodParameters() {
    const params = [];
    if (!this.match('OPERATOR', '(')) {
      return params;
    }

    if (!this.check('OPERATOR', ')')) {
      while (true) {
        if (this.match('OPERATOR', '...')) {
          params.push({ type: 'ForwardingParameter' });
          break;
        }

        if (this.match('OPERATOR', '**')) {
          const kwRest = this.consumeIdentifier('Expected keyword rest parameter name');
          params.push({ type: 'KeywordRestParameter', name: kwRest.value });
          if (!this.match('OPERATOR', ',')) break;
          continue;
        }

        if (this.match('OPERATOR', '*')) {
          if (this.match('OPERATOR', '*')) {
            const kwRest = this.consumeIdentifier('Expected keyword rest parameter name');
            params.push({ type: 'KeywordRestParameter', name: kwRest.value });
          } else {
            const rest = this.consumeIdentifier('Expected rest parameter name');
            params.push({ type: 'RestParameter', name: rest.value });
          }
          if (!this.match('OPERATOR', ',')) break;
          continue;
        }

        if (this.match('OPERATOR', '&')) {
          if (this.check('IDENTIFIER') || this.check('KEYWORD')) {
            const block = this.advance();
            params.push({ type: 'BlockParameter', name: block.value });
          } else {
            params.push({ type: 'BlockParameter', name: '__block' });
          }
          if (!this.match('OPERATOR', ',')) break;
          continue;
        }

        const paramToken = this.consumeIdentifier('Expected parameter name');

        if (this.match('OPERATOR', '=')) {
          const defaultValue = this.parseExpression();
          params.push({
            type: 'OptionalParameter',
            name: paramToken.value,
            default: defaultValue
          });
          if (!this.match('OPERATOR', ',')) break;
          continue;
        }

        if (this.check('OPERATOR', ':')) {
          this.advance();
          this.skipNewlines();
          if (this.check('OPERATOR', ',') || this.check('OPERATOR', ')')) {
            params.push({ type: 'KeywordParameter', name: paramToken.value });
          } else {
            const defaultValue = this.parseExpression();
            params.push({
              type: 'KeywordOptionalParameter',
              name: paramToken.value,
              default: defaultValue
            });
          }
          if (!this.match('OPERATOR', ',')) break;
          continue;
        }

        params.push({ type: 'Identifier', name: paramToken.value });
        if (!this.match('OPERATOR', ',')) break;
      }
    }

    this.consume('OPERATOR', ')', 'Expected closing ) after parameters');
    return params;
  }

  parseClassDefinition() {
    if (this.match('OPERATOR', '<<')) {
      const target = this.parseExpression();
      this.consumeStatementTerminator();
      const body = this.parseBlock(['end']);
      this.consume('KEYWORD', 'end', "Expected 'end' to close singleton class block");
      return {
        type: 'SingletonClassDeclaration',
        target,
        body: { type: 'BlockStatement', body }
      };
    }

    const nameToken = this.consume('IDENTIFIER', undefined, 'Expected class name');
    let superClass = null;
    if (this.match('OPERATOR', '<')) {
      superClass = this.parsePrimary();
    }

    this.consumeStatementTerminator();
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close class");

    return {
      type: 'ClassDeclaration',
      id: { type: 'Identifier', name: nameToken.value },
      superClass,
      body: { type: 'BlockStatement', body }
    };
  }

  parseIfStatement() {
    const test = this.parseExpression();
    this.consumeOptionalThen();
    this.consumeStatementTerminator();
    const consequent = this.parseBlock(['elsif', 'else', 'end']);

    let alternate = null;
    if (this.match('KEYWORD', 'elsif')) {
      alternate = this.parseIfStatement();
    } else if (this.match('KEYWORD', 'else')) {
      this.consumeStatementTerminator();
      const alternateBody = this.parseBlock(['end']);
      this.consume('KEYWORD', 'end', "Expected 'end' to close else branch");
      alternate = { type: 'BlockStatement', body: alternateBody };
      return {
        type: 'IfStatement',
        test,
        consequent: { type: 'BlockStatement', body: consequent },
        alternate
      };
    } else {
      this.consume('KEYWORD', 'end', "Expected 'end' to close if statement");
    }

    return {
      type: 'IfStatement',
      test,
      consequent: { type: 'BlockStatement', body: consequent },
      alternate
    };
  }

  parseWhileStatement() {
    const test = this.parseExpression();
    this.consumeStatementTerminator();
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close while");
    return {
      type: 'WhileStatement',
      test,
      body: { type: 'BlockStatement', body }
    };
  }

  parseLoopStatement() {
    this.consume('KEYWORD', 'do', "Expected 'do' after loop");
    this.consumeStatementTerminator();
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close loop");
    return {
      type: 'LoopStatement',
      body: { type: 'BlockStatement', body }
    };
  }

  parseCaseStatement() {
    let test = null;
    if (!this.check('NEWLINE') && !this.check('KEYWORD', 'when') && !this.check('KEYWORD', 'in')) {
      test = this.parseExpression();
    }
    this.consumeStatementTerminator();

    const clauses = [];
    while (true) {
      if (this.match('KEYWORD', 'when')) {
        const tests = [];
        do {
          tests.push(this.parseExpression());
        } while (this.match('OPERATOR', ','));
        this.consumeStatementTerminator();
        const body = this.parseBlock(['when', 'in', 'else', 'end']);
        clauses.push({ type: 'WhenClause', tests, body: { type: 'BlockStatement', body } });
        continue;
      }
      if (this.match('KEYWORD', 'in')) {
        const pattern = this.parsePattern();
        let guard = null;
        if (this.match('KEYWORD', 'if')) {
          guard = { type: 'PatternGuard', condition: this.parseExpression(), negated: false };
        } else if (this.match('KEYWORD', 'unless')) {
          guard = { type: 'PatternGuard', condition: this.parseExpression(), negated: true };
        }
        this.match('KEYWORD', 'then');
        this.consumeStatementTerminator();
        const body = this.parseBlock(['when', 'in', 'else', 'end']);
        clauses.push({ type: 'PatternClause', pattern, guard, body: { type: 'BlockStatement', body } });
        continue;
      }
      break;
    }

    let alternate = null;
    if (this.match('KEYWORD', 'else')) {
      this.consumeStatementTerminator();
      const altBody = this.parseBlock(['end']);
      alternate = { type: 'BlockStatement', body: altBody };
    }

    this.consume('KEYWORD', 'end', "Expected 'end' to close case statement");

    return { type: 'CaseStatement', test, clauses, alternate };
  }

  parseReturnStatement() {
    if (this.isTerminator(this.peek())) {
      return { type: 'ReturnStatement', argument: null };
    }
    const argument = this.parseExpression();
    const statement = { type: 'ReturnStatement', argument };
    if (this.match('KEYWORD', 'if') || this.match('KEYWORD', 'unless')) {
      const keyword = this.previous().value;
      const test = this.parseExpression();
      if (keyword === 'if') {
        return {
          type: 'IfStatement',
          test,
          consequent: { type: 'BlockStatement', body: [statement] },
          alternate: null
        };
      }
      return {
        type: 'IfStatement',
        test: { type: 'UnaryExpression', operator: '!', argument: test },
        consequent: { type: 'BlockStatement', body: [statement] },
        alternate: null
      };
    }
    return statement;
  }

  parsePattern() {
    if (this.match('OPERATOR', '{')) {
      return this.parseHashPattern(true);
    }
    if (this.match('OPERATOR', '[')) {
      return this.parseArrayPattern(true);
    }
    if (this.check('IDENTIFIER')) {
      const identifier = this.advance();
      return { type: 'Identifier', name: identifier.value };
    }
    if (this.match('OPERATOR', '*')) {
      const restName = this.consumeIdentifier('Expected identifier after * in pattern');
      return { type: 'RestPattern', argument: { type: 'Identifier', name: restName.value } };
    }
    return this.parseExpression();
  }

  parseHashPattern(openConsumed = false) {
    if (!openConsumed) {
      this.consume('OPERATOR', '{', "Expected '{' to start hash pattern");
    }
    const entries = [];
    while (!this.check('OPERATOR', '}')) {
      this.skipNewlines();
      if (this.check('OPERATOR', '}')) break;

      let keyNode;
      let binding = null;
      let value = null;

      if (this.check('STRING')) {
        const keyToken = this.advance();
        keyNode = { type: 'StringLiteral', value: keyToken.value };
        this.consume('OPERATOR', '=>', "Expected '=>' after string key in pattern");
        const bindingToken = this.consume('IDENTIFIER', undefined, 'Expected binding name in pattern');
        binding = { type: 'Identifier', name: bindingToken.value };
      } else if (this.check('IDENTIFIER')) {
        const labelToken = this.advance();
        keyNode = { type: 'SymbolLiteral', name: labelToken.value };
        this.consume('OPERATOR', ':', "Expected ':' after key in pattern");
        if (this.check('IDENTIFIER') && !this.peekNextIs(':')) {
          const bindingToken = this.advance();
          binding = { type: 'Identifier', name: bindingToken.value };
        } else if (this.check('OPERATOR', '^')) {
          this.advance();
          value = { type: 'PinExpression', expression: this.parseExpression() };
        } else if (this.check('OPERATOR', '{')) {
          value = this.parseHashPattern();
        } else if (this.check('OPERATOR', '[')) {
          value = this.parseArrayPattern();
        } else if (this.isPatternValueStart(this.peek())) {
          value = this.parsePatternValue();
        } else {
          binding = { type: 'Identifier', name: labelToken.value };
        }
      } else {
        throw new SyntaxError('Unsupported hash pattern entry');
      }

      entries.push({ key: keyNode, binding, value });
      this.match('OPERATOR', ',');
      this.skipNewlines();
    }

    this.consume('OPERATOR', '}', "Expected '}' to close pattern");
    return { type: 'HashPattern', entries };
  }

  parseArrayPattern(openConsumed = false) {
    if (!openConsumed) {
      this.consume('OPERATOR', '[', "Expected '[' to start array pattern");
    }

    const elements = [];
    let restElement = null;

    while (!this.check('OPERATOR', ']')) {
      this.skipNewlines();
      if (this.check('OPERATOR', ']')) break;

      if (this.match('OPERATOR', '*')) {
        if (this.check('IDENTIFIER')) {
          const token = this.advance();
          restElement = { type: 'Identifier', name: token.value };
        } else {
          restElement = { type: 'Identifier', name: null };
        }
        break;
      }

      const element = this.parsePatternValue();
      elements.push(element);
      this.skipNewlines();
      if (!this.match('OPERATOR', ',')) break;
    }

    this.consume('OPERATOR', ']', "Expected ']' to close pattern");
    return { type: 'ArrayPattern', elements, rest: restElement };
  }

  parsePatternValue() {
    if (this.match('OPERATOR', '^')) {
      return { type: 'PinExpression', expression: this.parseExpression() };
    }

    if (this.match('OPERATOR', '{')) {
      return this.parseHashPattern(true);
    }

    if (this.match('OPERATOR', '[')) {
      return this.parseArrayPattern(true);
    }

    if (this.check('IDENTIFIER')) {
      const token = this.advance();
      return { type: 'Identifier', name: token.value };
    }

    return this.parseExpression();
  }

  isPatternValueStart(token) {
    if (!token) return false;
    if (token.type === 'IDENTIFIER') return true;
    if (token.type === 'NUMBER' || token.type === 'STRING') return true;
    if (token.type === 'OPERATOR' && ['{', '[', '^'].includes(token.value)) return true;
    return false;
  }

  parseBlock(stopKeywords) {
    const body = [];
    while (!this.check('EOF') && !this.checkAny(stopKeywords)) {
      this.skipNewlines();
      if (this.checkAny(stopKeywords)) break;
      body.push(this.parseStatement());
      this.consumeStatementTerminator();
    }
    return body;
  }

  parseAssignment() {
    const left = this.parseRescueExpression();
    if (this.allowMultiAssign && this.check('OPERATOR', ',') && this.isAssignableNode(left)) {
      const checkpoint = this.current;
      try {
        const targets = [this.ensureAssignable(left)];
        while (this.match('OPERATOR', ',')) {
          const target = this.parseRescueExpression();
          targets.push(this.ensureAssignable(target));
        }
        this.consume('OPERATOR', '=', 'Expected = after multiple assignment');
        const right = this.parseAssignment();
        return {
          type: 'MultiAssignmentExpression',
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
    if (this.match('OPERATOR', '=') || this.matchAssignmentOperator()) {
      const operator = this.previous();
      const right = this.parseAssignment();
      return {
        type: 'AssignmentExpression',
        operator: operator.value,
        left: this.ensureAssignable(left),
        right
      };
    }
    return left;
  }

  parseRescueExpression() {
    let expr = this.parseConditional();

    if (!this.check('KEYWORD', 'rescue')) {
      return expr;
    }

    const primary = expr;
    this.advance(); // consume rescue
    const rescueExpression = this.parseExpression();

    const bodyBlock = this.wrapExpressionAsBlock(primary);
    const rescueBlock = this.wrapExpressionAsBlock(rescueExpression);

    return {
      type: 'BeginRescueExpression',
      body: bodyBlock,
      rescues: [
        {
          type: 'RescueClause',
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
    if (this.match('OPERATOR', '?')) {
      const consequent = this.parseExpression();
      this.consume('OPERATOR', ':', "Expected ':' in conditional expression");
      const alternate = this.parseExpression();
      expr = { type: 'ConditionalExpression', test: expr, consequent, alternate };
    }
    return expr;
  }

  matchAssignmentOperator() {
    const operators = ['+=', '-=', '*=', '/=', '%=', '||=', '&&='];
    for (const op of operators) {
      if (this.match('OPERATOR', op)) return true;
    }
    return false;
  }

  ensureAssignable(node) {
    if (!node) throw new SyntaxError('Invalid assignment target');
    const valid = ['Identifier', 'InstanceVariable', 'ClassVariable', 'MemberExpression'];
    if (valid.includes(node.type)) return node;
    throw new SyntaxError('Invalid assignment target');
  }

  isAssignableNode(node) {
    if (!node) return false;
    const valid = ['Identifier', 'InstanceVariable', 'ClassVariable', 'MemberExpression'];
    return valid.includes(node.type);
  }

  isIndexableExpression(node) {
    if (!node) return false;
    const valid = [
      'Identifier',
      'MemberExpression',
      'OptionalMemberExpression',
      'InstanceVariable',
      'ClassVariable',
      'SelfExpression'
    ];
    return valid.includes(node.type);
  }

  parseLogicalOr() {
    let expr = this.parseLogicalAnd();
    while (this.match('OPERATOR', '||')) {
      const operator = this.previous().value;
      const right = this.parseLogicalAnd();
      expr = { type: 'LogicalExpression', operator, left: expr, right };
    }
    return expr;
  }

  parseLogicalAnd() {
    let expr = this.parseEquality();
    while (this.match('OPERATOR', '&&')) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = { type: 'LogicalExpression', operator, left: expr, right };
    }
    return expr;
  }

  parseEquality() {
    let expr = this.parseRange();
    while (this.match('OPERATOR', '==') || this.match('OPERATOR', '!=')) {
      const operator = this.previous().value;
      const right = this.parseRange();
      expr = { type: 'BinaryExpression', operator, left: expr, right };
    }
    return expr;
  }

  parseRange() {
    let expr = this.parseComparison();
    if (this.match('OPERATOR', '..') || this.match('OPERATOR', '...')) {
      const operator = this.previous().value;
      const right = this.parseRange();
      expr = {
        type: 'RangeExpression',
        start: expr,
        end: right,
        exclusive: operator === '...'
      };
    }
    return expr;
  }

  parseComparison() {
    let expr = this.parseTerm();
    while (this.match('OPERATOR', '<') || this.match('OPERATOR', '>') ||
      this.match('OPERATOR', '<=') || this.match('OPERATOR', '>=')) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = { type: 'BinaryExpression', operator, left: expr, right };
    }
    return expr;
  }

  parseTerm() {
    let expr = this.parseFactor();
    while (true) {
      if (this.match('OPERATOR', '+') || this.match('OPERATOR', '-')) {
        const operator = this.previous().value;
        const right = this.parseFactor();
        expr = { type: 'BinaryExpression', operator, left: expr, right };
        continue;
      }
      if (this.match('OPERATOR', '<<')) {
        const operator = this.previous().value;
        const right = this.parseFactor();
        expr = { type: 'BinaryExpression', operator, left: expr, right };
        continue;
      }
      break;
    }
    return expr;
  }

  parseFactor() {
    let expr = this.parseUnary();
    while (this.match('OPERATOR', '*') || this.match('OPERATOR', '/') || this.match('OPERATOR', '%')) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = { type: 'BinaryExpression', operator, left: expr, right };
    }
    return expr;
  }

  parseUnary() {
    if (this.match('OPERATOR', '!') || this.match('OPERATOR', '-') || this.match('OPERATOR', '+')) {
      const operator = this.previous().value;
      const argument = this.parseUnary();
      return { type: 'UnaryExpression', operator, argument };
    }
    if (this.match('OPERATOR', '&')) {
      const expression = this.parseUnary();
      if (expression.type === 'SymbolLiteral') {
        return { type: 'ToProcExpression', argument: expression };
      }
      return { type: 'BlockPassExpression', expression };
    }
    return this.parseCall();
  }

  isKeywordArgumentStart() {
    const current = this.peek();
    const next = this.tokens[this.current + 1];
    if (!current || !next) return false;
    if (current.type !== 'IDENTIFIER') return false;
    if (next.type !== 'OPERATOR' || next.value !== ':') return false;
    return true;
  }

  parseKeywordArgumentGroup() {
    const properties = [];
    while (true) {
      const keyToken = this.consumeIdentifier('Expected keyword argument name');
      const keyNode = { type: 'Identifier', name: keyToken.value };
      this.consume('OPERATOR', ':', "Expected ':' after keyword argument name");
      this.skipNewlines();
      const value = this.parseExpression();
      properties.push({ key: keyNode, value });
      if (!this.check('OPERATOR', ',')) break;
      const next = this.tokens[this.current + 1];
      const after = this.tokens[this.current + 2];
      if (!(next && next.type === 'IDENTIFIER' && after && after.type === 'OPERATOR' && after.value === ':')) {
        break;
      }
      this.advance(); // consume ',' and continue parsing more keyword pairs
    }
    return { type: 'HashExpression', properties, keyword: true };
  }

  parseCall() {
    let expr = this.parsePrimary();

    while (true) {
      while (true) {
        if (this.check('NEWLINE')) {
          const next = this.tokens[this.current + 1];
          if (next && next.type === 'OPERATOR') {
            if (next.value === '.' || next.value === '&.') {
              this.advance();
              continue;
            }
            if (next.value === '[' && this.isIndexableExpression(expr)) {
              this.advance();
              continue;
            }
          }
          break;
        }
        if (this.match('OPERATOR', '(')) {
          const args = [];
          if (!this.check('OPERATOR', ')')) {
            const parseArgument = () => {
              if (this.match('OPERATOR', '...')) {
                args.push({ type: 'ForwardingArguments' });
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
            while (this.check('OPERATOR', ',')) {
              this.advance();
              parseArgument();
            }
          }
          this.consume('OPERATOR', ')', 'Expected closing ) after arguments');
          expr = { type: 'CallExpression', callee: expr, arguments: args };
          continue;
        }
        if (this.match('OPERATOR', '&.')) {
          const propertyToken = this.consumeIdentifier('Expected method name after &.');
          expr = {
            type: 'OptionalMemberExpression',
            object: expr,
            property: { type: 'Identifier', name: propertyToken.value },
            computed: false
          };
          const nextToken = this.peek();
          if (!(nextToken && nextToken.type === 'OPERATOR' && (nextToken.value === '(' || nextToken.value === '='))) {
            expr = this.ensureCallExpression(expr);
          }
          continue;
        }
        if (this.match('OPERATOR', '.')) {
          const propertyToken = this.consumeIdentifier('Expected property name after .');
          expr = {
            type: 'MemberExpression',
            object: expr,
            property: { type: 'Identifier', name: propertyToken.value },
            computed: false
          };
          const nextToken = this.peek();
          if (!(nextToken && nextToken.type === 'OPERATOR' && (nextToken.value === '(' || nextToken.value === '='))) {
            expr = this.ensureCallExpression(expr);
          }
          continue;
        }
        if (this.match('OPERATOR', '[')) {
          const index = this.parseExpression();
          this.consume('OPERATOR', ']', 'Expected closing ]');
          expr = {
            type: 'MemberExpression',
            object: expr,
            property: index,
            computed: true
          };
          continue;
        }
        if (this.canAttachBlock(expr) && (this.check('KEYWORD', 'do') || this.check('OPERATOR', '{'))) {
          expr = this.attachBlock(expr);
          continue;
        }
        break;
      }

      expr = this.wrapImplicitCall(expr);

      if (this.canCommandCall(expr)) {
        const args = [];
        const parseArgument = () => {
          if (this.match('OPERATOR', '...')) {
            args.push({ type: 'ForwardingArguments' });
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
        while (this.check('OPERATOR', ',')) {
          this.advance();
          parseArgument();
        }
        expr = { type: 'CallExpression', callee: expr, arguments: args };
        continue;
      }

      break;
    }

    return expr;
  }


  wrapImplicitCall(expr) {
    if (!expr) return expr;
    if (!['MemberExpression', 'OptionalMemberExpression'].includes(expr.type)) {
      return expr;
    }
    if (expr.type === 'MemberExpression' && expr.computed) {
      return expr;
    }
    if (expr.type === 'OptionalMemberExpression' && expr.computed) {
      return expr;
    }
    if (!this.shouldImplicitCall()) return expr;
    return { type: 'CallExpression', callee: expr, arguments: [] };
  }

  ensureCallExpression(expr) {
    if (expr.type === 'CallExpression') return expr;
    return { type: 'CallExpression', callee: expr, arguments: [] };
  }

  canAttachBlock(expr) {
    if (!expr) return false;
    return ['Identifier', 'CallExpression', 'MemberExpression', 'OptionalMemberExpression'].includes(expr.type);
  }

  attachBlock(expr) {
    let current = expr;
    while (true) {
      if (this.check('KEYWORD', 'do') && this.canAttachBlock(current)) {
        this.advance();
        current = this.ensureCallExpression(current);
        const block = this.parseDoBlock();
        current.block = block;
        continue;
      }
      if (this.check('OPERATOR', '{') && this.canAttachBlock(current)) {
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
    const body = this.parseBlock(['end']);
    this.consume('KEYWORD', 'end', "Expected 'end' to close block");
    return { params, body: { type: 'BlockStatement', body } };
  }

  parseBlockParameters() {
    const params = [];
    if (!this.match('OPERATOR', '|')) return params;
    if (!this.check('OPERATOR', '|')) {
      do {
        const token = this.consume('IDENTIFIER', undefined, 'Expected block parameter');
        params.push({ type: 'Identifier', name: token.value });
      } while (this.match('OPERATOR', ','));
    }
    this.consume('OPERATOR', '|', "Expected closing | for block parameters");
    return params;
  }

  shouldImplicitCall() {
    const token = this.peek();
    if (!token) return true;
    if (token.type === 'NEWLINE' || token.type === 'EOF') return true;
    if (token.type === 'KEYWORD' && ['end', 'else', 'elsif', 'when'].includes(token.value)) return true;
    if (token.type === 'OPERATOR' && [')', ']', '}', ','].includes(token.value)) return true;
    return false;
  }

  parsePrimary() {
    if (this.match('NUMBER')) {
      return { type: 'NumericLiteral', value: Number(this.previous().value) };
    }
    if (this.match('REGEX')) {
      const token = this.previous();
      return { type: 'RegExpLiteral', pattern: token.value.pattern, flags: token.value.flags };
    }
    if (this.match('STRING')) {
      return { type: 'StringLiteral', value: this.previous().value };
    }
    if (this.match('PERCENT_STRING_ARRAY')) {
      const token = this.previous();
      return {
        type: 'ArrayExpression',
        elements: token.value.values.map(value => ({ type: 'StringLiteral', value }))
      };
    }
    if (this.match('KEYWORD', 'true')) {
      return { type: 'BooleanLiteral', value: true };
    }
    if (this.match('KEYWORD', 'false')) {
      return { type: 'BooleanLiteral', value: false };
    }
    if (this.match('KEYWORD', 'nil')) {
      return { type: 'NullLiteral', value: null };
    }
    if (this.match('KEYWORD', 'self')) {
      return { type: 'SelfExpression' };
    }
    if (this.match('KEYWORD', 'super')) {
      const args = [];
      if (this.match('OPERATOR', '(')) {
        if (!this.check('OPERATOR', ')')) {
          do {
            args.push(this.parseExpression());
          } while (this.match('OPERATOR', ','));
        }
        this.consume('OPERATOR', ')', 'Expected closing ) after super arguments');
      } else if (!this.isTerminator(this.peek())) {
        args.push(this.parseExpression());
        while (this.match('OPERATOR', ',')) {
          args.push(this.parseExpression());
        }
      }
      return { type: 'SuperCall', arguments: args };
    }
    if (this.match('KEYWORD', 'begin')) {
      return this.parseBeginExpression();
    }
    if (this.match('OPERATOR', ':')) {
      const token = this.consumeSymbolToken('Expected symbol name after :');
      return { type: 'SymbolLiteral', name: token.value };
    }
    if (this.match('IDENTIFIER')) {
      const token = this.previous();
      if (token.value.startsWith('@@')) {
        return { type: 'ClassVariable', name: token.value.slice(2) };
      }
      if (token.value.startsWith('@')) {
        return { type: 'InstanceVariable', name: token.value.slice(1) };
      }
      const name = token.value;
      if (name === 'block_given?') {
        const nextToken = this.peek();
        if (!(nextToken && nextToken.type === 'OPERATOR' && nextToken.value === '(')) {
          return {
            type: 'CallExpression',
            callee: { type: 'Identifier', name },
            arguments: []
          };
        }
      }
      return { type: 'Identifier', name };
    }
    if (this.match('OPERATOR', '(')) {
      const expr = this.parseExpression();
      this.consume('OPERATOR', ')', 'Expected closing )');
      return expr;
    }
    if (this.match('OPERATOR', '[')) {
      const elements = [];
      this.skipNewlines();
      if (!this.check('OPERATOR', ']')) {
        while (true) {
          elements.push(this.parseExpression());
          this.skipNewlines();
          if (!this.match('OPERATOR', ',')) break;
          this.skipNewlines();
        }
      }
      this.consume('OPERATOR', ']', 'Expected closing ]');
      return { type: 'ArrayExpression', elements };
    }
    if (this.match('OPERATOR', '{')) {
      const properties = [];
      if (!this.check('OPERATOR', '}')) {
        do {
          const keyToken = this.consumeKey();
          let value;
          if (this.match('OPERATOR', '=>')) {
            value = this.parseExpression();
          } else if (this.match('OPERATOR', ':')) {
            value = this.parseExpression();
          } else {
            throw new SyntaxError("Expected '=>' or ':' in hash");
          }
          properties.push({ key: keyToken, value });
        } while (this.match('OPERATOR', ','));
      }
      this.consume('OPERATOR', '}', 'Expected closing }');
      return { type: 'HashExpression', properties };
    }

    if (this.match('OPERATOR', '->')) {
      return this.parseLambda();
    }

    if (this.match('KEYWORD', 'yield')) {
      const args = [];
      const previous = this.allowMultiAssign;
      this.allowMultiAssign = false;
      if (this.match('OPERATOR', '(')) {
        if (!this.check('OPERATOR', ')')) {
          const parseArgument = () => {
            args.push(this.parseExpression());
          };
          parseArgument();
          while (this.check('OPERATOR', ',')) {
            this.advance();
            parseArgument();
          }
        }
        this.consume('OPERATOR', ')', 'Expected closing ) after yield arguments');
      } else if (!this.isTerminator(this.peek())) {
        args.push(this.parseExpression());
        while (this.check('OPERATOR', ',')) {
          this.advance();
          args.push(this.parseExpression());
        }
      }
      this.allowMultiAssign = previous;
      return { type: 'YieldExpression', arguments: args };
    }

    throw new SyntaxError(`Unexpected token ${this.peek().type} ${this.peek().value ?? ''}`);
  }

  consumeKey() {
    if (this.match('STRING')) {
      return { type: 'StringLiteral', value: this.previous().value };
    }
    if (this.match('IDENTIFIER')) {
      return { type: 'Identifier', name: this.previous().value };
    }
    if (this.match('OPERATOR', ':')) {
      const token = this.consumeSymbolToken('Expected symbol name');
      return { type: 'SymbolLiteral', name: token.value };
    }
    throw new SyntaxError('Invalid hash key');
  }

  consumeSymbolToken(message) {
    if (this.check('IDENTIFIER')) return this.advance();
    if (this.check('KEYWORD')) return this.advance();
    if (this.check('OPERATOR')) return this.advance();
    throw new SyntaxError(message);
  }

  parseExpression() {
    return this.parseAssignment();
  }

  consume(type, value, message) {
    if (message === undefined) {
      message = value;
      value = undefined;
    }
    if (this.check(type, value)) return this.advance();
    throw new SyntaxError(message);
  }

  consumeIdentifier(message) {
    if (this.check('IDENTIFIER')) return this.advance();
    if (this.check('KEYWORD')) return this.advance();
    throw new SyntaxError(message);
  }

  parseBraceBlock(openConsumed = false) {
    if (!openConsumed) {
      this.consume('OPERATOR', '{', "Expected '{' to start block");
    }
    const params = this.parseBlockParameters();
    this.consumeStatementTerminator();
    const body = [];
    while (!this.check('EOF') && !this.check('OPERATOR', '}')) {
      this.skipNewlines();
      if (this.check('OPERATOR', '}')) break;
      body.push(this.parseStatement());
      this.consumeStatementTerminator();
    }
    this.consume('OPERATOR', '}', "Expected '}' to close block");
    return { params, body: { type: 'BlockStatement', body } };
  }

  parseLambda() {
    const params = [];
    if (this.match('OPERATOR', '(')) {
      if (!this.check('OPERATOR', ')')) {
        do {
          if (this.match('OPERATOR', '*')) {
            const rest = this.consumeIdentifier('Expected rest parameter name');
            params.push({ type: 'RestParameter', name: rest.value });
            continue;
          }
          const param = this.consumeIdentifier('Expected parameter name');
          params.push({ type: 'Identifier', name: param.value });
        } while (this.match('OPERATOR', ','));
      }
      this.consume('OPERATOR', ')', 'Expected closing ) after lambda parameters');
    }

    let block;
    if (this.match('OPERATOR', '{')) {
      block = this.parseBraceBlock(true);
    } else if (this.match('KEYWORD', 'do')) {
      block = this.parseDoBlock();
    } else {
      throw new SyntaxError('Expected block after lambda');
    }

    const lambdaParams = params.length ? params : block.params;

    return {
      type: 'LambdaExpression',
      params: lambdaParams,
      body: block.body
    };
  }

  wrapExpressionAsBlock(expression) {
    return {
      type: 'BlockStatement',
      body: [
        {
          type: 'ExpressionStatement',
          expression
        }
      ]
    };
  }

  parseBeginExpression() {
    this.consumeStatementTerminator();
    const bodyStatements = this.parseBlock(['rescue', 'else', 'ensure', 'end']);
    const bodyBlock = { type: 'BlockStatement', body: bodyStatements };

    const rescues = [];
    while (this.match('KEYWORD', 'rescue')) {
      rescues.push(this.parseRescueClause());
    }

    let elseBody = null;
    if (this.match('KEYWORD', 'else')) {
      this.consumeStatementTerminator();
      const elseStatements = this.parseBlock(['ensure', 'end']);
      elseBody = { type: 'BlockStatement', body: elseStatements };
    }

    let ensureBody = null;
    if (this.match('KEYWORD', 'ensure')) {
      this.consumeStatementTerminator();
      const ensureStatements = this.parseBlock(['end']);
      ensureBody = { type: 'BlockStatement', body: ensureStatements };
    }

    this.consume('KEYWORD', 'end', "Expected 'end' to close begin/rescue block");

    return {
      type: 'BeginRescueExpression',
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
      } while (this.match('OPERATOR', ','));
    }

    let binding = null;
    if (this.match('OPERATOR', '=>')) {
      const identifier = this.consumeIdentifier('Expected rescue variable name');
      binding = { type: 'Identifier', name: identifier.value };
    }

    this.consumeStatementTerminator();
    const bodyStatements = this.parseBlock(['rescue', 'else', 'ensure', 'end']);
    return {
      type: 'RescueClause',
      exceptions,
      binding,
      body: { type: 'BlockStatement', body: bodyStatements }
    };
  }

  isRescueClauseTerminator(token) {
    if (!token) return true;
    if (token.type === 'NEWLINE' || token.type === 'EOF') return true;
    if (token.type === 'OPERATOR' && token.value === '=>') return true;
    if (token.type === 'KEYWORD' && ['do', 'then'].includes(token.value)) return true;
    return false;
  }

  containsYield(node) {
    if (!node || typeof node !== 'object') return false;
    switch (node.type) {
      case 'YieldExpression':
        return true;
      case 'BlockStatement':
        return node.body.some(child => this.containsYield(child));
      case 'ExpressionStatement':
        return this.containsYield(node.expression);
      case 'IfStatement':
        return this.containsYield(node.test) ||
          (node.consequent && this.containsYield(node.consequent)) ||
          (node.alternate && this.containsYield(node.alternate));
      case 'AssignmentExpression':
        return this.containsYield(node.left) || this.containsYield(node.right);
      case 'CallExpression':
        if (this.containsYield(node.callee)) return true;
        if (node.arguments.some(arg => this.containsYield(arg))) return true;
        if (node.block) return this.containsYield(node.block.body);
        return false;
      case 'MemberExpression':
        return this.containsYield(node.object) || (node.computed && this.containsYield(node.property));
      case 'BinaryExpression':
      case 'LogicalExpression':
        return this.containsYield(node.left) || this.containsYield(node.right);
      case 'UnaryExpression':
        return this.containsYield(node.argument);
      case 'ConditionalExpression':
        return this.containsYield(node.test) || this.containsYield(node.consequent) || this.containsYield(node.alternate);
      case 'CaseStatement':
        if (node.test && this.containsYield(node.test)) return true;
        for (const clause of node.clauses) {
          if (clause.type === 'WhenClause' && clause.tests) {
            if (clause.tests.some(test => this.containsYield(test))) return true;
          }
          if (this.containsYield(clause.body)) return true;
        }
        return node.alternate ? this.containsYield(node.alternate) : false;
      case 'BeginRescueExpression':
        if (this.containsYield(node.body)) return true;
        if (node.rescues) {
          for (const clause of node.rescues) {
            if (clause.exceptions && clause.exceptions.some(exception => this.containsYield(exception))) {
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
    if (typeof value === 'string') {
      return token.type === 'OPERATOR' && token.value === value;
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
    if (this.isAtEnd()) return type === 'EOF';
    const token = this.peek();
    if (token.type !== type) return false;
    if (value === undefined) return true;
    return token.value === value;
  }

  checkAny(keywords) {
    if (!Array.isArray(keywords)) return false;
    for (const word of keywords) {
      if (this.check('KEYWORD', word)) return true;
    }
    return false;
  }

  advance() {
    if (!this.isAtEnd()) this.current += 1;
    return this.previous();
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  skipNewlines() {
    while (this.match('NEWLINE')) {}
  }

  consumeStatementTerminator() {
    let consumed = false;
    while (true) {
      if (this.match('NEWLINE')) {
        consumed = true;
        continue;
      }
      if (this.match('OPERATOR', ';')) {
        consumed = true;
        continue;
      }
      break;
    }
    return consumed;
  }

  consumeOptionalThen() {
    this.match('KEYWORD', 'then');
  }

  isTerminator(token) {
    if (!token) return true;
    if (token.type === 'NEWLINE') return true;
    if (token.type === 'EOF') return true;
    if (token.type === 'KEYWORD' && token.value === 'end') return true;
    return false;
  }

  canCommandCall(expr) {
    if (!expr) return false;
    if (!['Identifier', 'MemberExpression', 'CallExpression', 'OptionalMemberExpression'].includes(expr.type)) return false;
    const token = this.peek();
    if (!token) return false;
    if (token.type === 'NEWLINE' || token.type === 'EOF') return false;
    if (token.type === 'KEYWORD' && ['end', 'else', 'elsif', 'when'].includes(token.value)) return false;
    if (token.type === 'OPERATOR' && [')', '}', ']', '=', '+=', '-=', '*=', '/=', '%=', '=>'].includes(token.value)) return false;
    if (!this.isExpressionStart(token)) return false;
    return true;
  }

  isExpressionStart(token) {
    if (!token) return false;
    if (token.type === 'IDENTIFIER') return true;
    if (token.type === 'NUMBER' || token.type === 'STRING') return true;
    if (token.type === 'PERCENT_STRING_ARRAY') return true;
    if (token.type === 'KEYWORD' && ['true', 'false', 'nil', 'self'].includes(token.value)) return true;
    if (token.type === 'OPERATOR' && ['(', '[', ':', '!'].includes(token.value)) return true;
    return false;
  }
}

module.exports = { Parser };
