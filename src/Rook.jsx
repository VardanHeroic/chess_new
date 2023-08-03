import { Component } from 'react'
import {connect} from 'react-redux'
import {actions as matrixActions} from './store/matrixSlice'


class Rook extends Component {
	constructor(props){
		super(props)
		this.x = this.props.x
		this.y = this.props.y
		this.color = this.props.color
		this.cells = this.findFreeCells(this.props)
	}
	

	findFreeCells(props){
        let freeCells = []
        let attackedCells = []
		let checkDirections = []
        let directions = []
        let blockCells = []
		let chessBlockCells = []
		let checkDirectionsPosX = []
		let checkDirectionsNegX = []
		let checkDirectionsPosY = []
		let checkDirectionsNegY = []
        let blockXmin = -1
        let blockXmax = 8
        let blockYmin = -1
        let blockYmax = 8
		let checkBlockXmin = -1
        let checkBlockXmax = 8
        let checkBlockYmin = -1
		let checkBlockYmax = 8
        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(props.y === cellY ^ props.x === cellX  ){
                    directions.push(cell)
                    if (cell.fig && cell.fig.name != 'Step') {
						if(cell.fig.name !== 'King' ){
							chessBlockCells.push(cell)
						}
                        blockCells.push(cell)
                    }
                    blockCells.forEach(cell => {
                        if(blockXmin < cell.x && cell.x < props.x){
                            blockXmin = cell.x-1
                        }
                        if(blockXmax > cell.x && cell.x > props.x){
                            blockXmax = cell.x+1
                        }
                        if(blockYmin < cell.y && cell.y < props.y){
                            blockYmin = cell.y-1
                        }
                        if(blockYmax > cell.y && cell.y > props.y){
                            blockYmax = cell.y+1
                        }
                    })
					chessBlockCells.forEach(cell => {
                        if(checkBlockXmin < cell.x && cell.x < props.x){
                            checkBlockXmin = cell.x-1
                        }
                        if(checkBlockXmax > cell.x && cell.x > props.x){
                            checkBlockXmax = cell.x+1
                        }
                        if(checkBlockYmin < cell.y && cell.y < props.y){
                            checkBlockYmin = cell.y-1
                        }
                       if(checkBlockYmax > cell.y && cell.y > props.y){
                            checkBlockYmax = cell.y+1
                        }
                    })
                }
            })
        })

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if(cell.fig){	
                    if((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directions.includes(cell) ){
						if((cell.fig.color !== props.color)){
							attackedCells.push(cell)

						}

                    }
                }   
            })
        })
		
		props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
                if( (cellX > checkBlockXmin && cellX < checkBlockXmax) && (cellY > checkBlockYmin && cellY < checkBlockYmax) && (directions.includes(cell) || attackedCells.includes(cell) ) ){
                    checkDirections.push(cell)
                }
				if((directions.includes(cell) || attackedCells.includes(cell) ) && (!cell.fig || cell.fig.key === props.key ) ){
					if (cellY === props.y) {
						if (cellX < blockXmax &&  cellX >= props.x) {
							checkDirectionsPosX.push(cell)	
						}
						if (cellX > blockXmin && cellX <= props.x) {
							checkDirectionsNegX.push(cell)	
						}
					}
					if (cellX === props.x) {
						if (cellY < blockYmax &&  cellY >= props.y) {
							checkDirectionsPosY.push(cell)	
						}
						if (cellY > blockYmin && cellY <= props.y) {
							checkDirectionsNegY.push(cell)	
						}
					}

				}
            })
        })

        props.matrix.forEach((row,cellX) => {
            row.forEach((cell,cellY) => {
				props.checkRay.forEach(checkRayCell => {
					if((cellX > blockXmin && cellX < blockXmax) && (cellY > blockYmin && cellY < blockYmax) && directions.includes(cell) && ( !cell.fig || attackedCells.includes(cell)  ) && (props.status !== 'check' || checkRayCell.key === cell.key || cell.key === props.checkInitator.key  )  ){
						freeCells.push(cell)
					}
				})
            })
        })

        return {
			freeCells:freeCells,
			checkDirections: checkDirections,
			checkRays: [
				checkDirectionsNegX,
				checkDirectionsNegY,
				checkDirectionsPosX,
				checkDirectionsPosY
			]
		}
    }
	
	UNSAFE_componentWillReceiveProps(props) {	
		if (this.props.current !== props.current || Object.keys(this.props.checkRay[0]).length !== Object.keys(props.checkRay[0]).length  ) {
			this.cells =  this.findFreeCells(props)
		//	console.log(props);
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
			this.props.changeFigProps([this.x,this.y,this.cells.checkRays,'checkRays'])
			
		}
	}
	
	componentDidMount(){
			this.cells =  this.findFreeCells(this.props)
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
			this.props.changeFigProps([this.x,this.y,this.cells.checkRays,'checkRays'])	
	}

	render() {
		let newProps = {...this.props}
		this.cells = this.findFreeCells(this.props)
		newProps.checkDirections = this.cells.checkDirections
		newProps.freeCells = this.cells.freeCells
		newProps.checkRays = this.cells.checkRays
		return <i className={this.color} onClick={() => this.props.move(newProps,this.cells) } >t</i> 
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
		changeFigProps: (data) => dispatch(matrixActions.changeFigProps(data)),
		killSteps: () => dispatch(matrixActions.killSteps())
	})
)(Rook)
