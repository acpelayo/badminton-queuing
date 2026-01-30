import { Player, Match } from './classes.js'

let _dbPlayer = []
let _dbMatch = []

// PLAYER FUNCTIONS
function addPlayer(newPlayerId) {
	// check if player exists
	if (_dbPlayer.filter((player) => player.id === newPlayerId).length !== 0) return null

	const newPlayer = new Player(newPlayerId)
	_dbPlayer.push(newPlayer)
	_savePlayerDBtoLocalStorage()

	return newPlayer
}
function deletePlayer(playerID) {
	_dbPlayer = _dbPlayer.filter((player) => player.id !== playerID)
	_savePlayerDBtoLocalStorage()
}
function getPlayer(playerID) {
	return _dbPlayer.find((player) => player.id === playerID)
}
function getPlayerArray() {
	return _dbPlayer
}

// MATCH FUNCTIONS
function addMatch(newMatch) {
	_dbMatch.push(newMatch)
	_saveMatchDBToLocalStorage()
	_savePlayerDBtoLocalStorage()
}
function deleteMatch(matchID) {
	_dbMatch = _dbMatch.filter((match) => match.id !== matchID)
	_saveMatchDBToLocalStorage()
	_savePlayerDBtoLocalStorage()
}
function getMatch(matchID) {
	return _dbMatch.find((match) => match.id === matchID)
}
function getMatchArray() {}

// LOCALSTORAGE FUNCTIONS
function _savePlayerDBtoLocalStorage() {
	localStorage.setItem('dbPlayer', JSON.stringify(_dbPlayer))
}
function _saveMatchDBToLocalStorage() {
	localStorage.setItem('dbMatch', JSON.stringify(_dbMatch))
}

function _retrievePlayerDBFromLocalStorage() {
	const playerInfo = JSON.parse(localStorage.getItem('dbPlayer')) || []
	_dbPlayer = playerInfo.map((playerJSON) => Player.fromJSON(playerJSON))
}
function _retrieveMatchDBFromLocalStorage() {
	const matchInfo = JSON.parse(localStorage.getItem('dbMatch')) || []
	_dbMatch = matchInfo.map((matchJSON) => Match.fromJSON(matchJSON))
}

_retrievePlayerDBFromLocalStorage()
_retrieveMatchDBFromLocalStorage()

export default {
	addPlayer,
	deletePlayer,
	getPlayer,
	getPlayerArray,
	addMatch,
	deleteMatch,
	getMatch,
	getMatchArray,
}
