import db from './database.js'
import { MatchFactory } from './classes.js'

function addPlayer(newPlayerInstance) {
	const newPlayerElement = newPlayerInstance.createPlayerElement()
	document.getElementById('player-list').append(newPlayerElement)
}

function addMatch(newMatch) {
	const elementMatchList = document.getElementById('match-list')
	const elementMatches = elementMatchList.children
	const elementNewMatch = newMatch.createMatchElement()
	const elementAddMatchButton = document.getElementById('add-match')

	// animation
	elementNewMatch.classList.add('animate-fade-from-above')
	setTimeout(() => {
		elementNewMatch.classList.remove('animate-fade-from-above')
	}, 500)

	elementMatchList.prepend(elementNewMatch)

	const bottomElementMatchList = elementMatchList.getBoundingClientRect().bottom
	const bottomElementAddMatchButton = elementAddMatchButton.getBoundingClientRect().bottom

	for (let i = 1; i < elementMatches.length; i++) {
		elementMatches[i].classList.add('animate-move-down')
	}
	if (bottomElementAddMatchButton - bottomElementMatchList >= 60) {
		elementAddMatchButton.classList.add('animate-move-down')
	}

	setTimeout(() => {
		for (let i = 1; i < elementMatches.length; i++) {
			elementMatches[i].classList.remove('animate-move-down')
		}
		if (bottomElementAddMatchButton - bottomElementMatchList >= 60) {
			elementAddMatchButton.classList.remove('animate-move-down')
		}
	}, 500)
}

function loadPlayerList() {
	const elementPlayerList = document.getElementById('player-list')
	const elementPlayers = elementPlayerList.children

	while (elementPlayers.length !== 0) {
		elementPlayers[0].remove()
	}

	db.getPlayerArray().forEach((player) => {
		elementPlayerList.appendChild(player.createPlayerElement())
	})
}

function reloadMatchList() {
	const elementMatchList = document.getElementById('match-list')
	const elementMatches = elementMatchList.children
	for (let i = 0; i < elementMatches.length; i++) {
		elementMatches[i].remove()
	}

	db.getMatchArray().forEach((match) => {
		elementMatchList.prepend(match.createMatchElement())
	})
}

function togglePlayerHighlight(playerId) {
	const elementPlayerList = document.getElementById('player-list')
	const elementPlayers = elementPlayerList.children

	let elementPlayer
	for (let i = 0; i < elementPlayers.length; i++) {
		if (elementPlayers[i].dataset.id === playerId) {
			elementPlayer = elementPlayers[i]
			break
		}
	}

	if (elementPlayer.classList.contains('highlight')) {
		elementPlayer.classList.remove('highlight')
		return -1
	} else {
		elementPlayer.classList.add('highlight')
		return 1
	}
}

function clearPlayerHighlight() {
	const elementPlayerList = document.getElementById('player-list')
	const elementPlayers = elementPlayerList.children
	for (let i = 0; i < elementPlayers.length; i++) {
		elementPlayers[i].classList.remove('highlight')
	}
}

function toggleMatchDisabled(matchId) {
	const elementMatchList = document.getElementById('match-list')
	const elementMatches = elementMatchList.children

	let elementMatch
	for (let i = 0; i < elementMatches.length; i++) {
		if (+elementMatches[i].dataset.id === matchId) {
			elementMatch = elementMatches[i]
			break
		}
	}

	if (elementMatch.classList.contains('disabled')) {
		elementMatch.classList.remove('disabled')
		return -1
	} else {
		elementMatch.classList.add('disabled')
		return 1
	}
}

function updateMatchQueue() {
	const elementPlayers = document.querySelectorAll('#add-match .match-player')
	const currentPlayers = MatchFactory.currentPlayers

	let iFirstEmpty = -1
	for (let i = 0; i < currentPlayers.length; i++) {
		const currentPlayer = currentPlayers[i]
		const currentPlayerElement = elementPlayers[i]

		currentPlayerElement.textContent = currentPlayer || '-'
		if (currentPlayer) {
			currentPlayerElement.dataset.id = currentPlayer
		} else {
			delete currentPlayerElement.dataset.id
		}

		if (!currentPlayer && iFirstEmpty === -1) {
			currentPlayerElement.classList.add('highlight')
			iFirstEmpty = i
		} else {
			currentPlayerElement.classList.remove('highlight')
		}
	}
}

function updatePlayersPairedCount() {
	const elementPlayers = document.getElementById('player-list').children

	for (let i = 0; i < elementPlayers.length; i++) {
		const elementCurrentPlayer = elementPlayers[i]
		const elementPairCount = elementCurrentPlayer.querySelector('.count-pair')

		let mainPlayerId = null
		if (MatchFactory.team1.length === 1) {
			mainPlayerId = MatchFactory.team1[0]
		} else if (MatchFactory.team2.length === 1 && MatchFactory.team1.length !== 0) {
			mainPlayerId = MatchFactory.team2[0]
		}

		const comparePlayerId = elementCurrentPlayer.dataset.id
		const pairCount = _countMatchesPaired(mainPlayerId, comparePlayerId)

		if (pairCount > 0 && !MatchFactory.includesPlayer(comparePlayerId)) {
			elementPairCount.textContent = `Paired ${pairCount} time${pairCount === 1 ? '' : 's'} with ${mainPlayerId}`
			elementPairCount.classList.remove('hidden')
		} else {
			elementPairCount.textContent = ''
			elementPairCount.classList.add('hidden')
		}
	}
}

function sortPlayerList() {
	const players = db.getPlayerArray()
	for (let i = 1; i < players.length; i++) {
		const firstElement = players[i - 1].divPlayer
		const secondElement = players[i].divPlayer
		firstElement.after(secondElement)
	}
}

// ------------------------------- //
// UTILITY FUNCTIONS
// ------------------------------- //
function _countMatchesPaired(playerId1, playerId2) {
	if (playerId1 === playerId2) return 0

	let pairedCount = 0
	const dbMatches = db.getMatchArray()

	for (let i = 0; i < dbMatches.length; i++) {
		const currentMatch = dbMatches[i]
		if (currentMatch.arePlayersPaired(playerId1, playerId2)) pairedCount++
	}
	return pairedCount
}

export default {
	addPlayer,
	addMatch,
	loadPlayerList,
	reloadMatchList,
	togglePlayerHighlight,
	clearPlayerHighlight,
	toggleMatchDisabled,
	updateMatchQueue,
	updatePlayersPairedCount,
	sortPlayerList,
}
