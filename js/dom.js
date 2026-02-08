import db from './database.js'
import { Player } from './classes/Player.js'
import { Match, MatchFactory } from './classes/Match.js'
import animate from './animations.js'

function haptic() {
	const elementHaptic = document.getElementById('haptic')
	elementHaptic.click()
}

function addPlayer(newPlayerInstance) {
	const newPlayerElement = newPlayerInstance.divPlayer
	document.getElementById('player-list').append(newPlayerElement)
}

function addMatch(newMatch) {
	const elementMatchList = document.getElementById('match-list')
	const elementMatches = elementMatchList.children
	const elementNewMatch = newMatch.divMatch

	// animation
	animate.fadeFromAbove(elementNewMatch)
	elementMatchList.prepend(elementNewMatch)

	for (let i = 1; i < elementMatches.length; i++) {
		animate.moveDown(elementMatches[i])
	}
}

function loadPlayerList() {
	const elementPlayerList = document.getElementById('player-list')

	// update match queue
	const matchQueueArr = Array(4).fill(null)

	db.getPlayerArray().forEach((player) => {
		// update dom
		elementPlayerList.appendChild(player.divPlayer)
		if (player.queueIndex !== -1) matchQueueArr[player.queueIndex] = player.id
	})

	MatchFactory.setPlayerArray(matchQueueArr)
	updatePlayersPairedCount()
}

function loadMatchList() {
	const elementMatchList = document.getElementById('match-list')

	db.getMatchArray().forEach((match) => {
		elementMatchList.prepend(match.divMatch)
	})
}

function clearPlayerHighlight() {
	const elementPlayerList = document.getElementById('player-list')
	const elementPlayers = elementPlayerList.children
	for (let i = 0; i < elementPlayers.length; i++) {
		elementPlayers[i].classList.remove('highlight')
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

	const elementAddMatch = document.getElementById('add-match')
	if (MatchFactory.isFull) {
		elementAddMatch.classList.add('highlight')
	} else {
		elementAddMatch.classList.remove('highlight')
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

	const elementPlayerList = document.getElementById('player-list')
	players.forEach((player) => {
		player.divPlayer.remove()
		elementPlayerList.appendChild(player.divPlayer)
	})

	// for (let i = 1; i < players.length; i++) {
	// 	const firstElement = players[i - 1].divPlayer
	// 	const secondElement = players[i].divPlayer
	// 	firstElement.after(secondElement)
	// }
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
	loadMatchList,
	clearPlayerHighlight,
	updateMatchQueue,
	updatePlayersPairedCount,
	sortPlayerList,
	haptic,
}
