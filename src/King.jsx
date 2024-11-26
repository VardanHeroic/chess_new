import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class King extends Component {
	constructor(props) {
		super(props)
		this.x = this.props.x
		this.y = this.props.y
	}

	findFreeCells(props) {
		let freeCells = []
		let directions = []
		let pseudoDirections = [
			{ x: props.x - 1, y: props.y - 1 },
			{ x: props.x - 1, y: props.y },
			{ x: props.x - 1, y: props.y + 1 },
			{ x: props.x, y: props.y - 1 },
			{ x: props.x, y: props.y + 1 },
			{ x: props.x + 1, y: props.y - 1 },
			{ x: props.x + 1, y: props.y },
			{ x: props.x + 1, y: props.y + 1 },
		]
		let attackedCells = []
		let line = props.color === "white" ? 7 : 0

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				pseudoDirections.forEach(cord => {
					if (cord.x === cellX && cord.y === cellY) {
						directions.push({ x: cell.x, y: cell.y })
					}
				})
			})
		})

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (
					!(cell.fig?.color === props.color) &&
					directions.some(directionCell => directionCell.x * 10 + directionCell.y === cell.x * 10 + cell.y)
				) {
					attackedCells.push(cell)
				}
			})
		})

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (
					directions.some(directionCell => directionCell.x * 10 + directionCell.y === cell.x * 10 + cell.y) &&
					(!cell.fig || attackedCells.includes(cell))
				) {
					freeCells.push({ x: cell.x, y: cell.y })
				}
			})
		})

		if (props.status !== "check" && props.untouched && props.matrix[line][7].fig?.untouched) {
			if (props.matrix[0][1].fig === null && props.matrix[0][2].fig === null && props.matrix[0][3].fig === null) {
				freeCells.push({ x: line, y: 2 })
			}
			if (props.matrix[0][6].fig === null && props.matrix[0][5].fig === null) {
				freeCells.push({ x: line, y: 6 })
			}
		}

		if (props.color === "white") {
			props.checkDirectionsBlack.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.x * 10 + cell.y !== checkCell.x * 10 + checkCell.y)
			})
		}
		if (props.color === "black") {
			props.checkDirectionsWhite.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.x * 10 + cell.y !== checkCell.x * 10 + checkCell.y)
			})
		}

		return { freeCells: freeCells, checkDirections: directions }
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.current !== props.current || (this.props.status === "begin" && props.status === "none")) {
			const { checkDirections } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
		}
		if (props.pinScan) {
			const { freeCells } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, freeCells, "freeCells"])
		}
	}

	componentDidMount() {
		const { checkDirections } = this.findFreeCells(this.props)
		this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
	}

	render() {
		return (
			<i className={this.props.color} onClick={() => this.props.move(this.props)} role={"button"}>
				l
			</i>
		)
	}
}

export default connect(
	state => ({
		chosen: state.matrixReducer.chosen,
		matrix: state.matrixReducer.value,
		current: state.matrixReducer.current,
		checkDirectionsWhite: state.matrixReducer.checkDirectionsWhite,
		checkDirectionsBlack: state.matrixReducer.checkDirectionsBlack,
		pinScan: state.matrixReducer.pinScan,
		status: state.matrixReducer.status,
	}),
	dispatch => ({
		chooseFigure: fig => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: data => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		changeFigProps: data => dispatch(matrixActions.changeFigProps(data)),
	}),
)(King)
