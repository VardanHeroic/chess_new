let key = 0
let pinkey = 0

const componentActionTrackerMiddleware = store => next => action => {
    let matrixReducer = store.getState().matrixReducer
    if (action.type === 'matrixReducer/changeFigProps') {

        if (action?.payload[3] === 'checkDirections') {
            if (pinkey <= Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== 77) {
               console.log('checkdir', action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), pinkey);
                pinkey = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else if (pinkey !== matrixReducer.chosen) {
                console.log('vsyocheck', pinkey, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key));
                pinkey = 0
                key = 0
                store.dispatch({ type: 'matrixReducer/calculateCheckDirections' });
            }
        }
        else if (action?.payload[3] === 'freeCells' ) {

            if (   key <= Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== 77) {
                console.log(action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), key,action);
                key = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else {
                console.log('vsyo', key, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key),action);
                key = 0
                store.dispatch({ type: 'matrixReducer/findStaleMate' });
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
    next(action);
};

export default componentActionTrackerMiddleware;
