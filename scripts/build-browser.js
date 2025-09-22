#!/usr/bin/env node
const esbuild = require('esbuild');

async function build() {
    try {
        await esbuild.build({
            entryPoints: ['src/transpiler.js'],
            bundle: true,
            platform: 'browser',
            format: 'iife',
            globalName: 'Diamond',
            outfile: 'examples/inline_converter/diamond.browser.js',
            sourcemap: false,
            minify: false,
            logLevel: 'info'
        });
        console.log('Built examples/inline_converter/diamond.browser.js');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

build();
