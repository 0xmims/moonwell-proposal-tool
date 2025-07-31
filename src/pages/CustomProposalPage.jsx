// src/pages/CustomProposalPage.jsx - CORRECTED
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { GOVERNOR_ADDRESS } from '../contracts/addresses.js';
import ProposalTitleInput from '../components/ProposalTitleInput.jsx';

const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

function CustomProposalPage() {
  const [proposalTitle, setProposalTitle] = useState('');
  const [actions, setActions] = useState([
    { target: '', func: '', args: '', value: '0' }
  ]);
  
  const [generatedCalldata, setGeneratedCalldata] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleActionChange = (index, field, value) => {
    const newActions = [...actions];
    newActions[index][field] = value;
    setActions(newActions);
  };

  const addAction = () => {
    setActions([...actions, { target: '', func: '', args: '', value: '0' }]);
  };

  const removeAction = (index) => {
    const newActions = actions.filter((_, i) => i !== index);
    setActions(newActions);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setGeneratedCalldata('');
    setStatusMessage('Generating calldata...');

    try {
      const allTargets = [];
      const allValues = [];
      const allCalldatas = [];

      for (const action of actions) {
        if (!ethers.isAddress(action.target)) {
          throw new Error(`Invalid Target Address: ${action.target}`);
        }

        const iface = new ethers.Interface([`function ${action.func}`]);
        const functionFragment = iface.fragments[0];
        const args = action.args.split('\n').map(arg => arg.trim()).filter(Boolean);

        allTargets.push(action.target);
        allValues.push(ethers.parseEther(action.value || '0'));
        allCalldatas.push(iface.encodeFunctionData(functionFragment, args));
      }

      const governorInterface = new ethers.Interface([
        "function propose(address[],uint256[],bytes[],string)"
      ]);

      const finalCalldata = governorInterface.encodeFunctionData("propose", [
        allTargets,
        allValues,
        allCalldatas,
        proposalTitle
      ]);

      setGeneratedCalldata(finalCalldata);
      setStatusMessage('Calldata generated successfully!');

    } catch (error) {
      console.error("Calldata generation error:", error);
      setStatusMessage(`Error: ${error.message}. Please check your inputs.`);
    }
  };

  return (
    <div>
      <h2>Custom Proposal Generator</h2>
      <p>This is an advanced tool. Use it to generate calldata for any on-chain action. Ensure all inputs are correct, as invalid data can lead to a failed proposal.</p>
      
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Proposal Title</label>
          <ProposalTitleInput onTitleChange={setProposalTitle} />
        </div>
        <hr />

        {actions.map((action, index) => (
          <div key={index} className="market-update-row">
            <h4>Action #{index + 1}</h4>
            <div className="form-group">
              <label>Target Contract Address</label>
              <input type="text" placeholder="0x..." value={action.target} onChange={(e) => handleActionChange(index, 'target', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Function Signature</label>
              <input type="text" placeholder="e.g., transfer(address to, uint256 amount)" value={action.func} onChange={(e) => handleActionChange(index, 'func', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Arguments (one per line)</label>
              <textarea placeholder={'0x123...\n1000000000000000000'} value={action.args} onChange={(e) => handleActionChange(index, 'args', e.target.value)} rows={3} />
            </div>
            <div className="form-group">
              <label>Value (ETH to send)</label>
              <input type="text" placeholder="0.0" value={action.value} onChange={(e) => handleActionChange(index, 'value', e.target.value)} required />
            </div>
            {actions.length > 1 && (
              <button type="button" onClick={() => removeAction(index)} className="remove-button">
                Remove Action
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addAction} className="add-button">
          + Add Another Action
        </button>
        <hr />
        <button type="submit" className="generate-button">Generate Calldata</button>
      </form>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {generatedCalldata && (
        <div className="result-box">
          <h3>Generated Calldata</h3>
          <p>Copy the text below and paste it into the "Hex Data" field when sending a transaction to the Governor contract on Moonscan.</p>
          <p><strong>Governor Address:</strong> {GOVERNOR_ADDRESS}</p>
          <textarea
            readOnly
            value={generatedCalldata}
            style={{ width: '100%', height: '150px', marginTop: '10px' }}
            onClick={(e) => e.target.select()}
          />
        </div>
      )}
    </div>
  );
}

export default CustomProposalPage;