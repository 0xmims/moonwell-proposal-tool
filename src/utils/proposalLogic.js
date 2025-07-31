// src/utils/proposalLogic.js - IRM UPDATE VERSION
import { ethers } from 'ethers';
import { comptrollerABI, mTokenABI } from '../contracts/abis.js';
import { COMPTROLLER_ADDRESS, MTOKEN_ADDRESSES } from '../contracts/addresses.js';

export const generateProposalData = (formData) => {
  const { description, updates } = formData;
  
  const allTargets = [];
  const allCalldatas = [];

  const comptrollerInterface = new ethers.Interface(comptrollerABI);
  const mTokenInterface = new ethers.Interface(mTokenABI);

  for (const update of updates) {
    // Destructure the new 'irm' field from the update object
    const { market, collateralFactor, reserveFactor, irm } = update;

    // Skip if all fields are blank for this row
    if (!collateralFactor && !reserveFactor && !irm) {
      continue;
    }

    const mTokenAddress = MTOKEN_ADDRESSES[market];
    if (!mTokenAddress) {
      throw new Error(`Address for market ${market} not found.`);
    }

    if (collateralFactor) {
      allTargets.push(COMPTROLLER_ADDRESS);
      const calldata = comptrollerInterface.encodeFunctionData("_setCollateralFactor", [
        mTokenAddress,
        ethers.parseUnits(collateralFactor, 18)
      ]);
      allCalldatas.push(calldata);
    }

    if (reserveFactor) {
      allTargets.push(mTokenAddress);
      const calldata = mTokenInterface.encodeFunctionData("_setReserveFactor", [
        ethers.parseUnits(reserveFactor, 18)
      ]);
      allCalldatas.push(calldata);
    }

    // NEW LOGIC BLOCK FOR IRM UPDATES
    if (irm) { // 'irm' will be the address of the new IRM contract
      allTargets.push(mTokenAddress); // The target is the mToken itself
      const calldata = mTokenInterface.encodeFunctionData("_setInterestRateModel", [
        irm // Pass the address directly
      ]);
      allCalldatas.push(calldata);
    }
  }

  if (allTargets.length === 0) {
    throw new Error("No parameters were set. Please fill out at least one field to update.");
  }

  const governorInterface = new ethers.Interface([
    "function propose(address[],uint256[],bytes[],string)"
  ]);

  const finalCalldata = governorInterface.encodeFunctionData("propose", [
    allTargets,
    allTargets.map(() => 0),
    allCalldatas,
    description
  ]);

  return {
    targets: allTargets,
    calldatas: allCalldatas,
    description,
    finalCalldata
  };
};