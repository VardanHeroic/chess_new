import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Pawn extends Component {
	constructor(props) {
		super(props)
		this.x = this.props.x
		this.y = this.props.y
		this.isVictim = this.props.isVictim
	}

	findFreeCells(props) {
		let freeCells = []
		let moveDirections = []
		let attackDirections = []
		let attackedCells = []
		let isWhite = props.color === "white"
		let blockCell = props.matrix[this.props.x + (isWhite ? -1 : 1)][this.props.y].fig
		let pins = !isWhite ? props.pinsWhite : props.pinsBlack

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (cellX === this.props.x + (isWhite ? -1 : 1) && this.props.y === cellY) {
					moveDirections.push({ x: cell.x, y: cell.y })
				}
				if (cellX === this.props.x + (isWhite ? -2 : 2) && this.props.y === cellY && this.props.isStart && !blockCell) {
					moveDirections.push({ x: cell.x, y: cell.y })
				}
				if (cellX === this.props.x + (isWhite ? -1 : 1) && Math.abs(this.props.y - cellY) === 1) {
					attackDirections.push({ x: cell.x, y: cell.y })
				}
			})
		})

		this.props.matrix.forEach(row => {
			row.forEach(cell => {
				if (cell.fig?.name !== "Step") {
					if (
						!(cell.fig?.color === this.props.color) &&
						attackDirections.some(attackDirectionCell => attackDirectionCell.x === cell.x && attackDirectionCell.y === cell.y)
					) {
						attackedCells.push(cell)
					}
				}
			})
		})

		this.props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				props.checkRay.forEach(checkRayCell => {
					if (
						(moveDirections.some(movecell => movecell.x * 10 + movecell.y === cell.x * 10 + cell.y) &&
							(props.status !== "check" || checkRayCell.x * 10 + checkRayCell.y === cell.x * 10 + cell.y) &&
							(!cell.fig || cell.fig.name === "Step")) ||
						(cell.fig &&
							attackedCells.some(attackedCell => attackedCell.x * 10 + attackedCell.y === cell.x * 10 + cell.y) &&
							(props.status !== "check" || props.checkInitator.x * 10 + props.checkInitator.y === cell.x * 10 + cell.y))
					) {
						freeCells.push({ x: cell.x, y: cell.y })
					}
				})
			})
		})

		if (
			props.matrix?.[props.lastMove[0].x]?.[props.lastMove[0].y]?.fig.name === "Pawn" &&
			Math.abs(props.lastMove[0].x - props.lastMove[1].x) === 2 &&
			props.x === (isWhite ? 3 : 4) &&
			Math.abs(props.lastMove[0].y - props.y) === 1
		) {
			freeCells.push({ x: props.x + (isWhite ? -1 : 1), y: props.lastMove[0].y })
		}
		pins.forEach(pin => {
			if (pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)) {
				freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
			}
		})
		return { freeCells: freeCells, checkDirections: attackDirections }
	}

	componentDidMount() {
		if (!this.isVictim) {
			const { checkDirections } = this.findFreeCells(this.props)
			this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
			this.isVictim = false
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.pinScan) {
			const { freeCells } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, freeCells, "freeCells"])
		}
		if (this.props.current !== props.current || (this.props.status === "begin" && props.status === "none")) {
			const { checkDirections } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
		}
	}

	render() {
		return (
			<i className={this.props.color} role={"button"} onClick={() => this.props.move(this.props)}>
				o
			</i>
		)
	}
}

export default connect(
	state => ({
		chosen: state.matrixReducer.chosen,
		matrix: state.matrixReducer.value,
		current: state.matrixReducer.current,
		checkRay: state.matrixReducer.checkRay,
		status: state.matrixReducer.status,
		checkInitator: state.matrixReducer.checkInitator,
		pinsWhite: state.matrixReducer.pinsWhite,
		pinsBlack: state.matrixReducer.pinsBlack,
		pinScan: state.matrixReducer.pinScan,
		lastMove: state.matrixReducer.lastMove,
	}),
	dispatch => ({
		chooseFigure: fig => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: data => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		changeFigProps: data => dispatch(matrixActions.changeFigProps(data)),
	}),
)(Pawn)
