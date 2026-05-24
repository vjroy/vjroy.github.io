(() => {
    // ── Theme system ──────────────────────────────────────────
    const THEMES = {
        default: { '--bg': '#0d1117', '--text': '#e6edf3', '--green': '#3fb950', '--blue': '#58a6ff', '--orange': '#e3b341', '--dim': '#6e7681', '--red': '#f85149', '--border': '#21262d' },
        amber:   { '--bg': '#0c0800', '--text': '#ffb700', '--green': '#ffb700', '--blue': '#ff8c00', '--orange': '#ff6600', '--dim': '#7a5500', '--red': '#ff3300', '--border': '#332200' },
        green:   { '--bg': '#001100', '--text': '#00ff41', '--green': '#00ff41', '--blue': '#39ff14', '--orange': '#aaff00', '--dim': '#005500', '--red': '#ff0000', '--border': '#003300' },
        light:   { '--bg': '#fafbfc', '--text': '#24292f', '--green': '#116329', '--blue': '#0969da', '--orange': '#953800', '--dim': '#6e7781', '--red': '#cf222e', '--border': '#d0d7de' },
    };

    function applyTheme(name) {
        const theme = THEMES[name];
        if (!theme) return false;
        Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
        localStorage.setItem('vjroy_theme', name);
        return true;
    }

    // Restore saved theme before first paint
    applyTheme(localStorage.getItem('vjroy_theme') || 'default');

    // ── DOM ──────────────────────────────────────────────────
    const outputEl = document.getElementById('output');
    const inputEl  = document.getElementById('cmd-input');
    const cursorEl = document.getElementById('cursor');

    // ── History ──────────────────────────────────────────────
    const cmdHistory = [];
    let histIdx = -1;

    // ── Output helpers ───────────────────────────────────────
    function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function line(html = '') {
        const d = document.createElement('div');
        d.className = 'line';
        d.innerHTML = html;
        outputEl.appendChild(d);
        outputEl.scrollTop = outputEl.scrollHeight;
    }

    function blank() { line(''); }
    function lines(arr) { arr.forEach(line); }

    function echoCmd(cmd) {
        line(`<span class="c-dim"><span class="c-green">veejhay@portfolio</span>:<span class="c-blue">~</span>$</span> ${esc(cmd)}`);
    }

    function bar(pct, w = 28) {
        const f = Math.round(pct / 100 * w);
        return `<span class="c-green">${'▓'.repeat(f)}</span><span class="c-dim">${'░'.repeat(w - f)}</span>`;
    }

    // ── Block cursor ─────────────────────────────────────────
    function updateCursor() {
        const show = inputEl.value.length === 0 && document.activeElement === inputEl;
        cursorEl.classList.toggle('hidden', !show);
    }

    inputEl.addEventListener('input', updateCursor);
    inputEl.addEventListener('focus', updateCursor);
    inputEl.addEventListener('blur',  updateCursor);

    // ── Levenshtein (typo suggestions) ───────────────────────
    function lev(a, b) {
        const m = a.length, n = b.length;
        const dp = Array.from({ length: m + 1 }, (_, i) =>
            Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
        );
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                dp[i][j] = a[i-1] === b[j-1]
                    ? dp[i-1][j-1]
                    : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
        return dp[m][n];
    }

    // ── Link registry ─────────────────────────────────────────
    const LINKS = {
        github:        'https://github.com/vjroy',
        discord:       'https://discord.com/users/688513027124887601',
        email:         'mailto:usroyvj@gmail.com',
        resume:        'Resume_Veejhay.pdf',
        routecraft:    'https://routecraft.io',
        milesplit:     'https://nj.milesplit.com/athletes/12388736-veejhay-roy',
        routeeval:     'https://github.com/vjroy/routeeval',
        splitdecision: 'https://apps.apple.com/us/app/split-decision/id6745452671',
        paper:         'LLM_Research (1).pdf',
        harvardx:      'HarvardX.pdf',
        fraud:         'https://github.com/yazganschool/finalproject',
    };

    // ── Commands ──────────────────────────────────────────────

    function cmdHelp() {
        blank();
        line(`<span class="c-orange">available commands</span>`);
        blank();
        [
            ['about',              'who I am'],
            ['ls',                 'list projects'],
            ['cat &lt;project&gt;','view project details'],
            ['skills',             'languages &amp; tools'],
            ['contact',            'get in touch'],
            ['resume',             'open resume PDF'],
            ['open &lt;link&gt;',  'github · discord · routecraft · milesplit · ...'],
            ['theme &lt;name&gt;', 'default · amber · green · light'],
            ['ping &lt;host&gt;',  'send packets'],
            ['clear',              'clear terminal'],
            ['date',               'current date &amp; time'],
        ].forEach(([cmd, desc]) =>
            line(`  <span class="c-blue">${cmd.padEnd(22)}</span><span class="c-dim">${desc}</span>`)
        );
        blank();
        line(`  <span class="c-dim">↑ / ↓  history  ·  tab  autocomplete  ·  ctrl+l  clear</span>`);
        blank();
    }

    function cmdAbout() {
        blank();
        lines([
            `  <span class="c-orange">Veejhay Roy</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  CS @ Georgia Tech '30`,
            `  New Jersey, US`,
            ``,
            `  Currently researching how well LLMs reason about`,
            `  physical space. Built RouteEval — a benchmark of`,
            `  10,000+ running-route evaluations across 13 models.`,
            `  Paper submitted to ACL ARR 2025.`,
            ``,
            `  Also: iOS coach-facing split tracker used by 100+`,
            `  athletes, a Columbia ML project, HarvardX data`,
            `  science cert, and all-county runner (400m–5K).`,
        ]);
        blank();
    }

    function cmdLs() {
        blank();
        line(`  <span class="c-dim">projects/</span>`);
        [
            ['routeeval',       'LLM route benchmark · research'],
            ['routecraft',      'AI route generator · web'],
            ['splitdecision',   'iOS split tracker · mobile'],
            ['fraud-detection', 'credit card fraud model · ml'],
            ['harvardx',        'data science certificate · education'],
            ['running',         'XC &amp; track · athletics'],
        ].forEach(([name, desc], i, arr) => {
            const p = i < arr.length - 1 ? '├──' : '└──';
            line(`  <span class="c-dim">${p}</span> <span class="c-blue">${name.padEnd(18)}</span><span class="c-dim">${desc}</span>`);
        });
        blank();
    }

    function catRouteEval() {
        blank();
        lines([
            `  <span class="c-orange">RouteEval</span>  <span class="c-dim">· LLM Research</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  Benchmark testing LLM accuracy on running-route`,
            `  generation. Built with MIT graduate Roger Jin.`,
            ``,
            `  <span class="c-dim">evaluations</span>   10,000+`,
            `  <span class="c-dim">models tested</span> 13`,
            `  <span class="c-dim">submitted</span>     ACL ARR October 2025`,
            ``,
            `  <span class="c-orange">accuracy results</span>`,
            ``,
            `  <span class="c-dim">GPT-5           65%</span>  ${bar(65)}`,
            `  <span class="c-dim">Grok-4          55%</span>  ${bar(55)}`,
            `  <span class="c-dim">Gemini-2.5-pro  52%</span>  ${bar(52)}`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open paper</span>      view research paper`,
            `  <span class="c-dim">→</span>  <span class="c-blue">open routeeval</span>  GitHub repo`,
        ]);
        blank();
    }

    function catRoutecraft() {
        blank();
        lines([
            `  <span class="c-orange">Routecraft</span>  <span class="c-dim">· Web App</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  Generates AI running routes from a prompt. Supports`,
            `  multiple models so you can compare outputs. Also`,
            `  hosts the RouteEval research blog.`,
            ``,
            `  <span class="c-dim">url</span>  routecraft.io`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open routecraft</span>`,
        ]);
        blank();
    }

    function catSplitDecision() {
        blank();
        lines([
            `  <span class="c-orange">SplitDecision</span>  <span class="c-dim">· iOS App</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  Coach-facing app for tracking workout splits for XC`,
            `  and track teams. Built in Swift with a friend.`,
            ``,
            `  <span class="c-dim">users</span>  100+ athletes`,
            `  <span class="c-dim">stack</span>  Swift / SwiftUI`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open splitdecision</span>  App Store`,
        ]);
        blank();
    }

    function catFraud() {
        blank();
        lines([
            `  <span class="c-orange">Credit Card Fraud Detection</span>  <span class="c-dim">· ML</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  Final project from Columbia University summer DS`,
            `  program. Voter classifier combining Logistic`,
            `  Regression + Random Forest. Used SMOTE to balance`,
            `  the heavily skewed fraud dataset.`,
            ``,
            `  <span class="c-dim">stack</span>  Python · scikit-learn · pandas · SMOTE`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open fraud</span>  GitHub repo`,
        ]);
        blank();
    }

    function catHarvardX() {
        blank();
        lines([
            `  <span class="c-orange">HarvardX Data Science</span>  <span class="c-dim">· Education</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  ML math: multivariable calculus, statistics,`,
            `  probability, linear algebra.`,
            ``,
            `  <span class="c-dim">tools</span>  Python · scikit-learn · pandas · NumPy · TensorFlow`,
            `  <span class="c-dim">grade</span>  passing — certificate issued`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open harvardx</span>  certificate`,
        ]);
        blank();
    }

    function catRunning() {
        blank();
        lines([
            `  <span class="c-orange">Track &amp; Cross Country</span>  <span class="c-dim">· Athletics</span>`,
            `  <span class="c-dim">────────────────────────────────────────────</span>`,
            `  Running has shaped nearly every part of who I am —`,
            `  discipline, patience, consistency.`,
            ``,
            `  <span class="c-dim">events</span>  400m – 5K`,
            `  <span class="c-dim">honors</span>  all-county (XC &amp; track)`,
            ``,
            `  <span class="c-dim">→</span>  <span class="c-blue">open milesplit</span>  race results`,
        ]);
        blank();
    }

    function cmdCat(args) {
        const name = (args[0] || '').toLowerCase();
        if (!name) {
            line(`  <span class="c-red">cat: missing operand</span>`);
            line(`  <span class="c-dim">usage: cat &lt;project&gt;  — try 'ls' to see projects</span>`);
            return;
        }
        switch (name) {
            case 'routeeval': case 'llm': case 'research': catRouteEval(); break;
            case 'routecraft':                             catRoutecraft(); break;
            case 'splitdecision': case 'split':            catSplitDecision(); break;
            case 'fraud': case 'fraud-detection':          catFraud(); break;
            case 'harvardx': case 'harvard':               catHarvardX(); break;
            case 'running': case 'athletics': case 'track': catRunning(); break;
            default:
                line(`  <span class="c-red">cat: ${esc(name)}: no such project</span>`);
                line(`  <span class="c-dim">try 'ls' to see available projects</span>`);
        }
    }

    function cmdSkills() {
        blank();
        line(`  <span class="c-orange">languages</span>`);
        line(`  <span class="c-dim">  Python  Swift  JavaScript  HTML  CSS</span>`);
        blank();
        line(`  <span class="c-orange">ml / data</span>`);
        line(`  <span class="c-dim">  scikit-learn  pandas  NumPy  TensorFlow  SMOTE</span>`);
        blank();
        line(`  <span class="c-orange">tools</span>`);
        line(`  <span class="c-dim">  Git  GitHub  Xcode  VS Code</span>`);
        blank();
    }

    function cmdContact() {
        blank();
        lines([
            `  <span class="c-dim">email    </span><span class="c-blue">usroyvj@gmail.com</span>`,
            `  <span class="c-dim">github   </span><span class="c-blue">github.com/vjroy</span>`,
            `  <span class="c-dim">discord  </span><span class="c-blue">discord.com/users/688513027124887601</span>`,
        ]);
        blank();
        line(`  <span class="c-dim">or type </span><span class="c-blue">open email</span><span class="c-dim"> to open your mail client</span>`);
        blank();
    }

    function cmdResume() {
        window.open('Resume_Veejhay.pdf', '_blank');
        blank();
        line(`  <span class="c-green">✓</span>  opening resume...`);
        blank();
    }

    function cmdOpen(args) {
        const target = (args[0] || '').toLowerCase();
        const url = LINKS[target];
        if (!url) {
            blank();
            line(`  <span class="c-red">open: unknown target '${esc(target)}'</span>`);
            blank();
            line(`  <span class="c-dim">available:</span>`);
            line(`  <span class="c-blue">  ${Object.keys(LINKS).join('  ')}</span>`);
            blank();
            return;
        }
        target === 'email' ? (window.location.href = url) : window.open(url, '_blank');
        blank();
        line(`  <span class="c-green">✓</span>  opening <span class="c-blue">${esc(target)}</span>...`);
        blank();
    }

    function cmdTheme(args) {
        const name = (args[0] || '').toLowerCase();
        if (!name) {
            blank();
            line(`  <span class="c-orange">available themes</span>`);
            blank();
            const current = localStorage.getItem('vjroy_theme') || 'default';
            Object.keys(THEMES).forEach(t =>
                line(`  <span class="c-blue">${t}</span>${t === current ? '  <span class="c-dim">← active</span>' : ''}`)
            );
            blank();
            line(`  <span class="c-dim">usage: theme &lt;name&gt;</span>`);
            blank();
            return;
        }
        if (applyTheme(name)) {
            blank();
            line(`  <span class="c-green">✓</span>  theme set to <span class="c-blue">${esc(name)}</span>`);
            blank();
        } else {
            blank();
            line(`  <span class="c-red">theme: unknown '${esc(name)}'</span>`);
            line(`  <span class="c-dim">available: ${Object.keys(THEMES).join(' · ')}</span>`);
            blank();
        }
    }

    function cmdPing(args) {
        const host = esc(args[0] || 'github.com');
        blank();
        line(`  PING ${host}: 56 data bytes`);
        let seq = 0;
        const iv = setInterval(() => {
            const ms = (Math.random() * 12 + 4).toFixed(3);
            line(`  64 bytes from ${host}: icmp_seq=${seq} ttl=55 time=<span class="c-green">${ms} ms</span>`);
            if (++seq >= 4) {
                clearInterval(iv);
                setTimeout(() => {
                    blank();
                    line(`  --- ${host} ping statistics ---`);
                    line(`  <span class="c-dim">4 packets transmitted, 4 received, 0% packet loss</span>`);
                    blank();
                }, 200);
            }
        }, 600);
    }

    function cmdClear() { outputEl.innerHTML = ''; }

    function cmdDate() {
        blank();
        line(`  ${new Date().toDateString()}  ${new Date().toLocaleTimeString()}`);
        blank();
    }

    function cmdEcho(args) {
        blank();
        line(`  ${esc(args.join(' '))}`);
        blank();
    }

    // ── Command processor ─────────────────────────────────────
    const ALL_CMDS   = ['help', 'about', 'whoami', 'ls', 'cat', 'skills', 'contact', 'resume', 'open', 'theme', 'ping', 'clear', 'date', 'echo', 'pwd'];
    const CAT_ARGS   = ['routeeval', 'routecraft', 'splitdecision', 'fraud-detection', 'harvardx', 'running'];
    const OPEN_ARGS  = Object.keys(LINKS);
    const THEME_ARGS = Object.keys(THEMES);

    function processCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        cmdHistory.unshift(trimmed);
        histIdx = -1;
        echoCmd(trimmed);

        const parts = trimmed.split(/\s+/);
        const cmd   = parts[0].toLowerCase();
        const args  = parts.slice(1);

        switch (cmd) {
            case 'help': case '?':                      cmdHelp();        break;
            case 'about': case 'whoami':                cmdAbout();       break;
            case 'ls': case 'dir': case 'projects':     cmdLs();          break;
            case 'cat':                                 cmdCat(args);     break;
            case 'skills': case 'stack':                cmdSkills();      break;
            case 'contact':                             cmdContact();     break;
            case 'resume':                              cmdResume();      break;
            case 'open':                                cmdOpen(args);    break;
            case 'theme':                               cmdTheme(args);   break;
            case 'ping':                                cmdPing(args);    break;
            case 'clear': case 'cls':                   cmdClear();       break;
            case 'date':                                cmdDate();        break;
            case 'echo':                                cmdEcho(args);    break;
            case 'pwd':
                blank(); line(`  /home/veejhay`); blank(); break;
            case 'sudo':
                blank(); line(`  <span class="c-red">veejhay is not in the sudoers file. This incident will be reported.</span>`); blank(); break;
            case 'rm':
                blank(); line(`  <span class="c-red">nice try.</span>`); blank(); break;
            case 'exit': case 'logout': case 'quit':
                blank(); line(`  <span class="c-dim">there's no escaping the terminal.</span>`); blank(); break;
            default: {
                blank();
                line(`  <span class="c-red">${esc(cmd)}: command not found</span>`);
                const suggestion = ALL_CMDS.find(c => lev(cmd, c) <= 2);
                if (suggestion) {
                    line(`  <span class="c-dim">did you mean: <span class="c-blue">${esc(suggestion)}</span>?</span>`);
                } else {
                    line(`  <span class="c-dim">type 'help' to see available commands</span>`);
                }
                blank();
            }
        }
    }

    // ── Tab completion ─────────────────────────────────────────
    function tabComplete(val) {
        const parts = val.trimStart().split(/\s+/);
        if (parts.length === 1) {
            const m = ALL_CMDS.filter(c => c.startsWith(parts[0]));
            if (m.length === 1) return m[0] + ' ';
            if (m.length > 1) { echoCmd(val); blank(); line(`  ${m.join('  ')}`); blank(); }
            return val;
        }
        if (parts.length === 2) {
            const base = parts[0].toLowerCase(), partial = parts[1].toLowerCase();
            const pool = base === 'cat' ? CAT_ARGS : base === 'open' ? OPEN_ARGS : base === 'theme' ? THEME_ARGS : [];
            const m = pool.filter(x => x.startsWith(partial));
            if (m.length === 1) return parts[0] + ' ' + m[0];
            if (m.length > 1) { echoCmd(val); blank(); line(`  ${m.join('  ')}`); blank(); }
        }
        return val;
    }

    // ── Keyboard handling ──────────────────────────────────────
    let demoAborted = false;

    inputEl.addEventListener('keydown', (e) => {
        demoAborted = true;

        if (e.key === 'Enter') {
            const val = inputEl.value;
            inputEl.value = '';
            updateCursor();
            processCommand(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (histIdx < cmdHistory.length - 1) {
                histIdx++;
                inputEl.value = cmdHistory[histIdx];
                setTimeout(() => inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length), 0);
            }
            updateCursor();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx > 0) { histIdx--; inputEl.value = cmdHistory[histIdx]; }
            else if (histIdx === 0) { histIdx = -1; inputEl.value = ''; }
            updateCursor();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            inputEl.value = tabComplete(inputEl.value);
            inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
            updateCursor();
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            cmdClear();
        } else if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            if (inputEl.value) { echoCmd(inputEl.value + '^C'); inputEl.value = ''; updateCursor(); }
        }
    });

    // Click anywhere → focus input (skip mobile buttons which handle themselves)
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.mobile-cmd')) inputEl.focus();
    });

    // Mobile command buttons
    document.querySelectorAll('.mobile-cmd').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            demoAborted = true;
            inputEl.value = '';
            processCommand(btn.dataset.cmd);
            inputEl.focus();
        });
    });

    // ── Auto-demo ──────────────────────────────────────────────
    function autoDemo() {
        demoAborted = false;
        const cmd = 'whoami';
        let i = 0;
        function typeNext() {
            if (demoAborted) { inputEl.value = ''; updateCursor(); return; }
            if (i < cmd.length) {
                inputEl.value = cmd.slice(0, ++i);
                updateCursor();
                setTimeout(typeNext, 70 + Math.random() * 50);
            } else {
                setTimeout(() => {
                    if (demoAborted) { inputEl.value = ''; updateCursor(); return; }
                    const val = inputEl.value;
                    inputEl.value = '';
                    updateCursor();
                    processCommand(val);
                }, 380);
            }
        }
        typeNext();
    }

    // ── Boot ───────────────────────────────────────────────────
    function boot() {
        // Last login from localStorage
        const LOGIN_KEY = 'vjroy_last_login';
        const lastRaw   = localStorage.getItem(LOGIN_KEY);
        localStorage.setItem(LOGIN_KEY, new Date().toISOString());

        if (lastRaw) {
            const d = new Date(lastRaw);
            line(`<span class="c-dim">Last login: ${d.toDateString()} ${d.toLocaleTimeString()}</span>`);
            blank();
        }

        // VJ logo: V=9 chars · gap=2 · J=7 chars · gap=2 → 22-char left margin
        const BOOT_LINES = [
            `  <span class="c-blue">██╗   ██╗</span>  <span class="c-blue">    ██╗</span>  <span class="c-white">veejhay</span><span class="c-dim">@</span><span class="c-white">portfolio</span>`,
            `  <span class="c-blue">██║   ██║</span>  <span class="c-blue">    ██║</span>  <span class="c-dim">──────────────────────────────</span>`,
            `  <span class="c-blue">╚██╗ ██╔╝</span>  <span class="c-blue">    ██║</span>  <span class="c-dim">role    </span>  CS @ Georgia Tech '30`,
            `  <span class="c-blue"> ╚████╔╝ </span>  <span class="c-blue">██╗ ██║</span>  <span class="c-dim">loc     </span>  New Jersey, US`,
            `  <span class="c-blue">   ╚═╝   </span>  <span class="c-blue">╚═════╝</span>  <span class="c-dim">research</span>  RouteEval · ACL ARR 2025`,
            `                      <span class="c-dim">app     </span>  SplitDecision · 100+ athletes`,
            `                      <span class="c-dim">sport   </span>  XC &amp; Track · All-County`,
            ``,
            `  <span class="c-dim">type </span><span class="c-blue">help</span><span class="c-dim"> to get started</span>`,
            ``,
        ];

        BOOT_LINES.forEach((html, i) => {
            setTimeout(() => {
                line(html);
                if (i === BOOT_LINES.length - 1) {
                    inputEl.focus();
                    updateCursor();
                    setTimeout(autoDemo, 650);
                }
            }, i * 35);
        });
    }

    boot();
})();
