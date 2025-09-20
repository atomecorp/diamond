const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');

class Emitter {
  constructor(options = {}) {
    this.indentSize = options.indent ?? 2;
    this.indentLevel = 0;
    this.scopeInfo = new Map();
    this.runtimeHelpers = new Set();
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
        hoistedLines.push(this.indent() + `let ${name};`);
      }
    }

    const bodyLines = [];
    for (const statement of node.body) {
      const code = this.emitStatement(statement, { scopeNode: node });
      if (code) bodyLines.push(code);
    }

    const helperLines = this.buildRuntimePrelude();

    if (!helperLines.length) {
      if (hoistedLines.length && bodyLines.length) {
        return [...hoistedLines, ...bodyLines].join('\n');
      }
      if (hoistedLines.length) return hoistedLines.join('\n');
      if (bodyLines.length) return bodyLines.join('\n');
      return '';
    }

    const segments = [];
    if (hoistedLines.length) segments.push(hoistedLines);
    segments.push(helperLines);
    if (bodyLines.length) segments.push(bodyLines);

    const lines = [];
    segments.forEach((segment, index) => {
      if (index > 0) lines.push('');
      lines.push(...segment);
    });

    return lines.join('\n');
  }

  requireRuntime(helperName) {
    this.runtimeHelpers.add(helperName);
  }

  buildRuntimePrelude() {
    if (!this.runtimeHelpers.size) return [];
    const lines = [];

    if (this.runtimeHelpers.has('print')) {
      lines.push('const __rubyPrint = (...chunks) => {');
      lines.push('  const text = chunks.map(chunk => String(chunk ?? "")).join("");');
      lines.push('  if (typeof process !== "undefined" && process.stdout && process.stdout.write) {');
      lines.push('    process.stdout.write(text);');
      lines.push('  } else if (typeof console !== "undefined" && console.log) {');
      lines.push('    console.log(text);');
      lines.push('  }');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('gets')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyGets = (...promptParts) => {');
      lines.push('  const message = promptParts.length ? promptParts.map(part => String(part ?? "")).join("") : "";');
      lines.push('  if (typeof prompt === "function") {');
      lines.push('    const result = prompt(message);');
      lines.push('    return result == null ? "" : result;');
      lines.push('  }');
      lines.push('  console.warn("gets() is not supported in this environment.");');
      lines.push('  return "";');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('putsGlobal')) {
      if (lines.length) lines.push('');
      lines.push('if (typeof globalThis !== "undefined" && !globalThis.puts) {');
      lines.push('  globalThis.puts = (...values) => {');
      lines.push('    if (typeof console !== "undefined" && console.log) {');
      lines.push('      console.log(...values);');
      lines.push('    }');
      lines.push('  };');
      lines.push('}');
    }

    if (this.runtimeHelpers.has('className')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyClassName = (value) => {');
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
        '    const proto = Object.getPrototypeOf(value);',
        '    if (!proto || proto === Object.prototype) return "Hash";',
        '    if (value.constructor && typeof value.constructor.name === "string" && value.constructor.name.length) {',
        '      return value.constructor.name;',
        '    }',
        '    return "Object";',
        '  }',
        '  return typeof value;',
      ];
      lines.push(...typeLogic);
      lines.push('};');
    }

    if (this.runtimeHelpers.has('ivarName')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyIvarName = (name) => {');
      lines.push('  const str = String(name ?? "");');
      lines.push('  const clean = str.startsWith("@") ? str.slice(1) : str;');
      lines.push('  return "__" + clean;');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('strip')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyStrip = (value) => String(value ?? "").trim();');
    }

    if (this.runtimeHelpers.has('split')) {
      if (lines.length) lines.push('');
      lines.push('const __rubySplit = (value) => String(value ?? "").split(/\\s+/);');
    }

    if (this.runtimeHelpers.has('reverseString')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyReverse = (value) => String(value ?? "").split("").reverse().join("");');
    }

    if (this.runtimeHelpers.has('capitalize')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyCapitalize = (value) => {');
      lines.push('  const str = String(value ?? "");');
      lines.push('  if (!str.length) return str;');
      lines.push('  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('symbolProc')) {
      if (lines.length) lines.push('');
      lines.push('const __rubySymbolProc = (name) => {');
      lines.push('  switch (name) {');
      lines.push('    case "capitalize":');
      lines.push('      return (value) => __rubyCapitalize(value);');
      lines.push('    default:');
      lines.push('      return (value, ...rest) => {');
      lines.push('        if (value == null) return value;');
      lines.push('        const method = value[name];');
      lines.push('        return typeof method === "function" ? method.apply(value, rest) : value;');
      lines.push('      };');
      lines.push('  }');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('chomp')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyChomp = (value) => {');
      lines.push('  const str = String(value ?? "");');
      lines.push('  if (str.endsWith("\\r\\n")) return str.slice(0, -2);');
      lines.push('  if (str.endsWith("\\n")) return str.slice(0, -1);');
      lines.push('  if (str.endsWith("\\r")) return str.slice(0, -1);');
      lines.push('  return str;');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('toInteger')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyToInteger = (value) => {');
      lines.push('  const str = String(value ?? "").trimStart();');
      lines.push('  const match = str.match(/^[+-]?\\d+/);');
      lines.push('  if (!match) return 0;');
      lines.push('  const parsed = parseInt(match[0], 10);');
      lines.push('  return Number.isNaN(parsed) ? 0 : parsed;');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('strftime')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyStrftime = (format) => {');
      lines.push('  const date = new Date();');
      lines.push('  const replacements = {');
      lines.push('    "%Y": String(date.getFullYear()),');
      lines.push('    "%m": String(date.getMonth() + 1).padStart(2, "0"),');
      lines.push('    "%d": String(date.getDate()).padStart(2, "0")');
      lines.push('  };');
      lines.push('  return String(format ?? "").replace(/%[Ymd]/g, (match) => replacements[match] ?? match);');
      lines.push('};');
    }

    return lines;
  }

  emitStatement(node, context = {}) {
    switch (node.type) {
      case 'ExpressionStatement':
        return this.emitExpressionStatement(node, context);
      case 'MethodDefinition':
        return this.emitMethodDefinition(node, context);
      case 'ClassDeclaration':
        return this.emitClassDeclaration(node, context);
      case 'IfStatement':
        return this.emitIfStatement(node, context);
      case 'WhileStatement':
        return this.emitWhileStatement(node, context);
      case 'LoopStatement':
        return this.emitLoopStatement(node, context);
      case 'ReturnStatement':
        return this.indent() + this.emitReturnStatement(node, context);
      case 'BlockStatement':
        return this.indent() + this.emitBlockStatement(node, context);
      case 'CaseStatement':
        return this.emitCaseStatement(node, context);
      case 'BreakStatement':
        return this.indent() + 'break;';
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

    const normalized = this.normalizeExpressionForStatement(expressionNode);
    const expressionCode = this.emitExpression(normalized, { ...context, statement: true });
    if (expressionCode === '') return null;

    if (context.inFunction && context.isTail && context.allowImplicitReturn !== false) {
      return `${indent}return ${expressionCode};`;
    }

    return `${indent}${expressionCode};`;
  }

  normalizeExpressionForStatement(expr) {
    if (!expr) return expr;
    if (expr.type === 'CallExpression') return expr;
    if (expr.type === 'AssignmentExpression') return expr;
    if (expr.type === 'Identifier' || expr.type === 'MemberExpression' || expr.type === 'OptionalMemberExpression') {
      return { type: 'CallExpression', callee: expr, arguments: [] };
    }
    return expr;
  }

  isAttrMacroCall(expr) {
    if (!expr || expr.type !== 'CallExpression') return false;
    if (expr.callee.type !== 'Identifier') return false;
    return ['attr_accessor', 'attr_reader', 'attr_writer'].includes(expr.callee.name);
  }

  emitAttrMacro(expr, context) {
    const indent = this.indent();
    const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
    return `${indent}// ${expr.callee.name}(${args})`;
  }

  emitExpression(node, context = {}) {
    switch (node.type) {
      case 'Identifier':
        return node.name;
      case 'InstanceVariable':
        return this.instanceVariableReference(node.name);
      case 'ClassVariable':
        return `this.constructor.${node.name}`;
      case 'SelfExpression':
        return 'this';
      case 'NumericLiteral':
        return String(node.value);
      case 'StringLiteral':
        return this.emitStringLiteral(node, context);
      case 'BooleanLiteral':
        return node.value ? 'true' : 'false';
      case 'NullLiteral':
        return 'null';
      case 'SymbolLiteral':
        return this.quote(node.name);
      case 'ArrayExpression':
        return `[${node.elements.map(el => this.emitExpression(el, context)).join(', ')}]`;
      case 'HashExpression':
        return this.emitObjectLiteral(node, context);
      case 'UnaryExpression':
        return `${node.operator}${this.emitExpression(node.argument, context)}`;
      case 'BinaryExpression':
        return this.emitBinaryExpression(node, context);
      case 'LogicalExpression':
        return `${this.emitExpression(node.left, context)} ${node.operator} ${this.emitExpression(node.right, context)}`;
      case 'AssignmentExpression':
        return this.emitAssignmentExpression(node, context);
      case 'CallExpression':
        return this.emitCallExpression(node, context);
      case 'MemberExpression':
        return this.emitMemberExpression(node, context);
      case 'OptionalMemberExpression':
        return this.emitOptionalMemberExpression(node, context);
      case 'BlockStatement':
        return this.emitBlockStatement(node, context);
      case 'ConditionalExpression':
        return `${this.emitExpression(node.test, context)} ? ${this.emitExpression(node.consequent, context)} : ${this.emitExpression(node.alternate, context)}`;
      case 'LambdaExpression':
        return this.emitLambdaExpression(node, context);
      case 'YieldExpression':
        return this.emitYieldExpression(node, context);
      default:
        throw new Error(`Unsupported expression type: ${node.type}`);
    }
  }

  emitAssignmentExpression(node, context) {
    const left = this.emitExpression(node.left, context);
    const right = this.emitExpression(node.right, context);
    if (node.operator === '=') {
      if (
        node.left.type === 'MemberExpression' &&
        !node.left.computed &&
        node.left.property.type === 'Identifier'
      ) {
        const objectCode = this.emitExpression(node.left.object, context);
        const methodName = `${node.left.property.name}=`;
        return `${objectCode}[${this.quote(methodName)}](${right})`;
      }
      return `${left} = ${right}`;
    }
    return `${left} ${node.operator} ${right}`;
  }

  emitCallExpression(node, context) {
    const calleeName = this.extractCalleeName(node.callee);
    const receiverCode = this.extractCalleeObjectCode(node.callee, context);

    if (
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'Proc' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'new'
    ) {
      if (node.block) {
        return this.emitBlockFunction(node.block, context, { asFunction: true });
      }
    }

    if (calleeName === 'block_given?') {
      return this.emitBlockGiven(context);
    }

    if (calleeName === 'define_method') {
      return this.emitDefineMethod(node, context);
    }

    if (calleeName === 'instance_variable_get') {
      return this.emitInstanceVariableGet(node, context, receiverCode);
    }

    if (calleeName === 'instance_variable_set') {
      return this.emitInstanceVariableSet(node, context, receiverCode);
    }

    if (calleeName === 'eval') {
      this.requireRuntime('putsGlobal');
    }

    if (calleeName === 'puts') {
      const args = node.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `console.log(${args})`;
    }

    if (calleeName === 'print') {
      this.requireRuntime('print');
      const args = node.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return args.length ? `__rubyPrint(${args})` : '__rubyPrint()';
    }

    if (calleeName === 'gets') {
      this.requireRuntime('gets');
      const args = node.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return args.length ? `__rubyGets(${args})` : '__rubyGets()';
    }

    let memberProperty = null;
    let memberObjectCode = null;
    if (
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier'
    ) {
      memberProperty = node.callee.property.name;
      memberObjectCode = this.emitExpression(node.callee.object, context);

      if (
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'gets'
      ) {
        memberObjectCode = this.emitGetsCall();
      }

      if (memberProperty === 'strftime' && this.isTimeNowExpression(node.callee.object)) {
        this.requireRuntime('strftime');
        const format = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
        return `__rubyStrftime(${format})`;
      }

      if (memberProperty === 'strip' && node.arguments.length === 0) {
        this.requireRuntime('strip');
        return `__rubyStrip(${memberObjectCode})`;
      }

      if (memberProperty === 'split' && node.arguments.length === 0) {
        this.requireRuntime('split');
        return `__rubySplit(${memberObjectCode})`;
      }

      if (memberProperty === 'chomp' && node.arguments.length === 0) {
        this.requireRuntime('chomp');
        return `__rubyChomp(${memberObjectCode})`;
      }

      if (memberProperty === 'reverse' && node.arguments.length === 0) {
        this.requireRuntime('reverseString');
        return `__rubyReverse(${memberObjectCode})`;
      }

      if (memberProperty === 'to_i' && node.arguments.length === 0) {
        this.requireRuntime('toInteger');
        return `__rubyToInteger(${memberObjectCode})`;
      }

      if (memberProperty === 'size' && node.arguments.length === 0) {
        return `${memberObjectCode}.length`;
      }

      if (memberProperty === 'select' && node.block) {
        const blockFn = this.emitBlockFunction(node.block, context);
        return `${memberObjectCode}.filter(${blockFn})`;
      }

      if (memberProperty === 'class' && node.arguments.length === 0) {
        this.requireRuntime('className');
        return `__rubyClassName(${memberObjectCode})`;
      }
    }

    let isConstructorCall = false;
    let calleeCode;

    if (
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'new'
    ) {
      calleeCode = this.emitExpression(node.callee.object, context);
      isConstructorCall = true;
    } else if (node.callee.type === 'Identifier' && context.classLevel && context.currentClassName) {
      calleeCode = `${context.currentClassName}.${node.callee.name}`;
    } else {
      calleeCode = this.emitExpression(node.callee, context);
    }

    const argList = node.arguments.map(arg => this.emitArgumentExpression(arg, context));
    let blockCode = null;
    if (node.block) {
      blockCode = this.emitBlockFunction(node.block, context);
    }

    if (memberProperty === 'call') {
      const args = argList.join(', ');
      return `${memberObjectCode}(${args})`;
    }

    if (
      node.block &&
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'each'
    ) {
      const objectCode = this.emitExpression(node.callee.object, context);
      return `${objectCode}.forEach(${blockCode})`;
    }

    if (
      node.block &&
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'each_with_index'
    ) {
      const objectCode = this.emitExpression(node.callee.object, context);
      return `${objectCode}.forEach(${blockCode})`;
    }

    if (blockCode) {
      argList.push(blockCode);
    }

    const args = argList.join(', ');

    if (isConstructorCall) {
      return `new ${calleeCode}(${args})`;
    }

    return `${calleeCode}(${args})`;
  }
  extractCalleeName(callee) {
    if (!callee) return null;
    if (callee.type === 'Identifier') return callee.name;
    if (callee.type === 'MemberExpression' && !callee.computed && callee.property.type === 'Identifier') {
      return callee.property.name;
    }
    return null;
  }

  extractCalleeObjectCode(callee, context) {
    if (callee && callee.type === 'MemberExpression') {
      return this.emitExpression(callee.object, context);
    }
    return null;
  }

  emitArgumentExpression(arg, context) {
    if (!arg) return '';
    if (arg.type === 'ToProcExpression') {
      return this.emitToProcExpression(arg, context);
    }
    if (arg.type === 'BlockPassExpression') {
      return this.emitBlockPassExpression(arg, context);
    }
    return this.emitExpression(arg, context);
  }

  emitToProcExpression(node, context) {
    if (node.argument.type === 'SymbolLiteral') {
      const name = node.argument.name;
      this.requireRuntime('symbolProc');
      if (name === 'capitalize') {
        this.requireRuntime('capitalize');
      }
      return `__rubySymbolProc(${this.quote(name)})`;
    }
    return this.emitExpression(node.argument, context);
  }

  emitGetsCall() {
    this.requireRuntime('gets');
    return '__rubyGets()';
  }

  emitBlockPassExpression(node, context) {
    if (node.expression.type === 'ToProcExpression') {
      return this.emitToProcExpression(node.expression, context);
    }
    return this.emitExpression(node.expression, context);
  }

  emitLambdaExpression(node, context = {}) {
    let paramNames = node.params.map(param => param.name);
    const scope = this.scopeInfo.get(node);
    if (!paramNames.length) {
      const inferred = this.inferImplicitParams(node.body);
      if (scope) {
        inferred.forEach(name => scope.declared.add(name));
      }
      paramNames = inferred;
    }
    const paramsCode = paramNames.length ? `(${paramNames.join(', ')})` : '()';
    const body = this.emitFunctionBody(
      node.body,
      {
        ...context,
        scopeNode: node,
        inFunction: true,
        allowImplicitReturn: true,
        blockParamName: null
      },
      scope
    );
    return `${paramsCode} => ${body}`;
  }

  emitYieldExpression(node, context = {}) {
    const args = node.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
    const target = context.blockParamName ?? '__block';
    const call = args.length ? `${target}(${args})` : `${target}()`;
    return `${target} ? ${call} : undefined`;
  }

  emitBlockGiven(context = {}) {
    const target = context.blockParamName ?? '__block';
    return `typeof ${target} === 'function'`;
  }

  resolveDefineMethodTarget(context, callee) {
    if (callee && callee.type === 'MemberExpression') {
      return `${this.emitExpression(callee.object, context)}.prototype`;
    }
    if (context.methodType === 'static') {
      return 'this.prototype';
    }
    if (context.classLevel && context.currentClassName) {
      return `${context.currentClassName}.prototype`;
    }
    return 'this';
  }

  resolveImplicitReceiver(context) {
    if (context.methodType === 'static') return 'this';
    if (context.classLevel && context.currentClassName) {
      return `${context.currentClassName}.prototype`;
    }
    return 'this';
  }

  emitDefineMethod(node, context) {
    if (!node.block) {
      const callee = this.emitExpression(node.callee, context);
      const args = node.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `${callee}(${args})`;
    }

    const nameArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
    const target = this.resolveDefineMethodTarget(context, node.callee);
    const blockContext = { ...context, methodType: 'instance' };
    delete blockContext.classLevel;
    const fn = this.emitBlockFunction(node.block, blockContext, { asFunction: true });
    return `${target}[${nameArg}] = ${fn}`;
  }

  emitInstanceVariableGet(node, context, receiverCode) {
    const target = receiverCode ?? this.resolveImplicitReceiver(context);
    const arg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
    this.requireRuntime('ivarName');
    return `${target}[__rubyIvarName(${arg})]`;
  }

  emitInstanceVariableSet(node, context, receiverCode) {
    const target = receiverCode ?? this.resolveImplicitReceiver(context);
    const nameArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
    const valueArg = node.arguments[1] ? this.emitExpression(node.arguments[1], context) : 'undefined';
    this.requireRuntime('ivarName');
    return `${target}[__rubyIvarName(${nameArg})] = ${valueArg}`;
  }

  instanceVariableReference(name) {
    return `this.${this.instanceVariableKey(name)}`;
  }

  instanceVariableKey(name) {
    return `__${name}`;
  }

  isTimeNowExpression(node) {
    if (!node) return false;
    if (node.type === 'CallExpression') {
      return this.isTimeNowExpression(node.callee);
    }
    if (node.type === 'MemberExpression' && !node.computed) {
      const isNow = node.property.type === 'Identifier' && node.property.name === 'now';
      if (isNow) {
        return node.object && node.object.type === 'Identifier' && node.object.name === 'Time';
      }
      return false;
    }
    return false;
  }

  emitMemberExpression(node, context) {
    const objectCode = this.emitExpression(node.object, context);
    if (node.computed) {
      const propertyCode = this.emitExpression(node.property, context);
      return `${objectCode}[${propertyCode}]`;
    }
    return `${objectCode}.${node.property.name}`;
  }

  emitOptionalMemberExpression(node, context) {
    const objectCode = this.emitExpression(node.object, context);
    if (node.computed) {
      const propertyCode = this.emitExpression(node.property, context);
      return `${objectCode}?.[${propertyCode}]`;
    }
    return `${objectCode}?.${node.property.name}`;
  }

  emitObjectLiteral(node, context) {
    const props = node.properties.map(prop => {
      const key = this.formatObjectKey(prop.key);
      const value = this.emitExpression(prop.value, context);
      return `${key}: ${value}`;
    });
    return `{ ${props.join(', ')} }`;
  }

  emitBinaryExpression(node, context) {
    if (node.operator === '<<') {
      const left = this.emitExpression(node.left, context);
      const right = this.emitExpression(node.right, context);
      return `${left}.push(${right})`;
    }
    return `${this.emitExpression(node.left, context)} ${this.mapBinaryOperator(node.operator)} ${this.emitExpression(node.right, context)}`;
  }

  emitStringLiteral(node, context) {
    if (!node.value.includes('#{')) {
      return this.quote(node.value);
    }
    const parts = this.splitInterpolatedString(node.value);
    const rendered = parts.map(part => {
      if (part.type === 'text') {
        return this.escapeTemplateText(part.value);
      }
      const expressionNode = this.parseEmbeddedExpression(part.value);
      return '${' + this.emitExpression(expressionNode, context) + '}';
    });
    return '`' + rendered.join('') + '`';
  }

  emitMethodDefinition(node, context = {}) {
    const scope = this.scopeInfo.get(node);
    const indent = this.indent();
    const isStatic = context.inClass && node.target && node.target.type === 'SelfExpression';
    const isConstructor = !isStatic && context.inClass && node.id.name === 'initialize';
    const methodName = isConstructor ? 'constructor' : node.id.name;
    const paramNames = [];
    let blockParamName = null;

    for (const param of node.params) {
      if (param.type === 'RestParameter') {
        paramNames.push(`...${param.name}`);
        continue;
      }
      if (param.type === 'BlockParameter') {
        paramNames.push(param.name);
        blockParamName = param.name;
        continue;
      }
      paramNames.push(param.name);
    }

    if (node.usesYield && !blockParamName) {
      blockParamName = '__block';
      paramNames.push(blockParamName);
    }

    const header = context.inClass
      ? `${indent}${isStatic ? 'static ' : ''}${methodName}(${paramNames.join(', ')})`
      : `${indent}function ${methodName}(${paramNames.join(', ')})`;

    const allowImplicitReturn = !(context.inClass && methodName === 'constructor');
    const body = this.emitFunctionBody(
      node.body,
      {
        ...context,
        scopeNode: node,
        inFunction: true,
        allowImplicitReturn,
        methodType: isStatic ? 'static' : 'instance',
        blockParamName
      },
      scope
    );
    return `${header} ${body}`;
  }

  emitFunctionBody(bodyNode, context, scope) {
    let code = '{\n';
    this.indentLevel += 1;

    const lines = [];
    if (scope) {
      for (const name of [...scope.hoisted].sort()) {
        lines.push(this.indent() + `let ${name};`);
      }
    }

    for (let index = 0; index < bodyNode.body.length; index += 1) {
      const statement = bodyNode.body[index];
      const isTail = index === bodyNode.body.length - 1;
      const stmt = this.emitStatement(statement, { ...context, isTail });
      if (stmt) lines.push(stmt);
    }

    this.indentLevel -= 1;
    if (lines.length) {
      code += lines.join('\n') + '\n' + this.indent() + '}';
    } else {
      code += this.indent() + '}';
    }
    return code;
  }

  emitBlockFunction(block, context = {}, options = {}) {
    const params = this.resolveBlockParameters(block);
    const scope = this.scopeInfo.get(block);
    const fnContext = {
      ...context,
      inFunction: true,
      allowImplicitReturn: options.allowImplicitReturn !== undefined ? options.allowImplicitReturn : true
    };
    const body = this.emitFunctionBody(block.body, fnContext, scope);
    if (options.asFunction) {
      return `function(${params.join(', ')}) ${body}`;
    }
    const paramList = params.length ? `(${params.join(', ')}) => ` : '() => ';
    return `${paramList}${body}`;
  }

  resolveBlockParameters(block) {
    if (block.params && block.params.length) {
      return block.params.map(param => param.name);
    }
    const inferred = this.inferImplicitParams(block.body);
    if (this.scopeInfo.has(block)) {
      const scope = this.scopeInfo.get(block);
      inferred.forEach(name => scope.declared.add(name));
    }
    return inferred;
  }

  inferImplicitParams(body) {
    const names = new Set();
    const visit = (node) => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach(visit);
        return;
      }
      switch (node.type) {
        case 'Identifier':
          if (/^_[0-9]+$/.test(node.name)) {
            names.add(node.name);
          }
          break;
        case 'LambdaExpression':
          // do not traverse nested lambdas
          return;
        case 'BlockStatement':
          node.body.forEach(visit);
          return;
        default:
          for (const key in node) {
            if (!Object.prototype.hasOwnProperty.call(node, key)) continue;
            const value = node[key];
            if (key === 'params') continue;
            if (key === 'body' && node.type === 'LambdaExpression') continue;
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
    const extendsPart = node.superClass ? ` extends ${this.emitExpression(node.superClass, context)}` : '';
    const className = node.id.name;
    const { body, trailing } = this.emitClassBody(node.body, { ...context, currentClassName: className });
    let code = `${indent}class ${className}${extendsPart} ${body}`;
    if (trailing.length) {
      code += '\n' + trailing.map(line => `${indent}${line}`).join('\n');
    }
    return code;
  }

  emitClassBody(bodyNode, context) {
    let code = '{\n';
    this.indentLevel += 1;
    const lines = [];
    const trailing = [];
    for (const statement of bodyNode.body) {
      if (statement.type === 'MethodDefinition') {
        const stmtCode = this.emitMethodDefinition(statement, { ...context, inClass: true, scopeNode: statement });
        if (stmtCode) lines.push(stmtCode);
      } else {
        const stmtCode = this.emitStatement(statement, { ...context, classLevel: true, inClass: true });
        if (stmtCode) trailing.push(stmtCode.replace(/^\s+/, ''));
      }
    }
    this.indentLevel -= 1;
    if (lines.length) {
      code += lines.join('\n') + '\n' + this.indent() + '}';
    } else {
      code += this.indent() + '}';
    }
    return { body: code, trailing };
  }

  emitIfStatement(node, context = {}, options = {}) {
    const indent = this.indent();
    const keyword = options.isElseIf ? 'else if' : 'if';
    let code = `${indent}${keyword} (${this.emitExpression(node.test, context)}) ${this.emitBlockStatement(node.consequent, context)}`;
    if (node.alternate) {
      if (node.alternate.type === 'IfStatement') {
        code += '\n' + this.emitIfStatement(node.alternate, context, { isElseIf: true });
      } else {
        code += '\n' + indent + 'else ' + this.emitBlockStatement(node.alternate, context);
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
    if (!node.argument) return 'return;';
    return `return ${this.emitExpression(node.argument, context)};`;
  }

  emitBlockStatement(node, context = {}) {
    let code = '{\n';
    this.indentLevel += 1;
    const lines = [];
    for (const statement of node.body) {
      const stmt = this.emitStatement(statement, context);
      if (stmt) lines.push(stmt);
    }
    this.indentLevel -= 1;
    if (lines.length) {
      code += lines.join('\n') + '\n' + this.indent() + '}';
    } else {
      code += this.indent() + '}';
    }
    return code;
  }

  emitCaseStatement(node, context = {}) {
    if (!node.clauses.length) return '';
    const indent = this.indent();
    const testCode = node.test ? this.emitExpression(node.test, context) : null;
    const lines = [];

    node.clauses.forEach((clause, index) => {
      const condition = this.emitCaseCondition(testCode, clause, context);
      const block = this.emitBlockStatement(clause.body, context);
      if (index === 0) {
        lines.push(`${indent}if (${condition}) ${block}`);
      } else {
        lines.push(`${indent}else if (${condition}) ${block}`);
      }
    });

    if (node.alternate) {
      lines.push(`${indent}else ${this.emitBlockStatement(node.alternate, context)}`);
    }

    return lines.join('\n');
  }

  emitCaseCondition(testCode, clause, context) {
    const expressions = clause.tests.map(test => this.emitExpression(test, context));
    if (testCode) {
      return expressions.map(expr => `${testCode} === ${expr}`).join(' || ');
    }
    if (expressions.length === 0) return 'true';
    return expressions.join(' || ');
  }

  splitInterpolatedString(value) {
    const parts = [];
    let cursor = 0;
    while (cursor < value.length) {
      const start = value.indexOf('#{', cursor);
      if (start === -1) {
        const text = value.slice(cursor);
        if (text.length) parts.push({ type: 'text', value: text });
        break;
      }
      const text = value.slice(cursor, start);
      if (text.length) parts.push({ type: 'text', value: text });

      let depth = 1;
      let index = start + 2;
      let expression = '';
      while (index < value.length && depth > 0) {
        const char = value[index];
        if (char === '{') {
          depth += 1;
          expression += char;
        } else if (char === '}') {
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
        throw new Error('Unterminated interpolation in string literal');
      }

      parts.push({ type: 'expression', value: expression.trim() });
      cursor = index;
    }
    return parts;
  }

  escapeTemplateText(text) {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$');
  }

  parseEmbeddedExpression(fragment) {
    const tokenizer = new Tokenizer(fragment);
    const tokens = tokenizer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    if (ast.body.length !== 1) {
      throw new Error('Interpolation expressions must resolve to a single expression');
    }
    const statement = ast.body[0];
    if (statement.type !== 'ExpressionStatement') {
      throw new Error('Interpolation expressions must be valid Ruby expressions');
    }
    return statement.expression;
  }

  mapBinaryOperator(op) {
    if (op === '==') return '===';
    if (op === '!=') return '!==';
    return op;
  }

  quote(value) {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/"/g, '\\"');
    return `"${escaped}"`;
  }

  formatObjectKey(keyNode) {
    if (!keyNode) return 'undefined';
    switch (keyNode.type) {
      case 'Identifier':
        return keyNode.name;
      case 'StringLiteral':
        return this.quote(keyNode.value);
      case 'SymbolLiteral':
        return keyNode.name;
      default:
        return this.emitExpression(keyNode);
    }
  }

  indent() {
    return ' '.repeat(this.indentLevel * this.indentSize);
  }

  collectProgram(node) {
    if (this.scopeInfo.has(node)) return;
    const scope = this.createScope();
    this.scopeInfo.set(node, scope);
    for (const statement of node.body) {
      this.collectNode(statement, scope);
    }
  }

  collectMethod(node) {
    if (this.scopeInfo.has(node)) return;
    const scope = this.createScope();
    for (const param of node.params) {
      if (param && param.name) {
        scope.declared.add(param.name);
      }
    }
    if (node.usesYield && !node.params.some(param => param.type === 'BlockParameter')) {
      scope.declared.add('__block');
    }
    this.scopeInfo.set(node, scope);
    this.collectNode(node.body, scope);
  }

  createScope() {
    return { declared: new Set(), hoisted: new Set() };
  }

  collectNode(node, scope) {
    if (!node || typeof node !== 'object') return;
    switch (node.type) {
      case 'Program':
        this.collectProgram(node);
        break;
      case 'BlockStatement':
        for (const stmt of node.body) this.collectNode(stmt, scope);
        break;
      case 'ExpressionStatement':
        this.collectNode(node.expression, scope);
        break;
      case 'AssignmentExpression':
        this.recordAssignment(node.left, scope);
        this.collectNode(node.right, scope);
        break;
      case 'BinaryExpression':
      case 'LogicalExpression':
        this.collectNode(node.left, scope);
        this.collectNode(node.right, scope);
        break;
      case 'UnaryExpression':
        this.collectNode(node.argument, scope);
        break;
      case 'CallExpression':
        this.collectNode(node.callee, scope);
        for (const arg of node.arguments) this.collectNode(arg, scope);
        if (node.block) this.collectBlock(node.block, scope);
        break;
      case 'MemberExpression':
        this.collectNode(node.object, scope);
        if (node.computed) this.collectNode(node.property, scope);
        break;
      case 'OptionalMemberExpression':
        this.collectNode(node.object, scope);
        if (node.computed) this.collectNode(node.property, scope);
        break;
      case 'ArrayExpression':
        for (const element of node.elements) this.collectNode(element, scope);
        break;
      case 'HashExpression':
        for (const prop of node.properties) this.collectNode(prop.value, scope);
        break;
      case 'IfStatement':
        this.collectNode(node.test, scope);
        this.collectNode(node.consequent, scope);
        if (node.alternate) this.collectNode(node.alternate, scope);
        break;
      case 'WhileStatement':
        this.collectNode(node.test, scope);
        this.collectNode(node.body, scope);
        break;
      case 'LoopStatement':
        this.collectNode(node.body, scope);
        break;
      case 'ReturnStatement':
        if (node.argument) this.collectNode(node.argument, scope);
        break;
      case 'ConditionalExpression':
        this.collectNode(node.test, scope);
        this.collectNode(node.consequent, scope);
        this.collectNode(node.alternate, scope);
        break;
      case 'CaseStatement':
        if (node.test) this.collectNode(node.test, scope);
        for (const clause of node.clauses) {
          for (const test of clause.tests) this.collectNode(test, scope);
          this.collectNode(clause.body, scope);
        }
        if (node.alternate) this.collectNode(node.alternate, scope);
        break;
      case 'MethodDefinition':
        this.collectMethod(node);
        break;
      case 'LambdaExpression':
        this.collectLambda(node);
        break;
      case 'ToProcExpression':
        this.collectNode(node.argument, scope);
        break;
      case 'BlockPassExpression':
        this.collectNode(node.expression, scope);
        break;
      case 'YieldExpression':
        for (const argument of node.arguments) this.collectNode(argument, scope);
        break;
      case 'ClassDeclaration':
        this.collectNode(node.body, scope);
        break;
      default:
        break;
    }
  }

  collectBlock(block, parentScope) {
    if (!block || this.scopeInfo.has(block)) return;
    const scope = this.createScope();
    for (const param of block.params) {
      scope.declared.add(param.name);
    }
    if (!block.params.length) {
      const inferred = this.inferImplicitParams(block.body);
      inferred.forEach(name => scope.declared.add(name));
    }
    this.scopeInfo.set(block, scope);
    this.collectNode(block.body, scope);
  }

  collectLambda(node) {
    if (this.scopeInfo.has(node)) return;
    const scope = this.createScope();
    for (const param of node.params) {
      scope.declared.add(param.name);
    }
    if (!node.params.length) {
      const inferred = this.inferImplicitParams(node.body);
      inferred.forEach(name => scope.declared.add(name));
    }
    this.scopeInfo.set(node, scope);
    this.collectNode(node.body, scope);
  }

  recordAssignment(target, scope) {
    if (!target || !scope) return;
    if (target.type === 'Identifier') {
      if (!scope.declared.has(target.name)) {
        scope.declared.add(target.name);
        scope.hoisted.add(target.name);
      }
    } else if (target.type === 'MemberExpression') {
      this.collectNode(target.object, scope);
      if (target.computed) this.collectNode(target.property, scope);
    }
  }
}

module.exports = { Emitter };
