export default function Switch({ setisRotated, isRotated }) {
	return (
		<div>
			<input type="checkbox" value={isRotated} onClick={setisRotated} />
			<span></span>
		</div>
	)
}
