"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [wordCount, setWordCount] = useState(0);  // New state to track word count

  useEffect(() => {
    fetchWordCount();  // Fetch word count on component mount
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
      const response = await axios.post('/api/-words');
      setMessage(response.data.message);
      fetchWordCount();  // Update word count after generating words
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
      fetchWordCount();  // Update word count after clearing words
    } catch (error) {
      setMessage("Error clearing words: " + (error.response?.data?.message || error.message));
    } finally {
      setClearing(false);
    }
  };

  const handleDailyFeature = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/-words-2');
      setMessage(response.data.message);
      //fetchWordCount();  // Update word count after generating words
    } catch (error) {
      setMessage("Error generating words: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '18px', fontWeight: 'bold' }}>
        Word Count: {wordCount}
      </div>
      <h1>Admin Page</h1>
      <p>Click the button below to generate new words and clues.</p>
      
      <button onClick={handleGenerateWords} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Generating...' : 'Generate New Words'}
      </button>

      <button onClick={handleClearWords} disabled={loading || clearing} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
        {clearing ? 'Clearing...' : 'Clear All Words'}
      </button>

      <button onClick = {handleDailyFeature} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {loading ? 'Generating...' : 'Generate Words For A New Day (revision)'}
      </button>

      {/* <button onClick={handleClearWords} disabled={loading || clearing} style={{ padding: '10px 20px', fontSize: '16px', marginLeft: '10px' }}>
        {clearing ? 'Clearing...' : 'Clear All Words'}
      </button> */}


      {message && <p>{message}</p>}




    </div>
  );
}
