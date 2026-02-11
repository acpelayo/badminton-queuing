function fadeFromAbove(element) {
	const duration = 500

	element.classList.add('animate-fade-from-above')
	setTimeout(() => {
		element.classList.remove('animate-fade-from-above')
	}, duration)
}

function moveDown(element) {
	const duration = 500

	element.classList.add('animate-move-down')
	setTimeout(() => {
		element.classList.remove('animate-move-down')
	}, duration)
}

function fadeAwayLeft(element) {
	const duration = 500

	element.classList.add('animate-fade-away-left')
	setTimeout(() => {
		element.classList.remove('animate-fade-away-left')
	}, duration)
}

function moveUp(element) {
	const duration = 500

	element.classList.add('animate-move-up')
	setTimeout(() => {
		element.classList.remove('animate-move-up')
	}, duration)
}

export default {
	fadeFromAbove,
	fadeAwayLeft,
	moveDown,
	moveUp,
}
