// Global variable
const container = document.querySelector('#container')
let rows = 10
let columns = 10
let snake = []
let direction = 'R' //Initial direction of snake is downward 
const milliseconds = 2000
let itervalID 



//------------
//Functions
const generateGameBoard = () => {
    return new  Array(rows).fill(null).map(() => new Array(columns).fill(null))
}
const gameBoardArr = generateGameBoard()
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
    // for (let i = 0; i<snake.length; i++){     
    //     const snakeCell = document.querySelector(`.R${snake[i][0]}.C${snake[i][1]}`)        
    //     snakeCell.classList.add('snake')
    // }
    const boardCells = document.querySelectorAll('#container div')
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

// Update the snake
const updateSnake = () => {
    switch (direction) {
        case 'D': snake.unshift(new Array(snake[0][0] + 1, snake[0][1]))
            break
        case 'U': snake.unshift(new Array(snake[0][0] - 1, snake[0][1]))
            break
        case 'L': snake.unshift(new Array(snake[0][0], snake[0][1] - 1))
            break
        case 'R': snake.unshift(new Array(snake[0][0], snake[0][1] + 1))
    }    
    snake.pop()
    displaySnake() 
}

//Move the snake
const moveSnake = () => {
    intervalID = setInterval(updateSnake, milliseconds)
}

//------------
//Add event listeners



//------------
//Game body
const gameBoard = generateGrid()
generateSnake()


moveSnake()

    
