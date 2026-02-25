import db from './database.js'
import dom from './dom.js'
import handler from './event-handlers.js'

try {
	db.retrievePlayerDBFromLocalStorage()
	db.retrieveMatchDBFromLocalStorage()

	dom.loadPlayerList()
	dom.loadMatchList()
	dom.updateMatchQueue()

	const btnDeleteAllPlayers = document.getElementById('delete-all-players')
	const btnDeleteAllMatches = document.getElementById('delete-all-matches')

	btnDeleteAllPlayers.addEventListener('click', handler.deleteAllPlayers)
	btnDeleteAllMatches.addEventListener('click', handler.deleteAllMatches)

	const textInputAddPlayer = document.getElementById('player-name')
	const btnAddPlayer = document.querySelector('#add-player > button')
	const elementPlayerList = document.getElementById('player-list')

	btnAddPlayer.addEventListener('click', handler.addPlayer)
	textInputAddPlayer.addEventListener('keydown', handler.addPlayer)
	elementPlayerList.addEventListener('click', handler.deletePlayer)
	elementPlayerList.addEventListener('click', handler.clickPlayer)

	const btnAddMatch = document.querySelector('#add-match button')
	const elementAddMatch = document.getElementById('add-match')

	btnAddMatch.addEventListener('click', handler.addMatch)
	elementAddMatch.addEventListener('click', handler.clickMatchQueue)

	const elementMatchList = document.getElementById('match-list')

	elementMatchList.addEventListener('click', handler.deleteMatch)
	elementMatchList.addEventListener('click', handler.clickMatch)
	elementMatchList.addEventListener('pointerdown', handler.matchPointerDown)

	window.addEventListener('load', dom.hidePreloader)
} catch (err) {
	const strPlayerArr = JSON.stringify(db.getPlayerArray(), null, 2) + '\n' + localStorage.getItem('dbPlayer')
	const strMatchArr = JSON.stringify(db.getMatchArray(), null, 2) + '\n' + localStorage.getItem('dbMatch')

	document.getElementById('error-info').style.display = 'flex'
	document.getElementById('error-stack').append(`${err.name} ${err.stack}`)
	document.getElementById('error-player-array').append(strPlayerArr)
	document.getElementById('error-match-array').append(strMatchArr)

	document.getElementById('btn-reset-data').addEventListener('click', () => {
		dom.showModal(
			'Are you sure you want to delete all data?',
			() => {
				db.resetDatabase()
				location.reload()
			},
			'Delete',
		)
	})
}
