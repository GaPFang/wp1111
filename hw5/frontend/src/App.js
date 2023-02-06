import React, { useState } from 'react'
import { guess, startGame } from './axios'

function App() {
    const [hasStarted, setHasStarted] = useState(false)
    const [hasWon, setHasWon] = useState(false)
    const [number, setNumber] = useState('')
    const [status, setStatus] = useState('')
    const [notes, setNotes] = useState([])

    const handleGuess = async () => {
        const response = await guess(number);
    
        if (response === 'Equal') setHasWon(true);
        else {
            setStatus(response);
            setNumber('');
            if (response !== undefined) {
                setNotes(prev => {
                    return [...prev, (`${response} than ${number}.`)]
                })
            }
        }
    }
    
    const startMenu = <div>
        <button onClick = {
            // someFunctionToBackend; and setHasStarted
            async() => {
                const msg = await startGame()
                if (msg === 'The game has started.') {
                    setHasStarted(true)
                }
            }
        } > start game </button>
    </div>

    const gameMode = <>
        <p>Guess a number between 1 to 100</p>
        <input type='number'
            // Get the value from input
            onChange={event => {
                setNumber(event.target.value)
            }}
        ></input>
        <button // Send number to backend
            onClick={handleGuess}
            disabled={!number}
        >guess!</button>
        {notes.map(note => {
            return <p>{note}<br/></p>
        })}
    </>

    const winningMode = <>
        <p>You won! The number was {number}.</p>
        <button //Handle restart for backend and frontend
            onClick={
                async() => {
                    const msg = await startGame()
                    if (msg === 'The game has started.') {
                        setHasStarted(true)
                        setHasWon(false)
                        setNumber('')
                        setStatus('')
                        setNotes([])
                    }
                }
            }
        >restart</button>
    </>

    const game = <div>
        {hasWon ? winningMode : gameMode}
    </div>

    return <div className="App">
        {hasStarted ? game : startMenu}
    </div>
}

export default App
