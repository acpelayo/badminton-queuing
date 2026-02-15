import db from './database.js'
import dom from './dom.js'
import { Player } from './classes/Player.js'
import { Match, MatchFactory } from './classes/Match.js'
import utils from './utils.js'

// for tracking drag events
let isDragging = false
const DRAG_THRESHOLD_TIME = 500

function addPlayer(e) {
	if (e.type !== 'click' && e.key !== 'Enter') return

	let textIinputPlayerName = e.target
	if (e.type === 'click') {
		textIinputPlayerName = textIinputPlayerName.previousElementSibling
	}

	const newPlayerName = textIinputPlayerName.value.trim()
	if (!newPlayerName) return

	const newPlayerInstance = db.addPlayer(newPlayerName)

	// null is returned if player already exists
	if (newPlayerInstance === null) return

	dom.addPlayer(newPlayerInstance)
	dom.sortPlayerList()
	dom.haptic()

	textIinputPlayerName.value = ''
	textIinputPlayerName.focus()
}

function addMatch(e) {
	// check if players are complete
	if (!MatchFactory.isFull) return

	const newMatch = MatchFactory.createMatch()
	db.addMatch(newMatch)

	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
	dom.addMatch(newMatch)
	dom.sortPlayerList()
	dom.clearPlayerHighlight()
	dom.haptic()
}

function deletePlayer(e) {
	if (e.target.tagName !== 'BUTTON') return

	const elementPlayer = e.target.closest('.player')
	if (!elementPlayer) return

	const playerId = elementPlayer.dataset.id
	dom.haptic()
	function _onOk() {
		if (MatchFactory.includesPlayer(playerId)) MatchFactory.removePlayer(playerId)
		db.deletePlayer(playerId)

		dom.updateMatchQueue()
		dom.updatePlayersPairedCount()
		elementPlayer.remove()
		dom.haptic()
	}

	dom.showModal(`<span>Delete player&nbsp<b>${playerId}</b>?</span>`, _onOk)
}

function deleteMatch(e) {
	if (e.target.tagName !== 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return

	const matchId = +elementMatch.dataset.id
	const matchInstance = db.getMatch(matchId)
	const players = matchInstance.players
	dom.haptic()

	function _onOk() {
		db.deleteMatch(matchId)
		elementMatch.remove()

		dom.sortPlayerList()
		dom.updatePlayersPairedCount()
		dom.haptic()
	}
	const strMatchup = `<b>${players[0]} + ${players[1]}</b> vs <b> ${players[2]} + ${players[3]}</b>`
	dom.showModal(`Delete this match?<span>${strMatchup}</span>`, _onOk)
}

function deleteAllPlayers(e) {
	function _onOk() {
		MatchFactory.reset()

		db.deleteAllPlayers()

		dom.updateMatchQueue()
		dom.clearPlayerList()
		dom.haptic()
	}

	dom.showModal('<b>Delete all players?</b>', _onOk)
}

function deleteAllMatches(e) {
	function _onOk() {
		db.deleteAllMatches()

		dom.clearMatchList()
		dom.sortPlayerList()
		dom.updatePlayersPairedCount()
		dom.haptic()
	}

	dom.showModal('<b>Delete all matches?<b>', _onOk)
}

function clickPlayer(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementPlayer = e.target.closest('.player')
	if (!elementPlayer) return
	const playerId = elementPlayer.dataset.id
	if (!playerId) return

	const playerInstance = db.getPlayer(playerId)

	if (playerInstance.queueIndex === -1) {
		playerInstance.queueIndex = MatchFactory.addPlayer(playerId)
	} else {
		MatchFactory.removePlayer(playerId)
		playerInstance.queueIndex = -1
	}

	db.savePlayerDBtoLocalStorage()
	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
	dom.haptic()
}

function clickMatchQueue(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementPlayer = e.target.closest('.match-player')
	if (!elementPlayer) return
	const playerId = elementPlayer.dataset.id
	if (!playerId) return

	const playerInstance = db.getPlayer(playerId)

	MatchFactory.removePlayer(playerId)
	playerInstance.queueIndex = -1

	db.savePlayerDBtoLocalStorage()
	dom.updateMatchQueue()
	dom.updatePlayersPairedCount()
	dom.haptic()
}

function clickMatch(e) {
	if (isDragging) return
	if (e.target.tagName === 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return
	const matchId = +elementMatch.dataset.id
	if (!matchId) return

	const matchInstance = db.getMatch(matchId)
	matchInstance.winner = matchInstance.winner ? null : true

	db.saveMatchDBToLocalStorage()
	dom.haptic()
}

function matchPointerDown(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return

	let fromIndex
	let toIndex
	dom.haptic()

	const matchId = +elementMatch.dataset.id

	// initialize  variables
	fromIndex = db.getMatchArray().findIndex((match) => match.id === matchId)
	toIndex = fromIndex
	let dragStartY = e.clientY
	let offset = 0

	elementMatch.setPointerCapture(e.pointerId)

	function _matchPointerMove(pointerMoveEvent) {
		offset = Math.round(pointerMoveEvent.clientY - dragStartY)
		toIndex = dom.moveMatch(elementMatch, offset)
	}

	// this function will fire if 'pointerup' is not triggered within the threshold time
	const timeoutId = setTimeout(() => {
		isDragging = true

		dom.haptic()
		elementMatch.classList.add('is-dragging')
		elementMatch.addEventListener('pointermove', _matchPointerMove)
		elementMatch.addEventListener(
			'touchmove',
			(event) => {
				event.preventDefault()
			},
			{ once: true, passive: false },
		)
		elementMatch.style.zIndex = 1000
	}, DRAG_THRESHOLD_TIME)

	function _reset() {
		elementMatch.removeEventListener('pointermove', _matchPointerMove)
		elementMatch.classList.remove('is-dragging')

		clearTimeout(timeoutId)
		setTimeout(() => {
			isDragging = false
		}, 5)
		if (isDragging) {
			db.moveMatch(fromIndex, toIndex)

			offset = 70 * (fromIndex - toIndex)
			dom.moveMatch(elementMatch, offset)
			dom.sortPlayerList()
			setTimeout(() => {
				dom.clearMatchList()

				db.getMatchArray().forEach((match) => {
					match.divMatch.removeAttribute('style')
				})
				dom.loadMatchList()
			}, 250)
		}
	}
	elementMatch.addEventListener('pointerup', _reset, { once: true })
	elementMatch.addEventListener('pointercancel', _reset, { once: true })
}

export default {
	addPlayer,
	addMatch,
	deletePlayer,
	deleteMatch,
	deleteAllPlayers,
	deleteAllMatches,
	clickPlayer,
	clickMatch,
	clickMatchQueue,
	matchPointerDown,
}
