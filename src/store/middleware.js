const componentActionTrackerMiddleware = store => next => action => {
	let matrix = store.getState().matrixReducer.value
	let chosen = store.getState().matrixReducer.chosen
	let lastFig = null
	let penultimateFig = null

	if (action.type === "matrixReducer/changeFigProps") {
		const [x, y, , property] = action.payload

		for (const row of matrix.toReversed()) {
			const filteredRow = row.filter(cell => cell.fig).toReversed()
			if (filteredRow.length > 0) {
				if (!lastFig) {
					lastFig = filteredRow[0].key
				}

				if (filteredRow.length > 1) {
					penultimateFig = filteredRow[filteredRow[0].key === lastFig ? 1 : 0].key
					break
				} else if (filteredRow[0].key !== lastFig) {
					penultimateFig = filteredRow[0].key
					break
				}
			}
		}

		if (property === "checkDirections" || property === "freeCells") {
			if (x * 10 + y === (chosen === lastFig ? penultimateFig : lastFig)) {
				console.log(x * 10 + y, property)
				next(action)
				store.dispatch({
					type: `matrixReducer/${property === "checkDirections" ? "calculateCheckDirections" : "findStaleMate"}`,
				})
			} else {
				console.log(x * 10 + y)
			}
		}
	}
	next(action)
}

export default componentActionTrackerMiddleware
