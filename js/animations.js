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

export default {
	fadeFromAbove,
	moveDown,
}
