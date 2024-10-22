import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/process', { input });
      setOutput(response.data.output);
    } catch (error) {
      console.error('Error processing input:', error);
    }
  };

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Process</button>
      <div>Output: {output}</div>
    </div>
  );
};

export default App:
