require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const MoeErc20Wrapped = await hre.ethers.getContractFactory('MoeErc20Wrapped');
  const moeTokenWrapped = await MoeErc20Wrapped.deploy();

  await moeTokenWrapped.deployed();

  console.log(`Wrapped MOE token contract has been deployed : ${moeTokenWrapped.address}`);

  const MoeGovernor = await hre.ethers.getContractFactory('MoeGovernor');
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