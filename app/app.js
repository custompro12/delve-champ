'use strict'

const gridSize = 7 // Use odd number of grid cells to ensure a center cell
const grid = document.getElementById('grid')

// Create the cells and add them to the grid
const cells = []
for (let i = 0; i < gridSize * gridSize; i++) {
    const div = document.createElement('div')
    div.classList.add('cell')
    grid.appendChild(div)
    cells.push(div)
}

// Start the grid in the "middle" of the screen
let initialX = 0
let initialY = 0
// NOTE: Use setTimeout to wait for the window and grid sizes to be calculated
setTimeout(() => {
    initialX = (window.innerWidth - grid.clientWidth) / 2
    initialY = (window.innerHeight - grid.clientHeight) / 4 // Using 4 instead of 2 to bring it above the fossil guide images
    grid.style.top = initialY + 'px'
    grid.style.left = initialX + 'px'
})

// Set the CSS variable for the grid dimensions
document.documentElement.style.setProperty('--cell-count', Math.sqrt(cells.length))

const middleIndex = Math.round(cells.length / 2) - 1
cells[middleIndex].textContent = 'O'

cells.forEach((cell, index) => {
    if (index === middleIndex) {
        cell.classList.add('objective')
        return
    }

    // Change the cell to an 'X' if the user clicks it
    cell.addEventListener('click', evt => {
        const cell = evt.target

        if (cell.textContent === 'X') {
            cell.textContent = null
        } else {
            cell.textContent = 'X'
        }
    })
})

// Add the ability to move the grid around
const moveHandle = document.getElementById('move-handle')
moveHandle.onmousedown = evt => {
    evt.preventDefault()

    document.onmouseup = clearMouseHandlers
    document.onmousemove = elementDrag
}

function elementDrag(evt) {
    evt.preventDefault()

    initialX += evt.movementX
    initialY += evt.movementY

    grid.style.top = initialY + 'px'
    grid.style.left = initialX + 'px'
}

// Add the ability to resize the grid
const resizeHandle = document.getElementById('resize-handle')

let initialSize = 100
// Use LocalStorage to remember the user's cell size
if (localStorage.getItem('delve-champ-cell-size')) {
    initialSize = parseFloat(localStorage.getItem('delve-champ-cell-size'))
}

document.documentElement.style.setProperty('--cell-size', initialSize + 'px')

resizeHandle.onmousedown = evt => {
    evt.preventDefault()

    document.onmouseup = clearMouseHandlers
    document.onmousemove = elementResize
}

function elementResize(evt) {
    evt.preventDefault()

    let distance = Math.sqrt(Math.pow(evt.movementX / 2, 2) + Math.pow(evt.movementY / 2, 2)) / gridSize

    initialSize += evt.movementY + evt.movementX > 0 ? distance : -distance

    document.documentElement.style.setProperty('--cell-size', initialSize + 'px')
}

/** Clear any open mouse event handlers and save app settings */
function clearMouseHandlers() {
    document.onmouseup = null
    document.onmousemove = null

    localStorage.setItem('delve-champ-cell-size', initialSize)
}

/** Remove all markers from the grid */
function clearMarkers() {
    cells.forEach((cell, index) => {
        if (index === middleIndex) {
            return
        }

        cell.textContent = null
    })
}
