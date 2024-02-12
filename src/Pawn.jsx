import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'


class Pawn extends Component {
    constructor(props) {
        super(props)
        this.color = this.props.color
        this.x = this.props.x
        this.y = this.props.y
        //	this.cells = this.findFreeCells()
    }

    componentDidMount() {
        if ((this.props.color === 'white' && this.props.x === 0) || (this.props.color === 'black' && this.props.x === 7)) {
            this.props.setStatusPromotion('promotion')
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
                        attackDirections.push(cell)
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
                        attackDirections.push(cell)
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

        this.props.matrix.map((row, cellX) => {
            row.map((cell, cellY) => {
                if (cell.fig?.name !== 'Step') {
                    if (!(cell.fig?.color === this.props.color) && attackDirections.includes(cell)) {
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
                                (props.status !== 'check' || checkRayCell.key === cell.key) &&
                                (!cell.fig || cell.fig.name === 'Step')
                            ) || (
                                cell.fig &&
                                attackedCells.includes(cell) &&
                                (props.status !== 'check' || props.checkInitator.key === cell.key)
                            )
                        ) &&
                        (cellX > blockXmin && cellX < blockXmax) &&
                        (cellY > blockYmin && cellY < blockYmax)

                    ) {
                        freeCells.push(cell)
                    }
                })
            })
        })

        pins.forEach(pin => {
            if(pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)){
                freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
            }
        })

        return { freeCells: freeCells, checkDirections: attackDirections }
    }


    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.current !== props.current || Object.keys(this.props.checkRay[0]).length !== Object.keys(props.checkRay[0]).length || this.props.promotionName !== props.promotionName) {
            if (((this.props.color === 'white' && this.props.x === 0) || (this.props.color === 'black' && this.props.x === 7)) && this.props.promotionName !== props.promotionName) {
                this.props.changeFigProps([this.x, this.y, props.promotionName, 'name'])
                setTimeout(() => {
                    this.props.setPromotionName('Pawn')
                    this.props.calculateCheckDirections()
                    return
                }, 500)

            }
            let cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, cells.checkDirections, 'checkDirections'])
            this.props.changeFigProps([this.x, this.y, cells.freeCells, 'freeCells'])

        }
    }

    render() {
        let newProps = { ...this.props }
        let cells = this.findFreeCells(this.props)
        newProps.checkDirections = cells.checkDirections
        newProps.freeCells = cells.freeCells
        return <i className={this.color} onClick={() => this.props.move(newProps, cells)} >o</i>

    }
}

export default connect(
    (state) => ({
        chosen: state.matrixReducer.chosen,
        matrix: state.matrixReducer.value,
        current: state.matrixReducer.current,
        checkRay: state.matrixReducer.checkRay,
        status: state.matrixReducer.status,
        promotionName: state.matrixReducer.promotionName,
        checkInitator: state.matrixReducer.checkInitator,
        pinsWhite: state.matrixReducer.pinsWhite,
        pinsBlack: state.matrixReducer.pinsBlack,
    }),
    (dispatch) => ({
        findStaleMate: () => dispatch(matrixActions.findStaleMate()),
        calculateCheckDirections: () => dispatch(matrixActions.calculateCheckDirections()),
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        killSteps: () => dispatch(matrixActions.killSteps()),
        changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),
        setStatusPromotion: (name) => { dispatch(matrixActions.setStatus(name)) },
        setPromotionName: (name) => { dispatch(matrixActions.setPromotionName(name)) }
    })
)(Pawn)
