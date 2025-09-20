# Ruby → JavaScript Transpiler (AST-based)

This project provides a small Ruby-to-JavaScript transpiler written in vanilla JavaScript. The converter tokenises Ruby source, builds a simplified AST, and emits readable JavaScript that favours clarity over raw throughput.

## Features
- Pure Node.js implementation (no native extensions, no external parsers).
- Tokeniser, Pratt-style parser, and code generator broken into reusable modules under `src/`.
- CLI (`./cli.js`) that prints JavaScript to stdout and optionally dumps the intermediate AST.
- Basic variable hoisting to mimic Ruby local-scope semantics inside functions.
- Structural transforms tuned for readability: `puts` → `console.log`, `ClassName.new` → `new ClassName`, `initialize` → `constructor`, `@var` → `this.var`, simple hash → object literal, and Ruby string interpolation → JS template literals.
- Syntactic sugar support for everyday Ruby: `case/when` → `if/else` chain, `loop do` → `while (true)`, safe navigation (`&.`) → optional chaining, `each_with_index` blocks → `Array#forEach` callbacks, and ternaries preserved as-is.
- Smoke tests in `tests/smoke.js` covering core behaviour.

## Supported Ruby subset
The current parser intentionally tackles a pragmatic subset of Ruby:
- Top-level expressions, assignments, arithmetic, comparisons, logical operators.
- Method calls with or without parentheses (command style for simple cases).
- Class definitions with instance methods.
- `def`, `if/elsif/else`, `while`, and `return` statements.
- Numeric, string (with interpolation), boolean, nil, array, and hash literals.

Notable omissions for now include blocks (`do ... end` on iterators), modules/mixins, splats, keyword arguments, rescue/ensure, and most metaprogramming helpers. Unsupported constructs raise a syntax error so it’s clear when the transpiler needs to be extended.

## CLI usage
```
# Transpile to stdout
./cli.js path/to/file.rb

# Write JavaScript alongside the original file
./cli.js path/to/file.rb -o output.js

# Inspect the intermediate AST (printed to stderr)
./cli.js --ast path/to/file.rb
```

## Tuto rapide
1. **Écris un fichier Ruby** – crée par exemple `demo.rb` avec un peu de code (cf. `examples/simple.rb` pour l’inspiration).
2. **Transpile en JavaScript** – lance `./cli.js demo.rb -o demo.js` (ou `node cli.js demo.rb` si le shebang n’est pas exécutable).
3. **Teste le résultat** – exécute `node demo.js`, intègre le fichier dans une page HTML, ou importe le module où tu veux. Pour vérifier la structure, ajoute `--ast` et inspecte l’arbre généré.
4. **Itère** – adapte ton code Ruby ou complète le transpileur (tokenizer/parser/emitter) si une construction n’est pas encore supportée.

## Example
Input (`examples/simple.rb`):
```ruby
class Greeter
  def initialize(name)
    @name = name
  end

  def greet(times)
    i = 0
    while i < times
      puts "Hello #{@name}!"
      i += 1
    end
  end
end

Greeter.new("Jean").greet(2)
```

Output:
```js
class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet(times) {
    let i;
    i = 0;
    while (i < times) {
      console.log(`Hello ${this.name}!`);
      i += 1;
    }
  }
}
new Greeter("Jean").greet(2);
```

## Exemple complet : du Ruby à la page HTML
Ce dépôt embarque un exemple clé en main dans `examples/` :

- `browser_demo.rb` contient la version Ruby.
- `./cli.js examples/browser_demo.rb -o examples/browser_demo.js` génère le JavaScript.
- `browser_demo.html` charge le JS généré et affiche le résultat dans le DOM.

Procédure rapide :

```
# 1. Générer le JS (déjà fait dans le repo, mais rejouable)
./cli.js examples/browser_demo.rb -o examples/browser_demo.js

# 2. Ouvrir la page de test
open examples/browser_demo.html    # macOS
# xdg-open examples/browser_demo.html  # Linux
# start examples\browser_demo.html    # Windows
```

Dans le navigateur, le contenu du `<p id="output">` est remplacé par `Bonjour Monde!`, ce qui prouve que le code Ruby a bien été transpillé et exécuté côté client.

## Development
Install dependencies (only Node.js is required), then run the smoke tests:
```
node tests/smoke.js
```

To experiment programmatically:
```js
const { transpile } = require('./src/transpiler');
const source = 'puts "Bonjour"';
const { code } = transpile(source);
console.log(code);
```

## Extending
The code is structured so new grammar rules slot into `parser.js`, new AST nodes render through `emitter.js`, and token tweaks live in `tokenizer.js`. The README’s limitations section is a good checklist for future evolution (blocks, iterators, more built-ins, etc.).
