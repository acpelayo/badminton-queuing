import db from './database.js'

// ------------------------------- //
// STATIC ELEMENTS
// ------------------------------- //
const textInputAddPlayer = document.querySelector('#add-player > input')

const divAddMatch = document.querySelector('#add-match')
const divAddMatchPlayer = document.querySelectorAll('.add-match-player')
const btnAddMatch = document.querySelector('#add-match button')

const divPlayerList = document.querySelector('#player-list')
const divMatchList = document.querySelector('#match-list')

export function clickAddPlayer(e) {
	const textInputBox = e.target.previousElementSibling
	const newPlayerName = textInputBox.value.trim()
	if (!newPlayerName) return

	addPlayer(newPlayerName)

	textInputBox.value = ''
	textInputBox.focus()
}

function addPlayer(newPlayerName) {
	const newPlayer = db.addPlayer(newPlayerName)
	if (!newPlayer) return
	// matches.forEach((match) => {
	// 	if (match === null) return

	// 	if (match.includesPlayer(newPlayerName)) newPlayer.matches.push(match.matchID)
	// })
	// players.push(newPlayer)
	// divPlayerList.appendChild(newPlayer.createPlayerDOM())
	// textInputAddPlayer.value = ''

	// uploadToLocalStorage()
	// reloadPlayers()
	// textInputAddPlayer.focus()
}

export default { clickAddPlayer }
