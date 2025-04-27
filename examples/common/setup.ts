// import { createManager } from "@opencashdao/core";
import { createManager } from "../../lib/manager.js";


export const daoCategory = '98570f00cad2991de0ab25f14ffae29a0c61da97ba6d466acbc8476e2e612ada';
export const projectCategory = '98570f00cad2991de0ab25f14ffae29a0c61da97ba6d466acbc8476e2e612ada';
export const projectLockingBytecode = '';
export const voteThreshold = 1;
export const voteWindow = 10;
export const minCommitmentDeposit = 1000;


const opencashdaoManager = createManager({
	category: daoCategory,
	voteThreshold,
	voteWindow,
	projectCategory,
	projectLockingBytecode,
	minCommitmentDeposit
});

export { opencashdaoManager };
