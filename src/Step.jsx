import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Step extends Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.pressed = false
		this.isEnPassant = false
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.promotionName !== "Pawn" && this.pressed) {
			let newInitiatorProps = JSON.parse(JSON.stringify(this.props.initiatorProps))
			newInitiatorProps.name = props.promotionName
			this.regularChange(newInitiatorProps)
		}
	}

	regularChange(initiatorProps) {
		let { x, y, isStart, untouched, isVictim, ...rest } = initiatorProps
		this.props.changeFig([this.props.x, this.props.y, { ...rest, x: this.props.x, y: this.props.y }])
		this.props.changeFig([x, y, null])
		this.props.killSteps()
		this.props.chooseFigure(10 * this.props.x + this.props.y)
		let play = async () => {
			let sound = null
			if ((this.props.victim && this.props.victim.name !== "Step") || this.isEnPassant) {
				sound = await import(`./audio/Capture.ogg`)
			} else if (initiatorProps.name === "King" && Math.abs(y - this.props.y) === 2) {
				sound = await import("./audio/Castles.ogg")
			} else {
				sound = await import(`./audio/Move.ogg`)
			}
			new Audio(sound.default).play()
		}
		play()

		this.props.changeCurrent()
		this.props.setLastMove([
			{ x: this.props.x, y: this.props.y },
			{ x: x, y: y },
		])
		this.pressed = false
		this.isEnPassant = false
	}

	change() {
		this.pressed = true
		const { y, untouched } = this.props.initiatorProps

		const isWhite = this.props.initiatorProps.color === "white"
		const isY2 = this.props.y === 2
		if (this.props.initiatorProps.name === "King" && Math.abs(y - this.props.y) === 2) {
			this.props.changeFig([
				this.props.x,
				this.props.y + (isY2 ? 1 : -1),
				{
					name: "Rook",
					color: this.props.initiatorProps.color,
					isVictim: false,
					x: this.props.x,
					y: this.props.y + (isY2 ? 1 : -1),
					untouched: untouched,
				},
			])
			this.props.changeFig([isWhite ? 7 : 0, isY2 ? 0 : 7, null])
		}

		if (this.props.initiatorProps.name === "Pawn" || (this.props.victim && this.props.victim.name !== "Step")) {
			this.props.setSeventyFiveMoveCounter(0)
		} else {
			this.props.setSeventyFiveMoveCounter(this.props.seventyFiveMoveCounter + 1)
		}

		if (this.props.initiatorProps.name === "Pawn") {
			if (this.props.x === (isWhite ? 0 : 7)) {
				this.props.setStatus("promotion")
				return
			}

			if (
				this.props.lastMove[0]?.y === this.props.y &&
				this.props.lastMove[0]?.x + (isWhite ? -1 : 1) === this.props.x &&
				!this.props.victim
			) {
				this.props.changeFig([this.props.lastMove[0].x, this.props.lastMove[0].y, null])
				this.isEnPassant = true
			}

			this.regularChange(this.props.initiatorProps)
		} else {
			this.regularChange(this.props.initiatorProps)
		}
	}

	render() {
		let fig
		switch (this.props.victim?.name) {
			case "Pawn":
				fig = "o"
				break
			case "Knight":
				fig = "j"
				break
			case "Queen":
				fig = "w"
				break
			case "Bishop":
				fig = "n"
				break
			case "Rook":
				fig = "t"
				break
			default:
				break
		}

		return (
			<>
				<div
					className={this.props.victim && this.props.victim.name !== "Step" ? "capture-step" : "step"}
					onClick={() => this.change()}
					role={"button"}
				></div>
				<i className={this.props.victim?.color}>{fig}</i>
			</>
		)
	}
}

export default connect(
	state => ({
		matrix: state.matrixReducer.value,
		seventyFiveMoveCounter: state.matrixReducer.seventyFiveMoveCounter,
		promotionName: state.matrixReducer.promotionName,
		lastMove: state.matrixReducer.lastMove,
	}),
	dispatch => ({
		changeCurrent: () => dispatch(matrixActions.changeCurrent()),
		changeFig: data => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		chooseFigure: fig => dispatch(matrixActions.chooseFigure(fig)),
		setSeventyFiveMoveCounter: number => dispatch(matrixActions.setSeventyFiveMoveCounter(number)),
		setStatus: name => {
			dispatch(matrixActions.setStatus(name))
		},
		setPromotionName: name => {
			dispatch(matrixActions.setPromotionName(name))
		},
		setLastMove: cords => dispatch(matrixActions.setLastMove(cords)),
	}),
)(Step)
