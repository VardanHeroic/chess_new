import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Pawn extends Component {
	constructor(props) {
		super(props)
		this.x = this.props.x
		this.y = this.props.y
		this.cells = this.findFreeCells(this.props)
		this.isVictim = this.props.isVictim
	}

	componentDidMount() {
		if (!this.isVictim) {
			this.cells = this.findFreeCells(this.props)
			this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, "checkDirections"])
			this.isVictim = false
		}
	}

	findFreeCells(props) {
		let freeCells = []
		let moveDirections = []
		let blockCells = []
		let attackDirections = []
		let attackedCells = []
		let blockXmin = -1
		let blockXmax = 8
		let blockYmin = -1
		let blockYmax = 8
		let isWhite = props.color === "white"
		let pins = !isWhite ? props.pinsWhite : props.pinsBlack

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (cellX === this.props.x + (isWhite ? -1 : 1) && this.props.y === cellY) {
					moveDirections.push({ x: cell.x, y: cell.y })
				}
				if (cellX === this.props.x + (isWhite ? -2 : 2) && this.props.y === cellY && this.props.isStart) {
					moveDirections.push({ x: cell.x, y: cell.y })
				}
				if (cellX === this.props.x + (isWhite ? -1 : 1) && Math.abs(this.props.y - cellY) === 1) {
					attackDirections.push({ x: cell.x, y: cell.y })
				}

				if (moveDirections.some(movecell => movecell.x * 10 + movecell.y === cell.x * 10 + cell.y)) {
					if (cell.fig && cell.fig.name !== "Step") {
						blockCells.push(cell)
					}
					blockCells.forEach(cell => {
						if (blockXmin < cell.x && cell.x < this.props.x) {
							blockXmin = cell.x - 1
						}
						if (blockXmax > cell.x && cell.x > this.props.x) {
							blockXmax = cell.x + 1
						}
						if (blockYmin < cell.y && cell.y < this.props.y) {
							blockYmin = cell.y - 1
						}
						if (blockYmax > cell.y && cell.y > this.props.y) {
							blockYmax = cell.y + 1
						}
					})
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
						((moveDirections.some(movecell => movecell.x * 10 + movecell.y === cell.x * 10 + cell.y) &&
							(props.status !== "check" || checkRayCell.x * 10 + checkRayCell.y === cell.x * 10 + cell.y) &&
							(!cell.fig || cell.fig.name === "Step")) ||
							(cell.fig &&
								attackedCells.some(attackedCell => attackedCell.x * 10 + attackedCell.y === cell.x * 10 + cell.y) &&
								(props.status !== "check" ||
									props.checkInitator.x * 10 + props.checkInitator.y === cell.x * 10 + cell.y))) &&
						cellX > blockXmin &&
						cellX < blockXmax &&
						cellY > blockYmin &&
						cellY < blockYmax
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

	UNSAFE_componentWillReceiveProps(props) {
		if (props.pinScan) {
			this.cells = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, this.cells.freeCells, "freeCells"])
		}
		if (this.props.current !== props.current) {
			this.cells = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, "checkDirections"])
		}
	}

	render() {
		let newProps = { ...this.props }
		newProps.checkDirections = this.cells.checkDirections
		newProps.freeCells = this.cells.freeCells
		return (
			<i className={this.props.color} role={"button"} onClick={() => this.props.move(newProps)}>
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
