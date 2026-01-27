// ------------------------------- //
// CLASSES
// ------------------------------- //

// localStorage.removeItem('players')
// localStorage.removeItem('matches')

class Player {
	constructor(playerName) {
		this.playerName = playerName
		this.matches = []
	}

	get matchCount() {
		return this.matches.length
	}

	deleteMatch(matchID) {
		const i = this.matches.indexOf(matchID)
		if (i === -1) return
		this.matches.splice(i, 1)
	}

	createPlayerDOM() {
		const spanGameCount = document.createElement('span')
		const spanPlayerName = document.createElement('span')
		const spanPairCount = document.createElement('span')
		// const spanAgainstCount = document.createElement('span')

		spanGameCount.classList.add('count-games')
		spanPlayerName.classList.add('player-name')

		spanPairCount.classList.add('count-pair')
		// spanPairCount.classList.add('hidden')
		// spanAgainstCount.classList.add('count-against')
		// spanAgainstCount.classList.add('hidden')

		spanGameCount.textContent = this.matchCount
		spanPlayerName.textContent = this.playerName

		spanPairCount.textContent = ''
		// spanAgainstCount.textContent = ''

		const div1 = document.createElement('div')
		const div2 = document.createElement('div')

		div1.appendChild(spanGameCount)
		div1.appendChild(spanPlayerName)
		div2.appendChild(spanPairCount)
		// div2.appendChild(spanAgainstCount)

		const btn = document.createElement('button')
		btn.textContent = '×'

		const divNewPlayer = document.createElement('div')

		divNewPlayer.appendChild(div1)
		divNewPlayer.appendChild(div2)
		divNewPlayer.appendChild(btn)
		divNewPlayer.classList.add('player')
		divNewPlayer.dataset.playerName = this.playerName
		return divNewPlayer
	}
}

class Match {
	constructor() {
		this.players = new Array(4).fill(null)
		this.matchID = null
	}

	addPlayer(playerName) {
		let iFirstNull = -1
		let playerAlreadyExists = false

		// find first blank slot
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === null) {
				iFirstNull = i
				break
			}
		}

		// check if player is already in match
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === playerName) {
				playerAlreadyExists = true
				break
			}
		}

		if (iFirstNull != -1 && !playerAlreadyExists) {
			this.players[iFirstNull] = playerName
			return iFirstNull
		} else {
			return -1
		}
	}

	removePlayer(playerName) {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === playerName) {
				this.players[i] = null
				return i
			}
		}

		return -1
	}

	includesPlayer(playerName) {
		return this.players.includes(playerName)
	}

	arePlayersPaired(playerName1, playerName2) {
		const isPairedInTeam1 = this.team1.includes(playerName1) && this.team1.includes(playerName2)
		const isPairedInTeam2 = this.team2.includes(playerName1) && this.team2.includes(playerName2)

		return isPairedInTeam1 || isPairedInTeam2
	}

	isPlayerAgainst(playerName1, playerName2) {
		const isAgainst1 = this.team1.includes(playerName1) && this.team2.includes(playerName2)
		const isAgainst2 = this.team1.includes(playerName2) && this.team2.includes(playerName1)

		return isAgainst1 || isAgainst2
	}

	get team1() {
		return [this.players[0], this.players[1]].filter((player) => player !== null)
	}
	get team2() {
		return [this.players[2], this.players[3]].filter((player) => player !== null)
	}
	get iFirstEmptySlot() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === null) return i
		}

		return -1
	}

	#createTeamDOM(team) {
		const divPlayer1 = document.createElement('div')
		divPlayer1.classList.add('match-player')
		divPlayer1.textContent = team[0]

		const divPlayer2 = divPlayer1.cloneNode(true)
		divPlayer2.textContent = team[1]

		const divTeam = document.createElement('div')
		divTeam.appendChild(divPlayer1)
		divTeam.appendChild(divPlayer2)

		return divTeam
	}

	createMatchDOM() {
		const divTeam1 = this.#createTeamDOM(this.team1)
		const divTeam2 = this.#createTeamDOM(this.team2)

		const span = document.createElement('span')
		span.textContent = 'vs'

		const btn = document.createElement('button')
		btn.textContent = '×'

		const newMatch = document.createElement('div')
		newMatch.dataset.matchId = this.matchID
		newMatch.classList.add('match')

		newMatch.appendChild(divTeam1)
		newMatch.appendChild(span)
		newMatch.appendChild(divTeam2)
		newMatch.appendChild(btn)

		return newMatch
	}
}

// ------------------------------- //
// GLOBALS
// ------------------------------- //

// LOCAL STORAGE INIT
let storedPlayers = localStorage.getItem('players')
let storedMatches = localStorage.getItem('matches')

if (storedPlayers) {
	storedPlayers = JSON.parse(storedPlayers).map((player) => {
		if (player === null) return null

		newPlayer = new Player(player.playerName)
		newPlayer.matches = player.matches

		return newPlayer
	})
} else {
	storedPlayers = []
}
if (storedMatches) {
	storedMatches = JSON.parse(storedMatches).map((match) => {
		if (match === null) return null

		newMatch = new Match()
		newMatch.players = match.players
		newMatch.matchID = match.matchID

		return newMatch
	})
} else {
	storedMatches = []
}

const players = storedPlayers
const matches = storedMatches

let tempMatch = new Match()

// ------------------------------- //
// LOCAL STORAGE FUNCTIONS
// ------------------------------- //
function uploadToLocalStorage() {
	localStorage.setItem('players', JSON.stringify(players))
	localStorage.setItem('matches', JSON.stringify(matches))
}

// ------------------------------- //
// STATIC ELEMENTS
// ------------------------------- //
const textInputAddPlayer = document.querySelector('#add-player > input')
const btnAddPlayer = document.querySelector('#add-player > button')

const divAddMatch = document.querySelector('#add-match')
const divAddMatchPlayer = document.querySelectorAll('.add-match-player')
const btnAddMatch = document.querySelector('#add-match button')

const divPlayerList = document.querySelector('#player-list')
const divMatchList = document.querySelector('#match-list')

// ------------------------------- //
// PLAYERS
// ------------------------------- //

// EVENT LISTENERS
divPlayerList.addEventListener('click', removePlayer)
divPlayerList.addEventListener('click', togglePlayerFromMatch)
btnAddPlayer.addEventListener('click', addPlayer)

// CLICK FUNCTIONS
function addPlayer() {
	const newPlayerName = textInputAddPlayer.value.trim()

	// validate if player exist
	if (
		players.find((player) => {
			if (player === null) return null
			return player.playerName === newPlayerName
		}) ||
		!newPlayerName
	)
		return

	const newPlayer = new Player(newPlayerName)
	matches.forEach((match) => {
		if (match === null) return

		if (match.includesPlayer(newPlayerName)) newPlayer.matches.push(match.matchID)
	})
	players.push(newPlayer)
	divPlayerList.appendChild(newPlayer.createPlayerDOM())
	textInputAddPlayer.value = ''

	uploadToLocalStorage()
	reloadPlayers()
	textInputAddPlayer.focus()
}

function removePlayer(e) {
	if (e.target.tagName !== 'BUTTON') return

	const divPlayer = e.target.closest('[data-player-name]')
	if (!divPlayer) return

	const playerNameToRemove = divPlayer.dataset.playerName
	const playerIndex = players.findIndex((player) => {
		if (player === null) return null
		return player.playerName === playerNameToRemove
	})

	players[playerIndex] = null
	divPlayer.remove()

	uploadToLocalStorage()
}

function togglePlayerFromMatch(e) {
	if (e.target.tagName === 'BUTTON') return

	const divPlayer = e.target.closest('.player')
	const playerName = divPlayer.dataset.playerName
	if (!playerName) return

	let index = -1

	if (divPlayer.classList.contains('selected')) {
		index = tempMatch.removePlayer(playerName)
		if (index === -1) return

		divPlayer.classList.remove('selected')
		divAddMatchPlayer[index].textContent = '-'
		delete divAddMatchPlayer[index].dataset.playerName
	} else {
		index = tempMatch.addPlayer(playerName)
		if (index === -1) return

		divPlayer.classList.add('selected')
		divAddMatchPlayer[index].textContent = playerName
		divAddMatchPlayer[index].dataset.playerName = playerName
	}

	updatePlayersPairedCount()
	highlightNextEmptyPlayerSlot()
}

// ------------------------------- //
// MATCHES
// ------------------------------- //

// EVENT LISTENER
divAddMatch.addEventListener('click', removePlayerFromMatch)
btnAddMatch.addEventListener('click', addMatch)
textInputAddPlayer.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') addPlayer()
})
divMatchList.addEventListener('click', deleteMatch)

// CLICK EVENTS
function removePlayerFromMatch(e) {
	const targetPlayer = e.target.closest('[data-player-name]')
	if (!targetPlayer) return

	const playerToRemove = targetPlayer.dataset.playerName
	if (!playerToRemove) return

	const index = tempMatch.removePlayer(playerToRemove)
	if (index !== -1) {
		const currentPlayer = divAddMatchPlayer[index]
		delete currentPlayer.dataset.playerName
		currentPlayer.textContent = '-'

		const divPlayers = divPlayerList.querySelectorAll('.player')
		for (let i = 0; i < divPlayers.length; i++) {
			if (divPlayers[i].dataset.playerName === playerToRemove) {
				divPlayers[i].classList.remove('selected')
			}
		}
	}

	updatePlayersPairedCount()
	highlightNextEmptyPlayerSlot()
}

function addMatch() {
	// check if players are complete
	if (!(tempMatch.iFirstEmptySlot === -1)) return

	tempMatch.matchID = matches.length

	matches.push(tempMatch)
	divMatchList.prepend(tempMatch.createMatchDOM())

	// update player database
	for (let i = 0; i < players.length; i++) {
		const currentPlayer = players[i]
		if (currentPlayer === null) continue
		if (tempMatch.includesPlayer(currentPlayer.playerName)) {
			currentPlayer.matches.push(tempMatch.matchID)
		}
	}

	updatePlayersGameCount()
	uploadToLocalStorage()
	reloadPlayers()

	// reset
	tempMatch = new Match()
	for (let i = 0; i < divAddMatchPlayer.length; i++) {
		divAddMatchPlayer[i].textContent = '-'
	}
	const divPlayers = divPlayerList.querySelectorAll('.player')
	for (let i = 0; i < divPlayers.length; i++) {
		divPlayers[i].classList.remove('selected')
	}
}

function deleteMatch(e) {
	if (e.target.tagName !== 'BUTTON') return

	const divMatch = e.target.closest('.match')
	if (!divMatch) return

	const matchIDToRemove = +divMatch.dataset.matchId

	matches[matchIDToRemove] = null
	divMatch.remove()

	// update players database
	players.forEach((player) => {
		if (player) player.deleteMatch(matchIDToRemove)
	})

	uploadToLocalStorage()
	updatePlayersGameCount()
}

// ------------------------------- //
// DOM UPDATE FUNCTIONS
// ------------------------------- //
function updatePlayersGameCount() {
	const divPlayers = divPlayerList.querySelectorAll('.player')
	for (let i = 0; i < divPlayers.length; i++) {
		const divCurrentPlayer = divPlayers[i]

		const playerName = divCurrentPlayer.dataset.playerName

		const playerObj = players.find((player) => {
			if (player === null) return null
			return player.playerName === playerName
		})

		if (playerObj) {
			divCurrentPlayer.querySelector('.count-games').textContent = playerObj.matchCount
		}
	}
}

function updatePlayersPairedCount() {
	const divPlayers = divPlayerList.querySelectorAll('.player')

	const iFirstEmptySlot = tempMatch.iFirstEmptySlot

	divPlayers.forEach((divPlayer) => {
		const spanCurrentPairCount = divPlayer.querySelector('.count-pair')

		let mainPlayer = null
		if (tempMatch.team1.length === 1) {
			mainPlayer = tempMatch.team1[0]
		} else if (tempMatch.team2.length === 1) {
			mainPlayer = tempMatch.team2[0]
		}

		const comparePlayer = divPlayer.dataset.playerName
		const pairCount = countMatchesPaired(mainPlayer, comparePlayer)

		if (pairCount > 0 && !tempMatch.includesPlayer(comparePlayer)) {
			spanCurrentPairCount.textContent = `Paired ${pairCount} time${pairCount === 1 ? '' : 's'} with ${mainPlayer}`
			spanCurrentPairCount.classList.remove('hidden')
		} else {
			spanCurrentPairCount.textContent = ''
			spanCurrentPairCount.classList.add('hidden')
		}
	})
}

function updatePlayersAgainstCount(mainPlayer) {}

function highlightNextEmptyPlayerSlot() {
	const iEmpty = tempMatch.iFirstEmptySlot

	for (let i = 0; i < divAddMatchPlayer.length; i++) {
		if (iEmpty === i) divAddMatchPlayer[i].classList.add('highlight')
		else divAddMatchPlayer[i].classList.remove('highlight')
	}
}
highlightNextEmptyPlayerSlot()

function reloadPlayers() {
	const divPlayers = divPlayerList.querySelectorAll('.player')
	divPlayers.forEach((player) => player.remove())

	const sortedPlayers = players.sort((p1, p2) => {
		if (p1 === null || p2 === null) return 0

		const result1 = p1.matchCount - p2.matchCount

		if (result1 !== 0) return result1

		return p1.playerName.localeCompare(p2.playerName)
	})

	sortedPlayers.forEach((player) => {
		if (player === null) return
		divPlayerList.appendChild(player.createPlayerDOM())
	})
}
reloadPlayers()

function reloadMatches() {
	const divMatches = divMatchList.querySelectorAll('.match')
	divMatches.forEach((match) => match.remove())

	matches.forEach((match) => {
		if (match === null) return
		divMatchList.prepend(match.createMatchDOM())
	})
}
reloadMatches()

// ------------------------------- //
// UTILITY FUNCTIONS
// ------------------------------- //
function countMatchesPaired(player1, player2) {
	if (player1 === player2) return 0

	let pairedCount = 0

	for (let i = 0; i < matches.length; i++) {
		const currentMatch = matches[i]
		if (currentMatch === null) continue
		if (currentMatch.arePlayersPaired(player1, player2)) pairedCount++
	}
	return pairedCount
}

// ------------------------------- //
// TEST DATA
// ------------------------------- //

function populatePlayers() {
	for (let i = 0; i < 5; i++) {
		textInputAddPlayer.value = String.fromCharCode(i + 65).repeat(10)
		btnAddPlayer.click()
	}
}

function populateMatches() {
	for (let i = 0; i < 5; i++) {
		const divPlayers = divPlayerList.querySelectorAll('.player')

		divPlayers[0].click()
		divPlayers[1].click()
		divPlayers[2].click()
		divPlayers[3].click()

		btnAddMatch.click()
	}
}

document.activeElement.blur()
