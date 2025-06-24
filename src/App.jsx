import "./App.css"
import Modal from "./Modal"
import Board from "./Board"
import Reset from "./Reset"
import Timer from "./Timer"
import Switch from "./Switch"
import Status from "./Status"
import BeginModal from "./BeginModal"
import { useSelector } from "react-redux"
import { useState } from "react"

export default function App() {
	const status = useSelector(state => state.matrixReducer.status)
	const [isRotated, setisRotated] = useState(false)
	const [autoRotate, setautoRotate] = useState(false)
	return (
		<div className="App">
			{status === "begin" ? <BeginModal /> : ""}
			{status === "promotion" ? <Modal></Modal> : ""}
			<Status />
			<div className="game">
				<Board isRotated={isRotated} autoRotate={autoRotate} setisRotated={setisRotated}></Board>
				<Timer />
			</div>
			<div className="Reset-container">
				<Reset />
				<br />
				<div className="switch-container">
					<span>Auto-rotate: </span>
					<Switch setisRotated={() => setautoRotate(!autoRotate)} isRotated={autoRotate} />
				</div>
				<div className="switch-container">
					<span>Rotated: </span>
					<Switch setisRotated={() => setisRotated(!isRotated)} isRotated={isRotated} isDisabled={autoRotate} />
				</div>
			</div>
		</div>
	)
}
