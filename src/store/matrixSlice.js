import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import winSound from "audio/Checkmate_Win.WAV";
import checkSound from "audio/Check.WAV";

export const matrixSlice = createSlice({
	name: 'matrixReducer',
	initialState: {
		value:[],
		checkDirectionsWhite: [],
		checkDirectionsBlack: [],
		status: 'none',
		current: 'white',
		checkRay: [{}],
		checkInitator: null,
		promotionName: 'Pawn',
		chosen: null,
		whiteTimer: 600,
		blackTimer: 600,
	},
	reducers: {
		chooseFigure: (state,action) => {
			state.chosen = action.payload;
		},

		initMatrix: (state,action) => {
			let matrix = []
			for (let i = 0; i < 8; i++) {
				matrix[i] = []
				for(let j = 0; j < 8; j++){;
					if ((i % 2 === 1 && j % 2 === 1) || (i % 2 === 0 && j % 2 === 0)  ) {
						matrix[i][j] = { color: 'wcell', x: i, y: j, key: (i*10 + j),fig: null  }
					}
					else{
						matrix[i][j] = { color: 'bcell', x: i, y: j, key: (i*10 + j), fig: null  }      
					} 
				}
			}	
			
			for (let cell of matrix[1]) {
				cell.fig = {name: 'Pawn', color:'black',isStart: true}
				
			}
			for (let cell of matrix[6]) {
				cell.fig = {name: 'Pawn', color:'white',isStart: true}
				
			}	

			matrix[0][7] = { color: 'bcell', x: 0, y: 7, key: (0*10 + 7), fig: { name: "Rook", color: 'black', checkDirections: []  } }
			matrix[7][0] = { color: 'bcell', x: 7, y: 0, key: (7*10 + 0), fig: { name: "Rook", color: 'white', checkDirections: []  } }
			matrix[0][0] = { color: 'wcell', x: 0, y: 0, key: (0*10 + 0), fig: { name: "Rook", color: 'black', checkDirections: []  } }
			matrix[7][7] = { color: 'wcell', x: 7, y: 7, key: (7*10 + 7), fig: { name: "Rook", color: 'white', checkDirections: []  } }


			matrix[0][5] = { color:'bcell', x: 0, y: 5, key: (0*10 + 5), fig: {name: "Bishop", color:'black'  } }
			matrix[7][2] = { color:'bcell', x: 7, y: 2, key: (7*10 + 2), fig: {name: "Bishop", color:'white'  } }
			matrix[0][2] = { color:'wcell', x: 0, y: 2, key: (0*10 + 2), fig: {name: "Bishop", color:'black'  } }
			matrix[7][5] = { color:'wcell', x: 7, y: 5, key: (7*10 + 5), fig: {name: "Bishop", color:'white'  } }
	


	        matrix[0][3] = { color: 'bcell', x: 0, y: 3, key: (0*10 + 3), fig: { name: "Queen", color: 'black', checkDirections: []  } }
			matrix[7][3] = { color: 'wcell', x: 7, y: 3, key: (7*10 + 3), fig: { name: "Queen", color: 'white', checkDirections: []   } }

	        matrix[0][4] = { color: 'wcell', x: 0, y: 4, key: (0*10 + 4), fig: { name: "King", color: 'black', checkDirections: []  } }
			matrix[7][4] = { color: 'bcell', x: 7, y: 4, key: (7*10 + 4), fig: { name: "King", color: 'white', checkDirections: []   } }
			
			matrix[0][6] = { color: 'wcell', x: 0, y: 6, key: (0*10 + 6), fig: { name: 'Knight',  color: 'black', checkDirections: [] } }
			matrix[7][1] = { color: 'wcell', x: 7, y: 1, key: (7*10 + 1), fig: { name: 'Knight',  color: 'white', checkDirections: [] } }
			matrix[0][1] = { color: 'bcell', x: 0, y: 1, key: (0*10 + 1), fig: { name: 'Knight',  color: 'black', checkDirections: [] } }
			matrix[7][6] = { color: 'bcell', x: 7, y: 6, key: (7*10 + 6), fig: { name: 'Knight',  color: 'white', checkDirections: [] } }

			state.status = 'none';
			state.value =  matrix;
			state.chosen = null;
			state.checkDirectionsBlack = [];
			state.checkDirectionsWhite = [];
			state.current = 'white';
			state.checkRay = [{}];
			state.promotionName = 'Pawn';
			state.checkInitator = null;
			state.blackTimer = 600;
			state.whiteTimer = 600;
			
		},



		killSteps(state,action){
			state.value.forEach(row => {
				row.forEach(cellProps => {
					if (cellProps.fig?.name === 'Step') {
						if (cellProps.fig.victim?.name === 'Step' ) {
							cellProps.fig = null
							return
						}
						cellProps.fig = cellProps.fig.victim;
					}
				});	
			});
		},
		
		calculateCheckDirections(state,action){
			let isRayChosen = false
			let checkCount = 0
			let whiteArr = []
			let blackArr = []
			state.value.map(row => {
				row.map(cellProps => {
					cellProps.fig?.checkDirections?.forEach(checkCell => {


						if(checkCell.fig?.name === 'King' && checkCell.fig.color !== cellProps.fig.color){
							state.status = 'check';
							new Audio(checkSound).play()
							checkCount++
							state.checkInitator = cellProps
							if (cellProps.fig.checkRays && checkCount < 2 ) {
								cellProps.fig.checkRays.forEach( ray => {
									ray.forEach(cell => {	
										if (cell.key === checkCell.key && !isRayChosen ) {	
											state.checkRay = ray;
											isRayChosen = true;
										}
									})
								})
							}

						}

						else if(!checkCount && state.status === 'check' ){
							state.status = 'none';
							state.checkRay = [{}];
						}



						if (cellProps.fig?.color === 'white') {
							whiteArr.push(checkCell);
						}

						else{
							blackArr.push(checkCell);
						}

					})
				})
			})

			state.checkDirectionsBlack = blackArr;
			state.checkDirectionsWhite = whiteArr;

		},
		
		findStaleMate(state,action){
			let whiteFreeArr = [];
			let blackFreeArr = [];
			state.value.map(row => {
				row.map(cellProps => {
					cellProps.fig?.freeCells?.map(checkCell => {
						if (cellProps.fig?.color === 'white') {
							whiteFreeArr.push(checkCell);
						} 

						else{
							blackFreeArr.push(checkCell);
						}	

					});
				});
			});
	

			if ( (blackFreeArr.length === 0 || whiteFreeArr.length === 0) && state.status !== 'check') {
				state.status = 'draw by stalemate';	
				alert('end');
				return;
			}
			if (state.status === 'check') {
				if(blackFreeArr.length === 0){
					state.status = 'white won by checkmate';
					new Audio(winSound).play()
					return;
				}
				if(whiteFreeArr.length === 0){
					state.status = 'black won by checkmate';
					new Audio(winSound).play()
					return;
				}
				
			}
			if (state.blackTimer <= 0) {
				state.status = 'white won by time';
				new Audio(winSound).play();
				return;
			}
			if (state.whiteTimer <= 0) {
				state.status = 'black won by time';
				new Audio(winSound).play();
				return;
			}		

		},

		changeCurrent: (state,action) => {
			if (state.current === 'white') {
				state.current = 'black';
				return;
			}
			state.current = 'white';
		},

		changeFigProps(state,action){
			if (state.value[action.payload[0]][action.payload[1]].fig) {
				state.value[action.payload[0]][action.payload[1]].fig[action.payload[3]] = action.payload[2];
			}
		},

		changeFig(state,action){
			state.value[action.payload[0]][action.payload[1]].fig = action.payload[2];
		},

		setStatus(state,action){
			state.status = action.payload	
		},

		setPromotionName(state,action){
			state.promotionName = action.payload
		},
		whiteDecrement(state,action){
			state.whiteTimer--
		},
		blackDecrement(state,action){
			state.blackTimer--
		},
		
	}
	
});

export const {actions,reducer} = matrixSlice;
