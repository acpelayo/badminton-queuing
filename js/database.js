import { Player, Match } from './classes'

let _dbPlayer = []
let _dbMatch = []

function addPlayer(newPlayer) {
	_dbPlayer.push(newPlayer)
	savePlayerDB()
}

function deletePlayer(playerID) {
	_dbPlayer = _dbPlayer.filter((player) => player.id !== playerID)
	savePlayerDB()
}

function getPlayer(playerID) {
	return _dbPlayer.find((player) => player.id === playerID)
}

function addMatch(newMatch) {
	_dbMatch.push(newMatch)
	saveMatchDB()
	savePlayerDB()
}

function deleteMatch(matchID) {
	_dbMatch = _dbMatch.filter((match) => match.id !== matchID)
	saveMatchDB()
	savePlayerDB()
}

function getMatch(matchID) {
	return _dbMatch.find((match) => match.id === matchID)
}

// LOCALSTORAGE FUNCTIONS
function savePlayerDB() {
	localStorage.setItem('dbPlayer', JSON.stringify(_dbPlayer))
}
function saveMatchDB() {
	localStorage.setItem('dbMatch', JSON.stringify(_dbMatch))
}

function retrievePlayerDB() {
	const playerInfo = JSON.parse(localStorage.getItem('dbPlayer')) || []
	_dbPlayer = playerInfo.map((playerJSON) => Player.fromJSON(playerJSON))
}
function retrieveMatchDB() {
	const matchInfo = JSON.parse(localStorage.getItem('dbMatch')) || []
	_dbMatch = matchInfo.map((matchJSON) => Match.fromJSON(matchJSON))
}

retrievePlayerDB()
retrieveMatchDB()

export default {
	addPlayer,
	deletePlayer,
	getPlayer,
	addMatch,
	deleteMatch,
	getMatch,
}
