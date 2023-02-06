/****************************************************************************
  FileName      [ Board.js ]
  PackageName   [ src/components ]
  Author        [ Cheng-Hua Lu ]
  Synopsis      [ This file generates the Board. ]
  Copyright     [ 2022 10 ]
****************************************************************************/

import './css/Board.css'
import Cell from './Cell';
import Modal from './Modal';
import Dashboard from './Dashboard';
import { revealed } from '../util/reveal';
import createBoard from '../util/createBoard';
import React, { useEffect, useState } from 'react';


const Board = ({ boardSize, mineNum, backToHome }) => {
    const [board, setBoard] = useState([]);                     // An 2-dimentional array. It is used to store the board.
    const [nonMineCount, setNonMineCount] = useState(boardSize * boardSize - mineNum);        // An integer variable to store the number of cells whose value are not '💣'.
    const [mineLocations, setMineLocations] = useState([]);     // An array to store all the coordinate of '💣'.
    const [gameOver, setGameOver] = useState(false);            // A boolean variable. If true, means you lose the game (Game over).
    const [remainFlagNum, setRemainFlagNum] = useState(mineNum);      // An integer variable to store the number of remain flags.
    const [win, setWin] = useState(false);                      // A boolean variable. If true, means that you win the game.

    useEffect(() => {
        // Calling the function
        freshBoard();
    }, []);

    useEffect(() => {
        if (nonMineCount === 0) {
            setGameOver(true);
            setWin(true);
        }
    }, [nonMineCount])

    // Creating a board
    const freshBoard = () => {
        const newBoard = createBoard(boardSize, mineNum);
        setBoard(newBoard.board);
        setMineLocations(newBoard.mineLocations);
    }

    const restartGame = () => {
        freshBoard();
        setGameOver(false);
        setWin(false);
        setNonMineCount(boardSize * boardSize - mineNum);
        setRemainFlagNum(mineNum);
    }

    // On Right Click / Flag Cell
    const updateFlag = (e, x, y) => {
        // To not have a dropdown on right click
        e.preventDefault();
        // Deep copy of a state
        let newBoard = JSON.parse(JSON.stringify(board));
        let newFlagNum = remainFlagNum;

        if (newBoard[x][y].revealed === true) return;
        if (newBoard[x][y].flagged === true) {
            newBoard[x][y].flagged = false;
            newFlagNum += 1;
        } else if (newBoard[x][y].flagged === false && remainFlagNum > 0) {
            newBoard[x][y].flagged = true;
            newFlagNum -= 1;
        }
        setBoard(newBoard);
        setRemainFlagNum(newFlagNum);
    };

    const revealCell = (x, y) => {
        if (board[x][y].revealed || gameOver || board[x][y].flagged) return;
        let newBoard = JSON.parse(JSON.stringify(board));
        let result = revealed(newBoard, x, y, nonMineCount);
        setNonMineCount(result.newNonMinesCount);
        if (board[x][y].value === '💣') {
            setGameOver(true);
            mineLocations.forEach(pos => {
                result = revealed(result.board, pos[0], pos[1], nonMineCount)
            })
        }
        setBoard(result.board);
    };

    return <>
        <div className='boardPage' >
            <div className='boardWrapper' >
                <div className='boardContainer'>
                    <Dashboard remainFlagNum={remainFlagNum} gameOver={gameOver} />
                    {board.map((row, i) => {
                        return (<div id={`row${i}`} style={{display: 'flex'}}>
                            {row.map((cell, j) => {
                                return <Cell id={`${i}-${j}`} rowIdx={i} colIdx={j} detail={cell} updateFlag={updateFlag} revealCell={revealCell} />
                            })}
                        </div>)
                    })}
                </div>
            </div>
        </div>
        {gameOver ? <Modal restartGame={restartGame} backToHome={backToHome} gameOver={gameOver} win={win} /> : null}
    </>
}

export default Board