import './App.css';
import { Component } from 'react'
import Modal from './Modal';
import Board from './Board';
import {connect} from 'react-redux';
import Reset from './Reset';
import Timer from './Timer';

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}
	
	


	render() {
		return (
			<div className="App">
				{this.props.status === 'promotion' ?  <Modal></Modal> : '' }
				<div className='game' >
					<Board></Board>
					<Timer/>
				</div>
				<div className='Reset-container' >
					<Reset/>
				</div>
			</div>
		)
	}
}

export default connect(
	(state) => ({
		status: state.matrixReducer.status
	}),
null
	)(App)
