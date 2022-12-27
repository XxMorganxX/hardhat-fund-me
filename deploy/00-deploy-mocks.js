const { developmentChains, DECIMALS, INITIAL_ANSWER } = require('../helper-hardhat-config');
const { network } = require("hardhat");


async function deployMocks(hre) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)){
        log("--------------------------------------------------------");
        log("Locally Hosted Network")
        const mockPriceFeed = await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        });
        log("Mocks Deployed");
        log("--------------------------------------------------------!");
    }

}

module.exports = deployMocks;
module.exports.tags = ["all", "mocks"];

