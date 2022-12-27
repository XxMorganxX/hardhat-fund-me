const { getNamedAccounts, ethers, network} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat-config");
const {assert} = require("chai");

// const variable = true
// const outcome = variable ? "true" : "false"
// equivelent to...
// let outcome
// if (variable){outcome = "true"} else {outcome = "false"}


developmentChains.includes(network.name)
? describe.skip
:describe("Fund Me", () => {
    let fundMe;
    let deployer;
    const sendValue = ethers.utils.parseEther('0.1');
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
    });

    it("Allows people to fund and withdraw", async () => {
        await fundMe.fund({value: sendValue});
        await fundMe.withdraw();
        const endingBalance = await fundMe.provider.getBalance(fundMe.address)
        assert.equal(endingBalance.toString(), "0")
    });
});