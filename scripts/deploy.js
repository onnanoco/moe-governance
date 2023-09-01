require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const timelockDelay = 2;

  const MoeErc20Wrapped = await hre.ethers.getContractFactory('MoeErc20Wrapped');
  const moeTokenWrapped = await MoeErc20Wrapped.deploy(process.env.TOKEN_ADDRESS);

  await moeTokenWrapped.deployed();

  console.log(`Wrapped MOE token contract has been deployed : ${moeTokenWrapped.address}`);

  const MoeTimelock = await hre.ethers.getContractFactory('MoeTimelock');
  const moeTimelock = await MoeTimelock.deploy(timelockDelay, hre.ethers.constants.AddressZero, hre.ethers.constants.AddressZero, hre.ethers.constants.AddressZero);

  await moeTimelock.deployed();

  console.log(`MOE timelock contract has been deployed : ${moeTimelock.address}`);

  const MoeGovernor = await hre.ethers.getContractFactory('MoeGovernor');
  const moeGovernor = await MoeGovernor.deploy(moeTokenWrapped.addres, moeTimelock.address);

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

  // Verify
  await run("verify:verify", {
    address: moeTimelock.address,
    constructorArguments: [process.env.TOKEN_ADDRESS],
  });


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });