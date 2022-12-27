const {ethers, getNamedAccounts} = require("hardhat");
const {log} = require("console");

async function main() {
    const { deployer } = await getNamedAccounts();
    const fundMe = await ethers.getContract("FundMe", deployer);
    log("Withdrawing Contract...");
    const transactionResponse = await fundMe.withdraw();
    await transactionResponse.wait(1);
    log("Got it back");
}


main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err)
        process.exit(1)
    });