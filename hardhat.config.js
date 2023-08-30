require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    ethereum: {
      url: process.env.ETHEREUM_RPC_ENDPOINT,
      accounts: [process.env.ETHEREUM_PRIVATE_KEY],
      chainId: 1,
      gas: "auto",
      gasPrice: "auto"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_ENDPOINT,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      gas: "auto",
      gasPrice: "auto"
    }
  },
  etherscan: {
    apiKey: process.env.ETHERESCAN_KEY
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};