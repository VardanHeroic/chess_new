export default function Switch({ setisRotated, isRotated, isDisabled = false }) {
	return (
		<label className="switch">
			<input type="checkbox" value={isRotated} onChange={setisRotated} disabled={isDisabled} checked={isRotated} />
			<span className="slider"></span>
		</label>
	)
}
