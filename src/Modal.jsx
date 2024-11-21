import { Component } from "react"
import { connect } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

class Modal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			animation: "",
		}
	}

	handleModal(name) {
		this.props.setPromotionName(name)
		setTimeout(() => this.props.setStatus("none"), 500)
		this.setState({ animation: "reverse" })
	}

	render() {
		return (
			<div className={"modal-bg " + this.state.animation}>
				<div className="modal-box promotion-box">
					<button className="modal-btn" onClick={e => this.handleModal("Rook")}>t</button>
					<button className="modal-btn" onClick={e => this.handleModal("Knight")}>j</button>
					<button className="modal-btn" onClick={e => this.handleModal("Queen")}>w</button>
					<button className="modal-btn" onClick={e => this.handleModal("Bishop")}>n</button>
				</div>
			</div>
		)
	}
}

export default connect(
	state => ({
		status: state.matrixReducer.status,
	}),
	dispatch => ({
		setPromotionName: name => dispatch(matrixActions.setPromotionName(name)),
		setStatus: status => dispatch(matrixActions.setStatus(status)),
	}),
)(Modal)
