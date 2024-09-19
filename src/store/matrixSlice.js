import { createSlice } from "@reduxjs/toolkit";
import winSound from "../audio/Victory.ogg";
import checkSound from "../audio/Check.ogg";
import drawSound from "../audio/Draw.ogg"
import lowTimeSound from "../audio/LowTime.ogg"

export const matrixSlice = createSlice({
    name: 'matrixReducer',
    initialState: {
        value: [],
        checkDirectionsWhite: [],
        checkDirectionsBlack: [],
        pinsWhite: [],
        pinsBlack: [],
        status: 'none',
        current: 'white',
        checkRay: [{}],
        checkInitator: null,
        promotionName: 'Pawn',
        chosen: null,
        whiteTimer: 600,
        blackTimer: 600,
        pinScan: false,
        allFreeCells: [],
        seventyFiveMoveCounter: 0,
        lastMove: null,
    },
    reducers: {
        chooseFigure: (state, action) => {
            state.chosen = action.payload;
        },

        initMatrix: (state) => {
            let matrix = []
            for (let i = 0; i < 8; i++) {
                matrix[i] = []
                for (let j = 0; j < 8; j++) {
                    ;
                    if ((i % 2 === 1 && j % 2 === 1) || (i % 2 === 0 && j % 2 === 0)) {
                        matrix[i][j] = { color: 'wcell', x: i, y: j, key: (i * 10 + j), fig: null }
                    }
                    else {
                        matrix[i][j] = { color: 'bcell', x: i, y: j, key: (i * 10 + j), fig: null }
                    }
                }
            }

            for (let cell of matrix[1]) {
                cell.fig = { name: 'Pawn', color: 'black', isStart: true }

            }
            for (let cell of matrix[6]) {
                cell.fig = { name: 'Pawn', color: 'white', isStart: true }

            }

            const lastLine = [0,1,2,3,4,5,6,7]

            const kingCord = Math.floor(Math.random()*6)+1
            lastLine.splice(lastLine.indexOf(kingCord),1);

            const leftRookCord = Math.floor(Math.random()*kingCord)
            lastLine.splice(lastLine.indexOf(leftRookCord),1);

            const rightRookCord = Math.floor(Math.random()*(7-kingCord))+kingCord+1
            lastLine.splice(lastLine.indexOf(rightRookCord),1);

            let blackCelledBishopCord = Math.floor(Math.random()*4)*2
            while(!lastLine.includes(blackCelledBishopCord)){
                blackCelledBishopCord = Math.floor(Math.random()*4)*2
            }
            lastLine.splice(lastLine.indexOf(blackCelledBishopCord),1);

            let whiteCelledBishopCord = Math.floor(Math.random()*4)*2+1
            while(!lastLine.includes(whiteCelledBishopCord)){
                whiteCelledBishopCord = Math.floor(Math.random()*4)*2+1
            }
            lastLine.splice(lastLine.indexOf(whiteCelledBishopCord),1);

            const firstKnightCord = lastLine[Math.floor(Math.random()*3)]
            lastLine.splice(lastLine.indexOf(firstKnightCord),1)

            const secondKnightCord = lastLine[Math.floor(Math.random()*2)]
            lastLine.splice(lastLine.indexOf(secondKnightCord),1)

            const queenCord = lastLine[0]
            // console.log(whiteCelledBishopCord,blackCelledBishopCord,lastLine,leftRookCord,rightRookCord);

            // let firstKnightCord = Math.floor(Math.random()*7)
            // while(lastLine.includes(wh)){
            //     firstKnightCord = Math.floor(Math.random()*7)
            // }
            // lastLine.splice(lastLine.indexOf(firstKnightCord),1);

            matrix[0][rightRookCord].fig = { name: "Rook", color: 'black', checkDirections: [], untouched: true }
            matrix[7][leftRookCord].fig  = { name: "Rook", color: 'white', checkDirections: [], untouched: true }
            matrix[0][leftRookCord].fig  = { name: "Rook", color: 'black', checkDirections: [], untouched: true }
            matrix[7][rightRookCord].fig = { name: "Rook", color: 'white', checkDirections: [], untouched: true }


            matrix[0][whiteCelledBishopCord].fig = { name: "Bishop", color: 'black' }
            matrix[7][blackCelledBishopCord].fig = { name: "Bishop", color: 'white' }
            matrix[0][blackCelledBishopCord].fig = { name: "Bishop", color: 'black' }
            matrix[7][whiteCelledBishopCord].fig = { name: "Bishop", color: 'white' }



            matrix[0][queenCord].fig = { name: "Queen", color: 'black', checkDirections: [] }
            matrix[7][queenCord].fig = { name: "Queen", color: 'white', checkDirections: [] }

            matrix[0][kingCord].fig = { name: "King", color: 'black', checkDirections: [], untouched: true }
            matrix[7][kingCord].fig = { name: "King", color: 'white', checkDirections: [], untouched: true }

            matrix[0][secondKnightCord].fig = { name: 'Knight', color: 'black', checkDirections: [] }
            matrix[7][firstKnightCord].fig  = { name: 'Knight', color: 'white', checkDirections: [] }
            matrix[0][firstKnightCord].fig  = { name: 'Knight', color: 'black', checkDirections: [] }
            matrix[7][secondKnightCord].fig = { name: 'Knight', color: 'white', checkDirections: [] }

            state.status = 'none';
            state.value = matrix;
            state.chosen = null;
            state.checkDirectionsBlack = [];
            state.checkDirectionsWhite = [];
            state.current = 'white';
            state.checkRay = [{}];
            state.promotionName = 'Pawn';
            state.checkInitator = null;
            state.blackTimer = 600;
            state.whiteTimer = 600;
            state.pinScan = false;
            state.pinsBlack = []
            state.pinsWhite = []
            state.allFreeCells = []
            state.seventyFiveMoveCounter = 0
            state.lastMove = null

        },



        killSteps(state) {
            state.value.forEach(row => {
                row.forEach(cellProps => {
                    if (cellProps.fig?.name === 'Step') {
                        if (cellProps.fig.victim?.name === 'Step') {
                            cellProps.fig = null
                            return
                        }
                        cellProps.fig = cellProps.fig.victim;
                    }
                });
            });
        },


        calculateCheckDirections(state, action) {
            let whitePinArr = []
            let blackPinArr = []
            state.value.forEach(row => {
                row.forEach(cellProps => {
                    cellProps.fig?.pinRays?.forEach(pinRay => {
                        if (pinRay.length !== 0) {
                            if (cellProps.fig.color === 'white') {
                                whitePinArr.push(pinRay)
                            }
                            else {
                                blackPinArr.push(pinRay)
                            }
                        }
                    })
                })
            })

            state.pinsWhite = whitePinArr;
            state.pinsBlack = blackPinArr;


            let isRayChosen = false
            let checkCount = 0
            let whiteArr = []
            let blackArr = []
            state.value.forEach(row => {
                row.forEach(cellProps => {
                    cellProps.fig?.checkDirections?.forEach(checkCellCord => {
                        let checkCell = state.value[checkCellCord.x][checkCellCord.y]
                        if (checkCell.fig?.name === 'King' && checkCell.fig.color !== cellProps.fig.color) {
                            state.status = 'check';
                            checkCount++
                            state.checkInitator = { x: cellProps.x, y: cellProps.y }
                            if (cellProps.fig.checkRays && checkCount < 2) {
                                cellProps.fig.checkRays.forEach(ray => {
                                    ray.forEach(cell => {
                                        if (cell.x * 10 + cell.y === checkCell.key && !isRayChosen) {
                                            state.checkRay = ray;
                                            isRayChosen = true;
                                        }
                                    })
                                })
                            }

                        }

                        else if (!checkCount && state.status === 'check') {
                            state.status = 'none';
                            state.checkRay = [{}];
                        }



                        if (cellProps.fig?.color === 'white') {
                            whiteArr.push(checkCellCord);
                        }

                        else {
                            blackArr.push(checkCellCord);
                        }

                    })
                })
            })
            state.checkDirectionsBlack = blackArr;
            state.checkDirectionsWhite = whiteArr;
            state.pinScan = true
        },

        findStaleMate(state) {
            state.pinScan = false
            let whiteFreeArr = [];
            let blackFreeArr = [];
            let whiteMaterial = [];
            let blackMaterial = [];
            state.value.forEach(row => {
                row.forEach(cellProps => {
                    switch (cellProps.fig?.color) {
                        case 'white':
                            whiteMaterial.push(cellProps)
                            break;
                        case 'black':
                            blackMaterial.push(cellProps)
                            break;
                    }
                    cellProps.fig?.freeCells?.forEach(checkCell => {
                        if (cellProps.fig?.color === 'white') {
                            whiteFreeArr.push(checkCell);
                        }

                        else {
                            blackFreeArr.push(checkCell);
                        }

                    });
                });
            });

            state.allFreeCells.push(blackFreeArr.concat(whiteFreeArr))
            let whitePositionCount = state.allFreeCells.reduce((count, freeCells, index) => JSON.stringify(blackFreeArr.concat(whiteFreeArr)) === JSON.stringify(freeCells) && index % 2 === 1 ? count + 1 : count, 0)
            let blackPositonCount = state.allFreeCells.reduce((count, freeCells, index) => JSON.stringify(blackFreeArr.concat(whiteFreeArr)) === JSON.stringify(freeCells) && index % 2 === 0 ? count + 1 : count, 0)

            if (whitePositionCount === 3 || blackPositonCount === 3) {
                state.status = 'draw by repeatition';
                new Audio(drawSound).play()
                return;
            }

            function isCheckMatePossible(array, kingCount) {
                let hasQueenRookPawn = array.some(cellProps => cellProps.fig.name === 'Queen' || cellProps.fig.name === 'Pawn' || cellProps.fig.name === 'Rook')
                let bishopCount = array.filter(cellProps => cellProps.fig.name === 'Bishop')
                let areSameSidedBishops = bishopCount.length + kingCount === array.length && (bishopCount.every(cellProps => (cellProps.x + cellProps.y) % 2 === 0) || bishopCount.every(cellProps => (cellProps.x + cellProps.y) % 2 === 1))
                let isOneBishop = bishopCount.length === 1
                let isOneKnight = array.filter(cellProps => cellProps.fig.name === 'Knight').length === 1;
                return !hasQueenRookPawn && (areSameSidedBishops || (array.length === 3 && (isOneBishop || isOneKnight)) || array.length === kingCount)
            }


            if (isCheckMatePossible(whiteMaterial.concat(blackMaterial), 2)) {
                state.status = 'draw by lack of material';
                new Audio(drawSound).play()
                return;
            }

            if ((blackFreeArr.length === 0 || whiteFreeArr.length === 0) && state.status !== 'check') {
                state.status = 'draw by stalemate';
                new Audio(drawSound).play()
                return;
            }

            if (state.seventyFiveMoveCounter >= 75) {
                state.status = 'draw by 75 move rule';
                new Audio(drawSound).play()
                return;
            }

            if (state.status === 'check') {
                if (blackFreeArr.length === 0 && state.current === 'black') {
                    state.status = 'white won by checkmate';
                    new Audio(winSound).play()
                    return;
                }
                if (whiteFreeArr.length === 0 && state.current === 'white') {
                    state.status = 'black won by checkmate';
                    new Audio(winSound).play()
                    return;
                }
                new Audio(checkSound).play()
            }


            if (state.blackTimer <= 0) {
                if (isCheckMatePossible(whiteMaterial, 1)) {
                    state.status = 'draw by lack of material';
                    new Audio(drawSound).play()
                    return;

                }
                state.status = 'white won by time';
                new Audio(winSound).play();
                return;
            }
            if (state.whiteTimer <= 0) {
                if (isCheckMatePossible(blackMaterial, 1)) {
                    state.status = 'draw by lack of material';
                    new Audio(drawSound).play()
                    return;

                }
                state.status = 'black won by time';
                new Audio(winSound).play();
                return;
            }

        },

        changeCurrent: (state) => {
            if (state.current === 'white') {
                state.current = 'black';
                return;
            }
            state.current = 'white';
        },

        changeFigProps(state, action) {
            if (state.value[action.payload[0]][action.payload[1]].fig) {
                state.value[action.payload[0]][action.payload[1]].fig[action.payload[3]] = action.payload[2];
            }
        },

        changeFig(state, action) {
            state.value[action.payload[0]][action.payload[1]].fig = action.payload[2];
        },

        setStatus(state, action) {
            state.status = action.payload
        },

        setPromotionName(state, action) {
            state.promotionName = action.payload
        },
        whiteDecrement(state) {
            state.whiteTimer--
            if (state.whiteTimer === 60) {
                new Audio(lowTimeSound).play()
            }
        },
        blackDecrement(state) {
            state.blackTimer--
            if (state.blackTimer === 60) {
                new Audio(lowTimeSound).play()
            }
        },
        setSeventyFiveMoveCounter(state, action) {
            state.seventyFiveMoveCounter = action.payload
        },
        setLastMove(state, action) {
            state.lastMove = action.payload
        },

    }

});

export const { actions, reducer } = matrixSlice;
