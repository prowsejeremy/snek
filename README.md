## SNEK

A simple yet addictive JS redition of the classic snake game.

## Instalation

Using npm:
~~~ terminal
  npm i 
~~~

~~~js
import Snek from 'snek'

const snek = new Snek(
  {
    font: 'fontfamily', // Optional
    gameElement: document.querySelector('#game'), // Must provide a gameElement
  }
)

// To start the game use the `init` function
snek.init()

//To stop the game processes run the `destroy` function
snek.destroy()

~~~