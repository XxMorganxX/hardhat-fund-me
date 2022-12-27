const { networkConfig, developmentChains } = require('../helper-hardhat-config');
const { network } = require("hardhat");
const { verify } = require("../utils/verify");
require("dotenv").config();

async function deployFunction(hre)  {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    const chainId = network.config.chainId;

    let priceFeedAddress
    if (developmentChains.includes(network.name)){
        ethUsdAggregator = await deployments.get("MockV3Aggregator");
        priceFeedAddress = ethUsdAggregator.address;
    }
    else{
        priceFeedAddress = networkConfig[chainId]["EthUsdFeedPrice"];
    }

    log("--------------------------------------------------------");
    log(`priceFeedAddress: ${priceFeedAddress} `);
    // When going for localhost or hardhat network we want to use a mock
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [priceFeedAddress], //priceFeed Address
        log: true
    })
    log("--------------------------------------------------------!");
    log("--------------------------------------------------------");
    if(!developmentChains.includes(network.name) && process.env.COINMARKETCAP_API_KEY){
        await verify(fundMe.address, [priceFeedAddress]);
    }
    log("--------------------------------------------------------!");
}

module.exports = deployFunction;
module.exports.tags = ["all", "fundme"]