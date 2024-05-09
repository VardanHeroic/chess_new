import { Component } from 'react'
import {connect} from 'react-redux'
import {actions as matrixActions} from './store/matrixSlice'

class King extends Component {
	constructor(props) {
		super(props)
		this.color = this.props.color
		this.x = this.props.x
		this.y = this.props.y
		this.cells = this.findFreeCells(this.props)

	}

	findFreeCells(props){
        let freeCells = []
        let directions = []
		let checkDirections = []
        let pseudoDirections = [
            {x:props.x-1,y:props.y-1},
            {x:props.x-1,y:props.y},
            {x:props.x-1,y:props.y+1},
            {x:props.x,y:props.y-1},
            {x:props.x,y:props.y+1},
            {x:props.x+1,y:props.y-1},
            {x:props.x+1,y:props.y},
            {x:props.x+1,y:props.y+1},
        ]
        let attackedCells = []

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                pseudoDirections.forEach(cord => {
                    if(cord.x === cellX && cord.y === cellY){
                        directions.push(cell)
                    }
                })
            })
        })

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(!(cell.fig?.color === props.color) && directions.includes(cell) ){
                    attackedCells.push(cell)
                }
            })
        })

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
				if(directions.includes(cell) && ( !cell.fig || attackedCells.includes(cell) )  ){
					freeCells.push({x: cell.x, y: cell.y})
				}
            })
        })

		if (props.color === 'white') {
			props.checkDirectionsBlack.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.x *10 + cell.y !== checkCell.x*10 +checkCell.y)
			})
		}
		if (props.color === 'black') {
			props.checkDirectionsWhite.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.x *10 + cell.y !== checkCell.x*10 + checkCell.y)
			})
		}


		this.props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(directions.includes(cell) || attackedCells.includes(cell)    ) {
                    checkDirections.push({x: cell.x, y: cell.y})
                }
            })
        })


        return {freeCells:freeCells,checkDirections:checkDirections}
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

    componentDidMount() {
        this.cells = this.findFreeCells(this.props)
        this.props.changeFigProps([this.x, this.y, this.cells.checkDirections, 'checkDirections'])
    }

	render() {
		let newProps = {...this.props}
		newProps.checkDirections = this.cells.checkDirections
		newProps.freeCells = this.cells.freeCells
		return <i className={this.color} onClick={() => this.props.move(newProps) } >l</i>

	}


}

export default connect(
	(state) => ({
		chosen: state.matrixReducer.chosen,
		matrix: state.matrixReducer.value,
		current: state.matrixReducer.current,
		checkDirectionsWhite: state.matrixReducer.checkDirectionsWhite,
		checkDirectionsBlack: state.matrixReducer.checkDirectionsBlack,
        pinScan: state.matrixReducer.pinScan
	}),
	(dispatch) => ({
		chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: (data) => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data))
	})
)(King)
