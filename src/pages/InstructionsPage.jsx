import React from 'react';

function InstructionsPage() {
  return (
    <div>
      <h2>Instructions</h2>
      <p>Welcome to the Moonwell Proposal Calldata Generator.</p>
      <ol>
        <li>Select the type of proposal you want to create from the navigation bar.</li>
        <li>Fill out the form with the required parameters.</li>
        <li>Click the "Generate Calldata" button.</li>
        <li>Copy the generated hexadecimal string from the text box.</li>
        <li>Go to Moonscan, find the MultichainGovernor contract, and submit a transaction, pasting the copied data into the "Hex Data" field.</li>
      </ol>
    </div>
  );
}

export default InstructionsPage;