import React from "react"

const Cell = props => {
	let fig = null
	if (props.children) {
		fig = React.cloneElement(props.children, { x: props.x, y: props.y })
	}
	return (
		<div className={props.color + (props.isRotated ? " rotated" : "")} x={props.x} y={props.y}>
			{fig}
		</div>
	)
}

export default Cell
