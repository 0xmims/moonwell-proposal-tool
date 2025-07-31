// src/components/ProposalTitleInput.jsx
import React, { useState, useEffect } from 'react';

function ProposalTitleInput({ onTitleChange }) {
  // State to manage the individual pieces of the title
  const [prefix, setPrefix] = useState('MIP-B');
  const [number, setNumber] = useState('XX');
  const [description, setDescription] = useState('Weekly Risk Parameter Updates');
  
  // Auto-generate the date string, e.g., (07/2025)
  const currentDate = new Date();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();
  const dateString = `(${month}/${year})`;

  // Whenever a piece of the title changes, reconstruct the full title and send it to the parent
  useEffect(() => {
    const fullTitle = `${prefix}${number}: ${description} ${dateString}`;
    onTitleChange(fullTitle);
  }, [prefix, number, description, dateString, onTitleChange]);

  return (
    <div className="proposal-title-builder">
      <div className="title-prefix-group">
        {/* The "#" is now static text, not part of the input */}
        <span className="title-hash">#</span>
        <select value={prefix} onChange={(e) => setPrefix(e.target.value)}>
          <option value="MIP-B">MIP-B (Base)</option>
          <option value="MIP-O">MIP-O (Optimism)</option>
          <option value="MIP-M">MIP-M (Moonbeam)</option>
          <option value="MIP-R">MIP-R (Moonriver)</option>
          <option value="MIP-X">MIP-X (All Networks)</option>
        </select>
        <input 
          type="text" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          className="title-number-input"
          placeholder="XX"
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="e.g., Anthias Labs Monthly Recommendations"
        />
      </div>
    </div>
  );
}

export default ProposalTitleInput;