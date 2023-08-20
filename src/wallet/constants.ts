export const BITKIT_WALLET_SEED_HASH_PREFIX = Buffer.from(
	'@Bitkit/wallet-uuid'
);

//How many addresses to generate when more are needed.
export const GENERATE_ADDRESS_AMOUNT = 5;

// TODO: Add this as a settings for users to adjust when needed.
export const GAP_LIMIT = 20;

// TODO: remove chunk logic and move it to rn-electrum library
export const CHUNK_LIMIT = 15;

//How much of the users funds we allow to be used for Lightning.
export const SPENDING_LIMIT_RATIO = 0.8;

export const TRANSACTION_DEFAULTS = {
	recommendedBaseFee: 256, // Total recommended tx base fee in sats
	dustLimit: 546 // Minimum value in sats for an output. Outputs below the dust limit may not be processed because the fees required to include them in a block would be greater than the value of the transaction itself.
};

export const BLOCKTANK_HOST = 'https://api.stag.blocktank.to';
