require('dotenv').config();
const hre = require('hardhat');

module.exports = [
  process.env.TIMELOCK_DELAY,
  [hre.ethers.constants.AddressZero],
  [hre.ethers.constants.AddressZero],
  ""
]