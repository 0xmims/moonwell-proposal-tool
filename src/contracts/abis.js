// src/contracts/abis.js

// This is the "user manual" for the main Governor contract.
// It tells ethers.js how to format the createProposal function call.
export const governorABI = [
  "function createProposal(address[] targets, uint256[] values, bytes[] calldatas, string description)"
];

// This is the "user manual" for the Comptroller contract.
export const comptrollerABI = [
  "function _setCollateralFactor(address mToken, uint newCollateralFactorMantissa)"
];

// This is the "user manual" for all MToken contracts.
export const mTokenABI = [
  "function _setReserveFactor(uint newReserveFactorMantissa)"
];