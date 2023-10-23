
let active = 'nav-dashboard'

function setElementActive(elementId) {
    let activeElement = document.getElementById(active)
    if (activeElement) {
        activeElement.classList.remove('bg-gray-900')
        activeElement.classList.remove('text-white')
        activeElement.classList.add('text-gray-300')
        activeElement.classList.add('hover:bg-gray-700')
        activeElement.classList.add('hover:text-white')
    }

    let activeElementMobile = document.getElementById(active + '-mb')
    if (activeElementMobile) {
        activeElementMobile.classList.remove('bg-gray-900')
        activeElementMobile.classList.remove('text-white')
        activeElementMobile.classList.add('text-gray-300')
        activeElementMobile.classList.add('hover:bg-gray-700')
        activeElementMobile.classList.add('hover:text-white')
    }

    let element = document.getElementById(elementId)
    if (element) {
        element.classList.add('bg-gray-900')
        element.classList.add('text-white')
    }

    let elementMobile = document.getElementById(elementId + '-mb')
    if (elementMobile) {
        elementMobile.classList.add('bg-gray-900')
        elementMobile.classList.add('text-white')
    }
    active = elementId

    hideMenu()
}

function toggleMenu() {
    let menu = document.getElementById('mobile-menu')
    if (!menu) return

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden')
        menu.classList.add('block')
    } else {
        hideMenu()
    }
}

function hideMenu() {
    let menu = document.getElementById('mobile-menu')
    if (!menu) return

    menu.classList.add('hidden')
    menu.classList.remove('block')
}
