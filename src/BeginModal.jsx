import { useState } from "react"
import { useDispatch } from "react-redux"
import { actions as matrixActions } from './store/matrixSlice';

const BeginModal = () => {
    const [animation,setAnimation] = useState('')
    const [time,setTime] = useState(-1)
    const [is960,setIs960] = useState(0)
    const dispatch = useDispatch()
    function start() {
        dispatch(matrixActions.initMatrix([time,is960]))
        setTimeout(() => dispatch(matrixActions.setStatus('none')),500)
        setAnimation('reverse')

    }

    return (
        <div className={ 'modal-bg' + ' '  +  animation  }>
            <div className="modal-box">
            <label htmlFor="">Game type</label><br />
            <select name="" id="" onInput={e => setIs960(+e.target.value)}>
                <option value="0">Regular Chess</option>
                <option value="1">Fischer Random(Chess960)</option>
            </select><br />
            <label htmlFor="">Time in seconds(write -1 to turn off timer)</label>
            <input type="number" name="" id="" onInput={e => setTime(+e.target.value)}/>
            <button onClick={start} className={"reset"}>Start</button>
            </div>
        </div>
    )
}

export default BeginModal
