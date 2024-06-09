import { Component } from 'react'
import { connect } from 'react-redux';
import { actions as matrixActions } from './store/matrixSlice';

class Step extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.pressed = false
        this.isEnPassant = false
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.promotionName !== 'Pawn' && this.pressed) {
            let newInitiatorProps = JSON.parse(JSON.stringify(this.props.initiatorProps))
            newInitiatorProps.name = props.promotionName
            this.regularChange(newInitiatorProps)
        }
    }

    regularChange(initiatorProps) {
        let { x, y, isStart, untouched, ...rest } = initiatorProps

        this.props.changeFig([this.props.x, this.props.y, { ...rest, x: this.props.x, y: this.props.y,}])
        this.props.changeFig([x, y, null])
        this.props.killSteps()
        this.props.chooseFigure(10 * this.props.x + this.props.y)
        let play = async () => {
            let sound = null
            if ((this.props.victim && this.props.victim.name !== 'Step') || this.isEnPassant ){
                sound = await import(`./audio/Capture.WAV`)
            }
            else {
                sound = await import(`./audio/Move_Piece (${Math.floor(Math.random() * 5 + 1)}).WAV`)
            }
            new Audio(sound.default).play()
        }
        play()

        this.props.changeCurrent()
        this.props.setLastMove({x: this.props.x , y: this.props.y})
        this.pressed = false
        this.isEnPassant = false
    }

    change() {
        this.pressed = true
        let { y, untouched } = this.props.initiatorProps

        if (this.props.initiatorProps.name === "King" && Math.abs(y - this.props.y) === 2) {
            if (this.props.x === 0 && this.props.y === 2) {
                this.props.changeFig([this.props.x, this.props.y + 1, { name: 'Rook', color: 'black', isVictim: false, x: this.props.x, y: this.props.y + 1, untouched: untouched }])
                this.props.changeFig([0, 0, null])
            }

            if (this.props.x === 0 && this.props.y === 6) {
                this.props.changeFig([this.props.x, this.props.y - 1, { name: 'Rook', color: 'black', isVictim: false, x: this.props.x, y: this.props.y - 1, untouched: untouched }])
                this.props.changeFig([0, 7, null])
            }

            if (this.props.x === 7 && this.props.y === 2) {
                this.props.changeFig([this.props.x, this.props.y + 1, { name: 'Rook', color: 'white', isVictim: false, x: this.props.x, y: this.props.y + 1, untouched: untouched }])
                this.props.changeFig([7, 0, null])
            }

            if (this.props.x === 7 && this.props.y === 6) {
                this.props.changeFig([this.props.x, this.props.y - 1, { name: 'Rook', color: 'white', isVictim: false, x: this.props.x, y: this.props.y - 1, untouched: untouched }])
                this.props.changeFig([7, 7, null])
            }
        }

        if (this.props.initiatorProps.name === 'Pawn' || (this.props.victim && this.props.victim.name !== 'Step')) {
            this.props.setSeventyFiveMoveCounter(0)
        }
        else {
            this.props.setSeventyFiveMoveCounter(this.props.seventyFiveMoveCounter + 1)
        }

        if (this.props.initiatorProps.name === 'Pawn') {
            switch (this.props.initiatorProps.color) {
                case 'black':
                    if (this.props.x === 7) {
                        this.props.setStatus('promotion')
                        break;
                    }

                    if(this.props.lastMove?.y === this.props.y && this.props.lastMove?.x+1 === this.props.x && !this.props.victim){
                        this.props.changeFig([this.props.lastMove.x, this.props.lastMove.y, null])
                        this.isEnPassant = true
                    }

                    this.regularChange(this.props.initiatorProps);
                    break;
                case 'white':
                    if (this.props.x === 0) {
                        this.props.setStatus('promotion')
                        break;
                    }

                    if(this.props.lastMove?.y === this.props.y && this.props.lastMove?.x-1 === this.props.x && !this.props.victim){
                        this.props.changeFig([this.props.lastMove.x, this.props.lastMove.y, null])
                        this.isEnPassant = true
                    }

                    this.regularChange(this.props.initiatorProps);
                    break;
            }
        }
        else {
            this.regularChange(this.props.initiatorProps)
        }

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
        seventyFiveMoveCounter: state.matrixReducer.seventyFiveMoveCounter,
        promotionName: state.matrixReducer.promotionName,
        lastMove: state.matrixReducer.lastMove
    }),
    (dispatch) => ({
        changeCurrent: () => dispatch(matrixActions.changeCurrent()),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        killSteps: () => dispatch(matrixActions.killSteps()),
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
        setSeventyFiveMoveCounter: (number) => dispatch(matrixActions.setSeventyFiveMoveCounter(number)),
        setStatus: (name) => { dispatch(matrixActions.setStatus(name)) },
        setPromotionName: (name) => { dispatch(matrixActions.setPromotionName(name)) },
        setLastMove: (cords) => dispatch(matrixActions.setLastMove(cords))
    })
)(Step)
