function getElementComputedHeight(element) {
	const rect = element.getBoundingClientRect()
	const computedStyle = window.getComputedStyle(element)

	const elementComputedHeight = rect.height + parseFloat(computedStyle.marginTop) + parseFloat(computedStyle.marginBottom)
	return elementComputedHeight
}

export default {
	getElementComputedHeight,
}
