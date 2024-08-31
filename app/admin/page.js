// app/admin/page.js

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    fetchWordCount();
  }, []);

  const fetchWordCount = async () => {
    try {
      const response = await axios.get('/api/word-count');
      setWordCount(response.data.count);
    } catch (error) {
      console.error("Error fetching word count:", error);
    }
  };

  const handleGenerateWords = async () => {
    setLoading(true);
    setMessage('');
    try {
      let generatedWords = 0;
      const maxWords = 8;

      while (generatedWords < maxWords) {
        const response = await axios.post('/api/populate-words');
        if (response.data.success) {
          generatedWords++;
          setMessage(prevMessage => prevMessage + `Word ${generatedWords} added: ${response.data.word}\n`);
        } else {
          setMessage(prevMessage => prevMessage + `Error generating word ${generatedWords + 1}: ${response.data.message}\n`);
        }
      }

      fetchWordCount();

    } catch (error) {
      setMessage("Error generating words: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClearWords = async () => {
    setClearing(true);
    setMessage('');
    try {
      const response = await axios.post('/api/clear-words');
      setMessage(response.data.message);
      fetchWordCount();
    } catch (error) {
      setMessage("Error clearing words: " + (error.response?.data?.message || error.message));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <h1>Admin Page</h1>
      <div style={{ position: 'absolute', top: '20px', right: '20px'}}>
        <p>Total Words: {wordCount}</p>
      </div>
      <p>Click the button below to generate new words and clues.</p>
      
      <button onClick={handleGenerateWords} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Generating...' : 'Generate New Words'}
      </button>

      <button onClick={handleClearWords} disabled={loading || clearing} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {clearing ? 'Clearing...' : 'Clear All Words'}
      </button>

      
      {message && <p>{message}</p>}
    </div>
  );
}
