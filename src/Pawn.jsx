import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'


class Pawn extends Component {
    constructor(props) {
        super(props)
        this.color = this.props.color
        this.x = this.props.x
        this.y = this.props.y
        this.cells = this.findFreeCells(this.props)
        this.isVictim = this.props.isVictim
    }

    componentDidMount() {
        if (!this.isVictim) {
            let cells = this.findFreeCells(this.props)
            this.props.changeFigProps([this.x, this.y, cells.checkDirections, 'checkDirections'])
            this.isVictim = false
        }
    }

    findFreeCells(props) {
        let freeCells = []
        let moveDirections = []
        let directions = []
        let blockCells = []
        let attackDirections = []
        let attackedCells = []
        let blockXmin = -1
        let blockXmax = 8
        let blockYmin = -1
        let blockYmax = 8
        let pins = props.color === 'black' ? props.pinsWhite : props.pinsBlack

        props.matrix.map((row, cellX) => {
            row.map((cell, cellY) => {
                if (props.color === 'white') {
                    if (cellX === this.props.x - 1 && this.props.y === cellY) {
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if (cellX === this.props.x - 2 && this.props.y == cellY && this.props.isStart) {
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if (cellX === this.props.x - 1 && (this.props.y + 1 === cellY || this.props.y - 1 === cellY)) {
                        attackDirections.push({ x: cell.x, y: cell.y })
                        directions.push(cell)
                    }

                }
                else {
                    if (cellX === this.props.x + 1 && this.props.y === cellY) {
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if (cellX === this.props.x + 2 && this.props.y === cellY && this.props.isStart) {
                        moveDirections.push(cell)
                        directions.push(cell)
                    }
                    if (cellX === this.props.x + 1 && (this.props.y + 1 === cellY || this.props.y - 1 === cellY)) {
                        attackDirections.push({ x: cell.x, y: cell.y })
                        directions.push(cell)
                    }

                }

                if (moveDirections.includes(cell)) {
                    if (cell.fig && cell.fig.name !== 'Step') {
                        blockCells.push(cell)
                    }
                    blockCells.map(cell => {
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

        this.props.matrix.map(row => {
            row.map(cell => {
                if (cell.fig?.name !== 'Step') {
                    if (!(cell.fig?.color === this.props.color) && attackDirections.some(attackDirectionCell => attackDirectionCell.x === cell.x && attackDirectionCell.y === cell.y)) {
                        attackedCells.push(cell)
                    }
                }
            })
        })

        this.props.matrix.map((row, cellX) => {
            row.map((cell, cellY) => {
                props.checkRay.forEach(checkRayCell => {
                    if (

                        (
                            (
                                moveDirections.includes(cell) &&
                                (props.status !== 'check' || checkRayCell.x * 10 + checkRayCell.y === cell.x * 10 + cell.y) &&
                                (!cell.fig || cell.fig.name === 'Step')
                            ) || (
                                cell.fig &&
                                attackedCells.includes(cell) &&
                                (props.status !== 'check' || props.checkInitator.x * 10 + props.checkInitator.y === cell.x * 10 + cell.y)
                            )
                        ) &&
                        (cellX > blockXmin && cellX < blockXmax) &&
                        (cellY > blockYmin && cellY < blockYmax)

                    ) {
                        freeCells.push({ x: cell.x, y: cell.y })
                    }
                })
            })
        })

        pins.forEach(pin => {
            if (pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)) {
                freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
            }
        })
        return { freeCells: freeCells, checkDirections: attackDirections }
    }


    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.current !== props.current) {
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
        }
        if (props.pinScan) {
            let cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, cells.freeCells, 'freeCells'])
        }
    }

    render() {
        let newProps = { ...this.props }
        this.cells = this.findFreeCells(this.props)
        newProps.checkDirections = this.cells.checkDirections
        newProps.freeCells = this.cells.freeCells
        newProps.isVictim = this.isVictim
        return <i className={this.color} role={"button"} onClick={() => this.props.move(newProps)} >o</i>

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
)(Pawn)
