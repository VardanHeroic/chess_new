import { Component } from 'react'
import {connect} from 'react-redux';
import {actions as matrixActions} from './store/matrixSlice';

class Step extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}
	
	change(){
		let {x,y,isStart,...rest} = this.props.initiatorProps
		this.props.changeFig([this.props.x,this.props.y,{...rest, x: this.props.x, y: this.props.y}])
		this.props.changeFig([x,y,null])
		this.props.killSteps()
		console.log(this.props.victim);
		let play = async () => {
			let sound = null
			if (this.props.victim && this.props.victim.name !== 'Step' ) {
				sound = await import(`audio/Capture.WAV`)
			}
			else{
				sound = await import(`audio/Move_Piece (${Math.floor(Math.random()*5+1)}).WAV`)
			}
			new Audio(sound.default).play()
		}
		play()
		setTimeout(this.props.changeCurrent,50)		
		setTimeout(this.props.calculateCheckDirections,100)
		setTimeout(this.props.findStaleMate,150)
	}

	render() {
		return (
			<i className='step' onClick={() => this.change()} >●</i> 	
		)
	}
}

export default connect(
	(state) => ({
		matrix: state.matrixReducer.value,
	}),
	(dispatch) => ({
		changeCurrent: () => dispatch(matrixActions.changeCurrent()),
		changeFig: (data) => dispatch(matrixActions.changeFig(data)),
		killSteps: () => dispatch(matrixActions.killSteps()),
		calculateCheckDirections: () => dispatch(matrixActions.calculateCheckDirections()),
		findStaleMate: () => {dispatch(matrixActions.findStaleMate())}
	})
)(Step)
