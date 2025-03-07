import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { store } from "./store/store.js"
import { Provider } from "react-redux"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
	<Provider store={store}>
		<StrictMode>
			<App></App>
		</StrictMode>
	</Provider>,
)
