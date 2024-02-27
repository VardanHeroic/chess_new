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
					freeCells.push(cell)
				}
            })
        })

		if (props.color === 'white') {
			props.checkDirectionsBlack.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.key !== checkCell.key)
			})
		}
		if (props.color === 'black') {
			props.checkDirectionsWhite.forEach(checkCell => {
				freeCells = freeCells.filter(cell => cell.key !== checkCell.key)
			})
		}


		this.props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(directions.includes(cell) || attackedCells.includes(cell)    ) {
                    checkDirections.push(cell)
                }
            })
        })


        return {freeCells:freeCells,checkDirections:checkDirections}
    }

	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.checkDirectionsWhite !== props.checkDirectionsWhite || this.props.checkDirectionsBlack !== props.checkDirectionsBlack || this.props.status !== props.status  ) {
			this.cells =  this.findFreeCells(props)
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
		}
	}

	render() {
		let newProps = {...this.props}
		newProps.checkDirections = this.cells.checkDirections
		newProps.freeCells = this.cells.freeCells
		return <i className={this.color} onClick={() => this.props.move(newProps,this.cells) } >l</i>

	}


}

export default connect(
	(state) => ({
		chosen: state.matrixReducer.chosen,
		matrix: state.matrixReducer.value,
		current: state.matrixReducer.current,
		checkDirectionsWhite: state.matrixReducer.checkDirectionsWhite,
		checkDirectionsBlack: state.matrixReducer.checkDirectionsBlack,
	}),
	(dispatch) => ({
		chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: (data) => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data))
	})
)(King)
