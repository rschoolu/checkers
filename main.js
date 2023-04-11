// Checkers games in Javascript
// random functions
function childrenToArray(x) {
    return [].slice.call(x)
}
function win() {
    setTimeout(() => {
        document.querySelector('#popup').hidden = false;
        document.querySelector('#popup').querySelector('h1').innerHTML = "You Win!"
        document.querySelector('#popup').style = "background: green;"
    }, 1000);
}
function lose() {
    setTimeout(() => {
        document.querySelector('#popup').hidden = false;
        document.querySelector('#popup').querySelector('h1').innerHTML = "You Lose.";
        document.querySelector('#popup').style = "background: red;"
    }, 1000);
}
function tie() {
    setTimeout(() => {
        document.querySelector('#popup').hidden = false;
        document.querySelector('#popup').querySelector('h1').innerHTML = "Softlocked!";
        document.querySelector('#popup').style = "background: grey;"
    }, 1000);
}
// Variables
const boardDiv = document.querySelector('#board');
let turn = 1;
let ai = true;
const board = [
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0]
]



// Misc
childrenToArray(boardDiv.children).forEach(element => {
    childrenToArray(element.children).forEach(elementChild => {
        elementChild.addEventListener("click", (e)=>{
            if (turn == 1) {
                knowWhatYouSelected(parseInt(element.id),parseInt(elementChild.id));
                selectSpace(parseInt(element.id),parseInt(elementChild.id));
            }
            
        })
    });
});

// Useful functions
function styleBoard() {
    childrenToArray(boardDiv.children).forEach(element => {
        childrenToArray(element.children).forEach(elementChild => {
            choice = ((parseInt(element.id) % 2) + (parseInt(elementChild.id) % 2)) % 2
            if (choice == 0) {
                elementChild.style = "background: white;"
            } else {
                elementChild.style = "background: blue;"
            }
        });
    });
}
function getSpaceDiv(row,space) {
    if (row == null || space == null) {
        return 0;
    }
    return boardDiv.querySelector(`div.row[id="${row}"]`).querySelector(`div[id="${space}"]`)
}
let selectedSpace = {
    "row": null,
    "space": null
}
function makeAiMove() {
    // Go through pieces and compile a list of pieces that have "potential"
    let goodPieces = []
    let yellowOcc = 0
    for (const row in board) {
        for(const space in board[row]) {
            if(board[parseInt(row)][parseInt(space)] == 1 || board[parseInt(row)][parseInt(space)] == 3) {
                if(getPossibleMoves(parseInt(row),parseInt(space)).length > 0 ) {
                    goodPieces.push({
                        "row": parseInt(row),
                        "space": parseInt(space)
                    })
                    console.log(`Added (row: ${row}, space: ${space} to good list)`)
            }
            yellowOcc++
            }
           
        }
    }
    if (yellowOcc == 0) {
        win()
    }
    if (goodPieces.length < 1) {
        tie()
    }
    // Choose a random piece and see the moves it has
    let randomPiece = goodPieces[Math.floor(Math.random()*goodPieces.length)]
    console.log(`randomPiece: {
        "row": ${randomPiece["row"]},
        "space": ${randomPiece["space"]}
    }`)
    setTimeout(() => {
        selectSpace(parseInt(randomPiece["row"]),parseInt(randomPiece["space"]),false)
        setTimeout(() => {
            let moves = getPossibleMoves(randomPiece["row"],randomPiece["space"])
            console.log('Now printing moves')
            for (const x of moves) {
                console.log(`Possible Move: {
                    "row": ${x["row"]},
                    "space": ${x["space"]}
                }`)
            }
            let randomMove = moves[Math.floor(Math.random()*moves.length)]
            console.log(`randomMove: {
                "row": ${randomMove["row"]},
                "space": ${randomMove["space"]}
            }`)
            move(parseInt(randomMove["row"]),parseInt(randomMove["space"]))
        }, 1000);
    }, 500);
}
function queenMoves(row,space,selected) {
    // get queen moves
    let possibleMoves = []
    let opp = 1
    if (board[row][space] == 3) {
        opp = 2
    }
    if (space < 7) {
        if (row < 7) {
            if (board[row+1][space+1] == 0) {
        possibleMoves.push({
            "row": row+1,
            "space": space+1,
            "kills": false,
        })
        }}
        if (row > 0) {
            if (board[row-1][space+1] == 0) {
        possibleMoves.push({
            "row": row-1,
            "space": space+1,
            "kills": false,
        })
        }
    
    } 
    }
    if (space > 0) {
        if (row < 7) {
           if (board[row+1][space-1] == 0) {
        possibleMoves.push({
            "row": row+1,
            "space": space-1,
            "kills": false,
        }) 
        }
    }
        if (row > 0) {
            if (board[row-1][space-1] == 0) {
        possibleMoves.push({
            "row": row-1,
            "space": space-1,
            "kills": false,
        })
    }
    }
    }

    if (space < 6) {
        if(row < 6) {
            if (board[row+1][space+1] == opp || board[row+1][space+1] == opp+2) {
        if(board[row+2][space+2] == 0) {
            possibleMoves.push({
                "row": row+2,
                "space": space+2,
                "kills": [row+1,space+1],
            })
        }}
        }
        if (row > 1) {
            if (board[row-1][space+1] == opp || board[row-1][space+1] == opp + 2) {
            if (board[row-2][space+2] == 0) {
                possibleMoves.push({
                    "row": row-2,
                    "space": space+2,
                    "kills": [row-1,space+1],
                })
            }
        }
    }
    }
    if (space > 1) {
        if (row < 6)
        if (board[row+1][space-1] == opp || board[row+1][space-1] == opp + 2) {
        if (board[row+2][space-2] == 0) {
            possibleMoves.push({
                "row": row+2,
                "space": space-2,
                "kills": [row+1,space-1],
            })
        }
    }
    if (row > 1) {
        if (board[row-1][space-1] == opp || board[row-1][space-1] == opp + 2) {
        if(board[row-2][space-2] == 0) {
            possibleMoves.push({
                "row": row-2,
                "space": space-2,
                "kills": [row-1,space-1],
            })
        }
    }
    }
    
    }
    
    

    return possibleMoves
}
function getPossibleMoves(row,space) {
    let possibleMoves = []
    if(board[row][space] == null) {
        return []
    }
    if (board[row][space] == 0) {
        return [false]
    }

    // console.log(`Getting Possible Moves for Row: ${row}, Space: ${space}, Type: ${board[row][space]}`)
    
    let subtract = 1;
    let opp = 1
    let stroch = 0;
    let contition = row > stroch
    let contition2 = row > (stroch + subtract)
    if (board[row][space] == 1) {
        subtract = -1;
        opp = 2
        stroch = 7;
        contition = row < stroch
        contition2 = row < (stroch + subtract)
    }
    if (board[row][space] > 2) {
        return queenMoves(row,space)
    }
    // REAL START

    // Check if the diagonal to the left is an empty space.
    if (contition) {
        // console.log('Passed Condition 1')
        if (space > 0) {
        // console.log('Space is larger than 0')
        if (board[row-subtract][space-1] == 0) {
            // console.log('Diagonal to the left is free.')
            possibleMoves.push({
                "row": row-subtract,
                "space": space-1,
                "kills": false
            })
        }
    }
    if (space < 7) {
        // console.log('Space is less than 7.')
        if (board[row-subtract][space+1] == 0) {
            // console.log('Diagonal to the right is free.')
            possibleMoves.push({
                "row": row-subtract,
                "space": space+1,
                "kills": false
            })
        }
    }
    }

    if (contition2) {
        // console.log('Passed contition 2')
    if (space > 1) {
        // console.log('Space is larger than 1.')
        if (board[row-subtract][space-1] == opp || board[row-subtract][space-1] == opp + 2) {
            // console.log('Diagonal to the left is an opp.')
            if(board[row-(subtract*2)][space-2] == 0) {
                // console.log('2 Diagonal to the left is free')
                possibleMoves.push({
                    "row": row-(subtract*2),
                    "space": space-2,
                    "kills": [row-subtract,space-1]
                })
            }
            
        }
    }
    if (space < 6) {
        // console.log('Space is less than 6')
        if (board[row-subtract][space+1] == opp || board[row-subtract][space+1] == opp + 2) {
            // console.log('Diagonal to the right is an opp')
            if(board[row-(subtract*2)][space+2] == 0) {
                // console.log('2 Diagonal to the right is free.')
                possibleMoves.push({
                    "row": row-(subtract*2),
                    "space": space+2,
                    "kills": [row-subtract,space+1]
                })
            }
            
        }
    }
    }
    return possibleMoves
}
function knowWhatYouSelected(row,space) {
    document.querySelector('#spaceClicked').innerHTML = `(Row: ${row}, Space: ${space})`;
    document.querySelector('#spaceData').innerHTML = board[row][space]
    let thing = "";
    if (board[row][space] == 0) {
        thing = "Empty Space";
    } else if (board[row][space] == 2) {
        thing = "Red Checker";
    } else if (board[row][space] == 1) {
        thing = "Black Checker"
    } else if (board[row][space] == 3) {
        thing = "Queen Black Checker"
    } else {
        thing = "Queen Red Checker"
    }
    document.querySelector('#spaceDataElab').innerHTML = thing;
    let fuckface = "";
    let aa = getPossibleMoves(row,space);
    if (aa != undefined || aa != false) {
        for (const x of aa) {
            fuckface += `,{ "row": ${x["row"]}, "space": ${x["space"]}, "kills": ${x["kills"]}}`
            fuckface = fuckface.replace(",","");
        }
    } else {
        fuckface = "undefined"
    }
    
    document.querySelector('#possibleMoves').innerHTML = fuckface
}
function move(row,space) {
    let kills;
    let orphanage = board[selectedSpace["row"]][selectedSpace["space"]];
    let possibleMoves = getPossibleMoves(selectedSpace["row"],selectedSpace["space"]);
    for (const x in possibleMoves) {
        if(possibleMoves[x]["row"] == row && possibleMoves[x]["space"] == space) {
            kills = possibleMoves[x]["kills"]
        }
    }
    board[row][space] = board[selectedSpace["row"]][selectedSpace["space"]]
    board[selectedSpace["row"]][selectedSpace["space"]] = 0;
    if (kills != false) {
        board[kills[0]][kills[1]] = 0;
    }
    
    turn = 0 - turn
    if (ai) {
        if (turn == -1) {
        makeAiMove()
    }
    }
    let redOcc = 0
    for (const row in board) {
        for (const space in board[row]) {
            if (board[row][space] == 2 || board[row][space] == 4) {
                redOcc++
            }
        }
    }
    if (redOcc == 0) {
        lose()
    }
}
function selectSpace(row,space,userInput) {
    if (turn == -1) {
        if (userInput == true) {
            return 0
        }
    }
    if (board[row][space] == 0) {
        let possibleMoves = getPossibleMoves(selectedSpace["row"],selectedSpace["space"]);
        let okay = false;
        for (const x of possibleMoves) {
            if (x["row"] == row && x["space"] == space) {
                okay = true;
            }
        }
        if (okay == true) {
            move(row,space)
        }
        
        // split
        selectedSpace["row"] = null;
        selectedSpace["space"] = null;
        return 0
    }
    if (selectedSpace["row"] == row) {
        if(selectedSpace["space"] == space) {
            selectedSpace["row"] = null;
            selectedSpace["space"] = null;
            return 0;
        }
    }
    selectedSpace["row"] = row;
    selectedSpace["space"] = space;
}
function updateGame() {
    boardDiv.querySelectorAll('#c0,#c1,#c2,#c3').forEach(element => {
        element.remove()
    })
    for (let x in board[0]) {
        if(board[0][x] == 2) {
            board[0][x] = 4;
        }
    }
    for (let x in board[7]) {
        if(board[7][x] == 1) {
            board[7][x] = 3;
        }
    }
    for (const row in board) {
        const rowInQuestion = boardDiv.querySelector(`div.row[id="${row}"]`)
        for (const space in board[row]) {
            const spaceInQuestion = rowInQuestion.querySelector(`div[id="${space}"]`)
            styleBoard();
            if (board[row][space] == "1") {
                spaceInQuestion.innerHTML = `
                <div class="checker" id="c1"></div>
                `
            } else if (board[row][space] == "2") {
                spaceInQuestion.innerHTML = `
                <div class="checker" id="c0"></div>
                `
            } else if (board[row][space] == "3") {
                spaceInQuestion.innerHTML = `
                <div class="checker" id="c2"></div>
                `
            } else if (board[row][space] == "4") {
                spaceInQuestion.innerHTML = `
                <div class="checker" id="c3"></div>
                `
            }
        }
    }
    childrenToArray(boardDiv.children).forEach((e)=>{
        e.style = "";
    })
    let pMfSC = getPossibleMoves(selectedSpace["row"],selectedSpace["space"])
    for (const x of pMfSC) {
        getSpaceDiv(x["row"],x["space"]).style.outline = "4px solid yellow";
        getSpaceDiv(x["row"],x["space"]).style.zIndex = "99";
        boardDiv.querySelector(`div.row[id="${x["row"]}"]`).style = "z-index: 98 !important;";
    }
    getSpaceDiv(selectedSpace["row"],selectedSpace["space"]).style.outline = "4px solid lime";
    getSpaceDiv(selectedSpace["row"],selectedSpace["space"]).style.zIndex = "100";
    boardDiv.querySelector(`div.row[id="${selectedSpace["row"]}"]`).style = "z-index: 99 !important;";
}


// finish

setInterval(() => {
    updateGame()
}, 0);