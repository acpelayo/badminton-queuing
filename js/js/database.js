import { Player } from './classes/Player.js'
import { Match, MatchFactory } from './classes/Match.js'

let _dbPlayers = []
let _dbMatches = []

// PLAYER FUNCTIONS
function addPlayer(newPlayerId) {
	// check if player exists
	if (_dbPlayers.filter((player) => player.id === newPlayerId).length !== 0) return null

	const newPlayer = new Player(newPlayerId)

	// check if player has played in existing matches
	_dbMatches.forEach((match) => {
		if (match.includesPlayer(newPlayerId)) {
			newPlayer.addMatch(match.id)
		}
	})

	_dbPlayers.push(newPlayer)

	_updatePlayersMatchInfo()
	_sortPlayers()

	savePlayerDBtoLocalStorage()

	return newPlayer
}
function deletePlayer(playerID) {
	_dbPlayers = _dbPlayers.filter((player) => player.id !== playerID)

	savePlayerDBtoLocalStorage()
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
		if (!newMatch.includesPlayer(player.id)) return
		player.addMatch(newMatch.id)
		player.queueIndex = -1
	})

	_updatePlayersMatchInfo()
	_sortPlayers()

	saveMatchDBToLocalStorage()
	savePlayerDBtoLocalStorage()
}
function deleteMatch(matchId) {
	_dbMatches = _dbMatches.filter((match) => match.id !== matchId)
	_dbPlayers.forEach((player) => player.deleteMatch(matchId))

	_updatePlayersMatchInfo()
	_sortPlayers()

	saveMatchDBToLocalStorage()
	savePlayerDBtoLocalStorage()
}
function moveMatch(fromIndex, toIndex) {
	const [match] = _dbMatches.splice(fromIndex, 1)
	_dbMatches.splice(toIndex, 0, match)

	_updatePlayersMatchInfo()
	_sortPlayers()

	saveMatchDBToLocalStorage()
	savePlayerDBtoLocalStorage()
}

function getMatch(matchID) {
	return _dbMatches.find((match) => match.id === matchID)
}
function getMatchArray() {
	return _dbMatches
}

// LOCALSTORAGE FUNCTIONS
function savePlayerDBtoLocalStorage() {
	localStorage.setItem('dbPlayer', JSON.stringify(_dbPlayers))
}
function saveMatchDBToLocalStorage() {
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

// UTILITIES
function _updatePlayersMatchInfo() {
	_dbPlayers.forEach((player) => {
		let lastConsecutiveMatchesCount = 0
		let matchesSinceLastMatch = -1
		for (let i = 0; i < _dbMatches.length; i++) {
			const match = _dbMatches[_dbMatches.length - 1 - i]

			// update players' lastConsecutiveMatchCount and matchesSinceLastMatch
			if (match.includesPlayer(player.id)) {
				lastConsecutiveMatchesCount++
				if (matchesSinceLastMatch === -1) {
					matchesSinceLastMatch = i
				}
			} else if (lastConsecutiveMatchesCount !== 0) {
				break
			}
		}
		player.lastConsecutiveMatchesCount = lastConsecutiveMatchesCount
		player.matchesSinceLastMatch = matchesSinceLastMatch
	})
}

function _sortPlayers() {
	_dbPlayers = _dbPlayers.sort((p1, p2) => {
		// sort by match count
		const criteria1 = p1.matchCount - p2.matchCount
		if (criteria1 !== 0) return criteria1

		// sort by matches since last match
		const criteria2 = p2.matchesSinceLastMatch - p1.matchesSinceLastMatch
		if (criteria2 !== 0) return criteria2

		// sort by last number of consecutive matches
		const criteria3 = p1.lastConsecutiveMatchesCount - p2.lastConsecutiveMatchesCount
		if (criteria3 !== 0) return criteria3

		return p1.id.localeCompare(p2.id)
	})
}

function _deleteOldDb() {
	// cleanup of old database
	const oldPlayerDB = localStorage.getItem('players')
	const oldMatchDB = localStorage.getItem('matches')

	if (oldPlayerDB) localStorage.removeItem('players')
	if (oldMatchDB) localStorage.removeItem('matches')
}
_deleteOldDb()

export default {
	addPlayer,
	deletePlayer,
	getPlayer,
	getPlayerArray,
	addMatch,
	deleteMatch,
	moveMatch,
	getMatch,
	getMatchArray,
	savePlayerDBtoLocalStorage,
	saveMatchDBToLocalStorage,
	retrievePlayerDBFromLocalStorage,
	retrieveMatchDBFromLocalStorage,
}
