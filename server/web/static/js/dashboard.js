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

setEventActive(eventActive)

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

    if (requestStarted) {
        return
    }

    requestStarted = true

    let teamName = document.getElementById(event + '_team_name').value

    if (teamName.length == 0) {
        alertReload("Please enter team name")
        return
    }

    let member1RegNo = document.getElementById(event + '_mem_1_reg').value
    let member2RegNo = document.getElementById(event + '_mem_2_reg').value
    let member3RegNo = document.getElementById(event + '_mem_3_reg').value

    let memberList = []
    if (member1RegNo.length > 0) {
        memberList.push(member1RegNo)
    }
    if (member2RegNo.length > 0) {
        memberList.push(member2RegNo)
    }
    if (member3RegNo.length > 0) {
        memberList.push(member3RegNo)
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
            res.json().then((data) => {
                alert(data['message'] + " - " + data['error'])
            })
        }
    }).catch((err) => {
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
