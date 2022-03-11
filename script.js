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
const superBtn = document.querySelector('#super')
const modal = document.querySelector("#myModal")
const span = document.querySelector(".close")
let boardCells


const audioWinning = new Audio('audios/mixkit-arcade-retro-run-sound-220.wav')
const audioEating = new Audio('audios/mixkit-arcade-retro-changing-tab-206-[AudioTrimmer.com].wav')


let rows = 10
let columns = 10
let milliseconds = 500 //0.5s
let snake = []
let direction = 'D' 
let currentDirec = 'D' //Initial direction of snake is downward 
let isGrowing = false
let food = []

let gameIntervalID 
let score = 0
let highestScore = 0
let isPlaying = false

let level = 1



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
    console.log('game stopped');
    isPlaying = false
    currentDirec = 'D'
    direction = 'D'
    clearInterval(gameIntervalID)
    audioElm.pause()
    audioWinning.play()
    if (level === 1 && score > 5) {
        level = 2
        level2Btn.style.display = 'block'
    } else if (level === 2 && score > 10) {
        level = 3
        level3Btn.style.display = 'block'
    } else if (level === 3 && score > 15){
        level = 4
        superBtn.style.display = 'block'
    }

    //animation
    snake.forEach(item => {
        const snakeCell = document.querySelector(`.R${item[0]}.C${item[1]}`)
        snakeCell.classList.add('snake-animation')
    })

    boardCells.forEach(cell => {
        if (!cell.classList.contains('snake'))
        cell.style.animationName = 'blink'
    })
    
    setTimeout(() => {modal.style.display = "block"}, 2500)
}

// Update the snake
const updateSnake = () => {
    if (!((currentDirec === 'L' && direction === 'R') || (currentDirec === 'R' && direction === 'L') || (currentDirec === 'U' && direction === 'D') || (currentDirec === 'D' && direction === 'U'))) {
        currentDirec = direction
    }
    switch (currentDirec) {
        case 'D': 
            if (snake[0][0] + 1 > rows - 1 || isInSnake(snake[0][0] + 1, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0] + 1, snake[0][1]))                       
            break
        case 'U': 
            if (snake[0][0] - 1 < 0 || isInSnake(snake[0][0] - 1, snake[0][1])) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0] - 1, snake[0][1]))                
            break
        case 'L': 
            if (snake[0][1] - 1 < 0 || isInSnake(snake[0][0], snake[0][1] - 1)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], snake[0][1] - 1))
            break
        case 'R': 
            if (snake[0][1] + 1 > columns -1 || isInSnake(snake[0][0], snake[0][1] + 1)) {
                    gameStop()
                } else snake.unshift(new Array(snake[0][0], snake[0][1] + 1))
            break            
    }
    if (isPlaying) {
        if (food[0] === snake[0][0] && food[1] === snake[0][1]) {
            document.querySelector(`.R${food[0]}.C${food[1]}`).classList.remove('food')
            generateFood()
            updateScore()
            audioEating.play()
        }  else {            
            snake.pop()
        }
    } 
    displaySnake() 
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

//Initializing value
const initializeValue = () => {
    container.innerHTML = ''    
    isPlaying = false
    snake = []
    food = []
    currentDirec = 'D'
    clearInterval(gameIntervalID)
    generateGrid()
    boardCells = document.querySelectorAll('#container div')
    score = -1
    updateScore()
}

//------------
//Add event listeners

//Detecting the Up, Down, Left, Right keyboards pressed
document.onkeydown = (event) => {
    if (isPlaying){
        switch (event.keyCode) {
            case 37: direction = 'L'
            break
            case 38: direction = 'U'
            break
            case 39: direction = 'R'
            break
            case 40: direction = 'D'
            break
            default: break
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


// Play-again Option
playAgainBtn.addEventListener('click', () => {
    if (!isPlaying) {   
        initializeValue()
        generateSnake()
        generateFood()
        moveSnake()
        isPlaying = true
        if (audioBtn.innerHTML === '') {
            audioElm.play()
        }
        playAgainBtn.innerHTML = 'Play Again'
    }    
})

//Level 1 button
level1Btn.addEventListener('click', () => {
    if (!isPlaying) {  
        rows = 10
        columns = 10
        milliseconds = 500
        initializeValue()
        playAgainBtn.innerHTML = 'Play'
    }
})

//Level 2 button
level2Btn.addEventListener('click', () => {
    if (!isPlaying) {  
        rows = 20
        columns = 20
        milliseconds = 300
        initializeValue()    
        playAgainBtn.innerHTML = 'Play'
    }
})

//Level 3 button
level3Btn.addEventListener('click', () => {
    if (!isPlaying) {  
        rows = 30
        columns = 30
        milliseconds = 200
        initializeValue()
        playAgainBtn.innerHTML = 'Play'
    }
})

//Super button
superBtn.addEventListener('click', () => {
    if (!isPlaying) {  
        rows = 50
        columns = 50
        milliseconds = 100
        initializeValue()
        playAgainBtn.innerHTML = 'Play'
    }
})

//Close motal
span.onclick = () => {
    modal.style.display = "none";
  }
window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
//------------
//Game starts
generateGrid()
boardCells = document.querySelectorAll('#container div')



    
