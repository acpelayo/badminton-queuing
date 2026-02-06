import db from './database.js'
import dom from './dom.js'
import handler from './event-handlers.js'

db.retrievePlayerDBFromLocalStorage()
db.retrieveMatchDBFromLocalStorage()

dom.loadPlayerList()
dom.reloadMatchList()

const textInputAddPlayer = document.getElementById('player-name')
const btnAddPlayer = document.querySelector('#add-player > button')
const elementPlayerList = document.getElementById('player-list')

btnAddPlayer.addEventListener('click', handler.addPlayer)
textInputAddPlayer.addEventListener('keydown', handler.addPlayer)
elementPlayerList.addEventListener('click', handler.deletePlayer)
elementPlayerList.addEventListener('click', handler.clickPlayer)

const btnAddMatch = document.querySelector('#add-match button')
const elementAddMatch = document.getElementById('add-match')

btnAddMatch.addEventListener('click', handler.addMatch)
elementAddMatch.addEventListener('click', handler.clickMatchQueue)

const elementMatchList = document.getElementById('match-list')

elementMatchList.addEventListener('click', handler.deleteMatch)
elementMatchList.addEventListener('click', handler.clickMatch)
