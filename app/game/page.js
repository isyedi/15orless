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
  };

  const handleGuess = async () => {
    const currentWord = clues[currentWordIndex].word;
    const guessResponse = await axios.post('/api/submit-guess', {
      guess: currentGuess,
      word: currentWord,
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
        setResult('Incorrect');
      } else {
        setResult('No more clues available for this word.');
        setIsGameOver(true);
      }
    }
    setCurrentGuess('');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>15 Words or Less Game</h1>
      <div className={styles.gameArea}>
        <p className={styles.clue}>
          Clue: {clues.length > 0 && clues[currentWordIndex]?.clues ? clues[currentWordIndex].clues[currentClueIndex] : 'Loading...'}
        </p>
        <input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
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

      <p className={styles.cluesUsed}>Clues Used: {currentClueIndex + 1} / 15</p>
      <button onClick={startGame} disabled={!isGameOver} className={styles.button}>Start New Game</button>
    </div>
  );
}
