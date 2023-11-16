let progress = document.getElementById('progress-screen')

function toggleProgress(show) {
    if (show) {
        progress.classList.remove('hidden')
    } else {
        progress.classList.add('hidden')
    }
}

let eventActive = 'teams'

function setEventActive(elementId) {
    // Current: "bg-gray-800 text-white", Default: "text-gray-400 hover:text-white hover:bg-gray-800"
    let activeElement = document.getElementById(eventActive)
    if (activeElement) {
        activeElement.classList.remove('bg-gray-800')
        activeElement.classList.remove('text-white')
        activeElement.classList.add('text-gray-400')
        activeElement.classList.add('hover:bg-gray-800')
        activeElement.classList.add('hover:text-white')
    }

    let element = document.getElementById(elementId)
    if (element) {
        element.classList.add('bg-gray-800')
        element.classList.add('text-white')
    }

    let activeElementDetails = document.getElementById(eventActive + '-details')
    if (activeElementDetails) {
        activeElementDetails.classList.add('hidden')
    }

    let elementDetails = document.getElementById(elementId + '-details')
    if (elementDetails) {
        elementDetails.classList.remove('hidden')
    }

    eventActive = elementId
}

function toggleMenu() {
    let menu = document.getElementById('mobile-menu')
    if (!menu) return

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden')
        menu.classList.add('block')
    } else {
        menu.classList.add('hidden')
        menu.classList.remove('block')
    }
}

let requestStarted = false

function submitRegistration(event, baseUrl) {
    toggleProgress(true)
    if (requestStarted) {
        return
    }
    requestStarted = true

    let teamName = document.getElementById(event + '_team_name').value

    if (teamName.length == 0) {
        requestStarted = false
        alertReload("Please enter team name")
        return
    }

    let member1RegNo = document.getElementById(event + '_mem_1_reg').value
    let member2RegNo = document.getElementById(event + '_mem_2_reg').value

    let memberList = []
    if (member1RegNo.length > 0) {
        memberList.push(member1RegNo)
    }
    if (member2RegNo.length > 0) {
        memberList.push(member2RegNo)
    }

    let json = {
        'event': event,
        'member_reg_list': memberList,
        'team_name': teamName,
    }

    let url = '/api/v1/cs/register'
    if (baseUrl) {
        url = baseUrl + url
    }

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
    }).then((res) => {
        if (res.status == 200) {
            alertReload("Registered successfully")
            return
        } else {
            toggleProgress(false)
            res.json().then((data) => {
                alert(data['message'] + " - " + data['error'])
            })
        }
    }).catch((err) => {
        toggleProgress(false)
        alert(err)
    }).finally(() => {
        requestStarted = false
    })
}

function alertReload(msg) {
    alert(msg)
    window.scrollTo(0, 0)
    window.location.reload(true)
}

function onFileChange() {
    let dropzone = document.getElementById('dropzone-label')
    let fileChip = document.getElementById('file-chip')
    let fileLabel = document.getElementById('file-name')

    let selectedFile = document.getElementById('dropzone-file').files[0]
    console.log(selectedFile)

    if (selectedFile.size > 1024 * 1024 * 3) {
        alert("File size should be less than 3MB")
    } else {
        dropzone.classList.add('hidden')

        fileChip.classList.remove('hidden')
        fileChip.classList.add('inline-flex')

        fileLabel.innerHTML = selectedFile.name
    }
}

function clearFile() {
    let dropzone = document.getElementById('dropzone-label')
    let fileChip = document.getElementById('file-chip')
    let fileLabel = document.getElementById('file-name')
    let fileInput = document.getElementById('dropzone-file')

    dropzone.classList.remove('hidden')
    fileChip.classList.remove('inline-flex')
    fileChip.classList.add('hidden')
    fileLabel.innerHTML = ""
    fileInput.value = ""
}

function submitAbstractForm(baseUrl) {
    if (requestStarted) {
        return
    }
    requestStarted = true

    let fileInput = document.getElementById('dropzone-file')
    let selectedFile = fileInput.files[0]

    if (!selectedFile) {
        alert("Please select a file")
        return
    }

    let eventOption = document.getElementById('abstract-event')
    let eventIndex = eventOption.selectedIndex
    if (eventIndex < 0) {
        requestStarted = false
        alert("Please select an event team")
        return
    }

    let event = eventOption.options[eventIndex].value

    if (event.length == 0) {
        requestStarted = false
        alert("Please select an event team")
        return
    }
    toggleProgress(true)

    let formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('event', event)

    let url = '/api/v1/cs/abstract'
    if (baseUrl) {
        url = baseUrl + url
    }

    fetch(url, {
        method: 'POST',
        body: formData
    }).then((res) => {
        if (res.status == 200) {
            alertReload("Abstract submitted successfully")
            return
        } else {
            toggleProgress(false)
            res.json().then((data) => {
                alert(data['message'] + " - " + data['error'])
            })
        }
    }).catch((err) => {
        toggleProgress(false)
        alert(err)
    }).finally(() => {
        requestStarted = false
        clearFile()
    })
}

function onEventTeamOption() {
    let eventOption = document.getElementById('abstract-event')
    let templateButtonText = document.getElementById('template-btn-text')
    let templateButton = document.getElementById('template-btn')

    let eventIndex = eventOption.selectedIndex
    if (eventIndex < 0) {
        return
    }

    let eventHtml = eventOption.options[eventIndex].innerHTML.split("-")[0]
    let event = eventOption.options[eventIndex].value
    templateButtonText.innerHTML = "Open " + eventHtml + "Template"

    if (event === "droidrush") {
        templateButton.href = "https://shorturl.at/dloF6"
    } else if (event === "webster") {
        templateButton.href = "https://shorturl.at/HRZ17"
    } else if (event === "softablitz") {
        templateButton.href = "https://shorturl.at/cxyR7"
    }
}

function allotTeamsForEvent(event, baseUrl) {
    toggleProgress(true)
    if (requestStarted) {
        return
    }
    requestStarted = true

    let url = '/api/v1/cs/allot?event=' + event
    if (baseUrl) {
        url = baseUrl + url
    }

    fetch(url, {
        method: 'POST',
    }).then((res) => {
        if (res.status == 200) {
            alertReload("Team allotment successful for " + event)
            return
        } else {
            toggleProgress(false)
            res.json().then((data) => {
                alert(data['message'] + " - " + data['error'])
            })
        }
    }).catch((err) => {
        toggleProgress(false)
        alert(err)
    }).finally(() => {
        requestStarted = false
        clearFile()
    })
}

function onCSVFileChange(event) {
    let fileInput = document.getElementById('csv_file_input-' + event)
    let selectedFile = fileInput.files[0]
    console.log(selectedFile)

    if (selectedFile.size > 1024 * 512) {
        fileInput.value = ""
        alert("File size should be less than 512KB")
    }
}

function uploadMidTerm(event, baseUrl) {
    if (requestStarted) {
        return
    }
    requestStarted = true

    let fileInput = document.getElementById('csv_file_input-' + event)
    let selectedFile = fileInput.files[0]

    if (!selectedFile) {
        requestStarted = false
        alert("Please select a file")
        return
    }

    if (event.length == 0) {
        requestStarted = false
        alert("Please select an event team")
        return
    }

    toggleProgress(true)

    let formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('event', event)

    let url = '/api/v1/cs/midterm'
    if (baseUrl) {
        url = baseUrl + url
    }

    fetch(url, {
        method: 'POST',
        body: formData
    }).then((res) => {
        if (res.status == 200) {
            alertReload("Mid evaluation submitted successfully")
            return
        } else {
            toggleProgress(false)
            res.json().then((data) => {
                alert(data['message'] + " - " + data['error'])
            })
        }
    }).catch((err) => {
        toggleProgress(false)
        alert(err)
    }).finally(() => {
        requestStarted = false
        fileInput.value = ""
    })
}
