export class Player {
	#id
	#matches = []
	#lastConsecutiveMatchesCount = 0
	#matchesSinceLastMatch = -1
	#queueIndex = -1
	#dom = {
		divPlayer: null,
		spanGameCount: null,
		spanPreviousMatches: null,
		spanPairCount: null,
	}

	constructor(playerData) {
		if (typeof playerData === 'object') {
			this.#id = playerData.id || Date.now()
			this.#matches = playerData.matches || []
			this.#lastConsecutiveMatchesCount = playerData.lastConsecutiveMatchesCount !== undefined ? playerData.lastConsecutiveMatchesCount : 0
			this.#matchesSinceLastMatch = playerData.matchesSinceLastMatch !== undefined ? playerData.matchesSinceLastMatch : -1
			this.#queueIndex = playerData.queueIndex !== undefined ? playerData.queueIndex : -1
			return
		}
		this.#id = playerData
	}

	get matchCount() {
		return this.matches.length
	}
	get id() {
		return this.#id
	}
	get matches() {
		return this.#matches
	}
	get lastConsecutiveMatchesCount() {
		return this.#lastConsecutiveMatchesCount
	}
	get matchesSinceLastMatch() {
		return this.#matchesSinceLastMatch
	}
	get queueIndex() {
		return this.#queueIndex
	}
	get divPlayer() {
		if (!this.#dom.divPlayer) this.#createPlayerElement()
		return this.#dom.divPlayer
	}

	set lastConsecutiveMatchesCount(newCount) {
		this.#lastConsecutiveMatchesCount = newCount
	}

	set matchesSinceLastMatch(newCount) {
		this.#matchesSinceLastMatch = newCount

		const span = this.#dom.spanPreviousMatches || null
		if (!span) return

		span.classList.remove('bold', 'highlight')
		span.textContent = ''
		if (newCount > 0) return

		if (this.lastConsecutiveMatchesCount === 1) {
			span.textContent = 'Played last game'
		} else if (this.lastConsecutiveMatchesCount > 1) {
			span.textContent = `Played last ${this.lastConsecutiveMatchesCount} games`

			if (this.lastConsecutiveMatchesCount > 1) span.classList.add('bold')
			if (this.lastConsecutiveMatchesCount > 2) span.classList.add('highlight')
		}
	}
	set queueIndex(newQueueIndex) {
		if (newQueueIndex < 0 || newQueueIndex > 3) this.#queueIndex = -1
		else this.#queueIndex = newQueueIndex

		if (!this.#dom.divPlayer) return
		if (this.#queueIndex === -1) {
			this.#dom.divPlayer.classList.remove('highlight')
		} else {
			this.#dom.divPlayer.classList.add('highlight')
		}
	}

	addMatch(...matchId) {
		this.#matches = [...this.#matches, ...matchId]

		if (this.#dom.spanGameCount !== null) {
			this.#dom.spanGameCount.textContent = this.#matches.length
		}
	}

	deleteMatch(matchId) {
		this.#matches = this.#matches.filter((id) => id !== matchId)

		if (this.#dom.spanGameCount !== null) {
			this.#dom.spanGameCount.textContent = this.#matches.length
		}
	}

	#createPlayerElement() {
		const spanGameCount = document.createElement('span')
		const spanPlayerName = document.createElement('span')
		const spanPreviousMatches = document.createElement('span')
		const spanPairCount = document.createElement('span')

		spanGameCount.classList.add('count-games')
		spanPlayerName.classList.add('player-name')
		spanPreviousMatches.classList.add('previous-matches')

		spanPairCount.classList.add('count-pair')

		spanGameCount.textContent = this.matchCount
		spanPlayerName.textContent = this.id

		if (this.matchesSinceLastMatch === 0) {
			if (this.lastConsecutiveMatchesCount === 1) {
				spanPreviousMatches.textContent = 'Played last game'
			} else if (this.lastConsecutiveMatchesCount > 1) {
				spanPreviousMatches.textContent = `Played last ${this.lastConsecutiveMatchesCount} games`

				if (this.lastConsecutiveMatchesCount > 1) spanPreviousMatches.classList.add('bold')
				if (this.lastConsecutiveMatchesCount > 2) spanPreviousMatches.classList.add('highlight')
			}
		}

		spanPairCount.textContent = ''

		const div1 = document.createElement('div')
		const div2 = document.createElement('div')

		div1.appendChild(spanGameCount)
		div1.appendChild(spanPlayerName)
		div1.appendChild(spanPreviousMatches)
		div2.appendChild(spanPairCount)

		const btn = document.createElement('button')
		btn.textContent = '×'

		const divNewPlayer = document.createElement('div')

		divNewPlayer.appendChild(div1)
		divNewPlayer.appendChild(div2)
		divNewPlayer.appendChild(btn)
		divNewPlayer.classList.add('player', 'pill')
		divNewPlayer.dataset.id = this.id

		if (this.#queueIndex !== -1) divNewPlayer.classList.add('highlight')

		this.#dom.spanGameCount = spanGameCount
		this.#dom.spanPreviousMatches = spanPreviousMatches
		this.#dom.spanPairCount = spanPairCount
		this.#dom.divPlayer = divNewPlayer
	}

	toJSON() {
		return {
			id: this.#id,
			matches: this.#matches,
			lastConsecutiveMatchesCount: this.#lastConsecutiveMatchesCount,
			matchesSinceLastMatch: this.#matchesSinceLastMatch,
			queueIndex: this.#queueIndex,
		}
	}

	static fromJSON(playerJSON) {
		return new Player(playerJSON)
	}
}
