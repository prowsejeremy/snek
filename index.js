const express = require('express')
const path = require('path')
const fs = require('fs-extra')
const bodyParser = require('body-parser')

const app = module.exports = express()

app.use(bodyParser())
app.engine('.html', require('ejs').__express)
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'html')

app.get('/', function(req, res){
  res.render('index', {
    title: "Snek"
  })
})

app.get('/how-to-play', function(req, res){
  res.render('how-to-play', {
    title: "Snek: How to Play"
  })
})

app.get('/leaderboard', function(req, res){

  const rawdata = fs.readFileSync('leaderboard.json')
  const leaderboard_data = JSON.parse(rawdata)

  leaderboard_data.sort(function(entryA, entryB) { return entryB.score - entryA.score })

  res.render('leaderboard', {
    title: "Snek Leaderboard",
    LBDATA: leaderboard_data
  })
})

app.post('/submit', function(req, res){
  const rawdata = fs.readFileSync('leaderboard.json')
  let leaderboard_data = JSON.parse(rawdata)

  leaderboard_data.sort(function(entryA, entryB) { return entryB.score - entryA.score })
  leaderboard_data = leaderboard_data.slice(0, 9)

  const formData = req.body
  let {playerName, playerScore} = formData

  // Validate Player Data
  playerName = playerName.length > 3 ? "AAA" : playerName
  playerScore = playerScore > 999 ? 0 : parseInt(playerScore)

  if (playerScore > leaderboard_data[leaderboard_data.length-1].score) {
    leaderboard_data.push({
      name: playerName,
      score: playerScore
    })
  }
  
  let data = JSON.stringify(leaderboard_data)
  fs.writeFileSync('leaderboard.json', data)

  res.sendStatus(200)
})

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000)
  console.log('Express started on port 3000')
}