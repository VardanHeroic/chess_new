import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'


class Rook extends Component {
    constructor(props) {
        super(props)
        this.x = this.props.x
        this.y = this.props.y
        this.color = this.props.color
        this.cells = this.findFreeCells(this.props)
    }


    findFreeCells(props) {
        let freeCells = []
        let attackedCells = []
        let checkDirections = []
        let directions = []
        let blockCells = []
        let checkBlockCells = []
        let pins = props.color === 'black' ? props.pinsWhite : props.pinsBlack

        let checkRayPosX = []
        let checkRayNegX = []
        let checkRayPosY = []
        let checkRayNegY = []

        let pinRayPosX = []
        let pinRayNegX = []
        let pinRayPosY = []
        let pinRayNegY = []


        let pinBlockXmin = -1
        let pinBlockXmax = 8
        let pinBlockYmin = -1
        let pinBlockYmax = 8

        let blockXmin = -1
        let blockXmax = 8
        let blockYmin = -1
        let blockYmax = 8

        let checkBlockXmin = -1
        let checkBlockXmax = 8
        let checkBlockYmin = -1
        let checkBlockYmax = 8

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (props.y === cellY || props.x === cellX) {
                    directions.push(cell)
                    if (cell.fig && cell.fig.name != 'Step') {
                        if (cell.fig.name !== 'King') {
                            checkBlockCells.push(cell)
                        }
                        blockCells.push(cell)
                    }
                }
            })
        })

        blockCells.forEach(cell => {
            if (cell.x < props.x) {
                blockXmin = Math.max(blockXmin, cell.x - 1);
            } else if (cell.x > props.x) {
                blockXmax = Math.min(blockXmax, cell.x + 1);
            }

            if (cell.y < props.y) {
                blockYmin = Math.max(blockYmin, cell.y - 1);
            } else if (cell.y > props.y) {
                blockYmax = Math.min(blockYmax, cell.y + 1);
            }
        });

        blockCells.forEach(cell => {
            if (cell.x < props.x && (cell.x - 1 !== blockXmin)) {
                pinBlockXmin = Math.max(pinBlockXmin, cell.x - 1);
            } else if (cell.x > props.x && (cell.x + 1 !== blockXmax)) {
                pinBlockXmax = Math.min(pinBlockXmax, cell.x + 1);
            }

            if (cell.y < props.y && (cell.y - 1 !== blockYmin)) {
                pinBlockYmin = Math.max(pinBlockYmin, cell.y - 1);
            } else if (cell.y > props.y && (cell.y + 1 !== blockYmax)) {
                pinBlockYmax = Math.min(pinBlockYmax, cell.y + 1);
            }
        })

        if (props.matrix[blockXmin + 1][props.y].fig?.color === props.color) {
            pinBlockXmin = blockXmin
        }
        if (props.matrix[blockXmax - 1][props.y].fig?.color === props.color) {
            pinBlockXmax = blockXmax
        }
        if (props.matrix[props.x][blockYmin + 1].fig?.color === props.color) {
            pinBlockYmin = blockYmin
        }
        if (props.matrix[props.x][blockYmax - 1].fig?.color === props.color) {
            pinBlockYmax = blockYmax
        }

        checkBlockCells.forEach(cell => {
            if (cell.x < props.x) {
                checkBlockXmin = Math.max(checkBlockXmin, cell.x - 1);
            } else if (cell.x > props.x) {
                checkBlockXmax = Math.min(checkBlockXmax, cell.x + 1);
            }

            if (cell.y < props.y) {
                checkBlockYmin = Math.max(checkBlockYmin, cell.y - 1);
            } else if (cell.y > props.y) {
                checkBlockYmax = Math.min(checkBlockYmax, cell.y + 1);
            }
        });

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (cell.fig) {
                    if ((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directions.includes(cell)) {
                        if ((cell.fig.color !== props.color)) {
                            attackedCells.push(cell)

                        }

                    }
                }
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if ((cellX > checkBlockXmin && cellX < checkBlockXmax) && (cellY > checkBlockYmin && cellY < checkBlockYmax) && (directions.includes(cell) || attackedCells.includes(cell))) {
                    checkDirections.push(cell)
                }

                if ((directions.includes(cell) || attackedCells.includes(cell)) && (!cell.fig || cell.fig.key === props.key)) {
                    if (cellY === props.y) {
                        if (cellX < blockXmax && cellX >= props.x) {
                            checkRayPosX.push(cell)
                        }
                        if (cellX > blockXmin && cellX <= props.x) {
                            checkRayNegX.push(cell)
                        }
                        if (cellX < pinBlockXmax && cellX >= props.x && props.matrix[pinBlockXmax - 1][props.y].fig?.name === "King") {
                            pinRayPosX.push(cell)
                        }
                        if (cellX > pinBlockXmin && cellX <= props.x && props.matrix[pinBlockXmin + 1][props.y].fig?.name === "King") {
                            pinRayNegX.push(cell)
                        }

                    }
                    if (cellX === props.x) {
                        if (cellY < blockYmax && cellY >= props.y) {
                            checkRayPosY.push(cell)
                        }
                        if (cellY > blockYmin && cellY <= props.y) {
                            checkRayNegY.push(cell)
                        }
                        if (cellY < pinBlockYmax && cellY >= props.y && props.matrix[props.x][pinBlockYmax - 1].fig?.name === "King") {
                            pinRayPosY.push(cell)
                        }
                        if (cellY > pinBlockYmin && cellY <= props.y && props.matrix[props.x][pinBlockYmin + 1].fig?.name === "King") {
                            pinRayNegY.push(cell)
                        }
                    }

                }
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                props.checkRay.forEach(checkRayCell => {
                    if ((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directions.includes(cell) && (!cell.fig || attackedCells.includes(cell)) && (props.status !== 'check' || checkRayCell.key === cell.key || cell.key === props.checkInitator.key)) {
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

        return {
            freeCells: freeCells,
            checkDirections: checkDirections,
            checkRays: [
                checkRayNegX,
                checkRayNegY,
                checkRayPosX,
                checkRayPosY
            ],
            pinRays: [
                pinRayNegX,
                pinRayNegY,
                pinRayPosX,
                pinRayPosY
            ]
        }
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.current !== props.current || Object.keys(this.props.checkRay[0]).length !== Object.keys(props.checkRay[0]).length) {
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.pinRays, 'pinRays'])
        }
        if(JSON.stringify(this.props.pinsBlack) !== JSON.stringify(props.pinsBlack) || JSON.stringify(this.props.pinsWhite) !== JSON.stringify(props.pinsWhite)){
     //      this.cells = this.findFreeCells(props)
      //      this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
       //     this.props.changeFigProps([this.x, this.y, this.cells.checkRays, 'checkRays'])
        //    this.props.changeFigProps([this.x, this.y, this.cells.freeCells, 'freeCells'])
        }
    }

    componentDidMount() {
        this.cells = this.findFreeCells(this.props)
        this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
        this.props.changeFigProps([this.x, this.y, this.cells.freeCells, 'freeCells'])
        this.props.changeFigProps([this.x, this.y, this.cells.checkRays, 'checkRays'])
        this.props.changeFigProps([this.x, this.y, this.cells.pinRays, 'pinRays'])
    }

    render() {
        let newProps = { ...this.props }
        this.cells = this.cells = this.findFreeCells(this.props)
        newProps.checkDirections = this.cells.checkDirections
        newProps.freeCells = this.cells.freeCells
        newProps.checkRays = this.cells.checkRays
        return <i className={this.color} onClick={() => this.props.move(newProps, this.cells)} >t</i>
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
    }),
    (dispatch) => ({
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),
        killSteps: () => dispatch(matrixActions.killSteps())
    })
)(Rook)
