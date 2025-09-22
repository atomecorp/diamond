/* global $ */
(function () {
    // Container
    const app = $('div', {
        id: 'ruby2js-app',
        css: {
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
            margin: '16px'
        }
    });

    // Title
    app.appendChild($('div', { text: 'Ruby → JavaScript (offline, identique au CLI)' }));

    // Editor
    const editorLabel = $('div', { text: 'Ruby source:' });
    const editor = $('textarea', {
        id: 'ruby-input',
        css: {
            width: '100%', height: '220px', fontFamily: 'Menlo, monospace', fontSize: '13px', padding: '8px', boxSizing: 'border-box'
        },
        text: '# Output "I love Ruby"\n' +
            'say = "I love Ruby"\n' +
            'puts say\n\n' +
            '# Output "I *LOVE* RUBY"\n' +
            'say[\'love\'] = "*love*"\n' +
            'puts say.upcase!\n\n' +
            '# Output "I *love* Ruby"\n' +
            '# five times\n' +
            '5.times { puts say }\n'
    });

    const actions = $('div', { css: { marginTop: '8px', display: 'flex', gap: '8px' } });
    const compileBtn = $('button', { text: 'Transpiler & Exécuter' });
    const clearBtn = $('button', { text: 'Effacer sortie' });
    actions.appendChild(compileBtn);
    actions.appendChild(clearBtn);

    const jsLabel = $('div', { text: 'JavaScript généré:' });
    const jsOut = $('pre', {
        id: 'js-output',
        css: { backgroundColor: '#111', color: '#eee', padding: '8px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
    });

    const runLabel = $('div', { text: 'Output exécution:' });
    const runOut = $('pre', {
        id: 'run-output',
        css: { backgroundColor: '#111', color: '#8f8', padding: '8px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
    });

    app.appendChild(editorLabel);
    app.appendChild(editor);
    app.appendChild(actions);
    app.appendChild(jsLabel);
    app.appendChild(jsOut);
    app.appendChild(runLabel);
    app.appendChild(runOut);

    function withCapturedConsole(fn) {
        const origLog = console.log;
        try {
            console.log = (...args) => {
                runOut.textContent += args.map((x) => typeof x === 'string' ? x : JSON.stringify(x)).join(' ') + '\n';
                origLog.apply(console, args);
            };
            return fn();
        } finally {
            console.log = origLog;
        }
    }

    function compileAndRun() {
        const src = editor.value || '';
        if (!window.Diamond || typeof window.Diamond.transpile !== 'function') {
            jsOut.textContent = 'Diamond.transpile indisponible. Assure-toi que diamond.browser.js est construit.';
            return;
        }
        try {
            const { code } = window.Diamond.transpile(src);
            jsOut.textContent = code;
            withCapturedConsole(() => {
                // eslint-disable-next-line no-new-func
                const fn = new Function('"use strict";\n' + code);
                fn();
            });
        } catch (e) {
            jsOut.textContent = (jsOut.textContent || '') + '\n\n/* Transpile/Run error */\n' + (e.stack || e.message || String(e));
        }
    }

    compileBtn.addEventListener('click', compileAndRun);
    clearBtn.addEventListener('click', () => { runOut.textContent = ''; });

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(app);
    });
})();
