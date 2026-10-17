// Admin panel behaviour: tabs, search/filter, and the admin actions.
// Every action is a JSON POST to /api/admin/... with the X-CS-Admin header;
// after a change the page reloads so it always shows the database as it is.
(function () {
    const BASE = document.body.dataset.base || "";
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // ------------------------------------------------------------ toasts
    const toastBox = $("#toast");
    function toast(message, kind) {
        const el = document.createElement("div");
        el.className =
            "toast " +
            (kind === "error"
                ? "bg-void-800 text-scarlet-300 ring-scarlet-400/50"
                : "bg-void-800 text-agamotto-300 ring-agamotto-400/40");
        el.textContent = message;
        toastBox.replaceChildren(el);
        clearTimeout(toast.t);
        toast.t = setTimeout(() => el.remove(), kind === "error" ? 6000 : 2500);
    }

    // ------------------------------------------------------------ confirm
    const dialog = $("#confirm");
    function confirmAction(title, body, okLabel) {
        if (!dialog || typeof dialog.showModal !== "function") {
            return Promise.resolve(window.confirm(title + "\n\n" + body));
        }
        $("[data-confirm-title]", dialog).textContent = title;
        $("[data-confirm-body]", dialog).textContent = body;
        $("[data-confirm-ok]", dialog).textContent = okLabel || "Confirm";
        dialog.returnValue = "";
        dialog.showModal();
        return new Promise((resolve) => {
            dialog.addEventListener("close", () => resolve(dialog.returnValue === "ok"), { once: true });
        });
    }

    // ------------------------------------------------------------ API
    async function call(path, body, button) {
        if (button) button.disabled = true;
        try {
            const res = await fetch(BASE + "/api/admin/" + path, {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json", "X-CS-Admin": "1" },
                body: JSON.stringify(body),
            });
            let data = {};
            try {
                data = await res.json();
            } catch (_) {}
            if (!res.ok) {
                if (res.status === 401) {
                    window.location.href = BASE + "/api/auth";
                    return false;
                }
                toast(data.message || "Something went wrong (" + res.status + ")", "error");
                return false;
            }
            toast(data.message || "Done");
            sessionStorage.setItem("admin-scroll", String(window.scrollY));
            setTimeout(() => window.location.reload(), 650);
            return true;
        } catch (err) {
            toast("Network error — " + err.message, "error");
            return false;
        } finally {
            if (button) button.disabled = false;
        }
    }

    // ------------------------------------------------------------ tabs
    const tabs = $$("[data-tab]");
    function showTab(name) {
        tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
        $$("[data-panel]").forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== name));
        try {
            sessionStorage.setItem("admin-tab", name);
        } catch (_) {}
    }
    tabs.forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
    tabs.forEach((t, i) =>
        t.addEventListener("keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
            next.focus();
            showTab(next.dataset.tab);
        })
    );
    try {
        const saved = sessionStorage.getItem("admin-tab");
        if (saved && tabs.some((t) => t.dataset.tab === saved)) showTab(saved);
        const y = sessionStorage.getItem("admin-scroll");
        if (y) {
            sessionStorage.removeItem("admin-scroll");
            window.scrollTo(0, Number(y));
        }
    } catch (_) {}

    // ------------------------------------------------------------ filters
    let eventFilter = "all";
    const teamSearch = $("#team-search");
    function filterTeams() {
        const q = (teamSearch.value || "").trim().toLowerCase();
        let shown = 0;
        $$("[data-team]").forEach((card) => {
            const match =
                (eventFilter === "all" || card.dataset.event === eventFilter) &&
                (!q || card.dataset.search.toLowerCase().includes(q));
            card.classList.toggle("hidden", !match);
            if (match) shown++;
        });
        const empty = $("[data-empty=teams]");
        if (empty) empty.classList.toggle("hidden", shown > 0 || $$("[data-team]").length === 0);
    }
    if (teamSearch) teamSearch.addEventListener("input", filterTeams);
    $$("[data-filter]").forEach((chip) =>
        chip.addEventListener("click", () => {
            eventFilter = chip.dataset.filter;
            $$("[data-filter]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
            filterTeams();
        })
    );

    const peopleSearch = $("#people-search");
    if (peopleSearch)
        peopleSearch.addEventListener("input", () => {
            const q = peopleSearch.value.trim().toLowerCase();
            let shown = 0;
            $$("[data-user]").forEach((row) => {
                const match = !q || row.dataset.search.toLowerCase().includes(q);
                row.classList.toggle("hidden", !match);
                if (match) shown++;
            });
            const empty = $("[data-empty=people]");
            if (empty) empty.classList.toggle("hidden", shown > 0 || $$("[data-user]").length === 0);
        });

    // ------------------------------------------------------------ teams
    function teamOf(el) {
        const card = el.closest("[data-team]");
        return {
            card,
            event: card.dataset.event,
            team_id: Number(card.dataset.teamId),
            name: card.dataset.teamName,
        };
    }

    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;

        if (action === "rename" || action === "rename-cancel") {
            const { card } = teamOf(btn);
            const editing = action === "rename";
            $("[data-rename-form]", card).classList.toggle("hidden", !editing);
            $("[data-rename-form]", card).classList.toggle("flex", editing);
            $("[data-name-view]", card).classList.toggle("hidden", editing);
            if (editing) $("[data-rename-form] input", card).focus();
            return;
        }

        if (action === "revoke") {
            const t = teamOf(btn);
            const ok = await confirmAction(
                "Revoke " + t.name + "?",
                "This deletes the team's registration, its abstract record and mentor allotment. The members can register again afterwards.",
                "Revoke"
            );
            if (ok) call("team/revoke", { event: t.event, team_id: t.team_id }, btn);
            return;
        }

        if (action === "remove-member") {
            const t = teamOf(btn);
            const member = btn.closest("[data-member-id]");
            const ok = await confirmAction(
                "Remove " + member.dataset.memberName + "?",
                "They will be taken out of " + t.name + ". If they lead the team, the next member becomes leader.",
                "Remove"
            );
            if (ok)
                call("team/member/remove", { event: t.event, team_id: t.team_id, user_id: Number(member.dataset.memberId) }, btn);
            return;
        }

        if (action === "edit-user" || action === "edit-cancel") {
            const row = btn.closest("[data-user]");
            const editing = action === "edit-user";
            $("[data-user-form]", row).classList.toggle("hidden", !editing);
            $("[data-user-form]", row).classList.toggle("flex", editing);
            $("[data-user-view]", row).classList.toggle("hidden", editing);
            if (editing) $("[data-user-form] input", row).focus();
            return;
        }

        if (action === "delete-user") {
            const row = btn.closest("[data-user]");
            const ok = await confirmAction(
                "Delete " + row.dataset.userName + "?",
                "Their account record is removed. People in a team must be removed from it first. They can sign in again later.",
                "Delete"
            );
            if (ok) call("user/delete", { user_id: Number(row.dataset.userId) }, btn);
            return;
        }

        if (action === "remove-admin") {
            const row = btn.closest("[data-admin]");
            const ok = await confirmAction(
                "Remove admin access?",
                row.dataset.adminEmail + " will no longer be able to open this page.",
                "Remove"
            );
            if (ok) call("admins/remove", { email: row.dataset.adminEmail }, btn);
        }
    });

    document.addEventListener("submit", (e) => {
        const form = e.target;
        const val = (name) => form.elements.namedItem(name).value;
        const submit = form.querySelector("[type=submit]");

        if (form.matches("[data-rename-form]")) {
            e.preventDefault();
            const t = teamOf(form);
            call("team/rename", { event: t.event, team_id: t.team_id, name: val("name") }, submit);
        } else if (form.matches("[data-add-form]")) {
            e.preventDefault();
            const t = teamOf(form);
            call("team/member/add", { event: t.event, team_id: t.team_id, reg_no: val("reg_no") }, submit);
        } else if (form.matches("[data-user-form]")) {
            e.preventDefault();
            const row = form.closest("[data-user]");
            call("user/update", { user_id: Number(row.dataset.userId), name: val("name"), reg_no: val("reg_no") }, submit);
        } else if (form.matches("[data-admin-form]")) {
            e.preventDefault();
            call("admins/add", { email: val("email") }, submit);
        }
    });
})();
