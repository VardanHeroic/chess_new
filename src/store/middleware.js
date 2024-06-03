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
            console.log(pinkey,lastFig,penultimateFig,matrixReducer.chosen);
            if ( (matrixReducer.chosen === lastFig && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== penultimateFig) || (matrixReducer.chosen !== lastFig && Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== lastFig) ) {
                pinkey = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else if(matrixReducer.chosen !== pinkey)   {
                pinkey = 0
                key = 0
                console.log(matrixReducer.value[action?.payload[0]][action?.payload[1]].key,'vsyopin');
                store.dispatch({ type: 'matrixReducer/calculateCheckDirections' });
            }
        }
        else if (action?.payload[3] === 'freeCells') {
            if (Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key) !== lastFig) {
                key = Number(matrixReducer.value[action?.payload[0]][action?.payload[1]].key)
            }
            else {
                key = 0
                next(action);
                store.dispatch({ type: 'matrixReducer/findStaleMate' });
            }

        }
    }
    next(action);
};

export default componentActionTrackerMiddleware;
