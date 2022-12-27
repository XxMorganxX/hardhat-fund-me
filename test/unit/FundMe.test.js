const { deployments, ethers, getNamedAccounts, waffle } = require("hardhat");  
const {assert, expect} = require("chai");
const {log} = require("console");
const { getDefaultProvider, getSigners } = require("ethers");
const { developmentChains } = require("../../helper-hardhat-config");


!developmentChains.includes(network.name) 
? describe.skip
:describe("Fund Me", async () => {
    let fundMe;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1");
    
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
    });

    describe("Constructor", async () => {
        it("Sets the aggregator addresses correctly", async () => {
            const response = await fundMe.s_priceFeed();
            assert.equal(response, mockV3Aggregator.address)
        })
        it("Contractor owner is deployer", async () => {
            const response = await fundMe.i_owner();
            assert.equal(response, deployer);
        });
    });

    describe("Funding", async () => {
        it("Must meet minimum ETH funding requirement", async () =>{
            await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
        });

        it("Updated the amount funded data structure", async () =>{
            await fundMe.fund({value: sendValue});
            const response = await fundMe.s_addressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString());
        });

        it("Adds funder to array of funders", async () =>{
            await fundMe.fund({value: sendValue})
            const funder = await fundMe.s_funders(0)
            assert.equal(funder, deployer);
        });
    });

    describe("Withdraw", async () =>{
        let contractValue;
        beforeEach(async () =>{
            await fundMe.fund({value: sendValue});
            contractValue = await fundMe.provider.getBalance(fundMe.address);
        });
        
        it("Has ETH stored in contract", async () =>{
            assert.equal(contractValue.toString(), ethers.utils.parseEther("1").toString());
        });
        it("Can withdraw to deployer address", async () =>{
            const startingContractBal = await fundMe.provider.getBalance(fundMe.address);;
            const startingDeployerBal = await fundMe.provider.getBalance(deployer);
            
            const transactionResponse = await fundMe.withdraw();
            const transactionReceipt = await transactionResponse.wait(1);
            
            const {gasUsed, effectiveGasPrice} = transactionReceipt;
            const gasCost = effectiveGasPrice.mul(gasUsed);
            
            const endingDeployerBal = await fundMe.provider.getBalance(deployer);
            assert.equal(endingDeployerBal.add(gasCost).toString(), startingDeployerBal.add(startingContractBal))
        });

        it("Only allows owner to withdraw", async () => {
            const accounts = await ethers.getSigners();
            const attacker = accounts[1];
            const attackerConnected = await fundMe.connect(attacker);
            await expect(attackerConnected.withdraw()).to.be.reverted;

        });

    });

});