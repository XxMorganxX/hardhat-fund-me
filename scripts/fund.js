const {ethers, getNamedAccounts} = require("hardhat");
const {log} = require("console");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    log("Funding Contract...");
    const transactionResponse = await fundMe.fund({ value: ethers.utils.parseEther("0.1") });
    await transactionResponse.wait(1);
    log("Funded!");
}


main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    });