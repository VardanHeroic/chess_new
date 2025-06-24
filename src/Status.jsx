import { useSelector } from "react-redux"

export default function Status() {
	const status = useSelector(state => state.matrixReducer.status)
	const current = useSelector(state => state.matrixReducer.current)
	const string = `${current}'s turn${status === "check" ? "(check)" : ""}`
	return (
		<div className="status-wrapper">
			<span className="status-span">{status === "none" || status === "check" ? string : status}</span>
		</div>
	)
}
