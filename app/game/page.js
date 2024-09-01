"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Game.module.css';  // Import the CSS module

export default function Game() {
  const [clues, setClues] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [result, setResult] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [guessedWords, setGuessedWords] = useState(Array(8).fill(false));  // Track which words have been guessed
  const [totalCluesUsed, setTotalCluesUsed] = useState(0);  // Track total number of clues used
  const [time, setTime] = useState(0);  // Track the time elapsed

  useEffect(() => {
    let timer;
    if (!isGameOver) {
      timer = setInterval(() => setTime((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isGameOver]);

  useEffect(() => {
    startGame();
  }, []);

  const startGame = async () => {
    const response = await axios.get('/api/start-game');
    setClues(response.data.clues);
    setCurrentWordIndex(0);
    setCurrentClueIndex(0);
    setCurrentGuess('');
    setResult(null);
    setIsGameOver(false);
    setGuessedWords(Array(8).fill(false));  // Reset guessed words for a new game
    setTotalCluesUsed(0);  // Reset total clues used for a new game
    setTime(0);  // Reset timer for a new game
  };

  const handleGuess = async () => {
    const currentWord = clues[currentWordIndex].word;
    
    // Normalize both the guess and the correct word
    const normalizedGuess = currentGuess.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const normalizedWord = currentWord.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
    const guessResponse = await axios.post('/api/submit-guess', {
      guess: normalizedGuess,
      word: normalizedWord,
    });

    if (guessResponse.data.result === 'correct') {
      setResult('Correct');
      const newGuessedWords = [...guessedWords];
      newGuessedWords[currentWordIndex] = true;  // Mark the word as guessed
      setGuessedWords(newGuessedWords);

      if (currentWordIndex < clues.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentClueIndex(0);
        setCurrentGuess('');
      } else {
        setIsGameOver(true);
        setResult('You have guessed all the words correctly!');
      }
    } else {
      if (currentClueIndex < clues[currentWordIndex].clues.length - 1) {
        setCurrentClueIndex(currentClueIndex + 1);
        setTotalCluesUsed(totalCluesUsed + 1);  // Increment total clues used
        setResult('Incorrect');
      } else {
        setResult('No more clues available for this word.');
        setIsGameOver(true);
      }
    }
    setTotalCluesUsed(totalCluesUsed + 1);  // Increment total clues used for every guess
    setCurrentGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isGameOver) {
      handleGuess();  // Trigger the handleGuess function when Enter is pressed
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>15 Words or Less Game</h1>
      <p className={styles.timer}>Time Elapsed: {time} seconds</p>
      <div className={styles.gameArea}>
        <p className={styles.clue}>
          Clue: {clues.length > 0 && clues[currentWordIndex]?.clues ? clues[currentWordIndex].clues[currentClueIndex] : 'Loading...'}
        </p>
        <input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          onKeyPress={handleKeyPress}  // Add onKeyPress event listener
          className={styles.input}
        />
        <br />
        <button onClick={handleGuess} disabled={isGameOver} className={styles.button}>Submit Guess</button>
      </div>

      {/* Gray boxes for words */}
      <div className={styles.boxContainer}>
        {guessedWords.map((guessed, index) => (
          <div
            key={index}
            className={`${styles.box} ${guessed ? styles.guessed : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      {/* Move result under the grey boxes */}
      {result && <p className={styles.result}>{result}</p>}

      <p className={styles.cluesUsed}>Clues Used: {totalCluesUsed} / 15</p>
      <button onClick={startGame} disabled={!isGameOver} className={styles.button}>Start New Game</button>
    </div>
  );
}
