import './App.css';
import Modal from './Modal';
import Board from './Board';
import Reset from './Reset';
import Timer from './Timer';
import { useSelector } from 'react-redux';

export default function App() {
    const status = useSelector((state) => state.matrixReducer.status)
    return (
        <div className="App">
            {status === 'promotion' ? <Modal></Modal> : ''}
            <div className='game' >
                <Board></Board>
                <Timer />
            </div>
            <div className='Reset-container' >
                <Reset />
            </div>
        </div>
    )
}
