let key = 0
let pinkey = 0

const componentActionTrackerMiddleware = store => next => action => {
    let matrixReducer = store.getState().matrixReducer
    let lastFig = null
    let penultimateFig = null
    if (action.type === 'matrixReducer/changeFigProps') {

        for (const row of matrixReducer.value.toReversed()) {
            if (row.filter(cell => cell.fig)) {
                if (!lastFig && row.some(cell => cell.fig) ){
                    lastFig = row.toReversed().filter(cell => cell.fig)[0].key
                }

                if (row.filter(cell => cell.fig).length > 1) {
                    if (row.filter(cell => cell.fig).some(cell => cell.key === lastFig)) {
                        penultimateFig = row.toReversed().filter(cell => cell.fig)[1].key
                        break
                    }
                    else {
                        penultimateFig = row.toReversed().filter(cell => cell.fig)[0].key
                        break
                    }
                }
                else if (row.filter(cell => cell.fig)[0] && row.filter(cell => cell.fig)[0].key !== lastFig) {
                    penultimateFig = row.filter(cell => cell.fig)[0].key
                    break


                }
            }
        }

        if (action?.payload[3] === 'checkDirections') {
            console.log('checkdir', action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), pinkey, lastFig, penultimateFig);
            if ( (matrixReducer.chosen === lastFig && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== penultimateFig) || (matrixReducer.chosen !== lastFig && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== lastFig) ) {
                pinkey = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else if(matrixReducer.chosen !== pinkey)   {
                console.log('vsyocheck', pinkey, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key));
                pinkey = 0
                key = 0
                store.dispatch({ type: 'matrixReducer/calculateCheckDirections' });
            }
        }
        else if (action?.payload[3] === 'freeCells') {
            console.log(action.payload, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), key,action);
            if (key <= Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== lastFig) {
                key = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else {
                console.log('vsyo', key, Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key), action);
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
