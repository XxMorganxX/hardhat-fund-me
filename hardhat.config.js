require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("hardhat-deploy");


/** @type import('hardhat/config').HardhatUserConfig */
const test_URL = process.env.GOERLI_URL || "no url";
const test_PK = process.env.TEST_PRIVATE_KEY || "no key";
const etherscan_API = process.env.ETHERSCAN_API_KEY || "no etherscan api";
const coinmarket_API = process.env.COINMARKETCAP_API_KEY || "no coinmarketcap api";


module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: test_URL,
      accounts: [test_PK],
      chainId: 5,
    },
    localhost: {
      url: "HTTP://127.0.0.1:7545",
      chainId: 1337
    }
  },

  solidity: {
    compilers: [
      {version: "0.8.8"},
      {version: "0.6.6"}
    ],
  },
  etherscan: {
    apiKey: etherscan_API
  },

  gasReporter:{
    enabled: true,
    outputFile: "gasReports/gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: coinmarket_API,
    token: "ETH"
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    user: {
      default: 1
    }
  }
};
