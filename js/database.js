import { Player, Match } from './classes.js'

let _dbPlayers = []
let _dbMatches = []

// PLAYER FUNCTIONS
function addPlayer(newPlayerId) {
	// check if player exists
	if (_dbPlayers.filter((player) => player.id === newPlayerId).length !== 0) return null

	const newPlayer = new Player(newPlayerId)

	// count matches played by the player in case the player existed previously and was deleted
	newPlayer.matches = _dbMatches //prettier ignore
		.filter((match) => match.includesPlayer(newPlayerId))
		.map((match) => match.id)

	_dbPlayers.push(newPlayer)
	_savePlayerDBtoLocalStorage()

	return newPlayer
}
function deletePlayer(playerID) {
	_dbPlayers = _dbPlayers.filter((player) => player.id !== playerID)
	_savePlayerDBtoLocalStorage()
}
function getPlayer(playerID) {
	return _dbPlayers.find((player) => player.id === playerID)
}
function getPlayerArray() {
	return _dbPlayers
}

// MATCH FUNCTIONS
function addMatch(newMatch) {
	_dbMatches.push(newMatch)
	_dbPlayers.forEach((player) => {
		if (newMatch.includesPlayer(player.id)) {
			player.addMatch(newMatch.id)
		}
	})

	_saveMatchDBToLocalStorage()
	_savePlayerDBtoLocalStorage()
}
function deleteMatch(matchId) {
	_dbMatches = _dbMatches.filter((match) => match.id !== matchId)
	_dbPlayers.forEach((player) => {
		player.matches = player.matches.filter((id) => id !== matchId)
	})

	_saveMatchDBToLocalStorage()
	_savePlayerDBtoLocalStorage()
}
function getMatch(matchID) {
	return _dbMatches.find((match) => match.id === matchID)
}
function getMatchArray() {
	return _dbMatches
}

// LOCALSTORAGE FUNCTIONS
function _savePlayerDBtoLocalStorage() {
	localStorage.setItem('dbPlayer', JSON.stringify(_dbPlayers))
}
function _saveMatchDBToLocalStorage() {
	localStorage.setItem('dbMatch', JSON.stringify(_dbMatches))
}

function retrievePlayerDBFromLocalStorage() {
	const playerInfo = JSON.parse(localStorage.getItem('dbPlayer')) || []
	_dbPlayers = playerInfo.map((playerJSON) => Player.fromJSON(playerJSON))
}
function retrieveMatchDBFromLocalStorage() {
	const matchInfo = JSON.parse(localStorage.getItem('dbMatch')) || []
	_dbMatches = matchInfo.map((matchJSON) => Match.fromJSON(matchJSON))
}

function deleteOldDb() {
	// cleanup of old database
	const oldPlayerDB = localStorage.getItem('players')
	const oldMatchDB = localStorage.getItem('matches')

	if (oldPlayerDB) localStorage.removeItem('players')
	if (oldMatchDB) localStorage.removeItem('matches')
}
deleteOldDb()

export default {
	addPlayer,
	deletePlayer,
	getPlayer,
	getPlayerArray,
	addMatch,
	deleteMatch,
	getMatch,
	getMatchArray,
	retrievePlayerDBFromLocalStorage,
	retrieveMatchDBFromLocalStorage,
}
