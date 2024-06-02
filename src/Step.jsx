import { Component } from 'react'
import { connect } from 'react-redux';
import { actions as matrixActions } from './store/matrixSlice';

class Step extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    change() {
        let { x, y, isStart, untouched, ...rest } = this.props.initiatorProps

        if (untouched) {
            untouched = false
        }

        if (this.props.initiatorProps.name === "King" && Math.abs(y - this.props.y) === 2) {
            if (this.props.x === 0 && this.props.y === 2) {
                this.props.changeFig([this.props.x, this.props.y+1, { name:'Rook', color: 'black', isVictim:false , x: this.props.x, y: this.props.y+1, untouched: untouched }])
                this.props.changeFig([0, 0, null])
            }

            if (this.props.x === 0 && this.props.y === 6) {
                this.props.changeFig([this.props.x, this.props.y-1, { name:'Rook', color: 'black', isVictim:false , x: this.props.x, y: this.props.y-1, untouched: untouched }])
                this.props.changeFig([0, 7, null])
            }

            if (this.props.x === 7 && this.props.y === 2) {
                this.props.changeFig([this.props.x, this.props.y+1, { name:'Rook', color: 'white', isVictim:false , x: this.props.x, y: this.props.y+1, untouched: untouched }])
                this.props.changeFig([7, 0, null])
            }

            if (this.props.x === 7 && this.props.y === 6) {
                this.props.changeFig([this.props.x, this.props.y-1, { name:'Rook', color: 'white', isVictim:false , x: this.props.x, y: this.props.y-1, untouched: untouched }])
                this.props.changeFig([7, 7, null])
            }
        }

        this.props.changeFig([this.props.x, this.props.y, { ...rest, x: this.props.x, y: this.props.y, untouched: untouched }])
        this.props.changeFig([x, y, null])
        this.props.killSteps()
        this.props.chooseFigure(10 * this.props.x + this.props.y)
        let play = async () => {
            let sound = null
            if (this.props.victim && this.props.victim.name !== 'Step') {
                sound = await import(`./audio/Capture.WAV`)
            }
            else {
                sound = await import(`./audio/Move_Piece (${Math.floor(Math.random() * 5 + 1)}).WAV`)
            }
            new Audio(sound.default).play()
        }
        play()
        this.props.changeCurrent()
    }

    render() {
        return (
            <i className='step' onClick={() => this.change()} role={"button"}>⬤</i>
        )
    }
}

export default connect(
    (state) => ({
        matrix: state.matrixReducer.value,
    }),
    (dispatch) => ({
        changeCurrent: () => dispatch(matrixActions.changeCurrent()),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        killSteps: () => dispatch(matrixActions.killSteps()),
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
    })
)(Step)
