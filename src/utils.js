//! 1. If you pass only one parameter to hideElement / ShowElement - It only toggles visibility and opacity
//! 2. If you pass 2nd parameter to hideElement / ShowElement - It will toggle the visibility, opacity and display of the element
//! 3. If you do not pass the 3rd parameter to showElement - Adds the display block in given time
//! 4. If you pass 3rd parameter to showElement - It add the given display property to the element in the given time (block, flex, grid etc.)


export function hideElement(element, time) {
    element.style.visibility = 'hidden'
    element.style.opacity = '0'

    if (time || time == 0) {
        setTimeout(() => {
            element.style.display = 'none'
        }, time)
    }
}

export function showElement(element, time, displayType) {
    if (time || time == 0) { element.style.display = displayType ? displayType : 'block' }

    setTimeout(() => {
        element.style.visibility = 'visible'
        element.style.opacity = '1'
    }, time || 0)
}