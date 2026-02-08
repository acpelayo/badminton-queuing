import db from './database.js'
import dom from './dom.js'
import { Player } from './classes/Player.js'
import { Match, MatchFactory } from './classes/Match.js'

// for tracking drag events
let isDragging = false
let dragStartY
let timePointerDown
const DRAG_THRESHOLD_TIME = 500

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
	dom.addMatch(newMatch)
	dom.sortPlayerList()
	dom.clearPlayerHighlight()
	dom.haptic()
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
	dom.haptic()
}

function deleteMatch(e) {
	if (e.target.tagName !== 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return

	const matchId = +elementMatch.dataset.id
	db.deleteMatch(matchId)
	elementMatch.remove()

	dom.sortPlayerList()
	dom.updatePlayersPairedCount()
	dom.haptic()
}

let fromIndex
let toIndex
function matchPointerDown(e) {
	if (e.target.tagName === 'BUTTON') return

	const elementMatch = e.target.closest('.match')
	if (!elementMatch) return

	const matchId = +elementMatch.dataset.id
	const matchInstance = db.getMatch(matchId)

	fromIndex = db.getMatchArray().findIndex((match) => match.id === matchId)
	toIndex = fromIndex

	elementMatch.setPointerCapture(e.pointerId)

	timePointerDown = Date.now()
	dragStartY = e.clientY

	const timeoutId = setTimeout(() => {
		isDragging = true

		elementMatch.classList.add('is-dragging')
		elementMatch.addEventListener('pointermove', _matchPointerMove)
		elementMatch.addEventListener(
			'touchmove',
			(event) => {
				event.preventDefault()
			},
			{ once: true, passive: false },
		)
	}, DRAG_THRESHOLD_TIME)

	function _reset() {
		elementMatch.removeEventListener('pointermove', _matchPointerMove)
		elementMatch.classList.remove('is-dragging')

		db.getMatchArray().forEach((match) => {
			match.divMatch.removeAttribute('style')
		})

		if (isDragging) {
			db.moveMatch(fromIndex, toIndex)
			Array.from(document.getElementById('match-list').children).forEach((child) => {
				child.remove()
			})
			dom.sortPlayerList()
			dom.loadMatchList()
		}

		clearTimeout(timeoutId)
		setTimeout(() => {
			isDragging = false
		}, 5)
	}
	elementMatch.addEventListener('pointerup', _reset, { once: true })
	elementMatch.addEventListener('pointercancel', _reset, { once: true })
}

function _matchPointerMove(e) {
	const elementMatch = e.target
	const offset = Math.round(e.clientY - dragStartY)
	elementMatch.style.translate = `0 ${offset}px`

	const elementMatches = db.getMatchArray().map((match) => match.divMatch)

	const moveMatchRect = elementMatch.getBoundingClientRect()
	const moveMatchYCenter = moveMatchRect.bottom - moveMatchRect.height / 2
	const moveMatchIndex = elementMatches.findIndex((match) => match.dataset.id === elementMatch.dataset.id)

	const yDiffArr = elementMatches.map((match, i) => {
		if (i === moveMatchIndex) return null

		const rect = match.getBoundingClientRect()
		const computedStyle = window.getComputedStyle(match)

		const yCenter = rect.bottom - rect.height / 2
		const yDiff = moveMatchYCenter - yCenter

		const moveDistance = rect.height + parseFloat(computedStyle.marginTop) + parseFloat(computedStyle.marginBottom)
		if (yDiff > 0 && i < moveMatchIndex) {
			match.style.translate = `0 ${-moveDistance}px`
		} else if (yDiff < 0 && i > moveMatchIndex) {
			match.style.translate = `0 ${moveDistance}px`
		} else {
			match.setAttribute('style', '')
		}

		return yDiff
	})

	toIndex = yDiffArr.findIndex((yDiff) => yDiff > 0)
	if (toIndex > fromIndex) toIndex = toIndex - 1
	toIndex = toIndex === -1 ? elementMatches.length - 1 : toIndex
}

export default {
	addPlayer,
	addMatch,
	deletePlayer,
	deleteMatch,
	clickPlayer,
	clickMatch,
	clickMatchQueue,
	matchPointerDown,
}
