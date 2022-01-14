// Game variables
const game = document.querySelector('.game')
const ready = document.querySelector('.ready')
const welcome = document.querySelector('.welcome')
const gameStatus = document.querySelector('.game-status')
const background = document.querySelector('body')
let gameMode = false
const cellsNo = 868
const width = 28
let gameEnd = false

// Audio & ambience
const intro = document.querySelector('.amb')
const audioPlayer = document.querySelector('.audio')
const powerPellet = document.querySelector('.power-pellet')
const gameOverSound = document.querySelector('.game-over')
const victory = document.querySelector('.victory')
const munch = './aud/munch1.wav'
audioPlayer.src = './aud/munch1.wav'


function toggleMunch() {
  if (munch === './aud/munch1.wav') {
    audioPlayer.src = './aud/munch2.wav'
  } else if (munch === './aud/munch2.wav') {
    audioPlayer.src = './aud/munch1.wav'
  }
}

audioPlayer.volume = 0.3
powerPellet.volume = 0.8

// Speed of the game (interval)
const speed = 130

// The Pac-Man
let pacMan = 657

// The Ghosts

class Ghost {

  constructor(className, startIndex, speed, timerId, isScared) {
    this.className = className
    this.startIndex = startIndex
    this.speed = speed
    this.currentIndex = startIndex
    this.timerId = timerId
    this.isScared = isScared
  }
}

let ghosts = [
  new Ghost('red', 321, 100, 1, false),
  new Ghost('pink', 405, 100, 2, false),
  new Ghost('cyan', 404, 130, 3, false),
  new Ghost('orange', 406, 130, 4, false)

]

let ghostCounter = 0

// The field of cells
const cells = []

// Score
const gameScore = document.querySelector('.game-score')
const scoreHtml = document.querySelector('.score')
const highScore = document.querySelector('.high')
let scoreToWin = 0
let score = 0
highScore.innerHTML = localStorage.getItem('pacmanhighscore')

// Creating the game field, generating cells
for (let i = 0; i < cellsNo; i++) {
  const div = document.createElement('div')
  div.classList.add('cell')
  // div.innerHTML = i
  game.appendChild(div)
  cells.push(div)
}

// Assign Pac-Man to the field

cells[pacMan].classList.add('pac-full')

// Assign the ghosts to the field

ghosts.forEach(ghost => {
  cells[ghost.currentIndex].classList.add(ghost.className)
  cells[ghost.currentIndex].classList.add('ghost')
})

// Map variables, walls, food, 

const walls = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 840, 841, 842, 843, 844, 845, 846, 847, 848, 849, 850, 851, 852, 853, 854, 855, 856, 857, 858, 859, 860, 861, 862, 863, 864, 865, 866, 867, 812, 784, 756, 728, 700, 672, 644, 616, 588, 560, 786, 758, 787, 759, 760, 788, 761, 789, 762, 790, 763, 791, 764, 792, 765, 793, 766, 794, 767, 795, 769, 797, 770, 798, 772, 800, 773, 801, 774, 802, 775, 803, 776, 804, 777, 805, 778, 806, 779, 807, 780, 781, 808, 781, 809, 783, 811, 839, 741, 742, 713, 714, 685, 686, 685, 689, 687, 688, 684, 683, 682, 736, 708, 680, 679, 707, 735, 747, 719, 691, 748, 720, 692, 755, 727, 699, 671, 643, 615, 587, 559, 701, 702, 673, 674, 532, 533, 534, 535, 536, 537, 704, 705, 676, 677, 648, 649, 620, 621, 592, 593, 590, 591, 618, 619, 710, 711, 712, 715, 716, 717, 623, 624, 595, 596, 597, 598, 599, 625, 626, 627, 509, 481, 453, 425, 424, 423, 422, 421, 420, 369, 341, 313, 285, 257, 256, 255, 254, 253, 252, 201, 200, 199, 198, 170, 171, 172, 173, 224, 196, 168, 140, 112, 84, 56, 28, 114, 115, 116, 117, 86, 87, 88, 89, 58, 59, 60, 61, 63, 64, 65, 66, 67, 91, 92, 93, 94, 95, 119, 120, 121, 122, 123, 41, 42, 69, 70, 97, 98, 125, 126, 72, 73, 74, 75, 76, 100, 101, 102, 103, 104, 128, 129, 130, 131, 132, 78, 79, 80, 81, 106, 107, 108, 109, 134, 135, 136, 137, 55, 83, 111, 139, 167, 195, 223, 251, 368, 367, 366, 365, 364, 175, 203, 231, 259, 287, 315, 343, 371, 260, 261, 262, 288, 289, 290, 316, 344, 372, 427, 455, 483, 511, 539, 428, 456, 484, 512, 540, 629, 630, 601, 602, 573, 574, 545, 546, 544, 543, 542, 514, 515, 516, 517, 518, 519, 520, 521, 547, 548, 549, 604, 605, 606, 632, 633, 634, 607, 608, 635, 636, 722, 723, 694, 695, 725, 726, 697, 698, 666, 667, 610, 611, 638, 639, 612, 613, 640, 641, 558, 557, 556, 555, 554, 526, 498, 470, 442, 443, 444, 445, 446, 447, 386, 387, 388, 389, 390, 391, 358, 330, 302, 274, 275, 276, 277, 278, 279, 551, 552, 523, 524, 495, 496, 467, 468, 439, 440, 190, 191, 192, 193, 218, 219, 220, 221, 383, 384, 355, 356, 327, 328, 299, 300, 271, 272, 243, 244, 215, 216, 187, 188, 298, 297, 269, 270, 232, 204, 176, 268, 296, 263, 291, 265, 266, 293, 294, 237, 238, 209, 210, 181, 182, 183, 184, 185, 211, 212, 213, 180, 208, 179, 178, 206, 207, 346, 347, 348, 374, 402, 430, 458, 459, 460, 461, 462, 463, 464, 465, 437, 409, 381, 353, 352, 351, 375, 376, 277, 379, 380, 403, 431, 432, 433, 434, 435, 436, 407, 408]
const food = [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 57, 62, 68, 71, 77, 82, 90, 96, 99, 105, 113, 118, 124, 127, 133, 138, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 169, 174, 177, 186, 189, 194, 197, 202, 205, 214, 217, 222, 225, 226, 227, 228, 229, 230, 233, 234, 235, 236, 239, 240, 241, 242, 245, 246, 247, 248, 249, 250, 258, 273, 286, 301, 314, 329, 342, 357, 370, 385, 426, 441, 454, 469, 482, 497, 510, 525, 538, 553, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 589, 594, 600, 603, 609, 614, 617, 622, 628, 631, 637, 642, 646, 647, 650, 651, 652, 653, 654, 655, 656, 658, 659, 660, 661, 662, 663, 664, 665, 668, 669, 675, 678, 681, 703, 731, 730, 729, 757, 785, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 732, 733, 734, 706, 709, 737, 738, 739, 740, 768, 796, 690, 718, 746, 745, 744, 743, 771, 799, 827, 826, 825, 828, 829, 830, 831, 832, 833, 834, 835, 836, 837, 838, 810, 782, 754, 753, 752, 724, 696, 751, 750, 749, 721, 693, 398, 413]
const pellets = [645, 670, 85, 110]

for (let i = 0; i < walls.length; i++) {
  cells[walls[i]].classList.add('wall')
}

for (let i = 0; i < food.length; i++) {
  cells[food[i]].classList.add('food')
}

for (let i = 0; i < pellets.length; i++) {
  cells[pellets[i]].classList.add('pellet')
}

cells[349].classList.add('invis')
cells[350].classList.add('invis')


// Pac-Man active direction
let direction = 'left'


// Function to check for spacebar input, and start the game
function toggleStartEvent(event) {

  if (event.key === ' ') {

    pacMan = 657

    direction = 'left'
    score = 0
    scoreToWin = 0
    scoreHtml.innerHTML = score
    welcome.style.visibility = 'hidden'
    intro.play()
    background.classList.add('bg-play')

    setTimeout(() => {
      ready.style.visibility = 'hidden'
      cells[pacMan].classList.remove('pac-full')
      cells[pacMan].classList.add('pac-left')
      startGame()
      ghosts.forEach(ghost => moveGhost(ghost))
      gameEnd = false
      gameMode = true
    }, 4000)


  }
}

// Add an event listener to window, needed to start the game
window.addEventListener('keypress', toggleStartEvent)

// Starting the game
function startGame() {

  window.removeEventListener('keypress', toggleStartEvent)

  const gameInterval = setInterval(() => {

    if (direction === 'right' && !(cells[pacMan + 1].classList.contains('wall')) && !cells[pacMan + 1].classList.contains('invis')) {

      if (cells[pacMan + 1].classList.contains('food')) {

        toggleMunch()
        audioPlayer.play()
        cells[pacMan + 1].classList.remove('food')
        score += 10
        scoreToWin += 1
        scoreHtml.innerHTML = score
      } else if (cells[pacMan + 1].classList.contains('pellet')) {
        ghosts.forEach(ghost => ghost.isScared = true)
        setTimeout(unScareGhosts, 10000)
        powerPellet.play()
        cells[pacMan + 1].classList.remove('pellet')
        score += 50
        scoreToWin += 1
        gameScore.innerHTML = '50!'
        setTimeout(() => {
          gameScore.innerHTML = ''
        }, 2000)
        scoreHtml.innerHTML = score
      }
      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan += 1
      cells[pacMan].classList.add(`pac-${direction}`)

    } else if (direction === 'right' && pacMan === 419) {

      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan = 392
      cells[pacMan].classList.add(`pac-${direction}`)

    } else if (direction === 'up' && !(cells[pacMan - width].classList.contains('wall')) && !cells[pacMan - width].classList.contains('invis')) {

      if (cells[pacMan - width].classList.contains('food')) {
        toggleMunch()
        audioPlayer.play()
        cells[pacMan - width].classList.remove('food')
        score += 10
        scoreToWin += 1
        scoreHtml.innerHTML = score
      } else if (cells[pacMan - width].classList.contains('pellet')) {
        ghosts.forEach(ghost => ghost.isScared = true)
        setTimeout(unScareGhosts, 10000)
        powerPellet.play()
        cells[pacMan - width].classList.remove('pellet')
        score += 50
        scoreToWin += 1
        gameScore.innerHTML = '50!'
        setTimeout(() => {
          gameScore.innerHTML = ''
        }, 2000)
        scoreHtml.innerHTML = score
      }

      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan -= width
      cells[pacMan].classList.add(`pac-${direction}`)

    } else if (direction === 'down' && !(cells[pacMan + width].classList.contains('wall')) && !cells[pacMan + width].classList.contains('invis')) {

      if (cells[pacMan + width].classList.contains('food')) {
        toggleMunch()
        audioPlayer.play()
        cells[pacMan + width].classList.remove('food')
        score += 10
        scoreToWin += 1
        scoreHtml.innerHTML = score
      } else if (cells[pacMan + width].classList.contains('pellet')) {
        ghosts.forEach(ghost => ghost.isScared = true)
        setTimeout(unScareGhosts, 10000)
        powerPellet.play()
        cells[pacMan + width].classList.remove('pellet')
        score += 50
        scoreToWin += 1
        gameScore.innerHTML = '50!'
        setTimeout(() => {
          gameScore.innerHTML = ''
        }, 2000)
        scoreHtml.innerHTML = score
      }

      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan += width
      cells[pacMan].classList.add(`pac-${direction}`)

    } else if (direction === 'left' && !(cells[pacMan - 1].classList.contains('wall')) && !cells[pacMan - 1].classList.contains('invis')) {

      if (cells[pacMan - 1].classList.contains('food')) {
        toggleMunch()
        audioPlayer.play()
        cells[pacMan - 1].classList.remove('food')
        score += 10
        scoreToWin += 1
        scoreHtml.innerHTML = score
      } else if (cells[pacMan - 1].classList.contains('pellet')) {

        ghosts.forEach(ghost => ghost.isScared = true)
        setTimeout(unScareGhosts, 10000)
        powerPellet.play()
        cells[pacMan - 1].classList.remove('pellet')
        score += 50
        scoreToWin += 1
        gameScore.innerHTML = '50!'
        setTimeout(() => {
          gameScore.innerHTML = ''
        }, 2000)
        scoreHtml.innerHTML = score
      }

      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan -= 1
      cells[pacMan].classList.add(`pac-${direction}`)

    } else if (direction === 'left' && pacMan === 392) {

      cells[pacMan].classList.remove('pac-right', 'pac-left', 'pac-up', 'pac-down')
      pacMan = 419
      cells[pacMan].classList.add(`pac-${direction}`)

    }

    if (gameEnd) {
      clearInterval(gameInterval)
    }
    checkForWin()
  }, speed)

}

function checkIfGhostEated(ghost) {

  if (pacMan === ghost.currentIndex && ghost.isScared) {
    cells[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'ghost-scared')
    ghost.currentIndex = ghost.startIndex
    ghostCounter += 1
    ghostPoints()
    cells[ghost.currentIndex].classList.add(ghost.className, 'ghost', 'ghost-scared')
  }
}

// Check for contact with the ghosts when ghost is not scared

function checkForGameOver(ghost) {

  if (pacMan === ghost.currentIndex && !ghost.isScared) {
    background.classList.remove('bg-play')
    powerPellet.pause()
    gameOverSound.play()
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    gameScore.innerHTML = ''
    gameStatus.innerHTML = 'Game Over!'
    // loseScreen()
    gameMode = false
    gameEnd = true
    

    if (score > localStorage.getItem('pacmanhighscore')) {
      localStorage.setItem('pacmanhighscore', score)
      highScore.innerHTML = score
    }

    setTimeout(() => {

      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('ghost', 'pac-up', 'pac-left', 'pac-right', 'pac-down', 'ghost-scared', 'food', 'pellet', 'pink', 'red', 'cyan', 'orange')
      }
      pacMan = 657
      score = 0
      scoreToWin = 0
      ready.style.visibility = 'visible'

      ghosts = [
        new Ghost('red', 321, 100, 1, false),
        new Ghost('pink', 405, 100, 2, false),
        new Ghost('cyan', 404, 130, 3, false),
        new Ghost('orange', 406, 130, 4, false)
      ]
      ghosts.forEach(ghost => {
        cells[ghost.currentIndex].classList.add(ghost.className)
        cells[ghost.currentIndex].classList.add('ghost')
      })

      cells[pacMan].classList.add('pac-full')
      ghostCounter = 0

      for (let i = 0; i < food.length; i++) {
        cells[food[i]].classList.add('food')
      }

      for (let i = 0; i < pellets.length; i++) {
        cells[pellets[i]].classList.add('pellet')
      }

      gameStatus.innerHTML = ''
      welcome.style.visibility = 'visible'
      window.addEventListener('keypress', toggleStartEvent)

    }, 4000)

  }

}

// Creating a Win, Lose screen at the end of the game

function winScreen() {
  background.classList.add('winnerScreen')
}

function loseScreen() {
  background.classList.add('winnerScreen')
}


// Check for win!

function checkForWin() {

  if (scoreToWin === 244) {
    background.classList.remove('bg-play')
    powerPellet.pause()
    victory.play()
    ghosts.forEach(ghost => clearInterval(ghost.timerId))
    gameScore.innerHTML = ''
    gameStatus.innerHTML = 'Winner!'
    // winScreen()
    gameMode = false
    gameEnd = true

    if (score > localStorage.getItem('pacmanhighscore')) {
      localStorage.setItem('pacmanhighscore', score)
      highScore.innerHTML = score
    }

    setTimeout(() => {
      for (let i = 0; i < cells.length; i++) {
        cells[i].classList.remove('ghost', 'pac-up', 'pac-left', 'pac-right', 'pac-down', 'ghost-scared', 'food', 'pellet', 'pink', 'red', 'cyan', 'orange')
      }
      pacMan = 657
      score = 0
      ready.style.visibility = 'visible'
      scoreToWin = 0
      ghosts = [
        new Ghost('red', 321, 100, 1, false),
        new Ghost('pink', 405, 100, 2, false),
        new Ghost('cyan', 404, 130, 3, false),
        new Ghost('orange', 406, 130, 4, false)
      ]
      ghosts.forEach(ghost => {
        cells[ghost.currentIndex].classList.add(ghost.className)
        cells[ghost.currentIndex].classList.add('ghost')
      })

      cells[pacMan].classList.add('pac-full')

      ghostCounter = 0

      for (let i = 0; i < food.length; i++) {
        cells[food[i]].classList.add('food')
      }

      for (let i = 0; i < pellets.length; i++) {
        cells[pellets[i]].classList.add('pellet')
      }

      gameStatus.innerHTML = ''
      welcome.style.visibility = 'visible'
      window.addEventListener('keypress', toggleStartEvent)

    }, 6000)
  }
}

// Unscare the ghosts

function unScareGhosts() {
  ghosts.forEach(ghost => ghost.isScared = false)
  ghostCounter = 0
}

// Variable points for ghosts

function ghostPoints() {

  if (ghostCounter === 1) {
    score += 200
    gameScore.innerHTML = ''
    gameScore.innerHTML = '200!'
    setTimeout(() => {
      gameScore.innerHTML = ''
    }, 2000)
    scoreHtml.innerHTML = score
  } else if (ghostCounter === 2) {
    score += 400
    gameScore.innerHTML = ''
    gameScore.innerHTML = '400!'
    setTimeout(() => {
      gameScore.innerHTML = ''
    }, 2000)
    scoreHtml.innerHTML = score
  } else if (ghostCounter === 3) {
    score += 800
    gameScore.innerHTML = ''
    gameScore.innerHTML = '800!'
    setTimeout(() => {
      gameScore.innerHTML = ''
    }, 2000)
    scoreHtml.innerHTML = score
  } else if (ghostCounter === 4) {
    score += 1600
    gameScore.innerHTML = ''
    gameScore.innerHTML = '1600!'
    setTimeout(() => {
      gameScore.innerHTML = ''
    }, 2000)
    scoreHtml.innerHTML = score
    ghostCounter = 0
  }

}

// Listeners on the arrows, changes the direction of Pac-Man

window.addEventListener('keydown', (event) => {
  const key = event.key

  if (key === 'ArrowRight' && !(cells[pacMan + 1].classList.contains('wall')) && gameMode) {
    direction = 'right'

  } else if (key === 'ArrowUp' && !(cells[pacMan - width].classList.contains('wall')) && gameMode) {
    direction = 'up'
  } else if (key === 'ArrowDown' && !(cells[pacMan + width].classList.contains('wall')) && gameMode) {

    direction = 'down'
  } else if (key === 'ArrowLeft' && !(cells[pacMan - 1].classList.contains('wall')) && gameMode) {
    direction = 'left'
  }

})


function moveGhost(ghost) {
  checkIfGhostEated(ghost)
  checkForGameOver(ghost)
  const directions = [-1, 1, width, -width]
  let direction = directions[Math.floor(Math.random() * directions.length)]

  ghost.timerId = setInterval(function () {

    if (!cells[ghost.currentIndex + direction].classList.contains('wall') && !cells[ghost.currentIndex + direction].classList.contains('ghost')) {
      checkIfGhostEated(ghost)
      checkForGameOver(ghost)
      // ghost can go here
      // remove all ghost related classes
      cells[ghost.currentIndex].classList.remove(ghost.className)
      cells[ghost.currentIndex].classList.remove('ghost', 'ghost-scared')
      // change the currentIndex to the new safe square
      ghost.currentIndex = ghost.currentIndex + direction
      // place the ghost at its new location
      cells[ghost.currentIndex].classList.add(ghost.className, 'ghost')
      checkIfGhostEated(ghost)
      checkForGameOver(ghost)

      if (ghost.isScared) {
        checkForGameOver(ghost)
        cells[ghost.currentIndex].classList.add('ghost-scared')
      }

    } else {
      checkIfGhostEated(ghost)
      checkForGameOver(ghost)
      // another direction needed
      direction = directions[Math.floor(Math.random() * directions.length)]
    }

    checkIfGhostEated(ghost)
    checkForGameOver(ghost)
  }, ghost.speed)

}


