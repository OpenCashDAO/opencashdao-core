import type { NetworkProvider } from 'cashscript';

export type ManagerConfig = 
{
	/** network provider to use for BCH network operations. */
	networkProvider?: NetworkProvider;

	/** category of the dao. */
	category: string;

	/** vote threshold. */
	voteThreshold: number;

	/** vote window. */
	voteWindow: number;

	/** project category. */
	projectCategory: string;

	/** project locking bytecode. */
	projectLockingBytecode: string;

	/** minimum commitment deposit for the auction. */
	minCommitmentDeposit: number;
};