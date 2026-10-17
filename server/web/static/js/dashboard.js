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

function onEventTeamOption() {
    let eventOption = document.getElementById("abstract-event");
    let templateButtonText = document.getElementById("template-btn-text");
    let templateButton = document.getElementById("template-btn");

    let eventIndex = eventOption.selectedIndex;
    if (eventIndex < 0) {
        return;
    }

    let eventHtml = eventOption.options[eventIndex].innerHTML.split("-")[0];
    let event = eventOption.options[eventIndex].value;
    templateButtonText.innerHTML = "Open " + eventHtml + "Template";

    if (event === "droidrush") {
        templateButton.href = "https://docs.google.com/document/d/1UDBqp1AKES0qTzU3CLRo_3qDwsTGrOOS/edit?usp=sharing&ouid=113461078357577403298&rtpof=true&sd=true";
    } else if (event === "webster") {
        templateButton.href = "https://docs.google.com/document/d/1p8ntP8WbgF3mVmOa2UMqkoRkb48D9IoW/edit?usp=sharing&ouid=113461078357577403298&rtpof=true&sd=true";
    } else if (event === "softablitz") {
        templateButton.href = "https://docs.google.com/document/d/1JXEfaRnMH5v2pe7Yl7JXiGRWmEX8TX7R/edit?usp=sharing&ouid=113461078357577403298&rtpof=true&sd=true";
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
