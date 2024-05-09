import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'


class Knight extends Component {
    constructor(props) {
        super(props)
        this.color = this.props.color
        this.x = this.props.x
        this.y = this.props.y
        this.cells = this.findFreeCells(this.props)
    }



    findFreeCells(props) {
        let pins = props.color === 'black' ? props.pinsWhite : props.pinsBlack
        let freeCells = []
        let directions = []
        let checkDirections = []
        let pseudoDirections = [
            { x: this.x - 2, y: this.y - 1 },
            { x: this.x - 1, y: this.y - 2 },
            { x: this.x + 2, y: this.y + 1 },
            { x: this.x + 1, y: this.y + 2 },
            { x: this.x + 2, y: this.y - 1 },
            { x: this.x + 1, y: this.y - 2 },
            { x: this.x - 2, y: this.y + 1 },
            { x: this.x - 1, y: this.y + 2 },
        ]
        let attackedCells = []

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                pseudoDirections.forEach(cord => {
                    if (cord.x === cell.x && cord.y === cell.y) {
                        directions.push(cell)
                    }
                })
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if ((cell.fig?.color !== props.color) && directions.includes(cell)) {
                    attackedCells.push(cell)

                }
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                props.checkRay.forEach(checkRayCell => {
                    if (
                        directions.includes(cell) &&
                        (attackedCells.includes(cell) || !cell.fig) &&
                        (
                            props.status !== 'check' ||
                            checkRayCell.x*10+checkRayCell.y === cell.x*10+cell.y ||
                            cell.x*10+cell.y === props.checkInitator.x*10+props.checkInitator.y
                        )
                    ) {
                        freeCells.push({x: cell.x, y: cell.y})
                    }
                })
            })
        })

        pins.forEach(pin => {
            if(pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)){
                freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
            }
        })



        this.props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (directions.includes(cell) || attackedCells.includes(cell)) {
                    checkDirections.push({x: cell.x, y: cell.y})
                }
            })
        })
        return { freeCells: freeCells, checkDirections: checkDirections }
    }

    componentDidMount() {
        this.cells = this.findFreeCells(this.props)
        this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
    }


    UNSAFE_componentWillReceiveProps(props) {
        if (props.pinScan) {
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.freeCells, 'freeCells'])

        }
        if (this.props.current !== props.current ){
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
        }
    }


    render() {
        let newProps = { ...this.props }
        newProps.checkDirections = this.cells.checkDirections
        newProps.freeCells = this.cells.freeCells
        return <i className={this.color} onClick={() => this.props.move(newProps)} >j</i>

    }
}

export default connect(
    (state) => ({
        chosen: state.matrixReducer.chosen,
        matrix: state.matrixReducer.value,
        current: state.matrixReducer.current,
        checkRay: state.matrixReducer.checkRay,
        status: state.matrixReducer.status,
        checkInitator: state.matrixReducer.checkInitator,
        pinsWhite: state.matrixReducer.pinsWhite,
        pinsBlack: state.matrixReducer.pinsBlack,
        pinScan: state.matrixReducer.pinScan
    }),
    (dispatch) => ({
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        killSteps: () => dispatch(matrixActions.killSteps()),
        changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),

    })
)(Knight)
