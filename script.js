// ------------------------------- //
// CLASSES
// ------------------------------- //

class Player {
	constructor(playerName) {
		this.playerName = playerName
		this.matches = []
	}

	getMatchCount() {
		return this.matches.length
	}

	createPlayerDOM() {
		const spanPlayerName = document.createElement('span')
		const spanGameCount = document.createElement('span')
		const spanPairCount = document.createElement('span')
		const spanAgainstCount = document.createElement('span')

		spanPlayerName.classList.add('player-name')
		spanGameCount.classList.add('count-games')

		spanPairCount.classList.add('count-pair')
		spanPairCount.classList.add('hidden')
		spanAgainstCount.classList.add('count-against')
		spanAgainstCount.classList.add('hidden')

		spanPlayerName.textContent = this.playerName
		spanGameCount.textContent = `${this.matches.length} games played`

		spanPairCount.textContent = 'Paired X times with A'
		spanAgainstCount.textContent = 'Played Y times against B'

		const div1 = document.createElement('div')
		const div2 = document.createElement('div')

		div1.appendChild(spanPlayerName)
		div1.appendChild(spanGameCount)
		div2.appendChild(spanPairCount)
		div2.appendChild(spanAgainstCount)

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

		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === null) {
				iFirstNull = i
				break
			}
		}
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

	isPlayerPaired(playerName1, playerName2) {
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
		return [this.players[0], this.players[1]]
	}
	get team2() {
		return [this.players[2], this.players[3]]
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

	get indexEmptySlot() {
		for (let i = 0; i < this.players.length; i++) {
			if (this.players[i] === null) return i
		}

		return -1
	}
}

// ------------------------------- //
// GLOBALS
// ------------------------------- //

const players = []
const matches = []

let tempMatch = new Match()

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
divPlayerList.addEventListener('click', addPlayerToMatch)
btnAddPlayer.addEventListener('click', addPlayer)

// CLICK FUNCTIONS
function addPlayer() {
	const newPlayerName = textInputAddPlayer.value

	// validate if player exist
	if (!players.some((player) => player.playerName === newPlayerName) && newPlayerName) {
		const newPlayer = new Player(newPlayerName)
		players.push(newPlayer)
		divPlayerList.appendChild(newPlayer.createPlayerDOM())
		textInputAddPlayer.value = ''
	}
}

function removePlayer(e) {
	if (e.target.tagName !== 'BUTTON') return

	const divPlayer = e.target.closest('[data-player-name]')
	if (!divPlayer) return

	const playerNameToRemove = divPlayer.dataset.playerName
	const playerIndex = players.findIndex((player) => player === playerNameToRemove)

	players[playerIndex] = null
	divPlayer.remove()
}

function addPlayerToMatch(e) {
	if (e.target.tagName === 'BUTTON') return

	const playerNameToAdd = e.target.closest('[data-player-name]').dataset.playerName
	if (!playerNameToAdd) return

	const index = tempMatch.addPlayer(playerNameToAdd)
	if (index !== -1) {
		divAddMatchPlayer[index].textContent = playerNameToAdd
		divAddMatchPlayer[index].dataset.playerName = playerNameToAdd
	}
}

// ------------------------------- //
// MATCHES
// ------------------------------- //

// EVENT LISTENER
divAddMatch.addEventListener('click', removePlayerFromMatch)
btnAddMatch.addEventListener('click', addMatch)
divMatchList.addEventListener('click', removeMatch)

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
	}
}

function addMatch() {
	// check if players are complete
	if (!(tempMatch.indexEmptySlot === -1)) return

	tempMatch.matchID = matches.length

	matches.push(tempMatch)
	divMatchList.prepend(tempMatch.createMatchDOM())

	// update player database
	for (let i = 0; i < players.length; i++) {
		const currentPlayer = players[i]
		if (tempMatch.includesPlayer(currentPlayer.playerName)) {
			currentPlayer.matches.push(tempMatch.matchID)
		}
	}
	updatePlayersGameCount()

	// reset
	tempMatch = new Match()
	for (let i = 0; i < divAddMatchPlayer.length; i++) {
		divAddMatchPlayer[i].textContent = '-'
	}

	console.log(players)
}

function removeMatch(e) {
	if (e.target.tagName !== 'BUTTON') return

	const divMatch = e.target.closest('[data-match-id]')
	if (!divMatch) return

	const matchIDToRemove = divMatch.dataset.matchId
	const matchIndex = players.findIndex((player) => player === matchIDToRemove)

	matches[matchIndex] = null
	divMatch.remove()
}

// ------------------------------- //
// DOM UPDATE FUNCTIONS
// ------------------------------- //
function updatePlayersGameCount() {
	const divPlayers = divPlayerList.querySelectorAll('.player')
	for (let i = 0; i < divPlayers.length; i++) {
		const divCurrentPlayer = divPlayers[i]

		const playerName = divCurrentPlayer.dataset.playerName

		const playerObj = players.find((player) => player.playerName === playerName)

		if (playerObj) {
			const gameCount = playerObj.matches.length
			divCurrentPlayer.querySelector('.count-games').textContent = `${gameCount} game${gameCount === 1 ? '' : 's'} played`
		}
	}
}

// ------------------------------- //
// UTILITY FUNCTION
// ------------------------------- //
function countMatchesPaired(player1, player2) {
	let pairedCount = 0

	for (let i = 0; i < matches.length; i++) {
		const currentMatch = matches[i]
		if (currentMatch.isPlayerPaired(player1, player2)) pairedCount++
	}
	return pairedCount
}

// ------------------------------- //
// TEST DATA
// ------------------------------- //

function populatePlayers() {
	for (let i = 0; i < 5; i++) {
		textInputAddPlayer.value = 'Player ' + i
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

populatePlayers()
populateMatches()
