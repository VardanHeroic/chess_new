import { useState } from "react"
import { useDispatch } from "react-redux"
import { actions as matrixActions } from "./store/matrixSlice"

const BeginModal = () => {
    const [animation, setAnimation] = useState("")
    const [time, setTime] = useState(-1)
    const [is960, setIs960] = useState(0)
    const dispatch = useDispatch()
    function start() {
        dispatch(matrixActions.initMatrix([time, is960]))
        setTimeout(() => dispatch(matrixActions.setStatus("none")), 500)
        setAnimation("reverse")
    }

    return (
        <div className={"modal-bg " + animation}>
            <div className="modal-box">
                <label htmlFor="">Game type</label>
                <br />
                <select name="" className="begin-select" onInput={e => setIs960(+e.target.value)}>
                    <option value="0">Regular Chess</option>
                    <option value="1">Fischer Random(Chess960)</option>
                </select>
                <br />
                <label>Time in seconds(write -1 to turn off timer)</label>
                <br />
                <input
                    max="7200"
                    type="number"
                    name=""
                    className="begin-select"
                    onInput={e => setTime(+e.target.value === 0 ? -1 : +e.target.value)}
                />
                <button onClick={start} className={"reset"}>
                    Start
                </button>
            </div>
        </div>
    )
}

export default BeginModal
