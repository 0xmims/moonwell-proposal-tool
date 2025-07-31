// src/pages/MarketUpdatePage.jsx - CORRECTED
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { generateProposalData } from '../utils/proposalLogic.js';
import { GOVERNOR_ADDRESS } from '../contracts/addresses.js';
import ProposalTitleInput from '../components/ProposalTitleInput.jsx';

const MARKETS_URL = 'https://gist.githubusercontent.com/0xmims/7e9b2ceef27f5901bb0670ae9f6e0921/raw/803063c8e3368a86aec9b023694a66b1e5f5571e/markets.json';
const IRMS_URL = 'https://gist.githubusercontent.com/0xmims/bd32a5e0edc77c6c0baed14f9db77108/raw/c1c0876ccb3e98f7ec6cbf2d100a280db5b2c4f0/irms.json';

const generateMarkdownContent = (title, updates, irmsList) => {
  const specifications = updates
    .map(update => {
      const changes = [];
      if (update.collateralFactor) {
        changes.push(`- **New Collateral Factor:** \`${update.collateralFactor}\``);
      }
      if (update.reserveFactor) {
        changes.push(`- **New Reserve Factor:** \`${update.reserveFactor}\``);
      }
      if (update.irm) {
        const irmName = irmsList.find(i => i.address === update.irm)?.name || update.irm;
        changes.push(`- **New Interest Rate Model:** \`${irmName}\``);
      }
      if (changes.length === 0) return null;

      return `*   **${update.market}:**\n    ${changes.join('\n    ')}`;
    })
    .filter(Boolean)
    .join('\n');

  return `
${title}

## Summary
This proposal adjusts risk parameters for various markets on Moonwell Artemis to align with current market conditions and risk assessments.

## Motivation
The proposed changes are based on ongoing risk monitoring and aim to optimize capital efficiency while maintaining the safety and stability of the protocol. These adjustments ensure that the platform's parameters reflect the latest volatility and liquidity profiles of the assets.

## Specifications
The following risk parameters will be updated for the specified markets on the Base network:

${specifications}

## On-Chain Actions
The proposal will execute the parameter updates by generating and submitting the necessary calldata to the MultichainGovernor contract.
  `;
};

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

function MarketUpdatePage() {
  const [proposalTitle, setProposalTitle] = useState('');
  const [markets, setMarkets] = useState([]);
  const [irms, setIrms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketUpdates, setMarketUpdates] = useState([]);
  
  const [generatedCalldata, setGeneratedCalldata] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (MARKETS_URL.includes('YourUsername') || IRMS_URL.includes('YourUsername')) {
        setError("A Gist URL is still a placeholder. Please update it in MarketUpdatePage.jsx.");
        setIsLoading(false);
        return;
      }
      try {
        const [marketsResponse, irmsResponse] = await Promise.all([
          fetch(MARKETS_URL),
          fetch(IRMS_URL)
        ]);

        if (!marketsResponse.ok) throw new Error(`Failed to fetch markets: ${marketsResponse.status}`);
        if (!irmsResponse.ok) throw new Error(`Failed to fetch IRMs: ${irmsResponse.status}`);

        const marketsData = await marketsResponse.json();
        const irmsData = await irmsResponse.json();
        
        setMarkets(marketsData);
        setIrms(irmsData);

        if (marketsData.length > 0) {
          setMarketUpdates([{ market: marketsData[0].value, collateralFactor: '', reserveFactor: '', irm: '' }]);
        }
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addMarketUpdate = () => {
    if (markets.length > 0) {
      setMarketUpdates([...marketUpdates, { market: markets[0].value, collateralFactor: '', reserveFactor: '', irm: '' }]);
    }
  };

  const removeMarketUpdate = (index) => {
    const newUpdates = marketUpdates.filter((_, i) => i !== index);
    setMarketUpdates(newUpdates);
  };

  const handleUpdateChange = (index, field, value) => {
    const newUpdates = [...marketUpdates];
    newUpdates[index][field] = value;
    setMarketUpdates(newUpdates);
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setGeneratedCalldata('');
    setGeneratedJson('');
    setGeneratedMarkdown('');

    if (!proposalTitle.startsWith('# ')) {
      setStatusMessage('Error: Invalid proposal title generated.');
      return;
    }

    try {
      setStatusMessage('Generating proposal artifacts...');
      
      const markdownContent = generateMarkdownContent(proposalTitle, marketUpdates, irms);
      const proposalData = generateProposalData({ description: markdownContent, updates: marketUpdates });
      setGeneratedCalldata(proposalData.finalCalldata);

      const paramsJson = {
        "8453": {
          "markets": marketUpdates
            .filter(u => u.collateralFactor || u.reserveFactor || u.irm)
            .map(u => ({
              market: u.market,
              collateralFactor: u.collateralFactor ? ethers.parseUnits(u.collateralFactor, 18).toString() : "-1",
              reserveFactor: u.reserveFactor ? ethers.parseUnits(u.reserveFactor, 18).toString() : "-1",
              jrm: u.irm ? irms.find(i => i.address === u.irm)?.name || "" : ""
            }))
        }
      };
      setGeneratedJson(JSON.stringify(paramsJson, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2
      ));
      
      setGeneratedMarkdown(markdownContent);
      setStatusMessage('Proposal artifacts generated successfully!');
    } catch (error) {
      console.error("Failed to generate artifacts:", error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  if (isLoading) return <div>Loading markets and IRMs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Market Parameter Updates</h2>
      <p>Use this form to generate all necessary artifacts for a governance proposal.</p>
      <form onSubmit={handleGenerate}>
        <div className="form-group">
          <label>Proposal Title</label>
          <ProposalTitleInput onTitleChange={setProposalTitle} />
        </div>
        <hr />
        {marketUpdates.map((update, index) => (
          <div key={index} className="market-update-row">
            <h4>Market Update #{index + 1}</h4>
            <div className="form-group">
              <label>Market to Update</label>
              <select value={update.market} onChange={(e) => handleUpdateChange(index, 'market', e.target.value)}>
                {markets.map((market) => (<option key={market.value} value={market.value}>{market.name}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label>New Collateral Factor</label>
              <input type="text" value={update.collateralFactor} onChange={(e) => handleUpdateChange(index, 'collateralFactor', e.target.value)} placeholder="e.g., 0.75 (leave blank for no change)" />
            </div>
            <div className="form-group">
              <label>New Reserve Factor</label>
              <input type="text" value={update.reserveFactor} onChange={(e) => handleUpdateChange(index, 'reserveFactor', e.target.value)} placeholder="e.g., 0.15 (leave blank for no change)" />
            </div>
            <div className="form-group">
              <label>New Interest Rate Model</label>
              <select value={update.irm} onChange={(e) => handleUpdateChange(index, 'irm', e.target.value)}>
                <option value="">-- No Change --</option>
                {irms.map((irm) => (<option key={irm.address} value={irm.address}>{irm.name}</option>))}
              </select>
            </div>
            <button type="button" onClick={() => removeMarketUpdate(index)} className="remove-button">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMarketUpdate} className="add-button">+ Add Another Market Update</button>
        <hr />
        <button type="submit" className="generate-button">Generate Proposal Artifacts</button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
      
      {generatedCalldata && (
        <div className="result-box">
          <h3>Proposal.md</h3>
          <p>Download this file and use it as the body of the governance forum post.</p>
          <button onClick={() => downloadFile(generatedMarkdown, 'proposal.md', 'text/markdown')}>Download proposal.md</button>
          <textarea readOnly value={generatedMarkdown} style={{ width: '100%', height: '200px', marginTop: '10px' }} />

          <h3>Parameters.json</h3>
          <p>This file is used by developers with the command-line tools for verification.</p>
          <button onClick={() => downloadFile(generatedJson, 'parameters.json', 'application/json')}>Download parameters.json</button>
          <textarea readOnly value={generatedJson} style={{ width: '100%', height: '150px', marginTop: '10px' }} />

          <h3>On-Chain Calldata</h3>
          <p>Copy the text below and paste it into the "Hex Data" field when submitting the proposal on-chain via Moonscan.</p>
          <p><strong>Governor Address:</strong> {GOVERNOR_ADDRESS}</p>
          <textarea readOnly value={generatedCalldata} style={{ width: '100%', height: '150px', marginTop: '10px' }} onClick={(e) => e.target.select()} />
        </div>
      )}
    </div>
  );
}

export default MarketUpdatePage;