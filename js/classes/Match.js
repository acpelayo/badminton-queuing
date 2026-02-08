export class Match {
	#id = Date.now()
	#players = Array(4).fill(null)
	#winner = null
	#dom = {
		divMatch: null,
	}

	constructor(matchData) {
		this.#players = matchData.players || Array(4).fill(null)
		this.#id = matchData.id || Date.now()
		this.#winner = matchData.winner || null
	}

	get id() {
		return this.#id
	}
	get winner() {
		return this.#winner
	}
	get players() {
		return this.#players
	}
	get divMatch() {
		if (!this.#dom.divMatch) this.#createMatchElement()
		return this.#dom.divMatch
	}

	set winner(newVal) {
		this.#winner = newVal

		if (this.#dom.divMatch) {
			if (newVal === true) {
				this.#dom.divMatch.classList.add('disabled')
			} else {
				this.#dom.divMatch.classList.remove('disabled')
			}
		}
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

	#createMatchElement() {
		const divTeam1 = this.#createTeamElement(this.team1)
		const divTeam2 = this.#createTeamElement(this.team2)

		const span = document.createElement('span')
		span.textContent = 'vs'

		const btn = document.createElement('button')
		btn.textContent = '×'

		const divMatch = document.createElement('div')
		divMatch.dataset.id = this.id
		divMatch.classList.add('match', 'pill')
		if (this.winner) divMatch.classList.add('disabled')
		divMatch.appendChild(divTeam1)
		divMatch.appendChild(span)
		divMatch.appendChild(divTeam2)
		divMatch.appendChild(btn)

		this.#dom.divMatch = divMatch
	}

	toJSON() {
		return {
			id: this.#id,
			players: this.#players,
			winner: this.#winner,
		}
	}

	static fromJSON(matchJSON) {
		const newMatch = new Match(matchJSON)
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

		const newMatch = new Match({ players: this.currentPlayers })

		// reset
		this.currentPlayers = new Array(4).fill(null)

		return newMatch
	}
	static setPlayerArray(playerArr) {
		for (let i = 0; i < this.currentPlayers.length; i++) {
			this.currentPlayers[i] = playerArr[i] || null
		}
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
