export class Player {
	constructor(playerName) {
		this.id = playerName
		this.matches = []
	}

	get matchCount() {
		return this.matches.length
	}

	addMatch(matchId) {
		this.matches.push(matchId)
	}

	deleteMatch(matchId) {
		this.matches = this.matches.filter((id) => id === matchId)
	}

	createPlayerElement() {
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
		spanPlayerName.textContent = this.id

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
		divNewPlayer.classList.add('player', 'pill')
		divNewPlayer.dataset.id = this.id
		return divNewPlayer
	}

	static fromJSON({ id, matches }) {
		const newPlayer = new Player()
		newPlayer.id = id
		newPlayer.matches = matches

		return newPlayer
	}
}

export class Match {
	constructor(players) {
		this.players = players
		this.id = Date.now()
		this.winner = null
	}

	includesPlayer(playerId) {
		return this.players.includes(playerId)
	}

	arePlayersPaired(playerId1, playerId2) {
		const isPairedInTeam1 = this.team1.includes(playerId1) && this.team1.includes(playerId2)
		const isPairedInTeam2 = this.team2.includes(playerId1) && this.team2.includes(playerId2)

		return isPairedInTeam1 || isPairedInTeam2
	}

	isPlayerAgainst(playerId1, playerId2) {
		const isAgainst1 = this.team1.includes(playerId1) && this.team2.includes(playerId2)
		const isAgainst2 = this.team1.includes(playerId2) && this.team2.includes(playerId1)

		return isAgainst1 || isAgainst2
	}

	get team1() {
		return [this.players[0], this.players[1]].filter((player) => player !== null)
	}
	get team2() {
		return [this.players[2], this.players[3]].filter((player) => player !== null)
	}

	#createTeamElement(team) {
		const spanPlayer1 = document.createElement('span')
		spanPlayer1.classList.add('match-player')
		spanPlayer1.textContent = team[0]

		const spanPlayer2 = spanPlayer1.cloneNode(true)
		spanPlayer2.textContent = team[1]

		const divTeam = document.createElement('div')
		divTeam.classList.add('team')
		divTeam.appendChild(spanPlayer1)
		divTeam.appendChild(spanPlayer2)

		return divTeam
	}

	createMatchElement() {
		const divTeam1 = this.#createTeamElement(this.team1)
		const divTeam2 = this.#createTeamElement(this.team2)

		const span = document.createElement('span')
		span.textContent = 'vs'

		const btn = document.createElement('button')
		btn.textContent = '×'

		const newMatch = document.createElement('div')
		newMatch.dataset.id = this.id
		newMatch.classList.add('match', 'pill')

		newMatch.appendChild(divTeam1)
		newMatch.appendChild(span)
		newMatch.appendChild(divTeam2)
		newMatch.appendChild(btn)

		return newMatch
	}

	static fromJSON({ players, id, winner }) {
		const newMatch = new Match(players)
		newMatch.id = id
		newMatch.winner = winner

		return newMatch
	}
}

export class MatchFactory {
	static currentPlayers = new Array(4).fill(null)

	static addPlayer(playerId) {
		let iFirstNull = -1
		let playerAlreadyExists = false

		// find first blank slot
		for (let i = 0; i < this.currentPlayers.length; i++) {
			if (this.currentPlayers[i] === null) {
				iFirstNull = i
				break
			}
		}

		// check if player is already in match
		for (let i = 0; i < this.currentPlayers.length; i++) {
			if (this.currentPlayers[i] === playerId) {
				playerAlreadyExists = true
				break
			}
		}

		if (iFirstNull !== -1 && !playerAlreadyExists) {
			this.currentPlayers[iFirstNull] = playerId
			return iFirstNull
		} else {
			return -1
		}
	}
	static removePlayer(playerId) {
		for (let i = 0; i < this.currentPlayers.length; i++) {
			if (this.currentPlayers[i] === playerId) {
				this.currentPlayers[i] = null
				return i
			}
		}

		return -1
	}
	static includesPlayer(playerId) {
		return this.currentPlayers.includes(playerId)
	}
	static createMatch() {
		// check if players are complete
		if (this.currentPlayers.includes(null)) return null
		const newMatch = new Match(this.currentPlayers)
		this.currentPlayers = new Array(4).fill(null)
		return newMatch
	}
	static get isFull() {
		return !MatchFactory.currentPlayers.includes(null)
	}
	static get team1() {
		return [this.currentPlayers[0], this.currentPlayers[1]].filter((player) => player !== null)
	}
	static get team2() {
		return [this.currentPlayers[2], this.currentPlayers[3]].filter((player) => player !== null)
	}
	static get iFirstEmptySlot() {
		for (let i = 0; i < this.currentPlayers.length; i++) {
			if (this.currentPlayers[i] === null) return i
		}

		return -1
	}
}
