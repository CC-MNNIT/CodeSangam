const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// A small DOM fixture exercises the shipped script, not a reimplementation of
// its state machine. Fetch stays pending until each test releases its response.
function fixture() {
    const classes = (...initial) => {
        const values = new Set(initial);
        return {
            add: (...names) => names.forEach(name => values.add(name)),
            remove: (...names) => names.forEach(name => values.delete(name)),
            toggle(name, force) { const next = force ?? !values.has(name); next ? values.add(name) : values.delete(name); },
            replace(oldName, newName) { if (!values.delete(oldName)) return false; values.add(newName); return true; },
        };
    };
    const element = (extra = {}) => ({
        classList: classes(), textContent: '', value: '', disabled: false,
        attributes: new Map(),
        setAttribute(name, value) { this.attributes.set(name, value); },
        removeAttribute(name) { this.attributes.delete(name); },
        addEventListener() {}, focus() {}, scrollIntoView() {}, ...extra,
    });
    const video = 'https://drive.google.com/file/d/1DEMO_VideoId_1234567890/view';
    const options = [
        { value: 'webster', dataset: { teamId: '101', teamName: 'Shared name', githubUrl: 'https://github.com/acme/web', videoUrl: video, updatedAt: '2026-10-29T12:00:00Z' } },
        { value: 'droidrush', dataset: { teamId: '201', teamName: 'Shared name', githubUrl: 'https://github.com/acme/droid', videoUrl: video, updatedAt: '2026-10-29T12:00:00Z' } },
    ];
    const select = element({ value: 'webster', options });
    Object.defineProperty(select, 'selectedOptions', { get: () => options.filter(option => option.value === select.value) });
    const ids = {};
    for (const id of ['project-github', 'project-video', 'project-fields', 'project-submit-text', 'project-saved-note', 'project-feedback', 'project-sign-in', 'project-github-error', 'project-video-error', 'project-count', 'project']) {
        ids[id] = element();
    }
    ids['project-event'] = select;
    const form = element({ action: 'http://preview.test/api/v1/cs/project', reportValidity: () => true });
    form.elements = { namedItem: name => ids[name === 'github_url' ? 'project-github' : 'project-video'] };
    ids['project-form'] = form;
    let context;
    const rows = options.map(option => {
        const button = element({ click() { if (!this.disabled) context.pickProjectTeam(option.value); } });
        const children = {
            '[data-project-edit]': button,
            '[data-project-status]': element(),
            '[data-project-links]': element(),
            '[data-project-repo]': element({ href: option.dataset.githubUrl }),
            '[data-project-video]': element({ href: video }),
        };
        return { dataset: { projectRow: option.value }, querySelector: selector => children[selector] };
    });
    const buttons = rows.map(row => row.querySelector('[data-project-edit]'));
    let release, reject;
    const pending = new Promise((resolve, rejectPromise) => { release = resolve; reject = rejectPromise; });
    context = vm.createContext({
        console, Intl, Date, setTimeout, clearTimeout,
        window: { history: { replaceState() {} }, location: { pathname: '/api/auth/dashboard', search: '' } },
        document: {
            body: { dataset: {} }, getElementById: id => ids[id], querySelector: () => null,
            querySelectorAll: selector => selector === '[data-project-edit]' ? buttons : rows,
        },
        fetch: () => pending,
    });
    const source = path.resolve(__dirname, '../static/js/dashboard.js');
    vm.runInContext(fs.readFileSync(source, 'utf8'), context, { filename: source });
    context.onProjectTeamOption();
    ids['project-github'].value = 'github.com/acme/web-new';
    const success = () => release({ ok: true, status: 200, json: async () => ({ project: { team_id: 101, github_url: 'https://github.com/acme/web-new', video_url: video, updated_at: '2026-10-30T12:00:00Z' } }) });
    return { context, ids, select, rows, buttons, success, reject, submit: () => context.submitProjectForm({ preventDefault() {}, currentTarget: form }) };
}

test('a row action cannot switch registrations during a delayed save', async () => {
    const ui = fixture();
    const request = ui.submit();
    assert.equal(ui.ids['project-fields'].disabled, true);
    assert.equal(ui.buttons[1].disabled, true);
    assert.equal(ui.ids.project.attributes.get('aria-disabled'), 'true');
    ui.buttons[1].click();
    ui.context.pickProjectTeam('droidrush');
    ui.context.onProjectTeamOption();
    assert.equal(ui.select.value, 'webster');
    assert.equal(ui.ids['project-github'].value, 'github.com/acme/web-new');
    ui.success();
    await request;
    assert.equal(ui.ids['project-github'].value, 'https://github.com/acme/web-new');
    assert.equal(ui.buttons[1].disabled, false);
    assert.equal(ui.ids.project.attributes.has('aria-disabled'), false);
    ui.select.value = 'droidrush';
    ui.context.onProjectTeamOption();
    assert.equal(ui.ids['project-github'].value, 'https://github.com/acme/droid');
    assert.equal(ui.rows[1].querySelector('[data-project-repo]').href, 'https://github.com/acme/droid');
});

test('a response never hydrates another registration selected by an external script', async () => {
    const ui = fixture();
    const request = ui.submit();
    ui.select.value = 'droidrush';
    ui.ids['project-github'].value = 'github.com/acme/unsaved-droid';
    ui.success();
    await request;
    assert.equal(ui.ids['project-github'].value, 'github.com/acme/unsaved-droid');
    assert.equal(ui.rows[0].querySelector('[data-project-repo]').href, 'https://github.com/acme/web-new');
    assert.equal(ui.rows[1].querySelector('[data-project-repo]').href, 'https://github.com/acme/droid');
});

test('failed saves release every control and retain the pasted draft', async () => {
    const ui = fixture();
    const request = ui.submit();
    ui.reject(new Error('network unavailable'));
    await request;
    assert.equal(ui.ids['project-fields'].disabled, false);
    assert.ok(ui.buttons.every(button => !button.disabled));
    assert.equal(ui.ids.project.attributes.has('aria-disabled'), false);
    assert.equal(ui.ids['project-github'].value, 'github.com/acme/web-new');
    assert.match(ui.ids['project-feedback'].textContent, /Your links are still in the form/);
});
