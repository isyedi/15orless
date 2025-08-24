"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [dailyWords, setDailyWords] = useState(null);

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
      const response = await axios.post('/api/populate-words');
      setMessage(response.data.message);
      fetchWordCount();
    } catch (error) {
      setMessage("Error generating words: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDailyWords = async () => {
    setLoading(true);
    setMessage('');
    setDailyWords(null);
    try {
      const response = await axios.post('/api/generate-todays-words');
      setMessage(response.data.message);
      setDailyWords(response.data.words);
    } catch (error) {
      setMessage("Error generating daily words: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDailyFeature = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/populate-words-2');
      setMessage(response.data.message);
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
      <p>Click the buttons below to generate new words and clues.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleGenerateWords} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>
          {loading ? 'Generating...' : 'Generate New Words (Legacy)'}
        </button>

        <button onClick={handleGenerateDailyWords} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px', marginRight: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          {loading ? 'Generating...' : 'Generate Today&apos;s Daily Words'}
        </button>

        <button onClick={handleDailyFeature} disabled={loading} style={{ padding: '10px 20px', fontSize: '16px' }}>
          {loading ? 'Generating...' : 'Generate Words For A New Day (revision)'}
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: message.includes('Error') ? '#ffebee' : '#e8f5e8', 
          border: `1px solid ${message.includes('Error') ? '#f44336' : '#4caf50'}`, 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong>{message.includes('Error') ? 'Error:' : 'Success:'}</strong> {message}
        </div>
      )}

      {dailyWords && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          border: '1px solid #2196f3', 
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <h3>Today&apos;s Generated Words:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {dailyWords.map((wordData, index) => (
              <div key={index} style={{ 
                padding: '10px', 
                backgroundColor: 'white', 
                border: '1px solid #ddd', 
                borderRadius: '4px' 
              }}>
                <strong>Word {index + 1}:</strong> {wordData.word}
                <br />
                <strong>Clues:</strong> {wordData.clues.join(', ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
