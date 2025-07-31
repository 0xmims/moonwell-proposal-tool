// src/pages/MarketCreationPage.jsx - CORRECTED
import React, { useState } from 'react';
import { ethers } from 'ethers';
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

const generateMarketCreationMarkdown = (title, params) => {
  return `
${title}

## Summary
This proposal is to list the ${params.symbol} token on Moonwell Artemis (Base). This will diversify the assets available on the platform and provide new opportunities for users.

## Motivation
Listing ${params.symbol} will enhance the utility of the Moonwell protocol by adding a new, in-demand asset. The initial risk parameters have been carefully selected based on a thorough analysis of the asset's market capitalization, liquidity, and volatility to ensure the safety of the protocol.

## Specifications
The following asset will be added to the protocol with the specified parameters:

*   **Token:** ${params.symbol}
*   **mToken Name:** ${params.name}
*   **mToken Symbol:** ${params.addressesString}
*   **Underlying Address:** \`${params.tokenAddressName}\`
*   **Price Feed Name:** \`${params.priceFeedName}\`

### Risk Parameters
*   **Collateral Factor:** \`${params.collateralFactor}\`
*   **Reserve Factor:** \`${params.reserveFactor}\`
*   **Supply Cap:** \`${params.supplyCap}\`
*   **Borrow Cap:** \`${params.borrowCap}\`
*   **Protocol Seize Share:** \`${params.seizeShare}\`

### Interest Rate Model (Jump Rate Model)
*   **Base Rate Per Year:** \`${params.jrm.baseRatePerYear}\`
*   **Multiplier Per Year (Slope 1):** \`${params.jrm.multiplierPerYear}\`
*   **Kink (Utilization Threshold):** \`${params.jrm.kink}\`
*   **Jump Multiplier Per Year (Slope 2):** \`${params.jrm.jumpMultiplierPerYear}\`

## On-Chain Actions
A developer will use the generated \`new-market.json\` file with the official Moonwell proposal scripts to execute the on-chain transactions required to deploy and configure this new market.
  `;
};

function MarketCreationPage() {
  const [marketParams, setMarketParams] = useState({
    addressesString: 'MOONWELL_NEWTOKEN',
    borrowCap: '1000000',
    collateralFactor: '0.75',
    initialMintAmount: '100',
    name: 'Moonwell NEWTOKEN',
    priceFeedName: 'CHAINLINK_NEWTOKEN_USD',
    reserveFactor: '0.15',
    seizeShare: '0.01',
    supplyCap: '2000000',
    symbol: 'NEWTOKEN',
    tokenAddressName: '0x...',
    jrm: {
      baseRatePerYear: '0.02',
      jumpMultiplierPerYear: '2.5',
      kink: '0.8',
      multiplierPerYear: '0.1',
    },
  });

  const [proposalTitle, setProposalTitle] = useState('');
  const [generatedJson, setGeneratedJson] = useState('');
  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleParamChange = (e) => {
    const { name, value } = e.target;
    const [parent, child] = name.split('.');

    if (child) {
      setMarketParams(prevParams => ({
        ...prevParams,
        [parent]: {
          ...prevParams[parent],
          [child]: value,
        }
      }));
    } else {
      setMarketParams(prevParams => ({
        ...prevParams,
        [name]: value,
      }));
    }
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    setGeneratedJson('');
    setGeneratedMarkdown('');

    try {
      setStatusMessage('Generating proposal kit...');

      const formattedParams = JSON.parse(JSON.stringify(marketParams));

      formattedParams.collateralFactor = ethers.parseUnits(marketParams.collateralFactor, 18).toString();
      formattedParams.reserveFactor = ethers.parseUnits(marketParams.reserveFactor, 18).toString();
      formattedParams.seizeShare = ethers.parseUnits(marketParams.seizeShare, 18).toString();
      formattedParams.jrm.baseRatePerYear = ethers.parseUnits(marketParams.jrm.baseRatePerYear, 18).toString();
      formattedParams.jrm.multiplierPerYear = ethers.parseUnits(marketParams.jrm.multiplierPerYear, 18).toString();
      formattedParams.jrm.jumpMultiplierPerYear = ethers.parseUnits(marketParams.jrm.jumpMultiplierPerYear, 18).toString();
      formattedParams.jrm.kink = ethers.parseUnits(marketParams.jrm.kink, 18).toString();
      
      const paramsJson = {
        "8453": [formattedParams]
      };
      setGeneratedJson(JSON.stringify(paramsJson, null, 2));

      const markdownContent = generateMarketCreationMarkdown(proposalTitle, marketParams);
      setGeneratedMarkdown(markdownContent);

      setStatusMessage('Proposal kit generated successfully!');
    } catch (error) {
      console.error("Failed to generate kit:", error);
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Market Creation Assistant</h2>
      <p>Fill out this form to generate a "Proposal Kit" for listing a new asset. This kit includes the necessary JSON and Markdown files for a developer to submit the proposal on-chain.</p>
      
      <form onSubmit={handleGenerate}>
        <h3>Proposal Details</h3>
        <div className="form-group">
          <label>Proposal Title</label>
          <ProposalTitleInput onTitleChange={setProposalTitle} />
        </div>

        <h3>Token & Market Details</h3>
        <div className="form-group">
          <label>Underlying Token Address</label>
          <input type="text" name="tokenAddressName" value={marketParams.tokenAddressName} onChange={handleParamChange} placeholder="0x..." required />
        </div>
        <div className="form-group">
          <label>Underlying Token Symbol (e.g., "WBTC")</label>
          <input type="text" name="symbol" value={marketParams.symbol} onChange={handleParamChange} placeholder="WBTC" required />
        </div>
        <div className="form-group">
          <label>mToken Name (e.g., "Moonwell Wrapped Bitcoin")</label>
          <input type="text" name="name" value={marketParams.name} onChange={handleParamChange} placeholder="Moonwell Wrapped Bitcoin" required />
        </div>
        <div className="form-group">
          <label>mToken Symbol (e.g., "mWBTC")</label>
          <input type="text" name="addressesString" value={marketParams.addressesString} onChange={handleParamChange} placeholder="mWBTC" required />
        </div>
        <div className="form-group">
          <label>Price Feed Name (for Address Book, e.g., "CHAINLINK_WBTC_USD")</label>
          <input type="text" name="priceFeedName" value={marketParams.priceFeedName} onChange={handleParamChange} placeholder="CHAINLINK_WBTC_USD" required />
        </div>

        <h3>Risk Parameters</h3>
        <div className="form-group">
          <label>Supply Cap (in full units, e.g., 2000)</label>
          <input type="text" name="supplyCap" value={marketParams.supplyCap} onChange={handleParamChange} placeholder="2000" required />
        </div>
        <div className="form-group">
          <label>Borrow Cap (in full units, e.g., 1000)</label>
          <input type="text" name="borrowCap" value={marketParams.borrowCap} onChange={handleParamChange} placeholder="1000" required />
        </div>
        <div className="form-group">
          <label>Collateral Factor (e.g., 0.75 for 75%)</label>
          <input type="text" name="collateralFactor" value={marketParams.collateralFactor} onChange={handleParamChange} placeholder="0.75" required />
        </div>
        <div className="form-group">
          <label>Reserve Factor (e.g., 0.15 for 15%)</label>
          <input type="text" name="reserveFactor" value={marketParams.reserveFactor} onChange={handleParamChange} placeholder="0.15" required />
        </div>
        <div className="form-group">
          <label>Protocol Seize Share (e.g., 0.01 for 1%)</label>
          <input type="text" name="seizeShare" value={marketParams.seizeShare} onChange={handleParamChange} placeholder="0.01" required />
        </div>
        <div className="form-group">
          <label>Initial Mint Amount (a small amount to seed the market)</label>
          <input type="text" name="initialMintAmount" value={marketParams.initialMintAmount} onChange={handleParamChange} placeholder="100" required />
        </div>

        <h3>Interest Rate Model Parameters</h3>
        <div className="form-group">
          <label>Base Rate Per Year (e.g., 0.02 for 2%)</label>
          <input type="text" name="jrm.baseRatePerYear" value={marketParams.jrm.baseRatePerYear} onChange={handleParamChange} placeholder="0.02" required />
        </div>
        <div className="form-group">
          <label>Multiplier Per Year (Slope 1)</label>
          <input type="text" name="jrm.multiplierPerYear" value={marketParams.jrm.multiplierPerYear} onChange={handleParamChange} placeholder="0.1" required />
        </div>
        <div className="form-group">
          <label>Kink (Utilization point where slope changes, e.g., 0.8 for 80%)</label>
          <input type="text" name="jrm.kink" value={marketParams.jrm.kink} onChange={handleParamChange} placeholder="0.8" required />
        </div>
        <div className="form-group">
          <label>Jump Multiplier Per Year (Slope 2)</label>
          <input type="text" name="jrm.jumpMultiplierPerYear" value={marketParams.jrm.jumpMultiplierPerYear} onChange={handleParamChange} placeholder="2.5" required />
        </div>

        <hr />
        <button type="submit" className="generate-button">Generate Proposal Kit</button>
      </form>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {generatedJson && (
        <div className="result-box">
          <h3>new-market.json</h3>
          <p>Download this file and provide it to a developer for on-chain submission.</p>
          <button onClick={() => downloadFile(generatedJson, 'new-market.json', 'application/json')}>Download new-market.json</button>
          <textarea readOnly value={generatedJson} style={{ width: '100%', height: '250px', marginTop: '10px' }} />

          <h3>proposal.md</h3>
          <p>Download this file and use it as the body of the governance forum post.</p>
          <button onClick={() => downloadFile(generatedMarkdown, 'proposal.md', 'text/markdown')}>Download proposal.md</button>
          <textarea readOnly value={generatedMarkdown} style={{ width: '100%', height: '250px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}

export default MarketCreationPage;