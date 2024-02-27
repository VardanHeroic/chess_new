let key = 0
let pinkey = 0

const componentActionTrackerMiddleware = store => next => action => {
    // Let the action pass through the middleware
    // Check if the action is the one you're interested in
    let matrixReducer = store.getState().matrixReducer
    if (action.type === 'matrixReducer/changeFigProps') {

        if (action?.payload[3] === 'pinRays') {
            if (pinkey <= Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== 77) {
             //   console.log('pin', action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), pinkey);
                pinkey = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else if (matrixReducer.value[action?.payload[0]][action?.payload[1]].fig.name !== 'King') {
                // console.log('vsyopin', pinkey, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key));
                pinkey = 0
                store.dispatch({ type: 'matrixReducer/findPins' });
            }
        }
        if (action?.payload[3] === 'freeCells' && matrixReducer.value[action?.payload[0]][action?.payload[1]].fig.name !== 'King') {

            if (key <= Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== 77) {
                // console.log(action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), key);
                key = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else if (matrixReducer.value[action?.payload[0]][action?.payload[1]].fig.name !== 'King') {
                // console.log('vsyo', key, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key));
                store.dispatch({ type: 'matrixReducer/calculateCheckDirections' });
            }

        }
        // You might have a mechanism to track component actions
        // For simplicity, let's assume the action payload contains component IDs
        //  const componentIds = action.payload.componentIds;

        // Do something with the component IDs, maybe track them in the store
        // For example, you could have a slice of the store dedicated to tracking component actions

        // Once you're sure all component actions are processed
        // Dispatch the final action

    }
    pinkey = 0
    key = 0
    next(action);
};

export default componentActionTrackerMiddleware;
