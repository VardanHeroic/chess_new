import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Timer extends Component {
	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.status === "begin" && props.status !== this.props.status) {
			const timer = setInterval(() => {
				if (this.props.whiteTimer === 0 || this.props.blackTimer === 0 || this.props.status === "begin") {
					clearInterval(timer)
					this.props.findStaleMate()
				}
				if (this.props.status === "none" || this.props.status === "check") {
					if (this.props.current === "white") {
						this.props.whiteDecrement()
					}
					if (this.props.current === "black") {
						this.props.blackDecrement()
					}
				}
			}, 1000)
		}
	}

	render() {
		if (this.props.status === "begin" || this.props.whiteTimer < 0) {
			return null
		}
		return (
			<div className="timer">
				{["blackTimer", "whiteTimer"].map(color => {
					const seconds = this.props[color]
					const hours = Math.floor(seconds / 3600)
					const minutes = Math.floor((seconds % 3600) / 60)
					const remainingSeconds = seconds % 60
					let baseString = `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
					if (hours > 0) {
						baseString = `${hours}:${baseString}`
					}
					return <div className={color}>{baseString}</div>
				})}
			</div>
		)
	}
}

export default connect(
	state => ({
		whiteTimer: state.matrixReducer.whiteTimer,
		blackTimer: state.matrixReducer.blackTimer,
		current: state.matrixReducer.current,
		status: state.matrixReducer.status,
	}),
	dispatch => ({
		whiteDecrement: () => dispatch(matrixActions.whiteDecrement()),
		blackDecrement: () => dispatch(matrixActions.blackDecrement()),
		findStaleMate: () => dispatch(matrixActions.findStaleMate()),
	}),
)(Timer)
