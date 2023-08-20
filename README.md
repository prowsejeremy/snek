## SNEK

A simple yet addictive JS redition of the classic snake game.

## Demo

Head on over to my website and enter the magic ***cough*** konami ***cough*** code...
[https://jpd.nz](https://jpd.nz)

## Instalation

Using npm (or package manager of your choice):
~~~ terminal
  npm i https://github.com/prowsejeremy/snek
~~~

~~~js
import Snek from 'snek'

const snek = new Snek(
  { 
    gameElement: document.querySelector('#game'), // Must provide a gameElement
    gameFont: { // Optional along with all props
      family: 'fontfamily',
      weight: 600,
      size: 30,
      color: '#FFFFFF'
    }
  }
)

// To start the game use the `init` function
snek.init()

// To listen to in game events
snek.on('reset', () => {
  console.log('re-re-re-reeeeset!')
})

snek.on('start', () => {
  console.log('ready... fight!')
})

snek.on('end', () => {
  console.log('gameover man, gameover!')
})

// To stop the game processes run the `destroy` function
snek.destroy()

~~~