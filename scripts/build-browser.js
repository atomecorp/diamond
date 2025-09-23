#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

const args = process.argv.slice(2);
const watch = args.includes('--watch');

const outfile = path.resolve(__dirname, '..', 'dist', 'diamond.browser.js');

async function build() {
  try {
    fs.mkdirSync(path.dirname(outfile), { recursive: true });

    const options = {
      entryPoints: [path.resolve(__dirname, '..', 'src', 'transpiler.js')],
      bundle: true,
      platform: 'browser',
      format: 'iife',
      globalName: 'Diamond',
      outfile,
      sourcemap: true,
      minify: false,
      logLevel: 'info'
    };

    if (watch) {
      const ctx = await esbuild.context(options);
      await ctx.watch();
      console.log('Built %s (watching for changes…)', path.relative(process.cwd(), outfile));
    } else {
      await esbuild.build(options);
      console.log('Built %s', path.relative(process.cwd(), outfile));
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
