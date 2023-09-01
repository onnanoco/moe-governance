require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const MoeErc20Wrapped = await hre.ethers.getContractFactory('MoeErc20Wrapped');
  const moeTokenWrapped = await MoeErc20Wrapped.deploy(process.env.TOKEN_ADDRESS);

  await moeTokenWrapped.deployed();

  console.log(`Wrapped MOE token contract has been deployed : ${moeTokenWrapped.address}`);

  const MoeTimelock = await hre.ethers.getContractFactory('MoeTimelock');
  const moeTimelock = await MoeTimelock.deploy(moeTokenWrapped.address);

  await moeTimelock.deployed();

  console.log(`MOE timelock contract has been deployed : ${moeTimelock.address}`);

  const MoeGovernor = await hre.ethers.getContractFactory('MoeGovernor', moeTimelock.address);
  const moeGovernor = await MoeGovernor.deploy();

  await moeGovernor.deployed();

  console.log(`MOE Governor contract has been deployed : ${moeGovernor.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });