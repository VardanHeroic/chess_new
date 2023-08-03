import {useDispatch} from "react-redux"
import {actions as matrixActions} from './store/matrixSlice';

const Reset = props => {
	const dispatch = useDispatch()
	return <button className="reset" onClick={() => {
			if (window.confirm('sure?')) {
				dispatch(matrixActions.initMatrix())	
			}
		}
	}>Reset</button>
}

export default Reset
