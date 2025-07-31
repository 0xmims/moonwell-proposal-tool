// src/pages/InstructionsPage.jsx - ENHANCED VERSION
import React from 'react';

function InstructionsPage() {
  return (
    <div>
      <h2>Welcome to the Moonwell Proposal Tool</h2>
      <p>
        This community-built tool is designed to simplify the process of creating on-chain governance proposals for Moonwell. It helps you generate the necessary artifacts (Calldata, JSON, and Markdown) in a safe and standardized way.
      </p>

      <h3>The Proposal Workflow</h3>
      <p>
        Creating a successful proposal involves more than just generating data. Here is the recommended workflow from start to finish:
      </p>
      <ol>
        <li>
          <strong>Discussion:</strong> Start by discussing your idea with the community on the <a href="https://forum.moonwell.fi/" target="_blank" rel="noopener noreferrer">Governance Forum</a>. This is a crucial step to gather feedback and build consensus.
        </li>
        <li>
          <strong>Select a Proposal Type:</strong> Use the navigation on the left to choose the type of proposal you want to create (e.g., Market Update, Market Creation).
        </li>
        <li>
          <strong>Fill Out the Form:</strong> Carefully fill in all the required parameters for your proposal. The tool will help you structure the title and content correctly.
        </li>
        <li>
          <strong>Generate Artifacts:</strong> Click the "Generate" button. This will produce the on-chain calldata and any other necessary files (like `proposal.md` or `parameters.json`).
        </li>
        <li>
          <strong>Create the Forum Post:</strong> Use the generated Markdown content as the body for your official proposal post on the Governance Forum.
        </li>
        <li>
          <strong>Submit On-Chain:</strong> Once the proposal has been discussed and is ready for a vote, copy the generated hexadecimal "Calldata" string. Go to the MultichainGovernor contract on Moonscan, connect your wallet, and submit a `propose` transaction, pasting the string into the "Hex Data" field.
        </li>
      </ol>

      <h3>Helpful Links</h3>
      <p>
        These resources are essential for participating in Moonwell governance.
      </p>
      <div className="helpful-links">
        <a href="https://forum.moonwell.fi/" target="_blank" rel="noopener noreferrer" className="link-button">
          Governance Forum
        </a>
        <a href="https://moonscan.io/address/0x9A8464C4C11CeA17e191653Deb7CdC1bE0864216F" target="_blank" rel="noopener noreferrer" className="link-button">
          Governor on Moonscan
        </a>
        <a href="https://docs.moonwell.fi/" target="_blank" rel="noopener noreferrer" className="link-button">
          Official Docs
        </a>
      </div>
    </div>
  );
}

export default InstructionsPage;