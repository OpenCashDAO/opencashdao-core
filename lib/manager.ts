import { OpenCashDAOArtifacts } from '@opencashdao/contracts';
import type { NetworkProvider, AddressType } from 'cashscript';
import { ElectrumNetworkProvider, Contract } from 'cashscript';
import { ManagerConfig } from './interfaces/common';

const {
	Controller,
	ExecuteProposal,
	SubmitProposal,
	Voting,
} = OpenCashDAOArtifacts;

export class OpenCashDAOManager 
{ 
	public category: string;
	public voteThreshold: number;
	public voteWindow: number;
	public projectCategory: string;
	public projectLockingBytecode: string;
	public minCommitmentDeposit: number;

	public networkProvider: NetworkProvider;
	public options: { provider: NetworkProvider; addressType: AddressType };
	public contracts: Record<string, Contract>;

	constructor(config: ManagerConfig) 
	{
		this.category = config.category;
		this.voteThreshold = config.voteThreshold;
		this.voteWindow = config.voteWindow;
		this.projectCategory = config.projectCategory;
		this.projectLockingBytecode = config.projectLockingBytecode;
		this.minCommitmentDeposit = config.minCommitmentDeposit;

		if(config.networkProvider)
		{
			// Use the provided network provider for BCH network operations if one is provided.
			this.networkProvider = config.networkProvider;
		}
		else
		{
			// Create a new ElectrumNetworkProvider for BCH network operations.
			this.networkProvider = new ElectrumNetworkProvider('mainnet');
		}

		// Options for contract construction, specifying the network provider and address type.
		this.options = { provider: this.networkProvider, addressType: 'p2sh32' as AddressType };

		this.contracts = this.constructContracts({
			category: this.category,
			voteThreshold: this.voteThreshold,
			voteWindow: this.voteWindow,
			projectCategory: this.projectCategory,
			projectLockingBytecode: this.projectLockingBytecode,
			minCommitmentDeposit: this.minCommitmentDeposit,
		});
	}
	
	/**
	 * Constructs a set of contracts for the OpenCashDAO system.
	 *
	 * @param {Object} params - The parameters for constructing the contracts.
	 * @param {string} params.category - The category of the DAO.
	 * @param {number} params.voteThreshold - The vote threshold for the DAO.
	 * @param {number} params.voteWindow - The vote window for the DAO.
	 * @param {string} params.projectCategory - The category of the project.
	 * @param {string} params.projectLockingBytecode - The locking bytecode of the project.
	 * @param {number} params.minCommitmentDeposit - The minimum commitment deposit for the DAO.
	 * @returns {Record<string, Contract>} An object containing the constructed contracts.
	 */
	constructContracts = (params: {
		category: string;
		voteThreshold: number;
		voteWindow: number;
		projectCategory: string;
		projectLockingBytecode: string;
		minCommitmentDeposit: number;
	}): Record<string, Contract> =>
	{
		console.log(params);
		// Return an object containing all the constructed contracts.
		return {
			Controller: new Contract(Controller, [params.category], this.options),
			ExecuteProposal: new Contract(ExecuteProposal, [BigInt(params.voteThreshold), BigInt(params.voteWindow), params.projectCategory, params.projectLockingBytecode], this.options),
			SubmitProposal: new Contract(SubmitProposal, [BigInt(params.minCommitmentDeposit)], this.options),
			Voting: new Contract(Voting, [], this.options),
		};
	};

}

export const createManager = function(config: ManagerConfig): OpenCashDAOManager 
{
	return new OpenCashDAOManager(config);
};