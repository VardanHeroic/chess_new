import { Component } from 'react'
import {connect} from 'react-redux'
import {actions as matrixActions} from './store/matrixSlice'


class Knight extends Component {
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
            {x:this.x-2,y:this.y-1},
            {x:this.x-1,y:this.y-2},
            {x:this.x+2,y:this.y+1},
            {x:this.x+1,y:this.y+2},
            {x:this.x+2,y:this.y-1},
            {x:this.x+1,y:this.y-2},
            {x:this.x-2,y:this.y+1},
            {x:this.x-1,y:this.y+2},
        ]
        let attackedCells = []

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                pseudoDirections.forEach(cord => {
                    if(cord.x === cell.x && cord.y === cell.y){
                        directions.push(cell)
                    }   
                })
            })
        })
	
        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
				if( (cell.fig?.color !== props.color) &&  directions.includes(cell) ){	
                      attackedCells.push(cell)
							
                }   
            })
        })

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
				props.checkRay.forEach(checkRayCell => {
					if(directions.includes(cell) && (attackedCells.includes(cell) || !cell.fig )  && (props.status !== 'check' || checkRayCell.key === cell.key || cell.key === props.checkInitator.key   )  ) {
						freeCells.push(cell)
					}
				})
            })  
        })

		this.props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(directions.includes(cell) || attackedCells.includes(cell)    ) {
                    checkDirections.push(cell)
                }
            })  
        })
		
		return {freeCells:freeCells,checkDirections:checkDirections}
    }
	
	componentDidMount(){
			this.cells = this.findFreeCells(this.props)	
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
	}
	

	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.status !== props.status || Object.keys(this.props.checkRay[0]).length !== Object.keys(props.checkRay[0]).length ) {
			this.cells =  this.findFreeCells(props)
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
			
		}
	}
	

	render() {
		let newProps = {...this.props}
		this.cells = this.findFreeCells(this.props)
		newProps.checkDirections = this.cells.checkDirections
		newProps.freeCells = this.cells.freeCells
		return <i className={this.color} onClick={() => this.props.move(newProps,this.cells) } >j</i>

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
	}),
	(dispatch) => ({
		chooseFigure: (fig) => dispatch(matrixActions.chooseFigure(fig)),
		changeFig: (data) => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),

	})
)(Knight)
