let progress = document.getElementById("progress-screen");

function toggleProgress(show) {
    if (show) {
        progress.classList.remove("hidden");
    } else {
        progress.classList.add("hidden");
    }
}


// ------------------------------------------------------------ messages
// Results appear as a toast; destructive steps ask in a themed dialog; every
// failure is explained in plain language, never as a raw server error.

const NETWORK_MSG = "We couldn't reach the server. Check your internet connection and try again.";

function notify(kind, message) {
    let box = document.getElementById("dash-toast");
    if (!box) {
        window.alert(message);
        return;
    }
    let el = document.createElement("div");
    el.className =
        "toast max-w-xl text-center " +
        (kind === "error"
            ? "bg-void-800 text-scarlet-300 ring-scarlet-400/50"
            : "bg-void-800 text-agamotto-300 ring-agamotto-400/40");
    el.textContent = message;
    box.replaceChildren(el);
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => el.remove(), kind === "error" ? 7000 : 3000);
}

function friendlyMessage(status, data) {
    if (status === 401) {
        return "Your session has expired. Please sign in again.";
    }
    if (status === 413) {
        return "That file is too large to upload.";
    }
    let msg = data && typeof data.message === "string" ? data.message.trim() : "";
    // Server messages are written for people; anything that still reads like
    // an internal error gets a plain fallback instead.
    if (msg && !/^(Unable to|Invalid|User not)|dto|parse/i.test(msg)) {
        return msg;
    }
    return "Something went wrong on our side. Please try again in a minute.";
}

function showFailure(res) {
    toggleProgress(false);
    res.json()
        .then((data) => notify("error", friendlyMessage(res.status, data)))
        .catch(() => notify("error", friendlyMessage(res.status, null)));
    if (res.status === 401) {
        setTimeout(() => (window.location.href = (document.body.dataset.base || "") + "/api/auth"), 2500);
    }
}

function confirmDialog(title, body, okLabel) {
    let dialog = document.getElementById("dash-confirm");
    if (!dialog || typeof dialog.showModal !== "function") {
        return Promise.resolve(window.confirm(title + "\n\n" + body));
    }
    dialog.querySelector("[data-title]").textContent = title;
    dialog.querySelector("[data-body]").textContent = body;
    dialog.querySelector("[data-ok]").textContent = okLabel || "Confirm";
    dialog.returnValue = "";
    dialog.showModal();
    return new Promise((resolve) => {
        dialog.addEventListener("close", () => resolve(dialog.returnValue === "ok"), { once: true });
    });
}

let eventActive = "teams";

function setEventActive(elementId) {
    // Active sidebar link:  "bg-white/5 text-bone-50 is-active"
    // Default sidebar link: "text-bone-300 hover:bg-white/5 hover:text-bone-50"
    // (`is-active` also reveals the gold rune dot via `group-[.is-active]:` in the markup.)
    let activeElement = document.getElementById(eventActive);
    if (activeElement) {
        activeElement.classList.remove("bg-white/5");
        activeElement.classList.remove("text-bone-50");
        activeElement.classList.remove("is-active");
        activeElement.classList.add("text-bone-300");
        activeElement.classList.add("hover:bg-white/5");
        activeElement.classList.add("hover:text-bone-50");
    }

    let element = document.getElementById(elementId);
    if (element) {
        element.classList.remove("text-bone-300");
        element.classList.remove("hover:bg-white/5");
        element.classList.remove("hover:text-bone-50");
        element.classList.add("bg-white/5");
        element.classList.add("text-bone-50");
        element.classList.add("is-active");
    }

    let activeElementDetails = document.getElementById(eventActive + "-details");
    if (activeElementDetails) {
        activeElementDetails.classList.add("hidden");
    }

    let elementDetails = document.getElementById(elementId + "-details");
    if (elementDetails) {
        elementDetails.classList.remove("hidden");
    }

    eventActive = elementId;
}

function toggleMenu() {
    let menu = document.getElementById("mobile-menu");
    if (!menu) return;

    if (menu.classList.contains("hidden")) {
        menu.classList.remove("hidden");
        menu.classList.add("block");
    } else {
        menu.classList.add("hidden");
        menu.classList.remove("block");
    }
}

let requestStarted = false;

function submitRegistration(event, baseUrl) {
    if (requestStarted) {
        return;
    }
    requestStarted = true;

    let teamName = document.getElementById(event + "_team_name").value.trim();

    if (teamName.length == 0) {
        requestStarted = false;
        notify("error", "Please enter a team name.");
        return;
    }
    toggleProgress(true);

    let member1RegNo = document.getElementById(event + "_mem_1_reg").value;
    let member2RegNo = document.getElementById(event + "_mem_2_reg").value;

    let memberList = [];
    if (member1RegNo.length > 0) {
        memberList.push(member1RegNo);
    }
    if (member2RegNo.length > 0) {
        memberList.push(member2RegNo);
    }

    let json = {
        event: event,
        member_reg_list: memberList,
        team_name: teamName,
    };

    let url = "/api/v1/cs/register";
    if (baseUrl) {
        url = baseUrl + url;
    }

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
    })
        .then((res) => {
            if (res.status == 200) {
                alertReload("Registered successfully");
                return;
            } else {
                showFailure(res);
            }
        })
        .catch((err) => {
            toggleProgress(false);
            notify("error", NETWORK_MSG);
        })
        .finally(() => {
            requestStarted = false;
        });
}

function alertReload(msg) {
    toggleProgress(false);
    notify("success", msg);
    setTimeout(() => window.location.reload(), 1400);
}

function onFileChange() {
    let dropzone = document.getElementById("dropzone-label");
    let fileChip = document.getElementById("file-chip");
    let fileLabel = document.getElementById("file-name");

    let selectedFile = document.getElementById("dropzone-file").files[0];
    console.log(selectedFile);

    if (selectedFile.size > 1024 * 1024 * 3) {
        notify("error", "This PDF is larger than 3 MB. Please reduce its size and choose it again.");
    } else {
        dropzone.classList.add("hidden");

        fileChip.classList.remove("hidden");
        fileChip.classList.add("inline-flex");

        fileLabel.innerHTML = selectedFile.name;
    }
}

function clearFile() {
    let dropzone = document.getElementById("dropzone-label");
    let fileChip = document.getElementById("file-chip");
    let fileLabel = document.getElementById("file-name");
    let fileInput = document.getElementById("dropzone-file");

    dropzone.classList.remove("hidden");
    fileChip.classList.remove("inline-flex");
    fileChip.classList.add("hidden");
    fileLabel.innerHTML = "";
    fileInput.value = "";
}

function submitAbstractForm(baseUrl) {
    if (requestStarted) {
        return;
    }
    requestStarted = true;

    let fileInput = document.getElementById("dropzone-file");
    let selectedFile = fileInput.files[0];

    if (!selectedFile) {
        requestStarted = false;
        notify("error", "Please choose your abstract PDF first.");
        return;
    }

    let eventOption = document.getElementById("abstract-event");
    let eventIndex = eventOption.selectedIndex;
    if (eventIndex < 0) {
        requestStarted = false;
        notify("error", "Please choose which event this is for.");
        return;
    }

    let event = eventOption.options[eventIndex].value;

    if (event.length == 0) {
        requestStarted = false;
        notify("error", "Please choose which event this is for.");
        return;
    }

    let replacing = eventOption.options[eventIndex].dataset.submitted === "true";
    if (replacing) {
        confirmDialog(
            "Replace your abstract?",
            "Your team's current abstract will be deleted and replaced with " + selectedFile.name + ".",
            "Replace"
        ).then((ok) => {
            if (ok) {
                sendAbstract(baseUrl, event, selectedFile, true);
            } else {
                requestStarted = false;
            }
        });
        return;
    }
    sendAbstract(baseUrl, event, selectedFile, false);
}

function sendAbstract(baseUrl, event, selectedFile, replacing) {
    toggleProgress(true);

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("event", event);

    let url = "/api/v1/cs/abstract";
    if (baseUrl) {
        url = baseUrl + url;
    }

    fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            if (res.status == 200) {
                alertReload(replacing ? "Abstract replaced successfully" : "Abstract submitted successfully");
                return;
            } else {
                showFailure(res);
            }
        })
        .catch((err) => {
            toggleProgress(false);
            notify("error", NETWORK_MSG);
        })
        .finally(() => {
            requestStarted = false;
            clearFile();
        });
}

// "Upload" / "Replace PDF" in the status list: pick that event and open the
// file chooser straight away.
function pickAbstractEvent(tag) {
    let select = document.getElementById("abstract-event");
    if (!select) return;
    select.value = tag;
    onEventTeamOption();
    let form = document.getElementById("abstract-form");
    if (form) form.scrollIntoView({ behavior: "smooth", block: "center" });
    let input = document.getElementById("dropzone-file");
    if (input) input.click();
}

// The abstract templates are rendered by the server as plain links above the
// form, so no dropdown is needed to reach them.
function onEventTeamOption() {
    let eventOption = document.getElementById("abstract-event");
    if (!eventOption) {
        return;
    }

    let eventIndex = eventOption.selectedIndex;
    if (eventIndex < 0) {
        return;
    }

    // Already submitted: say so and turn Submit into Replace.
    let submitted = eventOption.options[eventIndex].dataset.submitted === "true";
    let note = document.getElementById("abstract-replace-note");
    let submitText = document.getElementById("abstract-submit-text");
    if (note) {
        note.classList.toggle("hidden", !submitted);
        note.classList.toggle("flex", submitted);
    }
    if (submitText) {
        submitText.textContent = submitted ? "Replace abstract" : "Submit";
    }
}

// ------------------------------------------------------------ final project links
// Drafts live per event while the page is open, so changing the team selection
// does not discard links someone has just pasted.
const projectDrafts = new Map();
let activeProjectTag = "";

function clearProjectFieldError(name) {
    const form = document.getElementById("project-form");
    if (!form) return;
    const field = form.elements.namedItem(name);
    if (field) field.removeAttribute("aria-invalid");
    const errorId = name === "github_url" ? "project-github-error" : "project-video-error";
    const error = document.getElementById(errorId);
    if (error) {
        error.textContent = "";
        error.classList.add("hidden");
    }
}

function projectFeedback(message, isError) {
    const feedback = document.getElementById("project-feedback");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove("hidden", "text-scarlet-300", "text-agamotto-300");
    feedback.classList.add(isError ? "text-scarlet-300" : "text-agamotto-300");
}

function projectTime(timestamp) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric", month: "short", year: "numeric",
        hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata",
    }).format(new Date(timestamp)) + " IST";
}

function updateProjectSaveNote() {
    const select = document.getElementById("project-event");
    if (!select || !select.selectedOptions.length) return;
    const option = select.selectedOptions[0];
    const github = document.getElementById("project-github").value.trim();
    const video = document.getElementById("project-video").value.trim();
    const changed = github !== option.dataset.githubUrl || video !== option.dataset.videoUrl;
    const note = document.getElementById("project-saved-note");
    note.textContent = changed
        ? "You have unsaved changes. Save both links together."
        : option.dataset.updatedAt
            ? "Saved " + projectTime(option.dataset.updatedAt) + ". You can edit these links."
            : "Both links are saved together. You can edit them later.";
    note.classList.toggle("text-sling-200", changed);
    note.classList.toggle("text-bone-300", !changed);
}

function onProjectTeamOption() {
    const select = document.getElementById("project-event");
    if (!select || !select.selectedOptions.length) return;
    const github = document.getElementById("project-github");
    const video = document.getElementById("project-video");
    if (activeProjectTag) {
        projectDrafts.set(activeProjectTag, { github: github.value, video: video.value });
    }
    const option = select.selectedOptions[0];
    activeProjectTag = option.value;
    const draft = projectDrafts.get(activeProjectTag);
    github.value = draft ? draft.github : option.dataset.githubUrl || "";
    video.value = draft ? draft.video : option.dataset.videoUrl || "";
    document.getElementById("project-submit-text").textContent = option.dataset.updatedAt ? "Save changes" : "Save links";
    document.getElementById("project-feedback").classList.add("hidden");
    document.getElementById("project-sign-in").classList.add("hidden");
    clearProjectFieldError("github_url");
    clearProjectFieldError("video_url");
    updateProjectSaveNote();
}

function pickProjectTeam(tag) {
    const select = document.getElementById("project-event");
    if (tag && select) {
        select.value = tag;
        onProjectTeamOption();
    }
    setEventActive("project");
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#project");
    if (tag) {
        const form = document.getElementById("project-form");
        if (form) form.scrollIntoView({ block: "start", behavior: "auto" });
        const github = document.getElementById("project-github");
        if (github) github.focus({ preventScroll: true });
    }
}

async function submitProjectForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (requestStarted || !form.reportValidity()) return;
    const select = document.getElementById("project-event");
    const option = select.selectedOptions[0];
    if (!option) return;
    const github = document.getElementById("project-github");
    const video = document.getElementById("project-video");
    const fields = document.getElementById("project-fields");
    const label = document.getElementById("project-submit-text");
    clearProjectFieldError("github_url");
    clearProjectFieldError("video_url");
    document.getElementById("project-sign-in").classList.add("hidden");
    requestStarted = true;
    fields.disabled = true;
    form.setAttribute("aria-busy", "true");
    label.textContent = "Saving…";
    try {
        const res = await fetch(form.action, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", "X-CS-Project": "1" },
            body: JSON.stringify({ event: option.value, github_url: github.value.trim(), video_url: video.value.trim() }),
        });
        let data = {};
        try { data = await res.json(); } catch (_) {}
        if (!res.ok) {
            const message = res.status === 401
                ? "Your session has expired. Sign in again in a new tab, then retry. Your links are still here."
                : res.status === 413
                    ? "These links are too long. Paste only the repository and Drive file addresses."
                    : friendlyMessage(res.status, data);
            projectFeedback(message, true);
            if (res.status === 401) document.getElementById("project-sign-in").classList.remove("hidden");
            if (data.field === "github_url" || data.field === "video_url") {
                const field = data.field === "github_url" ? github : video;
                const error = document.getElementById(data.field === "github_url" ? "project-github-error" : "project-video-error");
                field.setAttribute("aria-invalid", "true");
                error.textContent = message;
                error.classList.remove("hidden");
                projectFeedback("No changes were saved. Check the highlighted link.", true);
                // Restore the controls before focusing the field that needs work.
                fields.disabled = false;
                field.focus();
            }
            return;
        }
        const saved = data.project;
        if (!saved || saved.team_id !== Number(option.dataset.teamId) || !saved.github_url || !saved.video_url || !saved.updated_at) {
            throw new Error("The server did not confirm this team's saved links.");
        }
        option.dataset.githubUrl = saved.github_url;
        option.dataset.videoUrl = saved.video_url;
        option.dataset.updatedAt = saved.updated_at;
        github.value = saved.github_url;
        video.value = saved.video_url;
        projectDrafts.set(option.value, { github: saved.github_url, video: saved.video_url });
        const row = Array.from(document.querySelectorAll("[data-project-row]")).find((el) => el.dataset.projectRow === option.value);
        if (row) {
            const status = row.querySelector("[data-project-status]");
            status.textContent = "Submitted · " + projectTime(saved.updated_at);
            status.classList.replace("text-sling-200", "text-agamotto-300");
            row.querySelector("[data-project-repo]").href = saved.github_url;
            row.querySelector("[data-project-video]").href = saved.video_url;
            row.querySelector("[data-project-links]").classList.remove("hidden");
            row.querySelector("[data-project-edit]").textContent = "Edit links";
        }
        const submitted = Array.from(select.options).filter((o) => o.dataset.githubUrl && o.dataset.videoUrl).length;
        document.getElementById("project-count").textContent = submitted + " of " + select.options.length + " submitted";
        projectFeedback("Both links are saved for " + option.dataset.teamName + ". Check that evaluators can open the repository and video.", false);
    } catch (_) {
        projectFeedback(NETWORK_MSG + " Your links are still in the form.", true);
    } finally {
        requestStarted = false;
        fields.disabled = false;
        form.setAttribute("aria-busy", "false");
        label.textContent = option.dataset.updatedAt ? "Save changes" : "Save links";
        updateProjectSaveNote();
    }
}

(function () {
    const form = document.getElementById("project-form");
    if (!form) return;
    form.addEventListener("submit", submitProjectForm);
    form.addEventListener("input", (event) => {
        if (event.target.name === "github_url" || event.target.name === "video_url") {
            clearProjectFieldError(event.target.name);
            document.getElementById("project-feedback").classList.add("hidden");
            updateProjectSaveNote();
        }
    });
})();

function allotTeamsForEvent(event, baseUrl) {
    toggleProgress(true);
    if (requestStarted) {
        return;
    }
    requestStarted = true;

    let url = "/api/v1/cs/allot?event=" + event;
    if (baseUrl) {
        url = baseUrl + url;
    }

    fetch(url, {
        method: "POST",
    })
        .then((res) => {
            if (res.status == 200) {
                alertReload("Team allotment successful for " + event);
                return;
            } else {
                showFailure(res);
            }
        })
        .catch((err) => {
            toggleProgress(false);
            notify("error", NETWORK_MSG);
        })
        .finally(() => {
            requestStarted = false;
            clearFile();
        });
}

function onCSVFileChange(event) {
    let fileInput = document.getElementById("csv_file_input-" + event);
    let selectedFile = fileInput.files[0];
    console.log(selectedFile);

    if (selectedFile.size > 1024 * 512) {
        fileInput.value = "";
        notify("error", "This CSV is larger than 512 KB. Please check you picked the right file.");
    }
}

function uploadMidTerm(event, baseUrl) {
    if (requestStarted) {
        return;
    }
    requestStarted = true;

    let fileInput = document.getElementById("csv_file_input-" + event);
    let selectedFile = fileInput.files[0];

    if (!selectedFile) {
        requestStarted = false;
        notify("error", "Please choose the CSV file first.");
        return;
    }

    if (event.length == 0) {
        requestStarted = false;
        notify("error", "Please choose which event this is for.");
        return;
    }

    toggleProgress(true);

    let formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("event", event);

    let url = "/api/v1/cs/midterm";
    if (baseUrl) {
        url = baseUrl + url;
    }

    fetch(url, {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            if (res.status == 200) {
                alertReload("Mid evaluation submitted successfully");
                return;
            } else {
                showFailure(res);
            }
        })
        .catch((err) => {
            toggleProgress(false);
            notify("error", NETWORK_MSG);
        })
        .finally(() => {
            requestStarted = false;
            fileInput.value = "";
        });
}

// ------------------------------------------------------------ registration deadline
// The deadline is rendered onto <body> by the server. This only keeps the page
// honest while it ticks down: late writes are refused by the server whether or
// not this runs, so nothing here is load-bearing.
(function () {
    const deadline = parseInt(document.body.dataset.deadline || "0", 10);
    const countdown = document.querySelector("[data-deadline-countdown]");
    const state = document.querySelector("[data-deadline-state]");
    if (!deadline || !countdown || !state) {
        return;
    }

    const pad = (n) => String(n).padStart(2, "0");

    function closeSubmissionForms() {
        document.querySelectorAll("[data-closed-hide]").forEach((form) => form.classList.add("hidden"));
    }

    function render() {
        const left = deadline - Math.floor(Date.now() / 1000);
        if (left <= 0) {
            state.textContent = "are";
            countdown.textContent = "closed";
            closeSubmissionForms();
            return false;
        }
        const days = Math.floor(left / 86400);
        const hours = Math.floor((left % 86400) / 3600);
        const mins = Math.floor((left % 3600) / 60);
        const secs = left % 60;
        countdown.textContent =
            (days > 0 ? days + "d " : "") + pad(hours) + "h " + pad(mins) + "m " + pad(secs) + "s";
        return true;
    }

    if (render()) {
        const timer = setInterval(() => {
            if (!render()) {
                clearInterval(timer);
            }
        }, 1000);
    }

    // Background tabs get their timers throttled to roughly once a minute, so a
    // page left open across the cutoff could sit on a stale countdown. Re-render
    // as soon as it is looked at again.
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            render();
        }
    });
})();
