const scoreEle = document.getElementById("score")
const finalScoreEle = document.getElementById("finalScore")
const controlArea = document.getElementById("controlArea")

const playerScore = document.getElementById("scoreField")
const postScoreBtn = document.getElementById("postScore")
const postScorePopUp = document.getElementById("postScorePopUp")
const scoreForm = document.getElementById("scoreForm")
const closeForm = document.getElementById("closeForm")
const successMessage = document.getElementById("successMessage")

const gameoverMessage = document.getElementById("gameover")
const resetBtn = document.getElementById("resetBtn")

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let gameStart,
    gameEnabled,
    changeInitiated,
    velocityX,
    velocityY,
    gridSize,
    tileCount,
    snakeX,
    snakeY,
    appleX,
    appleY,
    poisonX,
    poisonY,
    bonusX,
    bonusY,
    trail,
    tailLength,
    score,
    runTime,
    appleImage,
    poisonImage,
    bonusImage


const init = function() {
  gameStart = false
  gameEnabled = true
  velocityX=velocityY = 0
  gridSize=18
  tileCount=18

  snakeX=snakeY = 10
  appleX=Math.floor(Math.random() * tileCount)
  appleY=Math.floor(Math.random() * tileCount)
  poisonX=false
  poisonY=false
  bonusX=false
  bonusY=false

  trail = []
  tailLength = 5
  score = 0

  runTime = setInterval(game, 1000/10)
}

const updateScore = function( reset = false, value = 5) {
  score = reset === true ? 0 : score+=value
  scoreEle.innerHTML = reset === true ? 0 : score
}

const gameOver = function() {
  gameEnabled = false
  clearInterval(runTime)
  finalScoreEle.innerHTML = score
  scoreField.value = score
  gameoverMessage.style = "display:flex;"
}

const reset = function() {
  gameEnabled = true
  updateScore(true)
  gameoverMessage.style = "display:none;"
  scoreForm.style = "display:fles;"
  successMessage.style = "display:none;"
  init()
}

const game = function() {

  // Load image assets
  if (appleImage === undefined) {
    appleImage = new Image()
    appleImage.src = "/images/apple.svg"
  }
  if (poisonImage === undefined) {
    poisonImage = new Image()
    poisonImage.src = "/images/covid-2.svg"
  }
  if (bonusImage === undefined) {
    bonusImage = new Image()
    bonusImage.src = "/images/star-2.svg"
  }

  // Fill game canvas
  ctx.fillStyle = "#161414"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  snakeX += velocityX
  snakeY += velocityY

  canvas.style = "outline: none;"

  if(snakeX < 0) {
    snakeX = tileCount-1
  }
  if (snakeX > tileCount-1) {
    snakeX = 0
  }
  if(snakeY < 0) {
    snakeY = tileCount-1
  }
  if (snakeY > tileCount-1) {
    snakeY = 0
  }
  
  // Snake
  ctx.fillStyle = "#FFFFFF"
  for (let index = 0; index < trail.length; index++) {
    const trailItem = trail[index]
    
    ctx.fillRect(trailItem.x*gridSize, trailItem.y*gridSize, gridSize-2, gridSize-2)
    
    if (gameStart && snakeX === trailItem.x && snakeY === trailItem.y) {
      gameOver()
    }
  }
  
  trail.push({ x:snakeX, y:snakeY })
  while(trail.length > tailLength) {
    trail.shift()
  }
  
  // Apple
  if (snakeX === appleX && snakeY === appleY) {
    appleX = false
    appleY = false
    
    tailLength++
    updateScore(false, 5)
    generateNewItem("apple")
    tailLength % 4 === 0 && poisonX === false && poisonY === false && generateNewItem("poison")
    tailLength % 7 === 0 && poisonX === false && poisonY === false && bonusX === false && bonusY === false && generateNewItem("bonus")
  }

  // Poison
  if (snakeX === poisonX && snakeY === poisonY) {
    poisonX = false
    poisonY = false
    updateScore(false, -3)
  }

  // Poison
  if (snakeX === bonusX && snakeY === bonusY) {
    bonusX = false
    bonusY = false
    updateScore(false, 10)
  }

  if (appleX !== false && appleY !== false) {
    // ctx.fillStyle = "#00FF00"
    // ctx.fillRect(appleX*gridSize, appleY*gridSize, gridSize-2, gridSize-2)

    ctx.drawImage(appleImage, appleX*gridSize, appleY*gridSize, gridSize-2, gridSize-2)
  }

  if (poisonX !== false && poisonY !== false) {
    setTimeout(function () {
      poisonX = false
      poisonY = false
    }, 5000)
    // ctx.fillStyle = "#FF0000"
    // ctx.fillRect(poisonX*gridSize, poisonY*gridSize, gridSize-2, gridSize-2)

    ctx.drawImage(poisonImage, poisonX*gridSize, poisonY*gridSize, gridSize-2, gridSize-2)
  }

  if (bonusX !== false && bonusY !== false) {
    setTimeout(function () {
      bonusX = false
      bonusY = false
    }, 5000)
    // ctx.fillStyle = "#FFFF00"
    // ctx.fillRect(bonusX*gridSize, bonusY*gridSize, gridSize-2, gridSize-2)

    ctx.drawImage(bonusImage, bonusX*gridSize, bonusY*gridSize, gridSize-2, gridSize-2)
  }

}

const generateNewItem = async function(kind) {

  const newItem = await pickNewItem()
  const passedInspection = await checkNewItem(newItem, kind)
  
  if (passedInspection) {
    switch(kind) {
      case "apple":
        appleX = newItem.x
        appleY = newItem.y
      break
      case "poison":
        poisonX = newItem.x
        poisonY = newItem.y
      break
      case "bonus":
        bonusX = newItem.x
        bonusY = newItem.y
      break
    }
  }
}

const pickNewItem = function() {
  const newItem = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  }
  return newItem
}

const checkNewItem = function(newItem, kind) {

  for (let index = 0; index < trail.length; index++) {
    const trailItem = trail[index]
    if ( newItem.x === trailItem.x && newItem.y === trailItem.y ) {
      generateNewItem(kind)
      return false
    }
  }

  return true
}

// Handle controls

const handleDirChange = function(dir) {
  if (!gameEnabled || changeInitiated) return false

  setTimeout(function() { changeInitiated = false }, 60)

  switch (dir) {
    case 'left':
      gameStart = true
      if (velocityX === 0) {
        velocityX = -1
        velocityY = 0
      }
      break
    case 'up':
      gameStart = true
      if (velocityY === 0) {
        velocityX = 0
        velocityY = -1
      }
      break
    case 'right':
      gameStart = true
      if (velocityX === 0) {
        velocityX = 1
        velocityY = 0
      }
      break
    case 'down':
      gameStart = true
      if (velocityY === 0) {
        velocityX = 0
        velocityY = 1
      }
      break
  }

  changeInitiated = true

}

// Handle inputs

const handleKeyPress = function(e) {
  switch(e.keyCode) {
    case 37:
      handleDirChange('left')
      break
    case 38:
      handleDirChange('up')
      break
    case 39:
      handleDirChange('right')
      break
    case 40:
      handleDirChange('down')
      break
  }
}

const touchStartPos = {x:0,y:0}
const touchEndPos = {x:0,y:0}

const handleTouchStart = function(touch) {
  touch.preventDefault()
  touchStartPos.x = touch.changedTouches[0].clientX
  touchStartPos.y = touch.changedTouches[0].clientY
}

const handleTouchEnd = function(touch) {
  touch.preventDefault()
  touchEndPos.x = touch.changedTouches[0].clientX
  touchEndPos.y = touch.changedTouches[0].clientY

  const changedX = touchStartPos.x > touchEndPos.x ? touchStartPos.x - touchEndPos.x : touchEndPos.x - touchStartPos.x
  const changedY = touchStartPos.y > touchEndPos.y ? touchStartPos.y - touchEndPos.y : touchEndPos.y - touchStartPos.y

  if (changedX > changedY) {

    if (touchStartPos.x - touchEndPos.x > 0) {
      handleDirChange('left')
    } else {
      handleDirChange('right')
    }
  } else {

    if (touchStartPos.y - touchEndPos.y > 0) {
      handleDirChange('up')
    } else {
      handleDirChange('down')
    }
  }

}

// Submit Scores

const submitScore = function() {
  postScorePopUp.style = "display:flex;"
}

const submitFormHandler = function(e) {
  e.preventDefault()

  const playerName = scoreForm.elements.playerName1.value + scoreForm.elements.playerName2.value + scoreForm.elements.playerName3.value
  const playerScore = parseInt(scoreForm.elements.scoreField.value)

  if (playerName.length < 2 || playerScore !== score) return false

  const data = {
    "playerName":playerName,
    "playerScore":playerScore
  }

  const xmlhttp = new XMLHttpRequest()
  xmlhttp.open("POST", '/submit')
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
  xmlhttp.send(JSON.stringify(data))

  scoreForm.style = "display:none;"
  successMessage.style = "display:flex;"
}

const closeHandler = function() {
  postScorePopUp.style = "display:none;"
}

// Subscribe to inputs

document.addEventListener("keydown", handleKeyPress)
controlArea.addEventListener("touchstart", handleTouchStart)
controlArea.addEventListener("touchend", handleTouchEnd)
resetBtn.addEventListener("click", reset)
postScoreBtn.addEventListener("click", submitScore)
scoreForm.addEventListener("submit", submitFormHandler)
closeForm.addEventListener("click", closeHandler)

// init

window.onload = function() {
  init()
}

// TODO
// - Fix bug with controls where pushing buttons to fast kills you
// - Add leaderboard
// - Add routing
