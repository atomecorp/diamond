#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { transpile } = require('./src/transpiler');

function printHelp() {
  console.log(`Usage: ruby2js <input.rb> [options]\n\n` +
    `Options:\n` +
    `  -o, --out <file>    Write transpiled JavaScript to the specified file\n` +
    `  -s                  Write alongside the input using the same basename and .js\n` + // ajouté
    `  --ast               Print the intermediate AST to stderr\n` +
    `  -h, --help          Show this message`);
}

function main() {
  const args = process.argv.slice(2);
  let inputPath = null;
  let outputPath = null;
  let showAst = false;
  let sameName = false; // ajouté

  while (args.length) {
    const arg = args.shift();
    if (arg === '--ast') {
      showAst = true;
    } else if (arg === '-o' || arg === '--out') {
      outputPath = args.shift();
      if (!outputPath) {
        console.error('Missing value for --out option');
        process.exit(1);
      }
    } else if (arg === '-s') { // ajouté
      sameName = true;
    } else if (arg === '-h' || arg === '--help') {
      printHelp();
      return;
    } else if (!inputPath) {
      inputPath = arg;
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  if (!inputPath) {
    console.error('No input file provided.');
    printHelp();
    process.exit(1);
  }

  let source;
  try {
    source = fs.readFileSync(path.resolve(process.cwd(), inputPath), 'utf8');
  } catch (error) {
    console.error(`Unable to read input file: ${error.message}`);
    process.exit(1);
  }

  try {
    const result = transpile(source);
    if (showAst) {
      console.error(JSON.stringify(result.ast, null, 2));
    }
    if (outputPath) {
      fs.writeFileSync(path.resolve(process.cwd(), outputPath), result.code, 'utf8');
    } else if (sameName) { // ajouté
      const absInput = path.resolve(process.cwd(), inputPath);
      const dir = path.dirname(absInput);
      const base = path.basename(absInput, path.extname(absInput));
      const derived = path.join(dir, `${base}.js`);
      fs.writeFileSync(derived, result.code, 'utf8');
    } else {
      console.log(result.code);
    }
  } catch (error) {
    console.error(`Failed to transpile: ${error.message}`);
    process.exit(1);
  }
}

main();