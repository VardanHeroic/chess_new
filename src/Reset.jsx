import { useDispatch,useSelector } from "react-redux"
import { actions as matrixActions } from './store/matrixSlice';

const Reset = () => {
    const dispatch = useDispatch()
    const matrix = useSelector((state) => state.matrixReducer.value)
    if (matrix.length === 0) {
        return null;
    }
    return <button className="reset" onClick={() => dispatch(matrixActions.setStatus('begin'))}>Reset</button>
}

export default Reset
