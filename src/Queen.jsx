import { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'

class Queen extends Component {
    constructor(props) {
        super(props)
        this.x = this.props.x
        this.y = this.props.y
        this.cells = this.findFreeCells(this.props)
        this.isVictim = this.props.isVictim

    }


    findFreeCells(props) {
        let freeCells = []
        let pins = props.color === 'black' ? props.pinsWhite : props.pinsBlack
        let checkDirections = []
        let directionsBishop = []
        let blockCellsBishop = []
        let checkBlockCellsBishop = []
        let attackedCellsBishop = []

        let blockTL = { x: -1, y: -1 }
        let blockTR = { x: -1, y: 8 }
        let blockBL = { x: 8, y: -1 }
        let blockBR = { x: 8, y: 8 }

        let checkBlockTL = { x: -1, y: -1 }
        let checkBlockTR = { x: -1, y: 8 }
        let checkBlockBL = { x: 8, y: -1 }
        let checkBlockBR = { x: 8, y: 8 }

        let pinBlockTL = { x: -1, y: -1 }
        let pinBlockTR = { x: -1, y: 8 }
        let pinBlockBL = { x: 8, y: -1 }
        let pinBlockBR = { x: 8, y: 8 }

        let checkRayTL = []
        let checkRayTR = []
        let checkRayBL = []
        let checkRayBR = []

        let pinRayTL = []
        let pinRayTR = []
        let pinRayBL = []
        let pinRayBR = []

        let attackedCellsRook = []
        let directionsRook = []
        let blockCellsRook = []
        let checkBlockCellsRook = []

        let checkDirectionsPosX = []
        let checkDirectionsNegX = []
        let checkDirectionsPosY = []
        let checkDirectionsNegY = []

        let pinRayPosX = []
        let pinRayNegX = []
        let pinRayPosY = []
        let pinRayNegY = []

        let blockXmin = -1
        let blockXmax = 8
        let blockYmin = -1
        let blockYmax = 8

        let checkBlockXmin = -1
        let checkBlockXmax = 8
        let checkBlockYmin = -1
        let checkBlockYmax = 8

        let pinBlockXmin = -1
        let pinBlockXmax = 8
        let pinBlockYmin = -1
        let pinBlockYmax = 8

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (props.y === cellY || props.x === cellX) {
                    directionsRook.push(cell)
                    if (cell.fig && cell.fig.name !== "Step") {
                        if (!(cell.fig.name === "King" && cell.fig.color !== props.color)) {
                            checkBlockCellsRook.push(cell)
                        }
                        blockCellsRook.push(cell)
                    }
                }
            })
        })

        blockCellsRook.forEach(cell => {
            if (blockXmin < cell.x && cell.x < props.x) {
                blockXmin = cell.x - 1
            }
            if (blockXmax > cell.x && cell.x > props.x) {
                blockXmax = cell.x + 1
            }
            if (blockYmin < cell.y && cell.y < props.y) {
                blockYmin = cell.y - 1
            }
            if (blockYmax > cell.y && cell.y > props.y) {
                blockYmax = cell.y + 1
            }
        })
        checkBlockCellsRook.forEach(cell => {
            if (checkBlockXmin < cell.x && cell.x < props.x) {
                checkBlockXmin = cell.x - 1
            }
            if (checkBlockXmax > cell.x && cell.x > props.x) {
                checkBlockXmax = cell.x + 1
            }
            if (checkBlockYmin < cell.y && cell.y < props.y) {
                checkBlockYmin = cell.y - 1
            }
            if (checkBlockYmax > cell.y && cell.y > props.y) {
                checkBlockYmax = cell.y + 1
            }
        })

        blockCellsRook.forEach(cell => {
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

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (cell.fig) {
                    if ((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directionsRook.includes(cell)) {
                        if ((cell.fig.color !== props.color)) {
                            attackedCellsRook.push(cell)

                        }

                    }
                }
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if ((cellX > checkBlockXmin && cellX < checkBlockXmax) && (cellY > checkBlockYmin && cellY < checkBlockYmax) && (directionsRook.includes(cell) || attackedCellsRook.includes(cell)) && !(cellX === props.x && cellY === props.y)) {
                    checkDirections.push({ x: cell.x, y: cell.y })
                }
                if ((directionsRook.includes(cell) || attackedCellsRook.includes(cell)) && (!cell.fig || cell.fig.key === props.key)) {
                    if (cellY === props.y) {
                        if (cellX < blockXmax && cellX >= props.x) {
                            checkDirectionsPosX.push({ x: cell.x, y: cell.y })
                        }
                        if (cellX > blockXmin && cellX <= props.x) {
                            checkDirectionsNegX.push({ x: cell.x, y: cell.y })
                        }

                        if (cellX < pinBlockXmax && cellX >= props.x && props.matrix[pinBlockXmax - 1][props.y].fig?.name === "King" && props.matrix[pinBlockXmax - 1][props.y].fig?.color !== props.color) {
                            pinRayPosX.push({ x: cell.x, y: cell.y })
                        }
                        if (cellX > pinBlockXmin && cellX <= props.x && props.matrix[pinBlockXmin + 1][props.y].fig?.name === "King" && props.matrix[pinBlockXmin + 1][props.y].fig?.color !== props.color) {
                            pinRayNegX.push({ x: cell.x, y: cell.y })
                        }
                    }
                    if (cellX === props.x) {
                        if (cellY < blockYmax && cellY >= props.y) {
                            checkDirectionsPosY.push({ x: cell.x, y: cell.y })
                        }
                        if (cellY > blockYmin && cellY <= props.y) {
                            checkDirectionsNegY.push({ x: cell.x, y: cell.y })
                        }
                        if (cellY < pinBlockYmax && cellY >= props.y && props.matrix[props.x][pinBlockYmax - 1].fig?.name === "King" && props.matrix[props.x][pinBlockYmax - 1].fig?.color !== props.color) {
                            pinRayPosY.push({ x: cell.x, y: cell.y })
                        }
                        if (cellY > pinBlockYmin && cellY <= props.y && props.matrix[props.x][pinBlockYmin + 1].fig?.name === "King" && props.matrix[props.x][pinBlockYmin + 1].fig?.color !== props.color) {
                            pinRayNegY.push({ x: cell.x, y: cell.y })
                        }
                    }
                }
            })
        })
        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                props.checkRay.forEach(checkRayCell => {
                    if ((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directionsRook.includes(cell) && (!cell.fig || attackedCellsRook.includes(cell)) && (props.status !== 'check' || checkRayCell.x*10 + checkRayCell.y === cell.x * 10 + cell.y || cell.x * 10 + cell.y === props.checkInitator.x*10 + props.checkInitator.y)) {
                        freeCells.push({ x: cell.x, y: cell.y })
                    }
                })
            })
        })







        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                for (let n = 0; n < 8; n++) {
                    if (props.y + n === cellY && props.x + n === cellX && props.y !== cellY && props.x !== cellX) {
                        directionsBishop.push(cell)
                        if (cell.fig && cell.fig.name !== 'Step') {
                            blockCellsBishop.push(cell)
                            if (!(cell.fig.name === "King" && cell.fig.color !== props.color)) {
                                checkBlockCellsBishop.push(cell)
                            }
                        }
                    }
                    if (props.y - n === cellY && props.x + n === cellX && props.y !== cellY && props.x !== cellX) {
                        directionsBishop.push(cell)
                        if (cell.fig && cell.fig.name !== 'Step') {
                            blockCellsBishop.push(cell)
                            if (!(cell.fig.name === "King" && cell.fig.color !== props.color)) {
                                checkBlockCellsBishop.push(cell)
                            }
                        }
                    }
                    if (props.y + n === cellY && props.x - n === cellX && props.y !== cellY && props.x !== cellX) {
                        directionsBishop.push(cell)
                        if (cell.fig && cell.fig.name !== 'Step') {
                            blockCellsBishop.push(cell)
                            if (!(cell.fig.name === "King" && cell.fig.color !== props.color)) {
                                checkBlockCellsBishop.push(cell)
                            }
                        }
                    }
                    if (props.y - n === cellY && props.x - n === cellX && props.y !== cellY && props.x !== cellX) {
                        directionsBishop.push(cell)
                        if (cell.fig && cell.fig.name !== 'Step') {
                            blockCellsBishop.push(cell)
                            if (!(cell.fig.name === "King" && cell.fig.color !== props.color)) {
                                checkBlockCellsBishop.push(cell)
                            }
                        }
                    }
                }
                blockCellsBishop.forEach(cell => {
                    if ((blockTL.x < cell.x && cell.x < props.x) && (blockTL.y < cell.y && cell.y < props.y)) {
                        blockTL.x = cell.x
                        blockTL.y = cell.y
                    }
                    if ((blockBR.x > cell.x && cell.x > props.x) && (blockBR.y > cell.y && cell.y > props.y)) {
                        blockBR.x = cell.x
                        blockBR.y = cell.y
                    }
                    if ((blockTR.x < cell.x && cell.x < props.x) && (blockTR.y > cell.y && cell.y > props.y)) {
                        blockTR.x = cell.x
                        blockTR.y = cell.y
                    }
                    if ((blockBL.x > cell.x && cell.x > props.x) && (blockBL.y < cell.y && cell.y < props.y)) {
                        blockBL.x = cell.x
                        blockBL.y = cell.y
                    }
                })


                blockCellsBishop.forEach(cell => {
                    if ((pinBlockTL.x < cell.x && cell.x < props.x) && (pinBlockTL.y < cell.y && cell.y < props.y) && (cell.x !== blockTL.x) && (cell.y !== blockTL.y)) {
                        pinBlockTL.x = cell.x
                        pinBlockTL.y = cell.y
                    }
                    if ((pinBlockBR.x > cell.x && cell.x > props.x) && (pinBlockBR.y > cell.y && cell.y > props.y) && (cell.x !== blockBR.x) && (cell.y !== blockBR.y)) {
                        pinBlockBR.x = cell.x
                        pinBlockBR.y = cell.y
                    }
                    if ((pinBlockTR.x < cell.x && cell.x < props.x) && (pinBlockTR.y > cell.y && cell.y > props.y) && (cell.x !== blockTR.x) && (cell.y !== blockTR.y)) {
                        pinBlockTR.x = cell.x
                        pinBlockTR.y = cell.y
                    }
                    if ((pinBlockBL.x > cell.x && cell.x > props.x) && (pinBlockBL.y < cell.y && cell.y < props.y) && (cell.x !== blockBL.x) && (cell.y !== blockBL.y)) {
                        pinBlockBL.x = cell.x
                        pinBlockBL.y = cell.y
                    }
                })

                if (props.matrix[blockTL.x]?.[blockTL.y]?.fig?.color === props.color) {
                    pinBlockTL = blockTL
                }
                if (props.matrix[blockBR.x]?.[blockBR.y]?.fig?.color === props.color) {
                    pinBlockBR = blockBR
                }
                if (props.matrix[blockBL.x]?.[blockBL.y]?.fig?.color === props.color) {
                    pinBlockBL = blockBL
                }
                if (props.matrix[blockTR.x]?.[blockTR.y]?.fig?.color === props.color) {
                    pinBlockTR = blockTR
                }

                checkBlockCellsBishop.forEach(cell => {
                    if ((checkBlockTL.x < cell.x && cell.x < props.x) && (checkBlockTL.y < cell.y && cell.y < props.y)) {
                        checkBlockTL.x = cell.x
                        checkBlockTL.y = cell.y
                    }
                    if ((checkBlockBR.x > cell.x && cell.x > props.x) && (checkBlockBR.y > cell.y && cell.y > props.y)) {
                        checkBlockBR.x = cell.x
                        checkBlockBR.y = cell.y
                    }
                    if ((checkBlockTR.x < cell.x && cell.x < props.x) && (checkBlockTR.y > cell.y && cell.y > props.y)) {
                        checkBlockTR.x = cell.x
                        checkBlockTR.y = cell.y
                    }
                    if ((checkBlockBL.x > cell.x && cell.x > props.x) && (checkBlockBL.y < cell.y && cell.y < props.y)) {
                        checkBlockBL.x = cell.x
                        checkBlockBL.y = cell.y
                    }
                })
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (cell.fig) {
                    if (!(cell.fig.color === props.color) && directionsBishop.includes(cell)) {
                        if ((cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y)) {
                            attackedCellsBishop.push(cell)
                        }
                        if ((cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y)) {
                            attackedCellsBishop.push(cell)
                        }
                        if ((cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y)) {
                            attackedCellsBishop.push(cell)
                        }
                        if ((cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y)) {
                            attackedCellsBishop.push(cell)
                        }
                    }
                }
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                props.checkRay.forEach(checkRayCell => {
                    if (directionsBishop.includes(cell) && (!cell.fig || attackedCellsBishop.includes(cell)) && (props.status !== 'check' || checkRayCell.x * 10 + checkRayCell.y === cell.x * 10 + cell.y || cell.x * 10 + cell.y === props.checkInitator.x * 10 + props.checkInitator.y)) {
                        if ((cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y)) {
                            freeCells.push({ x: cell.x, y: cell.y })
                        }
                        if ((cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y)) {
                            freeCells.push({ x: cell.x, y: cell.y })
                        }
                        if ((cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y)) {
                            freeCells.push({ x: cell.x, y: cell.y })
                        }
                        if ((cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y)) {
                            freeCells.push({ x: cell.x, y: cell.y })
                        }
                    }
                })
            })
        })

        props.matrix.forEach((row, cellX) => {
            row.forEach((cell, cellY) => {
                if (directionsBishop.includes(cell) || attackedCellsBishop.includes(cell)) {
                    if ((cellX < props.x && cellY < props.y) && (cellX >= checkBlockTL.x && cellY >= checkBlockTL.y)) {
                        checkDirections.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY > props.y) && (cellX <= checkBlockBR.x && cellY <= checkBlockBR.y)) {
                        checkDirections.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX < props.x && cellY > props.y) && (cellX >= checkBlockTR.x && cellY <= checkBlockTR.y)) {
                        checkDirections.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY < props.y) && (cellX <= checkBlockBL.x && cellY >= checkBlockBL.y)) {
                        checkDirections.push({ x: cell.x, y: cell.y })
                    }
                }
                if ((directionsBishop.includes(cell) || attackedCellsBishop.includes(cell)) && (!cell.fig || cell.fig.key === props.key)) {
                    if ((cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y)) {
                        checkRayTL.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y)) {
                        checkRayBR.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y)) {
                        checkRayTR.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y)) {
                        checkRayBL.push({ x: cell.x, y: cell.y })
                    }

                    if ((cellX < props.x && cellY < props.y) && (cellX >= pinBlockTL.x && cellY >= pinBlockTL.y) && props.matrix[pinBlockTL.x]?.[pinBlockTL.y]?.fig?.name === "King") {
                        if (!pinRayTL.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
                            pinRayTL.push({ x: props.x, y: props.y })
                        }
                        pinRayTL.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY > props.y) && (cellX <= pinBlockBR.x && cellY <= pinBlockBR.y) && props.matrix[pinBlockBR.x]?.[pinBlockBR.y]?.fig?.name === "King") {
                        if (!pinRayBR.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
                            pinRayBR.push({ x: props.x, y: props.y })
                        }
                        pinRayBR.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX < props.x && cellY > props.y) && (cellX >= pinBlockTR.x && cellY <= pinBlockTR.y) && props.matrix[pinBlockTR.x]?.[pinBlockTR.y]?.fig?.name === "King") {
                        if (!pinRayTR.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
                            pinRayTR.push({ x: props.x, y: props.y })
                        }
                        pinRayTR.push({ x: cell.x, y: cell.y })
                    }
                    if ((cellX > props.x && cellY < props.y) && (cellX <= pinBlockBL.x && cellY >= pinBlockBL.y) && props.matrix[pinBlockBL.x]?.[pinBlockBL.y]?.fig?.name === "King") {
                        if (!pinRayBL.some(pinRayCell => pinRayCell.x === props.x && pinRayCell.y === props.y)) {
                            pinRayBL.push({ x: props.x, y: props.y })
                        }
                        pinRayBL.push({ x: cell.x, y: cell.y })
                    }
                }
            })
        })

        pins.forEach(pin => {
            if (pin.some(pinCell => pinCell.x === props.x && pinCell.y === props.y)) {
                freeCells = freeCells.filter(freeCell => pin.some(pinCell => pinCell.x === freeCell.x && pinCell.y === freeCell.y))
            }
        })

        return {
            freeCells: freeCells,
            checkDirections: checkDirections,
            checkRays: [
                checkRayBL,
                checkRayBR,
                checkRayTL,
                checkRayTR,
                checkDirectionsNegX,
                checkDirectionsPosX,
                checkDirectionsNegY,
                checkDirectionsPosY,
            ],
            pinRays: [
                pinRayNegX,
                pinRayNegY,
                pinRayPosX,
                pinRayPosY,
                pinRayBL,
                pinRayBR,
                pinRayTL,
                pinRayTR,
            ]
        }
    }



    UNSAFE_componentWillReceiveProps(props) {
        if (this.props.current !== props.current) {
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.checkRays, 'checkRays'])
            this.props.changeFigProps([this.x, this.y, this.cells.pinRays, 'pinRays'])
            this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
        }
        if (props.pinScan) {
            this.cells = this.findFreeCells(props)
            this.props.changeFigProps([this.x, this.y, this.cells.freeCells, 'freeCells'])
        }
    }

    componentDidMount() {
        this.cells = this.findFreeCells(this.props)
        this.props.changeFigProps([this.x, this.y, this.cells.checkRays, 'checkRays'])
        this.props.changeFigProps([this.x, this.y, this.cells.pinRays, 'pinRays'])
        this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
    }

    render() {
        let newProps = { ...this.props }
        newProps.checkDirections = this.cells.checkDirections
        newProps.freeCells = this.cells.freeCells
        newProps.checkRays = this.cells.checkRays
        return <i className={this.props.color} role={"button"} onClick={() => this.props.move(newProps)} >w</i>
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
        pinScan: state.matrixReducer.pinScan,

    }),
    (dispatch) => ({
        chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
        changeFig: (data) => dispatch(matrixActions.changeFig(data)),
        changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),
        killSteps: () => dispatch(matrixActions.killSteps())
    })
)(Queen)
