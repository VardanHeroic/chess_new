import React, { Component } from 'react'
import { connect } from 'react-redux'
import { actions as matrixActions } from './store/matrixSlice'
import Cell from './Cell'
import Knight from './Knight'
import Step from './Step'
import King from './King'
import Rook from './Rook'
import Pawn from './Pawn'
import Bishop from './Bishop'
import Queen from './Queen'


class Board extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.components = {
            "Knight": Knight,
            "Step": Step,
            "King": King,
            "Rook": Rook,
            "Pawn": Pawn,
            "Bishop": Bishop,
            "Queen": Queen,
        }
    }

    componentDidMount() {
        this.props.initMatrix()
    }

    move(props) {
        if(!(props.status === 'none' || props.status === 'check')){
            return
        }
        if (props.current !== props.color) {
            return
        }
        props.killSteps()
        if (props.x * 10 + props.y === props.chosen) {
            props.chooseFigure(null)
            return
        }

        props.chooseFigure(props.x * 10 + props.y)
        let {pinScan, promotionName, findStaleMate, pinsBlack, pinsWhite, proptionName, freeCells, checkRay, checkDirections, checkInitator, setPromotionName, setStatusPromotion, status, chosen, matrix, current, chooseFigure, changeFig, killSteps, move, changeFigProps, calculateCheckDirections, checkDirectionsWhite, checkDirectionsBlack, ...rest } = props
        let initiatorProps = { ...rest }
        freeCells.forEach(cellProps => {
            let victimProps = JSON.parse(JSON.stringify(matrix[cellProps.x][cellProps.y].fig))
            if (victimProps) {
                victimProps.isVictim = true
            }
            props.changeFig([cellProps.x, cellProps.y, { x: cellProps.x, y: cellProps.y, name: 'Step', victim: victimProps, initiatorProps: initiatorProps }])
        })

    }


    render() {
        if (this.props.matrix.length === 0) {
           return null;
        }
        return (
            <div className="board">
                {
                    this.props.matrix.map((row, i) => {
                        return <div className="row" key={i}>{
                            row.map(props => {
                                let { fig, ...rest } = props
                                if (fig) {
                                    let Tagname = this.components[fig.name]
                                    return <Cell {...rest} ><Tagname {...fig} move={this.move}  ></Tagname></Cell>
                                }
                                return <Cell {...rest} ></Cell>
                            })
                        }</div>
                    })
                }
            </div>

        )
    }
}

export default connect(
    (state) => ({
        matrix: state.matrixReducer.value,
    }),
    (dispatch) => ({
        initMatrix: () => dispatch(matrixActions.initMatrix()),
    })
)(Board)
