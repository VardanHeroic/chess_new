import {Component}  from 'react'
import {connect} from 'react-redux'
import {actions as matrixActions} from './store/matrixSlice'


class Bishop extends Component {
	constructor(props){
		super(props)
		this.x = this.props.x
		this.y = this.props.y
		this.color = this.props.color
		this.cells = this.findFreeCells(this.props)
	}
	

	findFreeCells(props){
        let freeCells = []
        let directions = []
        let blockCells = []
		let checkBlockCells = []
        let attackedCells = []
		let checkDirections = []
        let blockTL = {x:-1, y:-1}
        let blockTR = {x:-1, y:8}
        let blockBL = {x:8, y:-1}
        let blockBR = {x:8, y:8}
        let checkBlockTL = {x:-1, y:-1}
        let checkBlockTR = {x:-1, y:8}
        let checkBlockBL = {x:8, y:-1}
        let checkBlockBR = {x:8, y:8}
		let checkRayTL = []
		let checkRayTR = []
		let checkRayBL = []
		let checkRayBR = []	
        props.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                for(let n = 0; n < 8;n++){
                    if(props.y + n == cellY && props.x + n == cellX && props.y != cellY && props.x  != cellX){
                        directions.push(cell)
                        if (cell.fig && cell.fig.name != 'Step') {
                            blockCells.push(cell)
							if (cell.fig?.name !== "King") {
								checkBlockCells.push(cell)		
							}
                        }
                    }
                    if(props.y - n == cellY && props.x + n == cellX && props.y != cellY && props.x  != cellX){
                        directions.push(cell)
                        if (cell.fig && cell.fig.name != 'Step') {
                            blockCells.push(cell)
							if (cell.fig?.name !== "King") {
								checkBlockCells.push(cell)		
							}
                        }
                    }
                    if(props.y + n == cellY && props.x - n == cellX && props.y != cellY && props.x  != cellX){
                        directions.push(cell)
                        if (cell.fig && cell.fig.name != 'Step') {
							blockCells.push(cell)
							if (cell.fig?.name !== "King") {
								checkBlockCells.push(cell)		
							}
						}
                    }
                    if(props.y - n == cellY && props.x - n == cellX && props.y != cellY && props.x  != cellX){
                        directions.push(cell)
                        if (cell.fig && cell.fig.name != 'Step') {
                            blockCells.push(cell)
							if (cell.fig?.name !== "King") {
								checkBlockCells.push(cell)		
							}
                        }
                    }
                }
                blockCells.map(cell => {
                    if((blockTL.x < cell.x && cell.x < props.x) && (blockTL.y < cell.y && cell.y < props.y)){
                        blockTL.x = cell.x
                        blockTL.y = cell.y
                    }
                    if((blockBR.x > cell.x && cell.x > props.x) && (blockBR.y > cell.y && cell.y > props.y)){
                        blockBR.x = cell.x
                        blockBR.y = cell.y
                    }
                    if((blockTR.x < cell.x && cell.x < props.x) && (blockTR.y > cell.y && cell.y > props.y)){
                        blockTR.x = cell.x
                        blockTR.y = cell.y
                    }
                    if((blockBL.x > cell.x && cell.x > props.x) && (blockBL.y < cell.y && cell.y < props.y)){
                        blockBL.x = cell.x
                        blockBL.y = cell.y
                    }
                })
                checkBlockCells.map(cell => {
                    if((checkBlockTL.x < cell.x && cell.x < props.x) && (checkBlockTL.y < cell.y && cell.y < props.y)){
                        checkBlockTL.x = cell.x
                        checkBlockTL.y = cell.y
                    }
                    if((checkBlockBR.x > cell.x && cell.x > props.x) && (checkBlockBR.y > cell.y && cell.y > props.y)){
                        checkBlockBR.x = cell.x
                        checkBlockBR.y = cell.y
                    }
                    if((checkBlockTR.x < cell.x && cell.x < props.x) && (checkBlockTR.y > cell.y && cell.y > props.y)){
                        checkBlockTR.x = cell.x
                        checkBlockTR.y = cell.y
                    }
                    if((checkBlockBL.x > cell.x && cell.x > props.x) && (checkBlockBL.y < cell.y && cell.y < props.y)){
                        checkBlockBL.x = cell.x
                        checkBlockBL.y = cell.y
                    }
                })
            })
        })

        props.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(cell.fig){
                    if(!(cell.fig.color == props.color) && directions.includes(cell) ){
                        if( (cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y) ){
                            attackedCells.push(cell)
                        }
                        if( (cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y) ){
                            attackedCells.push(cell)
                        }
                    }
                }   
            })
        })
        
        props.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
				props.checkRay.forEach(checkRayCell => {
					if(directions.includes(cell) && ( !cell.fig || attackedCells.includes(cell) ) && (props.status !== 'check' || checkRayCell.key === cell.key || cell.key === props.checkInitator.key  ) ){
						if( (cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y) ){
							freeCells.push(cell)
						}
						if( (cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y) ){
							freeCells.push(cell)
						}
						if( (cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y) ){
							freeCells.push(cell)
						}
						if( (cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y) ){
							freeCells.push(cell)
						}
					}
				})
            })
        })
		
        props.matrix.map((row,cellX) => {
            row.map((cell,cellY) => {
                if(directions.includes(cell) || attackedCells.includes(cell)) {
                    if( (cellX < props.x && cellY < props.y) && (cellX >= checkBlockTL.x && cellY >= checkBlockTL.y) ){
                        checkDirections.push(cell)
                    }
                    if( (cellX > props.x && cellY > props.y) && (cellX <= checkBlockBR.x && cellY <= checkBlockBR.y) ){
                        checkDirections.push(cell)
                    }
                    if( (cellX < props.x && cellY > props.y) && (cellX >= checkBlockTR.x && cellY <= checkBlockTR.y) ){
                        checkDirections.push(cell)
                    }
                    if( (cellX > props.x && cellY < props.y) && (cellX <= checkBlockBL.x && cellY >= checkBlockBL.y) ){
                        checkDirections.push(cell)
                    }
                }
				if((directions.includes(cell) || attackedCells.includes(cell) ) && (!cell.fig || cell.fig.key === props.key )) {
                    if( (cellX < props.x && cellY < props.y) && (cellX >= blockTL.x && cellY >= blockTL.y) ){
                        checkRayTL.push(cell)
                    }
                    if( (cellX > props.x && cellY > props.y) && (cellX <= blockBR.x && cellY <= blockBR.y) ){
                        checkRayBR.push(cell)
                    }
                    if( (cellX < props.x && cellY > props.y) && (cellX >= blockTR.x && cellY <= blockTR.y) ){
                        checkRayTR.push(cell)
                    }
                    if( (cellX > props.x && cellY < props.y) && (cellX <= blockBL.x && cellY >= blockBL.y) ){
                        checkRayBL.push(cell)
                    }
                }
            })
        })

    
	//	checkRayBL.push(props.matrix[props.x][props.y])  
	//	checkRayBR.push(props.matrix[props.x][props.y])  
	//	checkRayTL.push(props.matrix[props.x][props.y])
	//	checkRayTR.push(props.matrix[props.x][props.y]) 
        return {
			freeCells:freeCells,
			checkDirections:checkDirections,
			checkRays: [
				checkRayBL,
				checkRayBR,
				checkRayTL,
				checkRayTR,
			]
		}
    }
	
	UNSAFE_componentWillReceiveProps(props) {
		if (this.props.current !== props.current || Object.keys(this.props.checkRay[0]).length !== Object.keys(props.checkRay[0]).length  ) {
			this.cells =  this.findFreeCells(props)
			console.log('lol');
		//	console.log(props);
			this.props.changeFigProps([this.x,this.y,this.cells.checkDirections,'checkDirections'])
			this.props.changeFigProps([this.x,this.y,this.cells.freeCells,'freeCells'])
			this.props.changeFigProps([this.x,this.y,this.cells.checkRays,'checkRays'])
			
		}
	}
	
	componentDidMount(){
			this.cells =  this.findFreeCells(this.props)
			console.log(this.cells.checkDirections)
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
		return <i className={this.color} onClick={() => this.props.move(newProps,this.cells) } >n</i> 
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
)(Bishop)
