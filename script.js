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
		const playerName = document.createElement('span')
		playerName.textContent = this.playerName

		const btn = document.createElement('button')
		btn.textContent = '×'

		const newPlayer = document.createElement('div')

		newPlayer.appendChild(playerName)
		newPlayer.appendChild(btn)
		newPlayer.classList.add('player')
		newPlayer.dataset.playerName = this.playerName
		return newPlayer
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

		const span = document.createElement('span')
		span.textContent = '+'

		const divTeam = document.createElement('div')
		divTeam.appendChild(divPlayer1)
		divTeam.appendChild(span)
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

function clickRemovePlayerFromMatch() {}
function clickAddMatch() {}
function clickRemoveMatch() {}

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
// TEST DATA
// ------------------------------- //

function populatePlayers() {
	for (let i = 0; i < 4; i++) {
		const newPlayer = new Player('Player ' + i)
		players.push(newPlayer)
	}
	for (let i = 0; i < players.length; i++) {
		divPlayerList.appendChild(players[i].createPlayerDOM())
	}
}

function populateMatches() {
	for (let i = 0; i < 4; i++) {
		const newMatch = new Match()
		newMatch.players = ['Player 1', 'Player 2', 'Player 3', 'Player 4']
		newMatch.matchID = matches.length
		matches.push(newMatch)
	}

	for (let i = 0; i < matches.length; i++) {
		divMatchList.prepend(matches[i].createMatchDOM())
	}
}

populatePlayers()
populateMatches()
