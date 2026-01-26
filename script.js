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

	registerMatch(matchID) {
		this.matchID = matchID
	}
}

// ------------------------------- //
// GLOBALS
// ------------------------------- //

const players = []
const matchPlayers = []
const tempMatch = new Match()

// ------------------------------- //
// STATIC ELEMENTS
// ------------------------------- //
const textInputAddPlayer = document.querySelector('#add-player > input')
const btnAddPlayer = document.querySelector('#add-player > button')

const divAddMatch = document.querySelector('#add-match')
const divAddMatchPlayer = document.querySelectorAll('.add-match-player')

// ------------------------------- //
// PLAYERS
// ------------------------------- //

for (let i = 0; i < 10; i++) {
	const newPlayer = new Player('Player ' + i)
	players.push(newPlayer)
}

const playerList = document.querySelector('#player-list')
function populatePlayers() {
	for (let i = 0; i < players.length; i++) {
		playerList.appendChild(players[i].createPlayerDOM())
	}
}

populatePlayers()

// EVENT LISTENERS
playerList.addEventListener('click', removePlayer)
playerList.addEventListener('click', addPlayerToMatch)
btnAddPlayer.addEventListener('click', addPlayer)

// CLICK FUNCTIONS
function addPlayer() {
	const newPlayerName = textInputAddPlayer.value

	// validate if player exist
	if (!players.some((player) => player.playerName === newPlayerName) && newPlayerName) {
		const newPlayer = new Player(newPlayerName)
		players.push(newPlayer)
		playerList.appendChild(newPlayer.createPlayerDOM())
		textInputAddPlayer.value = ''
	}
}

function removePlayer(e) {
	if (e.target.tagName !== 'BUTTON') return
	const playerNameToRemove = e.target.closest('[data-player-name]').dataset.playerName
	const playerObjIndex = players.findIndex((player) => player.playerName === playerNameToRemove)
	players.splice(playerObjIndex, 1)
	playerList.children[playerObjIndex].remove()
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

	// for (let i = 0; i < divAddMatchPlayer.length; i++) {
	// 	const currentPlayer = divAddMatchPlayer[i]
	// 	if (currentPlayer.dataset.playerName === playerToRemove) {
	// 		delete currentPlayer.dataset.playerName
	// 		currentPlayer.textContent = '-'

	// 		const indexPlayerToRemove = matchPlayers.findIndex((playerName) => playerName === playerToRemove)
	// 		matchPlayers.splice(indexPlayerToRemove, 1)
	// 		break
	// 	}
	// }
}
