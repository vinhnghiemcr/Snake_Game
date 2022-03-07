// Global variable
const container = document.querySelector('#container')
const scoreEle = document.querySelector('.score')
const highestScoreElm = document.querySelector('.highestScore')
let boardCells

let rows = 10
let columns = 10
let snake = []
let direction = 'D' //Initial direction of snake is downward 
let isGrowing = false
let food = []
const milliseconds = 500
let itervalID 
let score = 0
let highestScore = 0


//------------
//Functions
const generateGameBoard = () => {
    return new  Array(rows).fill(null).map(() => new Array(columns).fill(null))
}

//Create the grid of div representing the game Board
const generateGrid = () => {
    container.style.display = 'grid'
    container.style.gridTemplateColumns = `repeat( ${columns}, 1fr )`
    container.style.gridTemplateRows = `repeat( ${rows}, 1fr )`    
    for (let i = 0; i < rows; i++) {     
        for (let j = 0; j< columns; j++) {
            const cell = document.createElement('div')
            cell.classList.add('cell' ,`R${i}`,  `C${j}`)
            container.append(cell)
        }
    }
    return container
}


// Display the snake to the html
const displaySnake = () => {
    // boardCells = document.querySelectorAll('#container div')
    boardCells.forEach(element => {
        element.classList.remove('snake')
    })
    snake.forEach(item => {
        const snakeCell = document.querySelector(`.R${item[0]}.C${item[1]}`)
        snakeCell.classList.add('snake')
    })
}

// Generate the snake
const generateSnake = () => {
    snake.push(new Array(0, columns / 2))
    displaySnake()
}

//Update the score
const updateScore = () => {
    score++
    scoreEle.innerHTML = `Now: ${score}`
    if (highestScore < score) {
        highestScore = score
        highestScoreElm.innerHTML = `Best: ${highestScore}`
    }
}

// Update the snake
const updateSnake = () => {
    
    switch (direction) {
        case 'D': 
            if (snake[0][0] + 1 > rows - 1) {
                snake.unshift(new Array(0, snake[0][1]))
            } else{
                snake.unshift(new Array(snake[0][0] + 1, snake[0][1]))
            }            
            break
        case 'U': 
            if (snake[0][0] - 1 < 0) {
                snake.unshift(new Array(rows - 1, snake[0][1]))
            } else {
                snake.unshift(new Array(snake[0][0] - 1, snake[0][1]))
            }        
            break
        case 'L': 
            if (snake[0][1] - 1 < 0) {
                snake.unshift(new Array(snake[0][0], columns - 1))
            } else {
                snake.unshift(new Array(snake[0][0], snake[0][1] - 1))
            }        
            break
        case 'R': 
            if (snake[0][1] + 1 > columns -1) {
                snake.unshift(new Array(snake[0][0], 0))
            } else {
                snake.unshift(new Array(snake[0][0], snake[0][1] + 1))
            }            
    }
    if (food[0] === snake[0][0] && food[1] === snake[0][1]) {
        document.querySelector(`.R${food[0]}.C${food[1]}`).classList.remove('food')
        generateFood()
        updateScore()
    }  else {
        snake.pop()
    }
    displaySnake() 
}

//Move the snake
const moveSnake = () => {
    intervalID = setInterval(updateSnake, milliseconds)
}

// Check if a cell is in the snake array
const isInSnake = (row, column) => {
    return snake.some(item => item[0] === row && item[1] === column)
}

// Generate the food for snake
const generateFood = () => {
    let randomRow 
    let randomColumn 
    do {
        randomRow = Math.floor(Math.random() * rows)
        randomColumn = Math.floor(Math.random() * columns)
    } while (isInSnake(randomRow, randomColumn))

    food[0] = randomRow
    food[1] = randomColumn
    const foodCell = document.querySelector(`.R${food[0]}.C${food[1]}`)
    foodCell.classList.add('food')
}

//------------
//Add event listeners

//Detect if player click on the game board to start the game
container.addEventListener('click', () => {
    generateSnake()
    generateFood()
    moveSnake()
    
})
//Detecting the Up, Down, Left, Right keyboards pressed
document.onkeydown = (event) => {
    switch (event.keyCode) {
        case 37: if (direction !== 'R') {
            direction = 'L'}
        break
        case 38: if (direction !== 'D'){
            direction = 'U'
        }
        break
        case 39: if (direction !== 'L'){
            direction = 'R'
        }
        break
        case 40: if (direction !== 'U'){
            direction = 'D'
        }
        break
    }
}


//------------
//Game body
const gameBoardArr = generateGameBoard()
const gameBoard = generateGrid()
boardCells = document.querySelectorAll('#container div')


    
