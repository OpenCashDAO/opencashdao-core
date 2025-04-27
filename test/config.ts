import {
  MockNetworkProvider,
  Contract,
  SignatureTemplate,
  randomUtxo,
  randomNFT,
  AddressType
} from 'cashscript';
import {
  hexToBin,
  binToHex,
  cashAddressToLockingBytecode
} from '@bitauth/libauth';
import { intToBytesToHex, hexToInt } from '../lib/util';
import {
	deriveHdPrivateNodeFromSeed,
	deriveHdPath,
	secp256k1,
	encodeCashAddress,
	deriveSeedFromBip39Mnemonic,
} from '@bitauth/libauth';
import { OpenCashDAOArtifacts } from '@opencashdao/contracts';

const {
	Controller,
	ExecuteProposal,
	SubmitProposal,
	Voting,
} = OpenCashDAOArtifacts;

const seed = deriveSeedFromBip39Mnemonic('');
const rootNode = deriveHdPrivateNodeFromSeed(seed, { assumeValidity: true, throwErrors: true });
const baseDerivationPath = "m/44'/145'/0'/0";

// Derive Alice's private key, public key, public key hash and address
const aliceNode = deriveHdPath(rootNode, `${baseDerivationPath}/0`);
if(typeof aliceNode === 'string') throw new Error();
export const alicePub = secp256k1.derivePublicKeyCompressed(aliceNode.privateKey);
export const alicePriv = aliceNode.privateKey;
// @ts-ignore
export const alicePkh = hash160(alicePub);
export const aliceAddress = encodeCashAddress({ prefix: 'bitcoincash', type: 'p2pkh', payload: alicePkh, throwErrors: true }).address;
export const aliceTokenAddress = encodeCashAddress({ prefix: 'bitcoincash', type: 'p2pkhWithTokens', payload: alicePkh, throwErrors: true }).address;
export const aliceTemplate = new SignatureTemplate(alicePriv);

// Steps:
// - Load contacts
// - Initiate provider
// - Compile contracts
// - Add UTXOs to the provider
// - Create authorizedThreadNFT

// // Upgradable Project contract
// const ProjectCoordinator = compileFile(new URL('../../upgradable/Coordinator.cash', import.meta.url));
// const ContractA = compileFile(new URL('../../upgradable/ContractA.cash', import.meta.url));
// const ContractNew = compileFile(new URL('../../upgradable/ContractNew.cash', import.meta.url));


export const minVoteThreshold = BigInt(1);
export const minWait = BigInt(10);
export const minCommitmentDeposit = BigInt(1000);
export const commitmentLengthForProposalType = {
  ADD: 80,
  REMOVE: 12,
  REPLACE: 72
}

export const daoCategory = '98570f00cad2991de0ab25f14ffae29a0c61da97ba6d466acbc8476e2e612ada';
export const projectCategory = '98570f00cad2991de0ab25f14ffae29a0c61da97ba6d466acbc8476e2e612ada';
export const projectLockingBytecode = '';
export const voteThreshold = 1;
export const voteWindow = 10;

export const provider = new MockNetworkProvider();
export const addressType = 'p2sh32' as AddressType;
export const options = { provider, addressType }



const ControllerContract = new Contract(Controller, [daoCategory], options)
const ExecuteProposalContract = new Contract(ExecuteProposal, [voteThreshold, voteWindow, projectCategory, projectLockingBytecode], options)
const SubmitProposalContract = new Contract(SubmitProposal, [minCommitmentDeposit], options)
const VotingContract = new Contract(Voting, [], options)


// export const DAOControllerNFT = randomNFT({nft: {commitment: intToBytesToHex({value: 0, length: 4}), capability: 'minting'}});
// export const ProjectCoordinatorNFT = randomNFT({nft: {commitment: '', capability: 'minting'}});

// export const daoCategory = DAOControllerNFT.category
// export const reverseDaoTokenCategory = binToHex(hexToBin(daoCategory).reverse())
// export const projectCategory = ProjectCoordinatorNFT.category
// export const reverseProjectCategory = binToHex(hexToBin(projectCategory).reverse())

// export const proposalId = intToBytesToHex({value: hexToInt(DAOControllerNFT.nft?.commitment || '') + 1, length: 4});
// export const threadCount = intToBytesToHex({value: 1, length: 2});

// // @ts-ignore
// export const aliceAddressLockingBytecode = cashAddressToLockingBytecode(aliceAddress).bytecode;
// provider.addUtxo(aliceAddress, randomUtxo());
// provider.addUtxo(aliceAddress, randomUtxo());
// provider.addUtxo(aliceAddress, randomUtxo());
// // Tokens with the power to Vote on proposals
// provider.addUtxo(aliceTokenAddress, {... randomUtxo(), token: { category: daoCategory, amount: 1000000n }});


// // DAO
// // @ts-ignore
// export const DAOControllerContract = new Contract(Controller, [reverseDaoTokenCategory], options);
// export const DAOControllerLockingBytecode = cashAddressToLockingBytecode(DAOControllerContract.address)
// // Upgradable Project
// // @ts-ignore
// export const ProjectCoordinatorContract = new Contract(ProjectCoordinator, [reverseProjectCategory, DAOControllerLockingBytecode.bytecode], options);
// // @ts-ignore
// export const projectCoordinatorLockingBytecode = cashAddressToLockingBytecode(ProjectCoordinatorContract.address).bytecode

// // DAO Contracts
// // @ts-ignore
// export const ExecuteProposalContract = new Contract(ExecuteProposal, [minVoteThreshold, minWait, reverseProjectCategory, projectCoordinatorLockingBytecode], options);
// // @ts-ignore
// export const executeProposalContractLockingBytecode = binToHex(cashAddressToLockingBytecode(ExecuteProposalContract.address).bytecode);
// provider.addUtxo(ExecuteProposalContract.address, randomUtxo());

// // @ts-ignore
// export const SubmitProposalContract = new Contract(SubmitProposal, [minCommitmentDeposit], options);
// // @ts-ignore
// export const submitProposalContractLockingBytecode = binToHex(cashAddressToLockingBytecode(SubmitProposalContract.address).bytecode);
// provider.addUtxo(SubmitProposalContract.address, randomUtxo());

// // @ts-ignore
// export const VotingContract = new Contract(Voting, [], options);
// // @ts-ignore
// export const votingContractLockingBytecode = binToHex(cashAddressToLockingBytecode(VotingContract.address).bytecode);
// provider.addUtxo(VotingContract.address, randomUtxo());

// // Upgradable Project Contracts
// // @ts-ignore
// export const ContractAContract = new Contract(ContractA, [], options);
// // @ts-ignore
// export const contractALockingBytecode = binToHex(cashAddressToLockingBytecode(ContractAContract.address).bytecode);
// provider.addUtxo(ContractAContract.address, randomUtxo());

// // @ts-ignore
// export const ContractNewContract = new Contract(ContractNew, [], options);
// // @ts-ignore
// export const contractNewLockingBytecode = binToHex(cashAddressToLockingBytecode(ContractNewContract.address).bytecode);
// provider.addUtxo(ContractNewContract.address, randomUtxo());