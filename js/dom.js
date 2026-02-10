import db from './database.js'
import animate from './animations.js'
import utils from './utils.js'

import { Player } from './classes/Player.js'
import { Match, MatchFactory } from './classes/Match.js'

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
			// currentPlayerElement.classList.add('highlight')
			iFirstEmpty = i
		} else {
			// currentPlayerElement.classList.remove('highlight')
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
	const elementPlayers = Array.from(document.getElementById('player-list').children)

	// reset text content
	elementPlayers.forEach((player) => {
		player.querySelector('.count-pair').textContent = ''
	})

	// for players of incomplete team
	let mainPlayerId
	if (MatchFactory.team1.length === 1) {
		;[mainPlayerId] = MatchFactory.team1
	} else if (MatchFactory.team2.length === 1 && MatchFactory.team1.length !== 0) {
		;[mainPlayerId] = MatchFactory.team2
	}

	for (let i = 0; i < elementPlayers.length; i++) {
		const elementCurrentPlayer = elementPlayers[i]
		const comparePlayerId = elementCurrentPlayer.dataset.id
		const pairCount = _countMatchesPaired(mainPlayerId, comparePlayerId)

		if (pairCount > 0 && !MatchFactory.includesPlayer(comparePlayerId)) {
			const elementPairCount = elementCurrentPlayer.querySelector('.count-pair')
			elementPairCount.textContent = `Paired ${pairCount}x with ${mainPlayerId}`
		}
	}

	// for players of complete team1
	let playerId1, playerId2, pairCount
	if (MatchFactory.team1.length === 2) {
		;[playerId1, playerId2] = MatchFactory.team1
		pairCount = _countMatchesPaired(playerId1, playerId2)
	}

	if (pairCount > 0) {
		elementPlayers.forEach((player) => {
			const currentPlayerId = player.dataset.id
			if (currentPlayerId === playerId1 || currentPlayerId === playerId2) {
				const elementPairCount = player.querySelector('.count-pair')
				elementPairCount.textContent = `Paired ${pairCount}x with ${currentPlayerId === playerId1 ? playerId2 : playerId1}`
			}
		})
	}
	// for players of complete team2
	if (MatchFactory.team2.length === 2) {
		;[playerId1, playerId2] = MatchFactory.team2
		pairCount = _countMatchesPaired(playerId1, playerId2)
	}
	if (pairCount > 0) {
		elementPlayers.forEach((player) => {
			const currentPlayerId = player.dataset.id
			if (currentPlayerId === playerId1 || currentPlayerId === playerId2) {
				const elementPairCount = player.querySelector('.count-pair')
				elementPairCount.textContent = `Paired ${pairCount}x with ${currentPlayerId === playerId1 ? playerId2 : playerId1}`
			}
		})
	}

	//
}

function sortPlayerList() {
	const players = db.getPlayerArray()

	const elementPlayerList = document.getElementById('player-list')
	const elementPlayers = Array.from(elementPlayerList.children)

	if (players.length === 0) return
	const elementHeight = utils.getElementComputedHeight(elementPlayers[0])

	for (let i = 0; i < players.length; i++) {
		const player = players[i]

		const currentPlayerIndex = elementPlayers.findIndex((el) => el.dataset.id === player.id)
		const newPlayerIndex = players.findIndex((p) => p.id === player.id)

		const moveDistance = elementHeight * (newPlayerIndex - currentPlayerIndex)

		const playerElement = player.divPlayer
		playerElement.style.translate = `0 ${moveDistance}px`
	}

	const transitionDuration = 250
	setTimeout(() => {
		players.forEach((player) => {
			player.divPlayer.remove()
			player.divPlayer.removeAttribute('style')
			elementPlayerList.appendChild(player.divPlayer)
		})
	}, transitionDuration)
}

function moveMatch(elementMatch, moveDistance) {
	elementMatch.style.translate = `0 ${moveDistance}px`

	const elementMatches = Array.from(document.getElementById('match-list').children).reverse()

	const moveMatchRect = elementMatch.getBoundingClientRect()
	const moveMatchYCenter = moveMatchRect.bottom - moveMatchRect.height / 2
	const moveMatchIndex = elementMatches.findIndex((match) => match.dataset.id === elementMatch.dataset.id)

	const yDiffArr = elementMatches.map((match, i) => {
		if (i === moveMatchIndex) return null

		const rect = match.getBoundingClientRect()
		const yCenter = rect.bottom - rect.height / 2
		const yDiff = moveMatchYCenter - yCenter

		const matchComputedHeight = utils.getElementComputedHeight(match)

		if (yDiff > 0 && i < moveMatchIndex) {
			match.style.translate = `0 ${-matchComputedHeight}px`
		} else if (yDiff < 0 && i > moveMatchIndex) {
			match.style.translate = `0 ${matchComputedHeight}px`
		} else {
			match.removeAttribute('style')
		}

		return yDiff
	})

	let newIndex = yDiffArr.findIndex((yDiff) => yDiff > 0)
	if (newIndex > moveMatchIndex) newIndex = newIndex - 1
	else if (newIndex === -1) newIndex = elementMatches.length - 1

	return newIndex
}

function clearMatchList() {
	Array.from(document.getElementById('match-list').children).forEach((element) => element.remove())
}

function clearPlayerList() {
	Array.from(document.getElementById('player-list').children).forEach((element) => element.remove())
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
	moveMatch,
	clearPlayerList,
	clearMatchList,
}
