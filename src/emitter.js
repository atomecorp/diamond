const { Tokenizer } = require('./tokenizer');
const { Parser } = require('./parser');

class Emitter {
  constructor(options = {}) {
    this.indentSize = options.indent ?? 2;
    this.indentLevel = 0;
    this.scopeInfo = new Map();
    this.runtimeHelpers = new Set();
    this.uniqueIdCounter = 0;
    this.injectedRequires = new Set();
    this.reservedWords = new Set([
      'enum', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
      'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
      'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with',
      'yield', 'let', 'static', 'implements', 'interface', 'package', 'private', 'protected', 'public',
      'null', 'true', 'false', 'arguments'
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

    if (this.runtimeHelpers.has('lazy')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyLazy = (value) => {');
      lines.push('  if (value && typeof value === "object" && value.__isRubyLazy) return value;');
      lines.push('  if (Array.isArray(value)) {');
      lines.push('    const base = value.slice();');
      lines.push('    const wrapper = {');
      lines.push('      __isRubyLazy: true,');
      lines.push('      __target: base,');
      lines.push('      select(block) {');
      lines.push('        const fn = typeof block === "function" ? block : (item) => item;');
      lines.push('        const result = base.filter((item, index) => fn(item, index));');
      lines.push('        return __rubyLazy(result);');
      lines.push('      },');
      lines.push('      map(block) {');
      lines.push('        const fn = typeof block === "function" ? block : (item) => item;');
        lines.push('        return __rubyLazy(base.map((item, index) => fn(item, index)));');
      lines.push('      },');
      lines.push('      to_a() {');
      lines.push('        return base.slice();');
      lines.push('      },');
      lines.push('      first() {');
      lines.push('        return base[0];');
      lines.push('      },');
      lines.push('      forEach(...args) {');
      lines.push('        return base.forEach(...args);');
      lines.push('      }');
      lines.push('    };');
      lines.push('    wrapper.filter = wrapper.select;');
      lines.push('    wrapper[Symbol.iterator] = function() {');
      lines.push('      return base[Symbol.iterator]();');
      lines.push('    };');
      lines.push('    return wrapper;');
      lines.push('  }');
      lines.push('  return value;');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('fetch')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyFetch = (collection, key, fallback) => {');
      lines.push('  if (Array.isArray(collection)) {');
      lines.push('    const index = Number(key);');
    lines.push('    if (Number.isInteger(index) && index >= 0 && index < collection.length) {');
      lines.push('      return collection[index];');
      lines.push('    }');
      lines.push('  } else if (collection && typeof collection === "object") {');
      lines.push('    const prop = String(key);');
      lines.push('    if (prop in collection) {');
      lines.push('      return collection[prop];');
      lines.push('    }');
      lines.push('  }');
      lines.push('  if (fallback !== undefined) {');
      lines.push('    return typeof fallback === "function" ? fallback() : fallback;');
      lines.push('  }');
      lines.push('  throw new Error("KeyError");');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('match')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyMatch = (value, pattern) => {');
      lines.push('  const input = String(value ?? "");');
      const logic = [
        '  const regex = pattern instanceof RegExp ? pattern : new RegExp(String(pattern));',
        '  const result = input.match(regex);',
        '  if (!result) return null;',
        '  return {',
        '    captures: () => result.slice(1)',
        '  };',
      ];
      lines.push(...logic);
      lines.push('};');
    }

    if (this.runtimeHelpers.has('publicSend')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyPublicSend = (receiver, methodName, ...args) => {');
      lines.push('  if (receiver == null) return undefined;');
      lines.push('  const fn = receiver[methodName];');
      lines.push('  if (typeof fn === "function") {');
      lines.push('    return fn.apply(receiver, args);');
      lines.push('  }');
      lines.push('  if (typeof methodName === "string") {');
      lines.push('    const rhs = args[0];');
      lines.push('    switch (methodName) {');
      lines.push('      case ">": return receiver > rhs;');
      lines.push('      case ">=": return receiver >= rhs;');
      lines.push('      case "<": return receiver < rhs;');
      lines.push('      case "<=": return receiver <= rhs;');
      lines.push('      case "==": return receiver === rhs;');
      lines.push('      case "!=": return receiver !== rhs;');
    lines.push('      case "===": return receiver === rhs;');
    lines.push('      case "!==": return receiver !== rhs;');
      lines.push('      default: break;');
      lines.push('    }');
      lines.push('  }');
      lines.push('  return receiver[methodName];');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('send')) {
      if (lines.length) lines.push('');
      lines.push('const __rubySend = (receiver, methodName, args = [], block) => {');
      lines.push('  if (receiver == null) return undefined;');
      const helperLogic = [
        '  const fn = receiver[methodName];',
        '  if (typeof fn === "function") {',
        '    const callArgs = block === undefined ? args : [...args, block];',
        '    return fn.apply(receiver, callArgs);',
        '  }',
        '  const missing = receiver.method_missing;',
        '  if (typeof missing === "function") {',
        '    const missingArgs = block === undefined ? [methodName, ...args] : [methodName, ...args, block];',
        '    return missing.apply(receiver, missingArgs);',
        '  }',
        '  throw new Error(`NoMethodError: undefined method ${methodName}`);',
      ];
      lines.push(...helperLogic);
      lines.push('};');
    }

    if (this.runtimeHelpers.has('instanceEval')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyInstanceEval = (receiver, block) => {');
      lines.push('  if (typeof block !== "function") return undefined;');
      const evalLogic = [
        '  const target = receiver !== undefined ? receiver : undefined;',
        '  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;',
        '  try {',
        '    return block.call(target);',
        '  } finally {',
        '    if (typeof restore === "function") restore();',
        '  }'
      ];
      lines.push(...evalLogic);
      lines.push('};');
    }

    if (this.runtimeHelpers.has('instanceExec')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyInstanceExec = (receiver, args, block) => {');
      lines.push('  if (typeof block !== "function") return undefined;');
      const execLogic = [
        '  const target = receiver !== undefined ? receiver : undefined;',
        '  const argList = Array.isArray(args) ? args : [];',
        '  const restore = typeof block.__rubyBind === "function" ? block.__rubyBind(target) : null;',
        '  try {',
        '    return block.apply(target, argList);',
        '  } finally {',
        '    if (typeof restore === "function") restore();',
        '  }'
      ];
      lines.push(...execLogic);
      lines.push('};');
    }

    if (this.runtimeHelpers.has('multiAssign')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyMultiAssign = (value, count) => {');
      lines.push('  if (value == null) {');
      lines.push('    return Array.from({ length: count }, () => undefined);');
      lines.push('  }');
      lines.push('  if (Array.isArray(value)) {');
      lines.push('    const result = value.slice(0, count);');
      lines.push('    while (result.length < count) result.push(undefined);');
      lines.push('    return result;');
      lines.push('  }');
      lines.push('  const result = [value];');
      lines.push('  while (result.length < count) result.push(undefined);');
      lines.push('  return result;');
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

    if (this.runtimeHelpers.has('implicitCall')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyImplicitCall = (receiver, name) => {');
      lines.push('  let target = receiver;');
      lines.push('  if (target == null && typeof globalThis !== "undefined") {');
      lines.push('    target = globalThis;');
      lines.push('  }');
      lines.push('  if (target == null) return undefined;');
      lines.push('  const member = target[name];');
      lines.push('  if (typeof member === "function") {');
      lines.push('    return member.call(target);');
      lines.push('  }');
      lines.push('  return member;');
      lines.push('};');
    }

    if (this.runtimeHelpers.has('hashPattern')) {
      if (lines.length) lines.push('');
      lines.push('const __rubyMatchHashPattern = (value, descriptors) => {');
      lines.push('  if (value == null || typeof value !== "object") return null;');
      const descriptorLogic = [
        '  const bindings = {};',
        '  for (const descriptor of descriptors) {',
        '    const { binding, keys } = descriptor;',
        '    let matched = false;',
        '    for (const key of keys) {',
        '      if (key in value) {',
        '        bindings[binding] = value[key];',
        '        matched = true;',
        '        break;',
        '      }',
        '    }',
        '    if (!matched) return null;',
        '  }',
        '  return bindings;',
      ];
      lines.push(...descriptorLogic);
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
      case 'ModuleDeclaration':
        return this.emitModuleDeclaration(node, context);
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
      case 'UsingStatement':
        return this.emitUsingStatement(node, context);
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
    if (expressionCode === '') return null;

    if (context.inFunction && context.isTail && context.allowImplicitReturn !== false) {
      return `${indent}return ${expressionCode};`;
    }

    return `${indent}${expressionCode};`;
  }

  normalizeExpressionForStatement(expr, context = {}) {
    if (!expr) return expr;
    if (expr.type === 'CallExpression') return expr;
    if (expr.type === 'AssignmentExpression') return expr;
    if (expr.type === 'Identifier') {
      if (this.isIdentifierDeclared(expr.name, context)) {
        return expr;
      }
      return { type: 'CallExpression', callee: expr, arguments: [] };
    }
    if (expr.type === 'MemberExpression' || expr.type === 'OptionalMemberExpression') {
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
    const attributeNames = expr.arguments
      .map(arg => this.extractSymbolName(arg) ?? (arg.type === 'StringLiteral' ? arg.value : null))
      .filter(Boolean);

    if (!attributeNames.length) {
      const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `${indent}// ${expr.callee.name}(${args})`;
    }

    const target = context.currentClassName
      ? `${context.currentClassName}.prototype`
      : 'this';

    const lines = [];
    for (const name of attributeNames) {
      const ivar = this.instanceVariableKey(name);
      if (expr.callee.name !== 'attr_writer') {
        lines.push(`${target}[${this.quote(name)}] = function() { return this.${ivar}; };`);
      }
      if (expr.callee.name !== 'attr_reader') {
        lines.push(`${target}[${this.quote(`${name}=`)}] = function(value) { this.${ivar} = value; return value; };`);
      }
    }
    return lines.join('\n');
  }

  isRequireCall(expr) {
    return expr && expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && expr.callee.name === 'require';
  }

  emitRequireCall(expr, context) {
    const indent = this.indent();
    if (!expr.arguments.length) {
      return `${indent}// require`;
    }
    const first = expr.arguments[0];
    if (first.type === 'StringLiteral') {
      if (first.value === 'forwardable') {
        if (this.injectedRequires.has('forwardable')) {
          return `${indent}// require "forwardable"`;
        }
        this.injectedRequires.add('forwardable');
        return `${indent}const Forwardable = {};`;
      }
      return `${indent}// require "${first.value}"`;
    }
    const rendered = this.emitExpression(first, context);
    return `${indent}// require ${rendered}`;
  }

  isExtendCall(expr) {
    return expr && expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && expr.callee.name === 'extend';
  }

  emitExtendCall(expr, context) {
    const indent = this.indent();
    const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
    return `${indent}// extend ${args}`;
  }

  isDefDelegatorsCall(expr, context) {
    return expr && expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && expr.callee.name === 'def_delegators';
  }

  emitDefDelegators(expr, context = {}) {
    const indent = this.indent();
    const methods = expr.arguments.slice(1)
      .map(arg => this.resolveDelegatorMethodName(arg))
      .filter(Boolean);

    if (!methods.length) {
      const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `${indent}// def_delegators(${args})`;
    }

    if (!context.inClass) {
      const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `${indent}// def_delegators(${args})`;
    }

    const className = context.currentClassName;
    const receiver = className ? `${className}.prototype` : 'this';
    const target = this.resolveDelegatorTarget(expr.arguments[0], context);
    const lines = [];

    const innerIndent = ' '.repeat(this.indentSize);
    for (const methodName of methods) {
      lines.push(`${receiver}[${this.quote(methodName)}] = function(...args) {`);
      lines.push(`${innerIndent}const __target = ${target};`);
      lines.push(`${innerIndent}const __fn = __target != null ? __target[${this.quote(methodName)}] : undefined;`);
      lines.push(`${innerIndent}return typeof __fn === "function" ? __fn.apply(__target, args) : undefined;`);
      lines.push('};');
    }

    return lines.join('\n');
  }

  resolveDelegatorTarget(node, context) {
    if (!node) return 'this';
    if (node.type === 'SymbolLiteral') {
      const name = node.name;
      if (name.startsWith('@@')) {
        const prop = name.slice(2);
        const owner = context.currentClassName ? `${context.currentClassName}` : 'this.constructor';
        return `${owner}.${prop}`;
      }
      if (name.startsWith('@')) {
        return this.instanceVariableReference(name.slice(1));
      }
      return `this[${this.quote(name)}]`;
    }
    return this.emitExpression(node, context);
  }

  resolveDelegatorMethodName(node) {
    if (!node) return null;
    if (node.type === 'SymbolLiteral') return node.name;
    if (node.type === 'Identifier') return node.name;
    if (node.type === 'StringLiteral') return node.value;
    return null;
  }

  isRefineCall(expr) {
    return expr && expr.type === 'CallExpression' && expr.callee.type === 'Identifier' && expr.callee.name === 'refine';
  }

  emitRefineCall(expr, context) {
    const indent = this.indent();
    let targetExpr = 'Object';
    let blockNode = expr.block;

    if (!blockNode && expr.arguments[0] && expr.arguments[0].type === 'CallExpression' && expr.arguments[0].block) {
      targetExpr = this.emitExpression(expr.arguments[0].callee, context);
      blockNode = expr.arguments[0].block;
    } else if (expr.arguments[0]) {
      targetExpr = this.emitExpression(expr.arguments[0], context);
    }

    if (!blockNode) {
      const args = expr.arguments.map(arg => this.emitExpression(arg, context)).join(', ');
      return `${indent}// refine(${args})`;
    }

    const lines = [];
    const bodyStatements = blockNode.body.body;

    for (const statement of bodyStatements) {
      if (statement.type === 'MethodDefinition') {
        lines.push(this.emitRefinedMethod(targetExpr, statement, context));
      } else {
        const stmt = this.emitStatement(statement, context);
        if (stmt) lines.push(stmt);
      }
    }

    if (!lines.length) {
      return `${indent}// refine ${targetExpr}`;
    }

    return lines.join('\n');
  }

  emitRefinedMethod(targetExpr, methodNode, context) {
    const indent = this.indent();
    const scope = this.scopeInfo.get(methodNode);
    const params = [];
    const optionalParams = [];
    let blockParamName = null;
    let restParamName = null;
    let blockFromRest = null;

    for (const param of methodNode.params) {
      if (param.type === 'RestParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        params.push(`...${safeName}`);
        restParamName = safeName;
        continue;
      }
      if (param.type === 'BlockParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        blockParamName = safeName;
        if (restParamName) {
          blockFromRest = { rest: restParamName, block: safeName };
        } else {
          params.push(safeName);
        }
        continue;
      }
      if (param.type === 'OptionalParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        params.push(safeName);
        optionalParams.push({ name: safeName, default: param.default });
        continue;
      }
      const safeName = this.getRenamedName(scope, param.name);
      params.push(safeName);
    }

    if (methodNode.usesYield && !blockParamName) {
      blockParamName = '__block';
      if (restParamName) {
        blockFromRest = { rest: restParamName, block: blockParamName };
      } else {
        params.push(blockParamName);
      }
    }

    const fnBody = this.emitFunctionBody(
      methodNode.body,
      {
        ...context,
        scopeNode: methodNode,
        scopeStack: [methodNode, ...(context.scopeStack || [])],
        inFunction: true,
        allowImplicitReturn: true,
        methodType: 'instance',
        blockParamName,
        optionalParams,
        blockFromRest,
        methodBlockInfo: blockFromRest,
        currentMethodName: methodNode.id.name
      },
      scope
    );

    const paramCode = params.join(', ');
    return `${indent}${targetExpr}.prototype[${this.quote(methodNode.id.name)}] = function(${paramCode}) ${fnBody};`;
  }

  emitExpression(node, context = {}) {
    switch (node.type) {
      case 'Identifier': {
        const name = node.name;
        const declared = this.isIdentifierDeclared(name, context);
        if (!declared) {
          if (/^[A-Z]/.test(name)) {
            return name;
          }
          this.requireRuntime('implicitCall');
          const receiverExpr = context.implicitReceiverExpression ?? this.resolveImplicitCallReceiver(context);
          return `__rubyImplicitCall(${receiverExpr}, ${this.quote(name)})`;
        }
        return this.resolveIdentifierName(name, context);
      }
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
      case 'RegExpLiteral':
        return this.emitRegExpLiteral(node);
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
      case 'MultiAssignmentExpression':
        return this.emitMultiAssignmentExpression(node, context);
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
      case 'SuperCall':
        return this.emitSuperCall(node, context);
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

  emitMultiAssignmentExpression(node, context) {
    const targets = node.targets.map(target => this.emitAssignmentTarget(target, context));
    const right = this.emitExpression(node.right, context);
    if (targets.length <= 1) {
      const target = targets[0] ?? 'undefined';
      return `${target} = ${right}`;
    }
    this.requireRuntime('multiAssign');
    const tempVar = this.generateUniqueId('__multi');
    const destructure = `[${targets.join(', ')}] = __rubyMultiAssign(${tempVar}, ${targets.length});`;
    return `(() => { const ${tempVar} = ${right}; ${destructure} return ${tempVar}; })()`;
  }

  emitAssignmentTarget(target, context) {
    if (!target) return 'undefined';
    switch (target.type) {
      case 'Identifier':
        return this.resolveIdentifierName(target.name, context);
      case 'InstanceVariable':
        return this.instanceVariableReference(target.name);
      case 'MemberExpression':
      case 'OptionalMemberExpression':
        return this.emitExpression(target, context);
      default:
        return this.emitExpression(target, context);
    }
  }

  emitCallExpression(node, context) {
    const calleeName = this.extractCalleeName(node.callee);
    const receiverCode = this.extractCalleeObjectCode(node.callee, context);

    const argList = [];
    let blockPassExpression = null;
    for (const arg of node.arguments) {
      if (arg && arg.type === 'BlockPassExpression') {
        blockPassExpression = this.emitBlockPassExpression(arg, context);
        continue;
      }
      argList.push(this.emitArgumentExpression(arg, context));
    }

    const inlineBlockNode = node.block || null;
    const inlineBlockCode = inlineBlockNode ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true }) : null;
    let blockCode = inlineBlockCode || blockPassExpression;

    if (calleeName === 'proc') {
      if (blockCode) {
        return blockCode;
      }
      if (argList.length) {
        return `${calleeName}(${argList.join(', ')})`;
      }
      return `${calleeName}()`;
    }

    if (calleeName === 'instance_eval' && node.callee.type === 'Identifier' && blockCode && !argList.length) {
      this.requireRuntime('instanceEval');
      const receiverExpr = this.resolveImplicitCallReceiver(context);
      const evalBlock = inlineBlockNode
        ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true })
        : blockCode;
      return `__rubyInstanceEval(${receiverExpr}, ${evalBlock})`;
    }

    if (calleeName === 'instance_exec' && node.callee.type === 'Identifier' && blockCode) {
      this.requireRuntime('instanceExec');
      const execArgs = argList.length ? `[${argList.join(', ')}]` : '[]';
      const receiverExpr = this.resolveImplicitCallReceiver(context);
      return `__rubyInstanceExec(${receiverExpr}, ${execArgs}, ${blockCode})`;
    }

    if (
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.object.type === 'Identifier' &&
      node.callee.object.name === 'Proc' &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'new'
    ) {
      if (node.block) {
        return this.emitBlockFunction(node.block, context, { forceImplicitIdentifiers: true });
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
      node.callee.type === 'OptionalMemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier'
    ) {
      memberProperty = node.callee.property.name;
      memberObjectCode = this.emitExpression(node.callee.object, context);
    } else if (
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

      if (memberProperty === 'to_sym' && node.arguments.length === 0) {
        return `String(${memberObjectCode})`;
      }

      if (memberProperty === 'to_s' && node.arguments.length === 0) {
        return `String(${memberObjectCode})`;
      }

      if (memberProperty === 'size' && node.arguments.length === 0) {
        return `${memberObjectCode}.length`;
      }

      if (memberProperty === 'is_a?' && node.arguments.length === 1) {
        const argNode = node.arguments[0];
        if (argNode.type === 'Identifier' && argNode.name === 'Proc') {
          const objectRef = memberObjectCode ?? this.emitExpression(node.callee.object, context);
          return `typeof ${objectRef} === 'function'`;
        }
      }

      if (memberProperty === 'select' && blockCode) {
        return `${memberObjectCode}.filter(${blockCode})`;
      }

      if (memberProperty === 'class' && node.arguments.length === 0) {
        this.requireRuntime('className');
        return `__rubyClassName(${memberObjectCode})`;
      }

      if (memberProperty === 'freeze' && node.arguments.length === 0) {
        return `Object.freeze(${memberObjectCode})`;
      }

      if (memberProperty === 'lazy' && node.arguments.length === 0) {
        this.requireRuntime('lazy');
        return `__rubyLazy(${memberObjectCode})`;
      }

      if (memberProperty === 'fetch') {
        this.requireRuntime('fetch');
        const indexArg = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
        if (node.arguments.length > 1) {
          const defaultArg = this.emitExpression(node.arguments[1], context);
          return `__rubyFetch(${memberObjectCode}, ${indexArg}, ${defaultArg})`;
        }
        return `__rubyFetch(${memberObjectCode}, ${indexArg})`;
      }

      if (memberProperty === 'match') {
        this.requireRuntime('match');
        const pattern = node.arguments[0] ? this.emitExpression(node.arguments[0], context) : 'undefined';
        return `__rubyMatch(${memberObjectCode}, ${pattern})`;
      }

      if (memberProperty === 'instance_eval' && blockCode && !argList.length) {
        this.requireRuntime('instanceEval');
        const evalBlock = inlineBlockNode
          ? this.emitBlockFunction(inlineBlockNode, context, { forceImplicitIdentifiers: true })
          : blockCode;
        return `__rubyInstanceEval(${memberObjectCode}, ${evalBlock})`;
      }

      if (memberProperty === 'instance_exec' && blockCode) {
        this.requireRuntime('instanceExec');
        const execArgs = argList.length ? `[${argList.join(', ')}]` : '[]';
        return `__rubyInstanceExec(${memberObjectCode}, ${execArgs}, ${blockCode})`;
      }
    }

    if (memberProperty === 'public_send') {
      const methodArg = node.arguments[0];
      const methodNameLiteral = this.extractSymbolName(methodArg);
      if (methodNameLiteral && node.arguments.length >= 2) {
        const right = this.emitExpression(node.arguments[1], context);
        const left = memberObjectCode;
        const operatorMap = {
          '==': '===',
          '!=': '!=='
        };
        const jsOperator = operatorMap[methodNameLiteral] ?? methodNameLiteral;
        if (['>', '>=', '<', '<=', '===', '!=='].includes(jsOperator)) {
          return `${left} ${jsOperator} ${right}`;
        }
      }
      this.requireRuntime('publicSend');
      const argCodes = node.arguments.map(arg => this.emitExpression(arg, context));
      const argsTail = argCodes.length ? `, ${argCodes.join(', ')}` : '';
      return `__rubyPublicSend(${memberObjectCode}${argsTail})`;
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
    } else if (node.callee.type === 'Identifier' && context.methodType === 'instance') {
      const scope = context.scopeNode ? this.scopeInfo.get(context.scopeNode) : null;
      const isDeclared = scope ? scope.declared.has(node.callee.name) : false;
      calleeCode = isDeclared ? node.callee.name : `this.${node.callee.name}`;
    } else {
      calleeCode = this.emitExpression(node.callee, context);
    }

    const argsArray = argList.length ? `[${argList.join(', ')}]` : '[]';
    const blockArg = blockCode ? blockCode : 'undefined';
    const argsWithBlock = blockCode ? [...argList, blockCode] : [...argList];

    if (!memberProperty && node.callee.type === 'Identifier') {
      const handledNames = ['proc', 'instance_eval', 'instance_exec', 'block_given?', 'define_method', 'instance_variable_get', 'instance_variable_set', 'eval', 'puts', 'print', 'gets'];
      if (!this.isIdentifierDeclared(node.callee.name, context) && !handledNames.includes(node.callee.name)) {
        const implicitReceiver = this.resolveImplicitCallReceiver(context);
        return `__rubySend(${implicitReceiver}, ${this.quote(node.callee.name)}, ${argsArray}, ${blockArg})`;
      }
    }

    if (memberProperty === 'call' && node.callee.type !== 'OptionalMemberExpression') {
      const args = argList.join(', ');
      return `${memberObjectCode}(${args})`;
    }

    if (
      blockCode &&
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'each'
    ) {
      const objectCode = this.emitExpression(node.callee.object, context);
      return `${objectCode}.forEach(${blockCode})`;
    }

    if (
      blockCode &&
      node.callee.type === 'MemberExpression' &&
      !node.callee.computed &&
      node.callee.property.type === 'Identifier' &&
      node.callee.property.name === 'each_with_index'
    ) {
      const objectCode = this.emitExpression(node.callee.object, context);
      return `${objectCode}.forEach(${blockCode})`;
    }

    if (node.callee.type === 'OptionalMemberExpression') {
      const objectCode = this.emitExpression(node.callee.object, context);
      const args = argsWithBlock.join(', ');
      const callSuffix = args.length ? `(${args})` : '()';
      if (node.callee.computed) {
        const propertyCode = this.emitExpression(node.callee.property, context);
        return `${objectCode}?.[${propertyCode}]${callSuffix}`;
      }
      return `${objectCode}?.${node.callee.property.name}${callSuffix}`;
    }

    if (!isConstructorCall && node.callee.type === 'MemberExpression' && !node.callee.computed && node.callee.property.type === 'Identifier') {
      this.requireRuntime('send');
      const objectCode = this.emitExpression(node.callee.object, context);
      return `__rubySend(${objectCode}, ${this.quote(node.callee.property.name)}, ${argsArray}, ${blockArg})`;
    }

    if (isConstructorCall) {
      const ctorArgs = argsWithBlock.join(', ');
      return `new ${calleeCode}(${ctorArgs})`;
    }

    return `${calleeCode}(${argsWithBlock.join(', ')})`;
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

  extractSymbolName(node) {
    if (!node) return null;
    if (node.type === 'SymbolLiteral') return node.name;
    if (node.type === 'StringLiteral') return node.value;
    if (node.type === 'Identifier' && !node.name.startsWith('__')) return node.name;
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
    const scope = this.scopeInfo.get(node);
    let paramNames = node.params.map(param => this.getRenamedName(scope, param.name));
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
        scopeStack: [node, ...(context.scopeStack || [])],
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

  emitSuperCall(node, context = {}) {
    const methodName = context.currentMethodName;
    const isStatic = context.methodType === 'static';
    const hasArgs = node.arguments && node.arguments.length > 0;
    const argExpressions = hasArgs
      ? node.arguments.map(arg => this.emitExpression(arg, context))
      : [];
    const argList = argExpressions.join(', ');

    if (methodName) {
      const accessor = this.isValidMethodName(methodName)
        ? `super.${methodName}`
        : `super[${this.quote(methodName)}]`;
      const receiver = isStatic ? 'this' : 'this';
      const guardLines = [];
      guardLines.push(`(() => {`);
      guardLines.push(`  const __superMethod = ${accessor};`);
      guardLines.push(`  if (typeof __superMethod !== 'function') {`);
      if (methodName === 'method_missing') {
        const receiverExpr = isStatic ? 'this' : 'this';
        const missingExpr = argExpressions.length ? argExpressions[0] : 'arguments[0]';
        guardLines.push(`    throw new Error("NoMethodError: undefined method " + String(${missingExpr}) + " for " + String(${receiverExpr}));`);
      } else {
        guardLines.push(`    throw new Error(${this.quote(`NoMethodError: super has no method ${methodName}`)});`);
      }
      guardLines.push('  }');
      if (hasArgs) {
        guardLines.push(`  return __superMethod.call(${receiver}${argList.length ? ', ' + argList : ''});`);
      } else {
        guardLines.push(`  return __superMethod.apply(${receiver}, arguments);`);
      }
      guardLines.push('})()');
      return guardLines.join(' ');
    }

    if (hasArgs) {
      return `super(${argList})`;
    }
    return 'super(...arguments)';
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
    let objectCode = this.emitExpression(node.object, context);
    if (['LogicalExpression', 'BinaryExpression', 'ConditionalExpression'].includes(node.object.type)) {
      objectCode = `(${objectCode})`;
    }
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
    const left = node.left.type === 'LogicalExpression'
      ? `(${this.emitExpression(node.left, context)})`
      : this.emitExpression(node.left, context);
    const right = node.right.type === 'LogicalExpression'
      ? `(${this.emitExpression(node.right, context)})`
      : this.emitExpression(node.right, context);
    return `${left} ${this.mapBinaryOperator(node.operator)} ${right}`;
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

  emitRegExpLiteral(node) {
    let source = node.pattern
      .replace(/\\A/g, '^')
      .replace(/\\z/g, '$');
    const pattern = JSON.stringify(source).slice(1, -1);
    const filteredFlags = (node.flags || '').replace(/[^gimuy]/g, '');
    return `new RegExp("${pattern}", "${filteredFlags}")`;
  }

  emitMethodDefinition(node, context = {}) {
    const scope = this.scopeInfo.get(node);
    const indent = this.indent();
    const isStatic = context.inClass && node.target && node.target.type === 'SelfExpression';
    const isConstructor = !isStatic && context.inClass && node.id.name === 'initialize';
    const methodName = isConstructor ? 'constructor' : node.id.name;
    const paramNames = [];
    const optionalParams = [];
    let blockParamName = null;
    let restParamName = null;
    let blockFromRest = null;

    for (const param of node.params) {
      if (param.type === 'RestParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        paramNames.push(`...${safeName}`);
        restParamName = safeName;
        continue;
      }
      if (param.type === 'BlockParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        blockParamName = safeName;
        if (restParamName) {
          blockFromRest = { rest: restParamName, block: safeName };
        } else {
          paramNames.push(safeName);
        }
        continue;
      }
      if (param.type === 'OptionalParameter') {
        const safeName = this.getRenamedName(scope, param.name);
        paramNames.push(safeName);
        optionalParams.push({ name: safeName, default: param.default });
        continue;
      }
      const safeName = this.getRenamedName(scope, param.name);
      paramNames.push(safeName);
    }

    if (node.usesYield && !blockParamName) {
      blockParamName = '__block';
      if (restParamName) {
        blockFromRest = { rest: restParamName, block: blockParamName };
      } else {
        paramNames.push(blockParamName);
      }
    }

    const paramsCode = paramNames.join(', ');
    let header;
    if (context.inClass) {
      if (isConstructor) {
        header = `${indent}${methodName}(${paramsCode})`;
      } else {
        const methodKey = this.isValidMethodName(methodName) ? methodName : `[${this.quote(methodName)}]`;
        const prefix = isStatic ? 'static ' : '';
        header = `${indent}${prefix}${methodKey}(${paramsCode})`;
      }
    } else {
      if (this.isValidMethodName(methodName)) {
        header = `${indent}function ${methodName}(${paramsCode})`;
      } else {
        const tempName = this.generateUniqueId('__method');
        header = `${indent}const ${tempName} = function(${paramsCode})`;
      }
    }

    const allowImplicitReturn = !(context.inClass && methodName === 'constructor');
    const body = this.emitFunctionBody(
      node.body,
      {
        ...context,
        scopeNode: node,
        scopeStack: [node, ...(context.scopeStack || [])],
        inFunction: true,
        allowImplicitReturn,
        methodType: isStatic ? 'static' : 'instance',
        blockParamName,
        optionalParams,
        blockFromRest,
        methodBlockInfo: blockFromRest,
        currentMethodName: methodName
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
        const safeName = this.getRenamedName(scope, name);
        lines.push(this.indent() + `let ${safeName};`);
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
      const candidate = this.generateUniqueId('__blockCandidate');
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
      const stmt = this.emitStatement(statement, stmtContext);
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
    const baseContext = { ...context };
    delete baseContext.blockFromRest;
    delete baseContext.optionalParams;
    const forceImplicit = options.forceImplicitIdentifiers ?? baseContext.forceImplicitIdentifiers ?? false;
    const fnContext = {
      ...baseContext,
      scopeNode: block,
      scopeStack: [block, ...(baseContext.scopeStack || [])],
      inFunction: true,
      allowImplicitReturn: options.allowImplicitReturn !== undefined ? options.allowImplicitReturn : true,
      forceImplicitIdentifiers: forceImplicit
    };
    const body = this.emitFunctionBody(block.body, fnContext, scope);
    const paramList = params.join(', ');
    const innerFunction = `function(${paramList}) ${body}`;
    if (options.asFunction) {
      return innerFunction;
    }
    const selfVar = this.generateUniqueId('__self');
    const blockVar = this.generateUniqueId('__block');
    const argsVar = this.generateUniqueId('__args');
    const prevVar = this.generateUniqueId('__prev');
    const lines = [];
    lines.push('(() => {');
    lines.push(`  let ${selfVar} = this;`);
    lines.push(`  const ${blockVar} = function(...${argsVar}) {`);
    lines.push(`    return (${innerFunction}).apply(${selfVar}, ${argsVar});`);
    lines.push('  };');
    lines.push(`  ${blockVar}.__rubyBind = (value) => {`);
    lines.push(`    const ${prevVar} = ${selfVar};`);
    lines.push(`    ${selfVar} = value;`);
    lines.push('    return () => {');
    lines.push(`      ${selfVar} = ${prevVar};`);
    lines.push('    };');
    lines.push('  };');
    lines.push(`  return ${blockVar};`);
    lines.push('})()');
    return lines.join('\n');
  }

  resolveBlockParameters(block) {
    const scope = this.scopeInfo.get(block);
    if (block.params && block.params.length) {
      return block.params.map(param => this.getRenamedName(scope, param.name));
    }
    const inferred = this.inferImplicitParams(block.body);
    if (scope) {
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

  emitModuleDeclaration(node, context = {}) {
    const indent = this.indent();
    const lines = [`${indent}const ${node.id.name} = {};`];
    const moduleContext = { ...context, inModule: true, currentModuleName: node.id.name };
    for (const statement of node.body.body) {
      const stmt = this.emitStatement(statement, moduleContext);
      if (stmt) lines.push(stmt);
    }
    return lines.join('\n');
  }

  emitUsingStatement(node) {
    const indent = this.indent();
    return `${indent}// using ${node.id.name}`;
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
    const testExpression = node.test ? this.emitExpression(node.test, context) : null;
    const lines = [];

    const hasPatternClause = node.clauses.some(clause => clause.type === 'PatternClause');
    let valueReference = testExpression;

    if (hasPatternClause && testExpression) {
      const caseVar = this.generateUniqueId('__case');
      lines.push(`${indent}const ${caseVar} = ${testExpression};`);
      valueReference = caseVar;
    }

    const patternMatchVars = new Map();
    for (const clause of node.clauses) {
      if (clause.type === 'PatternClause') {
        patternMatchVars.set(clause, this.generateUniqueId('__pattern'));
      }
    }

    if (patternMatchVars.size) {
      for (const matchVar of patternMatchVars.values()) {
        lines.push(`${indent}let ${matchVar};`);
      }
    }

    node.clauses.forEach((clause, index) => {
      let condition;
      let block;

      if (clause.type === 'PatternClause') {
        this.requireRuntime('hashPattern');
        const matchVar = patternMatchVars.get(clause);
        const descriptors = this.buildHashPatternDescriptors(clause.pattern, context);
        const descriptorCode = `[${descriptors.map(desc => `{ binding: ${this.quote(desc.binding)}, keys: [${desc.keys.map(key => this.quote(key)).join(', ')}] }`).join(', ')}]`;
        const target = valueReference || 'undefined';
        condition = `(${matchVar} = __rubyMatchHashPattern(${target}, ${descriptorCode}))`;

        const blockString = this.emitBlockStatement(clause.body, context);
        const innerIndent = indent + ' '.repeat(this.indentSize);
        const bindingLines = descriptors.map(desc => `${innerIndent}const ${desc.binding} = ${matchVar}[${this.quote(desc.binding)}];`);
        block = this.prependBlockLines(blockString, bindingLines);
      } else {
        condition = this.emitCaseCondition(valueReference, clause, context);
        block = this.emitBlockStatement(clause.body, context);
      }

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

  emitCaseCondition(valueReference, clause, context) {
    const expressions = clause.tests.map(test => this.emitExpression(test, context));
    if (valueReference) {
      return expressions.map(expr => `${valueReference} === ${expr}`).join(' || ');
    }
    if (expressions.length === 0) return 'true';
    return expressions.join(' || ');
  }

  buildHashPatternDescriptors(pattern, context = {}) {
    if (!pattern || pattern.type !== 'HashPattern') return [];
    return pattern.entries.map(entry => ({
      binding: this.resolveIdentifierName(entry.binding.name, context),
      keys: this.resolvePatternKeys(entry.key)
    }));
  }

  resolvePatternKeys(keyNode) {
    if (!keyNode) return [''];
    switch (keyNode.type) {
      case 'SymbolLiteral':
        return [keyNode.name];
      case 'Identifier':
        return [keyNode.name];
      case 'StringLiteral':
        return [keyNode.value];
      default:
        return [this.emitExpression(keyNode)];
    }
  }

  prependBlockLines(block, lines) {
    if (!lines.length) return block;
    const parts = block.split('\n');
    parts.splice(1, 0, ...lines);
    return parts.join('\n');
  }

  collectPattern(pattern, scope) {
    if (!pattern || typeof pattern !== 'object') return;
    switch (pattern.type) {
      case 'HashPattern':
        for (const entry of pattern.entries) {
          if (entry.binding && entry.binding.name) {
            scope.declared.add(entry.binding.name);
            this.registerReservedName(scope, entry.binding.name);
          }
          if (entry.value) this.collectNode(entry.value, scope);
        }
        break;
      default:
        break;
    }
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

  generateUniqueId(prefix = '__temp') {
    this.uniqueIdCounter += 1;
    return `${prefix}${this.uniqueIdCounter}`;
  }

  quote(value) {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/"/g, '\\"');
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
    if (!scope.renamed) scope.renamed = new Map();
    if (scope.renamed.has(name)) return;
    let suffix = '_';
    let candidate = `${name}${suffix}`;
    const taken = new Set(scope.renamed ? [...scope.renamed.values()] : []);
    while (this.isReservedIdentifier(candidate) || taken.has(candidate)) {
      suffix += '_';
      candidate = `${name}${suffix}`;
    }
    scope.renamed.set(name, candidate);
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

  resolveImplicitCallReceiver(context = {}) {
    if (context && typeof context.implicitReceiver === 'string') {
      return context.implicitReceiver;
    }
    if (context.methodType === 'static' && context.currentClassName) {
      return context.currentClassName;
    }
    if (context.classLevel && context.currentClassName) {
      return context.currentClassName;
    }
    return 'this';
  }

  resolveIdentifierName(name, context = {}) {
    if (!name) return name;
    const stack = context.scopeStack && context.scopeStack.length
      ? context.scopeStack
      : (context.scopeNode ? [context.scopeNode] : []);
    for (const scopeNode of stack) {
      const scope = this.scopeInfo.get(scopeNode);
      if (scope && scope.renamed && scope.renamed.has(name)) {
        return scope.renamed.get(name);
      }
    }
    return name;
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
      if (!param) continue;
      if (param.name) {
        scope.declared.add(param.name);
        this.registerReservedName(scope, param.name);
      }
      if (param.type === 'OptionalParameter' && param.default) {
        this.collectNode(param.default, scope);
      }
    }
    if (node.usesYield && !node.params.some(param => param.type === 'BlockParameter')) {
      scope.declared.add('__block');
    }
    this.scopeInfo.set(node, scope);
    this.collectNode(node.body, scope);
  }

  createScope() {
    return { declared: new Set(), hoisted: new Set(), renamed: new Map() };
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
      case 'MultiAssignmentExpression':
        if (Array.isArray(node.targets)) {
          for (const target of node.targets) {
            this.recordAssignment(target, scope);
          }
        }
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
          if (clause.type === 'PatternClause') {
            this.collectPattern(clause.pattern, scope);
          } else if (clause.tests) {
            for (const test of clause.tests) this.collectNode(test, scope);
          }
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
      this.registerReservedName(scope, param.name);
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
      this.registerReservedName(scope, param.name);
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
      this.registerReservedName(scope, target.name);
    } else if (target.type === 'MemberExpression') {
      this.collectNode(target.object, scope);
      if (target.computed) this.collectNode(target.property, scope);
    }
  }
}

module.exports = { Emitter };
