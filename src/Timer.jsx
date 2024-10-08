import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'

class Timer extends Component {
    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.status === 'begin' && props.status !== this.props.status) {
            const timer = setInterval(() => {
                if (this.props.whiteTimer === 0 || this.props.blackTimer === 0) {
                    clearInterval(timer)
                    this.props.findStaleMate()
                }
                if (this.props.status === 'none' || this.props.status === 'check') {
                    if (this.props.current === 'white') {
                        this.props.whiteDecrement()
                    }
                    if (this.props.current === 'black') {
                        this.props.blackDecrement()
                    }
                }
            }, 1000)
        }
    }

    render() {
        if (this.props.status === 'begin' || this.props.whiteTimer < 0) {
            return null;
        }
        return (
            <div className="timer">
                <div className="blackTimer">{this.props.blackTimer >= 0 ? Math.floor(this.props.blackTimer / 60) + ':' + ((Math.floor(this.props.blackTimer / 60) * 60 - this.props.blackTimer) * -1 / 10 >= 1 ? (Math.floor(this.props.blackTimer / 60) * 60 - this.props.blackTimer) * -1 : '0' + (Math.floor(this.props.blackTimer / 60) * 60 - this.props.blackTimer) * -1) : '0:00'}</div>
                <div className="whiteTimer">{this.props.whiteTimer >= 0 ? Math.floor(this.props.whiteTimer / 60) + ':' + ((Math.floor(this.props.whiteTimer / 60) * 60 - this.props.whiteTimer) * -1 / 10 >= 1 ? (Math.floor(this.props.whiteTimer / 60) * 60 - this.props.whiteTimer) * -1 : '0' + (Math.floor(this.props.whiteTimer / 60) * 60 - this.props.whiteTimer) * -1) : '0:00'}</div>

            </div>
        )
    }
}


export default connect(
    (state) => ({
        whiteTimer: state.matrixReducer.whiteTimer,
        blackTimer: state.matrixReducer.blackTimer,
        current: state.matrixReducer.current,
        status: state.matrixReducer.status,
    }),
    (dispatch) => ({
        whiteDecrement: () => dispatch(matrixActions.whiteDecrement()),
        blackDecrement: () => dispatch(matrixActions.blackDecrement()),
        findStaleMate: () => dispatch(matrixActions.findStaleMate())
    })
)(Timer)
