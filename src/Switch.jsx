export default function Switch({ setisRotated, isRotated }) {
	return (
		<label className="switch">
			<input type="checkbox" value={isRotated} onClick={setisRotated} />
			<span className="slider"></span>
		</label>
	)
}
