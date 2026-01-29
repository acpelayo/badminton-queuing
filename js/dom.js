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

export default {}
