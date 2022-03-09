// Global variable
const container = document.querySelector('#container')
const scoreEle = document.querySelector('.score')
const highestScoreElm = document.querySelector('.highestScore')
const audioBtn = document.querySelector('.audio-btn')
const audioElm = document.querySelector('audio')
const playAgainBtn = document.querySelector('.play-again')
const level1Btn = document.querySelector('#level1')
const level2Btn = document.querySelector('#level2')
const level3Btn = document.querySelector('#level3')
let boardCells


const audioWinning = new Audio('audios/mixkit-arcade-retro-run-sound-220.wav')

// const WIDTH = 1000
let rows = 10
let columns = 10
let milliseconds = 500 //0.5s
let snake = []
let direction = 'D' //Initial direction of snake is downward 
let isGrowing = false
let food = []

let gameIntervalID 
let score = 0
let highestScore = 0
let isPlaying = false




//------------
//Functions

//Create the grid of div representing the game Board
const generateGrid = () => {
    container.style.gridTemplateColumns = `repeat( ${columns}, 1fr )`
    container.style.gridTemplateRows = `repeat( ${rows}, 1fr )`    
    for (let i = 0; i < rows; i++) {     
        for (let j = 0; j< columns; j++) {
            const cell = document.createElement('div')
            if ((i % 2 === 0 && j % 2 === 0) || (i % 2 !== 0 && j % 2 !== 0)) {
                cell.classList.add('cellLightColor')
            } else {
                cell.classList.add('cellDarkColor')
            }
            cell.style.margin = '0'
            cell.style.padding = '0'
            cell.classList.add(`R${i}`,  `C${j}`)
            container.append(cell)
        }
    }
}


// Display the snake to the html
const displaySnake = () => {    
    boardCells.forEach(element => {
        element.classList.remove('snake')
    })
    snake.forEach(item => {
        const snakeCell = document.querySelector(`.R${item[0]}.C${item[1]}`)
        snakeCell.classList.add('snake')
    })
}

// Check if a cell is in the snake array
const isInSnake = (row, column) => {
    return snake.some(item => item[0] === row && item[1] === column)
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

//Stop condition
const gameStop = () => {    
    direction = 'D'
    clearInterval(gameIntervalID)
    audioElm.pause()
    audioWinning.play()
    //animation
    snake.forEach(item => {
        const snakeCell = document.querySelector(`.R${item[0]}.C${item[1]}`)
        snakeCell.classList.add('snake-animation')
    })
}

// Update the snake
const updateSnake = () => {
    
    switch (direction) {
        case 'D': 
            if (snake[0][0] + 1 > rows - 1) {
                if (isInSnake(0, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(0, snake[0][1]))
            } else{
                if (isInSnake(snake[0][0] + 1, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0] + 1, snake[0][1]))
            }            
            break
        case 'U': 
            if (snake[0][0] - 1 < 0) {
                if (isInSnake(rows - 1, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(rows - 1, snake[0][1]))
            } else {
                if (isInSnake(snake[0][0] - 1, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0] - 1, snake[0][1]))
            }        
            break
        case 'L': 
            if (snake[0][1] - 1 < 0) {
                if (isInSnake(snake[0][0], columns - 1)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], columns - 1))
            } else {
                if (isInSnake(snake[0][0], snake[0][1] - 1)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], snake[0][1] - 1))
            }        
            break
        case 'R': 
            if (snake[0][1] + 1 > columns -1) {
                if (isInSnake(snake[0][0], 0)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], 0))
            } else {
                if (isInSnake(snake[0][0], snake[0][1] + 1)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], snake[0][1] + 1))
            }
            break            
    }
    if (isPlaying) {
        if (food[0] === snake[0][0] && food[1] === snake[0][1]) {
            document.querySelector(`.R${food[0]}.C${food[1]}`).classList.remove('food')
            generateFood()
            updateScore()
        }  else {
            snake.pop()
        }
        displaySnake() 
    }
}

//Move the snake
const moveSnake = () => {
    gameIntervalID = setInterval(updateSnake, milliseconds)
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
    if (!isPlaying) {
        generateSnake()
        generateFood()
        moveSnake()
        isPlaying = true
        if (audioBtn.innerHTML === '') {
            audioElm.play()
        }
    }
    
})
//Detecting the Up, Down, Left, Right keyboards pressed
document.onkeydown = (event) => {
    if (isPlaying){
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
}

//Turn on/off background music
audioBtn.addEventListener('click' , () => {
    if (audioElm.paused) {
        audioElm.play()
        audioBtn.innerHTML = ''
    } else {
        audioElm.pause()
        audioBtn.innerHTML = 'X'
    }    
})

//Initializing value
const initializeValue = () => {
    container.innerHTML = ''    
    isPlaying = false
    snake = []
    food = []
    direction = 'D'
    clearInterval(gameIntervalID)
    generateGrid()
    boardCells = document.querySelectorAll('#container div')
    score = -1
    updateScore()
}


// Play-again Option
playAgainBtn.addEventListener('click', () => {
    if (isPlaying) {    
        initializeValue()
    }    
})

//Level 1 button
level1Btn.addEventListener('click', () => {
        rows = 10
        columns = 10
        milliseconds = 500
        initializeValue()
})

//Level 2 button
level2Btn.addEventListener('click', () => {
        rows = 20
        columns = 20
        milliseconds = 200
        initializeValue()    
})

//Level 3 button
level3Btn.addEventListener('click', () => {
        rows = 50
        columns = 50
        milliseconds = 100
        initializeValue()
})

//------------
//Game starts
generateGrid()
boardCells = document.querySelectorAll('#container div')



    
