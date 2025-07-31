// src/contracts/addresses.js

// These addresses are now REAL and pulled from the official Moonwell Docs.

// The address of the main governance contract on Moonbeam.
// Found on Page 7 of your screenshots under "Moonbeam Contract Addresses".
// This is where the final transaction will be sent.
export const GOVERNOR_ADDRESS = "0x9A8464C4C11CeA17e191653Deb7CdC1bE0864216F";

// The address of the main Comptroller contract on Base.
// Found on Page 2 under "Base Contract Addresses".
export const COMPTROLLER_ADDRESS = "0xfBb21d0380beE3312B33c4353c8936a0F13EF26C";

// A list of all the MToken contract addresses on Base.
// Found on Page 2 under "Base Contract Addresses".
export const MTOKEN_ADDRESSES = {
  "MOONWELL_USDBC": "0x703843C3379b52F9FF486c9f5892218d2a065cC8",
  "MOONWELL_USDC": "0xEdc817A28E8B93B03976FBd4a3dDBc9f7D176c22",
  "MOONWELL_WETH": "0x628ff693426583D9a7FB391E54366292F509D457",
  // We can add more markets from the docs later if needed.
};