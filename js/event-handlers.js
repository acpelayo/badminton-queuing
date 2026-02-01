import db from './database.js'
import dom from './dom.js'
import { Player, Match, MatchFactory } from './classes.js'

function addPlayer(e) {
	if (e.type !== 'click' && e.key !== 'Enter') return

	let textIinputPlayerName = e.target
	if (e.type === 'click') {
		textIinputPlayerName = textIinputPlayerName.previousElementSibling
	}

	const newPlayerId = textIinputPlayerName.value.trim()
	if (!newPlayerId) return

	const newPlayerInstance = db.addPlayer(newPlayerId)

	// null is returned if player already exists
	if (newPlayerInstance === null) return

	dom.addPlayer(newPlayerInstance)
	dom.reloadPlayerList()

	textIinputPlayerName.value = ''
	textIinputPlayerName.focus()
}

function addMatch(e) {
	// check if players are complete
	if (!MatchFactory.isFull) return

	const newMatch = MatchFactory.createMatch()
	db.addMatch(newMatch)

	dom.updateMatchQueue()
	dom.reloadPlayerList()
	dom.addMatch(newMatch)
	// dom.clearHighlightedPlayers()

	return
}

function clickPlayer(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementPlayer = e.target.closest('.player')
	if (!elementPlayer) return
	const playerId = elementPlayer.dataset.id
	if (!playerId) return

	const isHighlighted = elementPlayer.classList.contains('highlight')

	let index
	if (isHighlighted) {
		index = MatchFactory.removePlayer(playerId)
	} else {
		index = MatchFactory.addPlayer(playerId)
	}

	// -1 is returned if player was not added/removed
	if (index === -1) return

	dom.togglePlayerHighlight(playerId)
	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
}

function clickMatchQueue(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementPlayer = e.target.closest('.match-player')
	if (!elementPlayer) return
	const playerId = elementPlayer.dataset.id
	if (!playerId) return

	let index = MatchFactory.removePlayer(playerId)

	// if (index === -1) return

	dom.togglePlayerHighlight(playerId)
	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
}

function clickMatch(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return
	const matchId = +elementMatch.dataset.id
	if (!matchId) return

	const isDisabled = elementMatch.classList.contains('disabled')
	const matchInstance = db.getMatch(matchId)

	if (isDisabled) {
		matchInstance.winner = null
	} else {
		matchInstance.winner = true
	}

	dom.toggleMatchDisabled(matchId)
	db.saveMatchDBToLocalStorage()
}

function deletePlayer(e) {
	if (e.target.tagName !== 'BUTTON') return

	const elementPlayer = e.target.closest('.player')
	if (!elementPlayer) return

	const playerId = elementPlayer.dataset.id

	if (MatchFactory.includesPlayer(playerId)) MatchFactory.removePlayer(playerId)
	db.deletePlayer(playerId)

	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
	elementPlayer.remove()
}
function deleteMatch(e) {
	if (e.target.tagName !== 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return

	const matchId = +elementMatch.dataset.id
	db.deleteMatch(matchId)
	elementMatch.remove()
	dom.reloadPlayerList()
}

export default {
	addPlayer,
	addMatch,
	deletePlayer,
	deleteMatch,
	clickPlayer,
	clickMatch,
	clickMatchQueue,
}
