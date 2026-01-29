export class Player {
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

export class Match {
	constructor() {
		this.players = new Array(4).fill(null)
		this.matchID = null
		this.winner = null
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
		divTeam.classList.add('team')
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
