// app/admin/page.js

"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Admin() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleGenerateWords = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('/api/populate-words');
      setMessage(response.data.message);
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
    } catch (error) {
      setMessage("Error clearing words: " + (error.response?.data?.message || error.message));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Page</h1>
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
