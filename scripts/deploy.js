require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const timelockDelay = 2;
  const signer = hre.ethers.provider.getSigner();
  const signerAddress = await signer.getAddress();

  // MoeErc20Wrapped
  const MoeErc20Wrapped = await hre.ethers.getContractFactory('MoeErc20Wrapped');
  const moeTokenWrapped = await MoeErc20Wrapped.deploy(process.env.TOKEN_ADDRESS);

  await moeTokenWrapped.deployed();

  console.log(`Wrapped MOE token contract has been deployed : ${moeTokenWrapped.address}`);

  // MoeTimelock
  const MoeTimelock = await hre.ethers.getContractFactory('MoeTimelock');
  const moeTimelock = await MoeTimelock.deploy(timelockDelay, [hre.ethers.constants.AddressZero], [hre.ethers.constants.AddressZero], signerAddress);

  await moeTimelock.deployed();

  console.log(`MOE timelock contract has been deployed : ${moeTimelock.address}`);

  // MoeGovernor
  const MoeGovernor = await hre.ethers.getContractFactory('MoeGovernor');
  const moeGovernor = await MoeGovernor.deploy(moeTokenWrapped.address, moeTimelock.address);

  await moeGovernor.deployed();

  console.log(`MOE Governor contract has been deployed : ${moeGovernor.address}`);

  // setup roles
  const timelockExecuterRole = await moeTimelock.EXECUTOR_ROLE();
  const timelockProposerRole = await moeTimelock.PROPOSER_ROLE();
  const timelockCancellerRole = await moeTimelock.CANCELLER_ROLE();

  console.log(`Executor role: ${timelockExecuterRole}`);
  console.log(`Proposer role: ${timelockProposerRole}`);
  console.log(`Cenceller role: ${timelockCancellerRole}`);

  await moeTimelock.grantRole(timelockExecuterRole, moeGovernor.address);
  await moeTimelock.grantRole(timelockProposerRole, moeGovernor.address);
  await moeTimelock.grantRole(timelockCancellerRole, moeGovernor.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });