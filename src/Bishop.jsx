import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Bishop extends Component {
	constructor(props) {
		super(props)
		this.x = this.props.x
		this.y = this.props.y
		this.isVictim = this.props.isVictim
	}

	findFreeCells(props) {
		let pins = props.color === "black" ? props.pinsWhite : props.pinsBlack
		let freeCells = []
		let directions = []
		let blockCells = []
		let checkBlockCells = []
		let attackedCells = []
		let checkDirections = []
		let blockTL = { x: -1, y: -1 }
		let blockTR = { x: -1, y: 8 }
		let blockBL = { x: 8, y: -1 }
		let blockBR = { x: 8, y: 8 }
		let checkBlockTL = { x: -1, y: -1 }
		let checkBlockTR = { x: -1, y: 8 }
		let checkBlockBL = { x: 8, y: -1 }
		let checkBlockBR = { x: 8, y: 8 }
		let pinBlockTL = { x: -1, y: -1 }
		let pinBlockTR = { x: -1, y: 8 }
		let pinBlockBL = { x: 8, y: -1 }
		let pinBlockBR = { x: 8, y: 8 }
		let checkRayTL = []
		let checkRayTR = []
		let checkRayBL = []
		let checkRayBR = []
		let pinRayTL = []
		let pinRayTR = []
		let pinRayBL = []
		let pinRayBR = []
		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (Math.abs(props.y - cellY) === Math.abs(props.x - cellX) && props.y !== cellY && props.x !== cellX) {
					directions.push(cell)
					if (cell.fig && cell.fig.name !== "Step") {
						blockCells.push(cell)
						if (cell.fig.name !== "King" || cell.fig.color === props.color) {
							checkBlockCells.push(cell)
						}
					}
				}
			})
		})

		blockCells.forEach(cell => {
			if (cell.x < props.x && cell.y < props.y) {
				blockTL.x = Math.max(cell.x, blockTL.x)
				blockTL.y = Math.max(cell.y, blockTL.y)
			}
			if (cell.x > props.x && cell.y > props.y) {
				blockBR.x = Math.min(cell.x, blockBR.x)
				blockBR.y = Math.min(cell.y, blockBR.y)
			}
			if (cell.x < props.x && cell.y > props.y) {
				blockTR.x = Math.max(cell.x, blockTR.x)
				blockTR.y = Math.min(cell.y, blockTR.y)
			}
			if (cell.x > props.x && cell.y < props.y) {
				blockBL.x = Math.min(cell.x, blockBL.x)
				blockBL.y = Math.max(cell.y, blockBL.y)
			}
		})

		blockCells.forEach(cell => {
			if (cell.x < props.x && cell.y < props.y && cell.x !== blockTL.x && cell.y !== blockTL.y) {
				pinBlockTL.x = Math.max(cell.x, pinBlockTL.x)
				pinBlockTL.y = Math.max(cell.y, pinBlockTL.y)
			}
			if (cell.x > props.x && cell.y > props.y && cell.x !== blockBR.x && cell.y !== blockBR.y) {
				pinBlockBR.x = Math.min(cell.x, pinBlockBR.x)
				pinBlockBR.y = Math.min(cell.y, pinBlockBR.y)
			}
			if (cell.x < props.x && cell.y > props.y && cell.x !== blockTR.x && cell.y !== blockTR.y) {
				pinBlockTR.x = Math.max(cell.x, pinBlockTR.x)
				pinBlockTR.y = Math.min(cell.y, pinBlockTR.y)
			}
			if (cell.x > props.x && cell.y < props.y && cell.x !== blockBL.x && cell.y !== blockBL.y) {
				pinBlockBL.x = Math.min(cell.x, pinBlockBL.x)
				pinBlockBL.y = Math.max(cell.y, pinBlockBL.y)
			}
		})

		if (props.matrix[blockTL.x]?.[blockTL.y]?.fig?.color === props.color) {
			pinBlockTL = blockTL
		}
		if (props.matrix[blockBR.x]?.[blockBR.y]?.fig?.color === props.color) {
			pinBlockBR = blockBR
		}
		if (props.matrix[blockBL.x]?.[blockBL.y]?.fig?.color === props.color) {
			pinBlockBL = blockBL
		}
		if (props.matrix[blockTR.x]?.[blockTR.y]?.fig?.color === props.color) {
			pinBlockTR = blockTR
		}

		checkBlockCells.forEach(cell => {
			if (cell.x < props.x && cell.y < props.y) {
				checkBlockTL.x = Math.max(cell.x, checkBlockTL.x)
				checkBlockTL.y = Math.max(cell.y, checkBlockTL.y)
			}
			if (cell.x > props.x && cell.y > props.y) {
				checkBlockBR.x = Math.min(cell.x, checkBlockBR.x)
				checkBlockBR.y = Math.min(cell.y, checkBlockBR.y)
			}
			if (cell.x < props.x && cell.y > props.y) {
				checkBlockTR.x = Math.max(cell.x, checkBlockTR.x)
				checkBlockTR.y = Math.min(cell.y, checkBlockTR.y)
			}
			if (cell.x > props.x && cell.y < props.y) {
				checkBlockBL.x = Math.min(cell.x, checkBlockBL.x)
				checkBlockBL.y = Math.max(cell.y, checkBlockBL.y)
			}
		})
		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (!(cell.fig?.color === props.color) && directions.includes(cell)) {
					if (cellX < props.x && cellY < props.y && cellX >= blockTL.x && cellY >= blockTL.y) {
						attackedCells.push(cell)
					}
					if (cellX > props.x && cellY > props.y && cellX <= blockBR.x && cellY <= blockBR.y) {
						attackedCells.push(cell)
					}
					if (cellX < props.x && cellY > props.y && cellX >= blockTR.x && cellY <= blockTR.y) {
						attackedCells.push(cell)
					}
					if (cellX > props.x && cellY < props.y && cellX <= blockBL.x && cellY >= blockBL.y) {
						attackedCells.push(cell)
					}
				}
			})
		})

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				props.checkRay.forEach(checkRayCell => {
					if (
						directions.includes(cell) &&
						(!cell.fig || attackedCells.includes(cell)) &&
						(props.status !== "check" ||
							checkRayCell.x * 10 + checkRayCell.y === cell.x * 10 + cell.y ||
							cell.x * 10 + cell.y === props.checkInitator.x * 10 + props.checkInitator.y)
					) {
						if (cellX < props.x && cellY < props.y && cellX >= blockTL.x && cellY >= blockTL.y) {
							freeCells.push({ x: cell.x, y: cell.y })
						}
						if (cellX > props.x && cellY > props.y && cellX <= blockBR.x && cellY <= blockBR.y) {
							freeCells.push({ x: cell.x, y: cell.y })
						}
						if (cellX < props.x && cellY > props.y && cellX >= blockTR.x && cellY <= blockTR.y) {
							freeCells.push({ x: cell.x, y: cell.y })
						}
						if (cellX > props.x && cellY < props.y && cellX <= blockBL.x && cellY >= blockBL.y) {
							freeCells.push({ x: cell.x, y: cell.y })
						}
					}
				})
			})
		})

		props.matrix.forEach((row, cellX) => {
			row.forEach((cell, cellY) => {
				if (directions.includes(cell) || attackedCells.includes(cell)) {
					if (cellX < props.x && cellY < props.y && cellX >= checkBlockTL.x && cellY >= checkBlockTL.y) {
						checkDirections.push({ x: cell.x, y: cell.y })
					}
					if (cellX > props.x && cellY > props.y && cellX <= checkBlockBR.x && cellY <= checkBlockBR.y) {
						checkDirections.push({ x: cell.x, y: cell.y })
					}
					if (cellX < props.x && cellY > props.y && cellX >= checkBlockTR.x && cellY <= checkBlockTR.y) {
						checkDirections.push({ x: cell.x, y: cell.y })
					}
					if (cellX > props.x && cellY < props.y && cellX <= checkBlockBL.x && cellY >= checkBlockBL.y) {
						checkDirections.push({ x: cell.x, y: cell.y })
					}
				}
				if ((directions.includes(cell) || attackedCells.includes(cell)) && (!cell.fig || cell.fig.key === props.key)) {
					if (cellX < props.x && cellY < props.y && cellX >= blockTL.x && cellY >= blockTL.y) {
						checkRayTL.push({ x: cell.x, y: cell.y })
					}
					if (cellX > props.x && cellY > props.y && cellX <= blockBR.x && cellY <= blockBR.y) {
						checkRayBR.push({ x: cell.x, y: cell.y })
					}
					if (cellX < props.x && cellY > props.y && cellX >= blockTR.x && cellY <= blockTR.y) {
						checkRayTR.push({ x: cell.x, y: cell.y })
					}
					if (cellX > props.x && cellY < props.y && cellX <= blockBL.x && cellY >= blockBL.y) {
						checkRayBL.push({ x: cell.x, y: cell.y })
					}
					if (
						cellX < props.x &&
						cellY < props.y &&
						cellX >= pinBlockTL.x &&
						cellY >= pinBlockTL.y &&
						props.matrix[pinBlockTL.x]?.[pinBlockTL.y]?.fig?.name === "King"
					) {
						if (!pinRayTL.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
							pinRayTL.push({ x: props.x, y: props.y })
						}
						pinRayTL.push({ x: cell.x, y: cell.y })
					}
					if (
						cellX > props.x &&
						cellY > props.y &&
						cellX <= pinBlockBR.x &&
						cellY <= pinBlockBR.y &&
						props.matrix[pinBlockBR.x]?.[pinBlockBR.y]?.fig?.name === "King"
					) {
						if (!pinRayBR.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
							pinRayBR.push({ x: props.x, y: props.y })
						}
						pinRayBR.push({ x: cell.x, y: cell.y })
					}
					if (
						cellX < props.x &&
						cellY > props.y &&
						cellX >= pinBlockTR.x &&
						cellY <= pinBlockTR.y &&
						props.matrix[pinBlockTR.x]?.[pinBlockTR.y]?.fig?.name === "King"
					) {
						if (!pinRayTR.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
							pinRayTR.push({ x: props.x, y: props.y })
						}
						pinRayTR.push({ x: cell.x, y: cell.y })
					}
					if (
						cellX > props.x &&
						cellY < props.y &&
						cellX <= pinBlockBL.x &&
						cellY >= pinBlockBL.y &&
						props.matrix[pinBlockBL.x]?.[pinBlockBL.y]?.fig?.name === "King"
					) {
						if (!pinRayBL.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
							pinRayBL.push({ x: props.x, y: props.y })
						}
						pinRayBL.push({ x: cell.x, y: cell.y })
					}
				}
			})
		})
		pins.forEach(pin => {
			if (pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)) {
				freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
			}
		})

		return {
			freeCells: freeCells,
			checkDirections: checkDirections,
			checkRays: [checkRayBL, checkRayBR, checkRayTL, checkRayTR],
			pinRays: [pinRayBL, pinRayBR, pinRayTL, pinRayTR],
		}
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.current !== props.current || (this.props.status === "begin" && props.status === "none")) {
			const { checkRays, pinRays, checkDirections } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, checkRays, "checkRays"])
			this.props.changeFigProps([this.x, this.y, pinRays, "pinRays"])
			this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
		}
		if (props.pinScan) {
			const { freeCells } = this.findFreeCells(props)
			this.props.changeFigProps([this.x, this.y, freeCells, "freeCells"])
		}
	}

	componentDidMount() {
		if (!this.isVictim) {
			const { checkRays, pinRays, checkDirections } = this.findFreeCells(this.props)
			this.props.changeFigProps([this.x, this.y, checkRays, "checkRays"])
			this.props.changeFigProps([this.x, this.y, pinRays, "pinRays"])
			this.props.changeFigProps([this.x, this.y, checkDirections, "checkDirections"])
			this.isVictim = false
		}
	}

	render() {
		return (
			<i className={this.props.color} onClick={() => this.props.move(this.props)} role={"button"}>
				n
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
	}),
	dispatch => ({
		chooseFigure: fig => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: data => dispatch(matrixActions.changeFig(data)),
		changeFigProps: data => dispatch(matrixActions.changeFigProps(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
	}),
)(Bishop)
