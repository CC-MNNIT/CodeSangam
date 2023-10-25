let eventActive = 'event1'

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
