import "./App.css"
import Modal from "./Modal"
import Board from "./Board"
import Reset from "./Reset"
import Timer from "./Timer"
import Switch from "./Switch"
import BeginModal from "./BeginModal"
import { useSelector } from "react-redux"
import { useState } from "react"

export default function App() {
	const status = useSelector(state => state.matrixReducer.status)
	const [isRotated, setisRotated] = useState(false)
	return (
		<div className="App">
			{status === "begin" ? <BeginModal /> : ""}
			{status === "promotion" ? <Modal></Modal> : ""}
			<div className="game">
				<Board isRotated={isRotated}></Board>
				<Timer />
			</div>
			<div className="Reset-container">
				<Reset />
				<br />
				<Switch setisRotated={() => setisRotated(!isRotated)} isRotated={isRotated} />
			</div>
		</div>
	)
}
