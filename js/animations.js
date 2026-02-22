function fadeFromAbove(element) {
	const duration = 500

	element.classList.add('animate-fade-from-above')
	setTimeout(() => {
		element.classList.remove('animate-fade-from-above')
	}, duration)
}

function fadeOutRight(element) {
	const duration = 500

	element.classList.add('animate-fade-out-right')
	setTimeout(() => {
		element.classList.remove('animate-fade-out-right')
	}, duration)
}

function moveDown(element) {
	const duration = 500

	element.classList.add('animate-move-down')
	setTimeout(() => {
		element.classList.remove('animate-move-down')
	}, duration)
}

function moveUp(element) {
	const duration = 500

	element.classList.add('animate-move-up')
	setTimeout(() => {
		element.classList.remove('animate-move-up')
	}, duration)
}

function hidePreloader(element) {
	const duration = 500
	element.classList.add('animate-hide-preloader')
	setTimeout(() => {
		element.classList.remove('animate-hide-preloader')
	}, duration)
}

export default {
	fadeFromAbove,
	fadeOutRight,
	moveDown,
	moveUp,
	hidePreloader,
}
