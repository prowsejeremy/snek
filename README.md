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
    font: 'fontfamily', // Optional
    gameElement: document.querySelector('#game'), // Must provide a gameElement
  }
)

// To start the game use the `init` function
snek.init()

//To stop the game processes run the `destroy` function
snek.destroy()

~~~