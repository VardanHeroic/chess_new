import { useDispatch,useSelector } from "react-redux"
import { actions as matrixActions } from './store/matrixSlice';

const Reset = () => {
    const dispatch = useDispatch()
    const matrix = useSelector((state) => state.matrixReducer.value)
    if (matrix.length === 0) {
        return null;
    }
    return <button className="reset" onClick={() => {
        if (window.confirm('sure?')) {
            dispatch(matrixActions.initMatrix())
            dispatch(matrixActions.calculateCheckDirections())
        }
    }
    }>Reset</button>
}

export default Reset
